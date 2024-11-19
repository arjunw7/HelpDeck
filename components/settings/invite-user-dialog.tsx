"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { usePlanLimits } from "@/hooks/use-plan.limits";
import { useUsers } from "@/hooks/use-users";

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function InviteUserDialog({
  open,
  onOpenChange,
  onSuccess,
}: InviteUserDialogProps) {
  const { user, organization } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "member",
  });
  const { userLimit, isWithinUserLimit } = usePlanLimits();
  const { users } = useUsers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization || !user) {
      toast.error("Organization or user not found");
      return;
    }
    if (!isWithinUserLimit(users.length + 1)) {
      toast.error(`You've reached the maximum user limit (${userLimit}) for your plan`);
      return;
    }

    setIsLoading(true);

    try {
      // Check for existing profile
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", formData.email)
        .eq("org_id", organization.id)
        .single();

      if (existingProfile) {
        toast.error("User already exists in this organization");
        return;
      }

      // Check for existing invitation
      const { data: existingInvite } = await supabase
        .from("invitations")
        .select("id, status")
        .eq("email", formData.email)
        .eq("org_id", organization.id)
        .not("status", "eq", "expired")
        .single();

      // Set expiry date to 7 days from now
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);

      if (existingInvite) {
        // Update existing invitation
        const { error: updateError } = await supabase
          .from("invitations")
          .update({
            role: formData.role,
            status: "pending",
            expires_at: expiryDate.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingInvite.id);

        if (updateError) throw updateError;
      }

      // Send invitation email
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          role: formData.role,
          orgId: organization.id,
          orgName: organization.name,
          userId: user.id,
          expiryDate: expiryDate.toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation');
      }

      toast.success(existingInvite ? "Invitation resent successfully" : "Invitation sent successfully");
      onSuccess();
      onOpenChange(false);
      setFormData({ email: "", role: "member" });
    } catch (error) {
      console.error("Error inviting user:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Invite a new member to join your team. They will receive an email invitation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}