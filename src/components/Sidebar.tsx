import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  TrendingUp,
  Megaphone,
  LogOut,
  Menu,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { user, logout } = useAuth();
  const role = user?.role;

  const adminNav = [
    { path: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/admin/attendance', label: 'Attendance', icon: CalendarCheck },
    { path: '/dashboard/admin/students', label: 'View Students', icon: Users },
    { path: '/dashboard/admin/teachers', label: 'View Teachers', icon: UserCheck },
    { path: '/dashboard/admin/marks', label: 'Marks & Grades', icon: GraduationCap },
    { path: '/dashboard/admin/timetable', label: 'Timetable', icon: CalendarCheck },
    { path: '/dashboard/admin/notices', label: 'Notice Board', icon: Megaphone },
    { path: '/dashboard/admin/reports', label: 'Reports', icon: TrendingUp },
  ];

  const teacherNav = [
    { path: '/dashboard/teacher', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/teacher/attendance', label: 'Attendance', icon: CalendarCheck },
    { path: '/dashboard/teacher/students', label: 'My Students', icon: Users },
    { path: '/dashboard/teacher/add-student', label: 'Add Student', icon: UserPlus },
    { path: '/dashboard/teacher/marks', label: 'Manage Marks', icon: GraduationCap },
    { path: '/dashboard/teacher/timetable', label: 'Timetable', icon: CalendarCheck },
    { path: '/dashboard/teacher/notices', label: 'Notice Board', icon: Megaphone },
  ];

  const studentNav = [
    { path: '/dashboard/student', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/student/attendance', label: 'My Attendance', icon: CalendarCheck },
    { path: '/dashboard/student/marks', label: 'My Grades', icon: GraduationCap },
    { path: '/dashboard/student/timetable', label: 'Timetable', icon: CalendarCheck },
    { path: '/dashboard/student/notices', label: 'Notice Board', icon: Megaphone },
  ];

  let navItems = studentNav;
  if (role === 'Admin') navItems = adminNav;
  else if (role === 'Teacher') navItems = teacherNav;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen?.(false)}
        />
      )}
      <aside className={`fixed md:relative h-screen bg-[#0a0a0a] border-r border-white/10 flex flex-col pt-6 pb-6 shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-50 transition-all duration-300 shrink-0 ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 w-64 md:w-20'}`}>
        <div className={`px-4 mb-10 flex items-center ${isOpen ? 'justify-start' : 'justify-center'} overflow-hidden whitespace-nowrap h-12`}>
          <button 
            onClick={() => setIsOpen?.(!isOpen)}
            className="text-gray-400 hover:text-white transition-colors shrink-0 flex items-center justify-center focus:outline-none"
          >
            <Menu size={24} />
          </button>
          
          <div className={`flex flex-col justify-center transition-all duration-500 ease-in-out origin-left overflow-hidden ${isOpen ? 'max-w-[200px] opacity-100 ml-3 scale-100' : 'max-w-0 opacity-0 ml-0 scale-50 pointer-events-none'}`}>
            <h1 className="font-bold text-white tracking-wide text-xl leading-none">
              <span className="text-primary">Uni</span>Portal
            </h1>
            <p className="text-xs text-gray-500 mt-1 leading-none">{role} Panel</p>
          </div>
        </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
               if (window.innerWidth < 768) setIsOpen?.(false);
            }}
            end={item.path === `/dashboard/${role?.toLowerCase()}`}
            title={!isOpen ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 rounded-xl transition-all duration-300 ease-bounce hover:scale-105 hover:translate-x-1 font-medium ${
                isOpen ? 'px-4' : 'justify-center px-0'
              } ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon size={20} className="shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <button 
          onClick={logout}
          title={!isOpen ? "Logout" : undefined}
          className={`w-full flex items-center gap-3 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 ease-bounce hover:scale-105 hover:translate-x-1 font-medium ${isOpen ? 'px-4' : 'justify-center px-0'}`}
        >
          <LogOut size={20} className="shrink-0" />
          <span className={`whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
}
