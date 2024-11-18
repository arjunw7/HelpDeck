"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KnowledgeBaseSettings } from "@/stores/customize";
import { KnowledgeBaseLayout } from "@/components/knowledge-base/shared/layout";
import { GridTemplate } from "@/components/customize/preview/templates/grid";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ArticleViewTracker } from "@/components/knowledge-base/shared/article-view";

interface Organization {
  id: string;
  name: string;
  logo: string;
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [settings, setSettings] = useState<KnowledgeBaseSettings | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [articleId, setArticleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Get settings from response headers
        const response = await fetch("/api/kb/settings");
        const data = await response.json();
        
        if (data.settings) {
          setSettings(data.settings);
        }

        if (data.organizationId) {
          const { data: org } = await supabase
            .from('organizations')
            .select('name,id')
            .eq('id', data.organizationId)
            .single();

          setOrganization(org);

          // Get article
          const { data: articleData } = await supabase
            .from('articles')
            .select('id')
            .eq('slug', params.slug)
            .eq('visibility', 'public')
            .eq('status', 'published')
            .single();

          if (articleData) {
            setArticleId(articleData.id);
          } else {
            throw new Error('Article not found');
          }
        }
      } catch (error) {
        console.error('Error loading article:', error);
        toast.error('Failed to load article');
        router.push('/kb');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [params.slug]);

  if (!settings || !organization || !articleId) {
    return null;
  }

  const handleCategoryClick = (slug: string) => {
    router.push(`/kb/categories/${slug}`);
  };

  const handleArticleClick = (slug: string) => {
    router.push(`/kb/articles/${slug}`);
  };

  return (
    <KnowledgeBaseLayout settings={settings}>
      {/* Track article views */}
      {articleId && organization && <ArticleViewTracker articleId={articleId} orgId={organization?.id}/>}
      
      <GridTemplate 
        settings={settings}
        organizationName={organization.name}
        currentView="article"
        selectedArticleId={articleId}
        onViewChange={(view) => {
          if (view === "home") {
            router.push('/kb');
          } else if (view === "collection") {
            const article = articles.find(a => a.id === articleId);
            if (article) {
              const category = categories.find(c => c.id === article.category_id);
              if (category) {
                router.push(`/kb/categories/${category.slug}`);
              }
            }
          }
        }}
        onCategoryClick={handleCategoryClick}
        onArticleClick={handleArticleClick}
      />
    </KnowledgeBaseLayout>
  );
}