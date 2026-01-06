import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 Register request body:', body)

    const {
      username,
      email,
      full_name,
      phone_number,
      password,
      account_number,
      bank_type,
    } = body

    // Validasi input
    if (
      !username ||
      !email ||
      !full_name ||
      !phone_number ||
      !password ||
      !account_number ||
      !bank_type
    ) {
      return NextResponse.json(
        { message: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Format email tidak valid' },
        { status: 400 }
      )
    }

    // Validasi bank type
    if (!['BRI', 'DANA'].includes(bank_type)) {
      return NextResponse.json(
        { message: 'Tipe bank harus BRI atau DANA' },
        { status: 400 }
      )
    }

    // Validasi panjang password
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password minimal 6 karakter' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('🔐 Password hashed successfully')

    // Insert ke database
    console.log('📊 Attempting to insert user into Supabase...')
    const { data: newUser, error } = await supabaseServer
      .from('users')
      .insert([
        {
          username,
          email,
          full_name,
          phone_number,
          password_hash: hashedPassword,
          account_number,
          bank_type,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase insert error:', error)
      console.error('Error details:', { code: error.code, message: error.message })

      // Handle unique constraint violation
      if (error.code === '23505') {
        if (error.message.includes('username')) {
          return NextResponse.json(
            { message: 'Username sudah terdaftar' },
            { status: 400 }
          )
        }
        if (error.message.includes('email')) {
          return NextResponse.json(
            { message: 'Email sudah terdaftar' },
            { status: 400 }
          )
        }
      }

      return NextResponse.json(
        { message: 'Terjadi kesalahan saat registrasi: ' + error.message },
        { status: 500 }
      )
    }

    console.log('✅ User created successfully:', newUser)

    // Return user data (tanpa password)
    const { password_hash, ...userWithoutPassword } = newUser
    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil',
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error('❌ Register error caught:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      {
        message: 'Terjadi kesalahan server',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
