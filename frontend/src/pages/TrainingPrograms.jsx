import { useState } from "react";
import { useCollege } from "../context/CollegeContext";
import { useAuth } from "../context/AuthContext";

import {
  Layers,
  Play,
  Award,
  GraduationCap,
  Search,
  Plus,
  Trash2,
  Eye,
  RotateCcw,
  X,
  Pencil,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";


function TrainingPrograms() {
    const { user } = useAuth();
    const isAdmin = user?.role === "Admin";
  const isFaculty = user?.role === "Faculty";

const {
trainingPrograms: programs,
trainingProgramsLoading,
trainingProgramsError,
addTrainingProgram,
updateTrainingProgram,
deleteTrainingProgram,
getDeletedTrainingPrograms,
restoreTrainingProgram,
} = useCollege();

const [search, setSearch] = useState("");
const [selectedProgramIds, setSelectedProgramIds] = useState([]);
const [selectedDeletedProgramIds, setSelectedDeletedProgramIds] = useState([]);
const [showModal, setShowModal] = useState(false);
const [showBin, setShowBin] = useState(false);
const [showViewModal, setShowViewModal] = useState(false);

const [deletedPrograms, setDeletedPrograms] = useState([]);
const [viewingProgram, setViewingProgram] = useState(null);
const [editingProgram, setEditingProgram] = useState(null);
const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 10;

const [form, setForm] = useState({
name: "",
trainer: "",
duration: "",
startDate: "",
students: "",
completion: 0,
});


// --------------------------------------------------
// SEARCH
// --------------------------------------------------

const filteredPrograms = programs.filter((program) =>
`${program.name} ${program.trainer} ${program.status}`
.toLowerCase()
.includes(search.toLowerCase())
);

const totalPages = Math.ceil(
  filteredPrograms.length / rowsPerPage
);

const startIndex = (currentPage - 1) * rowsPerPage;

const paginatedPrograms = filteredPrograms.slice(
  startIndex,
  startIndex + rowsPerPage
);

// --------------------------------------------------
// SUMMARY
// --------------------------------------------------

const activePrograms = programs.filter(
(program) => program.status === "Active"
).length;

const completedPrograms = programs.filter(
(program) => program.status === "Completed"
).length;

const totalParticipants = programs.reduce(
(total, program) => total + Number(program.students || 0),
0
);

// --------------------------------------------------
// FORM
// --------------------------------------------------

const resetForm = () => {
setForm({
name: "",
trainer: "",
duration: "",
startDate: "",
students: "",
completion: 0,
});

setEditingProgram(null);
};

const openAddModal = () => {
resetForm();
setShowModal(true);
};

const openEditModal = (program) => {
setEditingProgram(program);

setForm({
  name: program.name || "",
  trainer: program.trainer || "",
  duration: program.duration || "",
  startDate: program.startDate
    ? new Date(program.startDate).toISOString().split("T")[0]
    : "",
  students: program.students ?? "",
  completion: program.completion ?? 0,
});

setShowModal(true);


};

const closeModal = () => {
setShowModal(false);
resetForm();
};

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
  !form.name.trim() ||
  !form.trainer.trim() ||
  !form.duration.trim() ||
  !form.startDate ||
  form.students === ""
) {
  alert("Please fill all required fields.");
  return;
}

const completion = Math.min(
  100,
  Math.max(0, Number(form.completion || 0))
);

const programData = {
  name: form.name.trim(),
  trainer: form.trainer.trim(),
  duration: form.duration.trim(),
  startDate: form.startDate,
  students: Number(form.students),
  completion,
  status: completion >= 100 ? "Completed" : "Active",
};

try {
  if (editingProgram) {
    await updateTrainingProgram({
      ...editingProgram,
      ...programData,
      id: Number(editingProgram.id),
    });
  } else {
    await addTrainingProgram(programData);
  }

  closeModal();
} catch (error) {
  console.error("Failed to save training program:", error);
}

};

// --------------------------------------------------
// SELECT
// --------------------------------------------------

const handleSelectAll = (event) => {
  if (event.target.checked) {
    setSelectedProgramIds(
      filteredPrograms.map((program) => Number(program.id))
    );
  } else {
    setSelectedProgramIds([]);
  }
};

const handleSelectProgram = (id) => {
  const programId = Number(id);

  setSelectedProgramIds((previous) =>
    previous.includes(programId)
      ? previous.filter(
          (selectedId) => selectedId !== programId
        )
      : [...previous, programId]
  );
};

const allFilteredSelected =
filteredPrograms.length > 0 &&
filteredPrograms.every((program) =>
selectedProgramIds.includes(Number(program.id))
);


// --------------------------------------------------
// DELETE
// --------------------------------------------------

const deleteProgram = async (id) => {
  const programId = Number(id);

  const confirmed = window.confirm(
    "Are you sure you want to move this training program to the bin?"
  );

  if (!confirmed) return;

  try {
    await deleteTrainingProgram(programId);

    // Remove deleted program from selected list
    setSelectedProgramIds((previous) =>
      previous.filter(
        (selectedId) => Number(selectedId) !== programId
      )
    );
  } catch (error) {
    console.error("Failed to delete training program:", error);
  }
};

const deleteSelectedPrograms = async () => {
  if (selectedProgramIds.length === 0) {
    alert("Please select at least one training program.");
    return;
  }

  const confirmed = window.confirm(
    `Delete ${selectedProgramIds.length} selected training program(s)?`
  );

  if (!confirmed) {
    return;
  }

  try {
    for (const id of selectedProgramIds) {
      await deleteTrainingProgram(Number(id));
    }

    setSelectedProgramIds([]);

    alert("Selected training programs moved to Bin.");
  } catch (error) {
    console.error(
      "Failed to delete selected training programs:",
      error
    );

    alert("Failed to delete selected training programs.");
  }
};

// --------------------------------------------------
// BIN
// --------------------------------------------------

const openBin = async () => {
  setShowBin(true);

  // Clear previous selections
  setSelectedDeletedProgramIds([]);

  try {
    const data = await getDeletedTrainingPrograms();

    setDeletedPrograms(data);

  } catch (error) {
    console.error(error);
  }
};

const closeBin = () => {
  setShowBin(false);

  // Clear checkbox selections
  setSelectedDeletedProgramIds([]);
};

const restoreProgram = async (id) => {
try {
await restoreTrainingProgram(id);

  setDeletedPrograms((previous) =>
    previous.filter((program) => Number(program.id) !== Number(id))
  );
} catch (error) {
  console.error(
    "Failed to restore training program:",
    error
  );
}

};

// --------------------------------------------------
// VIEW
// --------------------------------------------------

const openViewModal = (program) => {
setViewingProgram(program);
setShowViewModal(true);
};

const closeViewModal = () => {
setViewingProgram(null);
setShowViewModal(false);
};

// --------------------------------------------------
// DATE
// --------------------------------------------------

const formatDate = (date) => {
if (!date) return "-";

const parsedDate = new Date(date);

if (Number.isNaN(parsedDate.getTime())) {
  return date;
}

return parsedDate.toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
};

// --------------------------------------------------
// LOADING / ERROR
// --------------------------------------------------

if (trainingProgramsLoading) {
return ( <div className="w-full p-8"> <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
Loading training programs... </div> </div>
);
}

if (trainingProgramsError) {
return ( <div className="w-full p-8"> <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-600">
{trainingProgramsError} </div> </div>
);
}

const handleSelectAllDeletedPrograms = (event) => {
  if (event.target.checked) {
    setSelectedDeletedProgramIds(
      deletedPrograms.map((program) => Number(program.id))
    );
  } else {
    setSelectedDeletedProgramIds([]);
  }
};

const handleSelectDeletedProgram = (id) => {
  const programId = Number(id);

  setSelectedDeletedProgramIds((previous) =>
    previous.includes(programId)
      ? previous.filter(
          (selectedId) => selectedId !== programId
        )
      : [...previous, programId]
  );
};

const handleRestoreSelectedPrograms = async () => {
  if (selectedDeletedProgramIds.length === 0) {
    alert("Please select at least one training program.");
    return;
  }

  const confirmed = window.confirm(
    `Restore ${selectedDeletedProgramIds.length} selected training program(s)?`
  );

  if (!confirmed) {
    return;
  }

  try {
    for (const id of selectedDeletedProgramIds) {
      await restoreProgram(id);
    }

    setDeletedPrograms((previous) =>
      previous.filter(
        (program) => !selectedDeletedProgramIds.includes(Number(program.id))
      )
    );

    setSelectedDeletedProgramIds([]);

    alert("Selected training programs restored successfully.");

  } catch (error) {
    console.error(
      "Failed to restore selected training programs:",
      error
    );

    alert("Failed to restore selected training programs.");
  }
};

const handleRestoreProgram = async (id) => {
  const programId = Number(id);

  try {
    await restoreTrainingProgram(programId);

    setDeletedPrograms((previous) =>
      previous.filter(
        (program) => Number(program.id) !== programId
      )
    );

    setSelectedDeletedProgramIds((previous) =>
      previous.filter(
        (selectedId) => Number(selectedId) !== programId
      )
    );

    alert("Training program restored successfully.");
  } catch (error) {
    console.error(
      "Failed to restore training program:",
      error
    );

    alert("Failed to restore training program.");
  }
};


return ( <div className="w-full p-8">

  {/* HEADER */}

  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
    <div>
      <p className="text-sm font-semibold text-indigo-600">
        {user?.role === "Faculty"
      ? "FACULTY PORTAL"
     :"ADMIN PORTAL"
      }
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        Training Programs
      </h1>

      <p className="mt-2 text-slate-500">
        Manage training programs and monitor student progress.
      </p>
    </div>

    {isAdmin && (
    <button
      onClick={openAddModal}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
    >
      <Plus />
      Add Training Program
    </button>
    )}
  </div>
  

  {/* SUMMARY CARDS */}

  <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Layers size={22} />
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Total Programs
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {programs.length}
          </h2>
        </div>
      </div>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-green-50 p-3 text-green-600">
          <Play size={20} />
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Active Programs
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {activePrograms}
          </h2>
        </div>
      </div>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Award size={22} />
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Completed
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {completedPrograms}
          </h2>
        </div>
      </div>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <GraduationCap size={22} />
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Total Participants
          </p>

          <h2 className="mt-2 text-3xl font-bold text-indigo-600">
            {totalParticipants}
          </h2>
        </div>
      </div>
    </div>

  </div>

  {/* SEARCH + ACTIONS */}

  <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div className="relative w-full lg:max-w-md">
      <Search
        size={17}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={search}
        onChange={(event) => {
  setSearch(event.target.value);
  setCurrentPage(1);
}}
        placeholder="Search training programs or trainers..."
        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>


{isAdmin && (
    <div className="flex flex-wrap gap-3">
  {/* Delete Selected */}

  {selectedProgramIds.length > 0 && (
    <button
      type="button"
      onClick={deleteSelectedPrograms}
      className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
    >
      <Trash2 size={18} />
      Delete Selected ({selectedProgramIds.length})
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
</div>
)}
  </div>
  </div>

  {/* TABLE */}

  <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

    <div className="overflow-x-auto">

      <table className="w-full min-w-[1100px]">

        <thead className="bg-slate-50">
          <tr className="border-b border-slate-200">

            {isAdmin && (
            <th className="px-5 py-4 text-left">
              <input
                type="checkbox"
                checked={allFilteredSelected}
                onChange={handleSelectAll}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </th>
            )}

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Program
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Trainer
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Duration
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Students
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Start Date
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Completion
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </th>

            <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>

          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">

          {paginatedPrograms.map((program) => {

            const completion = Number(
              program.completion || 0
            );

            return (
              <tr
                key={program.id}
                className="transition hover:bg-slate-50"
              >

                {isAdmin && (
                <td className="px-5 py-4">
                  <input
  type="checkbox"
  checked={selectedProgramIds.includes(Number(program.id))}
  onChange={() => handleSelectProgram(program.id)}
  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
/>
                </td>
                )}

                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {program.name}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-slate-700">
                  {program.trainer}
                </td>

                <td className="px-5 py-4 text-sm text-slate-700">
                  {program.duration}
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                  {program.students}
                </td>

                <td className="px-5 py-4 text-sm text-slate-700">
                  {formatDate(program.startDate)}
                </td>

                <td className="px-5 py-4">

                  <div className="min-w-[120px]">

                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-slate-500">
                        Progress
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

                </td>

                <td className="px-5 py-4">

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      program.status === "Completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {program.status || "Active"}
                  </span>

                </td>

                <td className="px-5 py-4">
  <div className="flex justify-center gap-2">
    <button
      type="button"
      onClick={() => openViewModal(program)}
      title="View"
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
    >
      <Eye size={15} />
    </button>

    <button
      type="button"
      onClick={() => openEditModal(program)}
      title="Edit"
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
    >
      <Pencil size={16} />
    </button>

    {isAdmin && (
    <button
      type="button"
      onClick={() => deleteProgram(program.id)}
      title="Delete"
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
    >
      <Trash2 size={14} />
    </button>
    )}
  </div>
</td>
              </tr>
            );
          })}

        </tbody>

      </table>

    </div>

    {filteredPrograms.length === 0 && (
      <div className="p-10 text-center text-slate-500">
        No training programs found.
      </div>
    )}

    {filteredPrograms.length > 0 && (
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

  {/* ADD / EDIT MODAL */}

  {showModal && (isAdmin || editingProgram) && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-slate-200 px-6 py-5">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingProgram
                ? "Edit Training Program"
                : "Add Training Program"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingProgram
                ? "Update training program details."
                : "Create a new training program."}
            </p>
          </div>

          <button
            onClick={closeModal}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Program Name *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter program name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Trainer *
              </label>

              <input
                type="text"
                name="trainer"
                value={form.trainer}
                onChange={handleChange}
                placeholder="Enter trainer name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Duration *
              </label>

              <input
                type="text"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="Example: 8 Weeks"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Start Date *
              </label>

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Students *
              </label>

              <input
                type="number"
                name="students"
                min="0"
                value={form.students}
                onChange={handleChange}
                placeholder="Number of students"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Completion %
              </label>

              <input
                type="number"
                name="completion"
                min="0"
                max="100"
                value={form.completion}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 border-slate-100 pt-5">

            <button
              type="button"
              onClick={closeModal}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              {editingProgram
                ? "Update Program"
                : "Add Program"}
            </button>

          </div>

        </form>

      </div>

    </div>
  )}

  {/* VIEW MODAL */}

  {showViewModal && viewingProgram && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between  border-slate-200 px-6 py-5">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Training Program Details
            </h2>
          </div>

          <button
            onClick={closeViewModal}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>

        </div>

        <div className="space-y-4 p-6">

          <div>
            <p className="text-xs font-medium uppercase text-slate-400">
              Program
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {viewingProgram.name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Trainer
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {viewingProgram.trainer}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Duration
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {viewingProgram.duration}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Students
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {viewingProgram.students}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Start Date
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {formatDate(viewingProgram.startDate)}
              </p>
            </div>

          </div>

          <div className="rounded-xl bg-slate-50 p-4">

            <div className="flex justify-between">
              <p className="text-sm font-medium text-slate-600">
                Completion
              </p>

              <p className="font-bold text-indigo-600">
                {viewingProgram.completion || 0}%
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-indigo-600"
                style={{
                  width: `${Number(
                    viewingProgram.completion || 0
                  )}%`,
                }}
              />
            </div>

          </div>

        </div>

        <div className="border-slate-200 px-6 py-4 text-right">

          <button
            onClick={closeViewModal}
            className="rounded-xl bg-slate-100 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-200"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  )}

  {/* BIN MODAL */}

  {showBin && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Training Program Bin
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Restore deleted training programs.
            </p>
          </div>

          <button
            onClick={closeBin}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>

        </div>

        <div className="max-h-[60vh] overflow-y-auto">

          {deletedPrograms.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No deleted training programs.
            </div>
          ) : (
            <table className="w-full">

              <thead className="bg-slate-50">
                <tr>
                  <th className="w-12 px-6 py-4 text-center">

                    <input
  type="checkbox"
  checked={
    deletedPrograms.length > 0 &&
    deletedPrograms.every((program) =>
      selectedDeletedProgramIds.includes(Number(program.id))
    )
  }
  onChange={handleSelectAllDeletedPrograms}
  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
/>
</th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Program
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Trainer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Start Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {deletedPrograms.map((program) => (
                  <tr key={program.id}>

                    <td className="w-12 px-6 py-4 text-center">

                      <input
  type="checkbox"
  checked={selectedDeletedProgramIds.includes(
    Number(program.id)
  )}
  onChange={() =>
    handleSelectDeletedProgram(program.id)
  }
  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
/>
</td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">
                        {program.name}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {program.trainer}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(program.startDate)}
                    </td>

                    <td className="px-6 py-4 text-right">

                      <button
                        onClick={() => handleRestoreProgram(program.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-600 hover:bg-green-100"
                      >
                        <RotateCcw size={16} />
                        Restore
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          )}

        </div>

       <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">

  {selectedDeletedProgramIds.length > 0 && (

    <button
      type="button"
      onClick={handleRestoreSelectedPrograms}
      className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700"
    >

      <RotateCcw size={18} />

      Restore Selected ({selectedDeletedProgramIds.length})

    </button>

  )}

  <button
    onClick={closeBin}
    className="rounded-xl bg-slate-100 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-200"
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

export default TrainingPrograms;
