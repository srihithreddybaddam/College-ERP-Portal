import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudentData, type StudentData } from '../../utils/studentMockData';
import { Mail, FileText, BookOpen, Clock, Edit2, TrendingUp, AlertTriangle } from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<StudentData | null>(null);

  useEffect(() => {
    if (user?.id) setData(getStudentData(user.id));
  }, [user]);

  if (!data || !user) return <div className="text-center p-8">Loading profile...</div>;

  const totalMarks = data.subjects.reduce((sum, sub) => sum + sub.marks, 0);
  const avgMarks = totalMarks / data.subjects.length || 0;
  const avgAttendance = data.subjects.reduce((sum, sub) => sum + sub.attendance, 0) / data.subjects.length || 0;
  const highestSub = data.subjects.length > 0 ? data.subjects.reduce((p, c) => (p.marks > c.marks ? p : c)) : null;
  const lowestSub = data.subjects.length > 0 ? data.subjects.reduce((p, c) => (p.marks < c.marks ? p : c)) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Student Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your personalized academic profile.</p>
        </div>
      </div>

      {/* Primary Context Card */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div className="w-24 h-24 shrink-0 bg-white/10 rounded-2xl flex items-center justify-center text-4xl font-bold text-primary border border-white/10 shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 w-full relative">
            <button className="absolute top-0 right-0 text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-lg">
              <Edit2 size={16} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 mt-6">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Email</p>
                <p className="text-sm text-gray-200 flex items-center gap-2"><Mail size={14} className="text-primary"/> {user.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">PRN Number</p>
                <p className="text-sm font-mono text-cyan-300 flex items-center gap-2"><FileText size={14} className="text-primary"/> {data.prn}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Branch</p>
                <p className="text-sm text-gray-200 flex items-center gap-2"><BookOpen size={14} className="text-primary"/> {data.course}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Stats Track */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="glass-card p-6 flex flex-col justify-center">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Attendance</p>
            <h3 className={`text-2xl font-bold ${avgAttendance >= 75 ? 'text-white' : 'text-red-400'}`}>{avgAttendance.toFixed(1)}%</h3>
         </div>
         <div className="glass-card p-6 flex flex-col justify-center">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Cumulative Marks (GPA)</p>
            <h3 className="text-2xl font-bold text-white">{avgMarks.toFixed(1)} <span className="text-sm text-gray-500 font-medium">/ 100</span></h3>
         </div>
         <div className="glass-card p-6 flex flex-col justify-center border border-green-500/10">
            <p className="text-xs text-green-500 uppercase font-bold mb-1 flex items-center gap-1"><TrendingUp size={12}/> Strongest Subject</p>
            <h3 className="text-lg font-bold text-white truncate">{highestSub?.name || 'N/A'}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{highestSub?.marks} points</p>
         </div>
         <div className="glass-card p-6 flex flex-col justify-center border border-red-500/10">
            <p className="text-xs text-red-400 uppercase font-bold mb-1 flex items-center gap-1"><AlertTriangle size={12}/> Weakest Subject</p>
            <h3 className="text-lg font-bold text-white truncate">{lowestSub?.name || 'N/A'}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{lowestSub?.marks} points</p>
         </div>
      </div>

      {/* Dynamic Tasks / Assignments */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-4">Upcoming Assignments</h3>
        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div>
                <h4 className="font-bold text-white mb-1">Database Schema Design</h4>
                <p className="text-xs text-gray-400">Database Mgmt</p>
             </div>
             <div className="flex items-center shrink-0 gap-2 text-sm text-red-400 font-medium">
                <Clock size={16} /> Due Tomorrow
             </div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div>
                <h4 className="font-bold text-white mb-1">Agile Sprint Documentation</h4>
                <p className="text-xs text-gray-400">Software Eng</p>
             </div>
             <div className="flex items-center shrink-0 gap-2 text-sm text-yellow-400 font-medium">
                <Clock size={16} /> Due in 3 days
             </div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div>
                <h4 className="font-bold text-white mb-1">Process Scheduling Algorithm Implementation</h4>
                <p className="text-xs text-gray-400">Operating Sys</p>
             </div>
             <div className="flex items-center shrink-0 gap-2 text-sm text-yellow-400 font-medium">
                <Clock size={16} /> Due in 5 days
             </div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div>
                <h4 className="font-bold text-white mb-1">Binary Search Tree Traversals</h4>
                <p className="text-xs text-gray-400">Data Structures</p>
             </div>
             <div className="flex items-center shrink-0 gap-2 text-sm text-green-400 font-medium">
                <Clock size={16} /> Due Next Week
             </div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div>
                <h4 className="font-bold text-white mb-1">Subnetting Configuration Assignment</h4>
                <p className="text-xs text-gray-400">Computer Networks</p>
             </div>
             <div className="flex items-center shrink-0 gap-2 text-sm text-green-400 font-medium">
                <Clock size={16} /> Due Next Week
             </div>
          </div>
        </div>
      </div>
    
    </div>
  );
}
