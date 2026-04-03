import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import Login from './pages/Login';
import Analyze from './pages/Analyze';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentSchedule from './pages/student/Schedule';
import StudentCourses from './pages/student/Courses';
import StudentAssignments from './pages/student/Assignments';
import StudentExams from './pages/student/Exams';
import StudentFinances from './pages/student/Finances';
import StudentCalendar from './pages/student/Calendar';
import StudentGrades from './pages/student/Grades';
import StudentResources from './pages/student/Resources';
import StudentSettings from './pages/student/Settings';
import StudentAchievements from './pages/student/Achievements';
import StudentProjects from './pages/student/Projects';
import StudentLeaves from './pages/student/Leaves';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherClasses from './pages/teacher/Classes';
import TeacherAssignments from './pages/teacher/Assignments';
import TeacherStudents from './pages/teacher/Students';
import TeacherSchedule from './pages/teacher/Schedule';
import TeacherSettings from './pages/teacher/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import RoleManagement from './pages/admin/RoleManagement';
import AcademicControl from './pages/admin/AcademicControl';
import VerificationQueue from './pages/admin/VerificationQueue';
import AdminSettings from './pages/admin/Settings';
import Support from './pages/admin/Support';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Student Routes */}
          <Route path="/student" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="schedule" element={<StudentSchedule />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="exams" element={<StudentExams />} />
            <Route path="finances" element={<StudentFinances />} />
            <Route path="calendar" element={<StudentCalendar />} />
            <Route path="grades" element={<StudentGrades />} />
            <Route path="resources" element={<StudentResources />} />
            <Route path="settings" element={<StudentSettings />} />
            <Route path="achievements" element={<StudentAchievements />} />
            <Route path="projects" element={<StudentProjects />} />
            <Route path="leaves" element={<StudentLeaves />} />
          </Route>

          {/* Teacher Routes */}
          <Route path="/teacher" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="classes" element={<TeacherClasses />} />
            <Route path="assignments" element={<TeacherAssignments />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="schedule" element={<TeacherSchedule />} />
            <Route path="settings" element={<TeacherSettings />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="roles" element={<RoleManagement />} />
            <Route path="academic" element={<AcademicControl />} />
            <Route path="verification" element={<VerificationQueue />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* Shared Authenticated Routes */}
          <Route element={<AppLayout />}>
            <Route path="/analyze/:repoName" element={<Analyze />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
