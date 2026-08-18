import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { application_id, status } = body;

    if (!application_id || !status) {
      return NextResponse.json({ error: 'Missing application_id or status' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => cookieStore.set(name, value));
          },
        },
      }
    );

    // Using the service role key would be better for a webhook, but for MVP mock, we assume the user is authenticated.
    // In production, we'd verify a webhook signature from Paystack/Stripe.
    
    // Update application status
    const { data, error } = await supabase
      .from('applications')
      .update({ status: status === 'success' ? 'ESCROW_FUNDED' : 'FAILED', updated_at: new Date().toISOString() })
      .eq('id', application_id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    // If a payment failed, our database trigger `on_member_failed` will cascade the failure to all roommate members.
    return NextResponse.json({ success: true, application: data });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
