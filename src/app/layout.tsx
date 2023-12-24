import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./Header";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import Footer from "./Footer";

const UserSignInBox = dynamic(() => import("@/components/molecules/UserSignInBox/index"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Available Cars",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Header>
            <UserSignInBox />
          </Header>
          <div className="mt-4 md:mt-16">{children}</div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
