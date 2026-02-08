import Toaster from "@rahoot/web/components/Toaster"
import { SocketProvider } from "@rahoot/web/contexts/socketProvider"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { PropsWithChildren } from "react"
import "./globals.css"
import {I18nProvider} from "@rahoot/web/contexts/i18nProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Rahoot !",
  icons: "/icon.svg",
}

const RootLayout = ({ children }: PropsWithChildren) => (
  <html lang="en" suppressHydrationWarning={true} data-lt-installed="true">
    <body className={`${montserrat.variable} bg-secondary antialiased`}>
      <SocketProvider>
        <I18nProvider>
          <main className="text-base-[8px] flex flex-col">{children}</main>
        </I18nProvider>
        <Toaster />
      </SocketProvider>
    </body>
  </html>
)

export default RootLayout
