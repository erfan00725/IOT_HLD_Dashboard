import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-context";
import { DashboardStatusProvider } from "@/context/dashboard-status-context";
import { ReactQueryProvider } from "@/components/layout/react-query-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HomeLeave Dashboard",
  description:
    "Modern IoT leave-detection dashboard for reminders and device monitoring.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning prevents hydration mismatch when dark class
    // is applied client-side before React hydration completes
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ReactQueryProvider>
            <DashboardStatusProvider>{children}</DashboardStatusProvider>
          </ReactQueryProvider>
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
