import { useAuth } from "../context/AuthContext";
import { useCollege } from "../context/CollegeContext";
import { GraduationCap } from "lucide-react";

function StudentProfile() {
  const { user } = useAuth();
  const { students } = useCollege();

  const student = students.find(
  (item) => Number(item.id) === Number(user?.studentId)
);

  if (!student) {
    return (
      <div className="w-full p-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
  <GraduationCap size={40} strokeWidth={1.8} />
</div>

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Student profile not found
          </h2>

          <p className="mt-2 text-slate-500">
            Your student account is not linked to a student record yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8">

      {/* Heading */}

      <div>
        <p className="text-sm font-semibold text-indigo-600">
          STUDENT PORTAL
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-2 text-slate-500">
          View your academic and personal information.
        </p>
      </div>

      {/* Profile Header */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
  <GraduationCap size={40} strokeWidth={1.8} />
</div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {student.name}
            </h2>

            <p className="mt-1 text-slate-500">
              {student.registerNumber}
            </p>

            <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              {student.status}
            </span>
          </div>

        </div>

      </div>

      {/* Information */}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Personal Information */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-900">
            Personal Information
          </h2>

          <div className="mt-6 space-y-5">

            <div>
              <p className="text-sm text-slate-500">
                Full Name
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {student.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Email
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {student.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Phone
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {student.phone}
              </p>
            </div>

          </div>

        </div>

        {/* Academic Information */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-900">
            Academic Information
          </h2>

          <div className="mt-6 space-y-5">

            <div>
              <p className="text-sm text-slate-500">
                Register Number
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {student.registerNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Department
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {student.department}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Year
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {student.year}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                CGPA
              </p>

              <p className="mt-1 text-2xl font-bold text-indigo-600">
                {student.cgpa}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Skills */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold text-slate-900">
          Skills
        </h2>

        <div className="mt-4 flex flex-wrap gap-2">

          {student.skills
  ? student.skills.split(",").map((skill) => (
      <span
        key={skill.trim()}
        className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600"
      >
        {skill.trim()}
      </span>
    ))
  : (
      <p className="text-sm text-slate-500">
        No skills added yet.
      </p>
    )}

        </div>

      </div>

    </div>
  );
}

export default StudentProfile;