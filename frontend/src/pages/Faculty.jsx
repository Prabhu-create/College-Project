import { useState, useEffect, useRef } from "react";
import { useCollege } from "../context/CollegeContext";
import {
  UsersRound,
  MoreVertical,
  Eye,
  X, 
  RotateCcw,
  Pencil,
  Trash2,
  GraduationCap,
  Building2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Faculty() {
  const {
    faculty,
    facultyLoading,
    facultyError,
    addFaculty,
    editFaculty,
    removeFaculty,
    getDeletedFaculty,
    restoreFaculty,
  } = useCollege();

  const emptyForm = {
    name: "",
    employeeId: "",
    department: "",
    email: "",
    phone: "",
    designation: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [viewFaculty, setViewFaculty] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedFacultyIds, setSelectedFacultyIds] = useState([]);
  const [selectedDeletedFacultyIds, setSelectedDeletedFacultyIds] =
  useState([]);
  const [showBinModal, setShowBinModal] = useState(false);
  const [binLoading, setBinLoading] = useState(false);
  const [deletedFaculty, setDeletedFaculty] = useState([]);
  const [toast, setToast] = useState({
  show: false,
  message: "",
  type: "success",
});
const [currentPage, setCurrentPage] = useState(1);

const rowsPerPage = 10;

  const menuRef = useRef(null);

useEffect(() => {
  const handleOutsideClick = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setSelectedFaculty(null);
    }
  };

  document.addEventListener("mousedown", handleOutsideClick);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleOutsideClick
    );
  };
}, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

 const handleSubmit = async (event) => {
  event.preventDefault();

  if (
    !form.name ||
    !form.employeeId ||
    !form.department ||
    !form.email ||
    !form.phone ||
    !form.designation
  ) {
    showToast("Please fill all fields.", "error");
    return;
  }

  try {
    if (editingId) {
      await editFaculty(editingId, form);

      showToast("Faculty updated successfully!");
    } else {
      await addFaculty(form);

      showToast("Faculty added successfully!");
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowFacultyModal(false);

  } catch (error) {
    console.error("Failed to save faculty:", error);

    if (editingId) {
      showToast("Failed to Update faculty", "error");
    } else {
      showToast("Failed to Add faculty", "error");
    }
  }
};

  const handleEdit = (faculty) => {
  setEditingId(faculty.id);

  setForm({
    name: faculty.name || "",
    employeeId: faculty.employeeId || "",
    department: faculty.department || "",
    designation: faculty.designation || "",
    email: faculty.email || "",
    phone: faculty.phone || "",
  });

  setShowFacultyModal(true);
};

const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this faculty member?"
  );

  if (!confirmed) return;

  try {
    await removeFaculty(id);

    // Remove deleted faculty from selection
    setSelectedFacultyIds((previous) =>
      previous.filter(
        (facultyId) => facultyId !== id
      )
    );

    showToast("Faculty deleted successfully.");

  } catch (error) {
    console.error(
      "Failed to delete faculty:",
      error
    );

    showToast(
      "Failed to delete faculty.",
      "error"
    );
  }
};

  const handleCancel = () => {
  setShowFacultyModal(false);
  setEditingId(null);

  setForm({
    name: "",
    employeeId: "",
    department: "",
    designation: "",
    email: "",
    phone: "",
  });
};

  if (facultyLoading) {
    return (
      <div className="w-full p-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Loading faculty...
          </p>
        </div>
      </div>
    );
  }

  if (facultyError) {
    return (
      <div className="w-full p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-600">
            {facultyError}
          </p>
        </div>
      </div>
    );
  }

  const filteredFaculty = faculty.filter((item) => {
  const searchValue = search.toLowerCase().trim();

  return (
    item.name?.toLowerCase().includes(searchValue) ||
    item.employeeId?.toLowerCase().includes(searchValue) ||
    item.department?.toLowerCase().includes(searchValue)
  );
});

const totalPages = Math.ceil(
  filteredFaculty.length / rowsPerPage
);

const startIndex = (currentPage - 1) * rowsPerPage;

const paginatedFaculty = filteredFaculty.slice(
  startIndex,
  startIndex + rowsPerPage
);

const showToast = (message, type = "success") => {
  setToast({
    show: true,
    message,
    type,
  });

  setTimeout(() => {
    setToast({
      show: false,
      message: "",
      type: "success",
    });
  }, 3000);
};

const handleSelectAllFaculty = (event) => {
  if (event.target.checked) {
    setSelectedFacultyIds((previous) => {
      const currentPageIds = paginatedFaculty.map(
        (item) => item.id
      );

      return [
        ...new Set([
          ...previous,
          ...currentPageIds,
        ]),
      ];
    });
  } else {
    const currentPageIds = paginatedFaculty.map(
      (item) => item.id
    );

    setSelectedFacultyIds((previous) =>
      previous.filter(
        (id) => !currentPageIds.includes(id)
      )
    );
  }
};

const handleSelectFaculty = (id) => {
  setSelectedFacultyIds((previous) =>
    previous.includes(id)
      ? previous.filter((facultyId) => facultyId !== id)
      : [...previous, id]
  );
};

const handleDeleteSelected = async () => {
  if (selectedFacultyIds.length === 0) {
    alert("Please select at least one faculty.");
    return;
  }

  const confirmed = window.confirm(
    `Delete ${selectedFacultyIds.length} selected faculty member(s)?`
  );

  if (!confirmed) {
    return;
  }

  try {
    for (const id of selectedFacultyIds) {
      await removeFaculty(id);
    }

    setSelectedFacultyIds([]);

    alert("Selected faculty deleted successfully.");
  } catch (error) {
    console.error(
      "Failed to delete selected faculty:",
      error
    );

    alert("Failed to delete selected faculty.");
  }
};

const loadDeletedFaculty = async () => {
  try {
    const data = await getDeletedFaculty();

    setDeletedFaculty(data);
  } catch (error) {
    console.error("Failed to load deleted faculty:", error);
  }
};

const handleOpenBin = async () => {
  try {
    setBinLoading(true);

    // Important: clear old selections
    setSelectedDeletedFacultyIds([]);

    const data = await getDeletedFaculty();

    setDeletedFaculty(data);
    setShowBinModal(true);

  } catch (error) {
    console.error(
      "Failed to load deleted faculty:",
      error
    );

    showToast(
      "Failed to load deleted faculty.",
      "error"
    );

  } finally {
    setBinLoading(false);
  }
};

const handleRestoreFaculty = async (facultyId) => {
  try {
    await restoreFaculty(facultyId);

    setDeletedFaculty((previous) =>
      previous.filter(
        (item) => item.id !== facultyId
      )
    );

    setSelectedDeletedFacultyIds((previous) =>
      previous.filter(
        (id) => id !== facultyId
      )
    );

    showToast("Faculty restored successfully!");

    return true;

  } catch (error) {
    console.error(
      "Failed to restore faculty:",
      error
    );

    showToast(
      "Failed to restore faculty.",
      "error"
    );

    return false;
  }
};

const handleSelectDeletedFaculty = (id) => {
  setSelectedDeletedFacultyIds((previous) =>
    previous.includes(id)
      ? previous.filter(
          (facultyId) => facultyId !== id
        )
      : [...previous, id]
  );
};

const handleSelectAllDeletedFaculty = (event) => {
  if (event.target.checked) {
    setSelectedDeletedFacultyIds(
      deletedFaculty.map((item) => item.id)
    );
  } else {
    setSelectedDeletedFacultyIds([]);
  }
};

const handleRestoreSelectedFaculty = async () => {
  if (selectedDeletedFacultyIds.length === 0) {
    return;
  }

  const confirmed = window.confirm(
    `Restore ${selectedDeletedFacultyIds.length} selected faculty member(s)?`
  );

  if (!confirmed) return;

  try {
    for (const id of selectedDeletedFacultyIds) {
      await restoreFaculty(id);
    }

    // Remove restored faculty from bin
    setDeletedFaculty((previous) =>
      previous.filter(
        (item) =>
          !selectedDeletedFacultyIds.includes(item.id)
      )
    );

    setSelectedDeletedFacultyIds([]);

    showToast(
      "Selected faculty restored successfully."
    );

  } catch (error) {
    console.error(
      "Failed to restore selected faculty:",
      error
    );

    showToast(
      "Failed to restore selected faculty.",
      "error"
    );
  }
};



  return (
    <div className="w-full p-8">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <p className="text-sm font-semibold text-indigo-600">
            ADMIN PORTAL
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Faculty Management
          </h1>

          <p className="mt-2 text-slate-500">
            Manage faculty members and their details.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setShowFacultyModal(true);
          }}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          + Add Faculty
        </button>

      </div>

      {/* Summary */}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          
           <div className="flex items-center gap-4">

    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
      <UsersRound
        size={24}
        className="text-indigo-600"
      />
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Total Faculty
      </p>

      <h2 className="mt-1 text-3xl font-bold text-slate-900">
        {faculty.length}
      </h2>
    </div>
</div>
  </div>
  
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
      <Building2
        size={24}
        className="text-indigo-600"
      />
    </div>

        <div>
          <p className="text-sm text-slate-500">
            Departments
          </p>

          <h2 className="mt-2 text-3xl font-bold text-indigo-600">
            {new Set(
              faculty.map((item) => item.department)
            ).size}
          </h2>
        </div>
        </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
      <GraduationCap
        size={24}
        className="text-indigo-600"
      />
    </div>

        <div>
          <p className="text-sm text-slate-500">
            Professors
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {
              faculty.filter(
                (item) =>
                  item.designation
                    ?.toLowerCase()
                    .includes("professor")
              ).length
            }
          </h2>
        </div>
        </div>
        </div>

      </div>

      {/* Form */}

  
{/* Add / Edit Faculty Modal */}

{showFacultyModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 ">

    {/* Modal */}

    <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

      {/* Modal Header */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {editingId
              ? "Edit Faculty"
              : "Add Faculty"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {editingId
              ? "Update faculty member details."
              : "Add a new faculty member to the college."}
          </p>
        </div>

        {/* Close Button */}

        <button
          type="button"
          onClick={handleCancel}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          ✕
        </button>

      </div>


      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2"
      >

        {/* Name */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Name
          </label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Faculty name"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>


        {/* Employee ID */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Employee ID
          </label>

          <input
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            placeholder="Example: FAC001"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>


        {/* Department */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Department
          </label>

          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Example: Computer Science"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>


        {/* Designation */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Designation
          </label>

          <input
            name="designation"
            value={form.designation}
            onChange={handleChange}
            placeholder="Example: Assistant Professor"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>


        {/* Email */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="faculty@college.edu"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>


        {/* Phone */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Phone
          </label>

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone number"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>


        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 md:col-span-2">

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
          >
            {editingId
              ? "Update Faculty"
              : "Add Faculty"}
          </button>

        </div>

      </form>

    </div>

  </div>
)}

{/* Search Faculty */}

<div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

    {/* Search */}

    <div className="relative max-w-md flex-1">

      <Search
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        placeholder="Search faculty by name, employee ID or department..."
        value={search}
        onChange={(event) => {
  setSearch(event.target.value);
  setCurrentPage(1);
}}
        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />

    </div>

    {/* Right side actions */}

    <div className="flex items-center gap-3">

      {/* Bulk Delete */}

    
{selectedFacultyIds.length > 0 && (
  <button
    type="button"
    onClick={handleDeleteSelected}
    className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
  >
    <Trash2 size={18} />
    Delete Selected ({selectedFacultyIds.length})
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


      {/* Faculty Table */}

      <div className="mt-8  rounded-2xl border border-slate-200 bg-white shadow-sm">

        {faculty.length === 0 ? (

          <div className="p-12 text-center">

            <h3 className="mt-3 font-semibold text-slate-700">
              No faculty members found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add a faculty member using the button above.
            </p>

          </div>

        ) : (

          <div className="">

            <table className="w-full">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-center text-sm text-slate-500">

             {/* Select All */} 

                  <th className="px-6 py-4 text-center">
    <input 
    type="checkbox" 
    checked={
  paginatedFaculty.length > 0 &&
  paginatedFaculty.every((faculty) =>
    selectedFacultyIds.includes(faculty.id)
  )
}
    onChange={handleSelectAllFaculty} 
    className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
   </th>

                  <th className="px-6 py-4 font-medium">
                    Faculty Name
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Employee ID
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Department
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Designation
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Contact
                  </th>

                  <th className="px-6 py-4 font-medium text-center">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {paginatedFaculty.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >

                    {/* Checkbox */}

    <td className="px-6 py-4 text-center">
      <input
        type="checkbox"
        checked={selectedFacultyIds.includes(item.id)}
        onChange={() => handleSelectFaculty(item.id)}
        onClick={(event) => event.stopPropagation()}
        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />
    </td>

                    <td className="px-6 py-4 text-center">

                      <p className="font-semibold text-slate-900">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.email}
                      </p>

                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-center text-slate-700">
                      {item.employeeId}
                    </td>

                    <td className="px-6 py-4 text-sm text-center text-slate-500">
                      {item.department}
                    </td>

                    <td className="px-6 py-4 text-sm text-center text-slate-500">
                      {item.designation}
                    </td>

                    <td className="px-6 py-4 text-sm text-center text-slate-500">
                      {item.phone}
                    </td>

                    <td className="px-6 py-4">
  <div className="flex items-center justify-end gap-2">

  {/* View */}
  <button
    type="button"
    onClick={() => {
      setViewFaculty(item);
    }}
    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
    title="View faculty"
  >
    <Eye size={16} />
  </button>

  {/* Edit */}
  <button
    type="button"
    onClick={() => {
      handleEdit(item);
    }}
    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
    title="Edit faculty"
  >
    <Pencil size={16} />
  </button>

  {/* Delete */}
  <button
  type="button"
  onClick={() => handleDelete(item.id)}
  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
  title="Delete faculty"
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

        )}

                
        {/* Pagination */}

        {filteredFaculty.length > 0 && (
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

      {viewFaculty && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    onClick={() => setViewFaculty(null)}
  >
    <div
      className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      onClick={(event) => event.stopPropagation()}
    >

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Faculty Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View faculty information
          </p>
        </div>

        <button
          onClick={() => setViewFaculty(null)}
          className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
        >
          ✕
        </button>
      </div>

      <div className="mt-6 space-y-4">

        <div>
          <p className="text-xs font-medium uppercase text-slate-400">
            Name
          </p>
          <p className="mt-1 font-semibold text-slate-900">
            {viewFaculty.name}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-slate-400">
            Employee ID
          </p>
          <p className="mt-1 font-semibold text-slate-900">
            {viewFaculty.employeeId}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-slate-400">
            Department
          </p>
          <p className="mt-1 font-semibold text-slate-900">
            {viewFaculty.department}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-slate-400">
            Designation
          </p>
          <p className="mt-1 font-semibold text-slate-900">
            {viewFaculty.designation}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-slate-400">
            Email
          </p>
          <p className="mt-1 font-semibold text-slate-900">
            {viewFaculty.email}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-slate-400">
            Phone
          </p>
          <p className="mt-1 font-semibold text-slate-900">
            {viewFaculty.phone}
          </p>
        </div>

      </div>

      <button
        onClick={() => setViewFaculty(null)}
        className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
      >
        Close
      </button>

    </div>
  </div>
)}

{toast.show && (
  <div className="fixed right-6 top-6 z-[100]">
    <div
      className={`flex items-center gap-3 rounded-xl px-5 py-4 shadow-lg ${
        toast.type === "success"
          ? "bg-emerald-600 text-white"
          : "bg-red-600 text-white"
      }`}
    >
      <span className="font-medium">
        {toast.message}
      </span>

      <button
        type="button"
        onClick={() =>
          setToast({
            show: false,
            message: "",
            type: "success",
          })
        }
        className="text-white/80 hover:text-white"
      >
        ✕
      </button>
    </div>
  </div>
)}

{showBinModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

    <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 p-6">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Faculty Recycle Bin
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Deleted faculty members can be restored from here.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowBinModal(false)}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={20} />
        </button>

      </div>

      {/* Content */}
      <div className="max-h-[60vh] overflow-y-auto p-6">

        {binLoading ? (
          <div className="py-10 text-center text-slate-500">
            Loading deleted faculty...
          </div>
        ) : deletedFaculty.length === 0 ? (
          <div className="py-10 text-center">

            <Trash2
              size={40}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 font-semibold text-slate-700">
              Bin is empty
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Deleted faculty members will appear here.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  {/* Select All */}
  <th className="w-12 px-4 py-3 text-center">
    <input
      type="checkbox"
      checked={
        deletedFaculty.length > 0 &&
        deletedFaculty.every((item) =>
          selectedDeletedFacultyIds.includes(item.id)
        )
      }
      onChange={handleSelectAllDeletedFaculty}
      className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
    />
  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">
                    Faculty
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">
                    Employee ID
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">
                    Department
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">
                    Email
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">
                    Phone
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">
                    Designation
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-400">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {deletedFaculty.map((item) => (

                  <tr
  key={item.id}
  className={`border-b border-slate-100 transition hover:bg-slate-50 ${
    selectedDeletedFacultyIds.includes(item.id)
      ? "bg-indigo-50"
      : ""
  }`}
>

  {/* Checkbox */}
<td className="px-4 py-4 text-center">

  <input
    type="checkbox"
    checked={selectedDeletedFacultyIds.includes(item.id)}
    onChange={() =>
      handleSelectDeletedFaculty(item.id)
    }
    className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
  />

</td>
                    {/* Faculty */}
                    <td className="px-4 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                          {item.name?.charAt(0)}
                        </div>

                        <div>

                          <p className="font-semibold text-slate-900">
                            {item.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            Deleted faculty
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Employee ID */}
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {item.employeeId}
                    </td>

                    {/* Department */}
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {item.department}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {item.email}
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {item.phone}
                    </td>

                    {/* Designation */}
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {item.designation}
                    </td>

                    {/* Restore */}
                    <td className="px-4 py-4 text-right">

                      <button
                        type="button"
                        onClick={async () => {
  const confirmed = window.confirm(
    `Restore ${item.name}?`
  );

  if (!confirmed) return;

  await handleRestoreFaculty(item.id);

  // Remove from selected deleted IDs
  setSelectedDeletedFacultyIds((previous) =>
    previous.filter((id) => id !== item.id)
  );
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

    {selectedDeletedFacultyIds.length > 0
      ? `${selectedDeletedFacultyIds.length} faculty member(s) selected`
      : "Select faculty members to restore"}

  </div>


  <div className="flex items-center gap-3">

    {/* Restore Selected */}

    {selectedDeletedFacultyIds.length > 0 && (

      <button
        type="button"
        onClick={handleRestoreSelectedFaculty}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
      >

        <RotateCcw size={18} />

        Restore Selected (
          {selectedDeletedFacultyIds.length}
        )

      </button>

    )}


    {/* Close */}

    <button
      type="button"
      onClick={() => {
        setShowBinModal(false);
        setSelectedDeletedFacultyIds([]);
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

export default Faculty;