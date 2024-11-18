import { KnowledgeBaseSettings } from "@/stores/customize";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, User, Eye, ThumbsUp, ThumbsDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useArticles } from "@/hooks/use-articles";
import { useCategories } from "@/hooks/use-categories";
import { PREVIEW_DATA } from "@/lib/preview-data";
import { ContactSupport } from "./contact-support";
import { useVotes } from "@/hooks/use-votes";

interface ArticleViewProps {
  settings: KnowledgeBaseSettings;
  articleId?: string;
  onViewChange: (view: "home" | "collection" | "article") => void;
  isPreview?: boolean;
  activeDevice?: string;
  onCategoryClick: (slug: string) => void;
  organization: any,
}

export function ArticleView({ 
  settings, 
  articleId,
  onViewChange,
  isPreview = false,
  activeDevice,
  onCategoryClick,
  organization,
}: ArticleViewProps) {
  const { articles } = useArticles(organization?.id);
  const { categories } = useCategories(organization?.id);

  const getArticle = () => {
    if (isPreview) {
      return PREVIEW_DATA.articles.find(a => a.id === articleId) || PREVIEW_DATA.articles[0];
    }
    return articles.find(a => a.id === articleId);
  };

  const getCategory = (categoryId: string) => {
    if (isPreview) {
      return PREVIEW_DATA.categories.find(c => c.id === categoryId);
    }
    return categories.find(c => c.id === categoryId);
  };

  const getRelatedArticles = () => {
    const currentArticle = getArticle();
    if (!currentArticle) return [];

    if (isPreview) {
      const otherArticles = PREVIEW_DATA.articles.filter(a => a.id !== currentArticle.id);
      return otherArticles.sort(() => Math.random() - 0.5).slice(0, 3);
    }

    if (currentArticle.related_articles?.length) {
      return currentArticle.related_articles
        .map(id => articles.find(a => 
          a.id === id && 
          a.status === "published" && 
          a.visibility === "public"
        ))
        .filter(Boolean)
        .slice(0, 3);
    }

    return articles
      .filter(a => 
        a.id !== currentArticle.id && 
        a.category_id === currentArticle.category_id &&
        a.status === "published" &&
        a.visibility === "public"
      )
      .slice(0, 3);
  };

  const article = getArticle();
  const category = article ? getCategory(article.category_id) : null;
  const relatedArticles = settings.content.showRelatedArticles ? getRelatedArticles() : [];

  const { votes, userVote, handleVote } = useVotes(
    article?.id || '', 
    'article',
    { 
      upvotes: article?.upvotes || 0, 
      downvotes: article?.downvotes || 0 
    }
  );

  const getArticleGridCols = (perRow: number) => {
    if(isPreview && activeDevice === "mobile") return "grid-cols-1";
    if(isPreview && activeDevice === "tablet") return "grid-cols-2";
    switch (perRow) {
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-1";
    }
  };

  const formatContent = (content: any) => {
    if (!content) return '';
    if (typeof content === 'string') return content;
    
    if (content.type === 'doc') {
      return content.content
        .map((node: any) => {
          switch (node.type) {
            case 'paragraph':
              return `<p>${node.content?.map((c: any) => c.text).join('') || ''}</p>`;
            case 'heading':
              const level = node.attrs?.level || 1;
              return `<h${level}>${node.content?.map((c: any) => c.text).join('') || ''}</h${level}>`;
            case 'bulletList':
              return `<ul>${node.content?.map((item: any) => 
                `<li>${item.content?.map((p: any) => 
                  p.content?.map((c: any) => c.text).join('')
                ).join('')}</li>`
              ).join('')}</ul>`;
            case 'orderedList':
              return `<ol>${node.content?.map((item: any) => 
                `<li>${item.content?.map((p: any) => 
                  p.content?.map((c: any) => c.text).join('')
                ).join('')}</li>`
              ).join('')}</ol>`;
            case 'blockquote':
              return `<blockquote>${node.content?.map((p: any) => 
                p.content?.map((c: any) => c.text).join('')
              ).join('')}</blockquote>`;
            default:
              return '';
          }
        })
        .join('');
    }
    
    return '';
  };

  if (!article || !category) return null;

  return (
    <>
      <div className="px-[5%] p-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm mb-8 opacity-90">
          <button 
            onClick={() => onViewChange("home")}
            className="hover:opacity-80 cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="h-4 w-4 opacity-50" />
          <button
            onClick={() => isPreview ? onViewChange("collection") : onCategoryClick(category?.slug)}
            className="hover:opacity-80 cursor-pointer"
          >
            {category.name}
          </button>
          <ChevronRight className="h-4 w-4 opacity-50" />
          <span>{article.title}</span>
        </div>
      
        <Card className="p-6">
          <div className="pb-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
              <div className="flex items-center gap-4">
                {settings.content.showAuthors && (
                  <div className="flex items-center gap-2 text-sm opacity-75">
                    {settings.content.showAuthorAvatar && article.profiles?.avatar_url && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={article.profiles.avatar_url} alt={article.profiles.full_name} />
                        <AvatarFallback>{article.profiles.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <User className="h-4 w-4" />
                    {article.profiles.full_name}
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm opacity-75">
                  <Eye className="h-4 w-4" />
                  {article.views} views
                </div>
              </div>
              {settings.content.showArticleDescription && article.subtitle && (
                <p className={`my-4 text-muted-foreground ${settings.content.truncateDescription ? 'line-clamp-2' : ''}`}>
                  {article.subtitle}
                </p>
              )}
            </div>
          </div>
          
          <div 
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
          />

          {/* Voting Section */}
          <div className="mt-8 flex flex-col items-center gap-4 pt-8 border-t">
            <p className="text-sm text-muted-foreground">Was this article helpful?</p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => !isPreview && handleVote('up')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  userVote === 'up' 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'hover:bg-muted'
                }`}
                disabled={isPreview || userVote === 'up'}
              >
                <ThumbsUp className="h-5 w-5" />
                <span>{votes.upvotes}</span>
              </button>
              <button
                onClick={() => !isPreview && handleVote('down')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  userVote === 'down' 
                    ? 'bg-red-500/10 text-red-500' 
                    : 'hover:bg-muted'
                }`}
                disabled={isPreview || userVote === 'down'}
              >
                <ThumbsDown className="h-5 w-5" />
                <span>{votes.downvotes}</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Related Articles */}
        {settings.content.showRelatedArticles && relatedArticles.length > 0 && (
          <div className="pt-8 pb-6">
            <h2 className="text-xl font-bold mb-3">Related Articles</h2>
            <div className={`grid gap-6 ${getArticleGridCols(settings.content.articlesPerRow || 1)}`}>
              {relatedArticles.map((relatedArticle) => (
                <Card 
                  key={relatedArticle.id}
                  className="p-6 hover:scale-[1.02] transition-transform cursor-pointer"
                  onClick={() => {
                    if (!isPreview) {
                      window.location.href = `/kb/articles/${relatedArticle.slug}`;
                    }
                  }}
                >
                  <h3 className="text-xl font-semibold mb-2">{relatedArticle.title}</h3>
                  {settings.content.showArticleDescription && relatedArticle.subtitle && (
                    <p className={`text-muted-foreground ${settings.content.truncateDescription ? 'line-clamp-2' : ''}`}>
                      {relatedArticle.subtitle}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Contact Support */}
        {settings.content.showContactSupport && settings.content.contactEmail && (
          <ContactSupport settings={settings} />
        )}
      </div>
    </>
  );
}