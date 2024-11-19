"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export function ThemeLogo() {
  const { theme } = useTheme();
  
  // Use the appropriate logo based on theme
  const logoSrc = theme === 'dark' ? '/logo-dark.png' : '/logo-dark.png';
  
  return (
    <Link href="/" className="inline-block">
      <Image
        src={logoSrc}
        alt="HelpDeck"
        width={120}
        height={30}
        className="h-8 w-auto"
        priority
      />
    </Link>
  );
}