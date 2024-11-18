"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCustomizeStore } from "@/stores/customize";

export function SegmentedSearch() {
  const { settings, updateContentSettings } = useCustomizeStore();

  return (
    <div className="flex items-center justify-between space-y-0">
      <div>
        <Label>Segmented Search Results</Label>
        <p className="text-sm text-muted-foreground">
          Show search results in distinct categories for better clarity
        </p>
      </div>
      <Switch
        checked={settings.content.segmentedSearch}
        onCheckedChange={(checked) =>
          updateContentSettings({ segmentedSearch: checked })
        }
      />
    </div>
  );
}