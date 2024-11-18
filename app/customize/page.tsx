"use client";

import { useState } from "react";
import { CustomizeMenu } from "@/components/customize/customize-menu";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CustomizePreview from "@/components/customize/customize-preview";

export default function CustomizePage() {
  const [activeTemplate, setActiveTemplate] = useState<"grid" | "sleek">("grid");
  const [activeScreen, setActiveScreen] = useState<"home" | "collection" | "article">("home");
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  return (
    <div className="flex h-[calc(100vh-3.5rem)] mx-[5%]">
      {/* Left Sidebar */}
      <div className="w-[320px] border-r flex flex-col">
        <div className="p-4 sticky top-0 bg-background z-10">
          <Link 
            href="/knowledge-base" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        <CustomizeMenu 
          activeTemplate={activeTemplate}
          onTemplateChange={setActiveTemplate}
        />
      </div>

      {/* Right Preview */}
      <div className="flex-1">
        <CustomizePreview
          activeTemplate={activeTemplate}
          activeScreen={activeScreen}
          activeDevice={activeDevice}
          onScreenChange={setActiveScreen}
          onDeviceChange={setActiveDevice}
        />
      </div>
    </div>
  );
}