import { Timestamp, FieldValue } from "firebase/firestore";

export type Category = 'sandwiches' | 'drinks' | 'extras';
export type PaymentMethod = 'pix' | 'credit' | 'debit' | 'cash';
export type OrderStatus = 'pending' | 'accepted' | 'completed' | 'rejected';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  active: boolean;
  imageUrl?: string;
}

export interface Order {
  id?: string;
  items: MenuItem[];
  customerName: string;
  address: string;
  contact: string;
  paymentMethod: PaymentMethod;
  changeAmount?: number | null;
  status: OrderStatus;
  total: number;
  finalTotal: number;
  createdAt: Timestamp | FieldValue | Date;
}

export interface Stats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
}