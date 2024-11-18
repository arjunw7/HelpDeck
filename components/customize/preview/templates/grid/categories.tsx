import { KnowledgeBaseSettings } from "@/stores/customize";
import { Card } from "@/components/ui/card";
import { useCategories } from "@/hooks/use-categories";
import { useArticles } from "@/hooks/use-articles";
import { PREVIEW_DATA } from "@/lib/preview-data";

interface CategoriesProps {
  settings: KnowledgeBaseSettings;
  organization: any,
  onCategoryClick: (categoryId: string) => void;
  isPreview?: boolean;
  activeDevice?: string,
}

export function Categories({ settings, organization, onCategoryClick, isPreview = false, activeDevice }: CategoriesProps) {
  const { categories } = useCategories(organization?.id);
  const { articles } = useArticles(organization?.id);
  const getCategories = () => {
    if (isPreview) {
      return PREVIEW_DATA.categories.filter(cat => !cat.parent_id);
    }
    return categories.filter(cat => cat.accessibility === "public" && !cat.parent_id).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  };

  const getCategoryArticleCount = (categoryId: string): number => {
    if (isPreview) {
      const directArticles = PREVIEW_DATA.articles.filter(
        article => article.category_id === categoryId
      ).length;

      const subCategories = PREVIEW_DATA.categories.filter(cat => cat.parent_id === categoryId);
      const subCategoryArticles = subCategories.reduce((acc, subCat) => 
        acc + getCategoryArticleCount(subCat.id), 0);

      return directArticles + subCategoryArticles;
    }

    // Get direct articles
    const directArticles = articles.filter(
      article => article.category_id === categoryId && 
      article.status === "published" &&
      article.visibility === "public"
    ).length;

    // Get subcategories and their articles
    const subCategories = categories.filter(cat => cat.parent_id === categoryId);
    const subCategoryArticles = subCategories.reduce((acc, subCat) => 
      acc + getCategoryArticleCount(subCat.id), 0);

    return directArticles + subCategoryArticles;
  };

  const getCategoryGridCols = (perRow: number) => {
    if(isPreview && activeDevice === "mobile") return "grid-cols-1";
    if(isPreview && activeDevice === "tablet") return "grid-cols-2";
    else {
      switch (perRow) {
        case 2:
          return "grid-cols-1 md:grid-cols-2";
        case 3:
          return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
        case 4:
          return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
        default:
          return "grid-cols-1 md:grid-cols-3";
      } 
    }
  };

  const displayCategories = getCategories();

  return (
    <div className="px-[5%] py-8 space-y-12">
      <div className={`grid gap-6 ${getCategoryGridCols(settings.content.categoriesPerRow)}`}>
        {displayCategories.map((category) => (
          <Card 
            key={category.id}
            className="p-6 cursor-pointer transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg"
            onClick={() => isPreview ? {} : onCategoryClick(category.slug)}
          >
            <div className="flex flex-col items-center text-center">
              {settings.content.showCollectionIcon && (
                <span className={`mb-3 ${settings.content.largeCollectionIcon ? 'text-5xl' : 'text-4xl'}`}>
                  {category.icon}
                </span>
              )}
              <h3 className="text-xl font-bold mb-3">{category.name}</h3>
              {settings.content.showCollectionDescription && category.description && (
                <p className="text-sm text-muted-foreground mb-auto">
                  {category.description}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-3">
                {getCategoryArticleCount(category.id)} articles
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}