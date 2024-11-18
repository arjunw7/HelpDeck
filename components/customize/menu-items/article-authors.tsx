"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCustomizeStore } from "@/stores/customize";

export function ArticleAuthors() {
  const { settings, updateContentSettings } = useCustomizeStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-0">
        <div>
          <Label>Show Author Details</Label>
          <p className="text-sm text-muted-foreground">
            Display author image and name for each article
          </p>
        </div>
        <Switch
          checked={settings.content.showAuthors}
          onCheckedChange={(checked) =>
            updateContentSettings({ showAuthors: checked })
          }
        />
      </div>

      {settings.content.showAuthors && (
        <div className="flex items-center justify-between space-y-0">
          <div>
            <Label>Show Author Avatar</Label>
            <p className="text-sm text-muted-foreground">
              Display author profile picture alongside their name
            </p>
          </div>
          <Switch
            checked={settings.content.showAuthorAvatar}
            onCheckedChange={(checked) =>
              updateContentSettings({ showAuthorAvatar: checked })
            }
          />
        </div>
      )}
    </div>
  );
}