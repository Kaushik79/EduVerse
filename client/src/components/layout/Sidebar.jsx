import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { Separator } from '../ui/Separator';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  ClipboardList,
  FileQuestion,
  Wallet,
  Calendar,
  CheckCircle2,
  FolderOpen,
  Settings,
  Users,
  GraduationCap,
  ShieldCheck,
  ListChecks,
  HelpCircle,
  LogOut,
  UserCog,
  User,
  Flag,
  Trophy,
  FolderGit2,
  FileText,
  Briefcase,
  MessageSquare,
  Star,
  CalendarRange
} from 'lucide-react';
import { cn } from '../../lib/utils';

const sidebarConfig = {
  student: {
    title: 'Student Portal',
    menuLabel: 'MENU',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
      { label: 'Calendar', icon: Calendar, path: '/student/calendar' },
      { label: 'Courses', icon: BookOpen, path: '/student/courses' },
      { label: 'Assignments', icon: ClipboardList, path: '/student/assignments' },
      { label: 'Exams', icon: FileQuestion, path: '/student/exams' },
      { label: 'Grades', icon: CheckCircle2, path: '/student/grades' },
      { label: 'Projects', icon: FolderGit2, path: '/student/projects' },
      { label: 'Achievements', icon: Trophy, path: '/student/achievements' },
      { label: 'Resources', icon: FolderOpen, path: '/student/resources' },
      { label: 'OD / Leaves', icon: FileText, path: '/student/leaves' },
      { label: 'Finances', icon: Wallet, path: '/student/finances' },
    ],
    otherLabel: 'OTHER',
    otherItems: [
      { label: 'Settings', icon: Settings, path: '/student/settings' },
    ]
  },
  teacher: {
    title: 'Teacher Portal',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/teacher/dashboard' },
      { label: 'Classes', icon: GraduationCap, path: '/teacher/classes' },
      { label: 'Assignments', icon: ClipboardList, path: '/teacher/assignments' },
      { label: 'Students', icon: Users, path: '/teacher/students' },
      { label: 'Schedule', icon: CalendarDays, path: '/teacher/schedule' },
      { label: 'Settings', icon: Settings, path: '/teacher/settings' },
    ]
  },
  admin: {
    title: '',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
      { label: 'Role Management', icon: UserCog, path: '/admin/roles' },
      { label: 'Academic Control', icon: ShieldCheck, path: '/admin/academic' },
      { label: 'Verification Queue', icon: ListChecks, path: '/admin/verification' },
    ],
    otherItems: [
      { label: 'Settings', icon: Settings, path: '/admin/settings' },
      { label: 'Support', icon: HelpCircle, path: '/admin/support' },
    ]
  },
  alumni: {
    title: 'Alumni Portal',
    menuLabel: 'NETWORK',
    items: [
      { label: 'My Profile', icon: User, path: '/alumni/profile' },
      { label: 'Alumni Directory', icon: Users, path: '/alumni/directory' },
      { label: 'Jobs & Referrals', icon: Briefcase, path: '/alumni/jobs' },
      { label: 'Messaging', icon: MessageSquare, path: '/alumni/messaging' },
      { label: 'Events', icon: CalendarRange, path: '/alumni/events' },
      { label: 'Mentorship', icon: Star, path: '/alumni/mentorship' },
    ],
    otherLabel: 'OTHER',
    otherItems: [
      { label: 'Settings', icon: Settings, path: '/alumni/settings' },
    ]
  }
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Detect role from URL path as fallback
  const getRoleFromPath = () => {
    const path = location.pathname;
    if (path.startsWith('/teacher')) return 'teacher';
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/alumni')) return 'alumni';
    return 'student';
  };

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const role = user?.role || getRoleFromPath();
  const config = sidebarConfig[role] || sidebarConfig.student;

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const basePath = role === 'teacher' ? '/teacher' : role === 'admin' ? '/admin' : role === 'alumni' ? '/alumni' : '/student';

  const userMenuItems = [
    { label: 'Profile', icon: User, action: () => navigate(`${basePath}/settings`) },
    { label: 'Settings', icon: Settings, action: () => navigate(`${basePath}/settings`) },
    { label: 'Report', icon: Flag, action: () => { } },
    { label: 'Logout', icon: LogOut, action: () => { setShowUserMenu(false); logout(); navigate('/login'); } },
  ];

  return (
    <aside className="w-[250px] h-screen bg-sidebar-bg border-r border-border flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-text">EduVerse</h1>
            {config.title && (
              <p className="text-xs text-text-muted">{config.title}</p>
            )}
          </div>
        </div>
      </div>

      {/* Admin profile card */}
      {role === 'admin' && (
        <div className="mx-4 mb-3 p-3 bg-primary rounded-xl">
          <div className="flex items-center gap-3">
            <Avatar alt={user?.name} size="default" fallback={user?.name?.charAt(0)} />
            <div>
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-blue-200">Super Admin</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Label */}
      {config.menuLabel && (
        <div className="px-5 pt-2 pb-1">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            {config.menuLabel}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {config.items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-active text-accent'
                      : 'text-text-secondary hover:bg-sidebar-hover hover:text-text'
                  )
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Other section */}
        {config.otherItems && (
          <>
            {config.otherLabel && (
              <div className="px-2 pt-6 pb-1">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  {config.otherLabel}
                </span>
              </div>
            )}
            {!config.otherLabel && <Separator className="my-3" />}
            <ul className="space-y-0.5">
              {config.otherItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-sidebar-active text-accent'
                          : 'text-text-secondary hover:bg-sidebar-hover hover:text-text'
                      )
                    }
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      {/* User profile / Sign out at bottom */}
      <div className="relative p-4 border-t border-border" ref={userMenuRef}>
        {/* Popup Menu */}
        {showUserMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl border border-border shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {userMenuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => { setShowUserMenu(false); item.action(); }}
                className={cn(
                  'flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium transition-all cursor-pointer',
                  item.label === 'Logout'
                    ? 'text-danger hover:bg-red-50 border-t border-border mt-1 pt-3'
                    : 'text-text-secondary hover:bg-sidebar-hover hover:text-text'
                )}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Clickable User Profile */}
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-3 w-full rounded-lg p-1 hover:bg-sidebar-hover transition-all cursor-pointer text-left"
        >
          <Avatar alt={user?.name} size="default" fallback={user?.name?.charAt(0)} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text truncate">{user?.name || (role === 'admin' ? 'Marcus Chen' : role === 'teacher' ? 'Prof. Anderson' : 'Alex Morgan')}</p>
            <p className="text-xs text-text-muted truncate">
              {role === 'admin' ? 'Super Admin' : role === 'student' ? `Student ID: ${user?.studentId || 'N/A'}` : user?.department || 'Physics Dept.'}
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
}
