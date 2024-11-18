import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sendInvitationEmail } from "@/lib/email";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const body = await request.json();
    const { email, role, orgId, orgName, userId, expiryDate } = body;

    if (!email || !role || !orgId || !orgName || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for existing profile
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .eq("org_id", orgId)
      .single();

    if (existingProfile) {
      return NextResponse.json(
        { error: "User already exists in this organization" },
        { status: 400 }
      );
    }

    // Check for existing invitation
    const { data: existingInvite } = await supabase
      .from("invitations")
      .select("*")
      .eq("email", email)
      .eq("org_id", orgId)
      .not("status", "eq", "expired")
      .single();

    const token = uuidv4();
    const expires = expiryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    if (existingInvite) {
      // Update existing invitation
      const { error: updateError } = await supabase
        .from("invitations")
        .update({
          role,
          status: "pending",
          token,
          expires_at: expires,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingInvite.id);

      if (updateError) throw updateError;
    } else {
      // Create new invitation
      const { error: createError } = await supabase
        .from("invitations")
        .insert([
          {
            email,
            role,
            org_id: orgId,
            invited_by: userId,
            status: "pending",
            token,
            expires_at: expires,
          },
        ]);

      if (createError) throw createError;
    }

    // Generate invitation URL
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/accept-invite?token=${token}`;

    // Send invitation email
    await sendInvitationEmail(email, inviteUrl, orgName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 }
    );
  }
}