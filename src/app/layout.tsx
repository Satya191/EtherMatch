'use client'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Web3Provider } from "@/components/Web3Provider";
import Link from 'next/link';
import "./globals.css";

import { WelcomeToLens } from "@/components/WelcomeToLens";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className}>
      <Web3Provider>
      <header className="bg-slate-200 py-4 px-8 flex justify-between items-center" style={{backgroundColor: 'black'}}>
        <NavigationMenu>
  <NavigationMenuList style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
  <div style={{ display: 'flex', gap: '10px' }}>
  <NavigationMenuItem>
    <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              EtherMatch
            </NavigationMenuLink>
          </Link>
    </NavigationMenuItem>
    <NavigationMenuItem>
    <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
    </NavigationMenuItem>
    <NavigationMenuItem>
    <Link href="/feed" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Feed
            </NavigationMenuLink>
          </Link>
    </NavigationMenuItem>
    <NavigationMenuItem>
    <Link href="/matches" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Matches
            </NavigationMenuLink>
          </Link>
    </NavigationMenuItem>
    <NavigationMenuItem>
    <Link href="/repfeed" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Reputable Users Feed
            </NavigationMenuLink>
          </Link>
    </NavigationMenuItem>

    </div>


    </NavigationMenuList>
</NavigationMenu>
<WelcomeToLens/>
        </header>
        {children}
      </Web3Provider>
      </body>
    </html>
  );
}
