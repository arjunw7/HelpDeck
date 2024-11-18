"use client";

import { Label } from "@/components/ui/label";
import { useCustomizeStore } from "@/stores/customize";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fontOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
];

export function FontSettings() {
  const { settings, updateThemeSettings } = useCustomizeStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Primary Font</Label>
        <Select
          value={settings.theme.primaryFont || undefined}
          onValueChange={(value) => updateThemeSettings({ primaryFont: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select primary font" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Used for headings and titles throughout your knowledge base
        </p>
      </div>

      <div className="space-y-2">
        <Label>Secondary Font</Label>
        <Select
          value={settings.theme.secondaryFont || undefined}
          onValueChange={(value) => updateThemeSettings({ secondaryFont: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select secondary font" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Used for body text and general content
        </p>
      </div>
    </div>
  );
}