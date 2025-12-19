export interface ParsedMarkdown {
  metadata: Record<string, any>;
  content: string;
}

export const parseFrontmatter = (text: string): ParsedMarkdown => {
  const lines = text.split(/\r?\n/);
  let inFrontmatter = false;
  const metadata: Record<string, any> = {};
  const contentArr: string[] = [];
  let fmCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check for '---' delimiter
    if (line.trim() === '---') {
      fmCount++;
      if (fmCount === 1) {
          inFrontmatter = true;
          continue;
      }
      if (fmCount === 2) {
          inFrontmatter = false;
          continue;
      }
    }

    if (inFrontmatter) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim();
        
        // Basic array parsing for tags: [a, b, c]
        if (value.startsWith('[') && value.endsWith(']')) {
           metadata[key] = value.slice(1, -1).split(',').map(s => s.trim());
        } else {
           metadata[key] = value;
        }
      }
    } else {
      // Only push content after the second ---
      if (fmCount >= 2) {
        contentArr.push(line);
      }
    }
  }

  // If no frontmatter was found, return the whole text as content
  if (fmCount === 0) {
      return { metadata: {}, content: text };
  }

  return { metadata, content: contentArr.join('\n').trim() };
};