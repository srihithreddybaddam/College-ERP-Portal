import { useState, useEffect } from 'react';
import { Users, GraduationCap, PlusCircle, CheckCircle, ChevronDown, ChevronUp, UserCheck, Activity, BookOpen, Clock, Calendar, CheckSquare, BookText, History, ListTodo, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getStudentData } from '../utils/studentMockData';
import { getBranches, saveBranches } from '../utils/branchDB';

interface RegUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState<RegUser[]>([]);
  const [teachers, setTeachers] = useState<RegUser[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [branchesList, setBranchesList] = useState<string[]>([]);
  const [newBranchName, setNewBranchName] = useState('');

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('usersDB') || '[]');
    const myCollegeUsers = users.filter((u: any) => u.collegeName === user?.collegeName);
    setStudents(myCollegeUsers.filter((u: any) => u.role === 'Student').reverse());
    setTeachers(myCollegeUsers.filter((u: any) => u.role === 'Teacher').reverse());
    if (user) {
      setBranchesList(getBranches(user.collegeName));
    }
  }, [user]);

  const isAdmin = user?.role === 'Admin';
  const isTeacher = user?.role === 'Teacher';
  const isStudent = user?.role === 'Student';

  const toggleSection = (section: string) => {
    if (expandedSection === section) setExpandedSection(null);
    else setExpandedSection(section);
  };

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim() || !user) return;
    const trimmed = newBranchName.trim();
    if (branchesList.includes(trimmed)) {
      alert('Branch already exists.');
      return;
    }
    const updated = [...branchesList, trimmed];
    saveBranches(updated, user.collegeName);
    setBranchesList(updated);
    setNewBranchName('');
  };

  const handleDeleteBranch = (branchToDelete: string) => {
    if (!user) return;
    if (!confirm(`Are you sure you want to delete the branch "${branchToDelete}"? This will affect selection fields elsewhere.`)) return;
    const updated = branchesList.filter(b => b !== branchToDelete);
    saveBranches(updated, user.collegeName);
    setBranchesList(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Overview Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome securely to the {user?.role} administration panel.</p>
      </div>

      {isAdmin && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Total Students Card */}
            <div 
              onClick={() => toggleSection('students')}
              className={`glass-card p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:bg-white/5 border ${expandedSection === 'students' ? 'border-primary shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border-white/5'}`}
            >
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                <Users size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white">{students.length}</h3>
              <p className="text-sm text-gray-400 font-medium flex items-center gap-1 mt-1">
                Active Students {expandedSection === 'students' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </p>
            </div>

            {/* Branches Card */}
            <div 
              onClick={() => toggleSection('branches')}
              className={`glass-card p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:bg-white/5 border ${expandedSection === 'branches' ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border-white/5'}`}
            >
              <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <GraduationCap size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white">{branchesList.length}</h3>
              <p className="text-sm text-gray-400 font-medium flex items-center gap-1 mt-1">
                Branches {expandedSection === 'branches' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </p>
            </div>

            {/* Total Teachers Card */}
            <div 
              onClick={() => toggleSection('teachers')}
              className={`glass-card p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:bg-white/5 border ${expandedSection === 'teachers' ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-white/5'}`}
            >
              <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <UserCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white">{teachers.length}</h3>
              <p className="text-sm text-gray-400 font-medium flex items-center gap-1 mt-1">
                All Teachers {expandedSection === 'teachers' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </p>
            </div>

            {/* System Health Card */}
            <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mb-4">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white">Active</h3>
              <p className="text-sm text-gray-400 font-medium">System Health</p>
            </div>
          </div>

          {/* Expanded Sections */}
          {expandedSection === 'students' && (
             <div className="glass-card p-6 animate-in slide-in-from-top-4 fade-in duration-300 border-l-4 border-l-primary">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Users size={18} className="text-primary"/> All Active Students</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((s, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded border border-white/5 flex justify-between items-center">
                       <span className="font-medium text-gray-200">{s.name}</span>
                       <span className="text-xs text-primary font-mono">{getStudentData(s.id).prn}</span>
                    </div>
                  ))}
                  {students.length === 0 && <p className="text-sm text-gray-500">No students found.</p>}
               </div>
               <div className="mt-4 text-right">
                  <Link to="/dashboard/admin/students" className="text-sm text-primary hover:underline">Manage All Students &rarr;</Link>
               </div>
             </div>
          )}

          {expandedSection === 'branches' && (
             <div className="glass-card p-6 animate-in slide-in-from-top-4 fade-in duration-300 border-l-4 border-l-purple-500">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><GraduationCap size={18} className="text-purple-400"/> Branches</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {branchesList.map((b, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded border border-white/5 flex justify-between items-center font-medium text-gray-200">
                       <span>{b}</span>
                       {user?.role === 'Admin' && (
                         <button 
                           onClick={() => handleDeleteBranch(b)}
                           className="text-red-400 hover:text-red-300 hover:bg-white/10 p-1 rounded transition-all"
                           title="Delete Branch"
                         >
                           <Trash2 size={14} />
                         </button>
                       )}
                    </div>
                  ))}
                  {branchesList.length === 0 && <p className="text-sm text-gray-500 col-span-full">No branches created.</p>}
               </div>
               {user?.role === 'Admin' && (
                 <form onSubmit={handleAddBranch} className="mt-6 flex gap-3 max-w-sm">
                   <input 
                     type="text" 
                     className="input-field" 
                     placeholder="Add new branch (e.g., B.Tech ECE)" 
                     value={newBranchName}
                     onChange={(e) => setNewBranchName(e.target.value)}
                     required
                   />
                   <button type="submit" className="btn-primary py-2 px-4 shadow-[0_0_15px_rgba(34,211,238,0.2)]">Add Branch</button>
                 </form>
               )}
             </div>
          )}

          {expandedSection === 'teachers' && (
             <div className="glass-card p-6 animate-in slide-in-from-top-4 fade-in duration-300 border-l-4 border-l-amber-500">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><UserCheck size={18} className="text-amber-400"/> All Teachers</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teachers.map((t, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded border border-white/5 flex flex-col">
                       <span className="font-medium text-gray-200">{t.name}</span>
                       <span className="text-xs text-gray-500">{t.email}</span>
                    </div>
                  ))}
                  {teachers.length === 0 && <p className="text-sm text-gray-500">No teachers found.</p>}
               </div>
             </div>
          )}
        </div>
      )}

      {/* Teacher Dashboard Specifics */}
      {isTeacher && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          
          {/* Today's Classes */}
          <div className="glass-card p-6 lg:col-span-2 relative overflow-hidden flex flex-col hover:border-white/10 transition-colors">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Clock size={18} className="text-primary"/> Today's Classes</h3>
            <div className="space-y-3 relative z-10 flex-1">
               <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                 <div>
                   <p className="text-sm font-bold text-white">Database Management Sys.</p>
                   <p className="text-xs text-gray-400 mt-1 flex items-center gap-2"><BookOpen size={12}/> Lecture &bull; CSE Year 3</p>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-mono text-primary font-bold">10:00 AM</p>
                   <p className="text-xs text-gray-400">Room 304</p>
                 </div>
               </div>
               <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                 <div>
                   <p className="text-sm font-bold text-white">Operating Systems</p>
                   <p className="text-xs text-gray-400 mt-1 flex items-center gap-2"><BookOpen size={12}/> Lab &bull; CSE Year 3</p>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-mono text-primary font-bold">01:30 PM</p>
                   <p className="text-xs text-gray-400">Lab 2A</p>
                 </div>
               </div>
               <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                 <div>
                   <p className="text-sm font-bold text-white">Computer Networks</p>
                   <p className="text-xs text-gray-400 mt-1 flex items-center gap-2"><BookOpen size={12}/> Lecture &bull; ECE Year 3</p>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-mono text-primary font-bold">03:00 PM</p>
                   <p className="text-xs text-gray-400">Room 102</p>
                 </div>
               </div>
            </div>
            <Link to="/dashboard/teacher/timetable" className="text-xs text-primary mt-4 hover:underline self-start">View full timetable &rarr;</Link>
          </div>

          <div className="flex flex-col gap-6">
            {/* Class Summary */}
            <div className="glass-card p-6 border-l-4 border-l-green-500">
               <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Class Summary</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-xs text-gray-400">Total Students</p>
                    <p className="text-lg font-bold text-white">{students.length}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-xs text-gray-400">Present Today</p>
                    <p className="text-lg font-bold text-green-400">84</p>
                  </div>
                  <div className="flex justify-between items-end border-t border-white/10 pt-2">
                    <p className="text-xs text-gray-400">Absent Today</p>
                    <p className="text-lg font-bold text-red-400">36</p>
                  </div>
               </div>
            </div>

            {/* Pending Tasks */}
            <div className="glass-card p-6 border-l-4 border-l-amber-500 flex-1">
               <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2"><ListTodo size={14}/> Pending Tasks</h3>
               <div className="space-y-3">
                 <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                    <p className="text-sm text-gray-300 leading-tight">Complete attendance for CSE Year 3 Lab.</p>
                 </div>
                 <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                    <p className="text-sm text-gray-300 leading-tight">Update mid-term marks for Operating Systems.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Recent Activity */}
      {isTeacher && (
        <div className="glass-card p-6 mt-6">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><History size={18} className="text-primary"/> Recent Activity</h3>
           <div className="space-y-3">
             <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex gap-4 items-center line-clamp-1 truncate">
                <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded shrink-0">Attendance</span>
                <span className="text-sm text-gray-300">Marked attendance for Database Management Sys.</span>
                <span className="text-xs text-gray-500 ml-auto shrink-0">2 hours ago</span>
             </div>
             <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex gap-4 items-center line-clamp-1 truncate">
                <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded shrink-0">Grades</span>
                <span className="text-sm text-gray-300">Updated internal marks for John Doe.</span>
                <span className="text-xs text-gray-500 ml-auto shrink-0">5 hours ago</span>
             </div>
           </div>
        </div>
      )}

      {/* Student Specific Modules */}
      {isStudent && (
        <div className="glass-card p-6 mt-6 animate-in slide-in-from-bottom-4 duration-500">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BookText size={18} className="text-primary"/> Upcoming Assignments</h3>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold bg-amber-500/20 text-amber-500 px-2 py-1 rounded">Pending</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12}/> Due in 2 days</span>
                 </div>
                 <h4 className="font-semibold text-white">React Native Final Project Submission</h4>
                 <p className="text-xs text-gray-400 mt-1">Submit the GitHub repository link along with the APK.</p>
              </div>
              
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold bg-red-500/20 text-red-500 px-2 py-1 rounded">Overdue</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12}/> Due 1 day ago</span>
                 </div>
                 <h4 className="font-semibold text-white">Database Design Document</h4>
                 <p className="text-xs text-gray-400 mt-1">Upload the finalized ER Diagram.</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold bg-green-500/20 text-green-500 px-2 py-1 rounded">Submitted</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><CheckSquare size={12}/> Graded</span>
                 </div>
                 <h4 className="font-semibold text-white">OS Process Scheduling Algo</h4>
                 <p className="text-xs text-gray-400 mt-1">Implement SJF and FCFS in C.</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold bg-amber-500/20 text-amber-500 px-2 py-1 rounded">Pending</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12}/> Due in 1 week</span>
                 </div>
                 <h4 className="font-semibold text-white">AI Neural Network Report</h4>
                 <p className="text-xs text-gray-400 mt-1">Include epoch graphs and loss analysis.</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold bg-blue-500/20 text-blue-500 px-2 py-1 rounded">Not Started</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12}/> Due in 2 weeks</span>
                 </div>
                 <h4 className="font-semibold text-white">Cybersecurity Case Study</h4>
                 <p className="text-xs text-gray-400 mt-1">Analyze the recent enterprise breach scenarios.</p>
              </div>
           </div>
        </div>
      )}

      {(isAdmin || isTeacher) && (
        <div className="glass-card p-6 mt-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
             {isAdmin && (
               <Link to="/dashboard/admin/add-student" className="btn-primary py-2 px-4 flex items-center gap-2">
                 <PlusCircle size={18} /> Add New Student
               </Link>
             )}
             <Link to={`/dashboard/${user?.role.toLowerCase()}/marks`} className="btn-primary py-2 px-4 flex items-center gap-2 bg-purple-500 hover:bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
               <GraduationCap size={18} /> Manage Student Marks
             </Link>
             <Link to={`/dashboard/${user?.role.toLowerCase()}/attendance`} className="btn-primary py-2 px-4 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-black">
               <Activity size={18} /> Record Attendance
             </Link>
             {isAdmin && (
               <Link to="/dashboard/admin/reports" className="btn-primary py-2 px-4 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white">
                 <Activity size={18} /> View Reports
               </Link>
             )}
             {isTeacher && (
               <Link to="/dashboard/teacher/students" className="btn-primary py-2 px-4 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white">
                 <Users size={18} /> View Students
               </Link>
             )}
          </div>
        </div>
      )}

      {/* Admin Recent Registrations Module */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="glass-card p-6 outline outline-1 outline-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <Users size={120} />
             </div>
             <h3 className="text-lg font-bold text-white mb-6 relative z-10">Recent Student Signups</h3>
             <div className="space-y-3 relative z-10">
                {students.slice(0, 5).map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                           {s.name.charAt(0)}
                        </div>
                        <div>
                           <p className="text-sm font-semibold text-white">{s.name}</p>
                           <p className="text-xs text-gray-500">{s.email}</p>
                        </div>
                     </div>
                     <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">New</span>
                  </div>
                ))}
                {students.length === 0 && <p className="text-sm text-gray-500">No recent students.</p>}
             </div>
          </div>

          <div className="glass-card p-6 outline outline-1 outline-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <UserCheck size={120} />
             </div>
             <h3 className="text-lg font-bold text-white mb-6 relative z-10">Recent Teacher Signups</h3>
             <div className="space-y-3 relative z-10">
                {teachers.slice(0, 5).map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-sm">
                           {t.name.charAt(0)}
                        </div>
                        <div>
                           <p className="text-sm font-semibold text-white">{t.name}</p>
                           <p className="text-xs text-gray-500">{t.email}</p>
                        </div>
                     </div>
                     <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded">Joined</span>
                  </div>
                ))}
                {teachers.length === 0 && <p className="text-sm text-gray-500">No recent teachers.</p>}
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
