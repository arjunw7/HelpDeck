import { KnowledgeBaseSettings } from "@/stores/customize";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, User, Calendar, ThumbsUp, ThumbsDown } from "lucide-react";
import { PREVIEW_DATA } from "@/lib/preview-data";
import { ContactSupport } from "./contact-support";
import { useReleaseNotes } from "@/hooks/use-release-notes";
import { cn } from "@/lib/utils";
import { useVotes } from "@/hooks/use-votes";

interface ChangeLogViewProps {
  settings: KnowledgeBaseSettings;
  changeLogId?: string;
  onViewChange: (view: "home" | "collection" | "article" | "changelog-list" | "changelog") => void;
  isPreview?: boolean;
  activeDevice?: string;
  organization: any,
}

export function ChangeLogView({
  settings,
  changeLogId,
  onViewChange,
  isPreview = false,
  activeDevice,
  organization,
}: ChangeLogViewProps) {
  const { releaseNotes, isLoading } = useReleaseNotes(organization?.id);

  const getChangeLog = () => {
    if (isPreview) {
      return PREVIEW_DATA.articles[0];
    }
    return releaseNotes.find(a => a.id === changeLogId);
  };

  const note = getChangeLog();
  
  const { votes, userVote, handleVote } = useVotes(
    note?.id || '', 
    'changelog',
    { 
      upvotes: note?.upvotes || 0, 
      downvotes: note?.downvotes || 0 
    }
  );

  const formatContent = (content: any) => {
    if (!content) return '';
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content);
      } catch (e) {
        return content;
      }
    }
    
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

  if (!note) return null;

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
          <ChevronRight className="h-4 w-4 opacity-50" />
          <span>{note?.title}</span>
        </div>
        
        <Card className="p-6">
          <div className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{note?.version || `v1.0.${note.id}`}</h1>
                <div className="flex items-center gap-4 mt-2">
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
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">{note.title}</h2>
              <div className="flex gap-2 mb-6">
                {note?.type?.map((type) => (
                  <Badge key={type} variant="outline">{type}</Badge>
                ))}
              </div>
              <div 
                className="prose prose-neutral dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formatContent(note.content || note?.description) }}
              />
            </div>
          </div>

          {/* Voting Section */}
          <div className="mt-8 flex flex-col items-center gap-4 pt-8 border-t">
            <p className="text-sm text-muted-foreground">Was this change log helpful?</p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => !isPreview && handleVote('up')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                  userVote === 'up' 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'hover:bg-muted'
                )}
                disabled={isPreview || userVote === 'up'}
              >
                <ThumbsUp className="h-5 w-5" />
                <span>{votes.upvotes}</span>
              </button>
              <button
                onClick={() => !isPreview && handleVote('down')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                  userVote === 'down' 
                    ? 'bg-red-500/10 text-red-500' 
                    : 'hover:bg-muted'
                )}
                disabled={isPreview || userVote === 'down'}
              >
                <ThumbsDown className="h-5 w-5" />
                <span>{votes.downvotes}</span>
              </button>
            </div>
          </div>
        </Card>

        {settings.content.showContactSupport && settings.content.contactEmail && (
          <ContactSupport settings={settings} />
        )}
      </div>
    </>
  );
}