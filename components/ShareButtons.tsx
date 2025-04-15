'use client';

import { useEffect, useState } from 'react';
import { BlogPost } from '@/utils/supabase';

interface ShareButtonsProps {
  post: BlogPost;
}

export default function ShareButtons({ post }: ShareButtonsProps) {
  const [postUrl, setPostUrl] = useState('');
  const [canShare, setCanShare] = useState(false);
  
  useEffect(() => {
    setPostUrl(window.location.href);
    // ตรวจสอบว่าเบราว์เซอร์รองรับ navigator.share หรือไม่
    setCanShare('share' in navigator);
  }, []);
  
  const shareData = {
    title: post.title,
    text: post.excerpt,
    url: postUrl,
  };
  
  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
      '_blank'
    );
  };
  
  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`,
      '_blank'
    );
  };
  
  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
      '_blank'
    );
  };
  
  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(postUrl);
    alert('คัดลอกลิงก์แล้ว');
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-gray-600 dark:text-gray-300 font-dbhelvetica-med mr-2">แชร์:</span>
      
      <button
        onClick={shareOnFacebook}
        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label="Share on Facebook"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-[#1877F2] dark:text-white"
        >
          <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"></path>
        </svg>
      </button>
      
      <button
        onClick={shareOnTwitter}
        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label="Share on Twitter"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-[#1DA1F2] dark:text-white"
        >
          <path d="M22.162 5.65593C21.3985 5.99362 20.589 6.2154 19.76 6.31393C20.6337 5.79136 21.2877 4.96894 21.6 3.99993C20.78 4.48793 19.881 4.82993 18.944 5.01493C18.3146 4.34151 17.4803 3.89489 16.5709 3.74451C15.6615 3.59413 14.7279 3.74842 13.9153 4.18338C13.1026 4.61834 12.4564 5.30961 12.0771 6.14972C11.6978 6.98983 11.6067 7.93171 11.818 8.82893C10.1551 8.74558 8.52832 8.31345 7.04328 7.56059C5.55823 6.80773 4.24812 5.75098 3.19799 4.45893C2.82628 5.09738 2.63095 5.82315 2.63199 6.56193C2.63199 8.01193 3.36999 9.29293 4.49199 10.0429C3.828 10.022 3.17862 9.84271 2.59799 9.51993V9.57193C2.59819 10.5376 2.93236 11.4735 3.54384 12.221C4.15532 12.9684 5.00647 13.4814 5.95299 13.6729C5.33661 13.84 4.6903 13.8646 4.06299 13.7449C4.32986 14.5762 4.85 15.3031 5.55058 15.824C6.25117 16.345 7.09712 16.6337 7.96999 16.6499C7.10247 17.3313 6.10917 17.8349 5.04687 18.1321C3.98458 18.4293 2.87412 18.5142 1.77899 18.3819C3.69069 19.6114 5.91609 20.2641 8.18899 20.2619C15.882 20.2619 20.089 13.8889 20.089 8.36193C20.089 8.18193 20.084 7.99993 20.076 7.82193C20.8949 7.2301 21.6016 6.49695 22.163 5.65693L22.162 5.65593Z"></path>
        </svg>
      </button>
      
      <button
        onClick={shareOnLinkedIn}
        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-[#0A66C2] dark:text-white"
        >
          <path d="M6.94 5.00002C6.94 5.53046 6.7493 6.03914 6.41173 6.41672C6.07416 6.79429 5.59549 7.00002 5.09 7.00002C4.58451 7.00002 4.10584 6.79429 3.76827 6.41672C3.4307 6.03914 3.24 5.53046 3.24 5.00002C3.24 4.46958 3.4307 3.9609 3.76827 3.58332C4.10584 3.20575 4.58451 3.00002 5.09 3.00002C5.59549 3.00002 6.07416 3.20575 6.41173 3.58332C6.7493 3.9609 6.94 4.46958 6.94 5.00002ZM7 8.48002H3.18V21H7V8.48002ZM13.32 8.48002H9.51V21H13.32V14.43C13.32 10.77 18.2 10.43 18.2 14.43V21H22V13.07C22 6.90002 14.94 7.13002 13.32 10.16L13.32 8.48002Z"></path>
        </svg>
      </button>
      
      {/* แสดงปุ่ม Share เฉพาะเมื่ออยู่บนเบราว์เซอร์ที่รองรับ navigator.share */}
      {canShare && (
        <button
          onClick={shareNative}
          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Share"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
        </button>
      )}
      
      <button
        onClick={copyToClipboard}
        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label="Copy link"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      </button>
    </div>
  );
}