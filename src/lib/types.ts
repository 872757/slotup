export type Shop = {
  id: string;
  slug: string;
  name: string;
  phone: string;
  address: string | null;
  opening_time: string;
  closing_time: string;
  number_of_chairs: number;
  status: string;
};

export type Service = {
  id: string;
  shop_id: string;
  name: string;
  price: number;
  duration_minutes: number;
  active: boolean;
};

export type Booking = {
  id: string;
  shop_id: string;
  customer_id: string;
  service_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: "confirmed" | "completed" | "cancelled" | "no_show";
  manage_token: string;
};
