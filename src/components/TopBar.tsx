import { useState, useRef, useEffect } from 'react';
import { UserCircle, LogOut, Bell, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function TopBar({ toggleSidebar: _toggleSidebar }: TopBarProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const timeString = time.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' });
  const dateString = time.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <header className="h-20 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4">

        <button 
          onClick={() => window.history.back()}
          className="p-1 px-3 text-sm flex items-center gap-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
        >
          &larr; Back
        </button>
        <div className="hidden md:block ml-2">
          <h2 className="text-xl font-semibold text-white">Welcome back, {user?.name.split(' ')[0] || 'User'}!</h2>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-0.5">{user?.collegeName}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6 relative">
        {/* Live Date & Time Panel */}
        <div className="flex items-center">
          <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-3 backdrop-blur-lg shadow-[0_0_15px_rgba(255,255,255,0.05)]">
             <Clock size={16} className="text-primary hidden sm:block" />
             <span className="text-xs sm:text-sm font-medium text-white tracking-wide hidden md:block">{dateString}</span>
             <span className="text-gray-500 text-xs hidden md:block">|</span>
             <span className="text-sm sm:text-base font-bold text-primary font-mono tabular-nums">{timeString}</span>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-full transition-colors relative"
          >
            <Bell size={24} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0a0a0a]"></span>
          </button>
          
          {notifOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-[#111111] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <p className="font-semibold text-white">Notifications</p>
                <span className="text-xs text-primary cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {[
                  { title: "Mid-Term Examination Schedule Released", time: "2 hours ago", type: "Exam" },
                  { title: "Updated assignment requirements for AI", time: "5 hours ago", type: "Academic" },
                  { title: "Campus building closure circular", time: "1 day ago", type: "Circular" },
                  { title: "Project Proposal submission deadline reminder", time: "2 days ago", type: "Assignment" }
                ].map((notif, idx) => (
                  <div key={idx} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                    <p className="text-sm font-medium text-gray-200 group-hover:text-primary transition-colors leading-snug">{notif.title}</p>
                    <div className="flex items-center justify-between mt-2">
                       <span className="text-xs text-primary/80 bg-primary/10 px-2 py-0.5 rounded">{notif.type}</span>
                       <span className="text-xs text-gray-500">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                <span className="text-sm text-primary">View All</span>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
        <div 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pl-2 pr-4 py-1.5 cursor-pointer hover:bg-white/10 transition-colors"
        >
          <UserCircle size={32} className="text-primary" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white leading-none">{user?.name || 'Loading...'}</p>
            <p className="text-xs text-gray-400 mt-1">{user?.role || 'User'}</p>
          </div>
        </div>

        {/* Profile Dropdown */}
        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-3 w-56 bg-[#111111] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            <div className="p-4 border-b border-white/10 bg-white/5">
              <p className="font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-primary">{user?.role}</p>
            </div>
            <div className="p-2">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-red-400 hover:bg-red-400/10 transition-all font-medium"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </header>
  );
}
