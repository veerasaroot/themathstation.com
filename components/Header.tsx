'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-12 w-36">
              <Image 
                src="/images/math-station-logo.png" 
                alt="The Math Station"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="nav-link">
              หน้าแรก
            </Link>
            <Link href="/blog" className="nav-link">
              บทความ
            </Link>
            <Link href="/categories" className="nav-link">
              หมวดหมู่
            </Link>
            <Link href="/about" className="nav-link">
              เกี่ยวกับเรา
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="ml-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-3 pb-2 border-t mt-3 space-y-2">
            <Link
              href="/"
              className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 font-dbhelvetica-med"
              onClick={toggleMenu}
            >
              หน้าแรก
            </Link>
            <Link
              href="/blog"
              className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 font-dbhelvetica-med"
              onClick={toggleMenu}
            >
              บทความ
            </Link>
            <Link
              href="/categories"
              className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 font-dbhelvetica-med"
              onClick={toggleMenu}
            >
              หมวดหมู่
            </Link>
            <Link
              href="/about"
              className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 font-dbhelvetica-med"
              onClick={toggleMenu}
            >
              เกี่ยวกับเรา
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}