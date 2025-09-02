import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import NoContextMenu from "@/components/NoContextMenu"

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
      </body>
    </html>
  )
}
