export type Recipe = {
  id: number;
  title: string;
  slug: string;
  description: string;
  ingredients: string[];
  directions: string[];
  created_at: Date;
  updated_at: Date;
};
