import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Plus,
  RotateCcw,
  Users,
  X,
  Eye,
  Pencil,
  Trash2,
  BadgeCheck,
  BriefcaseBusiness,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCollege } from "../context/CollegeContext";

function Students() {

  const { user } = useAuth();

const {
  students,
  addStudent,
  updateStudent,
  deleteStudent,
  getDeletedStudents,
 restoreStudent,
} = useCollege();

const [search, setSearch] = useState("");
const [showModal, setShowModal] = useState(false);
const [viewStudent, setViewStudent] = useState(null);
const [editingStudent, setEditingStudent] = useState(null);
const [selectedStudentIds, setSelectedStudentIds] = useState([]);
const [selectedDeletedStudentIds, setSelectedDeletedStudentIds] = useState([]);

const [showBin, setShowBin] = useState(false);
const [deletedStudents, setDeletedStudents] = useState([]);
const [binLoading, setBinLoading] = useState(false);

const [currentPage, setCurrentPage] = useState(1);

const rowsPerPage = 10;


const [formData, setFormData] = useState({
  name: "",
  registerNumber: "",
  department: "",
  year: "",
  email: "",
  password:"",
  phone: "",
  cgpa: "",
  skills: "",
});

const handleAddStudent = () => {
  setEditingStudent(null);

  setFormData({
    name: "",
    registerNumber: "",
    department: "",
    year: "",
    email: "",
    password:"",
    phone: "",
    cgpa: "",
    skills: "",
  });

  setShowModal(true);
};

const handleChange = (event) => {
  const { name, value } = event.target;

  setFormData((previous) => ({
    ...previous,
    [name]: value,
  }));
};

const openEditStudent = (student) => {
  setEditingStudent(student);

  setFormData({
    name: student.name || "",
    registerNumber: student.registerNumber || "",
    department: student.department || "",
    year: student.year || "",
    email: student.email || "",
    password: student.password || "",
    phone: student.phone || "",
    cgpa: student.cgpa ?? "",
    skills: student.skills || "",
  });

  setShowModal(true);
  setSelectedStudent(null);
};

const handleSaveStudent = async () => {
  if (
    !formData.name ||
    !formData.registerNumber ||
    !formData.department ||
    !formData.year ||
    !formData.email ||
    !formData.password ||
    !formData.phone ||
    !formData.cgpa ||
    !formData.skills
  ) {
    alert("Please fill in all fields.");
    return;
  }

  if (editingStudent) {
    console.log("EDITING STUDENT:", editingStudent);
    console.log("EDITING STUDENT ID:", editingStudent.id);

    const success = await updateStudent(
      editingStudent.id,
      {
        name: formData.name,
        registerNumber: formData.registerNumber,
        department: formData.department,
        year: formData.year,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        cgpa: Number(formData.cgpa),
        skills: formData.skills,
        //status: status,
      }
    );

    if (!success) {
      return;
    }
  } else {
    const newStudent = {
      name: formData.name,
      registerNumber: formData.registerNumber,
      department: formData.department,
      year: formData.year,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      cgpa: Number(formData.cgpa),
      skills: formData.skills,
    };

    await addStudent(newStudent);
  }

  setFormData({
    name: "",
    registerNumber: "",
    department: "",
    year: "",
    email: "",
    password: "",
    phone: "",
    cgpa: "",
    skills: "",
  });

  setEditingStudent(null);
  setShowModal(false);
};

const handleCancel = () => {
  setShowModal(false);
  setEditingStudent(null);

  setFormData({
    name: "",
    registerNumber: "",
    department: "",
    year: "",
    email: "",
    password: "",
    phone: "",
    cgpa: "",
    skills: "",
  });
};

const filteredStudents = students.filter((student) => {
  const searchTerm = search.toLowerCase();

  return (
    student.name.toLowerCase().includes(searchTerm) ||
    student.department.toLowerCase().includes(searchTerm)
  );
});

const totalStudents = students.length;

const eligibleStudents = students.filter(
  (student) => student.status === "Eligible"
).length;

const placedStudents = students.filter(
  (student) => student.status === "Placed"
).length;

const handleOpenBin = async () => {
  try {
    setBinLoading(true);

    // Clear only Bin selections
    setSelectedDeletedStudentIds([]);

    const deleted = await getDeletedStudents();

    setDeletedStudents(deleted);
    setShowBin(true);

  } catch (error) {
    console.error("Failed to load bin:", error);
    alert("Failed to load deleted students.");

  } finally {
    setBinLoading(false);
  }
};

const handleSelectStudent = (studentId) => {
  setSelectedStudentIds((previous) =>
    previous.includes(studentId)
      ? previous.filter((id) => id !== studentId)
      : [...previous, studentId]
  );
};

const handleSelectAll = (event) => {
  if (event.target.checked) {
    setSelectedStudentIds(
      filteredStudents.map((student) => student.id)
    );
  } else {
    setSelectedStudentIds([]);
  }
};

const handleSelectAllDeletedStudents = (event) => {
  if (event.target.checked) {
    setSelectedDeletedStudentIds(
      deletedStudents.map((student) => student.id)
    );
  } else {
    setSelectedDeletedStudentIds([]);
  }
};

const handleSelectDeletedStudent = (studentId) => {
  setSelectedDeletedStudentIds((previous) =>
    previous.includes(studentId)
      ? previous.filter((id) => id !== studentId)
      : [...previous, studentId]
  );
};

const handleBulkDelete = async () => {
  if (selectedStudentIds.length === 0) {
    return;
  }

  const selectedStudents = students.filter((student) =>
    selectedStudentIds.includes(student.id)
  );

  const confirmed = window.confirm(
    `Are you sure you want to delete ${selectedStudents.length} student${
      selectedStudents.length > 1 ? "s" : ""
    }?`
  );

  if (!confirmed) {
    return;
  }

  try {
    await Promise.all(
      selectedStudentIds.map((studentId) =>
        deleteStudent(studentId)
      )
    );

    setSelectedStudentIds([]);

    alert(
      `${selectedStudents.length} student${
        selectedStudents.length > 1 ? "s" : ""
      } deleted successfully.`
    );
  } catch (error) {
    console.error("Bulk delete failed:", error);
    alert("Failed to delete selected students.");
  }
};

const handleRestoreSelectedStudents = async () => {
  if (selectedDeletedStudentIds.length === 0) {
    alert("Please select at least one student.");
    return;
  }

  const confirmed = window.confirm(
    `Restore ${selectedDeletedStudentIds.length} selected student(s)?`
  );

  if (!confirmed) {
    return;
  }

  try {
    await Promise.all(
      selectedDeletedStudentIds.map((studentId) =>
        restoreStudent(studentId)
      )
    );

    setDeletedStudents((previous) =>
      previous.filter(
        (student) =>
          !selectedDeletedStudentIds.includes(student.id)
      )
    );

    setSelectedDeletedStudentIds([]);

    alert(
      `${selectedDeletedStudentIds.length} student(s) restored successfully.`
    );

  } catch (error) {
    console.error(
      "Failed to restore selected students:",
      error
    );

    alert("Failed to restore selected students.");
  }
};

const handleSelectAllCurrentPage = (event) => {
  const currentPageIds = paginatedStudents.map(
    (student) => student.id
  );

  if (event.target.checked) {
    setSelectedStudentIds((previous) => [
      ...new Set([
        ...previous,
        ...currentPageIds,
      ]),
    ]);
  } else {
    setSelectedStudentIds((previous) =>
      previous.filter(
        (id) => !currentPageIds.includes(id)
      )
    );
  }
};

const totalPages = Math.ceil(
  filteredStudents.length / rowsPerPage
);

const startIndex = (currentPage - 1) * rowsPerPage;

const paginatedStudents = filteredStudents.slice(
  startIndex,
  startIndex + rowsPerPage
);

  return (
    <div className="w-full p-8">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <p className="text-sm font-semibold text-indigo-600">
           {user?.role === "Faculty" ? "FACULTY PORTAL" : "ADMIN PORTAL"}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Students
          </h1>

          <p className="mt-2 text-slate-500">
            Manage student information and placement eligibility.
          </p>
        </div>

        <button
    onClick={handleAddStudent}
    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
  >
    <Plus size={20} strokeWidth={2.5} />
    Add Student
  </button>
      </div>

      {/* Statistics */}

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <GraduationCap size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Students
              </p>

              <h2 className="text-2xl font-bold">
                {totalStudents}
              </h2>
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <BadgeCheck size={24} />
            </div>

          <div>
          <p className="text-sm text-slate-500">
            Placement Eligible
          </p>

          <h2 className="mt-2 text-2xl font-bold text-indigo-600">
            {eligibleStudents}
          </h2>

        </div>
        </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <BriefcaseBusiness size={24} />
            </div>

          <div>
          <p className="text-sm text-slate-500">
            Students Placed
          </p>

          <h2 className="mt-2 text-2xl font-bold text-emerald-600">
            {placedStudents}
          </h2>

        </div>
        </div>
        </div>



      </div>

      {/* Search */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

    <div className="relative w-full max-w-md">

      <Search
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        placeholder="Search student by name or department..."
        value={search}
        onChange={(event) => {
  setSearch(event.target.value);
  setCurrentPage(1);
}}
        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />

    </div>

     <div className="flex items-center gap-3">

    {selectedStudentIds.length > 0 && (
      <button
        type="button"
        onClick={handleBulkDelete}
        className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
      >
        <Trash2 size={18} />

        Delete Selected ({selectedStudentIds.length})
      </button>
    )}

    {/* Bin */}

    <button
      type="button"
      onClick={handleOpenBin}
      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
    >
      <Trash2 size={18} />
      Bin
    </button>
    </div>

  </div>

</div>

      {/* Student Table */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="border-b border-slate-200 bg-slate-50">

              <tr>

                {/* Select All */}

    <th className="w-12 px-4 py-4 text-center">
      <input
        type="checkbox"
        checked={
  paginatedStudents.length > 0 &&
  paginatedStudents.every((student) =>
    selectedStudentIds.includes(student.id)
  )
}
        onChange={handleSelectAllCurrentPage}
        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />
    </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                  Student
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                  Department
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                  CGPA
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                  Skills
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {paginatedStudents.map((student) => (

                <tr
                  key={student.id}
                  className={`border-b border-slate-100 transition hover:bg-slate-50 ${
    selectedStudentIds.includes(student.id)
      ? "bg-indigo-50"
      : ""
  }`}
                >

                  {/* Checkbox */}

                  <td className="px-4 py-4 text-center">
  <input
    type="checkbox"
    checked={selectedStudentIds.includes(student.id)}
    onChange={() => handleSelectStudent(student.id)}
    className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
  />
</td>


                  {/* Student */}

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                        {student.name.charAt(0)}
                      </div>

                      <div>

                        <p className="font-semibold text-slate-900">
                          {student.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {student.year}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* Department */}

                  <td className="px-6 py-4 text-center text-sm text-slate-600">
                    {student.department}
                  </td>

                  {/* CGPA */}

                  <td className="px-6 py-4 text-center">

                    <span className="font-semibold">
                      {student.cgpa}
                    </span>

                  </td>

                  {/* Skills */}

                  <td className="px-6 py-4 text-center text-sm text-slate-500">
                    {student.skills}
                  </td>

                  {/* Status */}

                  <td className="px-6 py-4 text-center">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        student.status === "Placed"
                          ? "bg-emerald-50 text-emerald-600"
                          : student.status === "Eligible"
                          ? "bg-indigo-50 text-indigo-600"
                          : student.status === "Training"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                     {student.status || "-"}
                    </span>

                  </td>

                  {/* Action */}

                  <td className="px-6 py-4">
  <div className="flex items-center justify-end gap-2">

    {/* View */}
    <button
      type="button"
      onClick={() => {
        setViewStudent(student);
      }}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
      title="View student"
    >
      <Eye size={16} />
    </button>

    {/* Edit */}
    <button
      type="button"
      onClick={() => {
        openEditStudent(student);
      }}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
      title="Edit student"
    >
      <Pencil size={16} />
    </button>

    {/* Delete */}
    <button
      type="button"
      onClick={async () => {
  const confirmed = window.confirm(
    `Delete ${student.name}?`
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteStudent(student.id);

    setSelectedStudentIds((previous) =>
      previous.filter((id) => id !== student.id)
    );

  } catch (error) {

    console.error("Delete failed:", error);

  }
}}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
      title="Delete student"
    >
      <Trash2 size={16} />
    </button>

  </div>
</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Pagination */}

       {/* Pagination */}

{filteredStudents.length > 0 && (
  <div className="border-t border-slate-200 px-6 py-4">

    <div className="flex items-center justify-center gap-2">

      {/* Previous */}

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

      {/* Page Numbers */}

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

      {/* Next */}

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

         
      {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

      {/* Modal Header */}

      <div className="flex items-center justify-between p-6">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {editingStudent ? "Edit Student" : "Add New Student"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {editingStudent
    ? "Update the student's details below."
    : "Enter the student's details below."}
          </p>
        </div>

        <button
          onClick={() => setShowModal(false)}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          <X size={20} />
        </button>

      </div>

      {/* Form */}

      <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

        {/* Full Name */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Full Name
          </label>

          <input
  type="text"
  name="name"
  placeholder="Enter full name"
  value={formData.name}
  onChange={handleChange}
  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
/>
        </div>

        {/* Register Number */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Register Number
          </label>

          <input
  type="text"
  name="registerNumber"
  placeholder="Enter register number"
  value={formData.registerNumber}
  onChange={handleChange}
  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
/>
        </div>

        {/* Department */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Department
          </label>

          <select
  name="department"
  value={formData.department}
  onChange={handleChange}
  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
>
  <option value="">Select department</option>
  <option>Computer Science</option>
  <option>Information Technology</option>
  <option>Electronics</option>
  <option>Mechanical</option>
  <option>Civil</option>
</select>
        </div>

        {/* Year */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Year
          </label>

          <select
  name="year"
  value={formData.year}
  onChange={handleChange}
  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
>
  <option value="">Select year</option>
  <option>1st Year</option>
  <option>2nd Year</option>
  <option>3rd Year</option>
  <option>Final Year</option>
</select>
        </div>

        {/* Email */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
  type="email"
  name="email"
  placeholder="student@example.com"
  value={formData.email}
  onChange={handleChange}
  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
/>
        </div>

        {/* Password */}

<div>
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Password
  </label>

  <input
    type="password"
    name="password"
    placeholder="Enter student password"
    value={formData.password}
    onChange={handleChange}
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  />
</div>

        {/* Phone */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Phone
          </label>

          <input
  type="tel"
  name="phone"
  placeholder="Enter phone number"
  value={formData.phone}
  onChange={handleChange}
  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
/>
        </div>

        {/* CGPA */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            CGPA
          </label>

          <input
  type="number"
  name="cgpa"
  step="0.1"
  min="0"
  max="10"
  placeholder="Example: 8.5"
  value={formData.cgpa}
  onChange={handleChange}
  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
/>
        </div>

        {/* Skills */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Skills
          </label>

          <input
  type="text"
  name="skills"
  placeholder="React, Java, Python"
  value={formData.skills}
  onChange={handleChange}
  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
/>
        </div>

      </div>

      {/* Footer */}

      <div className="flex justify-end gap-3 border-t border-slate-200 p-6">

        <button
          onClick={() => setShowModal(false)}
          className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
  onClick={handleSaveStudent}
  className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
>
  {editingStudent ? "Update Student" : "Add Student"}
</button>

      </div>

    </div>

  </div>
)}

{viewStudent && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
    onClick={() => setViewStudent(null)}
  >
    <div
      className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            View Student Details
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            {viewStudent.name}
          </h2>
        </div>

        <button
          onClick={() => setViewStudent(null)}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={20} />
        </button>

      </div>

      {/* Student Details */}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase text-slate-400">
            Register Number
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {viewStudent.registerNumber || "-"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase text-slate-400">
            Department
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {viewStudent.department || "-"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase text-slate-400">
            Year
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {viewStudent.year || "-"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase text-slate-400">
            CGPA
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {viewStudent.cgpa ?? "-"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase text-slate-400">
            Email
          </p>

          <p className="mt-1 break-all font-semibold text-slate-900">
            {viewStudent.email || "-"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase text-slate-400">
            Phone
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {viewStudent.phone || "-"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
          <p className="text-xs font-medium uppercase text-slate-400">
            Skills
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {viewStudent.skills || "-"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
          <p className="text-xs font-medium uppercase text-slate-400">
            Placement Status
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {viewStudent.status || "-"}
          </p>
        </div>

      </div>

      {/* Close */}

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setViewStudent(null)}
          className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}

{showBin && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

    <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 p-6">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Student Recycle Bin
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Deleted students can be restored from here.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowBin(false);
            setSelectedDeletedStudentIds([]);
          }}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={20} />
        </button>

      </div>


      {/* Content */}

      <div className="max-h-[60vh] overflow-y-auto p-6">

        {binLoading ? (

          <div className="py-10 text-center text-slate-500">
            Loading deleted students...
          </div>

        ) : deletedStudents.length === 0 ? (

          <div className="py-10 text-center">

            <Trash2
              size={40}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 font-semibold text-slate-700">
              Bin is empty
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Deleted students will appear here.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-200 text-left">

                  {/* SELECT ALL */}

                  <th className="w-12 px-4 py-3">

                    <input
                      type="checkbox"
                      checked={
                        deletedStudents.length > 0 &&
                        deletedStudents.every((student) =>
                          selectedDeletedStudentIds.includes(student.id)
                        )
                      }
                      onChange={handleSelectAllDeletedStudents}
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />

                  </th>


                  <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-400">
                    Student
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-400">
                    Register Number
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-400">
                    Department
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-400">
                    CGPA
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-400">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {deletedStudents.map((student) => (

                  <tr
                    key={student.id}
                    className={`border-b border-slate-100 transition ${
                      selectedDeletedStudentIds.includes(student.id)
                        ? "bg-indigo-50"
                        : ""
                    }`}
                  >

                    {/* ROW CHECKBOX */}

                    <td className="px-4 py-4">

                      <input
                        type="checkbox"
                        checked={
                          selectedDeletedStudentIds.includes(
                            student.id
                          )
                        }
                        onChange={() =>
                          handleSelectDeletedStudent(student.id)
                        }
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />

                    </td>


                    {/* Student */}

                    <td className="px-4 py-4">

                      <p className="font-semibold text-slate-900">
                        {student.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        {student.email}
                      </p>

                    </td>


                    {/* Register Number */}

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {student.registerNumber}
                    </td>


                    {/* Department */}

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {student.department}
                    </td>


                    {/* CGPA */}

                    <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                      {student.cgpa}
                    </td>


                    {/* Action */}

                    <td className="px-4 py-4 text-right">

                      <button
                        type="button"
                        onClick={async () => {

                          const confirmed =
                            window.confirm(
                              `Restore ${student.name}?`
                            );

                          if (!confirmed) {
                            return;
                          }

                          try {

                            const success =
                              await restoreStudent(student.id);

                            if (success) {

                              /* Remove from Bin */

                              setDeletedStudents((previous) =>
                                previous.filter(
                                  (item) =>
                                    item.id !== student.id
                                )
                              );


                              /* Remove ONLY from deleted selection */

                              setSelectedDeletedStudentIds(
                                (previous) =>
                                  previous.filter(
                                    (id) =>
                                      id !== student.id
                                  )
                              );

                            }

                          } catch (error) {

                            console.error(
                              "Restore failed:",
                              error
                            );

                            alert(
                              "Failed to restore student."
                            );

                          }

                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100"
                      >

                        <RotateCcw size={16} />

                        Restore

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* Footer */}

      <div className="flex items-center justify-between border-t border-slate-200 p-6">

        {/* Selected Count */}

        <div className="text-sm text-slate-500">

         {/*selectedDeletedStudentIds.length > 0
            ? `${selectedDeletedStudentIds.length} student(s) selected`
            : "Select students to restore"
          */}

        </div>


        <div className="flex items-center gap-3">

          {/* Restore Selected */}

          {selectedDeletedStudentIds.length > 0 && (

            <button
              type="button"
              onClick={handleRestoreSelectedStudents}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >

              <RotateCcw size={18} />

              Restore Selected (
                {selectedDeletedStudentIds.length}
              )

            </button>

          )}


          {/* Close */}

          <button
            type="button"
            onClick={() => {
              setShowBin(false);
              setSelectedDeletedStudentIds([]);
            }}
            className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
          >

            Close

          </button>

        </div>

      </div>

    </div>

  </div>
)}

    </div>
  );
}

export default Students;