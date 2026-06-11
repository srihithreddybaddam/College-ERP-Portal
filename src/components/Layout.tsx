import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useAuth, type Role } from '../context/AuthContext';
import { Bell } from 'lucide-react';

function NotificationManager() {
  const { user } = useAuth();
  const [activeNotifs, setActiveNotifs] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Poll the localStorage queue every 2 seconds
    const interval = setInterval(() => {
      const queue = JSON.parse(localStorage.getItem('notificationQueue') || '[]');
      if (queue.length > 0) {
        // Move them from queue to active state
        const myCollegeQueue = queue.filter((notif: any) => notif.collegeName === user.collegeName);
        const otherCollegesQueue = queue.filter((notif: any) => notif.collegeName !== user.collegeName);
        
        if (myCollegeQueue.length > 0) {
          setActiveNotifs(prev => [...prev, ...myCollegeQueue]);
        }
        localStorage.setItem('notificationQueue', JSON.stringify(otherCollegesQueue));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (activeNotifs.length > 0) {
      // Auto-dismiss the first notification after 3 seconds
      const timeout = setTimeout(() => {
        setActiveNotifs(prev => prev.slice(1));
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [activeNotifs]);

  if (activeNotifs.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {activeNotifs.map((notif, idx) => (
        <div key={notif.id + idx} className="bg-[#111111] border border-white/10 p-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] min-w-[300px] animate-in slide-in-from-right-8 fade-in duration-300 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 relative">
             <Bell size={20} />
             <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#111111]"></span>
          </div>
          <div>
            <p className="font-bold text-white leading-tight">{notif.user}</p>
            <p className="text-sm text-gray-400 mt-0.5">{notif.action} to the Portal</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardLayout({ allowedRole }: { allowedRole: Role }) {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  if (user?.role !== allowedRole) {
    if (user?.role === 'Admin') return <Navigate to="/dashboard/admin" replace />;
    if (user?.role === 'Teacher') return <Navigate to="/dashboard/teacher" replace />;
    return <Navigate to="/dashboard/student" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] overflow-hidden relative">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className={`flex-1 flex flex-col h-screen overflow-hidden text-white relative transition-all duration-300`}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <TopBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-0">
          <Outlet />
        </main>
      </div>

      {user?.role === 'Admin' && <NotificationManager />}
    </div>
  );
}
