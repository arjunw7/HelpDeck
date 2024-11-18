import { useEffect, useState } from "react";
import { KnowledgeBaseSettings } from "@/stores/customize";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, FileText, Bell, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SubscribeModal } from "@/components/knowledge-base/shared/subscribe-modal";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

interface HeroProps {
  settings: KnowledgeBaseSettings;
  organizationName?: string;
  onSearch?: (query: string) => void;
  isChangeLog?: boolean;
  isPreview?: boolean;
  activeDevice?: string;
}

export function Hero({ settings, onSearch, organizationName, isChangeLog, isPreview, activeDevice }: HeroProps) {
  const router = useRouter();
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const getTextColor = (bgColor: string) => {
    const rgb = hexToRgb(bgColor);
    if (!rgb) return 'white';
    const luminance = getLuminance(rgb);
    return luminance < 0.5 ? 'white' : 'black';
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getLuminance = ({ r, g, b }: { r: number, g: number, b: number }) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getSearchBarWidth = () => {
    switch (settings.content.searchBarLength) {
      case "short":
        return "max-w-md";
      case "long":
        return "max-w-3xl";
      default:
        return "max-w-2xl";
    }
  };

  const getSearchBarAlignment = () => {
    switch (settings.content.searchBarAlignment) {
      case "left":
        return "mr-auto text-left";
      case "right":
        return "ml-auto text-right";
      default:
        return "mx-auto text-center";
    }
  };

  const textColor = getTextColor(settings.theme.accentColor);

  return (
    <div 
      className="relative"
      style={{ 
        backgroundColor: settings.theme.headerBackground,
        color: textColor,
        fontFamily: settings.theme.primaryFont || undefined,
      }}
    >
      {settings.general.headerImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{ 
            backgroundImage: `url(${settings.general.headerImage})`,
          }}
        />
      )}
      <div className="relative">
        <header className="px-6 py-4">
          <div className="mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push(`/kb`)}>
              {settings.general.logo ? (
                <Image
                  src={settings.general.logo}
                  alt="Logo"
                  width={120}
                  height={30}
                  className="h-8 w-auto"
                />
              ) : (
                <span className="text-lg font-bold" style={{ 
                  fontFamily: settings.theme.primaryFont || undefined,
                  color: settings?.theme?.headerLink || getTextColor(settings?.theme?.headerBackground),
                }}>
                  {organizationName || settings.general.title}
                </span>
              )}
            </div>
            {/* Desktop navigation menu */}
            <nav className={`${(isPreview && activeDevice === 'mobile') ? 'hidden' : 'hidden md:flex'} items-center gap-4`}>
              {settings.navigation.menuItems.map((item) => (
                <a
                  key={item.id}
                  href={isPreview ? "#" : item.url}
                  className="text-sm hover:opacity-80 transition-opacity"
                  style={{ 
                    color: settings.theme.headerLink,
                    fontFamily: settings.theme.secondaryFont || settings.theme.fontFamily || undefined,
                    color: settings?.theme?.headerLink || getTextColor(settings?.theme?.headerBackground),
                  }}
                  target="_blank"
                >
                  {item.label}
                </a>
              ))}
              {settings.navigation.homepageUrl && (
                <a
                  href={isPreview ? "#" : settings.navigation.homepageUrl}
                  className="text-sm hover:opacity-80 transition-opacity flex items-center gap-1"
                  style={{ 
                    color: settings.theme.headerLink,
                    fontFamily: settings.theme.secondaryFont || settings.theme.fontFamily || undefined,
                  }}
                  target="_blank"
                >
                  <ExternalLink className="h-4 w-4" />
                  Go To {settings.navigation.homepageLabel}
                </a>
              )}
              {settings.navigation.enableChangeLogs && (
                <Link
                  href={isPreview ? "#" : "/kb/change-logs"}
                  className="text-sm hover:opacity-80 transition-opacity flex items-center gap-1"
                  style={{ 
                    color: settings.theme.headerLink,
                    fontFamily: settings.theme.secondaryFont || settings.theme.fontFamily || undefined,
                  }}
                >
                  <FileText className="h-4 w-4" />
                  Change Log
                </Link>
              )}
            </nav>
            {/* Mobile Navigation */}
            {settings.navigation.menuItems.length > 0 && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={(isPreview && activeDevice === 'mobile') ? '' : "md:hidden"}
                    style={{
                      color: settings?.theme?.headerLink || getTextColor(settings?.theme?.headerBackground),
                    }}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="flex flex-col gap-4 mt-8">
                    {settings.navigation.menuItems.map((item) => (
                      <a
                        key={item.id}
                        href={item.url}
                        className="text-sm hover:opacity-80 transition-opacity"
                        style={{
                          fontFamily: settings.theme.secondaryFont || settings.theme.fontFamily || undefined,
                        }}
                        target="_blank"
                      >
                        {item.label}
                      </a>
                    ))}
                    {settings.navigation.homepageUrl && (
                      <a
                        href={isPreview ? "#" : settings.navigation.homepageUrl}
                        className="text-sm hover:opacity-80 transition-opacity flex items-center gap-1"
                        style={{ 
                          fontFamily: settings.theme.secondaryFont || settings.theme.fontFamily || undefined,
                        }}
                        target="_blank"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Go To {settings.navigation.homepageLabel}
                      </a>
                    )}
                    {settings.navigation.enableChangeLogs && (
                      <Link
                        href={isPreview ? "#" : "/kb/change-logs"}
                        className="text-sm hover:opacity-80 transition-opacity flex items-center gap-1"
                        style={{ 
                          fontFamily: settings.theme.secondaryFont || settings.theme.fontFamily || undefined,
                        }}
                      >
                        <FileText className="h-4 w-4" />
                        Change Log
                      </Link>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </header>

        <div className="px-6 pb-8 pt-4">
          <div className={`${getSearchBarAlignment()} ${getSearchBarWidth()}`}>
            <h1 
              className={`${getSearchBarAlignment()} mb-6 text-4xl font-bold`}
              style={{ 
                fontFamily: settings.theme.primaryFont || settings.theme.fontFamily || undefined,
                color: settings?.theme?.headerText || getTextColor(settings?.theme?.headerBackground)
              }}
            >
              {isChangeLog ? "Change Logs" : settings.general.title}
            </h1>
            {
              isChangeLog && <Button 
                variant="secondary"
                onClick={() => isPreview ? {} : setShowSubscribeModal(true)}
              >
                <Bell className="mr-2 h-4 w-4 bell-shake" />
                Subscribe to Updates
              </Button>
            }
            {!isChangeLog && <p 
              className={`${getSearchBarAlignment()} mb-8 text-l opacity-90`}
              style={{ 
                fontFamily: settings.theme.secondaryFont || settings.theme.fontFamily || undefined,
                color: settings?.theme?.headerText || getTextColor(settings?.theme?.headerBackground)
              }}
            >
              {settings.general.description}
            </p>}
            {!isChangeLog && <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for answers..."
                className="pl-10"
                onChange={(e) => onSearch?.(e.target.value)}
                style={{
                  backgroundColor: `${textColor === 'white' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  borderColor: `${textColor === 'white' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                  color: textColor,
                  fontFamily: settings.theme.secondaryFont || settings.theme.fontFamily || undefined
                }}
              />
            </div>}
          </div>
        </div>
      </div>
      <SubscribeModal
        open={showSubscribeModal}
        onOpenChange={setShowSubscribeModal}
      />
    </div>
  );
}