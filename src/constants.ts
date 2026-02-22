import { ContextConfig, FontOption, ColorOption } from './types';

export const CONTEXTS: ContextConfig[] = [
  {
    id: 'meeting',
    label: 'After Meeting',
    icon: 'Users',
    color: 'bg-[#E6D5C3]', // Lightest brown
    description: 'Summarize discussions and action items.'
  },
  {
    id: 'ideas',
    label: 'Sudden Ideas',
    icon: 'Lightbulb',
    color: 'bg-[#DCC7B0]',
    description: 'Capture flashes of inspiration.'
  },
  {
    id: 'projects',
    label: 'Future Projects',
    icon: 'Briefcase',
    color: 'bg-[#D2B48C]', // Tan
    description: 'Plan your next big thing.'
  },
  {
    id: 'feelings',
    label: 'Feelings',
    icon: 'Heart',
    color: 'bg-[#C8A278]',
    description: 'Reflect on your emotions and experiences.'
  },
  {
    id: 'birthdays',
    label: 'Birthdays & Events',
    icon: 'Gift',
    color: 'bg-[#BE9060]',
    description: 'Never miss a special day.'
  },
  {
    id: 'think-later',
    label: 'Think Later',
    icon: 'Clock',
    color: 'bg-[#B47E48]',
    description: 'Park thoughts for deeper reflection.'
  },
  {
    id: 'other',
    label: 'Other Contexts',
    icon: 'MoreHorizontal',
    color: 'bg-[#A66C30]', // Darkest of the light browns
    description: 'Anything else on your mind.'
  }
];

export const FONTS: { id: FontOption; label: string; class: string }[] = [
  { id: 'sans', label: 'Modern Sans', class: 'font-sans' },
  { id: 'serif', label: 'Classic Serif', class: 'font-serif' },
  { id: 'display', label: 'Elegant Display', class: 'font-display' },
  { id: 'mono', label: 'Technical Mono', class: 'font-mono' },
];

export const COLORS: { id: ColorOption; label: string; text: string; preview: string }[] = [
  { id: 'default', label: 'Ink Black', text: 'text-warm-900', preview: 'bg-warm-900' },
  { id: 'sepia', label: 'Deep Sepia', text: 'text-[#5b4636]', preview: 'bg-[#5b4636]' },
  { id: 'ocean', label: 'Ocean Blue', text: 'text-[#2c3e50]', preview: 'bg-[#2c3e50]' },
  { id: 'forest', label: 'Forest Green', text: 'text-[#2d3436]', preview: 'bg-[#2d3436]' },
  { id: 'rose', label: 'Dusty Rose', text: 'text-[#4a3135]', preview: 'bg-[#4a3135]' },
];
