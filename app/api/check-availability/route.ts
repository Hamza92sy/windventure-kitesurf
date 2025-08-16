import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../src/lib/supabase';

const MAX_PARTICIPANTS_PER_DAY = 20;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const participants = parseInt(searchParams.get('participants') || '1');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Get all bookings for the specified date
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('participants, status')
      .eq('preferred_date', date)
      .in('status', ['pending', 'confirmed', 'paid']); // Only count active bookings

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json(
        { error: 'Failed to check availability' },
        { status: 500 }
      );
    }

    // Calculate total participants for the date
    const totalParticipants = bookings.reduce(
      (sum, booking) => sum + booking.participants,
      0
    );

    // Check if the requested number of participants can be accommodated
    const isAvailable =
      totalParticipants + participants <= MAX_PARTICIPANTS_PER_DAY;
    const remainingSlots = Math.max(
      0,
      MAX_PARTICIPANTS_PER_DAY - totalParticipants
    );

    return NextResponse.json({
      date,
      requestedParticipants: participants,
      totalParticipants,
      remainingSlots,
      isAvailable,
      maxParticipantsPerDay: MAX_PARTICIPANTS_PER_DAY,
    });
  } catch (error: any) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}

// Get availability for a range of dates (for calendar display)
export async function POST(request: NextRequest) {
  try {
    const { startDate, endDate } = await request.json();

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Get all bookings in the date range
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('preferred_date, participants, status')
      .gte('preferred_date', startDate)
      .lte('preferred_date', endDate)
      .in('status', ['pending', 'confirmed', 'paid']);

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch availability' },
        { status: 500 }
      );
    }

    // Group bookings by date
    const availabilityByDate: Record<string, number> = {};

    bookings.forEach(booking => {
      const date = booking.preferred_date;
      availabilityByDate[date] =
        (availabilityByDate[date] || 0) + booking.participants;
    });

    // Generate availability for each date in the range
    const availability = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (!dateStr) continue;
      const totalParticipants =
        (availabilityByDate as Record<string, number>)[dateStr] ?? 0;
      const remainingSlots = Math.max(
        0,
        MAX_PARTICIPANTS_PER_DAY - totalParticipants
      );
      const isFullyBooked = totalParticipants >= MAX_PARTICIPANTS_PER_DAY;

      availability.push({
        date: dateStr,
        totalParticipants,
        remainingSlots,
        isFullyBooked,
        maxParticipantsPerDay: MAX_PARTICIPANTS_PER_DAY,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return NextResponse.json({ availability });
  } catch (error: any) {
    console.error('Error fetching availability range:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
