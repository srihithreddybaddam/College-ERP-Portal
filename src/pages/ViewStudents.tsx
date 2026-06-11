import { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getStudentData } from '../utils/studentMockData';
import { validatePassword } from '../auth/Signup';
import { Link } from 'react-router-dom';
import { getBranches } from '../utils/branchDB';

interface RegStudent {
  id: string;
  name: string;
  email: string;
  prn: string;
  course: string;
  role: string;
}

export function ViewStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<RegStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  const [sortOrder, setSortOrder] = useState('a-z');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const branchesList = user ? getBranches(user.collegeName) : [];

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<RegStudent | null>(null);
  const [editPass, setEditPass] = useState('');

  // 3-dots Action Menu State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user]);

  const fetchStudents = () => {
    const usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
    const filteredUsers = usersDB.filter((u: any) => u.role === 'Student' && u.collegeName === user?.collegeName);
    
    const hydratedStudents = filteredUsers.map((u: any) => {
      const pData = getStudentData(u.id);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        prn: pData.prn,
        course: pData.course,
        role: u.role
      };
    });
    setStudents(hydratedStudents);
  };

  const handleDelete = (id: string, name: string) => {
    setActiveDropdown(null);
    if (window.confirm(`Are you sure you want to completely remove ${name}?`)) {
      const usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
      const newDB = usersDB.filter((u: any) => u.id !== id);
      localStorage.setItem('usersDB', JSON.stringify(newDB));
      
      setStudents(students.filter(s => s.id !== id));
      
      const studentMetrics = JSON.parse(localStorage.getItem('studentDataStore') || '{}');
      if (studentMetrics[id]) {
        delete studentMetrics[id];
        localStorage.setItem('studentDataStore', JSON.stringify(studentMetrics));
      }
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;

    if (editPass && !Object.values(validatePassword(editPass)).every(Boolean)) {
      alert("New password does not meet requirements.");
      return;
    }

    // 1. Update usersDB (for Name and Password)
    const usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
    const uIndex = usersDB.findIndex((u: any) => u.id === editStudent.id);
    if (uIndex > -1) {
      usersDB[uIndex].name = editStudent.name;
      if (editPass) usersDB[uIndex].password = editPass;
      localStorage.setItem('usersDB', JSON.stringify(usersDB));
    }

    // 2. Update studentDataStore (for PRN, Course)
    const studentMetrics = JSON.parse(localStorage.getItem('studentDataStore') || '{}');
    if (studentMetrics[editStudent.id]) {
       studentMetrics[editStudent.id].prn = editStudent.prn;
       studentMetrics[editStudent.id].course = editStudent.course;
       localStorage.setItem('studentDataStore', JSON.stringify(studentMetrics));
    }

    setEditModalOpen(false);
    setEditPass('');
    fetchStudents();
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <span key={i} className="bg-primary/40 text-white px-0.5 rounded">{part}</span> 
            : part
        )}
      </span>
    );
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.prn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter === 'all' || student.course.includes(courseFilter);
    const matchesStatus = statusFilter === 'all' || 'Active' === statusFilter; 

    return matchesSearch && matchesCourse && matchesStatus;
  }).sort((a, b) => {
    if (sortOrder === 'a-z') return a.name.localeCompare(b.name);
    if (sortOrder === 'z-a') return b.name.localeCompare(a.name);
    return 0;
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage) || 1;

  const pwdValidations = validatePassword(editPass);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Student Directory</h1>
          <p className="text-gray-400 mt-1">Manage and view all registered students.</p>
        </div>
        
        {(user?.role === 'Admin' || user?.role === 'Teacher') && (
          <Link 
            to={user?.role === 'Admin' ? "/dashboard/admin/add-student" : "/dashboard/teacher/add-student"} 
            className="btn-primary py-2.5 px-5 flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:-translate-y-0.5 transition-all"
          >
            <Plus size={18} /> Add Student
          </Link>
        )}
      </div>

      <div className="glass-card p-4 md:p-6 flex flex-col xl:flex-row gap-4 justify-between w-full">
        <div className="relative w-full xl:w-96 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, PRN or email..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex flex-wrap gap-3 items-center w-full xl:justify-end">
          <div className="flex items-center gap-2 text-sm">
             <Filter size={14} className="text-gray-400"/>
             <select 
               className="bg-white/5 border border-white/10 rounded text-white text-xs p-2 focus:outline-none focus:border-primary"
               value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
             >
               <option value="a-z" className="bg-[#111] text-white">Alphabetical (A-Z)</option>
               <option value="z-a" className="bg-[#111] text-white">Alphabetical (Z-A)</option>
             </select>
          </div>
          <div className="flex items-center text-sm">
             <select 
               className="bg-white/5 border border-white/10 rounded text-white text-xs p-2 focus:outline-none focus:border-primary"
               value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}
             >
               <option value="all" className="bg-[#111] text-white">All Branches</option>
               {branchesList.map((branch) => (
                 <option key={branch} value={branch} className="bg-[#111] text-white">{branch}</option>
               ))}
             </select>
          </div>
          <div className="flex items-center text-sm">
             <select 
               className="bg-white/5 border border-white/10 rounded text-white text-xs p-2 focus:outline-none focus:border-primary"
               value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
             >
               <option value="all" className="bg-[#111] text-white">All Status</option>
               <option value="Active" className="bg-[#111] text-white">Active</option>
               <option value="Inactive" className="bg-[#111] text-white">Inactive</option>
             </select>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Student Name</th>
                <th className="p-4 font-semibold">PRN Number</th>
                <th className="p-4 font-semibold">Branch / Year</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    No students discovered.
                  </td>
                </tr>
              ) : currentStudents.map((student) => (
                <tr key={student.id} className="hover:bg-white-[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-200 group-hover:text-white transition-colors">{highlightMatch(student.name, searchTerm)}</p>
                        <p className="text-xs text-gray-500">{highlightMatch(student.email, searchTerm)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-mono text-cyan-300">
                    {highlightMatch(student.prn, searchTerm)}
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-300">{student.course}</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user?.role === 'Admin' && (
                        <button 
                          onClick={() => { setEditStudent({...student}); setEditPass(''); setEditModalOpen(true); }}
                          className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Edit Student">
                          <Edit2 size={16} />
                        </button>
                      )}
                      {(user?.role === 'Admin' || user?.role === 'Teacher') && (
                        <button 
                          onClick={() => handleDelete(student.id, student.name)}
                          className="p-2 text-red-500/70 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors" title="Remove Student">
                          <Trash2 size={16} />
                        </button>
                      )}
                      
                      <div className="relative">
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === student.id ? null : student.id)}
                          className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {activeDropdown === student.id && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-[#111] border border-white/10 rounded-lg shadow-xl z-10 overflow-hidden text-left animate-in slide-in-from-top-2">
                             <div className="p-3 border-b border-white/5 text-xs text-gray-400 uppercase font-semibold">Options</div>
                             {user?.role === 'Admin' && <button onClick={() => { setEditStudent({...student}); setEditPass(''); setEditModalOpen(true); setActiveDropdown(null); }} className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 basis-full"><Edit2 size={14}/> Edit Profile</button>}
                             <Link to={user?.role === 'Admin' ? "/dashboard/admin/marks" : "/dashboard/teacher/marks"} className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 basis-full">Update Marks</Link>
                             {(user?.role === 'Admin' || user?.role === 'Teacher') && <button className="w-full px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2 basis-full text-left" onClick={() => { handleDelete(student.id, student.name); setActiveDropdown(null); }}><Trash2 size={14}/> Delete Student</button>}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length > 0 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/5">
            <p className="text-xs text-gray-400">
              Showing <span className="font-bold text-white">{indexOfFirstStudent + 1}</span> to <span className="font-bold text-white">{Math.min(indexOfLastStudent, filteredStudents.length)}</span> of <span className="font-bold text-white">{filteredStudents.length}</span> students
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {editModalOpen && editStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
           <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                 <h2 className="text-xl font-bold text-white">Edit Student Details</h2>
                 <button onClick={() => setEditModalOpen(false)} className="text-gray-400 hover:text-white bg-white/5 p-1 rounded-md"><X size={20}/></button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                 <form id="edit-form" onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={editStudent.name}
                        onChange={(e) => setEditStudent({...editStudent, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">PRN Number</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={editStudent.prn}
                          onChange={(e) => setEditStudent({...editStudent, prn: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Branch</label>
                        <select 
                          className="input-field appearance-none bg-[#0a0a0a]"
                          value={editStudent.course.split(' (')[0]}
                          onChange={(e) => {
                            const newBranch = e.target.value;
                            const sectionMatch = editStudent.course.match(/\(([^)]+)\)/);
                            const sectionStr = sectionMatch ? ` (${sectionMatch[1]})` : '';
                            setEditStudent({...editStudent, course: `${newBranch}${sectionStr}`});
                          }}
                          required
                        >
                          {branchesList.map(branch => (
                            <option key={branch} value={branch} className="bg-[#111] text-white">{branch}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 mt-2 border-t border-white/10">
                      <label className="block text-sm font-medium text-amber-400 mb-1">Password Reset Override (Optional)</label>
                      <p className="text-xs text-gray-500 mb-3">Leave blank to keep existing password. Admin cannot view previous credentials.</p>
                      <input 
                        type="password" 
                        className={`input-field ${editPass && !Object.values(pwdValidations).every(Boolean) ? 'border-amber-500/50 focus:border-amber-500/50 focus:ring-amber-500/50' : ''}`} 
                        placeholder="Assign new password here"
                        value={editPass}
                        onChange={(e) => setEditPass(e.target.value)}
                      />
                      
                      {editPass && (
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className={`flex items-center gap-1.5 ${pwdValidations.length ? 'text-green-400' : 'text-gray-500'}`}>
                            {pwdValidations.length ? <Check size={14} /> : <X size={14} />} Min 8 characters
                          </div>
                          <div className={`flex items-center gap-1.5 ${pwdValidations.uppercase ? 'text-green-400' : 'text-gray-500'}`}>
                            {pwdValidations.uppercase ? <Check size={14} /> : <X size={14} />} 1 Uppercase letter
                          </div>
                          <div className={`flex items-center gap-1.5 ${pwdValidations.number ? 'text-green-400' : 'text-gray-500'}`}>
                            {pwdValidations.number ? <Check size={14} /> : <X size={14} />} 1 Number
                          </div>
                          <div className={`flex items-center gap-1.5 ${pwdValidations.special ? 'text-green-400' : 'text-gray-500'}`}>
                            {pwdValidations.special ? <Check size={14} /> : <X size={14} />} 1 Special char
                          </div>
                        </div>
                      )}
                    </div>
                 </form>
              </div>
              <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3 rounded-b-2xl">
                 <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                 <button type="submit" form="edit-form" className="btn-primary py-2 px-6 shadow-[0_0_15px_rgba(34,211,238,0.2)]">Save Changes</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
