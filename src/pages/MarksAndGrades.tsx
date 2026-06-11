import { useState, useEffect } from 'react';

import { getStudentData, saveStudentData, type StudentData } from '../utils/studentMockData';
import { Search, Save, X, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface CombinedStudent {
  user: any;
  data: StudentData;
}

export function MarksAndGrades() {
  const { user } = useAuth();
  const [students, setStudents] = useState<CombinedStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<StudentData | null>(null);

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

  const handleEditClick = (student: CombinedStudent) => {
    setEditingId(student.user.id);
    setEditFormData(JSON.parse(JSON.stringify(student.data))); // Deep copy
  };

  const calculateGrade = (marks: number) => {
    if (marks >= 90) return 'O';
    if (marks >= 80) return 'A+';
    if (marks >= 70) return 'A';
    if (marks >= 60) return 'B+';
    if (marks >= 50) return 'B';
    return 'U';
  };

  const handleMarkChange = (subjectIndex: number, newMarksStr: string) => {
    if (!editFormData) return;
    const newMarks = parseInt(newMarksStr) || 0;
    
    const updated = { ...editFormData };
    updated.subjects[subjectIndex].marks = Math.min(100, Math.max(0, newMarks));
    updated.subjects[subjectIndex].grade = calculateGrade(updated.subjects[subjectIndex].marks);
    
    setEditFormData(updated);
  };

  const handleSave = () => {
    if (editFormData) {
      saveStudentData(editFormData);
      setEditingId(null);
      fetchData(); // Refresh table
    }
  };

  const filteredStudents = students.filter(s =>
    s.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.data.prn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Manage Academic Marks</h1>
          <p className="text-gray-400 mt-1">Configure and assign grades centrally for all registered students.</p>
        </div>
      </div>

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

      <div className="grid grid-cols-1 gap-6">
        {filteredStudents.length === 0 ? (
           <div className="glass-card p-12 text-center text-gray-400">No student records found matching your search.</div>
        ) : filteredStudents.map((s) => {
          const isEditing = editingId === s.user.id;
          const displayData = isEditing && editFormData ? editFormData : s.data;
          
          const totalMarks = displayData.subjects.reduce((sum, sub) => sum + sub.marks, 0);
          const maxMarks = displayData.subjects.length * 100;
          const percentage = (totalMarks / maxMarks) * 100;
          const performance = percentage >= 80 ? 'Excellent' : percentage >= 65 ? 'Good' : 'Average';

          return (
            <div key={s.user.id} className={`glass-card overflow-hidden transition-all duration-300 ${isEditing ? 'border-primary/50 shadow-[0_0_30px_rgba(34,211,238,0.1)]' : ''}`}>
              {/* Header */}
              <div className="p-4 border-b border-white/10 bg-white/5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                    {s.user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{s.user.name}</h3>
                    <p className="text-xs font-mono text-cyan-300">{displayData.prn} &bull; <span className="text-gray-400">{s.user.email}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400">Overall Performance</p>
                    <p className={`font-bold ${percentage >= 80 ? 'text-green-400' : percentage >= 65 ? 'text-primary' : 'text-yellow-400'}`}>
                      {percentage.toFixed(1)}% &mdash; {performance}
                    </p>
                  </div>
                  {isEditing ? (
                    <div className="flex gap-2">
                       <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors"><X size={18} /></button>
                       <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg font-medium transition-colors"><Save size={18} /> Save</button>
                    </div>
                  ) : (
                    <button onClick={() => handleEditClick(s)} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors">
                      <Edit2 size={16} /> Edit Marks
                    </button>
                  )}
                </div>
              </div>

              {/* Data Grid */}
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Subject</th>
                      <th className="pb-3 font-semibold w-32">Marks / 100</th>
                      <th className="pb-3 font-semibold w-24">Grade</th>
                      <th className="pb-3 font-semibold hidden md:table-cell">Status Indicator</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.subjects.map((sub, idx) => (
                      <tr key={idx} className="border-t border-white/5">
                        <td className="py-3 text-sm text-gray-200">{sub.name}</td>
                        <td className="py-3">
                          {isEditing ? (
                            <input 
                              type="number" 
                              min="0" max="100"
                              className="w-20 bg-black/50 border border-primary/50 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                              value={sub.marks}
                              onChange={(e) => handleMarkChange(idx, e.target.value)}
                            />
                          ) : (
                            <span className="font-bold text-white">{sub.marks}</span>
                          )}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            sub.grade === 'O' || sub.grade === 'A+' ? 'text-green-400 bg-green-500/10' : 
                            sub.grade === 'U' ? 'text-red-400 bg-red-500/10' : 
                            'text-primary bg-primary/10'
                          }`}>
                            {sub.grade}
                          </span>
                        </td>
                        <td className="py-3 hidden md:table-cell">
                           <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                             <div className={`h-full rounded-full ${sub.marks >= 75 ? 'bg-green-400' : sub.marks <= 50 ? 'bg-red-400' : 'bg-primary'}`} style={{ width: `${sub.marks}%` }}></div>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
