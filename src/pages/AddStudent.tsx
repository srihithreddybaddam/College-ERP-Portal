import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveStudentData } from '../utils/studentMockData';
import { useNavigate } from 'react-router-dom';
import { getBranches } from '../utils/branchDB';

export function AddStudent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [prn, setPrn] = useState('');
  const [course, setCourse] = useState('');
  const [section, setSection] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');

  const branchesList = user ? getBranches(user.collegeName) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) return;

    const usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
    
    // Generate username and email
    const username = name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 100);
    const email = `${username}@student.edu`;
    
    // Check if PRN or username already exists
    const studentStore = JSON.parse(localStorage.getItem('studentDataStore') || '{}');
    const prnExists = Object.values(studentStore).some((s: any) => s.prn === prn);
    if (prnExists) {
      setError('PRN number already exists.');
      return;
    }

    const newStudentUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      username,
      email,
      password: 'Student@123', // default password
      securityAnswer: 'mathematics', // default security answer
      role: 'Student',
      collegeName: user.collegeName
    };

    const newStudentData = {
      userId: newStudentUser.id,
      prn,
      course: `${course} (${section})`,
      year: '3rd Year (Semester 6)',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active' as const,
      collegeName: user.collegeName,
      subjects: [
        { name: 'Database Mgmt', marks: 80, grade: 'A+', attendance: 85 },
        { name: 'Operating Sys', marks: 80, grade: 'A+', attendance: 85 },
        { name: 'Computer Networks', marks: 80, grade: 'A+', attendance: 85 },
        { name: 'Software Eng', marks: 80, grade: 'A+', attendance: 85 },
        { name: 'Data Structures', marks: 80, grade: 'A+', attendance: 85 }
      ]
    };

    usersDB.push(newStudentUser);
    localStorage.setItem('usersDB', JSON.stringify(usersDB));
    saveStudentData(newStudentData);

    // Add a notification for signup
    const adminNotifs = JSON.parse(localStorage.getItem('notificationQueue') || '[]');
    adminNotifs.push({ 
      id: Math.random().toString(36).substr(2, 9), 
      user: newStudentUser.name, 
      action: 'Signed Up (Enrolled)', 
      timestamp: Date.now(),
      collegeName: user.collegeName 
    });
    localStorage.setItem('notificationQueue', JSON.stringify(adminNotifs));

    alert(`Student ${name} enrolled successfully!\nEmail: ${email}\nPassword: Student@123`);
    navigate(user.role === 'Admin' ? '/dashboard/admin/students' : '/dashboard/teacher/students');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Add New Student</h1>
        <p className="text-gray-400">Enter details to enroll a new student into {user?.collegeName}.</p>
      </div>

      <div className="glass-card p-8">
        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Student Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">PRN Number</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. 10203040" 
                value={prn} 
                onChange={(e) => setPrn(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Branch</label>
              <select 
                className="input-field" 
                value={course} 
                onChange={(e) => setCourse(e.target.value)} 
                required
              >
                <option value="" className="bg-[#111111] text-gray-400">Select branch</option>
                {branchesList.map((branch) => (
                  <option key={branch} value={branch} className="bg-[#111111] text-white">{branch}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Section</label>
              <select 
                className="input-field" 
                value={section} 
                onChange={(e) => setSection(e.target.value)} 
                required
              >
                <option value="" className="bg-[#111111] text-gray-400">Select section</option>
                <option value="A" className="bg-[#111111] text-white">Section A</option>
                <option value="B" className="bg-[#111111] text-white">Section B</option>
                <option value="C" className="bg-[#111111] text-white">Section C</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
              <input 
                type="date" 
                className="input-field" 
                value={dob} 
                onChange={(e) => setDob(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate(user?.role === 'Admin' ? '/dashboard/admin/students' : '/dashboard/teacher/students')} 
              className="px-6 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex items-center gap-2">
              <UserPlus size={18} />
              Enroll Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
