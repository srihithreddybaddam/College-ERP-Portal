import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { calculateGrade } from '../utils/gradeCalculator';
import { Award, TrendingUp, Presentation } from 'lucide-react';
import { getStudentData } from '../utils/studentMockData';
import { useAuth } from '../context/AuthContext';

export function Reports() {
  const { user } = useAuth();
  const [data, setData] = useState<any>({
    marksData: [],
    attendanceData: [],
    topper: null,
    totalStudents: 0,
    universityAverage: 0
  });

  useEffect(() => {
    if (!user) return;
    // Analytics Parser for real metrics
    const usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
    const studentUsers = usersDB.filter((u: any) => u.role === 'Student' && u.collegeName === user.collegeName);
    
    if (studentUsers.length === 0) {
      setData({ marksData: [], attendanceData: [], topper: null, totalStudents: 0, universityAverage: 0 });
      return;
    }

    let highestScore = -1;
    let topperDetails = null;

    let subMap: Record<string, { total: number, count: number }> = {};
    let aggAtt = { present: 0, total: 0 };
    let uniTotalScore = 0;

    studentUsers.forEach((stu: any) => {
      const pData = getStudentData(stu.id);
      
      let stuTotalMarks = 0;
      let stuSubCount = pData.subjects.length;

      pData.subjects.forEach(sub => {
        stuTotalMarks += sub.marks;
        
        // Subject Average Builder
        if (!subMap[sub.name]) subMap[sub.name] = { total: 0, count: 0 };
        subMap[sub.name].total += sub.marks;
        subMap[sub.name].count += 1;

        // Attendance Builder (Translating aggregate % loosely to counts to feed Pie Chart visually)
        aggAtt.present += sub.attendance;
        aggAtt.total += 100;
      });

      uniTotalScore += (stuTotalMarks / stuSubCount || 0);

      if (stuTotalMarks > highestScore) {
        highestScore = stuTotalMarks;
        topperDetails = {
           name: stu.name,
           prn: pData.prn,
           course: pData.course,
           total: highestScore,
           grade: calculateGrade((highestScore / (stuSubCount * 100)) * 100).grade,
           percentage: (highestScore / (stuSubCount * 100)) * 100
        };
      }
    });

    const finalMarksData = Object.keys(subMap).map(k => ({
      subject: k,
      marks: Math.round(subMap[k].total / subMap[k].count)
    }));

    const attendancePercentage = (aggAtt.present / aggAtt.total) * 100 || 0;
    const finalAttData = [
      { name: 'Present Context', value: Math.round(attendancePercentage), color: '#22d3ee' },
      { name: 'Absent Context', value: Math.round(100 - attendancePercentage), color: '#1f2937' },
    ];

    setData({
      marksData: finalMarksData,
      attendanceData: finalAttData,
      topper: topperDetails,
      totalStudents: studentUsers.length,
      universityAverage: studentUsers.length > 0 ? (uniTotalScore / studentUsers.length) : 0
    });

  }, [user]);

  if (!user) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-12">
         <div>
           <h1 className="text-2xl font-bold text-white mb-2">Academic Reports</h1>
           <p className="text-gray-400">Detailed performance analytics and statistics.</p>
         </div>
         <div className="glass-card p-12 text-center text-gray-400">
           Loading report analytics...
         </div>
      </div>
    );
  }

  if (data.totalStudents === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-12">
         <div>
           <h1 className="text-2xl font-bold text-white mb-2">Academic Reports</h1>
           <p className="text-gray-400">Detailed performance analytics and statistics.</p>
         </div>
         <div className="glass-card p-12 text-center text-gray-400">
           No active students exist to generate reports. Please add students first.
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">Academic Reports Analytics</h1>
        <p className="text-gray-400">Holistic performance algorithms generated automatically via registered user metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Averages Card */}
        <div className="glass-card p-6 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <TrendingUp size={120} />
          </div>
          <h3 className="text-sm text-gray-400 mb-6 font-semibold uppercase tracking-wider">Campus Wide Averages</h3>
          <div className="space-y-6 relative z-10">
            <div>
              <p className="text-sm text-gray-500 font-medium">Population Size</p>
              <p className="text-2xl font-bold text-white">{data.totalStudents} Active Scholars</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Mean Marks (GPA)</p>
                <p className="text-2xl font-bold text-primary">{Math.round(data.universityAverage)} <span className="text-sm text-gray-400">/ 100</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Mean Grade</p>
                <p className="text-2xl font-bold text-white">{calculateGrade(data.universityAverage).grade}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performer Highlight */}
        {data.topper && (
          <div className="glass-card p-6 lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#0f2129]">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10">
              <Award size={250} className="text-primary" />
            </div>
            <h3 className="text-sm text-amber-400/80 mb-6 font-semibold uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-amber-400" /> Crown Scholar (Highest Absolute Marks)
            </h3>
            <div className="flex flex-col md:flex-row md:items-center gap-6 mt-2 z-10 relative">
              <div className="w-16 h-16 md:w-24 md:h-24 shrink-0 rounded-full bg-amber-400/10 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.15)]">
                <span className="text-2xl md:text-4xl font-bold">{data.topper.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{data.topper.name}</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                   <p className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">PRN: {data.topper.prn}</p>
                   <p className="text-gray-300 bg-white/5 px-2 py-0.5 rounded">{data.topper.course}</p>
                   <p className="text-gray-300 bg-white/5 px-2 py-0.5 rounded">Grade: {data.topper.grade}</p>
                </div>
                <p className="text-gray-400 mt-4 text-sm leading-relaxed max-w-xl">
                  Generated the highest summation of analytical marks across the enrolled demographic, holding an aggregate parameter of <span className="font-bold text-white">{data.topper.percentage.toFixed(1)}%</span>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Bar Chart - Subjects */}
        <div className="glass-card p-6 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Presentation size={18} className="text-primary"/> Mean Subject Spread</h3>
          <div className="flex-1 animate-in fade-in zoom-in-95 duration-700 delay-150 fill-mode-both">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.marksData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="subject" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                  contentStyle={{ backgroundColor: '#111', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff', fontWeight: 600 }}
                />
                <Bar dataKey="marks" radius={[4, 4, 0, 0]} animationDuration={1500}>
                  {data.marksData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.marks >= 75 ? '#22d3ee' : '#a78bfa'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Attendance */}
        <div className="glass-card p-6 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-purple-400"/> Aggregated Demographic Presence</h3>
          <div className="flex-1 text-center -mt-6 animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-both">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={data.attendanceData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  animationDuration={1500}
                >
                  {data.attendanceData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 -mt-4">
              {data.attendanceData.map((entry: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm font-medium text-gray-300">{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
