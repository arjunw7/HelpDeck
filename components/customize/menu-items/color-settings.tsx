"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCustomizeStore } from "@/stores/customize";

export function ColorSettings() {
  const { settings, updateThemeSettings } = useCustomizeStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Header Background</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={settings.theme.headerBackground}
            onChange={(e) => updateThemeSettings({ headerBackground: e.target.value })}
            className="w-12 p-1 h-10"
          />
          <Input
            value={settings.theme.headerBackground}
            onChange={(e) => updateThemeSettings({ headerBackground: e.target.value })}
            placeholder="#000000"
            className="flex-1"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Background color for the header section
        </p>
      </div>

      <div className="space-y-2">
        <Label>Header Text</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={settings.theme.headerText}
            onChange={(e) => updateThemeSettings({ headerText: e.target.value })}
            className="w-12 p-1 h-10"
          />
          <Input
            value={settings.theme.headerText}
            onChange={(e) => updateThemeSettings({ headerText: e.target.value })}
            placeholder="#FFFFFF"
            className="flex-1"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Color for text in the header
        </p>
      </div>

      <div className="space-y-2">
        <Label>Header Link</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={settings.theme.headerLink}
            onChange={(e) => updateThemeSettings({ headerLink: e.target.value })}
            className="w-12 p-1 h-10"
          />
          <Input
            value={settings.theme.headerLink}
            onChange={(e) => updateThemeSettings({ headerLink: e.target.value })}
            placeholder="#FFFFFF"
            className="flex-1"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Color for links in the header
        </p>
      </div>

      <div className="space-y-2">
        <Label>Primary Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={settings.theme.primary}
            onChange={(e) => updateThemeSettings({ primary: e.target.value })}
            className="w-12 p-1 h-10"
          />
          <Input
            value={settings.theme.primary}
            onChange={(e) => updateThemeSettings({ primary: e.target.value })}
            placeholder="#0091FF"
            className="flex-1"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Brand color used for navigation elements and accents
        </p>
      </div>

      <div className="space-y-2">
        <Label>Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={settings.theme.text}
            onChange={(e) => updateThemeSettings({ text: e.target.value })}
            className="w-12 p-1 h-10"
          />
          <Input
            value={settings.theme.text}
            onChange={(e) => updateThemeSettings({ text: e.target.value })}
            placeholder="#000000"
            className="flex-1"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Main text color for body content
        </p>
      </div>

      <div className="space-y-2">
        <Label>Link Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={settings.theme.link}
            onChange={(e) => updateThemeSettings({ link: e.target.value })}
            className="w-12 p-1 h-10"
          />
          <Input
            value={settings.theme.link}
            onChange={(e) => updateThemeSettings({ link: e.target.value })}
            placeholder="#0091FF"
            className="flex-1"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Color for links in the content
        </p>
      </div>

      <div className="space-y-2">
        <Label>Link Hover Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={settings.theme.linkHover}
            onChange={(e) => updateThemeSettings({ linkHover: e.target.value })}
            className="w-12 p-1 h-10"
          />
          <Input
            value={settings.theme.linkHover}
            onChange={(e) => updateThemeSettings({ linkHover: e.target.value })}
            placeholder="#0070CC"
            className="flex-1"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Color for links when hovered
        </p>
      </div>

      <div className="space-y-2">
        <Label>Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={settings.theme.background}
            onChange={(e) => updateThemeSettings({ background: e.target.value })}
            className="w-12 p-1 h-10"
          />
          <Input
            value={settings.theme.background}
            onChange={(e) => updateThemeSettings({ background: e.target.value })}
            placeholder="#FFFFFF"
            className="flex-1"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Main background color for your knowledge base
        </p>
      </div>
    </div>
  );
}