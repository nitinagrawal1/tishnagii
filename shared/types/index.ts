export type PageRoute =
  | 'home'
  | 'shop'
  | 'categories'
  | 'product-detail'
  | 'about'
  | 'blog'
  | 'blog-detail'
  | 'contact'
  | 'faq'
  | 'wishlist'
  | 'cart'
  | 'account'
  | 'order-success'
  | 'shipping'
  | 'returns'
  | 'privacy'
  | 'terms'
  | 'sitemap'
  | '404';

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

export interface ProductSpecification {
  metalBase: string;
  plating: string;
  stones: string;
  finish: string;
  weightGrams: number;
  dimensions: string;
  closure: string;
  careInstructions: string;
  hypoallergenic: boolean;
}

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  slug: string;
  category: 'necklaces' | 'earrings' | 'bangles' | 'maang-tikka' | 'rings' | 'bridal-sets';
  categoryLabel: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  description: string;
  editorialNote?: string;
  images: string[];
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  specifications: ProductSpecification;
  reviews: Review[];
}

export interface CategoryItem {
  id: string;
  name: string;
  hindiName: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  featureTag: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  aliases?: string[];
  excerpt: string;
  category: string;
  shortCategory?: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  coverImage: string;
  content: string[];
  tips?: string[];
  relatedProductSlugs?: string[];
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'Orders & Shipping' | 'Jewellery Care' | 'Materials & Quality' | 'Custom Bridal' | 'Returns & Exchange';
}
