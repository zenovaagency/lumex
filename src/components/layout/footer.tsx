import Link from "next/link";
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Heart,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

const footerLinks = {
  shop: {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "New Arrivals", href: "/shop?sort=newest" },
      { label: "Best Sellers", href: "/shop?sort=popular" },
      { label: "Sale", href: "/shop?sort=sale" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Size Guide", href: "/size-guide" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-zinc-50 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tighter">
              {SITE_CONFIG.name}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {SITE_CONFIG.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Instagram, href: SITE_CONFIG.links.instagram },
                { icon: Twitter, href: SITE_CONFIG.links.twitter },
                { icon: Facebook, href: SITE_CONFIG.links.facebook },
                { icon: Youtube, href: "#" },
              ].map(({ icon: Icon, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background transition-colors hover:bg-accent"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
            reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Made with <Heart className="h-3 w-3 text-red-500" /> by LUXE
          </p>
        </div>
      </div>
    </footer>
  );
}
