import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase_admin';

// GET - Fetch all about sections
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('about_sections')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new about section
export async function POST(request) {
  try {
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('about_sections')
      .insert([body])
      .select();

    if (error) throw error;

    return NextResponse.json({ data, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update about section
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { data: null, error: 'ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('about_sections')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ data, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete about section
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { data: null, error: 'ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('about_sections')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    );
  }
}
