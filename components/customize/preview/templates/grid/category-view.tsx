import { KnowledgeBaseSettings } from "@/stores/customize";
import { Card } from "@/components/ui/card";
import { ChevronRight, FileText } from "lucide-react";
import { PREVIEW_DATA } from "@/lib/preview-data";
import { useCategories } from "@/hooks/use-categories";
import { useArticles } from "@/hooks/use-articles";
import { ContactSupport } from "./contact-support";

interface CategoryViewProps {
  settings: KnowledgeBaseSettings;
  categoryId?: string;
  onArticleClick: (articleId: string) => void;
  onViewChange: (view: "home" | "collection" | "article") => void;
  isPreview?: boolean;
  activeDevice?: string;
  organization: any,
}

export function CategoryView({
  settings,
  categoryId,
  onArticleClick,
  onViewChange,
  isPreview = false,
  activeDevice,
  organization,
}: CategoryViewProps) {
  const { categories, isLoading:categoriesLoading } = useCategories(organization?.id);
  const { articles, isLoading:articlesLoading } = useArticles(organization?.id);

  const getCategory = () => {
    if (isPreview) {
      return PREVIEW_DATA.categories.find(c => c.id === categoryId) || PREVIEW_DATA.categories[0];
    }
    return categories.find(c => c.id === categoryId);
  };

  const getSubcategories = (parentId: string) => {
    if (isPreview) {
      return PREVIEW_DATA.categories.filter(c => c.parent_id === parentId);
    }
    return categories.filter(c => c.parent_id === parentId && c.accessibility === "public");
  };

  const getCategoryArticles = (catId: string) => {
    if (isPreview) {
      return PREVIEW_DATA.articles.filter(article => article.category_id === catId);
    }
    return articles.filter(
      article => 
        article.category_id === catId && 
        article.status === "published" &&
        article.visibility === "public"
    ).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  };

  const getArticleGridCols = (perRow: number) => {
    if(isPreview && activeDevice === "mobile") return "grid-cols-1";
    if(isPreview && activeDevice === "tablet" && perRow > 2) return "grid-cols-2";
    switch (perRow) {
      case 2:
        return "grid-cols-1 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 sm:grid-cols-1 xs:grid-cols-1";
      default:
        return "grid-cols-1";
    }
  };

  const category = getCategory();
  const mainArticles = category ? getCategoryArticles(category.id) : [];
  const subcategories = category ? getSubcategories(category.id) : [];

  if (!category) return null;

  const hasContent = mainArticles.length > 0 || subcategories.some(sub => getCategoryArticles(sub.id).length > 0);

  return (
    <>
      <div className="py-6 px-[5%]">
         {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm mb-2 opacity-90">
              <button 
                onClick={() => onViewChange("home")}
                className="hover:opacity-80 cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="h-4 w-4 opacity-50" />
              <span>{category.name}</span>
            </div>
        <div className="flex items-center gap-4 pt-6">
          {settings.content.showCollectionIcon && (
            <span className={settings.content.largeCollectionIcon ? 'text-5xl' : 'text-4xl'}>
              {category.icon}
            </span>
          )}
          <div>
            <h1 className="text-2xl font-bold mb-2">{category.name}</h1>
            {settings.content.showCollectionDescription && category.description && (
              <p className="opacity-90">{category.description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="py-6 px-[5%]">
        {!hasContent ? (
          <Card className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No Articles Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This category doesn't have any articles yet. Check back later for updates.
            </p>
          </Card>
        ) : (
          <div className="space-y-8 pb-8">
            {/* Main category articles */}
            {mainArticles.length > 0 && (
              <div className="space-y-4">
                <div className={`grid gap-4 ${getArticleGridCols(settings.content.articlesPerRow || 1)}`}>
                  {mainArticles.map((article) => (
                    <Card 
                      key={article.id}
                      className="p-6 hover:scale-[1.02] transition-transform cursor-pointer"
                      onClick={() => onArticleClick(article.slug)}
                    >
                      <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                      {settings.content.showArticleDescription && article.subtitle && (
                        <p className={`text-muted-foreground ${settings.content.truncateDescription ? 'line-clamp-2' : ''}`}>
                          {article.subtitle}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {/* Subcategories and their articles */}
            {subcategories.map((subcategory) => {
              const subcategoryArticles = getCategoryArticles(subcategory.id);
              if (subcategoryArticles.length === 0) return null;

              return (
                <div key={subcategory.id} className="space-y-1">
                  <div className="h-6" />
                  <div className="flex items-center gap-2">
                    {settings.content.showCollectionIcon && (
                      <span className={settings.content.largeCollectionIcon ? 'text-3xl' : 'text-2xl'}>
                        {subcategory.icon}
                      </span>
                    )}
                    <h2 className="text-xl font-bold">{subcategory.name}</h2>
                  </div>
                  {settings.content.showCollectionDescription && subcategory.description && (
                    <p className="text-muted-foreground mb-4">{subcategory.description}</p>
                  )}
                  <div className="h-4" />
                  <div className={`grid gap-4 mt-4 ${getArticleGridCols(settings.content.articlesPerRow || 1)}`}>
                    {subcategoryArticles.map((article) => (
                      <Card 
                        key={article.id}
                        className="p-6 hover:scale-[1.02] transition-transform cursor-pointer"
                        onClick={() => onArticleClick(article.slug)}
                      >
                        <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                        {settings.content.showArticleDescription && article.subtitle && (
                          <p className={`text-muted-foreground ${settings.content.truncateDescription ? 'line-clamp-2' : ''}`}>
                            {article.subtitle}
                          </p>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {settings.content.showContactSupport && settings.content.contactEmail && (
          <ContactSupport settings={settings} />
        )}
      </div>
    </>
  );
}