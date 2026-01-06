'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './register.module.css'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    account_number: '',
    bank_type: 'BRI',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validasi client-side
    if (formData.password !== formData.confirm_password) {
      setError('Password tidak cocok')
      return
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          password: formData.password,
          account_number: formData.account_number,
          bank_type: formData.bank_type,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Registrasi gagal')
        return
      }

      // Registrasi berhasil
      alert('Registrasi berhasil! Silakan login')
      router.push('/auth/login')
    } catch (error) {
      console.error('Register error:', error)
      setError('Terjadi kesalahan server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Daftar Judol</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Masukkan username"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="full_name">Nama Lengkap</label>
            <input
              id="full_name"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone_number">Nomor Telepon</label>
            <input
              id="phone_number"
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Contoh: 081234567890"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirm_password">Konfirmasi Password</label>
            <input
              id="confirm_password"
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="Ulangi password"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.bankSection}>
            <h3>Data Rekening</h3>

            <div className={styles.formGroup}>
              <label htmlFor="bank_type">Pilih Rekening</label>
              <select
                id="bank_type"
                name="bank_type"
                value={formData.bank_type}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                <option value="DANA">DANA (E-Wallet)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="account_number">Nomor Rekening</label>
              <input
                id="account_number"
                type="text"
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                placeholder={
                  formData.bank_type === 'BRI'
                    ? 'Contoh: 1234567890'
                    : 'Contoh: 0812345678'
                }
                disabled={loading}
                required
              />
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Loading...' : 'Daftar'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Sudah punya akun? <Link href="/auth/login">Login di sini</Link></p>
        </div>
      </div>
    </div>
  )
}
