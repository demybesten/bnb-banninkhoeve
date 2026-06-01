// app/admin/layout.tsx
import AdminNav from '@/components/AdminNav'
import { Toaster } from 'react-hot-toast'

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-100">
            <AdminNav />
            <main>
                {children}
            </main>
            <Toaster position="top-center" />
        </div>
    )
}