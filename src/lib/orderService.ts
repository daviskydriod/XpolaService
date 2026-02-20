// FILE PATH: src/lib/orderService.ts
import {
  collection, addDoc, getDocs, query,
  where, orderBy, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface OrderItem {
  id:       string;
  name:     string;
  price:    number;
  quantity: number;
  currency: string;
  image:    string;
  category: string;
}

export interface Order {
  id:           string; // Firestore doc id
  uid:          string;
  reference:    string; // Flutterwave tx_ref
  status:       'paid' | 'processing' | 'shipped' | 'delivered';
  items:        OrderItem[];
  total:        number;
  currency:     string;
  country:      string;
  customerName: string;
  email:        string;
  phone:        string;
  address:      string;
  city:         string;
  state:        string;
  createdAt:    Timestamp | null;
}

// ── Save Order ────────────────────────────────────────────────────────────────
export const saveOrder = async (order: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...order,
    status:    'paid',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// ── Fetch User Orders ─────────────────────────────────────────────────────────
export const fetchUserOrders = async (uid: string): Promise<Order[]> => {
  const q = query(
    collection(db, 'orders'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
};
