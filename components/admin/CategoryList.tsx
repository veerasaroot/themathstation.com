'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';
import { slugify } from '@/utils/text';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  post_count: number;
}

interface CategoryListProps {
  initialCategories: Category[];
}

export default function CategoryList({ initialCategories }: CategoryListProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  
  // Edit form state
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  
  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setShowAddForm(false);
  };
  
  const resetEditForm = () => {
    setEditName('');
    setEditSlug('');
    setEditDescription('');
    setEditingId(null);
  };
  
  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug) {
      setSlug(slugify(value));
    }
  };
  
  const handleEditNameChange = (value: string) => {
    setEditName(value);
    if (editSlug === slugify(editName)) {
      setEditSlug(slugify(value));
    }
  };
  
  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditSlug(category.slug);
    setEditDescription(category.description || '');
  };
  
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const newCategory = {
        id: uuidv4(),
        name,
        slug,
        description: description || null,
      };
      
      const { error } = await supabase
        .from('categories')
        .insert(newCategory);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update local state
      setCategories([...categories, { ...newCategory, post_count: 0 }]);
      resetForm();
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการสร้างหมวดหมู่ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedCategory = {
        name: editName,
        slug: editSlug,
        description: editDescription || null,
      };
      
      const { error } = await supabase
        .from('categories')
        .update(updatedCategory)
        .eq('id', editingId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update local state
      setCategories(
        categories.map((cat) =>
          cat.id === editingId
            ? { ...cat, ...updatedCategory }
            : cat
        )
      );
      
      resetEditForm();
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการอัปเดตหมวดหมู่ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update local state
      setCategories(categories.filter((cat) => cat.id !== id));
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการลบหมวดหมู่ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Error notification */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 border-b border-red-100 dark:border-red-900">
          {error}
        </div>
      )}
      
      {/* Add Category Form */}
      {showAddForm && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-dbhelvetica-med text-lg mb-4">เพิ่มหมวดหมู่ใหม่</h2>
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-dbhelvetica-med mb-1">
                  ชื่อหมวดหมู่ <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                  required
                />
              </div>
              
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
              </div>
              
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
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-dbhelvetica-med hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  disabled={loading}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md font-dbhelvetica-med hover:bg-primary-600 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="py-3 px-6 text-left">ชื่อหมวดหมู่</th>
              <th className="py-3 px-6 text-left">Slug</th>
              <th className="py-3 px-6 text-left">คำอธิบาย</th>
              <th className="py-3 px-6 text-left">จำนวนบทความ</th>
              <th className="py-3 px-6 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                {editingId === category.id ? (
                  <td colSpan={5} className="p-4">
                    <form onSubmit={handleUpdate}>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="editName" className="block font-dbhelvetica-med mb-1">
                            ชื่อหมวดหมู่ <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="editName"
                            type="text"
                            value={editName}
                            onChange={(e) => handleEditNameChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="editSlug" className="block font-dbhelvetica-med mb-1">
                            Slug <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="editSlug"
                            type="text"
                            value={editSlug}
                            onChange={(e) => setEditSlug(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="editDescription" className="block font-dbhelvetica-med mb-1">
                            คำอธิบาย
                          </label>
                          <textarea
                            id="editDescription"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                          />
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={resetEditForm}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-dbhelvetica-med hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            disabled={loading}
                          >
                            ยกเลิก
                          </button>
                          <button
                            type="submit"
                            className="bg-primary text-white px-4 py-2 rounded-md font-dbhelvetica-med hover:bg-primary-600 transition-colors"
                            disabled={loading}
                          >
                            {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="py-3 px-6 font-dbhelvetica-med">{category.name}</td>
                    <td className="py-3 px-6 text-sm">{category.slug}</td>
                    <td className="py-3 px-6 text-sm">{category.description || '-'}</td>
                    <td className="py-3 px-6 text-sm">{category.post_count} บทความ</td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => startEditing(category)}
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 dark:text-red-400 hover:underline text-sm"
                          disabled={category.post_count > 0}
                          title={category.post_count > 0 ? 'ไม่สามารถลบหมวดหมู่ที่มีบทความได้' : ''}
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500 dark:text-gray-400">
                  ยังไม่มีหมวดหมู่ กดปุ่ม "เพิ่มหมวดหมู่ใหม่" เพื่อเริ่มต้น
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add Category Button */}
      {!showAddForm && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 text-center">
          <button
            onClick={() => setShowAddForm(true)}
            className="text-primary hover:underline font-dbhelvetica-med"
          >
            + เพิ่มหมวดหมู่ใหม่
          </button>
        </div>
      )}
    </div>
  );
}