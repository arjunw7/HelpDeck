"use client";

import { useEffect, useState } from "react";
import { KnowledgeBaseSettings } from "@/stores/customize";
import { KnowledgeBaseLayout } from "@/components/knowledge-base/shared/layout";
import { GridTemplate } from "@/components/customize/preview/templates/grid";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface Organization {
  id: string;
  name: string;
  logo: string;
}

export default function PublicKnowledgeBasePage() {
  const router = useRouter();
  const [settings, setSettings] = useState<KnowledgeBaseSettings | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
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
          const { data: org, error } = await supabase
            .from('organizations')
            .select('id, name, logo')
            .eq('id', data.organizationId)
            .single();

          if (error) throw error;
          setOrganization(org);
        }
      } catch (error) {
        console.error('Error loading knowledge base data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-6 py-24 bg-primary/5">
          <div className="container mx-auto text-center space-y-4">
            <Skeleton className="h-12 w-96 mx-auto" />
          </div>
        </div>
        <div className="container mx-auto py-12 space-y-12">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!settings || !organization) {
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
        currentView="home"
        onViewChange={() => {}}
        isPreview={false}
        onCategoryClick={handleCategoryClick}
        onArticleClick={handleArticleClick}
      />
    </KnowledgeBaseLayout>
  );
}