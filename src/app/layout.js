import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import NoContextMenu from "@/components/NoContextMenu"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MyDesignBazaar",
  description: "",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
       
        <NoContextMenu />
        <AuthProvider>{children}</AuthProvider>
        {/* <Footer/> */}
      </body>
    </html>
  )
}
