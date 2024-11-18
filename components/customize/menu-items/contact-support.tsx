"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useCustomizeStore } from "@/stores/customize";

export function ContactSupport() {
  const { settings, updateContentSettings } = useCustomizeStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-0">
        <div>
          <Label>Show Contact Support</Label>
          <p className="text-sm text-muted-foreground">
            Display a contact support section at the bottom of pages
          </p>
        </div>
        <Switch
          checked={settings.content.showContactSupport}
          onCheckedChange={(checked) =>
            updateContentSettings({ showContactSupport: checked })
          }
        />
      </div>

      {settings.content.showContactSupport && (
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Support Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={settings.content.contactEmail || ""}
            onChange={(e) =>
              updateContentSettings({ contactEmail: e.target.value })
            }
            placeholder="support@example.com"
          />
          <p className="text-sm text-muted-foreground">
            Email address where support requests will be sent
          </p>
        </div>
      )}
    </div>
  );
}