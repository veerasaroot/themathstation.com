'use client';

import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import MathJax from './MathJax';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [renderedContent, setRenderedContent] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    try {
      // สร้าง renderer
      const renderer = new marked.Renderer();
      
      // กำหนดฟังก์ชัน renderer.code ใหม่
      // @ts-ignore - ใช้ ts-ignore เพื่อแก้ปัญหา TypeScript
      renderer.code = function(text: string, lang?: string) {
        return `<pre class="code-block-placeholder" data-code="${encodeURIComponent(
          text
        )}" data-language="${lang || 'text'}"></pre>`;
      };

      // ตั้งค่า marked options ตาม interface ที่ถูกต้องในเวอร์ชันที่ใช้
      // ตรวจสอบ console.log(marked.getDefaults()) เพื่อดูตัวเลือกที่มี
      marked.use({ 
        renderer,
        gfm: true,
        breaks: true
      });

      // Parse markdown เป็น HTML
      const html = marked.parse(content);

      // ตรวจสอบว่าผลลัพธ์เป็น string
      if (typeof html !== 'string') {
        console.error('Expected string from marked.parse but got:', html);
        return;
      }

      // แยกส่วน HTML และ math expressions
      const mathRegex = /\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g;
      const codeBlockRegex = /<pre class="code-block-placeholder" data-code="([^"]*)" data-language="([^"]*)"><\/pre>/g;
      
      let lastIndex = 0;
      const elements: React.ReactNode[] = [];
      // แปลงรหัสพิเศษในรูปแบบ HTML กลับเป็นอักขระปกติ
      const tempHtml = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
      
      // ประมวลผล math blocks ก่อน
      let mathMatch;
      let processedHtml = tempHtml;
      
      while ((mathMatch = mathRegex.exec(tempHtml)) !== null) {
        const fullMatch = mathMatch[0];
        const displayMath = mathMatch[1];
        const inlineMath = mathMatch[2];
        
        const beforeMath = tempHtml.substring(lastIndex, mathMatch.index);
        
        if (beforeMath) {
          elements.push(<div key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: beforeMath }} />);
        }
        
        if (displayMath) {
          elements.push(
            <MathJax key={`math-${mathMatch.index}`} math={displayMath} display={true} />
          );
        } else if (inlineMath) {
          elements.push(
            <MathJax key={`math-${mathMatch.index}`} math={inlineMath} display={false} />
          );
        }
        
        lastIndex = mathMatch.index + fullMatch.length;
        
        // แทนที่ math expressions ด้วย placeholders
        processedHtml = processedHtml.replace(fullMatch, `<span class="math-placeholder-${elements.length - 1}"></span>`);
      }
      
      // เพิ่มเนื้อหาที่เหลือ
      if (lastIndex < tempHtml.length) {
        elements.push(<div key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: tempHtml.substring(lastIndex) }} />);
      }
      
      // ประมวลผล code blocks
      const finalElements: React.ReactNode[] = [];
      
      elements.forEach((element, index) => {
        if (React.isValidElement<{ dangerouslySetInnerHTML?: { __html: string } }>(element) && 
            element.props?.dangerouslySetInnerHTML) {
          const htmlContent = element.props.dangerouslySetInnerHTML.__html;
          let lastCodeIndex = 0;
          const codeElements: React.ReactNode[] = [];
          
          let codeMatch;
          while ((codeMatch = codeBlockRegex.exec(htmlContent)) !== null) {
            const [fullMatch, encodedCode, language] = codeMatch;
            const code = decodeURIComponent(encodedCode);
            
            const beforeCode = htmlContent.substring(lastCodeIndex, codeMatch.index);
            if (beforeCode) {
              codeElements.push(
                <div key={`text-${index}-${lastCodeIndex}`} dangerouslySetInnerHTML={{ __html: beforeCode }} />
              );
            }
            
            codeElements.push(
              <CodeBlock key={`code-${index}-${codeMatch.index}`} code={code} language={language} />
            );
            
            lastCodeIndex = codeMatch.index + fullMatch.length;
          }
          
          // เพิ่มเนื้อหาที่เหลือ
          if (lastCodeIndex < htmlContent.length) {
            codeElements.push(
              <div
                key={`text-${index}-${lastCodeIndex}`}
                dangerouslySetInnerHTML={{ __html: htmlContent.substring(lastCodeIndex) }}
              />
            );
          }
          
          finalElements.push(...codeElements);
        } else {
          // สำหรับ MathJax components ให้เพิ่มลงไปโดยตรง
          finalElements.push(element);
        }
      });
      
      setRenderedContent(finalElements);
    } catch (error) {
      console.error('Error rendering markdown:', error);
      // แสดงข้อความผิดพลาดให้ผู้ใช้ทราบ
      setRenderedContent([
        <div key="error" className="text-red-500">
          เกิดข้อผิดพลาดในการแสดงเนื้อหา กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ
        </div>
      ]);
    }
  }, [content]);

  // เพิ่ม debugging เพื่อตรวจสอบว่ามีการเรนเดอร์เนื้อหาหรือไม่
  useEffect(() => {
    console.log('Rendered content length:', renderedContent.length);
  }, [renderedContent]);

  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      {renderedContent.length > 0 ? (
        renderedContent
      ) : (
        <div className="animate-pulse">กำลังโหลดเนื้อหา...</div>
      )}
    </div>
  );
}