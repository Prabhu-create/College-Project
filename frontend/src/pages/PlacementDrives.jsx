import { useState } from "react";
import { useCollege } from "../context/CollegeContext";

function PlacementDrives() {
  const {
    drives,
    addDrive,
    updateDrive,
    deleteDrive,
  } = useCollege();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);

  const [form, setForm] = useState({
    company: "",
    role: "",
    package: "",
    location: "",
    date: "",
    eligibility: "",
    openings: "",
  });

  const filteredDrives = drives.filter((drive) =>
    `${drive.company} ${drive.role} ${drive.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingDrive(null);

    setForm({
      company: "",
      role: "",
      package: "",
      location: "",
      date: "",
      eligibility: "",
      openings: "",
    });

    setShowModal(true);
  };

  const openEditModal = (drive) => {
    setEditingDrive(drive);

    setForm({
      company: drive.company || "",
      role: drive.role || "",
      package: drive.package || "",
      location: drive.location || "",
      date: drive.date || "",
      eligibility: drive.eligibility || "",
      openings: drive.openings || "",
    });

    setShowModal(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.company ||
      !form.role ||
      !form.package ||
      !form.location ||
      !form.date ||
      !form.eligibility ||
      !form.openings
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (editingDrive) {
      updateDrive(editingDrive.id, {
        ...form,
        openings: Number(form.openings),
      });
    } else {
      addDrive({
        ...form,
        openings: Number(form.openings),
      });
    }

    setShowModal(false);

    setEditingDrive(null);

    setForm({
      company: "",
      role: "",
      package: "",
      location: "",
      date: "",
      eligibility: "",
      openings: "",
    });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this placement drive?"
    );

    if (!confirmed) return;

    deleteDrive(id);
  };

  const activeDrives = drives.filter(
    (drive) => drive.status === "Active"
  ).length;

  const totalOpenings = drives.reduce(
    (total, drive) =>
      total + Number(drive.openings || 0),
    0
  );

  return (
    <div className="w-full p-8">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <p className="text-sm font-semibold text-indigo-600">
            PLACEMENT PORTAL
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Placement Drives
          </h1>

          <p className="mt-2 text-slate-500">
            Create and manage campus recruitment drives.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          + Create Drive
        </button>

      </div>

      {/* Summary */}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Drives
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {drives.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Drives
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {activeDrives}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Openings
          </p>

          <h2 className="mt-2 text-3xl font-bold text-indigo-600">
            {totalOpenings}
          </h2>
        </div>

      </div>

      {/* Search */}

      <div className="mt-8">

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search company, role or location..."
          className="w-full max-w-lg rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

      </div>

      {/* Drives */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

        {filteredDrives.map((drive) => (

          <div
            key={drive.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                  🏢
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {drive.company}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {drive.role}
                  </p>
                </div>

              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                {drive.status}
              </span>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Package
                </p>

                <p className="mt-1 font-semibold">
                  ₹ {drive.package}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Openings
                </p>

                <p className="mt-1 font-semibold">
                  {drive.openings}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Location
                </p>

                <p className="mt-1 font-semibold">
                  📍 {drive.location}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Drive Date
                </p>

                <p className="mt-1 font-semibold">
                  {drive.date}
                </p>
              </div>

            </div>

            <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4">

              <p className="text-xs font-medium text-indigo-500">
                Eligibility
              </p>

              <p className="mt-1 font-semibold text-indigo-700">
                {drive.eligibility}
              </p>

            </div>

            <div className="mt-5 flex justify-end gap-3 border-t border-slate-100 pt-5">

              <button
                onClick={() => openEditModal(drive)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(drive.id)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

      {filteredDrives.length === 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          No placement drives found.
        </div>
      )}

      {/* Modal */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingDrive
                    ? "Edit Placement Drive"
                    : "Create Placement Drive"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter recruitment drive details.
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

              {/* Company */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Company
                  </label>

                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Example: TCS"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

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

              </div>

              {/* Package + Location */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Package
                  </label>

                  <input
                    name="package"
                    value={form.package}
                    onChange={handleChange}
                    placeholder="Example: 7.5 LPA"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Location
                  </label>

                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Example: Chennai"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

              </div>

              {/* Date + Openings */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Drive Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Number of Openings
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="openings"
                    value={form.openings}
                    onChange={handleChange}
                    placeholder="Example: 25"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

              </div>

              {/* Eligibility */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Eligibility
                </label>

                <input
                  name="eligibility"
                  value={form.eligibility}
                  onChange={handleChange}
                  placeholder="Example: CGPA 7.0+"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
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
                  {editingDrive
                    ? "Update Drive"
                    : "Create Drive"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default PlacementDrives;