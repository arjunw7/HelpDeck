"use client";

import { Label } from "@/components/ui/label";
import { useCustomizeStore } from "@/stores/customize";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Grid2x2, Grid3x3, Grid } from "lucide-react";

export function LayoutSettings() {
  const { settings, updateContentSettings } = useCustomizeStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Collections</Label>
        <ToggleGroup
          type="single"
          value={settings.content.categoriesPerRow.toString()}
          onValueChange={(value) =>
            value && updateContentSettings({ categoriesPerRow: parseInt(value) })
          }
          className="justify-start"
        >
          <ToggleGroupItem value="2">
            <Grid2x2 className="h-4 w-4 mr-2" />
           Two
          </ToggleGroupItem>
          <ToggleGroupItem value="3">
            <Grid3x3 className="h-4 w-4 mr-2" />
            Three
          </ToggleGroupItem>
          <ToggleGroupItem value="4">
            <Grid className="h-4 w-4 mr-2" />
            Four
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-sm text-muted-foreground">
          Choose how many collections to display per row in the grid layout
        </p>
      </div>

      <div className="space-y-2">
        <Label>Articles</Label>
        <ToggleGroup
          type="single"
          value={settings.content.articlesPerRow?.toString() || "2"}
          onValueChange={(value) =>
            value && updateContentSettings({ articlesPerRow: parseInt(value) })
          }
          className="justify-start"
        >
          <ToggleGroupItem value="1">
            <Grid2x2 className="h-4 w-4 mr-2" />
            One
          </ToggleGroupItem>
          <ToggleGroupItem value="2">
            <Grid3x3 className="h-4 w-4 mr-2" />
            Two
          </ToggleGroupItem>
          <ToggleGroupItem value="3">
            <Grid className="h-4 w-4 mr-2" />
            Three
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-sm text-muted-foreground">
          Choose how many articles to display per row in collection views
        </p>
      </div>
    </div>
  );
}