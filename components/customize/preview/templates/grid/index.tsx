import { KnowledgeBaseSettings } from "@/stores/customize";
import { Hero } from "./hero";
import { Categories } from "./categories";
import { ContactSupport } from "./contact-support";
import { CategoryView } from "./category-view";
import { ArticleView } from "./article-view";
import { ChangeLogsList } from "./change-logs-list";
import { ChangeLogView } from "./change-log-view";
import { Footer } from "./footer";

interface GridTemplateProps {
  settings: KnowledgeBaseSettings;
  organization?: any;
  currentView: "home" | "collection" | "article" | "changelog-list" | "changelog";
  onViewChange: (view: "home" | "collection" | "article" | "changelog-list" | "changelog") => void;
  selectedCategoryId?: string;
  selectedArticleId?: string;
  selectedChangeLogId?: string;
  onCategoryClick: (slug: string) => void;
  onArticleClick: (slug: string) => void;
  onChangeLogClick?: (id: string) => void;
  isPreview?: boolean;
  activeDevice?: string;
  selectedRelaseNoteId?: string;
  handleReleaseNoteClick?: (id: string) => void;
}

export function GridTemplate({
  settings,
  organization,
  currentView,
  onViewChange,
  selectedCategoryId,
  selectedArticleId,
  selectedChangeLogId,
  onCategoryClick,
  onArticleClick,
  onChangeLogClick,
  isPreview = false,
  activeDevice,
  selectedRelaseNoteId,
  handleReleaseNoteClick,
}: GridTemplateProps) {
  const renderContent = () => {
    switch (currentView) {
      case "collection":
        return (
          <>
            <Hero
              settings={settings}
              isPreview={isPreview}
              activeDevice={activeDevice}
              organization={organization}
            />
            <CategoryView
              settings={settings}
              categoryId={selectedCategoryId}
              onArticleClick={onArticleClick}
              onViewChange={onViewChange}
              isPreview={isPreview}
              activeDevice={activeDevice}
              organization={organization}
            />
          </>
        );
      case "article":
        return (
          <>
            <Hero
              settings={settings}
              organization={organization}
              isPreview={isPreview}
              activeDevice={activeDevice}
            />
            <ArticleView
              settings={settings}
              articleId={selectedArticleId}
              onViewChange={onViewChange}
              isPreview={isPreview}
              activeDevice={activeDevice}
              onCategoryClick={onCategoryClick}
              organization={organization}
            />
          </>
        );
      case "changelog-list":
        return (
          <>
            <Hero
              settings={settings}
              organization={organization}
              isChangeLog
              isPreview={isPreview}
              activeDevice={activeDevice}
            />
            <ChangeLogsList
              settings={settings}
              onChangeLogClick={handleReleaseNoteClick}
              isPreview={isPreview}
              activeDevice={activeDevice}
              onViewChange={onViewChange}
              organization={organization}
            />
          </>
        );
      case "changelog":
        return (
          <>
            <Hero
              settings={settings}
              organization={organization}
              isChangeLog
              isPreview={isPreview}
              activeDevice={activeDevice}
            />
            <ChangeLogView
              settings={settings}
              changeLogId={selectedRelaseNoteId}
              organization={organization}
              isPreview={isPreview}
              activeDevice={activeDevice}
              onViewChange={onViewChange}
            />
          </>
        );
      default:
        return (
          <>
            <Hero
              settings={settings}
              organization={organization}
              isPreview={isPreview}
              activeDevice={activeDevice}
            />
            <Categories 
              settings={settings} 
              organization={organization}
              onCategoryClick={onCategoryClick}
              isPreview={isPreview}
              activeDevice={activeDevice}
            />
            <div className="px-[5%]">
              {settings.content.showContactSupport && settings.content.contactEmail && (
                <ContactSupport settings={settings} />
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div 
      className="min-h-screen bg-background flex flex-col"
      style={{ 
        backgroundColor: settings.theme.backgroundColor,
        color: settings.theme.textColor,
        fontFamily: settings.theme.fontFamily || undefined,
      }}
    >
      {renderContent()}
      <Footer settings={settings} />
    </div>
  );
}