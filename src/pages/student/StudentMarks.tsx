import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudentData, type StudentData } from '../../utils/studentMockData';
import { GraduationCap, TrendingUp, Trophy, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function StudentMarks() {
  const { user } = useAuth();
  const [data, setData] = useState<StudentData | null>(null);

  useEffect(() => {
    if (user?.id) setData(getStudentData(user.id));
  }, [user]);

  if (!data || !user) return <div className="text-center p-8">Loading grades...</div>;

  const totalMarks = data.subjects.reduce((sum, sub) => sum + sub.marks, 0);
  const maxPossibleMarks = data.subjects.length * 100;
  const percentage = (totalMarks / maxPossibleMarks) * 100;
  
  let performanceRating = 'Average';
  let performanceColor = 'text-yellow-400';
  if (percentage >= 80) { performanceRating = 'Excellent'; performanceColor = 'text-green-400'; }
  else if (percentage >= 65) { performanceRating = 'Good'; performanceColor = 'text-primary'; }

  const highestSub = data.subjects.reduce((prev, current) => (prev.marks > current.marks) ? prev : current);
  const lowestSub = data.subjects.reduce((prev, current) => (prev.marks < current.marks) ? prev : current);

  const chartData = data.subjects.map(sub => ({
    subject: sub.name.split(' ')[0], // abbreviate
    marks: sub.marks,
    full: sub.name
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">My Grades & Performance</h1>
        <p className="text-gray-400 mt-1">Viewing personalized results for <span className="text-primary font-medium">{user.name}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <GraduationCap size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Overall Percentage</p>
            <p className="text-2xl font-bold text-white">{percentage.toFixed(1)}%</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Performance Rating</p>
            <p className={`text-2xl font-bold ${performanceColor}`}>{performanceRating}</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Trophy size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Highest Subject</p>
            <p className="text-lg font-bold text-white leading-tight truncate">{highestSub.name}</p>
            <p className="text-xs text-amber-400">{highestSub.marks} Marks</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table View */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-6">Subject Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="pb-3 font-medium">Subject Name</th>
                  <th className="pb-3 font-medium">Marks</th>
                  <th className="pb-3 font-medium">Grade</th>
                  <th className="pb-3 font-medium hidden sm:table-cell">Progress</th>
                </tr>
              </thead>
              <tbody>
                {data.subjects.map((sub, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 text-sm font-medium text-gray-200">
                      {sub.name}
                      {sub.name === lowestSub.name && <span className="ml-2 inline-flex items-center text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full"><AlertTriangle size={10} className="mr-1"/> Lowest</span>}
                    </td>
                    <td className="py-4 text-sm font-bold text-white">{sub.marks}<span className="text-xs text-gray-500 font-normal">/100</span></td>
                    <td className="py-4 text-sm">
                      <span className={`px-2 py-1 rounded border text-xs font-bold ${
                        sub.grade === 'O' || sub.grade === 'A+' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 
                        sub.grade === 'U' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 
                        'border-primary/30 text-primary bg-primary/10'
                      }`}>
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-4 hidden sm:table-cell">
                      <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${sub.marks >= 75 ? 'bg-green-400' : sub.marks <= 60 ? 'bg-red-400' : 'bg-primary'}`} 
                          style={{ width: `${sub.marks}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visualizer */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Visual Metrics</h3>
          <div className="flex-1 min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                 <XAxis dataKey="subject" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} />
                 <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} domain={[0, 100]} />
                 <Tooltip 
                   cursor={{ fill: '#ffffff05' }}
                   contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                   formatter={(val: any) => [`${val} Marks`, 'Score']}
                   labelFormatter={(label: any, payload: any) => payload[0]?.payload.full || label}
                 />
                 <Bar dataKey="marks" fill="#22d3ee" radius={[4, 4, 0, 0]} barSize={30} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
