"use client"

import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from './lib/registry'
import NextTopLoader from 'nextjs-toploader';
import { useState,createContext } from "react";
import { ThemeContext } from "./themeContext";

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  display: 'swap'
})

const getLocalStorageTheme = () => {
  if (typeof window !== 'undefined') {
    let res = localStorage.getItem("sci-config")
    try{
      return JSON.parse(res!).theme
    }catch(e) {
      return "light"
    }
  }
  return "light"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState(getLocalStorageTheme);
 
  const toggleTheme = () => {

    localStorage.setItem("sci-config",JSON.stringify({theme:theme === 'light' ? 'dark' : 'light'}))

    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      <html lang="kr" data-color-mode={theme}>
        <body className={notoSans.className}>
          <NextTopLoader showSpinner={false} color="#7d7d7d" />
          <StyledComponentsRegistry>
            <ThemeContext.Provider value={{ toggleTheme }}>
                {children}
            </ThemeContext.Provider>
          </StyledComponentsRegistry>
        </body>
      </html>
    </>
  );
}
