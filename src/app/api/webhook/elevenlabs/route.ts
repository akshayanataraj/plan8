import { supabase } from '@/app/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';    

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  console.log('📥 Received GET request to webhook endpoint');
  return NextResponse.json(
    { message: 'This is a webhook endpoint for ElevenLabs. It only accepts POST requests.' },
    { status: 405 }
  );
}

export async function POST(req: NextRequest) {
  try {
    console.log('🎯 Webhook POST request received');
    console.log('📨 Request URL:', req.url);
    console.log('📨 Request method:', req.method);
    console.log('📨 Request headers:', Object.fromEntries(req.headers.entries()));
    
    const rawBody = await req.text();
    console.log('📦 Raw webhook payload:', rawBody);

    let body;
    try {
      body = JSON.parse(rawBody);
      console.log('📝 Parsed webhook payload:', body);
    } catch (e) {
      console.error('❌ Failed to parse webhook payload:', e);
      return NextResponse.json({ 
        error: 'Invalid JSON payload',
        details: e instanceof Error ? e.message : 'Unknown error'
      }, { status: 400 });
    }

    if (!body.type) {
      console.error('❌ Missing event type in webhook payload');
      return NextResponse.json({ 
        error: 'Missing event type',
        receivedPayload: body
      }, { status: 400 });
    }

    if (body.type !== 'post_call_transcription') {
      console.log('⏭️ Ignoring non-transcription event:', body.type);
      return NextResponse.json({ 
        message: 'Ignored non-transcription event',
        eventType: body.type
      });
    }

    if (!body.data?.transcript) {
      console.error('❌ Missing transcript in webhook payload');
      return NextResponse.json({ 
        error: 'Missing transcript',
        receivedPayload: body
      }, { status: 400 });
    }

    // ✅ Get dynamic variables from ElevenLabs
    const dynamicVars = body.data.conversation_initiation_client_data || {};
    console.log('🔄 Dynamic variables:', dynamicVars);

    // ✅ Combine user messages
    const userMessages = body.data.transcript
      .filter((msg: any) => msg.role === 'user')
      .map((msg: any) => msg.message)
      .join(' ')
      .toLowerCase();

    console.log('🗣️ Original user messages:', userMessages);

    // More flexible regex patterns
    const orderPatterns = [
      // Pattern 1: "I want/would like/get X from Y"
      /(?:want|like|get|order|have)\s+(.*?)(?:\s+from\s+|\s+at\s+)(.*?)(?:\s+at\s+|\s+for\s+|$)/i,
      // Pattern 2: "Can I get/order X from Y"
      /can\s+(?:i|we)\s+(?:get|order|have)\s+(.*?)(?:\s+from\s+|\s+at\s+)(.*?)(?:\s+at\s+|\s+for\s+|$)/i,
      // Pattern 3: "X from Y"
      /([^,\.]+?)(?:\s+from\s+|\s+at\s+)(.*?)(?:\s+at\s+|\s+for\s+|$)/i
    ];

    // Time patterns
    const timePatterns = [
      // Standard time format
      /at\s+([0-9]{1,2}(?:\s*:\s*[0-9]{2})?\s*(?:a\.?m\.?|p\.?m\.?|noon|midnight))/i,
      // Hour only format
      /at\s+([0-9]{1,2})\s*(?:o'?clock)?\s*(a\.?m\.?|p\.?m\.?)?/i,
      // Natural language time
      /at\s+(noon|midnight|lunch\s*time|dinner\s*time)/i
    ];

    // Try each pattern until we find a match
    let orderItem, restaurant, timeStr;
    
    // Extract order and restaurant
    for (const pattern of orderPatterns) {
      const match = userMessages.match(pattern);
      if (match) {
        orderItem = match[1].trim();
        restaurant = match[2].trim();
        break;
      }
    }

    // Extract time
    let timeMatch;
    for (const pattern of timePatterns) {
      timeMatch = userMessages.match(pattern);
      if (timeMatch) {
        timeStr = timeMatch[1].trim();
        break;
      }
    }

    console.log('🔍 Extracted matches:', { 
      orderItem, 
      restaurant, 
      timeStr,
      patterns_tried: orderPatterns.length
    });

    // Convert natural language time to standard format
    let deliveryTime = new Date();
    if (timeStr) {
      timeStr = timeStr.toLowerCase();
      
      // Handle special cases
      if (timeStr === 'noon') {
        deliveryTime.setHours(12, 0, 0, 0);
      } else if (timeStr === 'midnight') {
        deliveryTime.setHours(0, 0, 0, 0);
      } else if (timeStr.includes('lunch')) {
        deliveryTime.setHours(12, 0, 0, 0);
      } else if (timeStr.includes('dinner')) {
        deliveryTime.setHours(18, 0, 0, 0);
      } else {
        // Handle standard time formats
        const timeMatch = timeStr.match(/([0-9]{1,2})(?::([0-9]{2}))?\s*(a\.?m\.?|p\.?m\.?)?/i);
        if (timeMatch) {
          let [_, hours, minutes, meridiem] = timeMatch;
          hours = parseInt(hours, 10);
          minutes = parseInt(minutes || '0', 10);
          
          // Convert to 24-hour format
          if (meridiem) {
            if (meridiem.toLowerCase().startsWith('p') && hours < 12) hours += 12;
            if (meridiem.toLowerCase().startsWith('a') && hours === 12) hours = 0;
          } else if (hours < 12) {
            // If no AM/PM specified, assume PM for hours before 12
            hours += 12;
          }
          
          deliveryTime.setHours(hours, minutes, 0, 0);
        }
      }
    }

    console.log('📋 Processed order details:', {
      orderItem,
      restaurant,
      deliveryTime: deliveryTime.toISOString(),
      originalTime: timeStr
    });

    if (!orderItem || !restaurant) {
      console.error('❌ Could not extract complete order details');
      return NextResponse.json({ 
        error: 'Could not understand the order details',
        extracted: { orderItem, restaurant, timeStr },
        userMessages
      }, { status: 400 });
    }

    // Get user_id from dynamic variables
    let user_id = dynamicVars.user_id;
    
    // If no user_id provided, try to get the first available profile
    if (!user_id) {
      console.log('⚠️ No user_id provided, fetching first available profile');
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (profileError || !profiles?.length) {
        console.error('❌ Could not fetch profile:', profileError);
        return NextResponse.json({ 
          error: 'No valid user profile found',
          details: profileError?.message || 'No profiles found'
        }, { status: 400 });
      }

      user_id = profiles[0].id;
      console.log('✅ Using fallback user_id:', user_id);
    }

    // Verify the user_id exists in profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user_id)
      .single();

    if (profileError || !profile) {
      console.error('❌ Invalid user_id:', user_id);
      return NextResponse.json({ 
        error: 'Invalid user_id',
        details: profileError?.message || 'User not found'
      }, { status: 400 });
    }

    // ✅ Insert into Supabase
    const { data, error } = await supabase.from('orders').insert({
      user_id,
      order_item: orderItem,
      restaurant,
      delivery_time: deliveryTime.toISOString()
    }).select();

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json({ error: 'Failed to store order', details: error }, { status: 500 });
    }

    console.log('✅ Order saved to Supabase:', data);
    return NextResponse.json({ 
      message: 'Order stored', 
      data,
      extracted: { orderItem, restaurant, deliveryTime: deliveryTime.toISOString() }
    });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
