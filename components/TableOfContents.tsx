'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  
  // Extract headings from markdown content
  useEffect(() => {
    const extractHeadings = () => {
      const regex = /^(#{1,3})\s+(.+)$/gm;
      const matches: Heading[] = [];
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        // Create a slug from the heading text
        const id = text
          .toLowerCase()
          .replace(/[^\w\sก-๛]/g, '') // Keep Thai characters
          .replace(/\s+/g, '-');
        
        matches.push({ level, text, id });
      }
      
      setHeadings(matches);
    };
    
    extractHeadings();
  }, [content]);
  
  // Track active heading while scrolling
  useEffect(() => {
    if (headings.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );
    
    // Observe all heading elements
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });
    
    return () => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);
  
  // Add heading IDs to the actual content
  useEffect(() => {
    headings.forEach(({ id, text }) => {
      const heading = Array.from(document.querySelectorAll('h1, h2, h3')).find(
        (el) => el.textContent?.trim() === text
      );
      
      if (heading && !heading.id) {
        heading.id = id;
      }
    });
  }, [headings]);
  
  if (headings.length === 0) {
    return null;
  }
  
  return (
    <div className="my-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full font-dbhelvetica-med"
      >
        <span>สารบัญ</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
        <nav className="mt-3 pl-4">
          <ul className="space-y-2">
            {headings.map((heading, index) => (
              <li
                key={index}
                className={`${
                  heading.level === 1 ? '' : heading.level === 2 ? 'ml-4' : 'ml-8'
                }`}
              >
                <Link
                  href={`#${heading.id}`}
                  className={`text-sm hover:text-primary transition-colors ${
                    activeId === heading.id ? 'text-primary font-dbhelvetica-med' : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: 'smooth',
                    });
                    setActiveId(heading.id);
                  }}
                >
                  {heading.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}