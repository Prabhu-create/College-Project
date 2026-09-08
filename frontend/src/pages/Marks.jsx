import { useMemo, useState } from "react";
import { useCollege } from "../context/CollegeContext";
import { useAuth } from "../context/AuthContext";
import {
  Rows,
  Percent,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  X,
  Filter,
  Plus,
  Pencil,
  Trash2,
  Save,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
} from "lucide-react";

function Marks() {
  const { user } = useAuth();

  const {
    students,
    marksRecords,
    marksLoading,
    marksError,
    addMarksRecord,
    updateMarksRecord,
    deleteMarksRecord,
  } = useCollege();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 10;

  const [selectedMark, setSelectedMark] = useState(null);

  const [showMarkModal, setShowMarkModal] = useState(false);
  const [editingMark, setEditingMark] = useState(null);

  const [formData, setFormData] = useState({
    studentId: "",
    subject: "",
    marks: "",
  });

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /*
   * Subjects
   *
   * These are the subjects already used in marks records.
   * If there are no marks yet, the default subjects below
   * will be available for adding the first mark.
   */
  const defaultSubjects = [
    "Mathematics",
    "Data Structures",
    "Database Management",
    "Computer Networks",
    "Operating Systems",
    "Java",
    "Python",
    "Web Development",
  ];

  const subjects = useMemo(() => {
    const existingSubjects = marksRecords
      .map((mark) => mark.subject)
      .filter(Boolean);

    return [
      ...new Set([
        ...defaultSubjects,
        ...existingSubjects,
      ]),
    ].sort();
  }, [marksRecords]);

  /*
   * Filter marks
   */
  const filteredMarks = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return marksRecords.filter((mark) => {
      const matchesSearch =
        !search ||
        mark.studentName?.toLowerCase().includes(search) ||
        mark.registerNumber?.toLowerCase().includes(search);

      const matchesSubject =
        !selectedSubject ||
        mark.subject === selectedSubject;

      const matchesGrade =
        !selectedGrade ||
        mark.grade === selectedGrade;

      return (
        matchesSearch &&
        matchesSubject &&
        matchesGrade
      );
    });
  }, [
    marksRecords,
    searchTerm,
    selectedSubject,
    selectedGrade,
  ]);

  const totalPages = Math.ceil(
  filteredMarks.length / rowsPerPage
);

const startIndex = (currentPage - 1) * rowsPerPage;

const paginatedMarks = filteredMarks.slice(
  startIndex,
  startIndex + rowsPerPage
);

  /*
   * Summary calculations
   */
  const totalRecords = marksRecords.length;

  const averageMarks =
    marksRecords.length > 0
      ? (
          marksRecords.reduce(
            (total, mark) =>
              total + Number(mark.marks || 0),
            0
          ) / marksRecords.length
        ).toFixed(1)
      : "0";

  const passedCount = marksRecords.filter(
    (mark) => Number(mark.marks) >= 50
  ).length;

  const failedCount = marksRecords.filter(
    (mark) => Number(mark.marks) < 50
  ).length;

  /*
   * Calculate grade
   */
  const calculateGrade = (marks) => {
    const value = Number(marks);

    if (value >= 90) return "A+";
    if (value >= 80) return "A";
    if (value >= 70) return "B+";
    if (value >= 60) return "B";
    if (value >= 50) return "C";

    return "Fail";
  };

  /*
   * Open Add modal
   */
  const openAddModal = () => {
    setEditingMark(null);

    setFormData({
      studentId: "",
      subject: "",
      marks: "",
    });

    setShowMarkModal(true);
  };

  /*
   * Open Edit modal
   */
  const openEditModal = (mark) => {
    setEditingMark(mark);

    setFormData({
      studentId: String(mark.studentId || ""),
      subject: mark.subject || "",
      marks: String(mark.marks ?? ""),
    });

    setShowMarkModal(true);
  };

  /*
   * Close Add/Edit modal
   */
  const closeMarkModal = () => {
    if (saving) return;

    setShowMarkModal(false);
    setEditingMark(null);

    setFormData({
      studentId: "",
      subject: "",
      marks: "",
    });
  };

  /*
   * Handle form changes
   */
  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * Selected student
   */
  const selectedStudent = useMemo(() => {
    return students.find(
      (student) =>
        Number(student.id) ===
        Number(formData.studentId)
    );
  }, [students, formData.studentId]);

  /*
   * Save mark
   */
  const handleSaveMark = async (event) => {
    event.preventDefault();

    if (!formData.studentId) {
      alert("Please select a student.");
      return;
    }

    if (!formData.subject) {
      alert("Please select a subject.");
      return;
    }

    const marksValue = Number(formData.marks);

    if (
      formData.marks === "" ||
      !Number.isFinite(marksValue) ||
      marksValue < 0 ||
      marksValue > 100
    ) {
      alert("Please enter marks between 0 and 100.");
      return;
    }

    if (!selectedStudent) {
      alert("Selected student was not found.");
      return;
    }

    const percentage = `${marksValue}%`;
    const grade = calculateGrade(marksValue);

    const markData = {
      studentId: Number(selectedStudent.id),
      studentName: selectedStudent.name,
      registerNumber: selectedStudent.registerNumber,
      subject: formData.subject,
      marks: marksValue,
      percentage,
      grade,
    };

    try {
      setSaving(true);

      if (editingMark) {
        await updateMarksRecord(
          editingMark.id,
          markData
        );
      } else {
        await addMarksRecord(markData);
      }

      closeMarkModal();
    } catch (error) {
      console.error("Failed to save mark:", error);

      alert(
        editingMark
          ? "Failed to update mark."
          : "Failed to add mark."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Delete mark
   */
  const handleDeleteMark = async (mark) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the marks for ${mark.studentName} - ${mark.subject}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(mark.id);

      await deleteMarksRecord(mark.id);

      if (selectedMark?.id === mark.id) {
        setSelectedMark(null);
      }
    } catch (error) {
      console.error("Failed to delete mark:", error);
      alert("Failed to delete mark.");
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * Clear filters
   */
 const clearFilters = () => {
  setSearchTerm("");
  setSelectedSubject("");
  setSelectedGrade("");
  setCurrentPage(1);
};
  /*
   * Loading
   */
  if (marksLoading) {
    return (
      <div className="w-full p-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Loading marks...
          </p>
        </div>
      </div>
    );
  }

  /*
   * Error
   */
  if (marksError) {
    return (
      <div className="w-full p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-600">
            {marksError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p className="text-sm font-semibold text-indigo-600">
            FACULTY PORTAL
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Student Marks
          </h1>

          <p className="mt-2 text-slate-500">
            Manage Records and Student Marks.
          </p>
        </div>

        {/* Add Marks */}
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={19} />
          Add Marks
        </button>

      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Records */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Rows size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Records
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {totalRecords}
              </h2>
            </div>

          </div>
        </div>

        {/* Average */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Percent size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Average Marks
              </p>

              <h2 className="mt-2 text-3xl font-bold text-blue-600">
                {averageMarks}
              </h2>
            </div>

          </div>
        </div>

        {/* Passed */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <CheckCircle size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Passed
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {passedCount}
              </h2>
            </div>

          </div>
        </div>

        {/* Failed */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <XCircle size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Failed
              </p>

              <h2 className="mt-2 text-3xl font-bold text-red-600">
                {failedCount}
              </h2>
            </div>

          </div>
        </div>

      </div>

      {/* Filters */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">

          {/* Search */}
          <div className="flex-1">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search Student
            </label>

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => {
  setSearchTerm(event.target.value);
  setCurrentPage(1);
}}
                placeholder="Search name or register number..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>

          </div>

          {/* Subject */}
          <div className="w-full lg:w-56">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Subject
            </label>

            <select
              value={selectedSubject}
              onChange={(event) => {
  setSelectedSubject(event.target.value);
  setCurrentPage(1);
}}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">
                All Subjects
              </option>

              {subjects.map((subject) => (
                <option
                  key={subject}
                  value={subject}
                >
                  {subject}
                </option>
              ))}
            </select>

          </div>

          {/* Grade */}
          <div className="w-full lg:w-44">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Grade
            </label>

            <select
              value={selectedGrade}
              onChange={(event) => {
  setSelectedGrade(event.target.value);
  setCurrentPage(1);
}}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">
                All Grades
              </option>

              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="Fail">Fail</option>
            </select>

          </div>

          {/* Clear */}
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <Filter size={17} />
            Clear
          </button>

        </div>

        {/* Filter result */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredMarks.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {marksRecords.length}
            </span>{" "}
            records
          </p>

        </div>

      </div>

      {/* Marks Table */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Student Marks
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View examination marks entered by faculty.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto">

          {filteredMarks.length === 0 ? (

            <div className="py-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Rows size={26} />
              </div>

              <h3 className="mt-4 font-semibold text-slate-700">
                No marks found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add a marks record or change your search/filter.
              </p>

            </div>

          ) : (

            <table className="w-full min-w-[1050px]">

              <thead>
                <tr className="border-b border-slate-200 text-left text-sm text-slate-500">

                  <th className="pb-4 font-medium">
                    Student
                  </th>

                  <th className="pb-4 font-medium">
                    Register Number
                  </th>

                  <th className="pb-4 font-medium">
                    Subject
                  </th>

                  <th className="pb-4 font-medium">
                    Marks
                  </th>

                  <th className="pb-4 font-medium">
                    Percentage
                  </th>

                  <th className="pb-4 font-medium">
                    Grade
                  </th>

                  <th className="pb-4 text-center font-medium">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {paginatedMarks.map((mark) => (

                  <tr
                    key={mark.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >

                    {/* Student */}
                    <td className="py-4 font-medium text-slate-900">
                      {mark.studentName}
                    </td>

                    {/* Register Number */}
                    <td className="py-4 text-sm text-slate-500">
                      {mark.registerNumber}
                    </td>

                    {/* Subject */}
                    <td className="py-4 text-sm text-slate-600">
                      {mark.subject}
                    </td>

                    {/* Marks */}
                    <td className="py-4 font-semibold text-slate-900">
                      {mark.marks}
                    </td>

                    {/* Percentage */}
                    <td className="py-4 text-sm text-slate-600">
                      {mark.percentage}
                    </td>

                    {/* Grade */}
                    <td className="py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          Number(mark.marks) >= 90
                            ? "bg-green-100 text-green-700"
                            : Number(mark.marks) >= 80
                            ? "bg-blue-100 text-blue-700"
                            : Number(mark.marks) >= 70
                            ? "bg-indigo-100 text-indigo-700"
                            : Number(mark.marks) >= 60
                            ? "bg-yellow-100 text-yellow-700"
                            : Number(mark.marks) >= 50
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {mark.grade}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="py-4">

                      <div className="flex items-center justify-center gap-1">

                        {/* View */}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedMark(mark)
                          }
                          title="View marks"
                          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Eye size={16} />
                          
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(mark)
                          }
                          title="Edit marks"
                          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          <Pencil size={16} />
                          
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteMark(mark)
                          }
                          disabled={deletingId === mark.id}
                          title="Delete marks"
                          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                          {deletingId === mark.id
                            ? "Deleting..."
                            : ""}
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

          {filteredMarks.length > 0 && (
  <div className="mt-6 border-t border-slate-200 pt-4">
    <div className="flex items-center justify-center gap-2">
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
          className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
            currentPage === page
              ? "bg-indigo-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
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
  </div>
)}

        </div>

      </div>

      {/* Add / Edit Marks Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingMark
                    ? "Edit Marks"
                    : "Add Marks"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingMark
                    ? "Update the student's examination marks."
                    : "Enter examination marks for a student."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeMarkModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}
            <form onSubmit={handleSaveMark}>

              <div className="space-y-5 p-6">

                {/* Student */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Student
                  </label>

                  <select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleFormChange}
                    disabled={saving}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
                  >
                    <option value="">
                      Select Student
                    </option>

                    {students.map((student) => (
                      <option
                        key={student.id}
                        value={student.id}
                      >
                        {student.name} -{" "}
                        {student.registerNumber}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Student Info */}
                {selectedStudent && (
                  <div className="rounded-xl bg-indigo-50 p-4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                      Selected Student
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {selectedStudent.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Register Number:{" "}
                      {selectedStudent.registerNumber}
                    </p>

                  </div>
                )}

                {/* Subject */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Subject
                  </label>

                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    disabled={saving}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
                  >
                    <option value="">
                      Select Subject
                    </option>

                    {subjects.map((subject) => (
                      <option
                        key={subject}
                        value={subject}
                      >
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Marks */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Marks
                  </label>

                  <input
                    type="number"
                    name="marks"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.marks}
                    onChange={handleFormChange}
                    disabled={saving}
                    placeholder="Enter marks (0-100)"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
                  />
                </div>

                {/* Automatic Result Preview */}
                {formData.marks !== "" &&
                  Number(formData.marks) >= 0 &&
                  Number(formData.marks) <= 100 && (
                    <div className="grid grid-cols-2 gap-4">

                      <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-500">
                          Percentage
                        </p>

                        <p className="mt-1 text-xl font-bold text-indigo-600">
                          {Number(formData.marks)}%
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-500">
                          Grade
                        </p>

                        <p className="mt-1 text-xl font-bold text-slate-900">
                          {calculateGrade(
                            formData.marks
                          )}
                        </p>
                      </div>

                    </div>
                  )}

              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

                <button
                  type="button"
                  onClick={closeMarkModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                
                  {saving
                    ? "Saving..."
                    : editingMark
                    ? "Update Marks"
                    : "Add Marks"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* View Details Modal */}
      {selectedMark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Mark Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Examination mark information
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedMark(null)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>

            </div>

            {/* Modal Body */}
            <div className="space-y-5 p-6">

              {/* Student */}
              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Student
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {selectedMark.studentName}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Register Number:{" "}
                  <span className="font-medium text-slate-700">
                    {selectedMark.registerNumber}
                  </span>
                </p>

              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">
                    Subject
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedMark.subject}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">
                    Marks
                  </p>

                  <p className="mt-1 text-xl font-bold text-indigo-600">
                    {selectedMark.marks}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">
                    Percentage
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedMark.percentage}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">
                    Grade
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedMark.grade}
                  </p>
                </div>

              </div>

              {/* Result */}
              <div
                className={`rounded-xl p-4 ${
                  Number(selectedMark.marks) >= 50
                    ? "bg-green-50"
                    : "bg-red-50"
                }`}
              >

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Result
                </p>

                <p
                  className={`mt-1 font-bold ${
                    Number(selectedMark.marks) >= 50
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {Number(selectedMark.marks) >= 50
                    ? "Passed"
                    : "Failed"}
                </p>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-slate-200 px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setSelectedMark(null)
                }
                className="rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white transition hover:bg-slate-800"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Marks;