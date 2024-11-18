"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useCustomizeStore } from "@/stores/customize";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function FooterLinks() {
  const { settings, updateNavigationSettings } = useCustomizeStore();
  const [newLink, setNewLink] = useState({ label: "", url: "" });

  const addLink = () => {
    
    if (!newLink.label || !newLink.url) {
      toast.error("Please fill in both label and URL");
      return;
    }

    const updatedItems = settings.navigation.footerItems ? [
      ...settings.navigation.footerItems,
      { ...newLink, id: uuidv4() },
    ] : [{ ...newLink, id: uuidv4() }];
    updateNavigationSettings({ footerItems: updatedItems });
    setNewLink({ label: "", url: "" });
  };

  const removeLink = (id: string) => {
    const updatedItems = settings.navigation.footerItems.filter(
      (item) => item.id !== id
    );
    updateNavigationSettings({ footerItems: updatedItems });
  };

  const updateLink = (id: string, field: "label" | "url", value: string) => {
    const updatedItems = settings.navigation.footerItems?.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateNavigationSettings({ footerItems: updatedItems });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {settings.navigation.footerItems?.map((item) => (
          <div key={item.id} className="flex items-start gap-2">
            <div className="grid flex-1 gap-2">
              <Input
                value={item.label}
                onChange={(e) => updateLink(item.id, "label", e.target.value)}
                placeholder="Link label"
              />
              <Input
                value={item.url}
                onChange={(e) => updateLink(item.id, "url", e.target.value)}
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
            <Label>Add Footer Link</Label>
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
    </div>
  );
}