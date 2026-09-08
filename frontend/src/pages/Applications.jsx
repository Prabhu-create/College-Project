import { useEffect, useState } from "react";
import { useCollege } from "../context/CollegeContext";
import { useAuth } from "../context/AuthContext";
import { Eye, Pencil, Trash2, Building2, ChevronLeft, ChevronRight } from "lucide-react";

function Applications() {
  
  const {
  students,
  drives,
  applications,
  addApplication,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
  getDeletedApplications,
  restoreApplication,
} = useCollege();

  const { user } = useAuth();

  console.log("LOGGED-IN USER:", user);

console.log(
  "APPLICATION STUDENT IDS:",
  applications.map((application) => ({
    id: application.id,
    studentId: application.studentId,
    studentName: application.studentName,
    company: application.companyName,
  }))
);

  const isStudent = user?.role === "Student";
  const isFaculty = user?.role === "Faculty"

  const [selectedApplicationIds, setSelectedApplicationIds] = useState([]);
const [selectedDeletedApplicationIds, setSelectedDeletedApplicationIds] = useState([]);

const [showBin, setShowBin] = useState(false);
const [deletedApplications, setDeletedApplications] = useState([]);
const [binLoading, setBinLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [viewApplication, setViewApplication] = useState(null);
const [editingApplication, setEditingApplication] = useState(null);
const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 10;

  const [form, setForm] = useState({
    studentId: "",
    company: "",
    role: "",
    appliedDate: new Date().toISOString().split("T")[0],
    status: "Applied",
  });

  // --------------------------------------------------
  // CURRENT STUDENT
  // --------------------------------------------------

  const currentStudent = students.find(
    (student) => student.id === user?.studentId
  );

  // --------------------------------------------------
  // APPLICATIONS VISIBLE TO USER
  // --------------------------------------------------

  const roleApplications = isStudent
  ? applications.filter(
      (application) =>
        Number(application.studentId) === Number(user?.studentId)
    )
  : applications;


  // --------------------------------------------------
  // SEARCH + STATUS FILTER
  // --------------------------------------------------

  const visibleApplications = roleApplications.filter(
    (application) => {
      const matchesSearch =
        `${application.student}
         ${application.company}
         ${application.role}
         ${application.registerNumber}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  const totalPages = Math.ceil(
  visibleApplications.length / rowsPerPage
);

const startIndex = (currentPage - 1) * rowsPerPage;

const paginatedApplications = visibleApplications.slice(
  startIndex,
  startIndex + rowsPerPage
);

const allApplicationsSelected =
  paginatedApplications.length > 0 &&
  paginatedApplications.every((application) =>
    selectedApplicationIds.includes(
      Number(application.id)
    )
  );


const handleSelectApplication = (id) => {
  const applicationId = Number(id);

  setSelectedApplicationIds((previous) => {
    if (previous.includes(applicationId)) {
      return previous.filter(
        (selectedId) =>
          selectedId !== applicationId
      );
    }

    return [...previous, applicationId];
  });
};


const handleSelectAllApplications = () => {
  const pageApplicationIds =
    paginatedApplications.map((application) =>
      Number(application.id)
    );

  if (allApplicationsSelected) {
    setSelectedApplicationIds((previous) =>
      previous.filter(
        (id) =>
          !pageApplicationIds.includes(id)
      )
    );
  } else {
    setSelectedApplicationIds((previous) => [
      ...new Set([
        ...previous,
        ...pageApplicationIds,
      ]),
    ]);
  }
};

const handleDeleteSelectedApplications = async () => {
  if (selectedApplicationIds.length === 0) {
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to delete ${selectedApplicationIds.length} selected application(s)?`
  );

  if (!confirmed) {
    return;
  }

  try {
    await Promise.all(
      selectedApplicationIds.map((id) =>
        deleteApplication(id)
      )
    );

    setSelectedApplicationIds([]);

    alert("Selected applications deleted successfully.");
  } catch (error) {
    console.error(
      "Failed to delete selected applications:",
      error
    );

    alert(
      "Some applications could not be deleted."
    );
  }
};

const handleOpenBin = async () => {
  try {
    setBinLoading(true);

    const data =
      await getDeletedApplications();

    setDeletedApplications(data);

    setSelectedDeletedApplicationIds([]);

    setShowBin(true);
  } catch (error) {
    console.error(
      "Failed to load deleted applications:",
      error
    );

    alert("Failed to load deleted applications.");
  } finally {
    setBinLoading(false);
  }
};

const handleRestoreApplication = async (id) => {
  try {
    await restoreApplication(id);

    setDeletedApplications((previous) =>
      previous.filter(
        (application) =>
          Number(application.id) !== Number(id)
      )
    );

    // IMPORTANT: remove restored row from main-table selection
    setSelectedApplicationIds((previous) =>
      previous.filter(
        (applicationId) =>
          Number(applicationId) !== Number(id)
      )
    );

    setSelectedDeletedApplicationIds((previous) =>
      previous.filter(
        (applicationId) =>
          Number(applicationId) !== Number(id)
      )
    );

    alert("Application restored successfully.");
  } catch (error) {
    console.error(
      "Failed to restore application:",
      error
    );

    alert("Failed to restore application.");
  }
};

const handleSelectDeletedApplication = (id) => {
  const applicationId = Number(id);

  setSelectedDeletedApplicationIds(
    (previous) => {
      if (previous.includes(applicationId)) {
        return previous.filter(
          (selectedId) =>
            selectedId !== applicationId
        );
      }

      return [
        ...previous,
        applicationId,
      ];
    }
  );
};


const allDeletedApplicationsSelected =
  deletedApplications.length > 0 &&
  deletedApplications.every((application) =>
    selectedDeletedApplicationIds.includes(
      Number(application.id)
    )
  );


const handleSelectAllDeletedApplications = () => {
  if (allDeletedApplicationsSelected) {
    setSelectedDeletedApplicationIds([]);
  } else {
    setSelectedDeletedApplicationIds(
      deletedApplications.map((application) =>
        Number(application.id)
      )
    );
  }
};

const handleRestoreSelectedApplications = async () => {
  if (selectedDeletedApplicationIds.length === 0) {
    return;
  }

  const confirmed = window.confirm(
    `Restore ${selectedDeletedApplicationIds.length} selected application(s)?`
  );

  if (!confirmed) return;

  try {
    await Promise.all(
      selectedDeletedApplicationIds.map((id) =>
        restoreApplication(id)
      )
    );

    setDeletedApplications((previous) =>
      previous.filter(
        (application) =>
          !selectedDeletedApplicationIds.includes(
            Number(application.id)
          )
      )
    );

    // IMPORTANT
    setSelectedApplicationIds([]);

    setSelectedDeletedApplicationIds([]);

    alert("Selected applications restored successfully.");
  } catch (error) {
    console.error(
      "Failed to restore selected applications:",
      error
    );

    alert("Failed to restore selected applications.");
  }
};

  // --------------------------------------------------
  // FORM HANDLERS
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleStudentChange = (event) => {
    const studentId = Number(event.target.value);

    setForm((previous) => ({
      ...previous,
      studentId,
    }));
  };

  const handleCompanyChange = (event) => {
    const company = event.target.value;

    const selectedDrive = drives.find(
      (drive) => drive.company === company
    );

    setForm((previous) => ({
      ...previous,
      company,
      role: selectedDrive?.role || "",
    }));
  };

  // --------------------------------------------------
  // STATUS UPDATE
  // --------------------------------------------------

  const updateStatus = (id, status) => {
    updateApplicationStatus(id, status);
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

const handleDeleteApplication = async (id) => {
  const applicationId = Number(id);

  const confirmed = window.confirm(
    "Are you sure you want to delete this application?"
  );

  if (!confirmed) return;

  try {
    await deleteApplication(applicationId);

    setSelectedApplicationIds((previous) =>
      previous.filter(
        (selectedId) =>
          Number(selectedId) !== applicationId
      )
    );
  } catch (error) {
    console.error(
      "Failed to delete application:",
      error
    );
  }
};
  // --------------------------------------------------
  // STATUS STYLE
  // --------------------------------------------------

  const getStatusClass = (status) => {
    switch (status) {
      case "Selected":
        return "bg-green-100 text-green-700";

      case "Shortlisted":
        return "bg-blue-100 text-blue-700";

      case "Interview":
        return "bg-purple-100 text-purple-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

const handleViewApplication = (application) => {
  setViewApplication(application);
};

const handleEditApplication = (application) => {
  setEditingApplication(application);

  setForm({
    studentId: application.studentId,
    company: application.company,
    role: application.role,
    appliedDate: application.appliedDate,
    status: application.status,
  });

  setShowModal(true);
};

const handleSaveApplication = (event) => {
  event.preventDefault();

  const selectedStudent = students.find(
    (student) =>
      Number(student.id) === Number(form.studentId)
  );

  if (
    !selectedStudent ||
    !form.company ||
    !form.role ||
    !form.appliedDate
  ) {
    alert("Please fill all required fields.");
    return;
  }

  const applicationData = {
    studentId: selectedStudent.id,
    student: selectedStudent.name,
    registerNumber: selectedStudent.registerNumber,
    company: form.company,
    role: form.role,
    appliedDate: form.appliedDate,
    status: form.status,
  };

  if (editingApplication) {
    updateApplication(
      editingApplication.id,
      applicationData
    );

    setEditingApplication(null);
  } else {
    const alreadyApplied = applications.some(
      (application) =>
        application.studentId === selectedStudent.id &&
        application.company === form.company &&
        application.role === form.role
    );

    if (alreadyApplied) {
      alert(
        "This student has already applied for this job."
      );
      return;
    }

    addApplication(applicationData);
  }

  setForm({
    studentId: "",
    company: "",
    role: "",
    appliedDate: new Date()
      .toISOString()
      .split("T")[0],
    status: "Applied",
  });

  setShowModal(false);
};

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

  const totalApplications = roleApplications.length;

  const shortlistedCount = roleApplications.filter(
    (application) =>
      application.status === "Shortlisted"
  ).length;

  const selectedCount = roleApplications.filter(
    (application) =>
      application.status === "Selected"
  ).length;

  const rejectedCount = roleApplications.filter(
    (application) =>
      application.status === "Rejected"
  ).length;

  return (
    <div className="w-full p-8">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <p className="text-sm font-semibold text-indigo-600">
            {isStudent
  ? "STUDENT PORTAL"
  : user?.role === "Faculty"
  ? "FACULTY PORTAL"
  : "PLACEMENT PORTAL"}
            
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {isStudent
              ? "My Applications"
              : "Applications & Selections"}
          </h1>

          <p className="mt-2 text-slate-500">
            {isStudent
              ? "Track your placement applications and selection status."
              : "Manage student placement applications and selection status."}
          </p>
        </div>

        {!isStudent && !isFaculty && (
          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            + Add Application
          </button>
        )}

      </div>

      {/* Summary */}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Applications
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalApplications}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Shortlisted
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {shortlistedCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Selected
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {selectedCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Rejected
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {rejectedCount}
          </h2>
        </div>

      </div>

      {/* Filters */}

      <div className="mt-8 flex flex-col gap-4 md:flex-row">

        <input
          type="text"
          value={search}
          onChange={(event) => {
  setSearch(event.target.value);
  setCurrentPage(1);
}}
          placeholder="Search student, company or role..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 md:max-w-lg"
        />

        <select
          value={statusFilter}
          onChange={(event) => {
  setStatusFilter(event.target.value);
  setCurrentPage(1);
}}
           
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
        >
          <option value="All">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interview">Interview</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>



        {isFaculty && (
  <div className="ml-auto flex items-center  gap-2">
    {selectedApplicationIds.length > 0 && (
      <button
        type="button"
        onClick={handleDeleteSelectedApplications}
        className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
      >
        <Trash2 size={16} />
        Delete Selected
      </button>
    )}

    <button
      type="button"
      onClick={handleOpenBin}
      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
    >
      <Trash2 size={16} />
      Bin
    </button>
  </div>
)}

      </div>

      {/* Applications Table */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-200 bg-slate-50 text-left text-sm text-slate-500">

                {isFaculty && (
  <th className="w-12 px-6 py-4">
    <input
      type="checkbox"
      checked={allApplicationsSelected}
      onChange={handleSelectAllApplications}
      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
    />
  </th>
)}

                <th className="px-6 py-4 font-medium">
                  Student
                </th>

                <th className="px-6 py-4 font-medium">
                  Company
                </th>

                <th className="px-6 py-4 font-medium">
                  Job Role
                </th>

                <th className="px-6 py-4 font-medium">
                  Applied Date
                </th>

                <th className="px-6 py-4 font-medium">
                  Status
                </th>

                {isFaculty && (
                  <th className="px-6 py-4 font-medium pl-13">
                    Action
                  </th>
                )}

              </tr>

            </thead>

            <tbody>

              {paginatedApplications.map(
                (application) => (

                  <tr
                    key={application.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >

                    {isFaculty && (
  <td className="px-6 py-4">
    <input
      type="checkbox"
      checked={selectedApplicationIds.includes(
        Number(application.id)
      )}
      onChange={() =>
        handleSelectApplication(application.id)
      }
      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
    />
  </td>
)}

                    <td className="px-6 py-4">

                      <p className="font-semibold text-slate-900">
                        {application.student}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {application.registerNumber}
                      </p>

                    </td>

                    <td className="px-6 py-4 text-sm font-medium ">
                      <div className="flex items-center gap-3">

    <Building2
      size={22}
      strokeWidth={2}
      className="text-blue-600"
    />

    <span className="text-sm text-slate-800">
      {application.company}
    </span>

  </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {application.role}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {application.appliedDate}
                    </td>

                    <td className="px-6 py-4">

                      {isStudent ? (

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>

                      ) : (

                        <select
                          value={application.status}
                          onChange={(event) =>
                            updateStatus(
                              application.id,
                              event.target.value
                            )
                          }
                          className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ${getStatusClass(
                            application.status
                          )}`}
                        >

                          <option value="Applied">
                            Applied
                          </option>

                          <option value="Shortlisted">
                            Shortlisted
                          </option>

                          <option value="Interview">
                            Interview
                          </option>

                          <option value="Selected">
                            Selected
                          </option>

                          <option value="Rejected">
                            Rejected
                          </option>

                        </select>

                      )}

                    </td>

                    {isFaculty && (
  <td className="px-6 py-4">

    <div className="flex items-center  gap-1">

      {/* View */}
      <button
        type="button"
        onClick={() => handleViewApplication(application)}
        title="View"
        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <Eye size={17} />
      </button>

      {/* Edit */}
      <button
        type="button"
        onClick={() => handleEditApplication(application)}
        title="Edit"
        className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
      >
        <Pencil size={17} />
      </button>

      {/* Delete */}
      <button
        type="button"
        onClick={() =>
          handleDeleteApplication(application.id)
        }
        title="Delete"
        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-700"
      >
        <Trash2 size={17} />
      </button>

    </div>

  </td>
)}

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        {visibleApplications.length === 0 && (
          <div className="p-10 text-center text-sm text-slate-500">
            No applications found.
          </div>
        )}

       {totalPages > 0 && (
  <div className="flex items-center justify-center gap-2  border-slate-200 px-6 py-4">
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

      {/* Add Application Modal */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
  {editingApplication
    ? "Edit Application"
    : "Add Application"}
</h2>

                <p className="mt-1 text-sm text-slate-500">
  {editingApplication
    ? "Update the application details."
    : "Register a student's placement application."}
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
              onSubmit={handleSaveApplication}
              className="mt-6 space-y-4"
            >

              {/* Student */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Student
                </label>

                <select
                  value={form.studentId}
                  onChange={handleStudentChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                >

                  <option value="">
                    Select student
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

              {/* Company */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Company
                </label>

                <select
                  value={form.company}
                  onChange={handleCompanyChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                >

                  <option value="">
                    Select company
                  </option>

                  {[
                    ...new Set(
                      drives.map(
                        (drive) => drive.company
                      )
                    ),
                  ].map((company) => (

                    <option
                      key={company}
                      value={company}
                    >
                      {company}
                    </option>

                  ))}

                </select>

              </div>

              {/* Role */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Job Role
                </label>

                <input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="Example: Software Developer"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                />

              </div>

              {/* Date */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Applied Date
                </label>

                <input
                  type="date"
                  name="appliedDate"
                  value={form.appliedDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                />

              </div>

              {/* Status */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                >

                  <option value="Applied">
                    Applied
                  </option>

                  <option value="Shortlisted">
                    Shortlisted
                  </option>

                  <option value="Interview">
                    Interview
                  </option>

                  <option value="Selected">
                    Selected
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>

                </select>

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
  {editingApplication
    ? "Update Application"
    : "Add Application"}
</button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* View Application Modal */}

{viewApplication && (

  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
    onClick={() => setViewApplication(null)}
  >

    <div
      className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 p-6">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Application Details
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            {viewApplication.student}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setViewApplication(null)}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          ✕
        </button>

      </div>

      {/* Content */}

      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">

        <ApplicationInfo
          label="Student"
          value={viewApplication.student}
        />

        <ApplicationInfo
          label="Register Number"
          value={viewApplication.registerNumber}
        />

        <ApplicationInfo
          label="Company"
          value={viewApplication.company}
        />

        <ApplicationInfo
          label="Job Role"
          value={viewApplication.role}
        />

        <ApplicationInfo
          label="Applied Date"
          value={viewApplication.appliedDate}
        />

        <ApplicationInfo
          label="Status"
          value={viewApplication.status}
        />

      </div>

      {/* Footer */}

      <div className="flex justify-end border-t border-slate-200 p-6">

        <button
          type="button"
          onClick={() => setViewApplication(null)}
          className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
        >
          Close
        </button>

      </div>

    </div>

  </div>

)}

{/* APPLICATION BIN - FACULTY ONLY */}

{isFaculty && showBin && (

  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
    onClick={() => setShowBin(false)}
  >

    <div
      className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      onClick={(event) =>
        event.stopPropagation()
      }
    >

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 p-6">

        <div>

          <p className="text-sm font-semibold text-indigo-600">
            RECYCLE BIN
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Deleted Applications
          </h2>

        </div>

        <button
          type="button"
          onClick={() => setShowBin(false)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          ✕
        </button>

      </div>

      {/* Table */}

      {/* Table */}
<div className="max-h-[55vh] overflow-auto">

  {binLoading ? (

    <div className="p-10 text-center text-slate-500">
      Loading deleted applications...
    </div>

  ) : deletedApplications.length === 0 ? (

    <div className="p-10 text-center text-slate-500">
      Bin is empty.
    </div>

  ) : (

    <table className="w-full">

      <thead className="sticky top-0 bg-slate-50">

        <tr className="border-b border-slate-200 text-left text-sm text-slate-500">

          <th className="w-12 px-6 py-4">
            <input
              type="checkbox"
              checked={allDeletedApplicationsSelected}
              onChange={handleSelectAllDeletedApplications}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600"
            />
          </th>

          <th className="px-6 py-4">
            Student
          </th>

          <th className="px-6 py-4">
            Company
          </th>

          <th className="px-6 py-4">
            Job Role
          </th>

          <th className="px-6 py-4">
            Status
          </th>

          <th className="px-6 py-4">
            Action
          </th>

        </tr>

      </thead>

      <tbody>

        {deletedApplications.map((application) => (

          <tr
            key={application.id}
            className="border-b border-slate-100"
          >

            <td className="px-6 py-4">

              <input
                type="checkbox"
                checked={selectedDeletedApplicationIds.includes(
                  Number(application.id)
                )}
                onChange={() =>
                  handleSelectDeletedApplication(
                    application.id
                  )
                }
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />

            </td>

            <td className="px-6 py-4">

              <p className="font-semibold text-slate-900">
                {application.student}
              </p>

              <p className="text-xs text-slate-500">
                {application.registerNumber}
              </p>

            </td>

            <td className="px-6 py-4">
              {application.company}
            </td>

            <td className="px-6 py-4">
              {application.role}
            </td>

            <td className="px-6 py-4">

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                  application.status
                )}`}
              >
                {application.status}
              </span>

            </td>

            <td className="px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  handleRestoreApplication(application.id)
                }
                className="rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-200"
              >
                Restore
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  )}

</div>

{/* Bottom Actions */}
<div className="flex items-center justify-between border-t border-slate-200 p-4">

  <p className="text-sm text-slate-500">

    {selectedDeletedApplicationIds.length > 0
      ? `${selectedDeletedApplicationIds.length} selected`
      : `${deletedApplications.length} deleted application(s)`}

  </p>

  <div className="flex items-center gap-3">

    {/* Restore Selected */}

    {selectedDeletedApplicationIds.length > 0 && (

      <button
        type="button"
        onClick={handleRestoreSelectedApplications}
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
      >
        Restore Selected
      </button>

    )}

    {/* Cancel */}

    <button
      type="button"
      onClick={() => {
        setShowBin(false);
        setSelectedDeletedApplicationIds([]);
      }}
      className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      Cancel
    </button>

  </div>

</div>

    </div>

  </div>

)}

    </div>
  );
}
function ApplicationInfo({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-900">
        {value || "-"}
      </p>

    </div>
  );
}

export default Applications;