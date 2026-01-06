'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import styles from './HeaderNav.module.css'

export default function HeaderNav() {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (isLoading) {
    return (
      <nav className={styles.nav}>
        <Link href="/">Beranda</Link>
        <Link href="/admin">Admin</Link>
        <Link href="/auth/login">User</Link>
      </nav>
    )
  }

  return (
    <nav className={styles.nav}>
      <Link href="/">Beranda</Link>
      <Link href="/admin">Admin</Link>

      {isAuthenticated ? (
        <div className={styles.userMenu}>
          <span className={styles.username}>
            👤 {user?.full_name || user?.username}
          </span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <Link href="/auth/login" className={styles.loginBtn}>
          User
        </Link>
      )}
    </nav>
  )
}
