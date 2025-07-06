import { supabase } from '@/app/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';    
import crypto from 'crypto';

export async function GET() {
  return NextResponse.json(
    { message: 'This is a webhook endpoint for ElevenLabs. It only accepts POST requests.' },
    { status: 405 }
  );
}

export async function POST(req: NextRequest) {
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET;
  const rawBody = await req.text();

  // ✅ Verify HMAC
  const signature = req.headers.get('x-elevenlabs-signature') || '';
  const hmac = crypto.createHmac('sha256', secret!);
  hmac.update(rawBody);
  const digest = hmac.digest('hex');

  if (digest !== signature) {
    console.error('❌ Invalid HMAC signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  console.log('📝 Received webhook payload:', body);

  if (body.type !== 'post_call_transcription') {
    return NextResponse.json({ message: 'Ignored non-transcription event' });
  }

  // ✅ Combine user messages
  const userMessages = body.data.transcript
    .filter((msg: any) => msg.role === 'user')
    .map((msg: any) => msg.message)
    .join(' ')
    .toLowerCase();

  console.log('🔎 Combined user messages:', userMessages);

  // ✅ Simple regex extraction (adapt based on how users speak)
  const itemMatch = userMessages.match(/(?:order|want|get|like|craving)\s+(.*)\s+from/i);
  const restaurantMatch = userMessages.match(/from\s+(.*?)\s+(?:and|at|for)/i);
  const timeMatch = userMessages.match(/at\s+([0-9]{1,2}\s*(?:a\.?m\.?|p\.?m\.?))/i);

  if (!itemMatch || !restaurantMatch || !timeMatch) {
    console.error('❌ Could not extract order details from transcript');
    return NextResponse.json({ error: 'Failed to extract order info' }, { status: 400 });
  }

  const orderItem = itemMatch[1].trim();
  const restaurant = restaurantMatch[1].trim();
  const deliveryTimeStr = timeMatch[1].replace(/\./g, '').toLowerCase();

  // ✅ Convert to full DateTime
  const now = new Date();
  let [hourStr, meridiem] = deliveryTimeStr.split(' ');
  let hour = parseInt(hourStr, 10);
  if (meridiem === 'pm' && hour < 12) hour += 12;
  if (meridiem === 'am' && hour === 12) hour = 0;
  const deliveryTime = new Date(now);
  deliveryTime.setHours(hour, 0, 0, 0);

  // ✅ Get user_id (from dynamic variables or fallback)
  const user_id = body.data.conversation_initiation_client_data?.user_id || '00000000-0000-0000-0000-000000000000';

  // ✅ Insert into Supabase
  const { error } = await supabase.from('orders').insert({
    user_id,
    order_item: orderItem,
    restaurant,
    delivery_time: deliveryTime.toISOString(),
  });

  if (error) {
    console.error('❌ Supabase error:', error);
    return NextResponse.json({ error: 'Failed to store order' }, { status: 500 });
  }

  console.log('✅ Order saved to Supabase!');
  return NextResponse.json({ message: 'Order stored' });
}
