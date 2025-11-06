import { Inter } from "next/font/google"
import "./globals.css"
import NoContextMenu from "../components/NoContextMenu"

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NoContextMenu />
        {children}
      </body>
    </html>
  )
}
