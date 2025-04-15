// components/CategoryFilter.tsx
'use client';

import Link from 'next/link';
import { Category } from '@/utils/supabase';
import { useState } from 'react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId?: string;
}

export default function CategoryFilter({ categories, selectedCategoryId }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-dbhelvetica-med">หมวดหมู่:</span>
        
        {/* Desktop Categories */}
        <div className="hidden md:flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              !selectedCategoryId
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            ทั้งหมด
          </Link>
          
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog?category=${category.id}`}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategoryId === category.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
        
        {/* Mobile Categories Dropdown */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center"
          >
            <span className="mr-2">
              {selectedCategoryId
                ? categories.find((c) => c.id === selectedCategoryId)?.name
                : 'ทั้งหมด'}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-10">
              <Link
                href="/blog"
                className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  !selectedCategoryId ? 'bg-primary/10 text-primary' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                ทั้งหมด
              </Link>
              
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog?category=${category.id}`}
                  className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    selectedCategoryId === category.id
                      ? 'bg-primary/10 text-primary'
                      : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
