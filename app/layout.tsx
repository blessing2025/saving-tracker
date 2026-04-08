import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Saving Tracker",
  description: "Track your personal savings goals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen`}>
        <main className="max-w-md mx-auto min-h-screen bg-white shadow-sm relative overflow-x-hidden">
          {children}
          <Navigation />
        </main>
      </body>
    </html>
  );
}