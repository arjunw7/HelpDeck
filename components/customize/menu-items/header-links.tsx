"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import { useCustomizeStore } from "@/stores/customize";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function HeaderLinks() {
  const { settings, updateNavigationSettings } = useCustomizeStore();
  const [newLink, setNewLink] = useState({ label: "", url: "" });

  const addLink = () => {
    if (newLink.label && newLink.url) {
      const updatedItems = [
        ...settings.navigation.menuItems,
        { ...newLink, id: uuidv4() },
      ];
      updateNavigationSettings({ menuItems: updatedItems });
      setNewLink({ label: "", url: "" });
    }
  };

  const removeLink = (id: string) => {
    const updatedItems = settings.navigation.menuItems.filter(
      (item) => item.id !== id
    );
    updateNavigationSettings({ menuItems: updatedItems });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {settings.navigation.menuItems.map((item) => (
          <div key={item.id} className="flex items-start gap-2">
            <div className="grid flex-1 gap-2">
              <Input
                value={item.label}
                onChange={(e) =>
                  updateNavigationSettings({
                    menuItems: settings.navigation.menuItems.map((i) =>
                      i.id === item.id ? { ...i, label: e.target.value } : i
                    ),
                  })
                }
                placeholder="Link label"
              />
              <Input
                value={item.url}
                onChange={(e) =>
                  updateNavigationSettings({
                    menuItems: settings.navigation.menuItems.map((i) =>
                      i.id === item.id ? { ...i, url: e.target.value } : i
                    ),
                  })
                }
                placeholder="URL"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeLink(item.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label>Add Link</Label>
          <Input
            value={newLink.label}
            onChange={(e) =>
              setNewLink((prev) => ({ ...prev, label: e.target.value }))
            }
            placeholder="Link label"
          />
          <Input
            value={newLink.url}
            onChange={(e) =>
              setNewLink((prev) => ({ ...prev, url: e.target.value }))
            }
            placeholder="URL"
          />
        </div>
        <Button onClick={addLink} className="px-3 text-sm font-medium text-center h-8">
          <Plus className="mr-2 h-4 w-4" />
          Add Link
        </Button>
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="space-y-2">
          <Label>Homepage Link</Label>
          <div className="grid gap-2">
            <Input
              value={settings.navigation.homepageUrl}
              onChange={(e) =>
                updateNavigationSettings({ homepageUrl: e.target.value })
              }
              placeholder="https://example.com"
            />
            <Input
              value={settings.navigation.homepageLabel}
              onChange={(e) =>
                updateNavigationSettings({ homepageLabel: e.target.value })
              }
              placeholder="Website"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Add a link to your main website
          </p>
        </div>

        <div className="flex items-center justify-between space-y-0">
          <div>
            <Label>Enable Change Logs</Label>
            <p className="text-sm text-muted-foreground">
              Show change logs link in the header
            </p>
          </div>
          <Switch
            checked={settings.navigation.enableChangeLogs}
            onCheckedChange={(checked) =>
              updateNavigationSettings({ enableChangeLogs: checked })
            }
          />
        </div>
      </div>
    </div>
  );
}