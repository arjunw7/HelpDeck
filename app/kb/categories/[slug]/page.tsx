"use client";

import { useEffect, useState } from "react";
import { KnowledgeBaseSettings } from "@/stores/customize";
import { KnowledgeBaseLayout } from "@/components/knowledge-base/shared/layout";
import { GridTemplate } from "@/components/customize/preview/templates/grid";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Organization {
  id: string;
  name: string;
  logo: string;
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [settings, setSettings] = useState<KnowledgeBaseSettings | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
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
            .select('id, name, logo')
            .eq('id', data.organizationId)
            .single();

          setOrganization(org);

          // Get current category
          const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', params.slug)
            .eq('accessibility', 'public')
            .single();

          if (categoryData) {
            setCategoryId(categoryData.id);
          } else {
            throw new Error('Category not found');
          }
        }
      } catch (error) {
        console.error('Error loading category data:', error);
        toast.error('Failed to load category');
        router.push('/kb');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [params.slug]);

  if (!settings || !organization || !categoryId) {
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
      <GridTemplate 
        settings={settings}
        organization={organization}
        currentView="collection"
        selectedCategoryId={categoryId}
        onViewChange={() => router.push('/kb')}
        onCategoryClick={handleCategoryClick}
        onArticleClick={handleArticleClick}
      />
    </KnowledgeBaseLayout>
  );
}