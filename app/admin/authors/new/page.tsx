// app/admin/authors/new/page.tsx
import AuthorForm from '@/components/admin/AuthorForm';

export default function NewAuthorPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-dbhelvetica-bd text-2xl">เพิ่มผู้เขียนใหม่</h1>
        <p className="text-gray-600 dark:text-gray-300">
          เพิ่มข้อมูลผู้เขียนใหม่ลงในระบบ
        </p>
      </div>
      
      <AuthorForm initialData={null} />
    </div>
  );
}