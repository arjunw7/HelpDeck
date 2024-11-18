"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Layout,
  Palette,
  Type,
  Image,
  Link,
  User,
  FileText,
  Folder,
  Search,
  Sparkles,
  Split,
  FileLink,
  Grid,
  Rows,
  PaintBucket,
  LifeBuoy,
} from "lucide-react";
import { useCustomizeStore } from "@/stores/customize";
import { cn } from "@/lib/utils";
import { LayoutSettings } from "./menu-items/layout-settings";
import { BrandSettings } from "./menu-items/brand-settings";
import { FontSettings } from "./menu-items/font-settings";
import { ColorSettings } from "./menu-items/color-settings";
import { HeaderLinks } from "./menu-items/header-links";
import { FooterLinks } from "./menu-items/footer-links";
import { ArticleAuthors } from "./menu-items/article-authors";
import { ArticleDescription } from "./menu-items/article-description";
import { CollectionIcon } from "./menu-items/collection-icon";
import { CollectionDescription } from "./menu-items/collection-description";
import { SearchBar } from "./menu-items/search-bar";
import { InstantSearch } from "./menu-items/instant-search";
import { SegmentedSearch } from "./menu-items/segmented-search";
import { RelatedArticles } from "./menu-items/related-articles";
import { ContactSupport } from "./menu-items/contact-support";

interface CustomizeMenuProps {
  activeTemplate: "grid" | "sleek";
  onTemplateChange: (template: "grid" | "sleek") => void;
}

export function CustomizeMenu({ activeTemplate, onTemplateChange }: CustomizeMenuProps) {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const { settings, updateGeneralSettings } = useCustomizeStore();

  const handleAccordionChange = (value: string) => {
    setActiveAccordion(value === activeAccordion ? null : value);
  };

  const menuItems = [
    {
      id: "layout",
      label: "Layout",
      icon: Layout,
      content: <LayoutSettings />,
    },
    {
      id: "brand",
      label: "Brand",
      icon: Image,
      content: <BrandSettings />,
    },
    {
      id: "fonts",
      label: "Fonts",
      icon: Type,
      content: <FontSettings />,
    },
    {
      id: "colors",
      label: "Colors",
      icon: Palette,
      content: <ColorSettings />,
    },
    {
      id: "headerLinks",
      label: "Header Links",
      icon: Link,
      content: <HeaderLinks />,
    },
    {
      id: "footerLinks",
      label: "Footer Links",
      icon: Link,
      content: <FooterLinks />,
    },
    {
      id: "articleAuthors",
      label: "Article Authors",
      icon: User,
      content: <ArticleAuthors />,
    },
    {
      id: "articleDescription",
      label: "Article Description",
      icon: FileText,
      content: <ArticleDescription />,
    },
    {
      id: "collectionIcon",
      label: "Collection Icon",
      icon: Folder,
      content: <CollectionIcon />,
    },
    {
      id: "collectionDescription",
      label: "Collection Description",
      icon: FileText,
      content: <CollectionDescription />,
    },
    {
      id: "searchBar",
      label: "Search Bar",
      icon: Search,
      content: <SearchBar />,
    },
    {
      id: "instantSearch",
      label: "Instant Search",
      icon: Sparkles,
      content: <InstantSearch />,
    },
    {
      id: "segmentedSearch",
      label: "Segmented Search",
      icon: Split,
      content: <SegmentedSearch />,
    },
    {
      id: "relatedArticles",
      label: "Related Articles",
      icon: Link,
      content: <RelatedArticles />,
    },
    {
      id: "contactSupport",
      label: "Contact Support",
      icon: LifeBuoy,
      content: <ContactSupport />,
    },
  ];

  return (
    <ScrollArea className="flex-1">
      <div className="p-1">
        <Tabs defaultValue="general" className="space-y-2">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Accordion
              type="single"
              collapsible
              value={activeAccordion || undefined}
              onValueChange={handleAccordionChange}
              className="space-y-1"
            >
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <AccordionItem 
                    key={item.id} 
                    value={item.id}
                    className="border rounded-lg"
                  >
                    <AccordionTrigger className="hover:no-underline px-4 py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 space-y-4">
                        {item.content}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </TabsContent>

          <TabsContent value="templates">
            <div className="space-y-1">
              <div
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-colors",
                  activeTemplate === "grid"
                    ? "bg-primary/5"
                    : "hover:border-primary/50"
                )}
                onClick={() => onTemplateChange("grid")}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Grid className="h-5 w-5" />
                  <h3 className="font-semibold">Grid</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  A modern, grid-based layout perfect for help centers and knowledge bases.
                </p>
              </div>

              <div
                className={cn(
                  "p-4 rounded-lg border-2 transition-colors opacity-60 cursor-not-allowed relative",
                  activeTemplate === "sleek"
                    ? "bg-primary/5"
                    : "hover:border-primary/20"
                )}
              >
                <div className="absolute right-2 top-2">
                  <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
                    Coming Soon
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Rows className="h-5 w-5" />
                  <h3 className="font-semibold">Sleek</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  A clean, minimalist layout ideal for technical documentation.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}