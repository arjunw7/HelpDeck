"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeLogo } from "@/components/theme-logo";

const footerLinks = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "AI Assistant", href: "/ai" },
    { label: "Demo", href: "/demo" },
  ],
  company: [
    { label: "Terms of Use", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Contact", href: "mailto:support@helpdeck.app" },
    { label: "Status", href: "https://status.helpdeck.app" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="px-[5%] py-16">
        <div className="grid gap-8 sm:grid-cols-4">
          {/* Logo and Description */}
          <div className="sm:col-span-2">
            <ThemeLogo />
            <p className="mt-4 text-sm text-muted-foreground">
              Create beautiful help centers, change logs, and product roadmaps for your SaaS.
            </p>
            <div className="mt-6 space-x-4">
              <a
                href="https://twitter.com/helpdeckapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                𝕏
              </a>
              <a
                href="https://github.com/helpdeckapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:col-span-2">
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} HelpDeck. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}