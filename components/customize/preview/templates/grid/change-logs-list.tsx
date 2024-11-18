import { KnowledgeBaseSettings } from "@/stores/customize";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ChevronRight } from "lucide-react";
import { PREVIEW_DATA } from "@/lib/preview-data";
import { useReleaseNotes } from "@/hooks/use-release-notes";
import { ContactSupport } from "./contact-support";
import { SubscribeModal } from "@/components/knowledge-base/shared/subscribe-modal";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChangeLogsListProps {
  settings: KnowledgeBaseSettings;
  onChangeLogClick?: (id: string) => void;
  isPreview?: boolean;
  activeDevice?: string;
  onViewChange?: any,
  organization: any,
}

export function ChangeLogsList({
  settings,
  onChangeLogClick,
  isPreview = false,
  activeDevice,
  onViewChange,
  organization,
}: ChangeLogsListProps) {
  
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const { releaseNotes, isLoading } = useReleaseNotes(organization?.id);

  const getReleaseNotes = () => {
    if (isPreview) {
      return PREVIEW_DATA.articles.slice(0, 3);
    }
    return releaseNotes.filter(note => note.status === "published").sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  };

  const formatContent = (content: any) => {
    if (!content) return '';
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content);
      } catch (e) {
        return content;
      }
    }
    
    // Handle TipTap JSON content
    if (content.type === 'doc') {
      return content.content
        .map((node: any) => {
          switch (node.type) {
            case 'paragraph':
              return node.content?.map((c: any) => c.text).join('') || '';
            case 'heading':
              return node.content?.map((c: any) => c.text).join('') || '';
            case 'bulletList':
              return node.content?.map((item: any) => 
                `• ${item.content?.map((p: any) => 
                  p.content?.map((c: any) => c.text).join('')
                ).join('')}`
              ).join('\n');
            case 'orderedList':
              return node.content?.map((item: any, index: number) => 
                `${index + 1}. ${item.content?.map((p: any) => 
                  p.content?.map((c: any) => c.text).join('')
                ).join('')}`
              ).join('\n');
            case 'blockquote':
              return node.content?.map((p: any) => 
                `"${p.content?.map((c: any) => c.text).join('')}"`
              ).join('\n');
            default:
              return '';
          }
        })
        .filter((text: string) => text.trim())
        .join('\n')
        .replace(/\n{3,}/g, '\n\n');
    }
    
    return '';
  };

  return (
    <>
      <div className="px-[5%] py-6">
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
            onClick={() => onViewChange("changelog-list")}
            className="hover:opacity-80 cursor-pointer"
          >
            Change Logs
          </button>
        </div>
        <div className="grid gap-6">
          {getReleaseNotes().map((note) => (
            <Card 
              key={note.id}
              className="p-6 cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => onChangeLogClick?.(note.id)}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{note?.version || `v1.0.${note.id}`}</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {note.profiles.full_name}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(note.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={cn("bg-green-500/10 text-green-500")}
                >
                  {note?.status}
                </Badge>
              </div>
              <div className="space-y-4 mt-4">
                <h4 className="text-xl font-semibold">{note.title}</h4>
                <div className="flex gap-2">
                  {
                    note?.type?.map((item) => (
                      <Badge variant="outline">{item}</Badge>
                    ))
                  }
                </div>
                <div className="relative">
                  <div 
                    className="text-sm text-muted-foreground overflow-hidden"
                    style={{ 
                      maxHeight: '100px',
                      whiteSpace: 'pre-line',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                      maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
                    }}
                  >
                    {formatContent(note.content || note?.description)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {settings.content.showContactSupport && settings.content.contactEmail && (
        <ContactSupport settings={settings} />
      )}

      <SubscribeModal
        open={showSubscribeModal}
        onOpenChange={setShowSubscribeModal}
      />
    </>
  );
}