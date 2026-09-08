import { useState, useEffect } from "react";
import {
  Search,
  GraduationCap,
  CalendarDays,
  Users,
  Clock,
  CheckCircle,
  X,
  Play,
  Award,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCollege } from "../context/CollegeContext";

function StudentTrainingPrograms() {
  const { user } = useAuth();

const {
  students,
  trainingPrograms: programs,
  trainingProgramsLoading,
  trainingProgramsError,
  applyTraining,
  getStudentTrainingApps,
} = useCollege();

  const [search, setSearch] = useState("");
  const [viewingProgram, setViewingProgram] = useState(null);
  const [trainingApplications, setTrainingApplications] =
  useState([]);

const [applying, setApplying] = useState(false);

const [applicationMessage, setApplicationMessage] =
  useState("");

  // --------------------------------------------------
  // CURRENT STUDENT
  // --------------------------------------------------

  const currentStudent = students.find(
    (student) =>
      Number(student.id) === Number(user?.studentId)
  );

  // --------------------------------------------------
  // FILTER PROGRAMS
  // --------------------------------------------------

  const availablePrograms = (programs || []).filter(
    (program) => {
      const status = String(
        program.status || "Active"
      )
        .trim()
        .toLowerCase();

      const isAvailable =
        status === "active" ||
        status === "ongoing" ||
        status === "available";

      const searchText = `
        ${program.name || ""}
        ${program.trainer || ""}
        ${program.duration || ""}
      `.toLowerCase();

      return (
        isAvailable &&
        searchText.includes(
          search.toLowerCase()
        )
      );
    }
  );

  // --------------------------------------------------
  // SUMMARY
  // --------------------------------------------------

  const totalPrograms =
    availablePrograms.length;

  const totalParticipants =
    availablePrograms.reduce(
      (total, program) =>
        total +
        Number(program.students || 0),
      0
    );

    useEffect(() => {
  const loadApplications = async () => {
    if (!user?.studentId) {
      return;
    }

    try {
      const applications =
        await getStudentTrainingApps(
          user.studentId
        );

      setTrainingApplications(
        applications || []
      );
    } catch (error) {
      console.error(
        "Failed to load training applications:",
        error
      );
    }
  };

  loadApplications();
}, [
  user?.studentId,
  getStudentTrainingApps,
]);

  // --------------------------------------------------
  // DATE FORMAT
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (
      Number.isNaN(parsedDate.getTime())
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (trainingProgramsLoading) {
    return (
      <div className="w-full p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

            <p className="text-sm font-medium text-slate-600">
              Loading training programs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (trainingProgramsError) {
    return (
      <div className="w-full p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-600">
          {trainingProgramsError}
        </div>
      </div>
    );
  }

  const hasApplied = (programId) => {
  return trainingApplications.some(
    (application) =>
      Number(application.trainingProgramId) ===
        Number(programId) &&
      !application.isDeleted
  );
};

  return (
    <div className="w-full bg-slate-50 p-8">

      {/* ------------------------------------------------
          HEADER
      ------------------------------------------------ */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <p className="text-sm font-semibold text-indigo-600">
            STUDENT PORTAL
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Training Programs
          </h1>

          <p className="mt-2 text-slate-500">
            Explore training programs and improve
            your skills.
          </p>
        </div>

      </div>

      {/* ------------------------------------------------
          SUMMARY CARDS
      ------------------------------------------------ */}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">

        {/* Available Programs */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <GraduationCap size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Available Programs
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {totalPrograms}
              </h2>
            </div>

          </div>
        </div>

        {/* Participants */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <Users size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Current Participants
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {totalParticipants}
              </h2>
            </div>

          </div>
        </div>

      </div>

      {/* ------------------------------------------------
          SEARCH
      ------------------------------------------------ */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="relative w-full lg:max-w-md">

          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search training programs or trainers..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

        </div>

      </div>

      {/* ------------------------------------------------
          PROGRAM LIST
      ------------------------------------------------ */}

      {availablePrograms.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <GraduationCap size={30} />
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-900">
            No training programs available
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            {search
              ? "No training programs match your search."
              : "There are currently no active training programs."}
          </p>

        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-6 xl:grid-cols-2">

          {availablePrograms.map(
            (program) => {

              const completion =
                Number(
                  program.completion || 0
                );

              return (
                <div
                  key={program.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >

                  {/* PROGRAM HEADER */}

                  <div className="border-b border-slate-100 p-6">

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex min-w-0 items-center gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                          <GraduationCap
                            size={27}
                          />
                        </div>

                        <div className="min-w-0">

                          <h2 className="text-lg font-bold text-slate-900">
                            {program.name}
                          </h2>

                          <p className="mt-1 text-sm font-medium text-indigo-600">
                            Trainer:{" "}
                            {program.trainer}
                          </p>

                        </div>

                      </div>

                      <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Active
                      </span>

                    </div>

                  </div>

                  {/* PROGRAM DETAILS */}

                  <div className="grid grid-cols-2 gap-4 p-6">

                    <div className="flex items-center gap-3">

                      <Clock
                        size={18}
                        className="text-slate-400"
                      />

                      <div>
                        <p className="text-xs text-slate-400">
                          Duration
                        </p>

                        <p className="text-sm font-semibold text-slate-700">
                          {program.duration ||
                            "Not specified"}
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      <CalendarDays
                        size={18}
                        className="text-slate-400"
                      />

                      <div>
                        <p className="text-xs text-slate-400">
                          Start Date
                        </p>

                        <p className="text-sm font-semibold text-slate-700">
                          {formatDate(
                            program.startDate
                          )}
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      <Users
                        size={18}
                        className="text-slate-400"
                      />

                      <div>
                        <p className="text-xs text-slate-400">
                          Students
                        </p>

                        <p className="text-sm font-semibold text-slate-700">
                          {program.students ||
                            0}
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      <Award
                        size={18}
                        className="text-slate-400"
                      />

                      <div>
                        <p className="text-xs text-slate-400">
                          Completion
                        </p>

                        <p className="text-sm font-semibold text-slate-700">
                          {completion}%
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* PROGRESS */}

                  <div className="px-6 pb-5">

                    <div className="mb-1 flex justify-between text-xs">

                      <span className="text-slate-500">
                        Program Progress
                      </span>

                      <span className="font-semibold text-indigo-600">
                        {completion}%
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all"
                        style={{
                          width: `${completion}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTION */}

                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">

                    <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                      <CheckCircle
                        size={17}
                      />
                      Enrollment Open
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setViewingProgram(
                          program
                        )
                      }
                      className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      View & Apply
                    </button>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

      {/* ------------------------------------------------
          VIEW / APPLY MODAL
      ------------------------------------------------ */}

      {viewingProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Training Program
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Program details and enrollment
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setViewingProgram(null)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* CONTENT */}

            <div className="space-y-5 p-6">

              <div className="rounded-2xl bg-indigo-50 p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600">
                    <GraduationCap
                      size={25}
                    />
                  </div>

                  <div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {viewingProgram.name}
                    </h3>

                    <p className="text-sm text-indigo-600">
                      {viewingProgram.trainer}
                    </p>

                  </div>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Duration
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {viewingProgram.duration ||
                      "-"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Start Date
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {formatDate(
                      viewingProgram.startDate
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Students
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {viewingProgram.students ||
                      0}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Status
                  </p>

                  <p className="mt-1 font-semibold text-green-600">
                    Active
                  </p>
                </div>

              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Program Progress
                </p>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{
                      width: `${Number(
                        viewingProgram.completion ||
                          0
                      )}%`,
                    }}
                  />

                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {Number(
                    viewingProgram.completion ||
                      0
                  )}
                  % completed
                </p>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">

                <p className="text-sm font-semibold text-indigo-900">
                  About this program
                </p>

                <p className="mt-1 text-sm leading-6 text-indigo-700">
                  This training program is available
                  for students who want to improve their
                  technical and professional skills.
                </p>

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setViewingProgram(null)
                }
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>

              <button
  type="button"
  disabled={
    applying ||
    hasApplied(viewingProgram.id)
  }
  onClick={async () => {
    if (!currentStudent) {
      setApplicationMessage(
        "Student profile could not be found."
      );
      return;
    }

    if (hasApplied(viewingProgram.id)) {
      setApplicationMessage(
        "You have already applied for this training program."
      );
      return;
    }

    try {
      setApplying(true);
      setApplicationMessage("");

      const application =
        await applyTraining(
          currentStudent.id,
          viewingProgram.id
        );

      setTrainingApplications(
        (previous) => [
          ...previous,
          application,
        ]
      );

      setApplicationMessage(
        "Application submitted successfully."
      );
    } catch (error) {
      setApplicationMessage(
        error.message ||
          "Failed to submit application."
      );
    } finally {
      setApplying(false);
    }
  }}
  className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
>
  {applying
    ? "Applying..."
    : hasApplied(viewingProgram.id)
      ? "Already Applied"
      : "Apply Now"}
</button>

            </div>
            {applicationMessage && (
  <p className="mt-3 text-sm font-medium text-slate-600">
    {applicationMessage}
  </p>
)}

          </div>

        </div>
      )}

    </div>
  );
}

export default StudentTrainingPrograms;