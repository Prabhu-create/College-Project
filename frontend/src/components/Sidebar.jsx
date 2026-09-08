import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  GraduationCap,
  UsersRound,
  Building2,
  BriefcaseBusiness,
  Dumbbell,
  CalendarDays,
  ClipboardCheck,
  Users,
  File,
  FileText
} from "lucide-react";

function Sidebar() {
  const { user, logout } = useAuth();

  const menuByRole = {
    Admin: [
      {
        name: "Dashboard",
        path: "/",
        icon: <LayoutDashboard size={22} strokeWidth={2} />,
      },
      {
        name: "Students",
        path: "/students",
        icon: <GraduationCap size={22} strokeWidth={2} />,
      },
      {
        name: "Faculty",
        path: "/faculty",
        icon: <UsersRound size={22} strokeWidth={2} />,
      },
      {
        name: "Companies",
        path: "/companies",
        icon: <Building2 size={22} strokeWidth={2} />,
      },
      {
        name: "Placement",
        path: "/placement",
        icon: <BriefcaseBusiness size={22} strokeWidth={2} />,
      },
      {
        name: "Training",
        path: "/training-programs",
        icon: <Dumbbell size={22} strokeWidth={2} />,
      },
      {
        name: "Users",
        path: "/users",
        icon: <Users size={22} strokeWidth={2} />,
      },
      {
        name: "Marks",
        path: "/marks",
        icon: <ClipboardCheck size={22} strokeWidth={2} />,
      },
    ],

    Faculty: [
      {
        name: "Dashboard",
        path: "/",
        icon: <LayoutDashboard size={22} strokeWidth={2} />,
      },
      {
        name: "Students",
        path: "/students",
        icon: <GraduationCap size={22} strokeWidth={2} />,
      },
      {
        name: "Attendance",
        path: "/attendance",
        icon: <CalendarDays size={22} strokeWidth={2} />,
      },
      {
        name: "Marks",
        path: "/marks",
        icon: <ClipboardCheck size={22} strokeWidth={2} />,
      },
      {
        name: "Placement",
        path: "/placement",
        icon: <BriefcaseBusiness size={22} strokeWidth={2} />,
      },
      {
        name: "Training",
        path: "/training-programs",
        icon: <Dumbbell size={22} strokeWidth={2} />,
      },
      {
        name: "Applications",
        path: "/applications",
        icon: <FileText size={22} strokeWidth={2} />,
      },
    ],

     Student: [
      {
        name: "Dashboard",
        path: "/",
        icon: <LayoutDashboard size={22} strokeWidth={2} />,
      },
      {
        name: "Jobs",
        path: "/jobs",
        icon: <BriefcaseBusiness size={22} strokeWidth={2} />,
      },
      {
        name: "Applications",
        path: "/applications",
        icon: <File size={22} strokeWidth={2} />,
      },
      {
        name: "Training",
        path: "/training-programs",
        icon: <Dumbbell size={22} strokeWidth={2} />,
      },
    ],

"Placement Officer": [
  {
    name: "Dashboard",
    path: "/",
    icon: "📊",
  },
  {
    name: "Students",
    path: "/students",
    icon: "👨‍🎓",
  },
  {
    name: "Companies",
    path: "/companies",
    icon: "🏢",
  },
  {
    name: "Placement",
    path: "/placement",
    icon: "💼",
  },
  {
    name: "Placement Drives",
    path: "/placement-drives",
    icon: "📢",
  },
  {
    name: "Applications",
    path: "/applications",
    icon: "📄",
  },
],

    Trainer: [
      {
        name: "Dashboard",
        path: "/",
        icon: "📊",
      },
      {
        name: "Training Programs",
        path: "/training-programs",
        icon: "🏋️",
      },
      {
        name: "Student Performance",
        path: "/student-performance",
        icon: "📊",
      },
    ],

  };

  const menuItems = menuByRole[user?.role] || [];

  return (
    <aside className="flex min-h-screen w-64 min-w-64 flex-col bg-slate-900 p-6 text-white">

      {/* Logo */}

      <div className="mb-8">

        <h1 className="text-2xl font-bold">
          🎓 CollegeMS
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Management System
        </p>

      </div>


      {/* Menu */}

      <nav className="flex-1 space-y-2">

       {menuItems.map((item) => (

          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >

            <span className="text-xl">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.name}
            </span>

          </NavLink>

        ))}

      </nav>
    </aside>
  );
}

export default Sidebar;