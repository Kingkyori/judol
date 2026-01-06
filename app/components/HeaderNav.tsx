'use client'

import Link from 'next/link'
import styles from './HeaderNav.module.css'

export default function HeaderNav() {
  return (
    <nav className={styles.nav}>
      <Link href="/">Beranda</Link>
      <Link href="/admin">Admin</Link>
      <Link href="/auth/user-login">User</Link>
    </nav>
  )
}
