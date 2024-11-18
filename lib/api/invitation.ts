import { supabase } from '@/lib/supabase';

export interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  org_id: string;
  created_at: string;
  expires_at: string;
}

export async function cancelInvitation(invitationId: string) {
  const { error } = await supabase.rpc('cancel_invitation', {
    invitation_id: invitationId
  });

  if (error) throw error;
  return true;
}

export async function createInvitation(data: {
  email: string;
  role: string;
  orgId: string;
  userId: string;
}) {
  const { error } = await supabase.rpc('create_invitation', {
    p_email: data.email,
    p_role: data.role,
    p_org_id: data.orgId,
    p_invited_by: data.userId
  });

  if (error) throw error;
  return true;
}

export async function resendInvitation(invitationId: string) {
  const { error } = await supabase.rpc('resend_invitation', {
    invitation_id: invitationId
  });

  if (error) throw error;
  return true;
}