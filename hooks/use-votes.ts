"use client";

import { useState, useEffect } from 'react';
import { updateArticleVotes, updateChangeLogVotes } from '@/lib/api/votes';
import { toast } from 'sonner';

interface VoteState {
  upvotes: number;
  downvotes: number;
}

export function useVotes(id: string, type: 'article' | 'changelog', initialVotes: VoteState) {
  const [votes, setVotes] = useState<VoteState>(initialVotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const storageKey = `${type}_votes_${id}`;
  const userStorageKey = `${type}_user_vote_${id}`;

  useEffect(() => {
    // Load votes from localStorage
    const storedVotes = localStorage.getItem(storageKey);
    if (storedVotes) {
      setVotes(JSON.parse(storedVotes));
    } else {
      setVotes(initialVotes);
    }
    
    // Load user's vote
    const storedUserVote = localStorage.getItem(userStorageKey);
    if (storedUserVote) {
      setUserVote(storedUserVote as 'up' | 'down');
    }
  }, [id, storageKey, userStorageKey]);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (userVote === voteType) return;

    const newVotes = { ...votes };
    const updateFn = type === 'article' ? updateArticleVotes : updateChangeLogVotes;

    try {
      // Remove previous vote if exists
      if (userVote) {
        if (userVote === 'up') newVotes.upvotes--;
        if (userVote === 'down') newVotes.downvotes--;
        await updateFn(id, userVote, true);
      }

      // Add new vote
      if (voteType === 'up') newVotes.upvotes++;
      if (voteType === 'down') newVotes.downvotes++;
      await updateFn(id, voteType);

      // Update local state and storage
      setVotes(newVotes);
      setUserVote(voteType);
      localStorage.setItem(storageKey, JSON.stringify(newVotes));
      localStorage.setItem(userStorageKey, voteType);
    } catch (error) {
      console.error('Error updating votes:', error);
      toast.error('Failed to update vote');
    }
  };

  return {
    votes,
    userVote,
    handleVote
  };
}