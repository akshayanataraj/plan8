import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';

export async function GET() {
  try {
    // First, get a valid user ID from profiles table
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (profileError || !profiles?.length) {
      console.error('❌ Could not fetch profile:', profileError);
      return NextResponse.json({ 
        message: 'Could not fetch a valid user profile',
        error: profileError?.message || 'No profiles found',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    const validUserId = profiles[0].id;

    // Test Supabase connection with a simple insert
    const testOrder = {
      user_id: validUserId, // Use the valid user ID
      order_item: 'test burger',
      restaurant: 'Test Restaurant',
      delivery_time: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(testOrder)
      .select();

    if (error) {
      console.error('❌ Supabase test error:', error);
      return NextResponse.json({ 
        message: 'ElevenLabs webhook test endpoint is working, but Supabase test failed',
        error: error.message,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'ElevenLabs webhook test endpoint is working!',
      supabaseTest: 'success',
      testData: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    return NextResponse.json({ 
      message: 'Test endpoint error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ 
    message: 'ElevenLabs webhook test endpoint received POST request!',
    timestamp: new Date().toISOString()
  });
} 