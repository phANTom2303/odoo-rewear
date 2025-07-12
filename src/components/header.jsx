"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { User, Menu, X, Leaf } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-neutral-900">ReWear</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-neutral-600 hover:text-primary-600 transition-colors">
              Browse Items
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
                <Link href="/add-item" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  List Item
                </Link>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button onClick={handleSignOut} className="text-neutral-600 hover:text-primary-600 transition-colors">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-neutral-600 hover:text-primary-600"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200">
            <div className="flex flex-col space-y-4">
              <Link href="/browse" className="text-neutral-600 hover:text-primary-600 transition-colors">
                Browse Items
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-neutral-600 hover:text-primary-600 transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/add-item" className="text-neutral-600 hover:text-primary-600 transition-colors">
                    List Item
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-left text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-neutral-600 hover:text-primary-600 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="btn-primary inline-block text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
