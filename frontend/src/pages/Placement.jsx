import { useState, useEffect } from "react";
import { useCollege } from "../context/CollegeContext";
import { useAuth } from "../context/AuthContext";
import {
  Building2,
  BriefcaseBusiness,
  Users,
  Plus,
  X,
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Placement() {

  const { user } = useAuth();
  const isFaculty = user?.role === "Faculty";
const isAdmin = user?.role === "Admin";

 const {
  drives,
  addDrive,
  updateDrive,
  deleteDrive,
  getDeletedDrives,
  restoreDrive,
  companies,
} = useCollege();

    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");

const [selectedDriveIds, setSelectedDriveIds] = useState([]);
const [selectedDeletedDriveIds, setSelectedDeletedDriveIds] = useState([]);

const [viewDrive, setViewDrive] = useState(null);
const [editingDrive, setEditingDrive] = useState(null);
const [editFormData, setEditFormData] = useState({
  companyId: "",
  role: "",
  package: "",
  openings: "",
  location: "",
  eligibility: "",
  date: "",
  status: "Active",
});

const [showBin, setShowBin] = useState(false);
const [deletedDrives, setDeletedDrives] = useState([]);
const [binLoading, setBinLoading] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 10;

const [formData, setFormData] = useState({
  companyId: "",
  role: "",
  package: "",
  openings: "",
  location: "",
  eligibility: "",
  date: "",
  status: "Active",
});

const filteredDrives = drives.filter((drive) =>
  `${drive.companyDetails?.name || ""} ${drive.role} ${drive.package}`
    .toLowerCase()
    .includes(search.toLowerCase())
);

const totalPages = Math.ceil(
  filteredDrives.length / rowsPerPage
);

const startIndex = (currentPage - 1) * rowsPerPage;

const paginatedDrives = filteredDrives.slice(
  startIndex,
  startIndex + rowsPerPage
);

const handleChange = (event) => {
  const { name, value } = event.target;

  setFormData((previous) => ({
    ...previous,
    [name]: value,
  }));
};

const handleCreateDrive = async () => {
  if (
    !formData.companyId ||
    !formData.role ||
    !formData.package ||
    !formData.openings ||
    !formData.location ||
    !formData.eligibility ||
    !formData.date
  ) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    await addDrive({
      companyId: Number(formData.companyId),
      role: formData.role,
      package: formData.package,
      openings: Number(formData.openings),
      location: formData.location,
      eligibility: formData.eligibility,
      date: formData.date,
      status: "Active",
    });

    setFormData({
      companyId: "",
      role: "",
      package: "",
      openings: "",
      location: "",
      eligibility: "",
      date: "",
      status: "Active",
    });

    setShowModal(false);

    alert("Placement drive created successfully.");
  } catch (error) {
    console.error(
      "Failed to create placement drive:",
      error
    );

    alert("Failed to create placement drive.");
  }
};

const handleSelectAllDrives = (event) => {
  if (event.target.checked) {
    setSelectedDriveIds(
      filteredDrives.map((drive) => drive.id)
    );
  } else {
    setSelectedDriveIds([]);
  }
};

const handleSelectDrive = (id) => {
  setSelectedDriveIds((previous) =>
    previous.includes(id)
      ? previous.filter((driveId) => driveId !== id)
      : [...previous, id]
  );
};

const handleDeleteSelected = async () => {
  if (selectedDriveIds.length === 0) {
    alert("Please select at least one placement drive.");
    return;
  }

  const confirmed = window.confirm(
    `Delete ${selectedDriveIds.length} selected placement drive(s)?`
  );

  if (!confirmed) {
    return;
  }

  try {
    for (const id of selectedDriveIds) {
      await deleteDrive(id);
    }

    setSelectedDriveIds([]);

    alert("Selected placement drives moved to Bin.");
  } catch (error) {
    console.error(
      "Failed to delete selected placement drives:",
      error
    );

    alert("Failed to delete selected placement drives.");
  }
};

const handleDeleteDrive = async (drive) => {
  const confirmed = window.confirm(
    `Delete ${
      drive.companyDetails?.name || "this company"
    } placement drive?`
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteDrive(drive.id);

    setSelectedDriveIds((previous) =>
      previous.filter((id) => id !== drive.id)
    );

    alert("Placement drive moved to Bin.");
  } catch (error) {
    console.error(
      "Failed to delete placement drive:",
      error
    );

    alert("Failed to delete placement drive.");
  }
};

const handleRestoreDrive = async (id) => {
  try {
    await restoreDrive(id);

    // Remove restored drive from Bin
    setDeletedDrives((previous) =>
      previous.filter((item) => item.id !== id)
    );

    // Remove restored drive ID from selected checkboxes
    setSelectedDeletedDriveIds((previous) =>
      previous.filter((driveId) => driveId !== id)
    );

    alert("Placement drive restored successfully.");

  } catch (error) {
    console.error(
      "Failed to restore placement drive:",
      error
    );

    alert("Failed to restore placement drive.");
  }
};

const openBin = async () => {
  setShowBin(true);

  // Clear previous selections
  setSelectedDeletedDriveIds([]);

  setBinLoading(true);

  try {
    const data = await getDeletedDrives();

    setDeletedDrives(data);
  } catch (error) {
    console.error(
      "Failed to load deleted placement drives:",
      error
    );

    alert("Failed to load Bin.");
  } finally {
    setBinLoading(false);
  }
};

const closeBin = () => {
  setShowBin(false);

  // Clear selected checkboxes
  setSelectedDeletedDriveIds([]);
};

const handleEditChange = (event) => {
  const { name, value } = event.target;

  setEditFormData((previous) => ({
    ...previous,
    [name]: value,
  }));
};

const handleUpdateDrive = async () => {
  if (
    !editFormData.companyId ||
    !editFormData.role ||
    !editFormData.package ||
    !editFormData.openings ||
    !editFormData.location ||
    !editFormData.eligibility ||
    !editFormData.date ||
    !editFormData.status
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    await updateDrive(editingDrive.id, {
      companyId: Number(editFormData.companyId),
      role: editFormData.role,
      package: editFormData.package,
      openings: Number(editFormData.openings),
      location: editFormData.location,
      eligibility: editFormData.eligibility,
      date: editFormData.date,
      status: editFormData.status,
    });

    setEditingDrive(null);

    alert("Placement drive updated successfully.");
  } catch (error) {
    console.error(
      "Failed to update placement drive:",
      error
    );

    alert("Failed to update placement drive.");
  }
};

const handleSelectAllDeletedDrives = (event) => {
  if (event.target.checked) {
    setSelectedDeletedDriveIds(
      deletedDrives.map((drive) => drive.id)
    );
  } else {
    setSelectedDeletedDriveIds([]);
  }
};

const handleSelectDeletedDrive = (id) => {
  setSelectedDeletedDriveIds((previous) =>
    previous.includes(id)
      ? previous.filter((driveId) => driveId !== id)
      : [...previous, id]
  );
};

const handleRestoreSelectedDrives = async () => {
  if (selectedDeletedDriveIds.length === 0) {
    alert("Please select at least one placement drive.");
    return;
  }

  const confirmed = window.confirm(
    `Restore ${selectedDeletedDriveIds.length} selected placement drive(s)?`
  );

  if (!confirmed) {
    return;
  }

  try {
    for (const id of selectedDeletedDriveIds) {
      await restoreDrive(id);
    }

    setDeletedDrives((previous) =>
      previous.filter(
        (drive) => !selectedDeletedDriveIds.includes(drive.id)
      )
    );

    setSelectedDeletedDriveIds([]);

    alert("Selected placement drives restored successfully.");
  } catch (error) {
    console.error(
      "Failed to restore selected placement drives:",
      error
    );

    alert("Failed to restore selected placement drives.");
  }
};


  return (
    <div className="w-full p-8">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <p className="text-sm font-semibold text-indigo-600">
    {user?.role === "Faculty"
      ? "FACULTY PORTAL"
     :"ADMIN PORTAL"
      }
  </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Placement
          </h1>

          <p className="mt-2 text-slate-500">
            Manage companies, recruitment drives and student placements.
          </p>
        </div>

        {isAdmin && (
        <button 
        onClick={() => setShowModal(true)}
        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700">

          <Plus size={20} />

          New Placement Drive

        </button>
        )}

      </div>

      {/* Statistics */}

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* Companies */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Building2 size={25} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Companies
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {drives.length}
              </h2>
            </div>

          </div>

        </div>

        {/* Drives */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <BriefcaseBusiness size={25} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Placement Drives
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {drives.length}
              </h2>
            </div>

          </div>

        </div>

        {/* Placed Students */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Users size={25} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Students Placed
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {drives.length}
              </h2>
            </div>

          </div>

        </div>

      </div>


      {/* Search */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div className="relative max-w-md flex-1">

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
          placeholder="Search placement drives..."
          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

      </div>

      {/* Actions */}

      <div className="flex flex-wrap gap-3">

        {/* Delete Selected */}

        {isAdmin && (
         <>
        {selectedDriveIds.length > 0 && (

          <button
            type="button"
            onClick={handleDeleteSelected}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
          >

            <Trash2 size={18} />

            Delete Selected ({selectedDriveIds.length})

          </button>

        )}

        {/* Bin */}

        <button
          type="button"
          onClick={openBin}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >

          <Trash2 size={18} />

          Bin

        </button>
        </>
        )}

      </div> 

    </div>

  </div>


      {/* Placement Drives */}

<div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

  {/* Table */}

  <div className="overflow-x-auto">

    <table className="w-full min-w-[1100px]">

      <thead className="bg-slate-50">

        <tr>

          {/* Select All */}

          {isAdmin && (
          <th className="w-12 px-6 py-4 text-center">

            <input
              type="checkbox"
              checked={
                filteredDrives.length > 0 &&
                selectedDriveIds.length ===
                  filteredDrives.length
              }
              onChange={handleSelectAllDrives}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />

          </th>
          )}

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
            Company
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
            Job Role
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
            Openings
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
            Package
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
            Drive Date
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
            Status
          </th>

          <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
            Actions
          </th>

        </tr>

      </thead>

      <tbody>

        {paginatedDrives.map((drive) => (

          <tr
            key={drive.id}
            className="border-b border-slate-100 hover:bg-slate-50"
          >

            {/* Checkbox */}
            {isAdmin && (
            <td className="w-12 px-6 py-5 text-center">

              <input
                type="checkbox"
                checked={selectedDriveIds.includes(
                  drive.id
                )}
                onChange={() =>
                  handleSelectDrive(drive.id)
                }
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />

            </td>
            )}

            {/* Company */}

            <td className="px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-600">
                  {(drive.companyDetails?.name || "?")
                    .charAt(0)
                   .toUpperCase()}
                </div>

                <span className="font-semibold text-slate-900">
                  {drive.companyDetails?.name || "Unknown Company"}
                </span>

              </div>

            </td>

            {/* Role */}

            <td className="px-6 py-5 text-sm text-slate-600">
              {drive.role}
            </td>

            {/* Openings */}

            <td className="px-6 py-5 text-sm text-slate-600">
              {drive.openings}
            </td>

            {/* Package */}

            <td className="px-6 py-5">

              <span className="font-semibold text-slate-900">
                {drive.package}
              </span>

            </td>

            {/* Date */}

            <td className="px-6 py-5 text-sm text-slate-600">
              {drive.date}
            </td>

            {/* Status */}

            <td className="px-6 py-5">

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  drive.status === "Active"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {drive.status}
              </span>

            </td>

            {/* Actions */}

            <td className="px-6 py-5">

              <div className="flex justify-end gap-2">

                {/* View */}

                <button
                  type="button"
                  onClick={() =>
                    setViewDrive(drive)
                  }
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >

                  <Eye size={16} />
                </button>

                {/* Edit */}

                <button
                  type="button"
                  onClick={() => {
  setEditingDrive(drive);

  setEditFormData({
    companyId: drive.companyId ?? "",
    role: drive.role || "",
    package: drive.package || "",
    openings: drive.openings ?? 0,
    location: drive.location || "",
    eligibility: drive.eligibility || "",
    date: drive.date
      ? drive.date.split("T")[0]
      : "",
    status: drive.status || "Active",
  });
}}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                >

                  <Pencil size={16} />
                </button>

                {/* Delete */}
                {isAdmin && (             
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteDrive(drive)
                  }
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                >

                  <Trash2 size={16} />
                </button>
                )}

              </div>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

  {/* No results */}

  {filteredDrives.length === 0 && (

    <div className="p-10 text-center text-sm text-slate-500">
      No placement drives found.
    </div>

  )}


  {/* Pagination */}

  {filteredDrives.length > 0 && (
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

    <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 p-6">

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            New Placement Drive
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create a new recruitment drive.
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

        {/* Company */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Company Name
          </label>

           <select
    name="companyId"
    value={formData.companyId}
    onChange={handleChange}
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  >
    <option value="">Select company</option>

    {companies.map((company) => (
      <option key={company.id} value={company.id}>
        {company.name}
      </option>
    ))}
  </select>
        </div>

        {/* Job Role */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Job Role
          </label>

          <input
  type="text"
  name="role"
  placeholder="Example: Software Developer"
  value={formData.role}
  onChange={handleChange}
  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
/>
        </div>

        <div>
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Openings
  </label>

  <input
    type="number"
    name="openings"
    min="1"
    placeholder="Example: 50"
    value={formData.openings}
    onChange={handleChange}
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  />
</div>

<div>
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Location
  </label>

  <input
    type="text"
    name="location"
    placeholder="Example: Chennai"
    value={formData.location}
    onChange={handleChange}
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  />
</div>

<div>
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Eligibility
  </label>

  <input
    type="text"
    name="eligibility"
    placeholder="Example: CGPA 7.0+, CSE/IT"
    value={formData.eligibility}
    onChange={handleChange}
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  />
</div>

        {/* Package */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Package
          </label>

          <input
  type="text"
  name="package"
  placeholder="Example: 7.5 LPA"
  value={formData.package}
  onChange={handleChange}
  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
/>
        </div>

      

        {/* Drive Date */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Drive Date
          </label>

          <input
  type="date"
  name="date"
  value={formData.date}
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
          onClick={handleCreateDrive}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Create Placement Drive
        </button>

      </div>

    </div>

  </div>
)}


{viewDrive && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

      <div className="flex items-center justify-between border-b border-slate-200 p-6">

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            Placement Drive Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Recruitment drive information
          </p>

        </div>

        <button
          type="button"
          onClick={() => setViewDrive(null)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <X size={20} />
        </button>

      </div>

      <div className="space-y-4 p-6">

        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            Company
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {viewDrive.companyDetails?.name || "Unknown Company"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            Job Role
          </p>

          <p className="mt-1 text-slate-700">
            {viewDrive.role}
          </p>
        </div>

        <div>
  <p className="text-xs font-semibold uppercase text-slate-400">
    Openings
  </p>

  <p className="mt-1 text-slate-700">
    {viewDrive.openings}
  </p>
</div>

<div>
  <p className="text-xs font-semibold uppercase text-slate-400">
    Location
  </p>

  <p className="mt-1 text-slate-700">
    {viewDrive.location}
  </p>
</div>

<div>
  <p className="text-xs font-semibold uppercase text-slate-400">
    Eligibility
  </p>

  <p className="mt-1 text-slate-700">
    {viewDrive.eligibility}
  </p>
</div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            Package
          </p>

          <p className="mt-1 font-semibold text-indigo-600">
            {viewDrive.package}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            Drive Date
          </p>

          <p className="mt-1 text-slate-700">
            {viewDrive.date}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            Status
          </p>

          <p className="mt-1 text-slate-700">
            {viewDrive.status}
          </p>
        </div>

      </div>

      <div className="flex justify-end border-t border-slate-200 p-6">

        <button
          type="button"
          onClick={() => setViewDrive(null)}
          className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
        >
          Close
        </button>

      </div>

    </div>

  </div>
)}

{editingDrive && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

    <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">

      {/* Header */}

      <div className="flex items-center justify-between border-slate-200 p-6">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Edit Placement Drive
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update placement drive information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditingDrive(null)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <X size={20} />
        </button>

      </div>


      {/* Form */}

      <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

        {/* Company */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Company Name
          </label>

          <select
  name="companyId"
  value={editFormData.companyId}
  onChange={handleEditChange}
  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
>
  <option value="">Select company</option>

  {companies.map((company) => (
    <option key={company.id} value={company.id}>
      {company.name}
    </option>
  ))}
</select>
        </div>


        {/* Role */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Job Role
          </label>

          <input
            type="text"
            name="role"
            value={editFormData.role}
            onChange={handleEditChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>


        {/* Package */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Package
          </label>

          <input
            type="text"
            name="package"
            value={editFormData.package}
            onChange={handleEditChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>


        {/* Openings */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Openings
          </label>

          <input
            type="number"
            name="openings"
            min="0"
            value={editFormData.openings}
            onChange={handleEditChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Location
  </label>

  <input
    type="text"
    name="location"
    value={editFormData.location}
    onChange={handleEditChange}
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  />
</div>

<div>
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Eligibility
  </label>

  <input
    type="text"
    name="eligibility"
    value={editFormData.eligibility}
    onChange={handleEditChange}
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  />
</div>


        {/* Drive Date */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Drive Date
          </label>

          <input
            type="date"
            name="date"
            value={editFormData.date}
            onChange={handleEditChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Status
  </label>

  <select
    name="status"
    value={editFormData.status}
    onChange={handleEditChange}
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  >
    <option value="Active">Active</option>
    <option value="Closed">Closed</option>
  </select>
</div>
      </div>


      {/* Footer */}

      <div className="flex justify-end gap-3 border-slate-200 p-6">

        <button
          type="button"
          onClick={() => setEditingDrive(null)}
          className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleUpdateDrive}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Update Placement Drive
        </button>

      </div>

    </div>

  </div>
)}

{showBin && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

    <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 p-6">

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            Placement Drive Recycle Bin
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Deleted placement drives can be restored from here.
          </p>

        </div>

        <button
          type="button"
          onClick={closeBin}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <X size={20} />
        </button>

      </div>

      {/* Content */}

      <div className="max-h-[60vh] overflow-y-auto p-6">

        {deletedDrives.length === 0 ? (

          <div className="py-10 text-center">

            <Trash2
              size={40}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 font-semibold text-slate-700">
              Bin is empty
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Deleted placement drives will appear here.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead>

                <tr className="border-b border-slate-200 text-left">


    <th className="w-12 px-4 py-3 text-center">

      <input
        type="checkbox"
        checked={
          deletedDrives.length > 0 &&
          selectedDeletedDriveIds.length === deletedDrives.length
        }
        onChange={handleSelectAllDeletedDrives}
        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />

    </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-400">
                    Company
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-400">
                    Job Role
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-400">
                    Package
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-400">
                    Drive Date
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-400">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {deletedDrives.map((drive) => (

                  <tr
                    key={drive.id}
                    className="border-b border-slate-100"
                  >

                    <td className="w-12 px-4 py-4 text-center">

  <input
    type="checkbox"
    checked={selectedDeletedDriveIds.includes(drive.id)}
    onChange={() => handleSelectDeletedDrive(drive.id)}
    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
  />

</td>

                    <td className="px-4 py-4">

                      <p className="font-semibold text-slate-900">
                        {drive.companyDetails?.name || "Unknown Company"}
                      </p>

                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {drive.role}
                    </td>

                    <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                      {drive.package}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {drive.date}
                    </td>

                    <td className="px-4 py-4 text-right">

                      <button
                        type="button"
                        onClick={() =>
                          handleRestoreDrive(drive.id)
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-100"
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

      <div className="flex justify-end border-t border-slate-200 p-6">

        {selectedDeletedDriveIds.length > 0 && (

    <button
      type="button"
      onClick={handleRestoreSelectedDrives}
      className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
    >

      <RotateCcw size={16} />

      Restore Selected ({selectedDeletedDriveIds.length})

    </button>

  )}

        <button
          type="button"
          onClick={closeBin}
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

export default Placement;