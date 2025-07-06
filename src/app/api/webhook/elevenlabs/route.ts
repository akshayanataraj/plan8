import { supabase } from '@/app/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';    

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Extract user context from webhook payload
function extractUserContext(webhookData: any) {
  try {
    console.log('🔍 Looking for user context in webhook payload...');
    
    // Try to parse dynamic variables
    const dynamicVars = webhookData.data?.conversation_initiation_client_data?.dynamic_variables;
    if (dynamicVars) {
      console.log('📦 Dynamic variables:', dynamicVars);
      
      // Check for id (profiles table primary key)
      if (dynamicVars.id) {
        console.log('✅ Found profile id:', dynamicVars.id);
        return { userId: dynamicVars.id };
      }
      
      // Fallback to user_id if id is not present
      if (dynamicVars.user_id) {
        console.log('✅ Found user_id:', dynamicVars.user_id);
        return { userId: dynamicVars.user_id };
      }
    }

    // Try other possible locations as fallback
    const possibleLocations = [
      webhookData.data?.user_id,
      webhookData.data?.conversation_initiation_client_data?.user_id,
      webhookData.data?.client_data?.user_id
    ];

    for (const location of possibleLocations) {
      if (location) {
        console.log('✅ Found user_id in fallback location:', location);
        return { userId: location };
      }
    }

    console.error('❌ Could not find user_id in webhook payload');
    console.error('🔍 Checked locations:', {
      'dynamic_variables.id': dynamicVars?.id,
      'dynamic_variables.user_id': dynamicVars?.user_id,
      'data.user_id': webhookData.data?.user_id,
      'conversation_initiation_client_data.user_id': webhookData.data?.conversation_initiation_client_data?.user_id,
      'client_data.user_id': webhookData.data?.client_data?.user_id
    });
    return { userId: null };
  } catch (error) {
    console.error('❌ Error extracting user context:', error);
    return { userId: null };
  }
}

// Extract order details from conversation
function extractOrderDetails(webhookData: any) {
  try {
    console.log('🔍 Extracting order details...');

    if (!webhookData.data?.transcript) {
      console.error('❌ Missing transcript in webhook payload');
      return null;
    }

    // Combine user messages
    const userMessages = webhookData.data.transcript
      .filter((msg: any) => msg.role === 'user')
      .map((msg: any) => msg.message)
      .join(' ')
      .toLowerCase();

    console.log('🗣️ Original user messages:', userMessages);

    // Order patterns
    const orderPatterns = [
      /(?:want|like|get|order|have)\s+(.*?)(?:\s+from\s+|\s+at\s+)(.*?)(?:\s+at\s+|\s+for\s+|$)/i,
      /can\s+(?:i|we)\s+(?:get|order|have)\s+(.*?)(?:\s+from\s+|\s+at\s+)(.*?)(?:\s+at\s+|\s+for\s+|$)/i,
      /([^,\.]+?)(?:\s+from\s+|\s+at\s+)(.*?)(?:\s+at\s+|\s+for\s+|$)/i
    ];

    // Time patterns
    const timePatterns = [
      /at\s+([0-9]{1,2}(?:\s*:\s*[0-9]{2})?\s*(?:a\.?m\.?|p\.?m\.?|noon|midnight))/i,
      /at\s+([0-9]{1,2})\s*(?:o'?clock)?\s*(a\.?m\.?|p\.?m\.?)?/i,
      /at\s+(noon|midnight|lunch\s*time|dinner\s*time)/i
    ];

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
    for (const pattern of timePatterns) {
      const timeMatch = userMessages.match(pattern);
      if (timeMatch) {
        timeStr = timeMatch[1].trim();
        break;
      }
    }

    // Process delivery time
    let deliveryTime = new Date();
    if (timeStr) {
      timeStr = timeStr.toLowerCase();
      
      if (timeStr === 'noon') {
        deliveryTime.setHours(12, 0, 0, 0);
      } else if (timeStr === 'midnight') {
        deliveryTime.setHours(0, 0, 0, 0);
      } else if (timeStr.includes('lunch')) {
        deliveryTime.setHours(12, 0, 0, 0);
      } else if (timeStr.includes('dinner')) {
        deliveryTime.setHours(18, 0, 0, 0);
      } else {
        const timeMatch = timeStr.match(/([0-9]{1,2})(?::([0-9]{2}))?\s*(a\.?m\.?|p\.?m\.?)?/i);
        if (timeMatch) {
          let [_, hours, minutes, meridiem] = timeMatch;
          hours = parseInt(hours, 10);
          minutes = parseInt(minutes || '0', 10);
          
          if (meridiem) {
            if (meridiem.toLowerCase().startsWith('p') && hours < 12) hours += 12;
            if (meridiem.toLowerCase().startsWith('a') && hours === 12) hours = 0;
          } else if (hours < 12) {
            hours += 12;
          }
          
          deliveryTime.setHours(hours, minutes, 0, 0);
        }
      }
    }

    const orderDetails = {
      orderItem,
      restaurant,
      deliveryTime: deliveryTime.toISOString(),
      originalTime: timeStr
    };

    console.log('📋 Extracted order details:', orderDetails);
    return orderDetails;
  } catch (error) {
    console.error('❌ Error extracting order details:', error);
    return null;
  }
}

// Store order in database
async function storeOrder(userId: string, orderDetails: any) {
  try {
    console.log('💾 Storing order for user:', userId);
    
    const { data, error } = await supabase.from('orders').insert({
      user_id: userId,
      order_item: orderDetails.orderItem,
      restaurant: orderDetails.restaurant,
      delivery_time: orderDetails.deliveryTime
    }).select();

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }

    console.log('✅ Order stored successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error storing order:', error);
    throw error;
  }
}

export async function GET() {
  console.log('📥 Received GET request to webhook endpoint');
  return NextResponse.json({
    message: 'ElevenLabs webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  console.log('🎯 ElevenLabs webhook endpoint hit');

  try {
    const webhookData = await req.json();
    
    console.log('📨 Webhook received:', {
      type: webhookData.type || 'unknown',
      conversationId: webhookData.data?.conversation_id,
      agentId: webhookData.data?.agent_id,
    });

    if (webhookData.type !== 'post_call_transcription') {
      console.log('⏭️ Ignoring non-transcription event:', webhookData.type);
      return NextResponse.json({ 
        message: 'Ignored non-transcription event',
        eventType: webhookData.type
      });
    }

    const { userId } = extractUserContext(webhookData);

    if (!userId) {
      return NextResponse.json(
        {
          error: 'Could not extract user_id from webhook payload',
          conversationId: webhookData.data?.conversation_id,
        },
        { status: 400 }
      );
    }

    // Verify the user exists in profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('❌ Invalid user_id:', userId);
      return NextResponse.json({ 
        error: 'Invalid user_id',
        details: profileError?.message || 'User not found'
      }, { status: 400 });
    }

    const orderDetails = extractOrderDetails(webhookData);

    if (!orderDetails || !orderDetails.orderItem || !orderDetails.restaurant) {
      return NextResponse.json(
        {
          error: 'Could not extract complete order details',
          conversationId: webhookData.data?.conversation_id,
        },
        { status: 400 }
      );
    }

    const data = await storeOrder(userId, orderDetails);

    return NextResponse.json({
      success: true,
      message: 'Order stored successfully',
      conversationId: webhookData.data?.conversation_id,
      userId,
      data,
      orderDetails
    });

  } catch (error: any) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error?.message || error,
      },
      { status: 500 }
    );
  }
}
