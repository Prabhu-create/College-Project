import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  BriefcaseBusiness,
  FileText,
  MapPin,
  CheckCircle,
  X,
  Building2,
  GraduationCap,
  Users,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCollege } from "../context/CollegeContext";

export default function Jobs() {
  const { user } = useAuth();

  const {
    students,
    drives,
    applications,
    addApplication,
    drivesLoading,
    drivesError,
  } = useCollege();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  // ---------------------------------------------------------
  // Find currently logged-in student
  // ---------------------------------------------------------

  const currentStudent = students.find(
    (student) =>
      Number(student.id) === Number(user?.studentId)
  );

  // ---------------------------------------------------------
  // Normalize backend response
  // ---------------------------------------------------------

  const normalizedDrives = (drives || []).map((drive) => ({
    ...drive,

    id: drive.id ?? drive.Id,

    company:
      drive.company ??
      drive.Company ??
      drive.companyName ??
      drive.CompanyName ??
      drive.companyDetails?.name ??
      drive.CompanyDetails?.name ??
      "",

    role:
      drive.role ??
      drive.Role ??
      drive.title ??
      drive.Title ??
      "",

    package:
      drive.package ??
      drive.Package ??
      "",

    location:
      drive.location ??
      drive.Location ??
      "",

    date:
      drive.date ??
      drive.Date ??
      "",

    eligibility:
      drive.eligibility ??
      drive.Eligibility ??
      "",

    openings:
      drive.openings ??
      drive.Openings ??
      0,

    status:
      drive.status ??
      drive.Status ??
      "Active",

    description:
      drive.description ??
      drive.Description ??
      "",

    requirements:
      drive.requirements ??
      drive.Requirements ??
      "",

    isDeleted:
      drive.isDeleted ??
      drive.IsDeleted ??
      false,
  }));

  // ---------------------------------------------------------
  // Available Jobs + Search Filter
  // ---------------------------------------------------------

  const availableJobs = normalizedDrives.filter((drive) => {
    const status = String(drive.status || "")
      .trim()
      .toLowerCase();

    const isDeleted =
      drive.isDeleted === true ||
      String(drive.isDeleted).toLowerCase() === "true";

    const isActive =
      !isDeleted &&
      (
        !status ||
        status === "active" ||
        status === "open" ||
        status === "ongoing" ||
        status === "available"
      );

    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) {
      return isActive;
    }

    // Search all important fields
    const searchableFields = [
      drive.company,
      drive.companyDetails?.name,
      drive.role,
      drive.location,
      drive.eligibility,
      drive.package,
      drive.description,
      drive.requirements,
    ];

    const matchesSearch = searchableFields
      .filter(
        (value) =>
          value !== null &&
          value !== undefined
      )
      .some((value) =>
        String(value)
          .trim()
          .toLowerCase()
          .includes(searchTerm)
      );

    return isActive && matchesSearch;
  });

  // ---------------------------------------------------------
  // Check whether student already applied
  // ---------------------------------------------------------

  const hasApplied = (drive) => {
    if (!currentStudent) {
      return false;
    }

    return (applications || []).some(
      (application) => {
        const applicationStudentId =
          application.studentId ??
          application.StudentId;

        const applicationCompany =
          application.company ??
          application.Company;

        const applicationRole =
          application.role ??
          application.Role;

        return (
          Number(applicationStudentId) ===
            Number(currentStudent.id) &&
          String(
            applicationCompany || ""
          ).toLowerCase() ===
            String(
              drive.company || ""
            ).toLowerCase() &&
          String(
            applicationRole || ""
          ).toLowerCase() ===
            String(
              drive.role || ""
            ).toLowerCase()
        );
      }
    );
  };

  // ---------------------------------------------------------
  // Apply for Job
  // ---------------------------------------------------------

  const handleApply = async (drive) => {
    if (!currentStudent) {
      alert(
        "Student profile could not be found. Please check your student account."
      );
      return;
    }

    if (hasApplied(drive)) {
      alert("You have already applied for this job.");
      return;
    }

    const newApplication = {
      studentId: currentStudent.id,

      student: currentStudent.name,

      registerNumber:
        currentStudent.registerNumber,

      company: drive.company,

      role: drive.role,

      package: drive.package,

      appliedDate:
        new Date()
          .toISOString()
          .split("T")[0],

      status: "Applied",
    };

    try {
      await addApplication(newApplication);

      alert(
        `Application submitted successfully for ${drive.company}.`
      );

      setSelectedJob(null);
    } catch (error) {
      console.error(
        "Failed to apply for job:",
        error
      );

      alert(
        "Failed to submit application. Please try again."
      );
    }
  };

  // ---------------------------------------------------------
  // Loading
  // ---------------------------------------------------------

  if (drivesLoading) {
    return (
      <div className="min-h-full bg-slate-50 p-8">

        <div className="flex min-h-[400px] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

            <p className="text-sm font-medium text-slate-600">
              Loading available jobs...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ---------------------------------------------------------
  // Error
  // ---------------------------------------------------------

  if (drivesError) {
    return (
      <div className="min-h-full bg-slate-50 p-8">

        <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <BriefcaseBusiness size={24} />
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Unable to load jobs
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                There was a problem loading placement drives.
              </p>

              <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {drivesError?.message ||
                  "Failed to load placement drives."}
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // ---------------------------------------------------------
  // PAGE
  // ---------------------------------------------------------

  return (
    <div className="min-h-full bg-slate-50 p-8">

      {/* ---------------------------------------------------
          PAGE HEADER
      --------------------------------------------------- */}

      <div className="mb-8">

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>

            <p className="mb-2 text-sm font-semibold text-indigo-600">
              STUDENT PORTAL
            </p>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                <BriefcaseBusiness
                  size={25}
                  strokeWidth={1.8}
                />

              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Jobs
                </h1>

                <p className="text-sm text-slate-500">
                  Explore placement opportunities and apply for jobs.
                </p>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/applications")
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
          >

            <FileText size={18} />

            My Applications

          </button>

        </div>

      </div>

      {/* ---------------------------------------------------
          SEARCH
      --------------------------------------------------- */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="relative">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search company, role, location or eligibility..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />

        </div>

      </div>

      {/* ---------------------------------------------------
          SUMMARY
      --------------------------------------------------- */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Available Jobs */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Available Jobs
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {availableJobs.length}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <BriefcaseBusiness size={22} />
            </div>

          </div>

        </div>

        {/* Applications */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                My Applications
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">

                {
                  (applications || []).filter(
                    (application) =>
                      Number(
                        application.studentId ??
                        application.StudentId
                      ) ===
                      Number(currentStudent?.id)
                  ).length
                }

              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <FileText size={22} />
            </div>

          </div>

        </div>

      </div>

      {/* ---------------------------------------------------
          JOB LIST
      --------------------------------------------------- */}

      {availableJobs.length === 0 ? (

        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <BriefcaseBusiness size={30} />
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-900">
            No jobs available
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">

            {search
              ? "No placement drives match your search."
              : "There are currently no active placement drives published for students."}

          </p>

          {search && (

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Clear Search
            </button>

          )}

        </div>

      ) : (

        /*
          Compact Grid:
          Mobile  = 1 column
          Tablet  = 2 columns
          Large   = 3 columns
        */

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">

          {availableJobs.map((drive) => {

            const applied = hasApplied(drive);

            return (

              /* --------------------------------------------
                  COMPACT JOB CARD
              -------------------------------------------- */

              <div
                key={drive.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >

                {/* Job Header */}

                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                        <Building2 size={23} />

                      </div>

                      <div className="min-w-0">

                        <h2 className="truncate text-base font-bold text-slate-900">

                          {drive.company ||
                            "Unknown Company"}

                        </h2>

                        <p className="mt-1 truncate text-sm font-medium text-indigo-600">

                          {drive.role ||
                            "Job Position"}

                        </p>

                      </div>

                    </div>

                    <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Active
                    </span>

                  </div>

                </div>

                {/* ----------------------------------------
                    COMPACT JOB INFORMATION
                ---------------------------------------- */}

                <div className="border-t border-slate-100 px-5 py-4">

                  <div className="grid grid-cols-2 gap-4">

                    {/* Location */}

                    <div className="flex min-w-0 items-center gap-2">

                      <MapPin
                        size={17}
                        className="shrink-0 text-slate-400"
                      />

                      <div className="min-w-0">

                        <p className="text-xs text-slate-400">
                          Location
                        </p>

                        <p className="truncate text-sm font-medium text-slate-700">

                          {drive.location ||
                            "Not specified"}

                        </p>

                      </div>

                    </div>

                    {/* Openings */}

                    <div className="flex min-w-0 items-center gap-2">

                      <Users
                        size={17}
                        className="shrink-0 text-slate-400"
                      />

                      <div>

                        <p className="text-xs text-slate-400">
                          Openings
                        </p>

                        <p className="text-sm font-medium text-slate-700">

                          {Number(drive.openings) > 0
                            ? drive.openings
                            : "Not specified"}

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* ----------------------------------------
                    ACTIONS
                ---------------------------------------- */}

                <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-3">

                  {applied ? (

                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">

                      <CheckCircle size={17} />

                      Applied

                    </div>

                  ) : (

                    <div className="text-xs text-slate-400">
                      Applications open
                    </div>

                  )}

                  <div className="flex items-center gap-2">

                    {/* View */}

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedJob(drive)
                      }
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
                    >
                      View
                    </button>

                    {/* Apply */}

                    {!applied && (

                      <button
                        type="button"
                        onClick={() =>
                          handleApply(drive)
                        }
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                      >
                        Apply
                      </button>

                    )}

                  </div>

                </div>

              </div>

            );
          })}

        </div>

      )}

      {/* ---------------------------------------------------
          JOB DETAILS MODAL
      --------------------------------------------------- */}

      {selectedJob && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white p-6">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                  <Building2 size={24} />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">

                    {selectedJob.company}

                  </h2>

                  <p className="mt-1 text-sm font-medium text-indigo-600">

                    {selectedJob.role}

                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedJob(null)
                }
                aria-label="Close job details"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >

                <X size={20} />

              </button>

            </div>

            {/* Modal Content */}

            <div className="space-y-6 p-6">

              {/* Main Details */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Drive Date
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">

                    {selectedJob.date ||
                      "Not specified"}

                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">

                    {selectedJob.location ||
                      "Not specified"}

                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Openings
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">

                    {Number(selectedJob.openings) > 0
                      ? selectedJob.openings
                      : "Not specified"}

                  </p>

                </div>

                 {/* Eligibility */}

              {selectedJob.eligibility && (

                <div>

                  <h3 className="mb-2 flex items-center gap-2 font-semibold text-slate-900">

                    <GraduationCap
                      size={19}
                      className="text-indigo-600"
                    />

                    Eligibility

                  </h3>

                  <p className="text-sm leading-6 text-slate-600">

                    {selectedJob.eligibility}

                  </p>

                </div>

              )}

              </div>

             

              {/* Job Description */}

              <div>

                <h3 className="mb-2 font-semibold text-slate-900">
                  Job Description
                </h3>

                <p className="whitespace-pre-line text-sm leading-6 text-slate-600">

                  {selectedJob.description ||
                    `Responsibilities and requirements for the ${
                      selectedJob.role || "selected"
                    } position will be discussed during the recruitment process.`}

                </p>

              </div>

              {/* Requirements */}

              {selectedJob.requirements && (

                <div>

                  <h3 className="mb-2 font-semibold text-slate-900">
                    Requirements
                  </h3>

                  <p className="whitespace-pre-line text-sm leading-6 text-slate-600">

                    {selectedJob.requirements}

                  </p>

                </div>

              )}

            </div>

            {/* Modal Footer */}

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 p-5">

              <button
                type="button"
                onClick={() =>
                  setSelectedJob(null)
                }
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>

              {!hasApplied(selectedJob) && (

                <button
                  type="button"
                  onClick={() =>
                    handleApply(selectedJob)
                  }
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Apply Now
                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
