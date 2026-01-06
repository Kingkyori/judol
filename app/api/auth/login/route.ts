import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log('Login attempt for username:', username)

    // Validasi input
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username dan password harus diisi' },
        { status: 400 }
      )
    }

    // Cek user di database
    const { data: users, error } = await supabaseServer
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    console.log('Supabase query - Error:', error)
    console.log('Supabase query - Data:', users ? { id: users.id, username: users.username, has_password_hash: !!users.password_hash } : 'null')

    if (error) {
      console.error('Supabase query error:', error.message)
      return NextResponse.json(
        { message: 'Username tidak ditemukan atau error database' },
        { status: 401 }
      )
    }

    if (!users) {
      return NextResponse.json(
        { message: 'Username tidak ditemukan' },
        { status: 401 }
      )
    }

    // Verifikasi password
    if (!users.password_hash) {
      console.error('Password hash missing for user:', username)
      return NextResponse.json(
        { message: 'Error: Password tidak tersimpan di database' },
        { status: 500 }
      )
    }

    let isPasswordValid = false
    try {
      isPasswordValid = await bcrypt.compare(password, users.password_hash)
      console.log('Password validation result:', isPasswordValid)
    } catch (bcryptError) {
      console.error('Bcrypt compare error:', bcryptError)
      return NextResponse.json(
        { message: 'Error verifying password' },
        { status: 500 }
      )
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Password salah' },
        { status: 401 }
      )
    }

    // Return user data (tanpa password)
    const { password_hash, ...userWithoutPassword } = users
    console.log('Login successful for user:', username)
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
