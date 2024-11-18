"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCustomizeStore } from "@/stores/customize";

export function InstantSearch() {
  const { settings, updateContentSettings } = useCustomizeStore();

  return (
    <div className="flex items-center justify-between space-y-0">
      <div>
        <Label>Enable Instant Search</Label>
        <p className="text-sm text-muted-foreground">
          Search for articles as users type their query
        </p>
      </div>
      <Switch
        checked={settings.content.instantSearch}
        onCheckedChange={(checked) =>
          updateContentSettings({ instantSearch: checked })
        }
      />
    </div>
  );
}