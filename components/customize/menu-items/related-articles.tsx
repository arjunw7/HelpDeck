"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCustomizeStore } from "@/stores/customize";

export function RelatedArticles() {
  const { settings, updateContentSettings } = useCustomizeStore();

  return (
    <div className="flex items-center justify-between space-y-0">
      <div>
        <Label>Show Related Articles</Label>
        <p className="text-sm text-muted-foreground">
          Display up to 3 related articles when viewing an article
        </p>
      </div>
      <Switch
        checked={settings.content.showRelatedArticles}
        onCheckedChange={(checked) =>
          updateContentSettings({ showRelatedArticles: checked })
        }
      />
    </div>
  );
}