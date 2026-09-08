import { useEffect, useRef, useState } from "react";
import { useCollege } from "../context/CollegeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  GraduationCap,
  Building2,
  FileText,
  Trophy,
  Dumbbell,
  UsersRound,
  BriefcaseBusiness,
  UserCircle,
  ChevronDown,
  Target,
  LogOut,
  CalendarDays,
  ClipboardCheck,
  School
} from "lucide-react";

function Dashboard() {
  const {
    students = [],
    drives = [],
    trainingPrograms = [],
    applications = [],
    marksRecords = [],
    attendanceRecords = [],
    faculty = [],
  } = useCollege();

  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

  const role = user?.role || "Admin";

  const currentStudent = students.find(
  (student) =>
    Number(student.id) === Number(user?.studentId)
);

  // =========================================================
  // ADMIN STATISTICS
  // =========================================================

const companyCount = new Set(
  (drives || [])
    .map((drive) => {
      return (
        drive.company ??
        drive.Company ??
        drive.companyName ??
        drive.CompanyName ??
        drive.companyDetails?.name ??
        drive.CompanyDetails?.name ??
        ""
      );
    })
    .map((company) => String(company).trim().toLowerCase())
    .filter(Boolean)
).size;

  const placedStudents = applications.filter(
    (application) => application.status === "Selected"
  ).length;

  const applicationCount = applications.length;

  const shortlistedCount = applications.filter(
    (application) => application.status === "Shortlisted"
  ).length;

  const interviewCount = applications.filter(
    (application) => application.status === "Interview"
  ).length;

  const selectedCount = applications.filter(
    (application) => application.status === "Selected"
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "Rejected"
  ).length;

  const appliedCount = applications.filter(
    (application) => application.status === "Applied"
  ).length;

  const placementRate =
    students.length > 0
      ? Math.round((placedStudents / students.length) * 100)
      : 0;

  // =========================================================
  // DEPARTMENT STATISTICS
  // =========================================================

  const departmentCounts = students.reduce((result, student) => {
    const department = student.department || "Unknown";

    result[department] = (result[department] || 0) + 1;

    return result;
  }, {});

  const departmentData = Object.entries(departmentCounts);

  const maxDepartmentCount =
    departmentData.length > 0
      ? Math.max(...departmentData.map((item) => item[1]))
      : 1;

  // =========================================================
  // STATUS CHART
  // =========================================================

  const applicationStatuses = [
    {
      label: "Applied",
      value: appliedCount,
      className: "bg-slate-400",
    },
    {
      label: "Shortlisted",
      value: shortlistedCount,
      className: "bg-blue-500",
    },
    {
      label: "Interview",
      value: interviewCount,
      className: "bg-purple-500",
    },
    {
      label: "Selected",
      value: selectedCount,
      className: "bg-green-500",
    },
    {
      label: "Rejected",
      value: rejectedCount,
      className: "bg-red-500",
    },
  ];

  // =========================================================
  // RECENT APPLICATIONS
  // =========================================================

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.appliedDate) -
        new Date(a.appliedDate)
    )
    .slice(0, 5);

  // =========================================================
  // RECENT ACTIVITIES
  // =========================================================

  const recentActivities = [
    ...students.slice(-3).map((student) => ({
      title: "Student registered",
      description: `${student.name} has been added to student records.`,
      icon: <GraduationCap size={20} />,
    })),

    ...drives.slice(-3).map((drive) => ({
      title: "Placement drive created",
      description: `${drive.company} - ${drive.role}`,
      icon: <Target size={20} />,
    })),

    ...trainingPrograms.slice(-3).map((program) => ({
      title: "Training program added",
      description: `${program.name} is now available.`,
      icon: <Dumbbell size={20} />,
    })),

    ...applications.slice(-3).map((application) => ({
      title: "Application received",
      description: `${application.student || "Student"} applied for ${
        application.company || "a company"
      }.`,
      icon: <FileText size={20} />,
    })),
  ].slice(-6);

  // =========================================================
  // ROLE DASHBOARDS
  // =========================================================

  const dashboardData = {
    Admin: {
      title: "Welcome back, Admin 👋",
      description:
        "Monitor and manage your college activities from one place.",
    },

    Faculty: {
      title: "Welcome back, Faculty 👨‍🏫",
      description:
        "Manage your students, attendance and academic performance.",
    },

    "Placement Officer": {
      title: "Welcome back, Placement Officer 💼",
      description:
        "Manage companies, placement drives and student selections.",
    },

    Trainer: {
      title: "Welcome back, Trainer 🏋️",
      description:
        "Manage training programs and student performance.",
    },

    Student: {
      title: "Welcome back, Student 🎓",
      description:
        "Track your profile, jobs, applications and training.",
    },
  };

  const currentDashboard =
    dashboardData[role] || dashboardData.Admin;

  // =========================================================
  // NON-ADMIN DASHBOARD
  // =========================================================

  // =========================================================
// FACULTY DASHBOARD STATISTICS
// =========================================================

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split("T")[0];

// Attendance records for today
const todayAttendance = attendanceRecords.filter(
  (record) => {
    if (!record.date) return false;

    return record.date.split("T")[0] === today;
  }
);

// Present students today
const presentCount = todayAttendance.filter(
  (record) =>
    record.status?.toLowerCase() === "present"
).length;

// Attendance percentage
const attendancePercentage =
  todayAttendance.length > 0
    ? Math.round(
        (presentCount / todayAttendance.length) * 100
      )
    : 0;

// Total marks records
const totalMarksUpdated = marksRecords.length;

// Recent attendance records
const recentAttendance = [...attendanceRecords]
  .sort(
    (a, b) =>
      new Date(b.date) - new Date(a.date)
  )
  .slice(0, 5);

// Recent marks records
const recentMarks = [...marksRecords]
  .slice(-5)
  .reverse();

  // =========================================================
// FACULTY DASHBOARD
// =========================================================

if (role === "Faculty") {

  const facultyStats = [
    {
      title: "Total Students",
      value: students.length,
      icon: <GraduationCap size={22} strokeWidth={2} />,
      bg: "bg-indigo-100",
      color: "text-indigo-600",
    },
    {
      title: "Attendance Today",
      value: `${attendancePercentage}%`,
      icon: <CalendarDays size={22} strokeWidth={2} />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Marks Updated",
      value: totalMarksUpdated,
      icon: <ClipboardCheck size={22} strokeWidth={2} />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Classes Assigned",
      value: "4",
      icon: <School size={22} strokeWidth={2} />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="w-full bg-slate-50 p-8">

      {/* HEADER */}

<header className="border-b-2 border-slate-300 bg-white px-8 py-5 shadow-sm">
  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

    {/* Dashboard Information */}
    <div className="min-w-0">

      <p className="text-sm font-bold tracking-widest text-indigo-600">
        ADMIN DASHBOARD
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        Welcome back, {user?.name || "Admin"}
      </h1>

      <p className="mt-2 text-slate-500">
        Manage students, faculty, academics, placements and training.
      </p>

    </div>

    {/* Profile */}
    <div
      ref={profileRef}
      className="relative"
    >

      <button
        type="button"
        onClick={() =>
          setProfileOpen((previous) => !previous)
        }
        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
      >

        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
          {user?.name
            ?.charAt(0)
            ?.toUpperCase() || "A"}
        </div>

        {/* Name + Role */}
        <div className="hidden text-left sm:block">

          <p className="text-sm font-semibold text-slate-900">
            {user?.name || "Admin User"}
          </p>

          <p className="text-xs text-slate-500">
            {user?.role || "Admin"}
          </p>

        </div>

        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform ${
            profileOpen ? "rotate-180" : ""
          }`}
        />

      </button>

      {/* Profile Dropdown */}
      {profileOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

          {/* User Information */}
          <div className="border-b border-slate-100 p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "A"}
              </div>

              <div className="min-w-0">

                <p className="truncate font-semibold text-slate-900">
                  {user?.name || "Admin User"}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {user?.email || "admin@college.com"}
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



      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {facultyStats.map((stat) => (

          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >

            <div className="flex items-start justify-between">

              <div>

                <div className="flex items-center gap-4">
                <div
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-xl"
              >
                {stat.icon}
              </div>

                <p className="text-sm text-slate-500">
                  {stat.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold ">
                  {stat.value}
                </h2>
              </div>           
            </div>

          </div>
          </div>

        ))}

      </div>


      {/* =====================================================
          MAIN SECTION
      ====================================================== */}

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">


        {/* TODAY'S ATTENDANCE */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Today's Attendance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Student attendance overview
              </p>

            </div>

            <div className="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600">

              {todayAttendance.length} Records

            </div>

          </div>


          {/* Attendance Percentage */}

          <div className="mt-8 flex items-center gap-6">

            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-8 border-indigo-100">

              <div className="text-center">

                <p className="text-3xl font-bold text-indigo-600">
                  {attendancePercentage}%
                </p>

                <p className="text-xs text-slate-500">
                  Present
                </p>

              </div>

            </div>


            <div className="flex-1 space-y-4">

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500">
                  Present
                </span>

                <span className="font-bold text-green-600">
                  {presentCount}
                </span>

              </div>


              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500">
                  Absent
                </span>

                <span className="font-bold text-red-600">

                  {todayAttendance.length - presentCount}

                </span>

              </div>


              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500">
                  Total Records
                </span>

                <span className="font-bold text-slate-900">
                  {todayAttendance.length}
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* MARKS OVERVIEW */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Academic Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Student marks records overview
              </p>

            </div>

            <div className="rounded-xl bg-green-50 px-3 py-2 text-sm font-semibold text-green-600">

              {marksRecords.length} Records

            </div>

          </div>


          <div className="mt-8">

            <div className="flex items-end justify-between">

              <div>

                <p className="text-4xl font-bold text-indigo-600">

                  {marksRecords.length}

                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Total marks records
                </p>

              </div>

              <ClipboardCheck
                size={48}
                className="text-indigo-200"
              />

            </div>


            <div className="mt-8 border-t border-slate-100 pt-6">

              <p className="text-sm font-semibold text-slate-700">
                Quick Summary
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs text-slate-500">
                    Students
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {students.length}
                  </p>

                </div>


                <div className="rounded-xl bg-indigo-50 p-4">

                  <p className="text-xs text-indigo-600">
                    Marks Records
                  </p>

                  <p className="mt-1 text-xl font-bold text-indigo-700">
                    {marksRecords.length}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          RECENT ACTIVITY
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">


        {/* RECENT ATTENDANCE */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Recent Attendance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest attendance records
              </p>

            </div>

            <CalendarDays
              size={22}
              className="text-indigo-600"
            />

          </div>


          <div className="mt-5 space-y-3">

            {recentAttendance.length === 0 ? (

              <p className="py-6 text-center text-sm text-slate-500">
                No attendance records available.
              </p>

            ) : (

              recentAttendance.map((record) => {

                const student = students.find(
                  (item) =>
                    Number(item.id) ===
                    Number(record.studentId)
                );

                return (

                  <div
                    key={record.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
                  >

                    <div>

                      <p className="font-semibold text-slate-900">

                        {student?.name ||
                          `Student ID: ${record.studentId}`}

                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {record.date}
                      </p>

                    </div>


                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        record.status
                          ?.toLowerCase() === "present"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >

                      {record.status}

                    </span>

                  </div>

                );

              })

            )}

          </div>

        </div>


        {/* RECENT MARKS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Recent Marks
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Recently updated student marks
              </p>

            </div>

            <ClipboardCheck
              size={22}
              className="text-green-600"
            />

          </div>


          <div className="mt-5 space-y-3">

            {recentMarks.length === 0 ? (

              <p className="py-6 text-center text-sm text-slate-500">
                No marks records available.
              </p>

            ) : (

              recentMarks.map((mark) => {

                const student = students.find(
                  (item) =>
                    Number(item.id) ===
                    Number(mark.studentId)
                );

                return (

                  <div
                    key={mark.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
                  >

                    <div>

                      <p className="font-semibold text-slate-900">

                        {student?.name ||
                          `Student ID: ${mark.studentId}`}

                      </p>

                      <p className="mt-1 text-xs text-slate-500">

                        {mark.subject || "Subject"}

                      </p>

                    </div>


                    <div className="text-right">

                      <p className="text-lg font-bold text-indigo-600">

                        {mark.marks ??
                          mark.score ??
                          "-"}

                      </p>

                      <p className="text-xs text-slate-400">
                        Marks
                      </p>

                    </div>

                  </div>

                );

              })

            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div>

          <h2 className="text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Frequently used faculty modules
          </p>

        </div>


        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">


          <button
            onClick={() => navigate("/students")}
            className="rounded-xl border border-slate-200 p-5 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
          >

            <GraduationCap
              size={24}
              className="text-indigo-600"
            />

            <p className="mt-3 font-semibold text-slate-900">
              Students
            </p>

            <p className="mt-1 text-xs text-slate-500">
              View student records
            </p>

          </button>


          <button
            onClick={() => navigate("/attendance")}
            className="rounded-xl border border-slate-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50"
          >

            <CalendarDays
              size={24}
              className="text-blue-600"
            />

            <p className="mt-3 font-semibold text-slate-900">
              Attendance
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Manage student attendance
            </p>

          </button>


          <button
            onClick={() => navigate("/marks")}
            className="rounded-xl border border-slate-200 p-5 text-left transition hover:border-green-300 hover:bg-green-50"
          >

            <ClipboardCheck
              size={24}
              className="text-green-600"
            />

            <p className="mt-3 font-semibold text-slate-900">
              Marks
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Update student marks
            </p>

          </button>


          <button
            onClick={() => navigate("/profile")}
            className="rounded-xl border border-slate-200 p-5 text-left transition hover:border-purple-300 hover:bg-purple-50"
          >

            <UserCircle
              size={24}
              className="text-purple-600"
            />

            <p className="mt-3 font-semibold text-slate-900">
              My Profile
            </p>

            <p className="mt-1 text-xs text-slate-500">
              View your account
            </p>

          </button>

        </div>

      </div>

    </div>
  );
}

if (role === "Student") {
  const studentMarks = marksRecords.filter(
    (mark) =>
      Number(mark.studentId) === Number(user?.studentId)
  );

  const studentApplications = applications.filter(
    (application) =>
      Number(application.studentId) === Number(user?.studentId)
  );

  const studentAttendance = attendanceRecords.filter(
    (attendance) =>
      Number(attendance.studentId) === Number(user?.studentId)
  );

  const averageMarks =
    studentMarks.length > 0
      ? Math.round(
          studentMarks.reduce(
            (total, mark) => total + Number(mark.marks || 0),
            0
          ) / studentMarks.length
        )
      : 0;

  const attendancePercentage =
    studentAttendance.length > 0
      ? Math.round(
          (studentAttendance.filter(
            (attendance) =>
              attendance.status === "Present"
          ).length /
            studentAttendance.length) *
            100
        )
      : 0;

  return (
    <div className="w-full bg-slate-50">

      {/* ================= HEADER ================= */}
      <header className="border-b border-slate-200 bg-white px-8 py-5">
        <div className="flex items-center justify-between gap-6">

          {/* Left */}
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-wide text-indigo-600">
              STUDENT PORTAL
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Student Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Welcome to your student management dashboard.
            </p>
          </div>

          {/* Right - Profile */}
          <div ref={profileRef} className="relative">

            <button
              type="button"
              onClick={() =>
                setProfileOpen((previous) => !previous)
              }
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                {user?.name?.charAt(0)?.toUpperCase() || "S"}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.name || user?.username || "Student User"}
                </p>

                <p className="text-xs text-slate-500">
                  Student
                </p>
              </div>

              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                <div className="border-b border-slate-100 p-4">
                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                      {user?.name?.charAt(0)?.toUpperCase() || "S"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {user?.name || user?.username || "Student User"}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {user?.email}
                      </p>
                    </div>

                  </div>
                </div>

                <div className="p-2">

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <UserCircle size={18} strokeWidth={2} />
                    </span>

                    <div>
                      <p>My Profile</p>

                      <p className="text-xs font-normal text-slate-400">
                        View your account
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
                      <LogOut size={18} strokeWidth={2} />
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

      {/* ================= DASHBOARD ================= */}
      <div className="p-8">

        {/* Welcome Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <GraduationCap
                  size={30}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Welcome,{" "}
                  {currentStudent?.name ||
                    user?.name ||
                    user?.username ||
                    "Student"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Here's an overview of your academic and
                  placement activities.
                </p>
              </div>

            </div>

            {currentStudent?.registerNumber && (
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium text-slate-500">
                  Register Number
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {currentStudent.registerNumber}
                </p>
              </div>
            )}

          </div>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Attendance */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Attendance
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {attendancePercentage}%
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Overall attendance
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <ClipboardCheck size={24} />
              </div>

            </div>
          </div>

          {/* Marks */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Average Marks
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {averageMarks}%
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {studentMarks.length} subject
                  {studentMarks.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <FileText size={24} />
              </div>

            </div>
          </div>

          {/* Placement Drives */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Placement Drives
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {drives.length}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Available opportunities
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <BriefcaseBusiness size={24} />
              </div>

            </div>
          </div>

          {/* Applications */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Applications
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {studentApplications.length}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Jobs applied
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Target size={24} />
              </div>

            </div>
          </div>

        </div>

        {/* ================= LOWER SECTION ================= */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Academic Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <School size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Academic Overview
                </h2>

                <p className="text-sm text-slate-500">
                  Your current academic information
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Department
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {currentStudent?.department || "Not available"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Year
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {currentStudent?.year || "Not available"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  CGPA
                </p>

                <p className="mt-1 text-xl font-bold text-indigo-600">
                  {currentStudent?.cgpa ?? "N/A"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Register Number
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {currentStudent?.registerNumber || "N/A"}
                </p>
              </div>

            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Target size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Quick Actions
                </h2>

                <p className="text-sm text-slate-500">
                  Quickly access your student services
                </p>
              </div>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                <UserCircle
                  size={22}
                  className="text-indigo-600"
                />

                <p className="mt-3 text-sm font-semibold text-slate-900">
                  My Profile
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  View your details
                </p>
              </button>

              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
              >
                <BriefcaseBusiness
                  size={22}
                  className="text-blue-600"
                />

                <p className="mt-3 text-sm font-semibold text-slate-900">
                  Jobs
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Explore opportunities
                </p>
              </button>

              <button
                type="button"
                onClick={() => navigate("/applications")}
                className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-purple-300 hover:bg-purple-50"
              >
                <FileText
                  size={22}
                  className="text-purple-600"
                />

                <p className="mt-3 text-sm font-semibold text-slate-900">
                  Applications
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Track your applications
                </p>
              </button>

              <button
                type="button"
                onClick={() => navigate("/training-programs")}
                className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-orange-300 hover:bg-orange-50"
              >
                <Dumbbell
                  size={22}
                  className="text-orange-600"
                />

                <p className="mt-3 text-sm font-semibold text-slate-900">
                  Training
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  View training programs
                </p>
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

  // =========================================================
  // ADMIN DASHBOARD
  // =========================================================

  return (
    <div className="w-full bg-slate-50 p-8">

      {/* =====================================================
          ADMIN HEADER
      ====================================================== */}

    <header className="border-b border-slate-200 bg-white px-8 py-5">
  <div className="flex items-center justify-between gap-6">

    {/* Dashboard Information */}
    <div className="min-w-0">
      <p className="text-sm font-semibold tracking-wide text-indigo-600">
        ADMIN PORTAL
      </p>

      <h1 className="mt-1 text-2xl font-bold text-slate-900">
        Admin Dashboard
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        Welcome to the admin management dashboard.
        Monitor students, faculty, academics, attendance, placements and training.
      </p>
    </div>

    {/* Admin User + Logout */}
    <div
      ref={profileRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setProfileOpen((previous) => !previous)
        }
        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
      >

        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
          {user?.name
            ?.charAt(0)
            ?.toUpperCase() || "A"}
        </div>

        {/* Name */}
        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold text-slate-900">
            {user?.name ||
              user?.username ||
              "Admin User"}
          </p>

          <p className="text-xs text-slate-500">
            Admin
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
                  ?.toUpperCase() || "A"}
              </div>

              <div className="min-w-0">

                <p className="truncate font-semibold text-slate-900">
                  {user?.name ||
                    user?.username ||
                    "Admin User"}
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

      {/* =====================================================
          KPI CARDS
      ====================================================== */}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">

        {/* Students */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-xl">
              <GraduationCap size={22} strokeWidth={2} />
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Total Students
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {students.length}
          </h2>

        </div>

        {/* Companies */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
              <Building2 size={22} strokeWidth={2} />
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Companies
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {companyCount}
          </h2>

        </div>

        {/* Applications */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-xl">
              <FileText size={22} strokeWidth={2} />
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Applications
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {applicationCount}
          </h2>

        </div>

        {/* Placed */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl">
              <Trophy size={22} strokeWidth={2} />
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Students Placed
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {placedStudents}
          </h2>

        </div>

        {/* Training */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-xl">
              <Dumbbell size={22} strokeWidth={2} />
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Training Programs
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {trainingPrograms.length}
          </h2>

        </div>

      </div>

      {/* =====================================================
          MAIN ANALYTICS AREA
      ====================================================== */}

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* =================================================
            APPLICATION STATUS
        ================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Application Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Placement application overview
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600">
              {applicationCount} Total
            </div>

          </div>

          {/* Pie-style chart */}

          <div className="mt-8 flex justify-center">

            <div
              className="relative flex h-52 w-52 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(
                  #64748b 0% ${
                    applicationCount
                      ? (appliedCount / applicationCount) * 100
                      : 0
                  }%,
                  #3b82f6 0% ${
                    applicationCount
                      ? ((appliedCount + shortlistedCount) /
                          applicationCount) *
                        100
                      : 0
                  }%,
                  #8b5cf6 0% ${
                    applicationCount
                      ? ((appliedCount +
                          shortlistedCount +
                          interviewCount) /
                          applicationCount) *
                        100
                      : 0
                  }%,
                  #22c55e 0% ${
                    applicationCount
                      ? ((appliedCount +
                          shortlistedCount +
                          interviewCount +
                          selectedCount) /
                          applicationCount) *
                        100
                      : 0
                  }%,
                  #ef4444 0% 100%
                )`,
              }}
            >

              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">

                <span className="text-3xl font-bold text-slate-900">
                  {applicationCount}
                </span>

                <span className="text-xs text-slate-500">
                  Applications
                </span>

              </div>

            </div>

          </div>

          {/* Legend */}

          <div className="mt-7 space-y-3">

            {applicationStatuses.map((status) => (

              <div
                key={status.label}
                className="flex items-center justify-between"
              >

                <div className="flex items-center gap-3">

                  <span
                    className={`h-3 w-3 rounded-full ${status.className}`}
                  />

                  <span className="text-sm text-slate-600">
                    {status.label}
                  </span>

                </div>

                <span className="text-sm font-bold text-slate-900">
                  {status.value}
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* =================================================
            DEPARTMENT BAR CHART
        ================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Students by Department
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Student distribution across departments
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600">
              {students.length} Students
            </div>

          </div>

          <div className="mt-8 space-y-6">

            {departmentData.length === 0 ? (

              <div className="py-10 text-center text-sm text-slate-500">
                No department data available.
              </div>

            ) : (

              departmentData.map(
                ([department, count]) => {

                  const percentage =
                    (count / maxDepartmentCount) * 100;

                  return (
                    <div key={department}>

                      <div className="mb-2 flex items-center justify-between">

                        <span className="text-sm font-semibold text-slate-700">
                          {department}
                        </span>

                        <span className="text-sm font-bold text-slate-900">
                          {count}
                        </span>

                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                }
              )

            )}

          </div>

          {/* Department summary */}

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">

            {departmentData
              .slice(0, 4)
              .map(([department, count]) => (

                <div
                  key={department}
                  className="rounded-xl bg-slate-50 p-4"
                >

                  <p className="truncate text-xs text-slate-500">
                    {department}
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {count}
                  </p>

                </div>

              ))}

          </div>

        </div>

      </div>

      {/* =====================================================
          SECONDARY ANALYTICS
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Placement Performance */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Placement Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Overall placement progress
          </p>

          <div className="mt-6">

            <div className="flex items-end justify-between">

              <div>
                <p className="text-4xl font-bold text-indigo-600">
                  {placementRate}%
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Placement rate
                </p>
              </div>

              <span className="text-sm font-semibold text-green-600">
                {placedStudents} placed
              </span>

            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                style={{
                  width: `${placementRate}%`,
                }}
              />

            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs text-green-600">
                  Selected
                </p>

                <p className="mt-1 text-xl font-bold text-green-700">
                  {selectedCount}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs text-blue-600">
                  Shortlisted
                </p>

                <p className="mt-1 text-xl font-bold text-blue-700">
                  {shortlistedCount}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Placement Drives */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Placement Drives
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current opportunities
              </p>
            </div>

            <span className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-600">
              {drives.length}
            </span>

          </div>

          <div className="mt-5 space-y-3">

            {drives.length === 0 ? (

              <p className="py-6 text-center text-sm text-slate-500">
                No placement drives available.
              </p>

            ) : (

              drives.slice(-5).reverse().map((drive) => (

                <div
                  key={drive.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-3"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                      <Building2 size={22} strokeWidth={2} />
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-slate-900">
                        {drive.company}
                      </p>

                      <p className="text-xs text-slate-500">
                        {drive.role}
                      </p>

                    </div>

                  </div>

                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                    {drive.status || "Active"}
                  </span>

                </div>

              ))

            )}

          </div>

        </div>

        {/* Training */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Training Programs
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current programs
              </p>
            </div>

            <span className="rounded-xl bg-orange-50 px-3 py-2 text-sm font-bold text-orange-600">
              {trainingPrograms.length}
            </span>

          </div>

          <div className="mt-5 space-y-3">

            {trainingPrograms.length === 0 ? (

              <p className="py-6 text-center text-sm text-slate-500">
                No training programs available.
              </p>

            ) : (

              trainingPrograms
                .slice(-5)
                .reverse()
                .map((program) => (

                  <div
                    key={program.id}
                    className="rounded-xl border border-slate-100 p-3"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                        <Dumbbell size={22} strokeWidth={2} />
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-slate-900">
                          {program.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {program.duration || "Training Program"}
                        </p>

                      </div>

                    </div>

                  </div>

                ))

            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          RECENT APPLICATIONS + ACTIVITIES
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Recent Applications */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Applications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest placement applications
              </p>
            </div>

            <span className="text-sm font-semibold text-indigo-600">
              View all →
            </span>

          </div>

          <div className="mt-5 overflow-x-auto">

            {recentApplications.length === 0 ? (

              <p className="py-8 text-center text-sm text-slate-500">
                No applications available.
              </p>

            ) : (

              <table className="w-full">

                <thead>

                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">

                    <th className="pb-3">
                      Student
                    </th>

                    <th className="pb-3">
                      Company
                    </th>

                    <th className="pb-3">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentApplications.map(
                    (application) => (

                      <tr
                        key={application.id}
                        className="border-b border-slate-50"
                      >

                        <td className="py-4">

                          <p className="text-sm font-semibold text-slate-900">
                            {application.student ||
                              "Unknown Student"}
                          </p>

                          <p className="text-xs text-slate-400">
                            {application.registerNumber ||
                              "-"}
                          </p>

                        </td>

                        <td className="py-4">

                          <p className="text-sm font-medium text-slate-700">
                            {application.company ||
                              "-"}
                          </p>

                          <p className="text-xs text-slate-400">
                            {application.role || "-"}
                          </p>

                        </td>

                        <td className="py-4">

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              application.status ===
                              "Selected"
                                ? "bg-green-100 text-green-700"
                                : application.status ===
                                  "Rejected"
                                ? "bg-red-100 text-red-700"
                                : application.status ===
                                  "Shortlisted"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {application.status ||
                              "Applied"}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            )}

          </div>

        </div>

        {/* Recent Activities */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Activities
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest system activity
            </p>
          </div>

          <div className="mt-5 space-y-4">

            {recentActivities.length === 0 ? (

              <p className="py-8 text-center text-sm text-slate-500">
                No recent activities.
              </p>

            ) : (

              recentActivities.map(
                (activity, index) => (

                  <div
                    key={`${activity.title}-${index}`}
                    className="flex gap-4"
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      {activity.icon}
                    </div>

                    <div className="min-w-0">

                      <p className="text-sm font-semibold text-slate-900">
                        {activity.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {activity.description}
                      </p>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Frequently used administration modules
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">

          <button className="group rounded-xl border border-slate-200 p-5 text-left transition hover:border-indigo-300 hover:bg-indigo-50">

            <div className="text-2xl">
              <GraduationCap size={22} strokeWidth={2} />
            </div>

            <p className="mt-3 font-semibold text-slate-900">
              Students
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Manage student records
            </p>

          </button>

          <button className="group rounded-xl border border-slate-200 p-5 text-left transition hover:border-indigo-300 hover:bg-indigo-50">

            <div className="text-2xl">
              <UsersRound size={22} strokeWidth={2} />
            </div>

            <p className="mt-3 font-semibold text-slate-900">
              Faculty
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Manage faculty records
            </p>

          </button>

          <button className="group rounded-xl border border-slate-200 p-5 text-left transition hover:border-indigo-300 hover:bg-indigo-50">

            <div className="text-2xl">
              <BriefcaseBusiness size={22} strokeWidth={2} />
            </div>

            <p className="mt-3 font-semibold text-slate-900">
              Placement
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Manage placement drives
            </p>

          </button>

          <button className="group rounded-xl border border-slate-200 p-5 text-left transition hover:border-indigo-300 hover:bg-indigo-50">

            <div className="text-2xl">
              <Dumbbell size={22} strokeWidth={2} />
            </div>

            <p className="mt-3 font-semibold text-slate-900">
              Training
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Manage training programs
            </p>

          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;