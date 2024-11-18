"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { KnowledgeBaseLayout } from "@/components/knowledge-base/shared/layout";
import { KnowledgeBaseSettings } from "@/stores/customize";
import { GridTemplate } from "@/components/customize/preview/templates/grid";

interface Organization {
  id: string;
  name: string;
  logo: string;
}

export default function ChangeLogsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<KnowledgeBaseSettings | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

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
            .select('name,id,logo')
            .eq('id', data.organizationId)
            .single();

          setOrganization(org);
        }
      } catch (error) {
        console.error('Error loading change logs:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleChangeLogClick = (id: string) => {
    router.push(`/kb/change-logs/${id}`);
  };

  if (!settings || !organization) {
    return null;
  }

  return (
    <KnowledgeBaseLayout settings={settings}>
      <GridTemplate 
        settings={settings}
        organization={organization}
        currentView="changelog-list"
        onViewChange={() => router.push('/kb')}
        handleReleaseNoteClick={handleChangeLogClick}
        onCategoryClick={() => {}}
        onArticleClick={() => {}}
      />
    </KnowledgeBaseLayout>
  );
}