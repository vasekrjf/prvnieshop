export interface Flower {
  id: string;
  name: string;
  price: number;
  subtitle?: string; // ? znamená, že to není povinné
  section?: string;
  img?: string;      // Tvoje data mají někdy img
  imageUrl?: string; // a někdy imageUrl
}

// Položka v košíku je Květina + počet kusů
export interface CartItem extends Flower {
  quantity: number;
}

export interface Section {
  id: string;
  name: string;
}

export interface CollectionGroup {
  title: string;
  items: Flower[];
}