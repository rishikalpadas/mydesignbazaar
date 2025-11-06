import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "../context/AuthContext"
import NoContextMenu from "../components/NoContextMenu"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const inter = Inter({ subsets: ["latin"] })

// Force dynamic rendering for all pages to prevent SSR issues during build
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export const metadata = {
  title: "MyDesignBazaar",
  description: "",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>

        <NoContextMenu />
        <AuthProvider>{children}</AuthProvider>
        {/* <Footer/> */}
      </body>
    </html>
  )
}
