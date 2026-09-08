import { useState } from "react";
import { Layers, Activity, CheckCircle2, Users } from 'lucide-react';
import {
  BookOpen,
  Users,
  Clock,
  Plus,
  MoreVertical,
  X,
} from "lucide-react";

const trainingPrograms = [
  {
    id: 1,
    name: "Full Stack Development",
    trainer: "Mr. Arun Kumar",
    duration: "8 Weeks",
    students: 120,
    startDate: "01 Sep 2026",
    status: "Active",
  },
  {
    id: 2,
    name: "Data Science & AI",
    trainer: "Ms. Priya Sharma",
    duration: "6 Weeks",
    students: 85,
    startDate: "05 Sep 2026",
    status: "Active",
  },
  {
    id: 3,
    name: "AWS Cloud Computing",
    trainer: "Mr. Ravi Kumar",
    duration: "4 Weeks",
    students: 70,
    startDate: "10 Aug 2026",
    status: "Completed",
  },
  {
    id: 4,
    name: "Java Programming",
    trainer: "Mr. Suresh",
    duration: "6 Weeks",
    students: 95,
    startDate: "15 Sep 2026",
    status: "Upcoming",
  },
];

function Training() {
const [showModal, setShowModal] = useState(false);
const [programs, setPrograms] = useState(trainingPrograms);
const [formData, setFormData] = useState({
  name: "",
  trainer: "",
  duration: "",
  startDate: "",
  endDate: "",
  skills: "",
  description: "",
  maxStudents: "",
});


const handleChange = (event) => {
  const { name, value } = event.target;

  setFormData((previous) => ({
    ...previous,
    [name]: value,
  }));
};

const handleAddProgram = () => {
  if (
    !formData.name ||
    !formData.trainer ||
    !formData.duration ||
    !formData.startDate ||
    !formData.endDate ||
    !formData.skills ||
    !formData.description ||
    !formData.maxStudents
  ) {
    alert("Please fill in all fields.");
    return;
  }

  const newProgram = {
    id: Date.now(),
    name: formData.name,
    trainer: formData.trainer,
    duration: formData.duration,
    students: 0,
    startDate: formData.startDate,
    status: "Upcoming",
  };

  setPrograms((previous) => [
    ...previous,
    newProgram,
  ]);

  setFormData({
    name: "",
    trainer: "",
    duration: "",
    startDate: "",
    endDate: "",
    skills: "",
    description: "",
    maxStudents: "",
  });

  setShowModal(false);
};


  return (
    <div className="w-full p-8">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>

          <p className="text-sm font-semibold text-indigo-600">
            TRAINING MANAGEMENT
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Training Programs
          </h1>

          <p className="mt-2 text-slate-500">
            Manage training programs, trainers and student participation.
          </p>

        </div>

        <button
        onClick={() => setShowModal(true)}
         className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700">

          <Plus size={20} />

          Add Training Program

        </button>

      </div>

      {/* Statistics */}

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* Programs */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <BookOpen size={25} />
            </div>

            <div>

              <p className="text-sm text-slate-500">
                Training Programs
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                18
              </h2>

            </div>

          </div>

        </div>

        {/* Students */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Users size={25} />
            </div>

            <div>

              <p className="text-sm text-slate-500">
                Students Enrolled
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                620
              </h2>

            </div>

          </div>

        </div>

        {/* Active */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Clock size={25} />
            </div>

            <div>

              <p className="text-sm text-slate-500">
                Programs In Progress
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                8
              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* Training Table */}

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 p-6">

          <h2 className="text-xl font-bold text-slate-900">
            Training Programs
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current, upcoming and completed training programs.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Program
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Trainer
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Duration
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Students
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Start Date
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {programs.map((program) => (

                <tr
                  key={program.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >

                  {/* Program */}

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-600">
                        {program.name.charAt(0)}
                      </div>

                      <span className="font-semibold text-slate-900">
                        {program.name}
                      </span>

                    </div>

                  </td>

                  {/* Trainer */}

                  <td className="px-6 py-5 text-sm text-slate-600">
                    {program.trainer}
                  </td>

                  {/* Duration */}

                  <td className="px-6 py-5 text-sm text-slate-600">
                    {program.duration}
                  </td>

                  {/* Students */}

                  <td className="px-6 py-5 text-sm text-slate-600">
                    {program.students}
                  </td>

                  {/* Date */}

                  <td className="px-6 py-5 text-sm text-slate-600">
                    {program.startDate}
                  </td>

                  {/* Status */}

                  <td className="px-6 py-5">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        program.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : program.status === "Upcoming"
                          ? "bg-indigo-50 text-indigo-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {program.status}
                    </span>

                  </td>

                  {/* Action */}

                  <td className="px-6 py-5 text-right">

                    <button className="rounded-lg p-2 hover:bg-slate-100">
                      <MoreVertical size={19} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 p-6">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Add Training Program
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create a new training program.
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

        {/* Program Name */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Program Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Example: Full Stack Development"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Trainer */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Trainer
          </label>

          <input
            type="text"
            name="trainer"
            placeholder="Example: Mr. Arun Kumar"
            value={formData.trainer}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Duration */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Duration
          </label>

          <input
            type="text"
            name="duration"
            placeholder="Example: 8 Weeks"
            value={formData.duration}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Maximum Students */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Maximum Students
          </label>

          <input
            type="number"
            name="maxStudents"
            min="1"
            placeholder="Example: 100"
            value={formData.maxStudents}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Start Date */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Start Date
          </label>

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* End Date */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            End Date
          </label>

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Skills */}

        <div className="md:col-span-2">

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Skills Covered
          </label>

          <input
            type="text"
            name="skills"
            placeholder="React, Node.js, MongoDB"
            value={formData.skills}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

        </div>

        {/* Description */}

        <div className="md:col-span-2">

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            name="description"
            rows="3"
            placeholder="Describe the training program..."
            value={formData.description}
            onChange={handleChange}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
          onClick={handleAddProgram}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Add Program
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );
}

export default Training;