import { NextResponse } from "next/server"

// In-memory cache (will persist during server runtime)
let countriesCache = null
let cacheTimestamp = null
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export async function GET() {
  try {
    // Check if cache is valid
    if (countriesCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
      console.log("Returning cached countries data")
      return NextResponse.json({
        success: true,
        data: countriesCache,
        source: "cache"
      })
    }

    // Fetch from REST Countries API (free, no API key required)
    console.log("Fetching countries from REST Countries API...")
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,cca3,idd,flag")

    if (!response.ok) {
      throw new Error("Failed to fetch countries")
    }

    const countriesData = await response.json()

    // Transform data to our format
    const transformedCountries = countriesData
      .map((country) => ({
        code: country.cca2, // 2-letter code (e.g., "IN", "US")
        code3: country.cca3, // 3-letter code (e.g., "IND", "USA")
        name: country.name.common,
        officialName: country.name.official,
        flag: country.flag, // Emoji flag
      }))
      .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically

    // Cache the data
    countriesCache = transformedCountries
    cacheTimestamp = Date.now()

    console.log(`Cached ${transformedCountries.length} countries`)

    return NextResponse.json({
      success: true,
      data: transformedCountries,
      source: "api",
      cached: true
    })
  } catch (error) {
    console.error("Error fetching countries:", error)

    // Return fallback data if API fails
    const fallbackCountries = [
      { code: "IN", code3: "IND", name: "India", officialName: "Republic of India", flag: "🇮🇳" },
      { code: "US", code3: "USA", name: "United States", officialName: "United States of America", flag: "🇺🇸" },
      { code: "GB", code3: "GBR", name: "United Kingdom", officialName: "United Kingdom of Great Britain and Northern Ireland", flag: "🇬🇧" },
      { code: "CA", code3: "CAN", name: "Canada", officialName: "Canada", flag: "🇨🇦" },
      { code: "AU", code3: "AUS", name: "Australia", officialName: "Commonwealth of Australia", flag: "🇦🇺" },
    ]

    return NextResponse.json({
      success: true,
      data: fallbackCountries,
      source: "fallback",
      error: "Using fallback data due to API error"
    })
  }
}
