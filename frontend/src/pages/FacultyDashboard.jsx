import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, 
  ClipboardCheck,
  BookOpen,
  Briefcase, 
  FileText,
  Award,
  ArrowRight,
  LogOut,
  UserCircle,
  ChevronDown,
} from "lucide-react";

import { useCollege } from "../context/CollegeContext";

function FacultyDashboard() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const {
    students,
    attendanceRecords,
    marksRecords,
    drives,
    trainingPrograms,
    applications,
  } = useCollege();

  const stats = useMemo(
    () => [
      {
        title: "Total Students",
        value: students.length,
        description: "Registered students",
        icon: Users,
        iconStyle: "bg-indigo-50 text-indigo-600",
      },
      {
        title: "Attendance Records",
        value: attendanceRecords.length,
        description: "Attendance entries",
        icon: ClipboardCheck,
        iconStyle: "bg-green-50 text-green-600",
      },
      {
        title: "Marks Records",
        value: marksRecords.length,
        description: "Student marks",
        icon: Award,
        iconStyle: "bg-blue-50 text-blue-600",
      },
      {
        title: "Placement Drives",
        value: drives.length,
        description: "Active placement drives",
        icon: Briefcase,
        iconStyle: "bg-purple-50 text-purple-600",
      },
      {
        title: "Training Programs",
        value: trainingPrograms.length,
        description: "Available programs",
        icon: BookOpen,
        iconStyle: "bg-orange-50 text-orange-600",
      },
      {
        title: "Applications",
        value: applications.length,
        description: "Student applications",
        icon: FileText,
        iconStyle: "bg-pink-50 text-pink-600",
      },
    ],
    [
      students,
      attendanceRecords,
      marksRecords,
      drives,
      trainingPrograms,
      applications,
    ]
  );

  const quickActions = [
    {
      title: "Manage Students",
      description: "View and manage student information",
      path: "/students",
      icon: Users,
    },
    {
      title: "Attendance",
      description: "Record and manage student attendance",
      path: "/attendance",
      icon: ClipboardCheck,
    },
    {
      title: "Marks",
      description: "Add and manage student marks",
      path: "/marks",
      icon: Award,
    },
    {
      title: "Placement",
      description: "View placement drives and opportunities",
      path: "/placement",
      icon: Briefcase,
    },
    {
      title: "Training Programs",
      description: "Manage student training programs",
      path: "/training-programs",
      icon: BookOpen,
    },
    {
      title: "Applications",
      description: "Review student applications",
      path: "/applications",
      icon: FileText,
    },
  ];

  const [profileOpen, setProfileOpen] = useState(false);
const profileRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setProfileOpen(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

  return (
    <div className="min-h-screen w-full bg-slate-50">

      {/* Faculty Dashboard Header */}
      <header className="border-b border-slate-200 bg-white px-8 py-5">
        <div className="flex items-center justify-between gap-6">

          {/* Dashboard Information */}
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-wide text-indigo-600">
              FACULTY PORTAL
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Faculty Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Welcome to the faculty management dashboard.
              Monitor students, academics, attendance and placements.
            </p>
          </div>

          {/* Faculty User + Logout */}
          <div
  ref={profileRef}
  className="relative"
>
  <button
    type="button"
    onClick={() =>
      setProfileOpen(
        (previous) => !previous
      )
    }
    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
  >

    {/* Avatar */}
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
      {user?.name
        ?.charAt(0)
        ?.toUpperCase() || "F"}
    </div>

    {/* Name */}
    <div className="hidden text-left sm:block">
      <p className="text-sm font-semibold text-slate-900">
        {user?.name ||
          user?.username ||
          "Faculty User"}
      </p>

      <p className="text-xs text-slate-500">
        Faculty
      </p>
    </div>

    <ChevronDown
      size={18}
      className={`text-slate-400 transition-transform ${
        profileOpen
          ? "rotate-180"
          : ""
      }`}
    />

  </button>

  {/* PROFILE DROPDOWN */}
  {profileOpen && (
    <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

      {/* User Info */}
      <div className="border-b border-slate-100 p-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "F"}
          </div>

          <div className="min-w-0">

            <p className="truncate font-semibold text-slate-900">
              {user?.name ||
                user?.username ||
                "Faculty User"}
            </p>

            <p className="truncate text-xs text-slate-500">
              {user?.email}
            </p>

          </div>

        </div>

      </div>

      {/* Actions */}
      <div className="p-2">

        {/* My Profile */}
        <button
          type="button"
          onClick={() => {
            setProfileOpen(false);
            navigate("/profile");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >

          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <UserCircle
              size={18}
              strokeWidth={2}
            />
          </span>

          <div>
            <p>My Profile</p>

            <p className="text-xs font-normal text-slate-400">
              View your account
            </p>
          </div>

        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={() => {
            setProfileOpen(false);
            logout();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
        >

          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
            <LogOut
              size={18}
              strokeWidth={2}
            />
          </span>

          <div>
            <p>Logout</p>

            <p className="text-xs font-normal text-red-400">
              Sign out of your account
            </p>
          </div>

        </button>

      </div>

    </div>
  )}
</div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="w-full p-8">

        {/* Statistics */}
        <div className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-xl p-3 ${stat.iconStyle}`}
                  >
                    <Icon size={24} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-slate-500">
                      {stat.title}
                    </p>

                    <h2 className="mt-1 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Quickly access frequently used faculty modules.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  to={action.path}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                      <Icon size={24} />
                    </div>

                    <ArrowRight
                      size={20}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                    />
                  </div>

                  <h3 className="mt-5 font-bold text-slate-900">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Academic Overview */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Marks Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Marks Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current examination records
                </p>
              </div>

              <Award
                size={24}
                className="text-indigo-600"
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Total Records
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {marksRecords.length}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-sm text-green-600">
                  Passed
                </p>

                <p className="mt-2 text-2xl font-bold text-green-700">
                  {
                    marksRecords.filter(
                      (mark) => Number(mark.marks) >= 50
                    ).length
                  }
                </p>
              </div>
            </div>

            <Link
              to="/marks"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Manage marks
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Placement Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Placement Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current placement activity
                </p>
              </div>

              <Briefcase
                size={24}
                className="text-purple-600"
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-sm text-purple-600">
                  Drives
                </p>

                <p className="mt-2 text-2xl font-bold text-purple-700">
                  {drives.length}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-sm text-blue-600">
                  Applications
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-700">
                  {applications.length}
                </p>
              </div>
            </div>

           {/* <Link
              to="/placement"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View placement
              <ArrowRight size={16} />
            </Link>*/}
          </div>

        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;