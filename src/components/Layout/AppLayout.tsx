import { ReactNode, useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import styles from './AppLayout.module.css'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, signOut } = useAuth()

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
      root.classList.remove('light')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    const nextMode = !isDarkMode
    setIsDarkMode(nextMode)
    localStorage.setItem('theme', nextMode ? 'dark' : 'light')
  }

  const userInitial = user?.email?.[0]?.toUpperCase() ?? '?'
  const userEmail = user?.email ?? ''

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.content}>
          <h1 className={styles.title}>To-Do Personal</h1>
          <div className={styles.actions}>
            <button
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label="Alternar tema"
              title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {user && (
              <div className={styles.userMenu}>
                <span className={styles.avatar} title={userEmail}>
                  {userInitial}
                </span>
                <button
                  id="btn-signout"
                  className={styles.signOutBtn}
                  onClick={signOut}
                  title="Sair"
                  aria-label="Sair da conta"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
