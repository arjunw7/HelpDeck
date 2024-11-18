import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const headersList = headers();
  
  try {
    const settings = headersList.get('x-kb-settings');
    const organizationId = headersList.get('x-organization-id');

    if (!settings || !organizationId) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    // Get SEO settings
    const { data: org } = await supabase
      .from("organizations")
      .select("seo_settings")
      .eq("id", organizationId)
      .single();

    return NextResponse.json({
      settings: JSON.parse(settings),
      organizationId,
      seoSettings: org?.seo_settings || null
    });
  } catch (error) {
    console.error('Error getting KB settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}