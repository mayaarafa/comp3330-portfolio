import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MyNavBar from "@/components/MyNavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Maya Arafa Portfolio",
  description: "Portfolio website of Maya Arafa.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`flex flex-col items-center mx-4 ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MyNavBar />
        {children}
      </body>
    </html>
  );
}
