'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// Dynamically import the component to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

// The previewer is also dynamically imported
const EditorPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Set mounted to true on client side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-700 h-96">
        กำลังโหลดโปรแกรมแก้ไข...
      </div>
    );
  }
  
  // To fix dark mode issues with the editor
  const handleTheme = () => {
    const darkMode = document.documentElement.classList.contains('dark');
    return darkMode ? 'dark' : 'light';
  };
  
  return (
    <div data-color-mode={handleTheme()}>
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {previewMode ? 'แก้ไข' : 'ดูตัวอย่าง'}
        </button>
      </div>
      
      {previewMode ? (
        <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-800 min-h-96 overflow-auto">
          <EditorPreview source={value} />
        </div>
      ) : (
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          height={400}
          preview="edit"
          hideToolbar={false}
          toolbarHeight={60}
        />
      )}
      
      <div className="mt-2">
        <details className="text-sm">
          <summary className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline">
            คำแนะนำการใช้ Markdown
          </summary>
          <div className="mt-2 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
            <h4 className="font-dbhelvetica-med mb-2">Markdown Cheatsheet</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li><code># หัวข้อใหญ่</code> - หัวข้อขนาดใหญ่</li>
              <li><code>## หัวข้อรอง</code> - หัวข้อขนาดกลาง</li>
              <li><code>### หัวข้อย่อย</code> - หัวข้อขนาดเล็ก</li>
              <li><code>**ข้อความ**</code> - <strong>ตัวหนา</strong></li>
              <li><code>*ข้อความ*</code> - <em>ตัวเอียง</em></li>
              <li><code>[ข้อความ](URL)</code> - ลิงก์</li>
              <li><code>![คำอธิบายภาพ](URL)</code> - รูปภาพ</li>
              <li><code>\`code\`</code> - โค้ดแบบบรรทัดเดียว</li>
              <li>
                <pre className="text-sm">{`\`\`\`javascript
// code block
console.log("Hello World");
\`\`\``}</pre>
                - โค้ดแบบหลายบรรทัด
              </li>
              <li><code>$$E = mc^2$$</code> - สมการคณิตศาสตร์ (KaTeX)</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
}