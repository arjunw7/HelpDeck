"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Circle, ChevronDown, Trash2, Globe, Lock, Check } from "lucide-react";
import Link from "next/link";
import { useCategories } from "@/hooks/use-categories";
import { useArticles } from "@/hooks/use-articles";
import { Editor } from "@/components/articles/editor";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ArticleEditSkeleton } from "@/components/skeletons/article-edit-skeleton";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/lib/supabase";

const statusOptions = [
  { value: "published", label: "Published", color: "text-green-500" },
  { value: "draft", label: "Draft", color: "text-gray-500" },
  { value: "archived", label: "Archived", color: "text-red-500" },
] as const;

const visibilityOptions = [
  { value: "public", label: "Public", icon: Globe },
  { value: "private", label: "Private", icon: Lock },
] as const;

type ArticleStatus = "published" | "draft" | "archived";

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { categories } = useCategories();
  const { articles, updateArticle, deleteArticle, isUpdating } = useArticles();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: {},
    visibility: "private" as "public" | "private",
    category_id: "",
    slug: "",
    status: "draft" as ArticleStatus,
    related_articles: [] as string[],
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchArticle() {
      try {
        const { data: article, error } = await supabase
          .from("articles")
          .select(`
            *,
            profiles:created_by (
              full_name
            ),
            categories:category_id (
              name
            )
          `)
          .eq("id", params.id)
          .single();

        if (error) throw error;

        if (isMounted && article) {
          setFormData({
            title: article.title,
            subtitle: article.subtitle || "",
            content: article.content,
            visibility: article.visibility,
            category_id: article.category_id,
            slug: article.slug,
            status: article.status as ArticleStatus,
            related_articles: article.related_articles || [],
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        toast.error("Failed to load article");
        router.push("/knowledge-base/articles");
      }
    }

    fetchArticle();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  if (isLoading) {
    return <ArticleEditSkeleton />;
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleStatusChange = async (newStatus: ArticleStatus) => {
    try {
      await updateArticle({
        id: params.id,
        data: {
          ...formData,
          status: newStatus,
        },
      });
      setFormData(prev => ({ ...prev, status: newStatus }));
      toast.success(`Article ${newStatus === "archived" ? "archived" : `marked as ${newStatus}`}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update article status");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteArticle(params.id);
      toast.success("Article deleted successfully");
      router.push("/knowledge-base/articles");
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.category_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updateArticle({
        id: params.id,
        data: formData,
      });
      
      router.push("/knowledge-base/articles");
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error("Failed to update article");
    }
  };

  const getCurrentStatus = () => {
    return statusOptions.find(option => option.value === formData.status) || statusOptions[1];
  };

  // Filter out the current article from the available related articles
  const availableArticles = articles.filter(
    article => article.id !== params.id && article.status === "published"
  );

  return (
    <div className="container max-w-5xl py-4 px-4">
      <div className="mb-4">
        <Link
          href="/knowledge-base/articles"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Articles
        </Link>
      </div>

      <Card className="border-0">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Edit Article</h1>
              <p className="text-sm text-muted-foreground">
                Update your article content and settings
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Circle className={cn("h-2 w-2 fill-current", getCurrentStatus().color)} />
                    {getCurrentStatus().label}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {statusOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleStatusChange(option.value)}
                      className="gap-2"
                    >
                      <Circle className={cn("h-2 w-2 fill-current", option.color)} />
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="destructive"
                size="icon"
                type="button"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter article title"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="article-slug"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subtitle">Subtitle (Optional)</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                }
                placeholder="Enter article subtitle"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value: "public" | "private") =>
                  setFormData((prev) => ({ ...prev, visibility: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  {visibilityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <option.icon className="mr-2 h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Related Articles (Max 3)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <span>
                      {formData.related_articles.length > 0
                        ? `${formData.related_articles.length} article${
                            formData.related_articles.length === 1 ? "" : "s"
                          } selected`
                        : "Select related articles"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search articles..." />
                    <CommandEmpty>No articles found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {availableArticles.map((article) => (
                        <CommandItem
                          key={article.id}
                          onSelect={() => {
                            setFormData((prev) => {
                              const newRelated = prev.related_articles.includes(article.id)
                                ? prev.related_articles.filter((id) => id !== article.id)
                                : prev.related_articles.length < 3
                                ? [...prev.related_articles, article.id]
                                : prev.related_articles;
                              return { ...prev, related_articles: newRelated };
                            });
                          }}
                        >
                          <div className="flex items-center">
                            <div
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                formData.related_articles.includes(article.id)
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50 [&_svg]:invisible"
                              )}
                            >
                              <Check className="h-4 w-4" />
                            </div>
                            <span>{article.title}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">
                Select up to 3 related articles that will be shown at the bottom of this article
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Content</Label>
              <Editor
                initialContent={formData.content}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, content }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the article.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Article
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}