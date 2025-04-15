'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';
import { slugify } from '@/utils/text';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface CategoryFormProps {
  initialData: Category | null;
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form state
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  
  // Auto-generate slug from name
  useEffect(() => {
    if (!initialData && name) {
      setSlug(slugify(name));
    }
  }, [name, initialData]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const categoryData = {
        name,
        slug,
        description: description || null,
      };
      
      let response;
      
      if (initialData) {
        // Update existing category
        response = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', initialData.id);
      } else {
        // Create new category
        const newCategory = {
          id: uuidv4(),
          ...categoryData,
        };
        
        response = await supabase
          .from('categories')
          .insert(newCategory);
      }
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      setSuccess(initialData ? 'บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว' : 'สร้างหมวดหมู่ใหม่เรียบร้อยแล้ว');
      
      // Redirect after creating or updating
      setTimeout(() => {
        router.push('/admin/categories');
        router.refresh();
      }, 1500);
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
        .from('categories')
        .delete()
        .eq('id', initialData.id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      router.push('/admin/categories');
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการลบหมวดหมู่ กรุณาลองใหม่อีกครั้ง');
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Form header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-dbhelvetica-med text-xl">
          {initialData ? 'แก้ไขหมวดหมู่' : 'หมวดหมู่ใหม่'}
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
          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-dbhelvetica-med mb-1">
              ชื่อหมวดหมู่ <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
              required
            />
          </div>
          
          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block font-dbhelvetica-med mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
              required
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              URL-friendly name. ใช้สำหรับลิงก์ URL เช่น /categories/your-slug
            </p>
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-dbhelvetica-med mb-1">
              คำอธิบาย
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
            />
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
                ลบหมวดหมู่
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/categories')}
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
              <h3 className="font-dbhelvetica-bd text-lg mb-4">ยืนยันการลบหมวดหมู่</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้? การกระทำนี้ไม่สามารถเรียกคืนได้
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
                  {loading ? 'กำลังลบ...' : 'ลบหมวดหมู่'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}