// app/admin/categories/new/page.tsx
import CategoryForm from '@/components/admin/CategoryForm';

export default function NewCategoryPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-dbhelvetica-bd text-2xl">เพิ่มหมวดหมู่ใหม่</h1>
        <p className="text-gray-600 dark:text-gray-300">
          เพิ่มหมวดหมู่ใหม่ลงในระบบ
        </p>
      </div>
      
      <CategoryForm initialData={null} />
    </div>
  );
}