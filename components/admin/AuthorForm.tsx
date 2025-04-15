'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';

interface Author {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
}

interface AuthorFormProps {
  initialData: Author | null;
}

export default function AuthorForm({ initialData }: AuthorFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form state
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar_url || '');
  const [bio, setBio] = useState(initialData?.bio || '');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const authorData = {
        name,
        email,
        avatar_url: avatarUrl || null,
        bio: bio || null,
      };
      
      let response;
      
      if (initialData) {
        // Update existing author
        response = await supabase
          .from('authors')
          .update(authorData)
          .eq('id', initialData.id);
      } else {
        // Create new author
        const newAuthor = {
          id: uuidv4(),
          ...authorData,
        };
        
        response = await supabase
          .from('authors')
          .insert(newAuthor);
      }
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      setSuccess(initialData ? 'บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว' : 'สร้างผู้เขียนใหม่เรียบร้อยแล้ว');
      
      // Redirect after creating or updating
      setTimeout(() => {
        router.push('/admin/authors');
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
        .from('authors')
        .delete()
        .eq('id', initialData.id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      router.push('/admin/authors');
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการลบผู้เขียน กรุณาลองใหม่อีกครั้ง');
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
          {initialData ? 'แก้ไขข้อมูลผู้เขียน' : 'เพิ่มผู้เขียนใหม่'}
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
              ชื่อ <span className="text-red-500">*</span>
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
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-dbhelvetica-med mb-1">
              อีเมล <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
              required
            />
          </div>
          
          {/* Avatar URL */}
          <div>
            <label htmlFor="avatarUrl" className="block font-dbhelvetica-med mb-1">
              URL รูปโปรไฟล์
            </label>
            <input
              id="avatarUrl"
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
            />
            {avatarUrl && (
              <div className="mt-2">
                <p className="text-sm mb-1">ตัวอย่างรูปภาพ:</p>
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img
                    src={avatarUrl}
                    alt="Avatar preview"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/avatar-placeholder.jpg';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block font-dbhelvetica-med mb-1">
              ประวัติโดยย่อ
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
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
                ลบผู้เขียน
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/authors')}
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
              <h3 className="font-dbhelvetica-bd text-lg mb-4">ยืนยันการลบผู้เขียน</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                คุณแน่ใจหรือไม่ว่าต้องการลบผู้เขียนนี้? การกระทำนี้ไม่สามารถเรียกคืนได้
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
                  {loading ? 'กำลังลบ...' : 'ลบผู้เขียน'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}