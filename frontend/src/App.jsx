import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";

import Students from "./pages/Students";
import Faculty from "./pages/Faculty";
import Attendance from "./pages/Attendance";
import Marks from "./pages/Marks";
import AdminMarks from "./pages/AdminMarks";
import Placement from "./pages/Placement";
import TrainingPrograms from "./pages/TrainingPrograms";
import Applications from "./pages/Applications";
import Companies from "./pages/Companies";
import FacultyDashboard from "./pages/FacultyDashboard";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import StudentProfile from "./pages/StudentProfile";
import Jobs from "./pages/Jobs";
import StudentTrainingPrograms from "./pages/StudentTrainingPrograms";


function AppLayout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        {/* Page Content */}
        <main className="flex-1">
          <Routes>

            {/* Dashboard */}
            <Route
              path="/"
              element={
                user?.role === "Faculty"
                  ? <FacultyDashboard />
                  : <Dashboard />
              }
            />

            {/* Students */}
            <Route
              path="/students"
              element={<Students />}
            />

            <Route
  path="/profile"
  element={
    user?.role === "Student"
      ? <StudentProfile />
      : <Profile />
  }
/>

<Route
  path="/jobs"
  element={<Jobs />}
/>

            {/* Faculty */}
            <Route
              path="/faculty"
              element={<Faculty />}
            />

            {/* Attendance */}
            <Route
              path="/attendance"
              element={<Attendance />}
            />

            {/* Marks */}
           <Route
  path="/marks"
  element={
    user?.role === "Faculty"
      ? <Marks />
      : <AdminMarks />
  }
/>

            {/* Placement */}
            <Route
              path="/placement"
              element={<Placement />}
            />

            {/* Training */}
            <Route
  path="/training-programs"
  element={
    user?.role === "Student"
      ? <StudentTrainingPrograms />
      : <TrainingPrograms />
  }
/>

            {/* Applications */}
            <Route
              path="/applications"
              element={<Applications />}
            />

            {/* Companies */}
            <Route
              path="/companies"
              element={<Companies />}
            />

            {/* Users */}
            <Route
              path="/users"
              element={<Users />}
            />

          </Routes>
        </main>

      </div>
    </div>
  );
}


function App() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;