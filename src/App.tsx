import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/Layout';

// Auth
import { Login } from './auth/Login';
import { Signup } from './auth/Signup';
import { ForgotPassword } from './auth/ForgotPassword';
import { ResetPassword } from './auth/ResetPassword';

// Pages
import { Welcome } from './pages/Welcome';
import { Dashboard } from './pages/Dashboard';
import { AddStudent } from './pages/AddStudent';
import { ViewStudents } from './pages/ViewStudents';
import { ViewTeachers } from './pages/ViewTeachers';
import { MarksAndGrades } from './pages/MarksAndGrades';
import { Attendance } from './pages/Attendance';
import { Reports } from './pages/Reports';
import { TimetablePage } from './pages/TimetablePage';
import { NoticeBoard } from './pages/NoticeBoard';

// Student Detailed Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentMarks } from './pages/student/StudentMarks';
import { StudentAttendance } from './pages/student/StudentAttendance';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          
          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route element={<DashboardLayout allowedRole="Admin" />}>
              <Route path="/dashboard/admin" element={<Dashboard />} />
              <Route path="/dashboard/admin/add-student" element={<AddStudent />} />
              <Route path="/dashboard/admin/students" element={<ViewStudents />} />
              <Route path="/dashboard/admin/teachers" element={<ViewTeachers />} />
              <Route path="/dashboard/admin/marks" element={<MarksAndGrades />} />
              <Route path="/dashboard/admin/attendance" element={<Attendance />} />
              <Route path="/dashboard/admin/reports" element={<Reports />} />
              <Route path="/dashboard/admin/timetable" element={<TimetablePage />} />
              <Route path="/dashboard/admin/notices" element={<NoticeBoard />} />
            </Route>
          </Route>

          {/* Teacher Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Teacher']} />}>
            <Route element={<DashboardLayout allowedRole="Teacher" />}>
              <Route path="/dashboard/teacher" element={<Dashboard />} />
              <Route path="/dashboard/teacher/add-student" element={<AddStudent />} />
              <Route path="/dashboard/teacher/students" element={<ViewStudents />} />
              <Route path="/dashboard/teacher/marks" element={<MarksAndGrades />} />
              <Route path="/dashboard/teacher/attendance" element={<Attendance />} />
              <Route path="/dashboard/teacher/timetable" element={<TimetablePage />} />
              <Route path="/dashboard/teacher/notices" element={<NoticeBoard />} />
            </Route>
          </Route>

          {/* Student Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
            <Route element={<DashboardLayout allowedRole="Student" />}>
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/dashboard/student/marks" element={<StudentMarks />} />
              <Route path="/dashboard/student/attendance" element={<StudentAttendance />} />
              <Route path="/dashboard/student/timetable" element={<TimetablePage />} />
              <Route path="/dashboard/student/notices" element={<NoticeBoard />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
