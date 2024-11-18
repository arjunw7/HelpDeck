import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    // Get settings from API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/kb/settings`);
    const data = await response.json();
    
    const settings = data.settings;
    const seoSettings = data.seoSettings;

    return {
      title: seoSettings?.metaTitle || settings?.general?.title,
      description: seoSettings?.metaDescription || settings?.general?.description,
      openGraph: {
        title: seoSettings?.metaTitle || settings?.general?.title,
        description: seoSettings?.metaDescription || settings?.general?.description,
        images: settings?.general?.socialImage ? [settings.general.socialImage] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: seoSettings?.metaTitle || settings?.general?.title,
        description: seoSettings?.metaDescription || settings?.general?.description,
        images: settings?.general?.socialImage ? [settings.general.socialImage] : [],
      },
      icons: settings?.general?.favicon ? {
        icon: settings.general.favicon,
        shortcut: settings.general.favicon,
      } : undefined,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {};
  }
}