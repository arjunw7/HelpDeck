import { JSONContent } from "@tiptap/react";

export function convertMarkdownToTiptap(markdown: string): JSONContent {
  const doc: JSONContent = {
    type: "doc",
    content: [],
  };

  const lines = markdown.split("\n");
  let currentList: JSONContent | null = null;
  let currentListType: "bulletList" | "orderedList" | null = null;
  let listLevel = 0;

  for (const line of lines) {
    if (!line.trim()) {
      // Add empty paragraph for blank lines
      doc.content?.push({
        type: "paragraph",
        content: [],
      });
      continue;
    }

    // Handle headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      doc.content?.push({
        type: "heading",
        attrs: { level },
        content: [{ type: "text", text: headingMatch[2] }],
      });
      currentList = null;
      currentListType = null;
      listLevel = 0;
      continue;
    }

    // Handle bullet lists (supports multiple levels with spaces or tabs)
    const bulletMatch = line.match(/^(\s*)[•*-]\s+(.+)$/);
    if (bulletMatch) {
      const indent = bulletMatch[1].length;
      const newLevel = Math.floor(indent / 2); // 2 spaces = 1 level
      const content = bulletMatch[2];

      if (currentListType !== "bulletList" || newLevel !== listLevel) {
        currentList = {
          type: "bulletList",
          content: [],
        };
        doc.content?.push(currentList);
        currentListType = "bulletList";
        listLevel = newLevel;
      }

      currentList?.content?.push({
        type: "listItem",
        content: [{
          type: "paragraph",
          content: [{ type: "text", text: content }],
        }],
      });
      continue;
    }

    // Handle numbered lists (supports multiple levels)
    const numberedMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);
    if (numberedMatch) {
      const indent = numberedMatch[1].length;
      const newLevel = Math.floor(indent / 2);
      const content = numberedMatch[2];

      if (currentListType !== "orderedList" || newLevel !== listLevel) {
        currentList = {
          type: "orderedList",
          content: [],
        };
        doc.content?.push(currentList);
        currentListType = "orderedList";
        listLevel = newLevel;
      }

      currentList?.content?.push({
        type: "listItem",
        content: [{
          type: "paragraph",
          content: [{ type: "text", text: content }],
        }],
      });
      continue;
    }

    // Handle blockquotes
    const quoteMatch = line.match(/^>\s+(.+)$/);
    if (quoteMatch) {
      doc.content?.push({
        type: "blockquote",
        content: [{
          type: "paragraph",
          content: [{ type: "text", text: quoteMatch[1] }],
        }],
      });
      currentList = null;
      currentListType = null;
      listLevel = 0;
      continue;
    }

    // Reset list context if we're not in a list item
    if (!bulletMatch && !numberedMatch) {
      currentList = null;
      currentListType = null;
      listLevel = 0;
    }

    // Handle regular paragraphs
    doc.content?.push({
      type: "paragraph",
      content: [{ type: "text", text: line }],
    });
  }

  return doc;
}