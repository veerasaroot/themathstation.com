'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

interface Author {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  post_count: number;
}

interface AuthorListProps {
  initialAuthors: Author[];
}

export default function AuthorList({ initialAuthors }: AuthorListProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [authors, setAuthors] = useState<Author[]>(initialAuthors);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  
  // Edit form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editBio, setEditBio] = useState('');
  
  const resetForm = () => {
    setName('');
    setEmail('');
    setAvatarUrl('');
    setBio('');
    setShowAddForm(false);
  };
  
  const resetEditForm = () => {
    setEditName('');
    setEditEmail('');
    setEditAvatarUrl('');
    setEditBio('');
    setEditingId(null);
  };
  
  const startEditing = (author: Author) => {
    setEditingId(author.id);
    setEditName(author.name);
    setEditEmail(author.email);
    setEditAvatarUrl(author.avatar_url || '');
    setEditBio(author.bio || '');
  };
  
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const newAuthor = {
        id: uuidv4(),
        name,
        email,
        avatar_url: avatarUrl || null,
        bio: bio || null,
      };
      
      const { error } = await supabase
        .from('authors')
        .insert(newAuthor);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update local state
      setAuthors([...authors, { ...newAuthor, post_count: 0 }]);
      resetForm();
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการสร้างผู้เขียน กรุณาลองใหม่อีกครั้ง');
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
      const updatedAuthor = {
        name: editName,
        email: editEmail,
        avatar_url: editAvatarUrl || null,
        bio: editBio || null,
      };
      
      const { error } = await supabase
        .from('authors')
        .update(updatedAuthor)
        .eq('id', editingId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update local state
      setAuthors(
        authors.map((author) =>
          author.id === editingId
            ? { ...author, ...updatedAuthor }
            : author
        )
      );
      
      resetEditForm();
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้เขียน กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้เขียนนี้?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('authors')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update local state
      setAuthors(authors.filter((author) => author.id !== id));
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการลบผู้เขียน กรุณาลองใหม่อีกครั้ง');
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
      
      {/* Add Author Form */}
      {showAddForm && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-dbhelvetica-med text-lg mb-4">เพิ่มผู้เขียนใหม่</h2>
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
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
              
              <div>
                <label htmlFor="bio" className="block font-dbhelvetica-med mb-1">
                  ประวัติโดยย่อ
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
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
      
      {/* Authors List */}
      <div>
        {authors.map((author) => (
          <div
            key={author.id}
            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            {editingId === author.id ? (
              <div className="p-6">
                <form onSubmit={handleUpdate}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="editName" className="block font-dbhelvetica-med mb-1">
                        ชื่อ <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="editName"
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
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
              </div>
            ) : (
              <div className="p-6 flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {author.avatar_url ? (
                      <img
                        src={author.avatar_url}
                        alt={author.name}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/avatar-placeholder.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-dbhelvetica-bd text-gray-500">
                        {author.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-dbhelvetica-bd text-lg">{author.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{author.email}</p>
                  
                  {author.bio && (
                    <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                      {author.bio}
                    </p>
                  )}
                  
                  <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    {author.post_count} บทความ
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(author)}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(author.id)}
                      className="text-red-600 dark:text-red-400 hover:underline text-sm"
                      disabled={author.post_count > 0}
                      title={author.post_count > 0 ? 'ไม่สามารถลบผู้เขียนที่มีบทความได้' : ''}
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {authors.length === 0 && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            ยังไม่มีผู้เขียน กดปุ่ม "เพิ่มผู้เขียนใหม่" เพื่อเริ่มต้น
          </div>
        )}
      </div>
      
      {/* Add Author Button */}
      {!showAddForm && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 text-center">
          <button
            onClick={() => setShowAddForm(true)}
            className="text-primary hover:underline font-dbhelvetica-med"
          >
            + เพิ่มผู้เขียนใหม่
          </button>
        </div>
      )}
    </div>
  );
}