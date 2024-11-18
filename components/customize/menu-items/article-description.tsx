"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCustomizeStore } from "@/stores/customize";

export function ArticleDescription() {
  const { settings, updateContentSettings } = useCustomizeStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-0">
        <div>
          <Label>Show Article Description</Label>
          <p className="text-sm text-muted-foreground">
            Display article descriptions in the article list
          </p>
        </div>
        <Switch
          checked={settings.content.showArticleDescription}
          onCheckedChange={(checked) =>
            updateContentSettings({ showArticleDescription: checked })
          }
        />
      </div>

      {settings.content.showArticleDescription && (
        <div className="flex items-center justify-between space-y-0">
          <div>
            <Label>Truncate Description</Label>
            <p className="text-sm text-muted-foreground">
              Show a shortened version of the description with "Read more" link
            </p>
          </div>
          <Switch
            checked={settings.content.truncateDescription}
            onCheckedChange={(checked) =>
              updateContentSettings({ truncateDescription: checked })
            }
          />
        </div>
      )}
    </div>
  );
}