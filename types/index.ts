export interface App {
  id: string;
  name: string;
  nameJa?: string;
  url: string;
  description?: string;
  descriptionJa?: string;
  category?: string;
  createdAt: string;
}

export type AppFormData = Omit<App, 'id' | 'createdAt'>;
