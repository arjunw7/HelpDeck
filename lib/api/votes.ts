import { supabase } from "@/lib/supabase";

export async function updateArticleVotes(articleId: string, type: 'up' | 'down', remove?: boolean) {
  // First get current vote counts
  const { data: article, error: fetchError } = await supabase
    .from('articles')
    .select('upvotes, downvotes')
    .eq('id', articleId)
    .single();

  if (fetchError) throw fetchError;

  // Calculate new vote counts
  const field = type === 'up' ? 'upvotes' : 'downvotes';
  const currentValue = article?.[field] || 0;
  const newValue = currentValue + (remove ? -1 : 1);

  // Update with new value
  const { data, error } = await supabase
    .from('articles')
    .update({
      [field]: Math.max(0, newValue), // Prevent negative votes
      updated_at: new Date().toISOString(),
    })
    .eq('id', articleId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateChangeLogVotes(changeLogId: string, type: 'up' | 'down', remove?: boolean) {
  // First get current vote counts
  const { data: changeLog, error: fetchError } = await supabase
    .from('release_notes')
    .select('upvotes, downvotes')
    .eq('id', changeLogId)
    .single();

  if (fetchError) throw fetchError;

  // Calculate new vote counts
  const field = type === 'up' ? 'upvotes' : 'downvotes';
  const currentValue = changeLog?.[field] || 0;
  const newValue = currentValue + (remove ? -1 : 1);

  // Update with new value
  const { data, error } = await supabase
    .from('release_notes')
    .update({
      [field]: Math.max(0, newValue), // Prevent negative votes
      updated_at: new Date().toISOString(),
    })
    .eq('id', changeLogId)
    .select()
    .single();

  if (error) throw error;
  return data;
}