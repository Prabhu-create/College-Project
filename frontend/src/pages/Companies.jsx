import { useState } from "react";
import { useCollege } from "../context/CollegeContext";
import {
  Building,
  Building2,
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Companies() {
  const {
    companies,
    companiesLoading,
    companiesError,

    addCompany,
    editCompany,
    removeCompany,

    getDeletedCompanies,
    restoreCompany,
  } = useCollege();

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [viewCompany, setViewCompany] = useState(null);

  const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);
  const [selectedDeletedCompanyIds, setSelectedDeletedCompanyIds] =
    useState([]);

  const [showBin, setShowBin] = useState(false);
  const [deletedCompanies, setDeletedCompanies] = useState([]);
  const [binLoading, setBinLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [form, setForm] = useState({
    name: "",
    industry: "",
    location: "",
    website: "",
    contact: "",
    status: "Active",
  });

  const filteredCompanies = companies.filter((company) =>
    `${company.name || ""} ${company.industry || ""} ${
      company.location || ""
    } ${company.website || ""} ${company.contact || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredCompanies.length / rowsPerPage
  );

  const startIndex = (currentPage - 1) * rowsPerPage;

  const paginatedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const openAddModal = () => {
    setEditingCompany(null);

    setForm({
      name: "",
      industry: "",
      location: "",
      website: "",
      contact: "",
      status: "Active",
    });

    setShowModal(true);
  };

  const openEditModal = (company) => {
    setEditingCompany(company);

    setForm({
      name: company.name || "",
      industry: company.industry || "",
      location: company.location || "",
      website: company.website || "",
      contact: company.contact || "",
      status: company.status || "Active",
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.industry.trim() ||
      !form.location.trim()
    ) {
      alert(
        "Please fill Company Name, Industry, and Location."
      );
      return;
    }

    try {
      if (editingCompany) {
        await editCompany(editingCompany.id, {
          name: form.name.trim(),
          industry: form.industry.trim(),
          location: form.location.trim(),
          website: form.website.trim(),
          contact: form.contact.trim(),
          status: form.status,
        });

        alert("Company updated successfully.");
      } else {
        await addCompany({
          name: form.name.trim(),
          industry: form.industry.trim(),
          location: form.location.trim(),
          website: form.website.trim(),
          contact: form.contact.trim(),
          status: form.status || "Active",
          isDeleted: false,
        });

        alert("Company added successfully.");
      }

      setForm({
        name: "",
        industry: "",
        location: "",
        website: "",
        contact: "",
        status: "Active",
      });

      setEditingCompany(null);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save company:", error);

      if (editingCompany) {
        alert("Failed to update company.");
      } else {
        alert("Failed to add company.");
      }
    }
  };

  const handleSelectAllCompanies = (event) => {
    if (event.target.checked) {
      setSelectedCompanyIds(
        filteredCompanies.map((company) => company.id)
      );
    } else {
      setSelectedCompanyIds([]);
    }
  };

  const handleSelectCompany = (id) => {
    setSelectedCompanyIds((previous) =>
      previous.includes(id)
        ? previous.filter((companyId) => companyId !== id)
        : [...previous, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedCompanyIds.length === 0) {
      alert("Please select at least one company.");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedCompanyIds.length} selected company(s)?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await Promise.all(
        selectedCompanyIds.map((id) => removeCompany(id))
      );

      setSelectedCompanyIds([]);

      alert("Selected companies moved to Bin.");
    } catch (error) {
      console.error(
        "Failed to delete selected companies:",
        error
      );

      alert("Failed to delete selected companies.");
    }
  };

  const handleSelectAllDeletedCompanies = (event) => {
    if (event.target.checked) {
      setSelectedDeletedCompanyIds(
        deletedCompanies.map((company) => company.id)
      );
    } else {
      setSelectedDeletedCompanyIds([]);
    }
  };

  const handleSelectDeletedCompany = (id) => {
    setSelectedDeletedCompanyIds((previous) =>
      previous.includes(id)
        ? previous.filter((companyId) => companyId !== id)
        : [...previous, id]
    );
  };

  const handleRestoreSelectedCompanies = async () => {
    if (selectedDeletedCompanyIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Restore ${selectedDeletedCompanyIds.length} selected company(s)?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await Promise.all(
        selectedDeletedCompanyIds.map((id) =>
          restoreCompany(id)
        )
      );

      setDeletedCompanies((previous) =>
        previous.filter(
          (company) =>
            !selectedDeletedCompanyIds.includes(company.id)
        )
      );

      setSelectedDeletedCompanyIds([]);

      alert("Selected companies restored successfully.");
    } catch (error) {
      console.error(
        "Failed to restore selected companies:",
        error
      );

      alert("Failed to restore selected companies.");
    }
  };

  const openBin = async () => {
    setSelectedDeletedCompanyIds([]);
    setShowBin(true);
    setBinLoading(true);

    try {
      const data = await getDeletedCompanies();
      setDeletedCompanies(data);
    } catch (error) {
      console.error(
        "Failed to load deleted companies:",
        error
      );

      alert("Failed to load deleted companies.");
    } finally {
      setBinLoading(false);
    }
  };

  const handleDeleteCompany = async (company) => {
    const confirmed = window.confirm(
      `Delete ${company.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeCompany(company.id);

      setSelectedCompanyIds((previous) =>
        previous.filter((id) => id !== company.id)
      );

      alert("Company moved to Bin.");
    } catch (error) {
      console.error(
        "Failed to delete company:",
        error
      );

      alert("Failed to delete company.");
    }
  };

  const handleRestoreCompany = async (company) => {
    const confirmed = window.confirm(
      `Restore ${company.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await restoreCompany(company.id);

      setDeletedCompanies((previous) =>
        previous.filter(
          (item) => item.id !== company.id
        )
      );

      setSelectedDeletedCompanyIds((previous) =>
        previous.filter((id) => id !== company.id)
      );

      alert("Company restored successfully.");
    } catch (error) {
      console.error(
        "Failed to restore company:",
        error
      );

      alert("Failed to restore company.");
    }
  };

  const activeCompanies = companies.filter(
    (company) => company.status === "Active"
  ).length;

  return (
    <div className="w-full p-8">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            ADMIN PORTAL
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Companies
          </h1>

          <p className="mt-2 text-slate-500">
            Manage companies participating in campus recruitment.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          + Add Company
        </button>
      </div>

      {/* Loading / Error */}

      {companiesLoading && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
          Loading companies...
        </div>
      )}

      {companiesError && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {companiesError}
        </div>
      )}

      {/* Summary */}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Total Companies */}

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
                Total Companies
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {companies.length}
              </h2>
            </div>
          </div>
        </div>

        {/* Active Companies */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
              <Building
                size={24}
                className="text-indigo-600"
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Active Companies
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {activeCompanies}
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
              placeholder="Search companies..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Delete Selected */}

            {selectedCompanyIds.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteSelected}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                <Trash2 size={18} />

                Delete Selected (
                {selectedCompanyIds.length})
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
        </div>
      </div>

      {/* Companies Table */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-center text-sm text-slate-500">
                {/* Select All */}

                <th className="w-12 px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredCompanies.length > 0 &&
                      selectedCompanyIds.length ===
                        filteredCompanies.length
                    }
                    onChange={handleSelectAllCompanies}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>

                <th className="px-6 py-4 font-medium">
                  Company
                </th>

                <th className="px-6 py-4 font-medium">
                  Industry
                </th>

                <th className="px-6 py-4 font-medium">
                  Location
                </th>

                <th className="px-6 py-4 font-medium">
                  Website
                </th>

                <th className="px-6 py-4 font-medium">
                  Contact
                </th>

                <th className="px-6 py-4 font-medium">
                  Status
                </th>

                <th className="px-6 py-4 font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedCompanies.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-slate-100 text-center hover:bg-slate-50"
                >
                  {/* Checkbox */}

                  <td className="w-12 px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCompanyIds.includes(
                        company.id
                      )}
                      onChange={() =>
                        handleSelectCompany(company.id)
                      }
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>

                  {/* Company */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                        <Building2
                          size={20}
                          className="text-indigo-600"
                        />
                      </div>

                      <span className="font-semibold text-slate-900">
                        {company.name}
                      </span>
                    </div>
                  </td>

                  {/* Industry */}

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {company.industry || "-"}
                  </td>

                  {/* Location */}

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {company.location || "-"}
                  </td>

                  {/* Website */}

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Contact */}

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {company.contact || "-"}
                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        company.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {company.status || "Active"}
                    </span>
                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* View */}

                      <button
                        type="button"
                        onClick={() =>
                          setViewCompany(company)
                        }
                        title="View company"
                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Edit */}

                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(company)
                        }
                        title="Edit company"
                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Delete */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteCompany(company)
                        }
                        title="Delete company"
                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
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

        {/* Empty */}

        {filteredCompanies.length === 0 && (
          <div className="p-10 text-center text-sm text-slate-500">
            No companies found.
          </div>
        )}

        {/* Pagination */}

        {filteredCompanies.length > 0 && (
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
                <ChevronLeft
                  size={20}
                  strokeWidth={2.5}
                />
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
                <ChevronRight
                  size={20}
                  strokeWidth={2.5}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingCompany
                    ? "Edit Company"
                    : "Add Company"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage company master information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <span className="text-xl">×</span>
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              {/* Company Name */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Company Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: TCS"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Industry */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Industry
                </label>

                <input
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  placeholder="Example: IT Services"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Location */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Example: Chennai"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Website */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Website
                </label>

                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://www.example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Contact */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Contact
                </label>

                <input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="Example: hr@example.com / +91 98765 43210"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 pt-3">
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
                  {editingCompany
                    ? "Update Company"
                    : "Add Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Company Modal */}

      {viewCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Company Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Company master information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewCompany(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <span className="text-xl">×</span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {/* Company Name */}

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Company Name
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {viewCompany.name}
                </p>
              </div>

              {/* Industry */}

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Industry
                </p>

                <p className="mt-1 text-slate-700">
                  {viewCompany.industry || "-"}
                </p>
              </div>

              {/* Location */}

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Location
                </p>

                <p className="mt-1 text-slate-700">
                  {viewCompany.location || "-"}
                </p>
              </div>

              {/* Website */}

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Website
                </p>

                {viewCompany.website ? (
                  <a
                    href={viewCompany.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-indigo-600 hover:underline"
                  >
                    {viewCompany.website}
                  </a>
                ) : (
                  <p className="mt-1 text-slate-700">
                    -
                  </p>
                )}
              </div>

              {/* Contact */}

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Contact
                </p>

                <p className="mt-1 text-slate-700">
                  {viewCompany.contact || "-"}
                </p>
              </div>

              {/* Status */}

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Status
                </p>

                <span
                  className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    viewCompany.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {viewCompany.status || "Active"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setViewCompany(null)}
                className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recycle Bin */}

      {showBin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-6xl rounded-2xl bg-white shadow-2xl">
            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Company Recycle Bin
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Deleted companies can be restored from here.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowBin(false);
                  setSelectedDeletedCompanyIds([]);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <span className="text-xl">×</span>
              </button>
            </div>

            {/* Content */}

            <div className="max-h-[60vh] overflow-y-auto p-6">
              {binLoading ? (
                <div className="py-10 text-center text-slate-500">
                  Loading deleted companies...
                </div>
              ) : deletedCompanies.length === 0 ? (
                <div className="py-10 text-center">
                  <Trash2
                    size={40}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 font-semibold text-slate-700">
                    Bin is empty
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Deleted companies will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        {/* Select All */}

                        <th className="w-12 px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={
                              deletedCompanies.length > 0 &&
                              deletedCompanies.every(
                                (company) =>
                                  selectedDeletedCompanyIds.includes(
                                    company.id
                                  )
                              )
                            }
                            onChange={
                              handleSelectAllDeletedCompanies
                            }
                            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">
                          Company
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">
                          Industry
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">
                          Location
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">
                          Website
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">
                          Contact
                        </th>

                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-400">
                          Status
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-400">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {deletedCompanies.map((company) => (
                        <tr
                          key={company.id}
                          className={`border-b border-slate-100 transition ${
                            selectedDeletedCompanyIds.includes(
                              company.id
                            )
                              ? "bg-indigo-50"
                              : ""
                          }`}
                        >
                          {/* Checkbox */}

                          <td className="w-12 px-4 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedDeletedCompanyIds.includes(
                                company.id
                              )}
                              onChange={() =>
                                handleSelectDeletedCompany(
                                  company.id
                                )
                              }
                              className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </td>

                          {/* Company */}

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                                <Building2
                                  size={20}
                                  className="text-indigo-600"
                                />
                              </div>

                              <p className="font-semibold text-slate-900">
                                {company.name}
                              </p>
                            </div>
                          </td>

                          {/* Industry */}

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {company.industry || "-"}
                          </td>

                          {/* Location */}

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {company.location || "-"}
                          </td>

                          {/* Website */}

                          <td className="px-4 py-4 text-sm">
                            {company.website ? (
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 hover:underline"
                              >
                                Visit Website
                              </a>
                            ) : (
                              <span className="text-slate-500">
                                -
                              </span>
                            )}
                          </td>

                          {/* Contact */}

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {company.contact || "-"}
                          </td>

                          {/* Status */}

                          <td className="px-4 py-4 text-center">
                            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                              Deleted
                            </span>
                          </td>

                          {/* Restore */}

                          <td className="px-4 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                handleRestoreCompany(company)
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

            {/* Footer */}

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 p-6">
              {/* Restore Selected */}

              {selectedDeletedCompanyIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleRestoreSelectedCompanies}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                >
                  <RotateCcw size={18} />

                  Restore Selected (
                  {selectedDeletedCompanyIds.length})
                </button>
              )}

              {/* Close */}

              <button
                type="button"
                onClick={() => {
                  setShowBin(false);
                  setSelectedDeletedCompanyIds([]);
                }}
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

export default Companies;