
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  tags: string[];
  category: string; 
  subcategory?: string; 
  content: string; 
  image?: string; 
  wordCount: number; // New field for word count
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export interface NavConfigItem {
  key: string;
  path: string;
  folder: string; 
  titleKey: string; 
  subtitleKey?: string;
  icon?: any; 
}

export interface UserProfile {
  userId: string; // Unique Fingerprint ID
  nickname: string;
  avatar: string; // URL or gradient config
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string; // To verify ownership
  name: string;
  avatar?: string;
  content: string;
  date: string;
  browserInfo?: string; // For fingerprinting debug/display
}
