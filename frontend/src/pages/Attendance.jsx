import { useEffect, useState } from "react";
import { useCollege } from "../context/CollegeContext";
import {  ChevronLeft, GraduationCap, UserCheck, UserX, ChevronRight} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Attendance() {

  const { user } = useAuth(); 
  const {
    students,
    attendanceRecords,
    attendanceLoading,
    attendanceError,
    addAttendance,
    editAttendance,
  } = useCollege();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendance, setAttendance] = useState({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [selectedStudents, setSelectedStudents] = useState([]);

  // --------------------------------------------------
  // CREATE DEFAULT ATTENDANCE
  // --------------------------------------------------

  const createDefaultAttendance = () => {
    const newAttendance = {};

    students.forEach((student) => {
      newAttendance[student.id] = "Present";
    });

    return newAttendance;
  };

  // --------------------------------------------------
  // LOAD ATTENDANCE FOR SELECTED DATE
  // --------------------------------------------------

  useEffect(() => {
    if (students.length === 0) {
      setAttendance({});
      return;
    }

    const newAttendance = createDefaultAttendance();

    attendanceRecords
      .filter((record) => {
        const recordDate = record.date?.split("T")[0];

        return recordDate === selectedDate;
      })
      .forEach((record) => {
        newAttendance[record.studentId] = record.status;
      });

    setAttendance(newAttendance);
    setSaved(false);
  }, [students, attendanceRecords, selectedDate]);

  // --------------------------------------------------
  // CHANGE DATE
  // --------------------------------------------------

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSaved(false);
  };

  // --------------------------------------------------
  // CHANGE STATUS
  // --------------------------------------------------

  const handleStatusChange = (studentId, status) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));

    setSaved(false);
  };

  // --------------------------------------------------
  // MARK ALL PRESENT
  // --------------------------------------------------
const markAllPresent = async () => {
  if (selectedStudents.length === 0) {
    return;
  }

  try {
    setSaving(true);

    const studentsToUpdate = students.filter((student) =>
      selectedStudents.includes(student.id)
    );

    for (const student of studentsToUpdate) {
      const existingRecord = attendanceRecords.find(
        (record) =>
          Number(record.studentId) === Number(student.id) &&
          record.date?.split("T")[0] === selectedDate
      );

      if (existingRecord) {
        await editAttendance(existingRecord.id, {
          studentId: student.id,
          date: selectedDate,
          status: "Present",
        });
      } else {
        await addAttendance({
          studentId: student.id,
          date: selectedDate,
          status: "Present",
        });
      }
    }

    setAttendance((previous) => {
      const updated = { ...previous };

      studentsToUpdate.forEach((student) => {
        updated[student.id] = "Present";
      });

      return updated;
    });

    setSelectedStudents([]);
    setSaved(true);
  } catch (error) {
    console.error(
      "Failed to mark students present:",
      error
    );
  } finally {
    setSaving(false);
  }
};

const markAllAbsent = async () => {
  if (selectedStudents.length === 0) {
    return;
  }

  try {
    setSaving(true);

    const studentsToUpdate = students.filter((student) =>
      selectedStudents.includes(student.id)
    );

    for (const student of studentsToUpdate) {
      const existingRecord = attendanceRecords.find(
        (record) =>
          Number(record.studentId) === Number(student.id) &&
          record.date?.split("T")[0] === selectedDate
      );

      if (existingRecord) {
        await editAttendance(existingRecord.id, {
          studentId: student.id,
          date: selectedDate,
          status: "Absent",
        });
      } else {
        await addAttendance({
          studentId: student.id,
          date: selectedDate,
          status: "Absent",
        });
      }
    }

    setAttendance((previous) => {
      const updated = { ...previous };

      studentsToUpdate.forEach((student) => {
        updated[student.id] = "Absent";
      });

      return updated;
    });

    setSelectedStudents([]);
    setSaved(true);
  } catch (error) {
    console.error(
      "Failed to mark students absent:",
      error
    );
  } finally {
    setSaving(false);
  }
};

const toggleStudentSelection = (studentId) => {
  setSelectedStudents((previous) =>
    previous.includes(studentId)
      ? previous.filter((id) => id !== studentId)
      : [...previous, studentId]
  );
};

const toggleSelectAll = () => {
  const pageStudentIds = paginatedStudents.map(
    (student) => student.id
  );

  const allSelected = pageStudentIds.every((id) =>
    selectedStudents.includes(id)
  );

  if (allSelected) {
    setSelectedStudents((previous) =>
      previous.filter(
        (id) => !pageStudentIds.includes(id)
      )
    );
  } else {
    setSelectedStudents((previous) => [
      ...new Set([
        ...previous,
        ...pageStudentIds,
      ]),
    ]);
  }
};

  // --------------------------------------------------
  // SAVE ATTENDANCE
  // --------------------------------------------------

const handleSaveAttendance = async () => {
  try {
    setSaving(true);
    setSaved(false);

    for (const student of students) {
      const status =
        attendance[student.id] || "Present";

      const existingRecord = attendanceRecords.find(
        (record) => {
          const recordDate =
            record.date?.split("T")[0];

          return (
            Number(record.studentId) ===
              Number(student.id) &&
            recordDate === selectedDate
          );
        }
      );

      if (existingRecord) {
        await editAttendance(
          existingRecord.id,
          {
            studentId: student.id,
            date: selectedDate,
            status,
          }
        );
      } else {
        await addAttendance({
          studentId: student.id,
          date: selectedDate,
          status,
        });
      }
    }

    setSaved(true);

    // Clear all selected checkboxes after successful save
    setSelectedStudents([]);

  } catch (error) {
    console.error(
      "Failed to save attendance:",
      error
    );

    alert("Failed to save attendance.");

  } finally {
    setSaving(false);
  }
};

  const totalPages = Math.ceil(
  students.length / rowsPerPage
);

const startIndex = (currentPage - 1) * rowsPerPage;

const paginatedStudents = students.slice(
  startIndex,
  startIndex + rowsPerPage
);

const allPageStudentsSelected =
  paginatedStudents.length > 0 &&
  paginatedStudents.every((student) =>
    selectedStudents.includes(student.id)
  );

useEffect(() => {
  if (totalPages === 0) {
    setCurrentPage(1);
    return;
  }

  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);

  // --------------------------------------------------
  // SUMMARY
  // --------------------------------------------------

  const presentCount = students.filter(
    (student) =>
      attendance[student.id] === "Present"
  ).length;

  const absentCount = students.filter(
    (student) =>
      attendance[student.id] === "Absent"
  ).length;

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (attendanceLoading) {
    return (
      <div className="w-full p-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Loading attendance...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (attendanceError) {
    return (
      <div className="w-full p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-600">
            {attendanceError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8">

      {/* Heading */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <p className="text-sm font-semibold text-indigo-600">
            {user?.role === "Faculty" ? "FACULTY PORTAL" : "ADMIN PORTAL"}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Attendance Management
          </h1>

          <p className="mt-2 text-slate-500">
            Mark and manage student attendance.
          </p>        </div>
      </div>

      {/* Summary Cards */}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <GraduationCap size={24} />
            </div>

            <div>
          <p className="text-sm text-slate-500">
            Total Students
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {students.length}
          </h2>
        </div>
        </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <UserCheck size={24} />
            </div>

            <div>
          <p className="text-sm text-slate-500">
            Present
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {presentCount}
          </h2>
        </div>
        </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <UserX size={24} />
            </div>

            <div>
          <p className="text-sm text-slate-500">
            Absent
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {absentCount}
          </h2>
        </div>
        </div>
        </div>

      </div>

      {/* Attendance Card */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Mark Attendance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the attendance status for each student.
            </p>
          </div>

          <div className="ml-auto flex flex-wrap gap-3">

            <button
  type="button"
  disabled={
    selectedStudents.length === 0 || saving
  }
  onClick={markAllPresent}
  className="rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-50"
>
  Mark All Present
</button>

<button
  type="button"
  disabled={
    selectedStudents.length === 0 || saving
  }
  onClick={markAllAbsent}
  className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
>
  Mark All Absent
</button>
</div>

          {/* Date */}

          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

        </div>

        {/* Table */}

        <div className="mt-10 overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-200 text-center text-sm text-slate-500">

                <th className="w-12 pb-4">
      <input
        type="checkbox"
        checked={allPageStudentsSelected}
        onChange={toggleSelectAll}
        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />
    </th>

                <th className="pb-4  font-medium">
                  Student
                </th>

                <th className="pb-4 font-medium">
                  Register Number
                </th>

                <th className="pb-4 font-medium">
                  Department
                </th>

                <th className="pb-4 pl-14 font-medium text-left">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {paginatedStudents.map((student) => (

                <tr
                  key={student.id}
                  className="border-b border-slate-100"
                >

                  <td className="py-4 text-center">
    <input
      type="checkbox"
      checked={selectedStudents.includes(
        student.id
      )}
      onChange={() =>
        toggleStudentSelection(student.id)
      }
      className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
    />
  </td>

                  <td className="py-4 font-medium text-center text-slate-900">
                    {student.name}
                  </td>

                  <td className="py-4 text-sm text-center text-slate-500">
                    {student.registerNumber}
                  </td>

                  <td className="py-4 text-sm text-center text-slate-500">
                    {student.department}
                  </td>

                  <td className="py-4">

                    <div className="flex items-center gap-2">

                      <button
                        onClick={() =>
                          handleStatusChange(
                            student.id,
                            "Present"
                          )
                        }
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                          attendance[student.id] ===
                          "Present"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        Present
                      </button>

                      <button
                        onClick={() =>
                          handleStatusChange(
                            student.id,
                            "Absent"
                          )
                        }
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                          attendance[student.id] ===
                          "Absent"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        Absent
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Save Button */}

        <div className="mt-6 flex items-center justify-between border-slate-100 pt-6">

          <div>
            {saved && (
              <p className="text-sm font-medium text-green-600">
                ✓ Attendance saved successfully!
              </p>
            )}
          </div>

          <button
            onClick={handleSaveAttendance}
            disabled={saving}
            className={`rounded-xl px-6 py-3 font-semibold text-white transition ${
              saving
                ? "cursor-not-allowed bg-slate-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {saving
              ? "Saving..."
              : "Save Attendance"}
          </button>

        </div>
        


        {/* Pagination */}

        {totalPages > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2 border-slate-100 px-6 py-4">

            <button
              type="button"
              onClick={() =>
                setCurrentPage((previous) =>
                  Math.max(previous - 1, 1)
                )
              }
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((previous) =>
                  Math.min(previous + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

export default Attendance;
