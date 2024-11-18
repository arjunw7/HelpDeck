"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { KnowledgeBaseLayout } from "@/components/knowledge-base/shared/layout";
import { KnowledgeBaseSettings } from "@/stores/customize";
import { GridTemplate } from "@/components/customize/preview/templates/grid";

interface Organization {
  id: string;
  name: string;
  logo: string;
}


export default function ChangeLogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [settings, setSettings] = useState<KnowledgeBaseSettings | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [releaseNoteId, setReleaseNoteId] = useState<string | null>(null);
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
            .select('name')
            .eq('id', data.organizationId)
            .single();

          setOrganization(org);
          setReleaseNoteId(params.id);
        }
      } catch (error) {
        console.error('Error loading change log:', error);
        toast.error('Failed to load change log');
        router.push('/kb/change-logs');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [params.id]);


  if (!settings || !releaseNoteId) {
    return null;
  }

  const handleReleaseNoteClick = (id: string) => {
    router.push(`/kb/change-logs/${id}`);
  };

  return (
    <KnowledgeBaseLayout settings={settings}>
      <GridTemplate 
        settings={settings}
        organizationName={organization?.name}
        currentView="changelog"
        selectedRelaseNoteId={releaseNoteId}
        onViewChange={() => router.push('/kb/change-logs')}
        onCategoryClick={() => {}}
        onArticleClick={() => {}}
      />
    </KnowledgeBaseLayout>
  );
}