"use client";

import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface ArticleViewTrackerProps {
  articleId: string;
  orgId: string;
}

export function ArticleViewTracker({ articleId, orgId }: ArticleViewTrackerProps) {
  useEffect(() => {
    let startTime = Date.now();
    let visitorId = localStorage.getItem('visitor_id');

    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem('visitor_id', visitorId);
    }

    const trackPageView = async () => {
      const duration = Math.round((Date.now() - startTime) / 1000); // Convert to seconds
      try {
        console.log('orgId', orgId)
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            articleId,
            visitorId,
            duration,
            orgId,
          }),
        });
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    // Track when component unmounts or user leaves the page
    const handleUnload = () => {
      trackPageView();
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      trackPageView();
    };
  }, [articleId]);

  return null;
}