import { COLLEGES } from './colleges';
import { type StudentData } from './studentMockData';
import { type TimetableSlot } from './timetableDB';

// Define notices structure
export interface NoticeData {
  id: number;
  type: string;
  title: string;
  desc: string;
  timestamp: string;
  iconName: 'BookOpen' | 'TerminalIcon' | 'Gamepad2' | 'Trophy' | 'AlertCircle';
  color: string;
  image: string;
  venue?: string;
  date?: string;
  prizes?: string[];
  fullDesc?: string;
  collegeName: string;
  category: 'Academic' | 'Examination' | 'Holiday' | 'Event' | 'Placement' | 'General';
  priority: 'Normal' | 'Important' | 'Urgent';
  createdAt: number;
}

export function seedDatabase() {
  const usersSeeded = localStorage.getItem('usersDB_seeded_v6');
  if (usersSeeded) return; // Seeding already done

  console.log('Initializing seed data for UniPortal...');

  // 1. Seed Users (Admin, Teacher, Student for 4 colleges)
  const users = [
    // Sandip University, Nashik Users
    {
      id: 'sun_admin_id',
      name: 'SUN Admin',
      username: 'sunadmin',
      email: 'admin@sandipuniversity.edu.in',
      password: 'Admin@123',
      securityAnswer: 'mathematics',
      role: 'Admin',
      collegeName: 'Sandip University, Nashik'
    },
    {
      id: 'sun_teacher_id',
      name: 'SUN Teacher',
      username: 'sunteacher',
      email: 'teacher@sandipuniversity.edu.in',
      password: 'Teacher@123',
      securityAnswer: 'mathematics',
      role: 'Teacher',
      collegeName: 'Sandip University, Nashik',
      branch: 'B.Tech CSE'
    },
    {
      id: 'sun_student_id',
      name: 'SUN Student',
      username: 'sunstudent',
      email: 'student@sandipuniversity.edu.in',
      password: 'Student@123',
      securityAnswer: 'mathematics',
      role: 'Student',
      collegeName: 'Sandip University, Nashik'
    },

    // CBIT Users
    {
      id: 'cbit_admin_id',
      name: 'CBIT Admin',
      username: 'cbitadmin',
      email: 'admin@cbit.ac.in',
      password: 'Admin@123',
      securityAnswer: 'mathematics',
      role: 'Admin',
      collegeName: 'Chaitanya Bharathi Institute of Technology (CBIT)'
    },
    {
      id: 'cbit_teacher_id',
      name: 'CBIT Teacher',
      username: 'cbitteacher',
      email: 'teacher@cbit.ac.in',
      password: 'Teacher@123',
      securityAnswer: 'mathematics',
      role: 'Teacher',
      collegeName: 'Chaitanya Bharathi Institute of Technology (CBIT)',
      branch: 'B.Tech CSE'
    },
    {
      id: 'cbit_student_id',
      name: 'CBIT Student',
      username: 'cbitstudent',
      email: 'student@cbit.ac.in',
      password: 'Student@123',
      securityAnswer: 'mathematics',
      role: 'Student',
      collegeName: 'Chaitanya Bharathi Institute of Technology (CBIT)'
    },

    // IIT Hyderabad Users
    {
      id: 'iith_admin_id',
      name: 'IITH Admin',
      username: 'iithadmin',
      email: 'admin@iith.ac.in',
      password: 'Admin@123',
      securityAnswer: 'mathematics',
      role: 'Admin',
      collegeName: 'IIT Hyderabad'
    },
    {
      id: 'iith_teacher_id',
      name: 'IITH Teacher',
      username: 'iithteacher',
      email: 'teacher@iith.ac.in',
      password: 'Teacher@123',
      securityAnswer: 'mathematics',
      role: 'Teacher',
      collegeName: 'IIT Hyderabad',
      branch: 'B.Tech CSE'
    },
    {
      id: 'iith_student_id',
      name: 'IITH Student',
      username: 'iithstudent',
      email: 'student@iith.ac.in',
      password: 'Student@123',
      securityAnswer: 'mathematics',
      role: 'Student',
      collegeName: 'IIT Hyderabad'
    },

    // Osmania University Users
    {
      id: 'ou_admin_id',
      name: 'OU Admin',
      username: 'ouadmin',
      email: 'admin@ou.ac.in',
      password: 'Admin@123',
      securityAnswer: 'mathematics',
      role: 'Admin',
      collegeName: 'Osmania University'
    },
    {
      id: 'ou_teacher_id',
      name: 'OU Teacher',
      username: 'outeacher',
      email: 'teacher@ou.ac.in',
      password: 'Teacher@123',
      securityAnswer: 'mathematics',
      role: 'Teacher',
      collegeName: 'Osmania University',
      branch: 'B.Tech CSE'
    },
    {
      id: 'ou_student_id',
      name: 'OU Student',
      username: 'oustudent',
      email: 'student@ou.ac.in',
      password: 'Student@123',
      securityAnswer: 'mathematics',
      role: 'Student',
      collegeName: 'Osmania University'
    }
  ];

  localStorage.setItem('usersDB', JSON.stringify(users));

  // 2. Seed Student Data Profiles
  const studentData: Record<string, StudentData> = {
    'sun_student_id': {
      userId: 'sun_student_id',
      prn: '2026SUN1101',
      course: 'B.Tech CSE',
      year: '3rd Year (Semester 6)',
      joinDate: '2024-07-10',
      status: 'Active',
      collegeName: 'Sandip University, Nashik',
      subjects: [
        { name: 'Database Mgmt', marks: 90, grade: 'O', attendance: 88 },
        { name: 'Operating Sys', marks: 85, grade: 'A+', attendance: 85 },
        { name: 'Computer Networks', marks: 82, grade: 'A+', attendance: 80 },
        { name: 'Software Eng', marks: 88, grade: 'A+', attendance: 90 },
        { name: 'Data Structures', marks: 92, grade: 'O', attendance: 92 }
      ]
    },
    'cbit_student_id': {
      userId: 'cbit_student_id',
      prn: '2026CBIT4501',
      course: 'B.Tech CSE',
      year: '3rd Year (Semester 6)',
      joinDate: '2024-07-15',
      status: 'Active',
      collegeName: 'Chaitanya Bharathi Institute of Technology (CBIT)',
      subjects: [
        { name: 'Database Mgmt', marks: 88, grade: 'A+', attendance: 85 },
        { name: 'Operating Sys', marks: 92, grade: 'O', attendance: 90 },
        { name: 'Computer Networks', marks: 74, grade: 'A', attendance: 80 },
        { name: 'Software Eng', marks: 82, grade: 'A+', attendance: 78 },
        { name: 'Data Structures', marks: 95, grade: 'O', attendance: 95 }
      ]
    },
    'iith_student_id': {
      userId: 'iith_student_id',
      prn: '2026IITH9202',
      course: 'B.Tech CSE',
      year: '3rd Year (Semester 6)',
      joinDate: '2024-07-20',
      status: 'Active',
      collegeName: 'IIT Hyderabad',
      subjects: [
        { name: 'Database Mgmt', marks: 95, grade: 'O', attendance: 95 },
        { name: 'Operating Sys', marks: 88, grade: 'A+', attendance: 88 },
        { name: 'Computer Networks', marks: 91, grade: 'O', attendance: 92 },
        { name: 'Software Eng', marks: 85, grade: 'A+', attendance: 84 },
        { name: 'Data Structures', marks: 90, grade: 'O', attendance: 89 }
      ]
    },
    'ou_student_id': {
      userId: 'ou_student_id',
      prn: '2026OU7703',
      course: 'B.Tech CSE',
      year: '3rd Year (Semester 6)',
      joinDate: '2024-08-01',
      status: 'Active',
      collegeName: 'Osmania University',
      subjects: [
        { name: 'Database Mgmt', marks: 72, grade: 'A', attendance: 76 },
        { name: 'Operating Sys', marks: 68, grade: 'B+', attendance: 74 },
        { name: 'Computer Networks', marks: 78, grade: 'A', attendance: 82 },
        { name: 'Software Eng', marks: 65, grade: 'B+', attendance: 75 },
        { name: 'Data Structures', marks: 80, grade: 'A+', attendance: 80 }
      ]
    }
  };

  localStorage.setItem('studentDataStore', JSON.stringify(studentData));

  // 3. Seed Timetables per College
  const timetables: Record<string, TimetableSlot[]> = {
    'Chaitanya Bharathi Institute of Technology (CBIT)': [
      { day: 'Monday', slot1: 'CBIT-AI (C10)', slot2: 'CBIT-DBMS (C03)', lunch: 'Lunch Break', slot3: 'CBIT-AI LAB (S128)', slot4: 'CBIT-AI LAB (S128)', slot5: 'CBIT-SDPM (C18)', slot6: 'CBIT-Strategic Com (C17)' },
      { day: 'Tuesday', slot1: 'CBIT-Microcontroller (C25)', slot2: 'CBIT-Strategic Com (C17)', lunch: 'Lunch Break', slot3: 'CBIT-DBMS LAB (S127)', slot4: 'CBIT-DBMS LAB (S127)', slot5: 'CBIT-AI (C10)', slot6: 'CBIT-SDPM (C18)' },
      { day: 'Wednesday', slot1: 'CBIT-SDPM (C18)', slot2: 'CBIT-Microcontroller (C25)', lunch: 'Lunch Break', slot3: 'CBIT-DBMS (C03)', slot4: 'CBIT-Strategic Com (C17)', slot5: 'CBIT-SDPM LAB (F124)', slot6: 'CBIT-SDPM LAB (F124)' },
      { day: 'Thursday', slot1: 'CBIT-Strategic Com (C17)', slot2: 'CBIT-AI (C10)', lunch: 'Lunch Break', slot3: 'CBIT-Microcontroller (C25)', slot4: 'CBIT-DBMS (C03)', slot5: 'CBIT-Micro Controller LAB (F128)', slot6: 'CBIT-Micro Controller LAB (F128)' },
      { day: 'Friday', slot1: 'CBIT-DBMS (C03)', slot2: 'CBIT-SDPM (C18)', lunch: 'Lunch Break', slot3: 'CBIT-AI (C10)', slot4: 'CBIT-Microcontroller (C25)', slot5: 'Free Period', slot6: 'Free Period' },
      { day: 'Saturday', slot1: 'CBIT-Strategic Com (C17)', slot2: 'CBIT-DBMS (C03)', lunch: 'Lunch Break', slot3: 'CBIT-SDPM (C18)', slot4: 'Free Period', slot5: 'Free Period', slot6: 'Free Period' }
    ],
    'IIT Hyderabad': [
      { day: 'Monday', slot1: 'IITH-AI (C10)', slot2: 'IITH-DBMS (C03)', lunch: 'Lunch Break', slot3: 'IITH-AI LAB (S128)', slot4: 'IITH-AI LAB (S128)', slot5: 'IITH-SDPM (C18)', slot6: 'IITH-Strategic Com (C17)' },
      { day: 'Tuesday', slot1: 'IITH-Microcontroller (C25)', slot2: 'IITH-Strategic Com (C17)', lunch: 'Lunch Break', slot3: 'IITH-DBMS LAB (S127)', slot4: 'IITH-DBMS LAB (S127)', slot5: 'IITH-AI (C10)', slot6: 'IITH-SDPM (C18)' },
      { day: 'Wednesday', slot1: 'IITH-SDPM (C18)', slot2: 'IITH-Microcontroller (C25)', lunch: 'Lunch Break', slot3: 'IITH-DBMS (C03)', slot4: 'IITH-Strategic Com (C17)', slot5: 'IITH-SDPM LAB (F124)', slot6: 'IITH-SDPM LAB (F124)' },
      { day: 'Thursday', slot1: 'IITH-Strategic Com (C17)', slot2: 'IITH-AI (C10)', lunch: 'Lunch Break', slot3: 'IITH-Microcontroller (C25)', slot4: 'IITH-DBMS (C03)', slot5: 'IITH-Micro Controller LAB (F128)', slot6: 'IITH-Micro Controller LAB (F128)' },
      { day: 'Friday', slot1: 'IITH-DBMS (C03)', slot2: 'IITH-SDPM (C18)', lunch: 'Lunch Break', slot3: 'IITH-AI (C10)', slot4: 'IITH-Microcontroller (C25)', slot5: 'Free Period', slot6: 'Free Period' },
      { day: 'Saturday', slot1: 'IITH-Strategic Com (C17)', slot2: 'IITH-DBMS (C03)', lunch: 'Lunch Break', slot3: 'IITH-SDPM (C18)', slot4: 'Free Period', slot5: 'Free Period', slot6: 'Free Period' }
    ],
    'Osmania University': [
      { day: 'Monday', slot1: 'OU-AI (C10)', slot2: 'OU-DBMS (C03)', lunch: 'Lunch Break', slot3: 'OU-AI LAB (S128)', slot4: 'OU-AI LAB (S128)', slot5: 'OU-SDPM (C18)', slot6: 'OU-Strategic Com (C17)' },
      { day: 'Tuesday', slot1: 'OU-Microcontroller (C25)', slot2: 'OU-Strategic Com (C17)', lunch: 'Lunch Break', slot3: 'OU-DBMS LAB (S127)', slot4: 'OU-DBMS LAB (S127)', slot5: 'OU-AI (C10)', slot6: 'OU-SDPM (C18)' },
      { day: 'Wednesday', slot1: 'OU-SDPM (C18)', slot2: 'OU-Microcontroller (C25)', lunch: 'Lunch Break', slot3: 'OU-DBMS (C03)', slot4: 'OU-Strategic Com (C17)', slot5: 'OU-SDPM LAB (F124)', slot6: 'OU-SDPM LAB (F124)' },
      { day: 'Thursday', slot1: 'OU-Strategic Com (C17)', slot2: 'OU-AI (C10)', lunch: 'Lunch Break', slot3: 'OU-Microcontroller (C25)', slot4: 'OU-DBMS (C03)', slot5: 'OU-Micro Controller LAB (F128)', slot6: 'OU-Micro Controller LAB (F128)' },
      { day: 'Friday', slot1: 'OU-DBMS (C03)', slot2: 'OU-SDPM (C18)', lunch: 'Lunch Break', slot3: 'OU-AI (C10)', slot4: 'OU-Microcontroller (C25)', slot5: 'Free Period', slot6: 'Free Period' },
      { day: 'Saturday', slot1: 'OU-Strategic Com (C17)', slot2: 'OU-DBMS (C03)', lunch: 'Lunch Break', slot3: 'OU-SDPM (C18)', slot4: 'Free Period', slot5: 'Free Period', slot6: 'Free Period' }
    ]
  };

  // Seed default timetables for all other colleges
  COLLEGES.forEach(college => {
    if (!timetables[college]) {
      // Create a default one
      timetables[college] = [
        { day: 'Monday', slot1: 'AI (C10)', slot2: 'DBMS (C03)', lunch: 'Lunch Break', slot3: 'AI LAB (S128)', slot4: 'AI LAB (S128)', slot5: 'SDPM (C18)', slot6: 'Strategic Com (C17)' },
        { day: 'Tuesday', slot1: 'Microcontroller (C25)', slot2: 'Strategic Com (C17)', lunch: 'Lunch Break', slot3: 'DBMS LAB (S127)', slot4: 'DBMS LAB (S127)', slot5: 'AI (C10)', slot6: 'SDPM (C18)' },
        { day: 'Wednesday', slot1: 'SDPM (C18)', slot2: 'Microcontroller (C25)', lunch: 'Lunch Break', slot3: 'DBMS (C03)', slot4: 'Strategic Com (C17)', slot5: 'SDPM LAB (F124)', slot6: 'SDPM LAB (F124)' },
        { day: 'Thursday', slot1: 'Strategic Com (C17)', slot2: 'AI (C10)', lunch: 'Lunch Break', slot3: 'Microcontroller (C25)', slot4: 'DBMS (C03)', slot5: 'Micro Controller LAB (F128)', slot6: 'Micro Controller LAB (F128)' },
        { day: 'Friday', slot1: 'DBMS (C03)', slot2: 'SDPM (C18)', lunch: 'Lunch Break', slot3: 'AI (C10)', slot4: 'Microcontroller (C25)', slot5: 'Free Period', slot6: 'Free Period' },
        { day: 'Saturday', slot1: 'Strategic Com (C17)', slot2: 'DBMS (C03)', lunch: 'Lunch Break', slot3: 'SDPM (C18)', slot4: 'Free Period', slot5: 'Free Period', slot6: 'Free Period' }
      ];
    }
  });

  // Store timetables dictionary
  localStorage.setItem('timetableDB_dict', JSON.stringify(timetables));

  // 4. Seed Notices per College
  const notices: NoticeData[] = [];
  let noticeId = 1000;

  const CATEGORY_IMAGES = {
    Academic: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
    Examination: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop',
    Holiday: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
    Event: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
    Placement: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
    General: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop'
  };

  const CATEGORY_ICONS = {
    Academic: 'BookOpen',
    Examination: 'AlertCircle',
    Holiday: 'Gamepad2',
    Event: 'Trophy',
    Placement: 'BookOpen',
    General: 'AlertCircle'
  } as const;

  const CATEGORY_COLORS = {
    Academic: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Examination: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Holiday: 'bg-green-500/20 text-green-400 border-green-500/30',
    Event: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Placement: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    General: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };

  COLLEGES.forEach((college) => {
    // We add exactly 5 realistic, college-specific notices
    const templates = [
      {
        title: `Semester End Examination Schedule Released`,
        desc: `The official examination schedule for the upcoming Semester VI has been published for ${college} students.`,
        fullDesc: `All students of ${college} are hereby informed that the Semester End Examinations for Semester VI will commence from July 15, 2026. The detailed subject-wise timetable is available on the portal and the notice board. Make sure your dues are cleared and your admit card is downloaded before July 10, 2026. Contact the examination office for any queries or corrections.`,
        category: 'Examination' as const,
        priority: 'Important' as const,
        date: 'July 15, 2026',
        venue: 'Examination Hall & Respective Departments',
        hoursAgo: 2
      },
      {
        title: `Mid-Term Examination Timetable Published`,
        desc: `Mid-term evaluation timetable for all undergraduate courses is now online.`,
        fullDesc: `The Mid-Term Examination (MTE) for the current academic session at ${college} will be conducted from June 25 to June 30, 2026. Each examination will be of 2 hours duration, covering Units 1, 2, and 3. Attendance is compulsory, and no re-examinations will be scheduled except for medical emergencies approved by the Dean.`,
        category: 'Examination' as const,
        priority: 'Normal' as const,
        date: 'June 25 - June 30, 2026',
        venue: 'Departmental Classrooms',
        hoursAgo: 24
      },
      {
        title: `Attendance Shortage Warning`,
        desc: `Critical notification for students having less than 75% attendance in core subjects at ${college}.`,
        fullDesc: `As per the academic regulations of ${college}, students must maintain a minimum of 75% attendance in each course to be eligible to appear for the Semester End Examinations. The list of students with attendance shortage has been shared with all department heads. Please consult your branch coordinators immediately to submit medical certificates or complete remedial assignments.`,
        category: 'Academic' as const,
        priority: 'Urgent' as const,
        date: 'Deadline: June 20, 2026',
        venue: 'Office of Academic Affairs',
        hoursAgo: 48
      },
      {
        title: `Holiday Announcement`,
        desc: `${college} will remain closed in observance of national holidays and semester break.`,
        fullDesc: `The university will remain closed for all academic and administrative activities on August 15, 2026, in observance of Independence Day. Additionally, the student summer break for ${college} is scheduled from August 16 to August 31, 2026. Regular classes for the next academic session will resume on September 1, 2026.`,
        category: 'Holiday' as const,
        priority: 'Normal' as const,
        date: 'August 15 - August 31, 2026',
        venue: 'Entire Campus',
        hoursAgo: 72
      },
      {
        title: `Assignment Submission Deadline Reminder`,
        desc: `Submission portal for all major laboratory journals and project reports closes next week.`,
        fullDesc: `All undergraduate and postgraduate students of ${college} are reminded that the portal for uploading laboratory records, course assignments, and capstone project draft reports will close on June 18, 2026. Late submissions will attract a grade penalty of 10% per day. Ensure your submissions are signed off by your respective advisors prior to submission.`,
        category: 'Academic' as const,
        priority: 'Important' as const,
        date: 'Due Date: June 18, 2026',
        venue: 'Online Portal / Department Labs',
        hoursAgo: 120
      }
    ];

    templates.forEach((t) => {
      noticeId++;
      // Calculate a realistic date string for timestamp
      const noticeDate = new Date(Date.now() - t.hoursAgo * 60 * 60 * 1000);
      const timestampStr = noticeDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      notices.push({
        id: noticeId,
        type: t.category, // fallback for any legacy display
        title: t.title,
        desc: t.desc,
        fullDesc: t.fullDesc,
        timestamp: timestampStr,
        iconName: CATEGORY_ICONS[t.category],
        color: CATEGORY_COLORS[t.category],
        image: CATEGORY_IMAGES[t.category],
        venue: t.venue,
        date: t.date,
        collegeName: college,
        category: t.category,
        priority: t.priority,
        createdAt: noticeDate.getTime()
      });
    });
  });

  localStorage.setItem('noticesDB', JSON.stringify(notices));

  // Mark database as seeded
  localStorage.setItem('usersDB_seeded_v6', 'true');
  console.log('UniPortal database seeding completed successfully!');
}
