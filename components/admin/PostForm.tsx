'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';
import { BlogPost, Category, Author } from '@/utils/supabase';
import dynamic from 'next/dynamic';
import { slugify } from '@/utils/text';

// Import the editor dynamically to avoid SSR issues
const MarkdownEditor = dynamic(() => import('./MarkdownEditor'), { ssr: false });

interface PostFormProps {
  categories: Category[];
  authors: Author[];
  initialData: BlogPost | null;
}

export default function PostForm({ categories, authors, initialData }: PostFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form state
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [authorId, setAuthorId] = useState(initialData?.author_id || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [publishStatus, setPublishStatus] = useState(initialData?.published || false);
  const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  
  // Auto-generate slug from title
  useEffect(() => {
    if (!initialData && title) {
      setSlug(slugify(title));
    }
  }, [title, initialData]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const postData = {
        title,
        slug,
        content,
        excerpt,
        author_id: authorId,
        category_id: categoryId || null,
        published: publishStatus,
        featured_image: featuredImage || null,
        tags,
        updated_at: new Date().toISOString(),
      };
      
      let response;
      
      if (initialData) {
        // Update existing post
        response = await supabase
          .from('posts')
          .update(postData)
          .eq('id', initialData.id);
      } else {
        // Create new post
        const newPost = {
          id: uuidv4(),
          created_at: new Date().toISOString(),
          view_count: 0,
          ...postData,
        };
        
        response = await supabase
          .from('posts')
          .insert(newPost);
      }
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      setSuccess(initialData ? 'บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว' : 'สร้างบทความใหม่เรียบร้อยแล้ว');
      
      if (!initialData) {
        // Redirect to posts list after creating
        setTimeout(() => {
          router.push('/admin/posts');
          router.refresh();
        }, 1500);
      } else {
        router.refresh();
      }
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!initialData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', initialData.id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      router.push('/admin/posts');
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการลบบทความ กรุณาลองใหม่อีกครั้ง');
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };
  
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Form header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-dbhelvetica-med text-xl">
          {initialData ? 'แก้ไขบทความ' : 'บทความใหม่'}
        </h2>
      </div>
      
      {/* Success/Error notifications */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 border-b border-red-100 dark:border-red-900">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 border-b border-green-100 dark:border-green-900">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block font-dbhelvetica-med mb-1">
              ชื่อบทความ <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
              required
            />
          </div>
          
          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block font-dbhelvetica-med mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md">
                /blog/
              </span>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                required
              />
            </div>
          </div>
          
          {/* Featured Image */}
          <div>
            <label htmlFor="featuredImage" className="block font-dbhelvetica-med mb-1">
              รูปภาพหลัก (URL)
            </label>
            <input
              id="featuredImage"
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
            />
            {featuredImage && (
              <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md">
                <p className="text-sm mb-1">ตัวอย่างรูปภาพ:</p>
                <img
                  src={featuredImage}
                  alt="Featured preview"
                  className="h-40 object-cover rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/post-placeholder.jpg';
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Author and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="author" className="block font-dbhelvetica-med mb-1">
                ผู้เขียน <span className="text-red-500">*</span>
              </label>
              <select
                id="author"
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                required
              >
                <option value="">เลือกผู้เขียน</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="category" className="block font-dbhelvetica-med mb-1">
                หมวดหมู่
              </label>
              <select
                id="category"
                value={categoryId || ''}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
              >
                <option value="">ไม่มีหมวดหมู่</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block font-dbhelvetica-med mb-1">
              แท็ก
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
                >
                  <span className="text-sm mr-2">{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="พิมพ์แท็กและกด Enter"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                เพิ่ม
              </button>
            </div>
          </div>
          
          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block font-dbhelvetica-med mb-1">
              สรุปย่อ <span className="text-red-500">*</span>
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
              required
            />
          </div>
          
          {/* Content */}
          <div>
            <label htmlFor="content" className="block font-dbhelvetica-med mb-1">
              เนื้อหา <span className="text-red-500">*</span>
            </label>
            <MarkdownEditor value={content} onChange={setContent} />
          </div>
          
          {/* Publish Status */}
          <div className="flex items-center">
            <input
              id="publishStatus"
              type="checkbox"
              checked={publishStatus}
              onChange={(e) => setPublishStatus(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="publishStatus" className="ml-2 block font-dbhelvetica-med">
              เผยแพร่บทความนี้
            </label>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-between">
          <div>
            {initialData && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md font-dbhelvetica-med hover:bg-red-700 transition-colors"
                disabled={loading}
              >
                ลบบทความ
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/posts')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-dbhelvetica-med hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              disabled={loading}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-md font-dbhelvetica-med hover:bg-primary-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </div>
      </form>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="font-dbhelvetica-bd text-lg mb-4">ยืนยันการลบบทความ</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้? การกระทำนี้ไม่สามารถเรียกคืนได้
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-dbhelvetica-med hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  disabled={loading}
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-md font-dbhelvetica-med hover:bg-red-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'กำลังลบ...' : 'ลบบทความ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}