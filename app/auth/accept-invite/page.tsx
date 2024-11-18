"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invitation, setInvitation] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function verifyInvitation() {
      const token = searchParams?.get("token");
      if (!token) {
        toast.error("Invalid invitation link");
        router.push("/auth");
        return;
      }

      try {
        // Verify invitation token
        const { data: invite, error } = await supabase
          .from("invitations")
          .select("*, organizations(name)")
          .eq("token", token)
          .eq("status", "pending")
          .single();

        if (error || !invite) {
          throw new Error("Invalid or expired invitation");
        }

        // Check if invitation has expired
        if (new Date(invite.expires_at) < new Date()) {
          throw new Error("Invitation has expired");
        }

        setInvitation(invite);
      } catch (error) {
        console.error("Error verifying invitation:", error);
        toast.error(error instanceof Error ? error.message : "Invalid invitation");
        router.push("/auth");
      } finally {
        setIsLoading(false);
      }
    }

    verifyInvitation();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation) return;

    if (!formData.fullName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invitation.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user account");

      // Create user profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: authData.user.id,
            email: invitation.email,
            full_name: formData.fullName,
            org_id: invitation.org_id,
            role: invitation.role,
          },
        ]);

      if (profileError) throw profileError;

      // Update invitation status
      const { error: inviteError } = await supabase
        .from("invitations")
        .update({ 
          status: "accepted",
          updated_at: new Date().toISOString()
        })
        .eq("id", invitation.id);

      if (inviteError) throw inviteError;

      // Show success message and redirect
      toast.success("Account created! Please check your email to verify your account.");
      router.push("/auth/verify-email");
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Verifying invitation...</p>
      </div>
    );
  }

  return (
    <div className="container flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Accept Invitation</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You've been invited to join {invitation?.organizations?.name} on HelpDeck
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={invitation?.email}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
              }
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Accept Invitation"}
          </Button>
        </form>
      </Card>
    </div>
  );
}