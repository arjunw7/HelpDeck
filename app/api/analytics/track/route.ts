import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const body = await request.json();
    const { articleId, visitorId, orgId, duration } = body;

    // Record page view
    const { error } = await supabase
      .from("page_views")
      .insert([
        {
          article_id: articleId,
          visitor_id: visitorId,
          duration,
          org_id: orgId,
        },
      ]);

    if (error) throw error;

    // Update article views count
    const { error: updateError } = await supabase.rpc('increment_article_views', {
      article_id: articleId
    });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking analytics:", error);
    return NextResponse.json(
      { error: "Failed to track analytics" },
      { status: 500 }
    );
  }
}