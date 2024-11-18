"use client";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { useCustomizeStore } from "@/stores/customize";
import { KnowledgeBasePreview } from "./preview/index";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface CustomizePreviewProps {
  activeScreen: "home" | "collection" | "article" | "changelog-list" | "changelog";
  activeDevice: "desktop" | "tablet" | "mobile";
  activeTemplate: "grid" | "sleek";
  onScreenChange: (screen: "home" | "collection" | "article" | "changelog-list" | "changelog") => void;
  onDeviceChange: (device: "desktop" | "tablet" | "mobile") => void;
}

export default function CustomizePreview({
  activeScreen,
  activeDevice,
  activeTemplate,
  onScreenChange,
  onDeviceChange,
}: CustomizePreviewProps) {
  const { settings } = useCustomizeStore();
  const { organization } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  const [selectedArticleId, setSelectedArticleId] = useState<string>();

  const handleSave = async () => {
    if (!organization) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("customize_settings")
        .upsert({
          org_id: organization.id,
          settings,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "org_id",
        });

      if (error) throw error;
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const getDeviceStyles = () => {
    switch (activeDevice) {
      case "tablet":
        return "max-w-[768px] mx-auto";
      case "mobile":
        return "max-w-[375px] mx-auto";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Preview Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <Select value={activeScreen} onValueChange={(value: any) => onScreenChange(value)} style={{ outline: 'none' }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select screen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="collection">Collection</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="changelog-list">Change Logs</SelectItem>
              <SelectItem value="changelog">View Change Log</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <ToggleGroup
            type="single"
            value={activeDevice}
            onValueChange={(value: any) => value && onDeviceChange(value)}
          >
            <ToggleGroupItem value="desktop" aria-label="Desktop view">
              <Monitor className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="tablet" aria-label="Tablet view">
              <Tablet className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="mobile" aria-label="Mobile view">
              <Smartphone className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-muted/50 p-4">
        <div className={getDeviceStyles()}>
          <div className="rounded-lg border bg-background overflow-hidden">
            <KnowledgeBasePreview
              settings={settings}
              organization={organization}
              currentView={activeScreen}
              onViewChange={onScreenChange}
              selectedCategoryId={selectedCategoryId}
              selectedArticleId={selectedArticleId}
              onCategoryClick={setSelectedCategoryId}
              onArticleClick={setSelectedArticleId}
              template={activeTemplate}
              isPreview={true}
              activeDevice={activeDevice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}