export interface SubjectData {
  name: string;
  marks: number;
  grade: string;
  attendance: number;
  todayStatus?: 'Present' | 'Absent' | null;
}

export interface StudentData {
  userId: string;
  prn: string;
  course: string;
  year: string;
  joinDate: string;
  subjects: SubjectData[];
  status: 'Active' | 'Inactive';
  collegeName: string;
}

const calculateGrade = (marks: number) => {
  if (marks >= 90) return 'O';
  if (marks >= 80) return 'A+';
  if (marks >= 70) return 'A';
  if (marks >= 60) return 'B+';
  if (marks >= 50) return 'B';
  return 'U';
};

const generateRandomSubjects = (): SubjectData[] => {
  const subjectsStr = ['Database Mgmt', 'Operating Sys', 'Computer Networks', 'Software Eng', 'Data Structures'];
  return subjectsStr.map(sub => {
    const marks = Math.floor(Math.random() * 45) + 55; // random between 55 and 100
    const attendance = Math.floor(Math.random() * 30) + 70; // random between 70% and 100%
    return {
      name: sub,
      marks,
      grade: calculateGrade(marks),
      attendance
    };
  });
};

export const getStudentData = (userId: string): StudentData => {
  const records = JSON.parse(localStorage.getItem('studentDataStore') || '{}');
  
  if (records[userId]) {
    return records[userId];
  }

  // Find collegeName from usersDB
  const users = JSON.parse(localStorage.getItem('usersDB') || '[]');
  const matchedUser = users.find((u: any) => u.id === userId);
  const collegeName = matchedUser ? matchedUser.collegeName : 'Chaitanya Bharathi Institute of Technology (CBIT)';

  // Generate new mock data for this user ID
  const newRecord: StudentData = {
    userId,
    prn: `2026CS${Math.floor(Math.random() * 9000) + 1000}`,
    course: 'B.Tech Computer Science',
    year: '3rd Year (Semester 6)',
    joinDate: new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString().split('T')[0], // 2 years ago roughly
    status: 'Active',
    subjects: generateRandomSubjects(),
    collegeName
  };

  records[userId] = newRecord;
  localStorage.setItem('studentDataStore', JSON.stringify(records));

  return newRecord;
};

export const saveStudentData = (data: StudentData) => {
  const records = JSON.parse(localStorage.getItem('studentDataStore') || '{}');
  records[data.userId] = data;
  localStorage.setItem('studentDataStore', JSON.stringify(records));
};

