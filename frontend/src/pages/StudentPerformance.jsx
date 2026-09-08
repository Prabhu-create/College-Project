import { useState } from "react";
import { useCollege } from "../context/CollegeContext";

function StudentPerformance() {
  const { students } = useCollege();

  const [performanceRecords, setPerformanceRecords] = useState([
    {
      id: 1,
      student: "Arun Kumar",
      registerNumber: "22CS101",
      program: "Full Stack Development",
      score: 88,
      attendance: 92,
    },
    {
      id: 2,
      student: "Priya Sharma",
      registerNumber: "22CS102",
      program: "Python & AI",
      score: 94,
      attendance: 96,
    },
    {
      id: 3,
      student: "Rahul Kumar",
      registerNumber: "22CS103",
      program: "Aptitude Training",
      score: 65,
      attendance: 78,
    },
  ]);

  const [search, setSearch] = useState("");
  const [performanceFilter, setPerformanceFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [form, setForm] = useState({
    student: "",
    program: "",
    score: "",
    attendance: "",
  });

  // Calculate performance level
  const getPerformanceLevel = (score) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Average";
    return "Needs Improvement";
  };

  // Performance badge styles
  const getPerformanceClass = (level) => {
    switch (level) {
      case "Excellent":
        return "bg-green-100 text-green-700";

      case "Good":
        return "bg-blue-100 text-blue-700";

      case "Average":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-red-100 text-red-700";
    }
  };

  // Filter records
  const filteredRecords = performanceRecords.filter((record) => {
    const level = getPerformanceLevel(record.score);

    const matchesSearch =
      `${record.student} ${record.registerNumber} ${record.program}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesPerformance =
      performanceFilter === "All" ||
      level === performanceFilter;

    return matchesSearch && matchesPerformance;
  });

  // Open add modal
  const openAddModal = () => {
    setEditingRecord(null);

    setForm({
      student: "",
      program: "",
      score: "",
      attendance: "",
    });

    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (record) => {
    setEditingRecord(record);

    setForm({
      student: `${record.student} - ${record.registerNumber}`,
      program: record.program,
      score: record.score,
      attendance: record.attendance,
    });

    setShowModal(true);
  };

  // Handle input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handle student selection
  const handleStudentChange = (event) => {
    const studentId = Number(event.target.value);

    const student = students.find(
      (item) => item.id === studentId
    );

    if (!student) return;

    setForm((previous) => ({
      ...previous,
      student: `${student.name} - ${student.registerNumber}`,
    }));
  };

  // Add or update record
  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.student ||
      !form.program ||
      form.score === "" ||
      form.attendance === ""
    ) {
      alert("Please fill all fields.");
      return;
    }

    const [studentName, registerNumber] =
      form.student.split(" - ");

    const newRecord = {
      id: editingRecord ? editingRecord.id : Date.now(),
      student: studentName,
      registerNumber: registerNumber || "",
      program: form.program,
      score: Number(form.score),
      attendance: Number(form.attendance),
    };

    if (editingRecord) {
      setPerformanceRecords((previous) =>
        previous.map((record) =>
          record.id === editingRecord.id
            ? newRecord
            : record
        )
      );
    } else {
      setPerformanceRecords((previous) => [
        ...previous,
        newRecord,
      ]);
    }

    setShowModal(false);
  };

  // Delete record
  const deleteRecord = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this performance record?"
    );

    if (!confirmed) return;

    setPerformanceRecords((previous) =>
      previous.filter((record) => record.id !== id)
    );
  };

  // Summary counts
  const excellentCount = performanceRecords.filter(
    (record) =>
      getPerformanceLevel(record.score) === "Excellent"
  ).length;

  const goodCount = performanceRecords.filter(
    (record) =>
      getPerformanceLevel(record.score) === "Good"
  ).length;

  const averageCount = performanceRecords.filter(
    (record) =>
      getPerformanceLevel(record.score) === "Average"
  ).length;

  const needsImprovementCount = performanceRecords.filter(
    (record) =>
      getPerformanceLevel(record.score) === "Needs Improvement"
  ).length;

  return (
    <div className="w-full p-8">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <p className="text-sm font-semibold text-indigo-600">
            TRAINER PORTAL
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Student Performance
          </h1>

          <p className="mt-2 text-slate-500">
            Track student assessment scores and training performance.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          + Add Performance
        </button>

      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Excellent
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {excellentCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Good
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {goodCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Average
          </p>

          <h2 className="mt-2 text-3xl font-bold text-yellow-600">
            {averageCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Needs Improvement
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {needsImprovementCount}
          </h2>
        </div>

      </div>

      {/* Search and Filter */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row">

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search student or program..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 md:max-w-lg"
        />

        <select
          value={performanceFilter}
          onChange={(event) =>
            setPerformanceFilter(event.target.value)
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
        >
          <option value="All">All Performance</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Average">Average</option>
          <option value="Needs Improvement">
            Needs Improvement
          </option>
        </select>

      </div>

      {/* Performance Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-sm text-slate-500">

                <th className="px-6 py-4 font-medium">
                  Student
                </th>

                <th className="px-6 py-4 font-medium">
                  Program
                </th>

                <th className="px-6 py-4 font-medium">
                  Score
                </th>

                <th className="px-6 py-4 font-medium">
                  Attendance
                </th>

                <th className="px-6 py-4 font-medium">
                  Performance
                </th>

                <th className="px-6 py-4 font-medium">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredRecords.map((record) => {
                const level = getPerformanceLevel(record.score);

                return (
                  <tr
                    key={record.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >

                    <td className="px-6 py-4">

                      <p className="font-semibold text-slate-900">
                        {record.student}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {record.registerNumber}
                      </p>

                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {record.program}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">
                        {record.score}/100
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-indigo-600">
                        {record.attendance}%
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getPerformanceClass(
                          level
                        )}`}
                      >
                        {level}
                      </span>
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex gap-3">

                        <button
                          onClick={() => openEditModal(record)}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteRecord(record.id)}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

        {filteredRecords.length === 0 && (
          <div className="p-10 text-center text-sm text-slate-500">
            No performance records found.
          </div>
        )}

      </div>

      {/* Add/Edit Modal */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingRecord
                    ? "Edit Performance"
                    : "Add Performance"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter student performance details.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-xl text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >

              {/* Student */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Student
                </label>

                <select
                  value={
                    students.find(
                      (student) =>
                        `${student.name} - ${student.registerNumber}` ===
                        form.student
                    )?.id || ""
                  }
                  onChange={handleStudentChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                >

                  <option value="">
                    Select Student
                  </option>

                  {students.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.name} - {student.registerNumber}
                    </option>
                  ))}

                </select>

              </div>

              {/* Program */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Training Program
                </label>

                <input
                  name="program"
                  value={form.program}
                  onChange={handleChange}
                  placeholder="Example: Full Stack Development"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                />

              </div>

              {/* Score and Attendance */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Assessment Score
                  </label>

                  <input
                    type="number"
                    name="score"
                    min="0"
                    max="100"
                    value={form.score}
                    onChange={handleChange}
                    placeholder="0 - 100"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Attendance %
                  </label>

                  <input
                    type="number"
                    name="attendance"
                    min="0"
                    max="100"
                    value={form.attendance}
                    onChange={handleChange}
                    placeholder="0 - 100"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  />

                </div>

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                >
                  {editingRecord
                    ? "Update Performance"
                    : "Add Performance"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default StudentPerformance;