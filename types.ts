
export interface Demo {
  id: string;
  title: string;
  category: 'Diagnostics' | 'Hospital Management' | 'Patient Care';
  description: string;
  features: string[];
  problemSolved: string;
  url: string;
  keywords: string[];
}

export type View = 'welcome' | 'menu' | 'demoList' | 'consultation' | 'demoDetail';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  recommendedDemos?: Demo[];
}
