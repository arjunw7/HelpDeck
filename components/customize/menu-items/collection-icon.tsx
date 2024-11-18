"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCustomizeStore } from "@/stores/customize";

export function CollectionIcon() {
  const { settings, updateContentSettings } = useCustomizeStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-0">
        <div>
          <Label>Show Collection Icon</Label>
          <p className="text-sm text-muted-foreground">
            Display icons for collections in the collection list
          </p>
        </div>
        <Switch
          checked={settings.content.showCollectionIcon}
          onCheckedChange={(checked) =>
            updateContentSettings({ showCollectionIcon: checked })
          }
        />
      </div>

      {settings.content.showCollectionIcon && (
        <div className="flex items-center justify-between space-y-0">
          <div>
            <Label>Large Icons</Label>
            <p className="text-sm text-muted-foreground">
              Use larger icons for better visibility
            </p>
          </div>
          <Switch
            checked={settings.content.largeCollectionIcon}
            onCheckedChange={(checked) =>
              updateContentSettings({ largeCollectionIcon: checked })
            }
          />
        </div>
      )}
    </div>
  );
}