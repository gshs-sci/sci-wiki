
import type { Metadata } from "next";
import { Inter,Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from './lib/registry'

import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ["latin"] });
const notoSans=Noto_Sans_KR({subsets:["latin"]})

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <html lang="kr" data-color-mode="light">
      <body className={notoSans.className}>
      <NextTopLoader showSpinner={false} color="#7d7d7d"/>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
    </>
  );
}
