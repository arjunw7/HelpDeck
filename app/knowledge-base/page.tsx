"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, FileText, Users, Eye, ThumbsUp, ThumbsDown, Clock, CalendarIcon } from "lucide-react";
import { useArticles } from "@/hooks/use-articles";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { differenceInDays, format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

interface PageView {
  id: string;
  article_id: string;
  visitor_id: string;
  duration: number;
  created_at: string;
}

interface TopArticle {
  id: string;
  title: string;
  views: number;
  upvotes: number;
  downvotes: number;
  slug: string;
}

export default function AnalyticsPage() {
  const { user, organization } = useAuth();
  const { articles } = useArticles(organization?.id);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });

  useEffect(() => {
    async function fetchAnalytics() {
      if (!user || !date?.from || !date?.to) return;

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("org_id, full_name")
          .eq("id", user.id)
          .single();
        if (!profile?.org_id) return;
        setFullName(profile?.full_name);
        
        // Fetch page views for the selected date range
        const { data: views, error } = await supabase
          .from("page_views")
          .select("*")
          .eq("org_id", profile.org_id)
          .gte("created_at", date.from.toISOString())
          .lte("created_at", date.to.toISOString());
        if (error) throw error;
        setPageViews(views || []);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, [user, date]);

  // Calculate analytics
  const totalViews = pageViews.length;
  const uniqueVisitors = new Set(pageViews.map(view => view.visitor_id)).size;
  const avgTimeOnPage = pageViews.length > 0
    ? Math.round(pageViews.reduce((acc, view) => acc + (view.duration || 0), 0) / pageViews.length)
    : 0;

  // Calculate period growth
  const previousPeriodStart = subMonths(date?.from || new Date(), 1);
  const previousPeriodViews = pageViews.filter(view => {
    const viewDate = new Date(view.created_at);
    return viewDate >= previousPeriodStart && viewDate < (date?.from || new Date());
  }).length;

  const periodGrowth = previousPeriodViews > 0
    ? Math.round(((totalViews - previousPeriodViews) / previousPeriodViews) * 100)
    : 0;

  // Get top articles
  const topArticles: TopArticle[] = articles
    .filter(article => article.status === "published")
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map(article => ({
      id: article.id,
      title: article.title,
      views: article.views,
      upvotes: article.upvotes || 0,
      downvotes: article.downvotes || 0,
      slug: article.slug,
    }));

  // Calculate total engagement
  const totalUpvotes = articles.reduce((acc, article) => acc + (article.upvotes || 0), 0);
  const totalDownvotes = articles.reduce((acc, article) => acc + (article.downvotes || 0), 0);
  const engagementRate = totalViews > 0
    ? Math.round(((totalUpvotes + totalDownvotes) / totalViews) * 100)
    : 0;

  const stats = [
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      description: periodGrowth > 0 ? `+${periodGrowth}% from previous period` : "No previous data",
    },
    {
      title: "Unique Visitors",
      value: uniqueVisitors.toLocaleString(),
      icon: Users,
      description: "This period",
    },
    {
      title: "Published Articles",
      value: articles.filter(a => a.status === "published").length.toString(),
      icon: FileText,
      description: `${articles.filter(a => a.status === "draft").length} drafts`,
    },
    {
      title: "Avg. Time on Page",
      value: `${Math.floor(avgTimeOnPage / 60)}m ${avgTimeOnPage % 60}s`,
      icon: Clock,
      description: "Per session",
    },
  ];

  return (
    <div className="px-[20px] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-md text-muted-foreground">
              👋 Hi, {fullName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart2 className="h-5 w-5" />
              Top Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topArticles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-8 w-8 text-muted-foreground/50" />
                <h3 className="mt-4 text-sm font-semibold">No Articles Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Publish some articles to see analytics
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {topArticles.map((article, index) => (
                  <Link 
                    key={article.id}
                    href={`/knowledge-base/articles/${article.id}/edit`}
                    className="block"
                  >
                    <div className="flex items-start justify-between hover:bg-muted/50 p-2 rounded-lg transition-colors">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {index + 1}. {article.title}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {article.upvotes}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsDown className="h-3 w-3" />
                            {article.downvotes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              User Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {totalUpvotes}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Total Upvotes
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">
                    {totalDownvotes}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Total Downvotes
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Engagement Rate</span>
                  <span className="font-medium">{engagementRate}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      engagementRate > 75 ? "bg-green-500" :
                      engagementRate > 50 ? "bg-yellow-500" :
                      "bg-red-500"
                    )}
                    style={{ width: `${engagementRate}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on total interactions vs. page views
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}