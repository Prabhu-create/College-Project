import { useMemo, useState } from "react";
import {
  Users,
  GraduationCap,
  UserRound,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
  X,
  Building2,
  Mail,
  Phone,
  BriefcaseBusiness,
} from "lucide-react";
import { useCollege } from "../context/CollegeContext";
import { useAuth } from "../context/AuthContext";

function UsersPage() {

  const { user } = useAuth();

  const {
    students,
    faculty,

    addStudent,
    updateStudent,
    deleteStudent,
    getDeletedStudents,
    restoreStudent,

    addFaculty,
    editFaculty,
    removeFaculty,
    getDeletedFaculty,
    restoreFaculty,
  } = useCollege();

  const [activeTab, setActiveTab] = useState("students");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 10;

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedDeletedIds, setSelectedDeletedIds] = useState([]);

  const [viewUser, setViewUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showBin, setShowBin] = useState(false);

  const [deletedUsers, setDeletedUsers] = useState([]);
  const [binLoading, setBinLoading] = useState(false);

  const emptyStudentForm = {
    name: "",
    registerNumber: "",
    department: "",
    year: "",
    email: "",
    phone: "",
    cgpa: "",
    skills: "",
  };

  const emptyFacultyForm = {
    name: "",
    employeeId: "",
    department: "",
    designation: "",
    email: "",
    phone: "",
  };

  const [studentForm, setStudentForm] = useState(emptyStudentForm);
  const [facultyForm, setFacultyForm] = useState(emptyFacultyForm);

  const isStudents = activeTab === "students";

  /*
   * Summary
   */

  const totalStudents = students.length;
  const totalFaculty = faculty.length;

  const eligibleStudents = students.filter(
    (student) => student.status === "Eligible"
  ).length;

  const placedStudents = students.filter(
    (student) => student.status === "Placed"
  ).length;

  /*
   * Departments
   */

  const departments = useMemo(() => {
    const source = isStudents ? students : faculty;

    return [
      "All",
      ...Array.from(
        new Set(
          source
            .map((item) => item.department)
            .filter(Boolean)
        )
      ),
    ];
  }, [students, faculty, isStudents]);

  /*
   * Filter
   */

  const filteredUsers = useMemo(() => {
    const source = isStudents ? students : faculty;

    const searchValue = search.toLowerCase().trim();

    return source.filter((item) => {
      const matchesSearch =
        !searchValue ||
        item.name?.toLowerCase().includes(searchValue) ||
        item.email?.toLowerCase().includes(searchValue) ||
        item.department?.toLowerCase().includes(searchValue) ||
        (isStudents
          ? item.registerNumber
              ?.toLowerCase()
              .includes(searchValue)
          : item.employeeId
              ?.toLowerCase()
              .includes(searchValue));

      const matchesDepartment =
        departmentFilter === "All" ||
        item.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [
    students,
    faculty,
    isStudents,
    search,
    departmentFilter,
  ]);

  const totalPages = Math.ceil(
  filteredUsers.length / rowsPerPage
);

const startIndex = (currentPage - 1) * rowsPerPage;

const paginatedUsers = filteredUsers.slice(
  startIndex,
  startIndex + rowsPerPage
);

  /*
   * Tab change
   */

const handleTabChange = (tab) => {
  setActiveTab(tab);
  setSearch("");
  setDepartmentFilter("All");
  setSelectedIds([]);
  setSelectedDeletedIds([]);
  setViewUser(null);
  setEditingUser(null);
  setCurrentPage(1);
};

  /*
   * Selection
   */

const handleSelectAll = (event) => {
  if (event.target.checked) {
    setSelectedIds(
      filteredUsers.map((item) => Number(item.id))
    );
  } else {
    setSelectedIds([]);
  }
};

const handleSelectUser = (id) => {
  const userId = Number(id);

  setSelectedIds((previous) =>
    previous.includes(userId)
      ? previous.filter(
          (selectedId) => selectedId !== userId
        )
      : [...previous, userId]
  );
};  

const allFilteredSelected =
  filteredUsers.length > 0 &&
  filteredUsers.every((item) =>
    selectedIds.includes(Number(item.id))
  );

  /*
   * Add User
   */

  const handleAddUser = () => {
    setEditingUser(null);

    if (isStudents) {
      setStudentForm(emptyStudentForm);
    } else {
      setFacultyForm(emptyFacultyForm);
    }

    setShowModal(true);
  };

  /*
   * Edit User
   */

  const handleEditUser = (user) => {
    setEditingUser(user);

    if (isStudents) {
      setStudentForm({
        name: user.name || "",
        registerNumber:
          user.registerNumber || "",
        department: user.department || "",
        year: user.year || "",
        email: user.email || "",
        phone: user.phone || "",
        cgpa: user.cgpa ?? "",
        skills: user.skills || "",
      });
    } else {
      setFacultyForm({
        name: user.name || "",
        employeeId: user.employeeId || "",
        department: user.department || "",
        designation: user.designation || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }

    setViewUser(null);
    setShowModal(true);
  };

  /*
   * Save User
   */

  const handleSaveUser = async (event) => {
    event.preventDefault();

    try {
      if (isStudents) {
        if (
          !studentForm.name ||
          !studentForm.registerNumber ||
          !studentForm.department ||
          !studentForm.year ||
          !studentForm.email ||
          !studentForm.phone ||
          studentForm.cgpa === "" ||
          !studentForm.skills
        ) {
          alert("Please fill in all student fields.");
          return;
        }

        if (editingUser) {
          const success = await updateStudent(
            editingUser.id,
            {
              name: studentForm.name,
              registerNumber:
                studentForm.registerNumber,
              department: studentForm.department,
              year: studentForm.year,
              email: studentForm.email,
              phone: studentForm.phone,
              cgpa: Number(studentForm.cgpa),
              skills: studentForm.skills,
            }
          );

          if (!success) {
            return;
          }
        } else {
          await addStudent({
            name: studentForm.name,
            registerNumber:
              studentForm.registerNumber,
            department: studentForm.department,
            year: studentForm.year,
            email: studentForm.email,
            phone: studentForm.phone,
            cgpa: Number(studentForm.cgpa),
            skills: studentForm.skills,
          });
        }
      } else {
        if (
          !facultyForm.name ||
          !facultyForm.employeeId ||
          !facultyForm.department ||
          !facultyForm.designation ||
          !facultyForm.email ||
          !facultyForm.phone
        ) {
          alert("Please fill in all faculty fields.");
          return;
        }

        if (editingUser) {
          await editFaculty(
            editingUser.id,
            facultyForm
          );
        } else {
          await addFaculty(facultyForm);
        }
      }

      handleCloseModal();
    } catch (error) {
      console.error("Failed to save user:", error);
      alert("Failed to save user.");
    }
  };

  /*
   * Close Modal
   */

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setStudentForm(emptyStudentForm);
    setFacultyForm(emptyFacultyForm);
  };

  /*
 * Delete Single User
 */

const handleDeleteUser = async (user) => {
  const userId = Number(user.id);

  const confirmed = window.confirm(
    `Delete ${user.name}?`
  );

  if (!confirmed) {
    return;
  }

  try {
    if (isStudents) {
      await deleteStudent(userId);
    } else {
      await removeFaculty(userId);
    }

    // Remove individually deleted user
    // from the selected list
    setSelectedIds((previous) =>
      previous.filter(
        (selectedId) => Number(selectedId) !== userId
      )
    );
  } catch (error) {
    console.error("Failed to delete user:", error);
    alert("Failed to delete user.");
  }
};

/*
 * Bulk Delete
 */

const handleBulkDelete = async () => {
  if (selectedIds.length === 0) {
    return;
  }

  const confirmed = window.confirm(
    `Delete ${selectedIds.length} selected ${
      isStudents ? "student(s)" : "faculty member(s)"
    }?`
  );

  if (!confirmed) {
    return;
  }

  try {
    for (const id of selectedIds) {
      const userId = Number(id);

      if (isStudents) {
        await deleteStudent(userId);
      } else {
        await removeFaculty(userId);
      }
    }

    setSelectedIds([]);

    alert("Selected users deleted successfully.");
  } catch (error) {
    console.error(
      "Failed to delete selected users:",
      error
    );

    alert("Failed to delete selected users.");
  }
};

  /*
   * Bin
   */

const handleOpenBin = async () => {
  try {
    // Clear previous Bin selections
    setSelectedDeletedIds([]);

    setBinLoading(true);

    const data = isStudents
      ? await getDeletedStudents()
      : await getDeletedFaculty();

    setDeletedUsers(data);
    setShowBin(true);
  } catch (error) {
    console.error(
      "Failed to load deleted users:",
      error
    );

    alert("Failed to load deleted users.");
  } finally {
    setBinLoading(false);
  }
};

const handleCloseBin = () => {
  setShowBin(false);
  setSelectedDeletedIds([]);
};

const handleSelectAllDeleted = (event) => {
  if (event.target.checked) {
    setSelectedDeletedIds(
      deletedUsers.map((item) => Number(item.id))
    );
  } else {
    setSelectedDeletedIds([]);
  }
};

const handleSelectDeletedUser = (id) => {
  const userId = Number(id);

  setSelectedDeletedIds((previous) =>
    previous.includes(userId)
      ? previous.filter(
          (selectedId) => selectedId !== userId
        )
      : [...previous, userId]
  );
};

const allDeletedSelected =
  deletedUsers.length > 0 &&
  deletedUsers.every((item) =>
    selectedDeletedIds.includes(Number(item.id))
  );

  /*
   * Restore
   */

/*
 * Restore Single User
 */

const handleRestore = async (id) => {
  const userId = Number(id);

  const deletedUser = deletedUsers.find(
    (item) => Number(item.id) === userId
  );

  const confirmed = window.confirm(
    `Restore ${deletedUser?.name || "this user"}?`
  );

  if (!confirmed) {
    return;
  }

  try {
    if (isStudents) {
      await restoreStudent(userId);
    } else {
      await restoreFaculty(userId);
    }

    setDeletedUsers((previous) =>
      previous.filter(
        (item) => Number(item.id) !== userId
      )
    );

    // Important: remove restored user
    // from selected Bin IDs
    setSelectedDeletedIds((previous) =>
      previous.filter(
        (selectedId) => Number(selectedId) !== userId
      )
    );
  } catch (error) {
    console.error(
      "Failed to restore user:",
      error
    );

    alert("Failed to restore user.");
  }
};

const handleRestoreSelected = async () => {
  if (selectedDeletedIds.length === 0) {
    return;
  }

  const confirmed = window.confirm(
    `Restore ${selectedDeletedIds.length} selected ${
      isStudents ? "student(s)" : "faculty member(s)"
    }?`
  );

  if (!confirmed) {
    return;
  }

  try {
    for (const id of selectedDeletedIds) {
      const userId = Number(id);

      if (isStudents) {
        await restoreStudent(userId);
      } else {
        await restoreFaculty(userId);
      }
    }

    setDeletedUsers((previous) =>
      previous.filter(
        (item) =>
          !selectedDeletedIds.includes(Number(item.id))
      )
    );

    setSelectedDeletedIds([]);

    alert(
      `Selected ${
        isStudents ? "students" : "faculty members"
      } restored successfully.`
    );
  } catch (error) {
    console.error(
      "Failed to restore selected users:",
      error
    );

    alert("Failed to restore selected users.");
  }
};

  /*
   * User Type Label
   */

  const userType = isStudents
    ? "Student"
    : "Faculty";

  return (
    <div className="w-full p-8">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <p className="text-sm font-semibold text-indigo-600">
             {user?.role === "Faculty" ? "FACULTY PORTAL" : "ADMIN PORTAL"}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Users
          </h1>

          <p className="mt-2 text-slate-500">
            Manage students and faculty members
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddUser}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add {userType}
        </button>

      </div>

      {/* Summary Cards */}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Users
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                {totalStudents + totalFaculty}
              </h2>
            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <GraduationCap size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Students
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                {totalStudents}
              </h2>
            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <UserRound size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Faculty
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                {totalFaculty}
              </h2>
            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BriefcaseBusiness size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Students Placed
              </p>

              <h2 className="mt-1 text-3xl font-bold text-emerald-600">
                {placedStudents}
              </h2>
            </div>

          </div>
        </div>

      </div>

      {/* Tabs */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

        <div className="flex flex-col gap-2 sm:flex-row">

          <button
            type="button"
            onClick={() => handleTabChange("students")}
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${
              isStudents
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <GraduationCap size={18} />
            Students
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                isStudents
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {totalStudents}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("faculty")}
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${
              !isStudents
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <UserRound size={18} />
            Faculty
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                !isStudents
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {totalFaculty}
            </span>
          </button>

        </div>

      </div>

      {/* Search / Filters */}

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex flex-1 flex-col gap-3 sm:flex-row">

            <div className="relative max-w-xl flex-1">

              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => {
  setSearch(event.target.value);
  setCurrentPage(1);
}}
                placeholder={
                  isStudents
                    ? "Search by name, register number, department or email..."
                    : "Search by name, employee ID, department or email..."
                }
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>

            <select
              value={departmentFilter}
              onChange={(event) => {
  setDepartmentFilter(event.target.value);
  setCurrentPage(1);
}}
              className="rounded-xl border border-slate-200 px-4 py-3 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {departments.map((department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department === "All"
                    ? "All Departments"
                    : department}
                </option>
              ))}
            </select>

          </div>

          <div className="flex items-center gap-3">

            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                <Trash2 size={18} />
                Delete Selected ({selectedIds.length})
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenBin}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={18} />
              Bin
            </button>

          </div>

        </div>

      </div>

      {/* Table */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {filteredUsers.length === 0 ? (

          <div className="p-14 text-center">

            <Users
              size={44}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-semibold text-slate-700">
              No {isStudents ? "students" : "faculty"} found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or department filter.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="w-12 px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    {isStudents
                      ? "Register Number"
                      : "Employee ID"}
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Department
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    {isStudents
                      ? "Year"
                      : "Designation"}
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Contact
                  </th>

                  {isStudents && (
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                      Status
                    </th>
                  )}

                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {paginatedUsers.map((user) => (

                  <tr
                    key={user.id}
                    className={`border-b border-slate-100 transition hover:bg-slate-50 ${
                      selectedIds.includes(Number(user.id))
                        ? "bg-indigo-50"
                        : ""
                    }`}
                  >

                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(Number(user.id))}
                        onChange={() =>
                          handleSelectUser(user.id)
                        }
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>

                    {/* User */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {user.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {user.email}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* ID */}

                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {isStudents
                        ? user.registerNumber
                        : user.employeeId}
                    </td>

                    {/* Department */}

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.department}
                    </td>

                    {/* Year / Designation */}

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {isStudents
                        ? user.year
                        : user.designation}
                    </td>

                    {/* Contact */}

                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        {user.phone}
                      </div>
                    </td>

                    {/* Student Status */}

                    {isStudents && (
                      <td className="px-6 py-4 text-center">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.status === "Placed"
                              ? "bg-emerald-50 text-emerald-600"
                              : user.status === "Eligible"
                              ? "bg-indigo-50 text-indigo-600"
                              : user.status === "Training"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {user.status || "-"}
                        </span>

                      </td>
                    )}

                    {/* Actions */}

                    <td className="px-6 py-4">

                      <div className="flex items-center justify-end gap-1">

                        <button
                          type="button"
                          onClick={() =>
                            setViewUser({
                              ...user,
                              userType: isStudents
                                ? "Student"
                                : "Faculty",
                            })
                          }
                          title="View"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleEditUser(user)
                          }
                          title="Edit"
                          className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteUser(user)
                          }
                          title="Delete"
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

                 
          {/* Pagination */}

          {filteredUsers.length > 0 && (
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
                  Previous
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
                  Next
                </button>

              </div>
            </div>
          )}

      </div>


      {/* View Modal */}

      {viewUser && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setViewUser(null)}
        >

          <div
            className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="flex items-start justify-between border-b border-slate-200 p-6">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                  {viewUser.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                    {viewUser.userType}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {viewUser.name}
                  </h2>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setViewUser(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">

              <InfoCard
                icon={<Mail size={17} />}
                label="Email"
                value={viewUser.email}
              />

              <InfoCard
                icon={<Phone size={17} />}
                label="Phone"
                value={viewUser.phone}
              />

              <InfoCard
                icon={<Building2 size={17} />}
                label="Department"
                value={viewUser.department}
              />

              <InfoCard
                icon={
                  isStudents
                    ? <GraduationCap size={17} />
                    : <BriefcaseBusiness size={17} />
                }
                label={
                  isStudents
                    ? "Register Number"
                    : "Employee ID"
                }
                value={
                  isStudents
                    ? viewUser.registerNumber
                    : viewUser.employeeId
                }
              />

              <InfoCard
                icon={<Users size={17} />}
                label={
                  isStudents
                    ? "Year"
                    : "Designation"
                }
                value={
                  isStudents
                    ? viewUser.year
                    : viewUser.designation
                }
              />

              {isStudents && (
                <InfoCard
                  icon={<GraduationCap size={17} />}
                  label="CGPA"
                  value={viewUser.cgpa}
                />
              )}

              {isStudents && (
                <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Skills
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    {viewUser.skills || "-"}
                  </p>
                </div>
              )}

              {isStudents && (
                <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Placement Status
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    {viewUser.status || "-"}
                  </p>
                </div>
              )}

            </div>

            <div className="flex justify-end border-t border-slate-200 p-6">

              <button
                type="button"
                onClick={() => setViewUser(null)}
                className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Add / Edit Modal */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between  border-slate-200 p-6">

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                  {isStudents ? "Student" : "Faculty"}
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {editingUser
                    ? `Edit ${userType}`
                    : `Add ${userType}`}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the {userType.toLowerCase()} details below.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSaveUser}
              className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2"
            >

              {/* Name */}

              <FormField
                label="Full Name"
                name="name"
                value={
                  isStudents
                    ? studentForm.name
                    : facultyForm.name
                }
                onChange={(event) => {
                  if (isStudents) {
                    setStudentForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }));
                  } else {
                    setFacultyForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }));
                  }
                }}
                placeholder="Enter full name"
              />

              {/* ID */}

              <FormField
                label={
                  isStudents
                    ? "Register Number"
                    : "Employee ID"
                }
                name={
                  isStudents
                    ? "registerNumber"
                    : "employeeId"
                }
                value={
                  isStudents
                    ? studentForm.registerNumber
                    : facultyForm.employeeId
                }
                onChange={(event) => {
                  if (isStudents) {
                    setStudentForm((previous) => ({
                      ...previous,
                      registerNumber:
                        event.target.value,
                    }));
                  } else {
                    setFacultyForm((previous) => ({
                      ...previous,
                      employeeId:
                        event.target.value,
                    }));
                  }
                }}
                placeholder={
                  isStudents
                    ? "Example: 22CS101"
                    : "Example: FAC001"
                }
              />

              {/* Department */}

              <FormField
                label="Department"
                name="department"
                value={
                  isStudents
                    ? studentForm.department
                    : facultyForm.department
                }
                onChange={(event) => {
                  if (isStudents) {
                    setStudentForm((previous) => ({
                      ...previous,
                      department:
                        event.target.value,
                    }));
                  } else {
                    setFacultyForm((previous) => ({
                      ...previous,
                      department:
                        event.target.value,
                    }));
                  }
                }}
                placeholder="Computer Science"
              />

              {/* Year / Designation */}

              <FormField
                label={
                  isStudents
                    ? "Year"
                    : "Designation"
                }
                name={
                  isStudents
                    ? "year"
                    : "designation"
                }
                value={
                  isStudents
                    ? studentForm.year
                    : facultyForm.designation
                }
                onChange={(event) => {
                  if (isStudents) {
                    setStudentForm((previous) => ({
                      ...previous,
                      year: event.target.value,
                    }));
                  } else {
                    setFacultyForm((previous) => ({
                      ...previous,
                      designation:
                        event.target.value,
                    }));
                  }
                }}
                placeholder={
                  isStudents
                    ? "Final Year"
                    : "Assistant Professor"
                }
              />

              {/* Email */}

              <FormField
                label="Email"
                type="email"
                name="email"
                value={
                  isStudents
                    ? studentForm.email
                    : facultyForm.email
                }
                onChange={(event) => {
                  if (isStudents) {
                    setStudentForm((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }));
                  } else {
                    setFacultyForm((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }));
                  }
                }}
                placeholder="user@college.edu"
              />

              {/* Phone */}

              <FormField
                label="Phone"
                type="tel"
                name="phone"
                value={
                  isStudents
                    ? studentForm.phone
                    : facultyForm.phone
                }
                onChange={(event) => {
                  if (isStudents) {
                    setStudentForm((previous) => ({
                      ...previous,
                      phone: event.target.value,
                    }));
                  } else {
                    setFacultyForm((previous) => ({
                      ...previous,
                      phone: event.target.value,
                    }));
                  }
                }}
                placeholder="Phone number"
              />

              {/* Student-only */}

              {isStudents && (
                <>
                  <FormField
                    label="CGPA"
                    type="number"
                    name="cgpa"
                    min="0"
                    max="10"
                    step="0.1"
                    value={studentForm.cgpa}
                    onChange={(event) =>
                      setStudentForm(
                        (previous) => ({
                          ...previous,
                          cgpa: event.target.value,
                        })
                      )
                    }
                    placeholder="Example: 8.5"
                  />

                  <FormField
                    label="Skills"
                    name="skills"
                    value={studentForm.skills}
                    onChange={(event) =>
                      setStudentForm(
                        (previous) => ({
                          ...previous,
                          skills: event.target.value,
                        })
                      )
                    }
                    placeholder="React, Java, Python"
                  />
                </>
              )}

              {/* Footer */}

              <div className="flex justify-end gap-3 border-slate-200 pt-5 md:col-span-2">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                >
                  {editingUser
                    ? `Update ${userType}`
                    : `Add ${userType}`}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* Bin Modal */}

      {showBin && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 p-6">

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
                  Recycle Bin
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Deleted {isStudents ? "Students" : "Faculty"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Deleted users can be restored from here.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseBin}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            <div className="max-h-[60vh] overflow-y-auto p-6">

              {binLoading ? (

                <div className="py-10 text-center text-slate-500">
                  Loading deleted users...
                </div>

              ) : deletedUsers.length === 0 ? (

                <div className="py-10 text-center">

                  <Trash2
                    size={42}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 font-semibold text-slate-700">
                    Bin is empty
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Deleted users will appear here.
                  </p>

                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[800px]">

                    <thead className="border-b border-slate-200 bg-slate-50">

                      <tr>

                        <th className="w-12 px-4 py-3 text-center">
  <input
    type="checkbox"
    checked={allDeletedSelected}
    onChange={handleSelectAllDeleted}
    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
  />
</th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">
                          Name
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">
                          ID
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">
                          Department
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">
                          Email
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-400">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {deletedUsers.map((user) => (

                        <tr
                          key={user.id}
                          className="border-b border-slate-100"
                        >

                          <td className="w-12 px-4 py-4 text-center">
  <input
    type="checkbox"
    checked={selectedDeletedIds.includes(
      Number(user.id)
    )}
    onChange={() =>
      handleSelectDeletedUser(user.id)
    }
    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
  />
</td>

                          <td className="px-4 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                                {user.name
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                              </div>

                              <span className="font-semibold text-slate-900">
                                {user.name}
                              </span>

                            </div>

                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {isStudents
                              ? user.registerNumber
                              : user.employeeId}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {user.department}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {user.email}
                          </td>

                          <td className="px-4 py-4 text-right">

                            <button
                              type="button"
                              onClick={() =>
                                handleRestore(user.id)
                              }
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

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 p-6">

  {selectedDeletedIds.length > 0 && (
    <button
      type="button"
      onClick={handleRestoreSelected}
      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
    >
      <RotateCcw size={18} />
      Restore Selected ({selectedDeletedIds.length})
    </button>
  )}

  <button
    type="button"
    onClick={handleCloseBin}
    className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
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

/*
 * Small reusable information card
 */

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <p className="text-xs font-medium uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="mt-2 break-words font-semibold text-slate-900">
        {value || "-"}
      </p>

    </div>
  );
}

/*
 * Small reusable form field
 */

function FormField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />

    </div>
  );
}

export default UsersPage;