import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for booking data
export interface BookingData {
  id?: string;
  package_id: string;
  package_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  preferred_date: string;
  participants: number;
  notes?: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  stripe_payment_intent_id?: string;
  stripe_session_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Function to create a new booking
export async function createBooking(
  bookingData: Omit<BookingData, 'id' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }

  return data;
}

// Function to update booking status
export async function updateBookingStatus(
  bookingId: string,
  status: BookingData['status'],
  paymentData?: any
) {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (paymentData) {
    updateData.stripe_payment_intent_id = paymentData.payment_intent_id;
    updateData.stripe_session_id = paymentData.session_id;
  }

  const { data, error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking:', error);
    throw error;
  }

  return data;
}
