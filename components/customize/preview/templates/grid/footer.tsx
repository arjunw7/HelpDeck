import { KnowledgeBaseSettings } from "@/stores/customize";

interface FooterProps {
  settings: KnowledgeBaseSettings;
}

export function Footer({ settings }: FooterProps) {
  // Early return if no footer items
  if (!settings?.navigation?.footerItems?.length) {
    return null;
  }

  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto py-8 px-6">
        <nav className="flex flex-wrap items-center justify-center gap-6">
          {settings.navigation.footerItems.map((item) => (
            <a
              key={item.id}
              href={item.url}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              style={{ 
                fontFamily: settings.theme.secondaryFont || settings.theme.fontFamily || undefined 
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}