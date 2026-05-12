export type Category = 'personal' | 'career' | 'love' | 'health' | 'adventure' | 'other';

export interface Wish {
  id: string;
  title: string;
  content: string;
  category: Category;
  important: boolean;
  archived: boolean;
  reminder: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ThemeName = 'dark' | 'midnight' | 'forest' | 'blossom';
export type FontStyle = 'default' | 'serif' | 'mono';
export type SortOrder = 'newest' | 'oldest' | 'important';

export interface AppSettings {
  theme: ThemeName;
  fontStyle: FontStyle;
  sortOrder: SortOrder;
}

