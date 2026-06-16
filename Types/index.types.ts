export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  old_price: string;
  image: string;
  is_hit: boolean;
  is_new: boolean;
  is_sale: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
  category: number;
}

export interface IProductResponse {
  count: number;
  page: number;
  page_size: number;
  results: IProduct[];
}

export interface ICartItem {
  id: number;
  product: number;
  quantity: number;
  product_data?: {
    id: number;
    name: string;
    price: string;
    image: string;
  };
}

export interface ICart {
  id: number;
  user: number;
  items: ICartItem[];
}

export interface IWishlist {
  id: number;
  product: number;
  product_detail: IProduct;
  created_at: string;
}

export interface IComparisons {
  id: number;
  name: string;
  products: IProduct[];
  products_detail: string;
  created_at: string;
  updated_at: string;
}
export interface IRegister {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
export interface ILogin {
  username?: string;
  email?: string;
  phone?: string;
  password: string;
}

export interface ILoginResponse {
  user: {
    [key: string]: string;
  };
  refresh: string;
  access: string;
}

export interface IBlog {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}
export interface IChangePassword {
  old_password: string;
  new_password: string;
  password: string;
}

export interface IEditProfile {
  id: number,
  username: string,
  email: string,
  first_name: string,
  last_name: string,
}


export interface ITeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  email: string;
  phone: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  profile_image: string;
}

export interface ICompanyInfo {
  vision: string;
  established_year: number;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  website: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  logo: string;
  cover_image: string;
  team_members: ITeamMember[];
}

export interface IPayment {
  id: number;
  amount: number;
  method: string;
  status: string;
  created_at: string;
  order: number;
}

export interface IEditProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface IDiscount {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  discount_percent: number;
  products: number[];
  products_detail: string;
  is_published: boolean;
  starts_at: string;
  ends_at: string;
  created_at: string;
  updated_at: string;
}

export interface ICategory {
  id: number;
  name: string;
}