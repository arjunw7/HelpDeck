"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCustomizeStore } from "@/stores/customize";

export function CollectionDescription() {
  const { settings, updateContentSettings } = useCustomizeStore();

  return (
    <div className="flex items-center justify-between space-y-0">
      <div>
        <Label>Show Collection Description</Label>
        <p className="text-sm text-muted-foreground">
          Display descriptions for collections in the collection list
        </p>
      </div>
      <Switch
        checked={settings.content.showCollectionDescription}
        onCheckedChange={(checked) =>
          updateContentSettings({ showCollectionDescription: checked })
        }
      />
    </div>
  );
}