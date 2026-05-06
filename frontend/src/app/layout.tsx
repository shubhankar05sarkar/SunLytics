import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SunLytics - Professional ML Dashboard",
  description: "Solar Power Prediction using Machine Learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Universal Background Image */}
          <div className="fixed inset-0 z-[-1] bg-[url('/dashboard.jpg')] bg-cover bg-center bg-no-repeat pointer-events-none" />
          <div className="fixed inset-0 z-[-1] bg-slate-50/20 dark:bg-slate-950/40 pointer-events-none" />
          
          <div className="flex min-h-screen relative z-0">
            <Sidebar />
            <main className="flex-1 w-full pb-20 lg:pb-0 overflow-x-hidden relative">
              {children}
            </main>
            <MobileNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
