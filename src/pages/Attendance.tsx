import { useState, useEffect } from 'react';
import { getStudentData, saveStudentData, type StudentData } from '../utils/studentMockData';
import { Search, CalendarCheck, CalendarX, AlertTriangle, ShieldCheck, Edit2, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface CombinedStudent {
  user: any;
  data: StudentData;
}

export function Attendance() {
  const { user } = useAuth();
  const [students, setStudents] = useState<CombinedStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Present' | 'Absent'>('All');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = () => {
    const usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
    const studentUsers = usersDB.filter((u: any) => u.role === 'Student' && u.collegeName === user?.collegeName);
    
    const combined = studentUsers.map((u: any) => ({
      user: u,
      data: getStudentData(u.id)
    }));
    setStudents(combined);
  };

  const handleMarkAttendance = (studentId: string, subjectIndex: number, isPresent: boolean | null) => {
    const sIndex = students.findIndex(s => s.user.id === studentId);
    if (sIndex === -1) return;

    const studentToUpdate = { ...students[sIndex] };
    const sub = studentToUpdate.data.subjects[subjectIndex];
    
    // Teacher can only mark once rule
    if (user?.role === 'Teacher' && sub.todayStatus) {
      return; 
    }
    if (user?.role === 'Teacher' && isPresent === null) {
      return; 
    }

    // Simulate taking attendance by modifying underlying aggregate percent math logic softly, and hardcoding today's lock
    if (isPresent === true && sub.todayStatus !== 'Present') {
      sub.attendance = Math.min(100, sub.attendance + 1);
      sub.todayStatus = 'Present';
    } else if (isPresent === false && sub.todayStatus !== 'Absent') {
      sub.attendance = Math.max(0, sub.attendance - 1);
      sub.todayStatus = 'Absent';
    } else if (isPresent === null) {
      // Revert lock
      if (sub.todayStatus === 'Present') sub.attendance = Math.max(0, sub.attendance - 1);
      if (sub.todayStatus === 'Absent') sub.attendance = Math.min(100, sub.attendance + 1);
      sub.todayStatus = null;
    }

    saveStudentData(studentToUpdate.data);
    
    const newStudentsList = [...students];
    newStudentsList[sIndex] = studentToUpdate;
    setStudents(newStudentsList);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.data.prn.toLowerCase().includes(searchTerm.toLowerCase());
                          
    if (!matchesSearch) return false;
    
    if (statusFilter === 'All') return true;
    
    // If filter is Present or Absent, show student if ALL subjects match that status, or AT LEAST ONE subject? 
    // Usually it's "if any subject is marked Present/Absent today"
    return s.data.subjects.some(sub => sub.todayStatus === statusFilter);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col justify-between mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Record Daily Attendance</h1>
        <p className="text-gray-400 mt-1">Select class presence to synchronize directly across student portals.</p>
      </div>

      <div className="glass-card p-4 md:p-6 flex flex-col md:flex-row gap-4 justify-between w-full">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by student name or PRN..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
           <Filter size={16} className="text-gray-400"/>
           <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              <button 
                onClick={() => setStatusFilter('All')} 
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${statusFilter === 'All' ? 'bg-primary text-black shadow' : 'text-gray-400 hover:text-white'}`}
              >
                All
              </button>
              <button 
                onClick={() => setStatusFilter('Present')} 
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${statusFilter === 'Present' ? 'bg-green-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Present
              </button>
              <button 
                onClick={() => setStatusFilter('Absent')} 
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${statusFilter === 'Absent' ? 'bg-red-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Absent
              </button>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredStudents.length === 0 ? (
           <div className="glass-card p-12 text-center text-gray-400">No student records found matching your active filters.</div>
        ) : filteredStudents.map((s) => {
           const avgAtt = s.data.subjects.reduce((sum, sub) => sum + sub.attendance, 0) / s.data.subjects.length;
           const isSafe = avgAtt >= 75;

           return (
             <div key={s.user.id} className="glass-card overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10 shrink-0">
                      <CalendarCheck size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{s.user.name}</h3>
                      <p className="text-sm text-gray-400 pr-[1px]">{s.data.prn} &bull; {s.data.course}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                       <p className="text-xs text-gray-400 uppercase font-semibold">Total Average</p>
                       <p className={`text-xl font-bold ${isSafe ? 'text-green-400' : 'text-red-400'}`}>{avgAtt.toFixed(1)}%</p>
                    </div>
                    <div className="hidden sm:block">
                      {isSafe ? <ShieldCheck size={28} className="text-green-500/50" /> : <AlertTriangle size={28} className="text-red-500/50" />}
                    </div>
                  </div>

                </div>

                <div className="p-4 bg-black/20">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {s.data.subjects.map((sub, idx) => (
                       <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                             <p className="text-sm font-semibold text-white leading-snug">{sub.name}</p>
                             <span className={`text-xs font-bold ${sub.attendance >= 75 ? 'text-green-400' : 'text-red-400'}`}>{sub.attendance}%</span>
                          </div>
                          
                          {sub.todayStatus ? (
                            <div className={`mt-4 flex items-center justify-between px-3 py-2 rounded border ${sub.todayStatus === 'Present' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400' }`}>
                               <span className="text-xs font-bold flex items-center gap-1.5">
                                 {sub.todayStatus === 'Present' ? <CalendarCheck size={14}/> : <CalendarX size={14} />} 
                                 {sub.todayStatus}
                               </span>
                               {user?.role === 'Admin' && (
                                 <button 
                                   onClick={() => handleMarkAttendance(s.user.id, idx, null)}
                                   className="p-1 hover:bg-white/10 rounded-md transition-colors"
                                   title="Edit Status"
                                 >
                                   <Edit2 size={12} />
                                 </button>
                               )}
                            </div>
                          ) : (
                            <div className="flex gap-2 mt-4">
                               <button onClick={() => handleMarkAttendance(s.user.id, idx, true)} className="flex-1 flex justify-center items-center gap-1.5 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded border border-green-500/20 text-xs font-medium transition-colors">
                                 Present
                               </button>
                               <button onClick={() => handleMarkAttendance(s.user.id, idx, false)} className="flex-1 flex justify-center items-center gap-1.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded border border-red-500/20 text-xs font-medium transition-colors">
                                 Absent
                               </button>
                            </div>
                          )}
                       </div>
                     ))}
                   </div>
                </div>
             </div>
           );
        })}
      </div>
    </div>
  );
}
