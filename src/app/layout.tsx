import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import clsx from "clsx";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Career Roadmap",
  description: "Your Personalized Roadmap to a Successful Tech Career",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(
          dmSans.className,
          "antialiased bg-[#000]" 
        )}
      >
        {children}
      </body>
    </html>
  );
}
