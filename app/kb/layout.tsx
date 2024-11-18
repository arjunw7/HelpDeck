"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { KnowledgeBaseSettings } from "@/stores/customize";
import { ThemeProvider } from "@/components/theme-provider";
import Head from "next/head";
import Script from "next/script";
import { supabase } from "@/lib/supabase";

interface KnowledgeBaseLayoutProps {
  children: React.ReactNode;
}

export default function KnowledgeBaseLayout({ children }: KnowledgeBaseLayoutProps) {
  const [settings, setSettings] = useState<KnowledgeBaseSettings | null>(null);
  const [seoSettings, setSeoSettings] = useState<{
    metaTitle: string;
    metaDescription: string;
    googleAnalyticsId: string;
  } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/kb/settings");
        const data = await response.json();
        
        if (data.settings) {
          setSettings(data.settings);
        }

        // Fetch SEO settings
        if (data.organizationId) {
          const { data: org } = await supabase
            .from("organizations")
            .select("seo_settings")
            .eq("id", data.organizationId)
            .single();

          if (org?.seo_settings) {
            setSeoSettings(org.seo_settings);
          }
        }
      } catch (error) {
        console.error('Error loading knowledge base settings:', error);
      }
    }

    loadSettings();
  }, [pathname]);

  if (!settings) {
    return null;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* SEO Meta Tags */}
      <Head>
        {/* Title and Description */}
        <title>{seoSettings?.metaTitle || settings.general.title}</title>
        <meta 
          name="description" 
          content={seoSettings?.metaDescription || settings.general.description} 
        />

        {/* Favicon */}
        {settings.general.favicon && (
          <>
            <link 
              rel="icon" 
              type="image/x-icon" 
              href={settings.general.favicon}
            />
            <link 
              rel="shortcut icon" 
              type="image/x-icon" 
              href={settings.general.favicon}
            />
          </>
        )}

        {/* Open Graph / Social Media */}
        {settings.general.socialImage && (
          <>
            <meta 
              property="og:image" 
              content={settings.general.socialImage} 
            />
            <meta 
              name="twitter:image" 
              content={settings.general.socialImage}
            />
          </>
        )}
        <meta property="og:title" content={seoSettings?.metaTitle || settings.general.title} />
        <meta 
          property="og:description" 
          content={seoSettings?.metaDescription || settings.general.description}
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta 
          name="twitter:title" 
          content={seoSettings?.metaTitle || settings.general.title}
        />
        <meta 
          name="twitter:description" 
          content={seoSettings?.metaDescription || settings.general.description}
        />
      </Head>

      {/* Google Analytics */}
      {seoSettings?.googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${seoSettings.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${seoSettings.googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      <div 
        style={{ 
          backgroundColor: settings.theme.backgroundColor,
          color: settings.theme.textColor,
          fontFamily: settings.theme.fontFamily || undefined,
        }}
      >
        {children}
      </div>
    </ThemeProvider>
  );
}