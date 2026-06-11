import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Trash2, Eye, X, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { getBranches } from '../utils/branchDB';
import { validatePassword } from '../auth/Signup';

interface TeacherUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'Teacher';
  collegeName: string;
  branch?: string;
}

export function ViewTeachers() {
  const { user } = useAuth();
  
  const [teachers, setTeachers] = useState<TeacherUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('a-z');
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 5;

  // Add Teacher Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    branch: ''
  });
  const [pwdValidations, setPwdValidations] = useState({ length: false, uppercase: false, number: false, special: false });
  const [addError, setAddError] = useState('');

  // View Details Modal State
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherUser | null>(null);

  const branchesList = user ? getBranches(user.collegeName) : [];

  useEffect(() => {
    fetchTeachers();
  }, [user]);

  useEffect(() => {
    setPwdValidations(validatePassword(newTeacher.password));
  }, [newTeacher.password]);

  const fetchTeachers = () => {
    const allUsers = JSON.parse(localStorage.getItem('usersDB') || '[]');
    const collegeTeachers = allUsers.filter((u: any) => 
      u.role === 'Teacher' && u.collegeName === user?.collegeName
    );
    setTeachers(collegeTeachers);
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    const isValidPassword = Object.values(pwdValidations).every(Boolean);
    if (!newTeacher.name || !newTeacher.username || !newTeacher.email || !isValidPassword || !newTeacher.branch) {
      setAddError('Please fill out all fields properly. Password must meet requirements.');
      return;
    }

    const allUsers = JSON.parse(localStorage.getItem('usersDB') || '[]');
    
    // Check duplication
    const duplicate = allUsers.find((u: any) => 
      u.email === newTeacher.email || u.username === newTeacher.username
    );

    if (duplicate) {
      setAddError('Username or Email already exists.');
      return;
    }

    const teacherToAdd = {
      id: Math.random().toString(36).substr(2, 9),
      name: newTeacher.name,
      username: newTeacher.username,
      email: newTeacher.email,
      password: newTeacher.password,
      securityAnswer: 'mathematics', // default
      role: 'Teacher',
      collegeName: user?.collegeName || '',
      branch: newTeacher.branch
    };

    allUsers.push(teacherToAdd);
    localStorage.setItem('usersDB', JSON.stringify(allUsers));
    
    // Reset form
    setNewTeacher({ name: '', username: '', email: '', password: '', branch: '' });
    setAddModalOpen(false);
    fetchTeachers();
  };

  const handleDeleteTeacher = (teacherId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove teacher ${name}?`)) return;

    const allUsers = JSON.parse(localStorage.getItem('usersDB') || '[]');
    const updatedUsers = allUsers.filter((u: any) => u.id !== teacherId);
    localStorage.setItem('usersDB', JSON.stringify(updatedUsers));
    
    fetchTeachers();
  };

  // Filters & Sorting
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'all' || t.branch === branchFilter;
    return matchesSearch && matchesBranch;
  }).sort((a, b) => {
    if (sortOrder === 'a-z') return a.name.localeCompare(b.name);
    if (sortOrder === 'z-a') return b.name.localeCompare(a.name);
    return 0;
  });

  // Pagination
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage) || 1;

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

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Faculty Directory</h1>
          <p className="text-gray-400 mt-1">Manage and view all registered faculty members.</p>
        </div>
        
        <button 
          onClick={() => setAddModalOpen(true)}
          className="btn-primary py-2.5 px-5 flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:-translate-y-0.5 transition-all"
        >
          <Plus size={18} /> Add Teacher
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 md:p-6 flex flex-col xl:flex-row gap-4 justify-between w-full">
        <div className="relative w-full xl:w-96 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or username..." 
            className="input-field pl-10 pr-4"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full justify-start xl:justify-end">
          <div className="flex items-center gap-2 min-w-[160px]">
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Branch:</span>
            <select 
              value={branchFilter}
              onChange={(e) => { setBranchFilter(e.target.value); setCurrentPage(1); }}
              className="input-field appearance-none bg-[#0a0a0a]"
            >
              <option value="all" className="bg-[#111] text-gray-400">All Branches</option>
              {branchesList.map(branch => (
                <option key={branch} value={branch} className="bg-[#111] text-white">{branch}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 min-w-[140px]">
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Sort:</span>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="input-field appearance-none bg-[#0a0a0a]"
            >
              <option value="a-z" className="bg-[#111] text-white">Name (A-Z)</option>
              <option value="z-a" className="bg-[#111] text-white">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Faculty Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white-[0.02] text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4">Faculty Name</th>
                <th className="p-4">Username</th>
                <th className="p-4">Assigned Branch</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentTeachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    No faculty found.
                  </td>
                </tr>
              ) : currentTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-white-[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-200 group-hover:text-white transition-colors">{highlightMatch(teacher.name, searchTerm)}</p>
                        <p className="text-xs text-gray-500">{highlightMatch(teacher.email, searchTerm)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-mono text-cyan-300">
                    {highlightMatch(teacher.username, searchTerm)}
                  </td>
                  <td className="p-4 text-sm text-gray-300">
                    {teacher.branch || 'General'}
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedTeacher(teacher)}
                        className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="View Teacher">
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                        className="p-2 text-red-500/70 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors" title="Remove Teacher">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTeachers.length > 0 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/5">
            <p className="text-xs text-gray-400">
              Showing <span className="font-bold text-white">{indexOfFirstTeacher + 1}</span> to <span className="font-bold text-white">{Math.min(indexOfLastTeacher, filteredTeachers.length)}</span> of <span className="font-bold text-white">{filteredTeachers.length}</span> faculty members
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Teacher Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg p-6 md:p-8 animate-in zoom-in duration-300 relative border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <button 
              onClick={() => setAddModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <GraduationCap className="text-primary" /> Add New Faculty Member
            </h3>
            <p className="text-sm text-gray-400 mb-6">Create a teacher user profile under {user?.collegeName}.</p>

            {addError && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">{addError}</div>}

            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Prof. John Doe"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Username</label>
                  <input 
                    type="text" 
                    className="input-field font-mono" 
                    placeholder="johndoe"
                    value={newTeacher.username}
                    onChange={(e) => setNewTeacher({...newTeacher, username: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Assigned Branch</label>
                  <select 
                    className="input-field appearance-none bg-[#0a0a0a]"
                    value={newTeacher.branch}
                    onChange={(e) => setNewTeacher({...newTeacher, branch: e.target.value})}
                    required
                  >
                    <option value="" className="bg-[#111] text-gray-400">Select branch...</option>
                    {branchesList.map(branch => (
                      <option key={branch} value={branch} className="bg-[#111] text-white">{branch}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="johndoe@university.edu"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Enter login password"
                  value={newTeacher.password}
                  onChange={(e) => setNewTeacher({...newTeacher, password: e.target.value})}
                  required
                />
                
                {/* Password requirement checks */}
                <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-white-[0.02] border border-white/5 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${pwdValidations.length ? 'bg-green-400' : 'bg-red-500'}`}></span>
                    Min 8 characters
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${pwdValidations.uppercase ? 'bg-green-400' : 'bg-red-500'}`}></span>
                    1 uppercase letter
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${pwdValidations.number ? 'bg-green-400' : 'bg-red-500'}`}></span>
                    1 number
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${pwdValidations.special ? 'bg-green-400' : 'bg-red-500'}`}></span>
                    1 special symbol
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 py-3 border border-white/10 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 btn-primary shadow-[0_0_20px_rgba(34,211,238,0.2)] font-semibold"
                >
                  Add Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-md p-6 relative border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center">
            <button 
              onClick={() => setSelectedTeacher(null)}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center text-3xl font-extrabold mx-auto mb-4 border border-primary/20">
              {selectedTeacher.name.charAt(0)}
            </div>

            <h3 className="text-xl font-bold text-white leading-tight">{selectedTeacher.name}</h3>
            <p className="text-xs text-primary font-mono mt-1">ID: {selectedTeacher.id}</p>

            <div className="mt-6 space-y-3 text-left">
              <div className="p-3 bg-white-[0.02] border border-white/5 rounded-lg">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Email Address</p>
                <p className="text-sm text-gray-200 font-medium mt-0.5">{selectedTeacher.email}</p>
              </div>

              <div className="p-3 bg-white-[0.02] border border-white/5 rounded-lg">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Username</p>
                <p className="text-sm text-gray-200 font-mono mt-0.5">{selectedTeacher.username}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white-[0.02] border border-white/5 rounded-lg">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Role</p>
                  <p className="text-sm text-gray-200 font-medium mt-0.5">{selectedTeacher.role}</p>
                </div>
                <div className="p-3 bg-white-[0.02] border border-white/5 rounded-lg">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Assigned Branch</p>
                  <p className="text-sm text-gray-200 font-medium mt-0.5">{selectedTeacher.branch || 'General'}</p>
                </div>
              </div>

              <div className="p-3 bg-white-[0.02] border border-white/5 rounded-lg">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Tenant Institution</p>
                <p className="text-xs text-gray-300 font-medium mt-0.5">{selectedTeacher.collegeName}</p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedTeacher(null)}
              className="mt-6 w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg transition-colors font-medium"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
