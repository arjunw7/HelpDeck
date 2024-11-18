-- Create function to automatically expire invitations
create or replace function expire_invitations() returns trigger as $$
begin
  update invitations
  set status = 'expired',
      updated_at = now()
  where status = 'pending'
    and expires_at < now();
  return null;
end;
$$ language plpgsql;

-- Create trigger to run expiration check periodically
create or replace trigger check_invitation_expiry
  after insert or update on invitations
  for each statement
  execute function expire_invitations();