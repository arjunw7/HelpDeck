"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCustomizeStore } from "@/stores/customize";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

export function SearchBar() {
  const { settings, updateContentSettings } = useCustomizeStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Search Bar Length</Label>
        <ToggleGroup
          type="single"
          value={settings.content.searchBarLength || "medium"}
          onValueChange={(value) =>
            value && updateContentSettings({ searchBarLength: value })
          }
          className="justify-start"
        >
          <ToggleGroupItem value="short">Short</ToggleGroupItem>
          <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
          <ToggleGroupItem value="long">Long</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <Label>Search Bar Alignment</Label>
        <ToggleGroup
          type="single"
          value={settings.content.searchBarAlignment || "center"}
          onValueChange={(value) =>
            value && updateContentSettings({ searchBarAlignment: value })
          }
          className="justify-start"
        >
          <ToggleGroupItem value="left">
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center">
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right">
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}