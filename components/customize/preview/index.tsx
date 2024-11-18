"use client";

import { KnowledgeBaseSettings } from "@/stores/customize";
import { GridTemplate } from "./templates/grid";
// import { SleekTemplate } from "./templates/sleek";

interface KnowledgeBasePreviewProps {
  settings: KnowledgeBaseSettings;
  organizationName?: string;
  currentView: "home" | "collection" | "article";
  onViewChange: (view: "home" | "collection" | "article" | "changelog-list" | "changelog") => void;
  selectedCategoryId?: string;
  selectedArticleId?: string;
  onCategoryClick: (categoryId: string) => void;
  onArticleClick: (articleId: string) => void;
  template?: "grid" | "sleek";
  isPreview?: boolean;
  activeDevice?: string;
  handleReleaseNoteClick: (id: string) => void;
  selectedRelaseNoteId?: string;
}

export function KnowledgeBasePreview({ 
  settings, 
  organizationName,
  currentView,
  onViewChange,
  selectedCategoryId,
  selectedArticleId,
  onCategoryClick,
  onArticleClick,
  template = "grid",
  isPreview = false,
  activeDevice,
  handleReleaseNoteClick,
  selectedRelaseNoteId,
}: KnowledgeBasePreviewProps) {
  const commonProps = {
    settings,
    organizationName,
    currentView,
    onViewChange,
    selectedCategoryId,
    selectedArticleId,
    onCategoryClick,
    onArticleClick,
    isPreview,
    activeDevice,
    handleReleaseNoteClick,
    selectedRelaseNoteId,
  };

  return template === "grid" ? (
    <GridTemplate {...commonProps} />
  ) : (
    <GridTemplate {...commonProps} />
  );
}