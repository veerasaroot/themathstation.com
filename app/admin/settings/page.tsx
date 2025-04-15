'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  social_facebook: string;
  social_twitter: string;
  social_instagram: string;
  footer_text: string;
}

const defaultSettings: SiteSettings = {
  site_name: 'The Math Station',
  site_description: 'สถานีความรู้คณิตศาสตร์',
  contact_email: 'contact@mathstation.com',
  social_facebook: '',
  social_twitter: '',
  social_instagram: '',
  footer_text: '© The Math Station. สงวนลิขสิทธิ์',
};

export default function SettingsPage() {
  const supabase = createClientComponentClient();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching settings:', error);
          return;
        }

        if (data) {
          setSettings(data as SiteSettings);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('settings')
        .upsert(settings, {
          onConflict: 'id',
        });

      if (error) {
        throw new Error(error.message);
      }

      setSuccess('บันทึกการตั้งค่าเรียบร้อยแล้ว');
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่า กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-dbhelvetica-bd text-2xl">ตั้งค่าเว็บไซต์</h1>
        <p className="text-gray-600 dark:text-gray-300">
          จัดการการตั้งค่าเว็บไซต์ The Math Station
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Error/Success notifications */}
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

        {loading ? (
          <div className="p-6 text-center">กำลังโหลดข้อมูล...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-dbhelvetica-med text-lg mb-4">ข้อมูลทั่วไป</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="site_name" className="block font-dbhelvetica-med mb-1">
                    ชื่อเว็บไซต์
                  </label>
                  <input
                    id="site_name"
                    name="site_name"
                    type="text"
                    value={settings.site_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="site_description" className="block font-dbhelvetica-med mb-1">
                    คำอธิบายเว็บไซต์
                  </label>
                  <textarea
                    id="site_description"
                    name="site_description"
                    value={settings.site_description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="contact_email" className="block font-dbhelvetica-med mb-1">
                    อีเมลติดต่อ
                  </label>
                  <input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-dbhelvetica-med text-lg mb-4">โซเชียลมีเดีย</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="social_facebook" className="block font-dbhelvetica-med mb-1">
                    Facebook URL
                  </label>
                  <input
                    id="social_facebook"
                    name="social_facebook"
                    type="text"
                    value={settings.social_facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/yourusername"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="social_twitter" className="block font-dbhelvetica-med mb-1">
                    Twitter URL
                  </label>
                  <input
                    id="social_twitter"
                    name="social_twitter"
                    type="text"
                    value={settings.social_twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/yourusername"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="social_instagram" className="block font-dbhelvetica-med mb-1">
                    Instagram URL
                  </label>
                  <input
                    id="social_instagram"
                    name="social_instagram"
                    type="text"
                    value={settings.social_instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/yourusername"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-dbhelvetica-med text-lg mb-4">ส่วนท้ายเว็บไซต์</h2>

              <div>
                <label htmlFor="footer_text" className="block font-dbhelvetica-med mb-1">
                  ข้อความส่วนท้ายเว็บไซต์
                </label>
                <textarea
                  id="footer_text"
                  name="footer_text"
                  value={settings.footer_text}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-md font-dbhelvetica-med hover:bg-primary-600 transition-colors"
                disabled={saving}
              >
                {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}