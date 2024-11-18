export const PREVIEW_DATA = {
  categories: [
    {
      id: "cat-1",
      name: "Getting Started",
      description: "Essential guides to help you get up and running quickly",
      icon: "🚀",
      slug: "getting-started",
      accessibility: "public",
      parent_id: null,
    },
    {
      id: "cat-2-1",
      name: "Basic Features",
      description: "Learn about the core features",
      icon: "⭐",
      slug: "basic-features",
      accessibility: "public",
      parent_id: "cat-1",
    },
    {
      id: "cat-2-2",
      name: "Advanced Features",
      description: "Explore advanced functionality",
      icon: "💫",
      slug: "advanced-features",
      accessibility: "public",
      parent_id: "cat-1",
    },
    {
      id: "cat-2",
      name: "User Guide",
      description: "Comprehensive guides for using all features",
      icon: "📚",
      slug: "user-guide",
      accessibility: "public",
      parent_id: null,
    },
    {
      id: "cat-3",
      name: "API Documentation",
      description: "Technical documentation for developers",
      icon: "⚡",
      slug: "api-docs",
      accessibility: "public",
      parent_id: null,
      subcategories: [
        {
          id: "cat-3-1",
          name: "REST API",
          description: "REST API endpoints and usage",
          icon: "🔌",
          slug: "rest-api",
          accessibility: "public",
          parent_id: "cat-3",
        },
      ],
    },
    {
      id: "cat-4",
      name: "Troubleshooting",
      description: "Common issues and their solutions",
      icon: "🔧",
      slug: "troubleshooting",
      accessibility: "public",
      parent_id: null,
    },
    {
      id: "cat-5",
      name: "Best Practices",
      description: "Recommended approaches and tips",
      icon: "✨",
      slug: "best-practices",
      accessibility: "public",
      parent_id: null,
    },
    {
      id: "cat-6",
      name: "FAQs",
      description: "Frequently asked questions",
      icon: "❓",
      slug: "faqs",
      accessibility: "public",
      parent_id: null,
    },
  ],
  articles: [
    {
      id: "art-1",
      title: "Quick Start Guide",
      subtitle: "Get up and running in 5 minutes",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Welcome to our platform! This guide will help you get started quickly.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Installation" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Follow these simple steps to install and configure the platform.",
              },
            ],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Step 1: Download the package" }],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Step 2: Run the installer" }],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Step 3: Configure settings" }],
                  },
                ],
              },
            ],
          },
        ],
      },
      category_id: "cat-1",
      status: "published",
      visibility: "public",
      views: 1250,
      upvotes: 45,
      downvotes: 2,
      profiles: { full_name: "John Doe" },
      categories: { name: "Getting Started" },
      created_at: "2024-03-01T00:00:00Z",
    },
    {
      id: "art-2",
      title: "Setting up roles and permissions",
      subtitle: "Access control, user managament and security policies",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Welcome to our platform! This guide will help you get started quickly.",
              },
            ],
          },
        ],
      },
      category_id: "cat-2-1",
      status: "published",
      visibility: "public",
      views: 1250,
      upvotes: 45,
      downvotes: 2,
      profiles: { full_name: "John Doe" },
      categories: { name: "Getting Started" },
      created_at: "2024-03-01T00:00:00Z",
    },
    {
      id: "art-3",
      title: "Basic Features Overview",
      subtitle: "Learn about core functionality",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Explore the essential features that make our platform powerful.",
              },
            ],
          },
        ],
      },
      category_id: "cat-2-1",
      status: "published",
      visibility: "public",
      views: 980,
      upvotes: 32,
      downvotes: 1,
      profiles: { full_name: "Jane Smith" },
      categories: { name: "Basic Features" },
      created_at: "2024-03-02T00:00:00Z",
    },
    {
      id: "art-4",
      title: "REST API Authentication",
      subtitle: "Learn how to authenticate API requests",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Secure your API requests with proper authentication.",
              },
            ],
          },
        ],
      },
      category_id: "cat-2-2",
      status: "published",
      visibility: "public",
      views: 756,
      upvotes: 28,
      downvotes: 0,
      profiles: { full_name: "Alex Johnson" },
      categories: { name: "REST API" },
      created_at: "2024-03-03T00:00:00Z",
    },
  ],
};