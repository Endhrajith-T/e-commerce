<<<<<<< HEAD
export type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  board?: "CBSE" | "State Board" | "ICSE" | "Other" | string;
  standard?: "9" | "10" | "11" | "12" | string;
  image?: string;
  description?: string;
};
=======
export interface Book {
  id: string
  title: string
  author: string
  price: number
  stock: number
  image_url: string | null
  description: string | null
  created_at: string
}

export interface Order {
  id: string
  phone: string
  is_verified: boolean
  customer_name: string
  address: string
  pincode: string
  book_id: string
  quantity: number
  total_amount: number
  payment_method: 'cod' | 'razorpay'
  payment_status: 'pending' | 'paid' | 'failed'
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  created_at: string
  books?: { title: string; author: string }
}

export interface CartItem {
  book: Book
  quantity: number
}

export interface CheckoutForm {
  name: string
  phone: string
  address: string
  pincode: string
}

export interface OtpSendRequest  { phone: string }
export interface OtpVerifyRequest { phone: string; otp: string }

export interface CreateOrderRequest {
  phone: string
  customer_name: string
  address: string
  pincode: string
  book_id: string
  quantity: number
  total_amount: number
  payment_method: 'cod' | 'razorpay'
  razorpay_order_id?: string
  razorpay_payment_id?: string
}
>>>>>>> 1f88fadfa101860d452cc9184545d231b97e8f43
