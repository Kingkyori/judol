import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Judol Learning App',
  description: 'Admin-user linked settings demo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="app">
        <header className="site-header">
          <div className="site-header__inner">
            <div className="brand">Judol</div>
            <nav className="nav">
              <Link href="/">Beranda</Link>
              <Link href="/admin">Admin</Link>
              <Link href="/user">User</Link>
            </nav>
          </div>
        </header>
        <main className="site-main">
          {children}
        </main>
        <footer className="site-footer">
          <div className="site-footer__inner">
            <span>© {new Date().getFullYear()} Judol</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
