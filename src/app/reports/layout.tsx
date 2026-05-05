import Sidebar from '@/components/Sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen"><Sidebar />{children}</div>
}
