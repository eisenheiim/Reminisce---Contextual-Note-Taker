export type ContextType = 
  | 'meeting' 
  | 'ideas' 
  | 'projects' 
  | 'feelings' 
  | 'birthdays' 
  | 'think-later' 
  | 'other';

export type FontOption = 'sans' | 'serif' | 'mono' | 'display';
export type ColorOption = 'default' | 'sepia' | 'ocean' | 'forest' | 'rose';

export interface Note {
  id: string;
  title: string;
  content: string;
  context: ContextType;
  fontFamily?: FontOption;
  colorTheme?: ColorOption;
  createdAt: number;
  updatedAt: number;
}

export interface ContextConfig {
  id: ContextType;
  label: string;
  icon: string;
  color: string;
  description: string;
}
