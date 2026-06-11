import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudentData, type StudentData } from '../../utils/studentMockData';
import { CalendarCheck, ShieldCheck, AlertTriangle } from 'lucide-react';

export function StudentAttendance() {
  const { user } = useAuth();
  const [data, setData] = useState<StudentData | null>(null);

  useEffect(() => {
    if (user?.id) setData(getStudentData(user.id));
  }, [user]);

  if (!data || !user) return <div className="text-center p-8">Loading attendance...</div>;

  const avgAttendance = data.subjects.reduce((sum, sub) => sum + sub.attendance, 0) / data.subjects.length;
  const isOverallSafe = avgAttendance >= 75;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Attendance Metrics</h1>
          <p className="text-gray-400 mt-1">Reviewing presence logs for <span className="text-primary font-medium">{user.name}</span></p>
        </div>
      </div>

      {/* Aggregate Overview */}
      <div className={`glass-card p-6 md:p-8 border ${isOverallSafe ? 'border-green-500/20' : 'border-red-500/20 relative overflow-hidden'}`}>
        {!isOverallSafe && <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] pointer-events-none"></div>}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 relative z-10">
          
          <div className="relative w-32 h-32 flex shrink-0 items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
              <circle 
                cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                strokeDasharray={`${avgAttendance * 2.51} 251.2`} 
                strokeLinecap="round"
                className={`transition-all duration-1000 ${isOverallSafe ? 'text-green-400' : 'text-red-500'}`} 
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{avgAttendance.toFixed(1)}%</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">Overall Status: {isOverallSafe ? 'Clear & Safe' : 'Warning: Below Threshold'}</h2>
            <p className="text-gray-400 max-w-2xl text-sm leading-relaxed">
              Your overall presence across all academic subjects sits at {avgAttendance.toFixed(1)}%. 
              {isOverallSafe 
                ? ' You are above the mandatory 75% university requirement. Keep up the good consistency.' 
                : ' You are currently violating the 75% university attendance requirement. Please attend incoming lectures strictly to avoid exam disqualification.'}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 border border-white/10">
              {isOverallSafe ? <ShieldCheck size={18} className="text-green-400"/> : <AlertTriangle size={18} className="text-red-400"/>}
              <span className={isOverallSafe ? 'text-green-400' : 'text-red-400'}>
                {isOverallSafe ? 'Eligible for Exams' : 'Action Required'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Matrix */}
      <h3 className="text-lg font-bold text-white mb-4 mt-8">Subject-wise Breakdown</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.subjects.map((sub, idx) => {
          const isSafe = sub.attendance >= 75;
          return (
            <div key={idx} className="glass-card p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-lg bg-white/5 text-gray-300">
                  <CalendarCheck size={20} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded bg-white/5 border ${isSafe ? 'text-green-400 border-green-500/20' : 'text-red-400 border-red-500/20'}`}>
                  {isSafe ? 'SAFE' : 'CRITICAL'}
                </span>
              </div>
              
              <h4 className="text-md font-bold text-white mb-1 truncate" title={sub.name}>{sub.name}</h4>
              <p className="text-xs text-gray-500 mb-6">Semester Requirement: 75%</p>
              
              <div className="mt-auto">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-400">Current Rate</span>
                  <span className={`font-bold ${isSafe ? 'text-green-400' : 'text-red-400'}`}>{sub.attendance}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${isSafe ? 'bg-green-400' : 'bg-red-400'}`} 
                    style={{ width: `${sub.attendance}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
