import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MyNavBar from "@/components/MyNavBar";
import { Toaster } from "sonner";
import { auth0 } from "@/lib/auth0";

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

export default async function RootLayout({ children }) {
  const session = await auth0.getSession();
  return (
    <html lang="en">
      <body
        className={`flex flex-col items-center mx-4 ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MyNavBar user={session ? session.user : null} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
