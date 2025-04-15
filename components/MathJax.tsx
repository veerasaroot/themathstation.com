// components/MathJax.tsx
'use client';

import { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface MathJaxProps {
  math: string;
  display?: boolean;
  className?: string;
}

export default function MathJax({ math, display = false, className = '' }: MathJaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      katex.render(math, containerRef.current, {
        throwOnError: false,
        displayMode: display,
      });
    }
  }, [math, display]);

  return (
    <div 
      ref={containerRef} 
      className={`math-container ${display ? 'overflow-x-auto' : 'inline-block'} ${className}`}
    />
  );
}
