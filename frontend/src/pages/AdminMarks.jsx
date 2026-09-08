import { useMemo, useState } from "react";
import { useCollege } from "../context/CollegeContext";
import {
Rows,
Percent,
CheckCircle,
XCircle,
Search,
Eye,
} from "lucide-react";

function AdminMarks() {
const {
marksRecords,
marksLoading,
marksError,
} = useCollege();

const [searchTerm, setSearchTerm] = useState("");
const [selectedSubject, setSelectedSubject] = useState("");
const [selectedGrade, setSelectedGrade] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 10;

/* Get unique subjects */
const subjects = useMemo(() => {
return [
...new Set(
marksRecords
.map((mark) => mark.subject)
.filter(Boolean)
),
];
}, [marksRecords]);

/* Filter marks */
const filteredMarks = useMemo(() => {
return marksRecords.filter((mark) => {
const search = searchTerm.toLowerCase();

  const matchesSearch =
    mark.studentName?.toLowerCase().includes(search) ||
    mark.registerNumber?.toLowerCase().includes(search);

  const matchesSubject =
    !selectedSubject ||
    mark.subject === selectedSubject;

  const matchesGrade =
    !selectedGrade ||
    mark.grade === selectedGrade;

  return (
    matchesSearch &&
    matchesSubject &&
    matchesGrade
  );
});

}, [
marksRecords,
searchTerm,
selectedSubject,
selectedGrade,
]);

const totalPages = Math.ceil(
  filteredMarks.length / rowsPerPage
);

const startIndex = (currentPage - 1) * rowsPerPage;

const paginatedMarks = filteredMarks.slice(
  startIndex,
  startIndex + rowsPerPage
);

/* Calculate statistics */
const totalRecords = marksRecords.length;

const averageMarks =
totalRecords > 0
? (
marksRecords.reduce(
(total, mark) =>
total + Number(mark.marks),
0
) / totalRecords
).toFixed(1)
: "0";

const passedStudents = marksRecords.filter(
(mark) => Number(mark.marks) >= 50
).length;

const failedStudents = marksRecords.filter(
(mark) => Number(mark.marks) < 50
).length;

/* Loading */
if (marksLoading) {
return ( <div className="w-full p-8"> <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"> <p className="text-sm text-slate-500">
Loading marks... </p> </div> </div>
);
}

/* Error */
if (marksError) {
return ( <div className="w-full p-8"> <div className="rounded-2xl border border-red-200 bg-red-50 p-6"> <p className="font-medium text-red-600">
{marksError} </p> </div> </div>
);
}

return ( <div className="w-full p-8">

  {/* Heading */}

  <div>

    <p className="text-sm font-semibold text-indigo-600">
      ADMIN PORTAL
    </p>

    <h1 className="mt-2 text-3xl font-bold text-slate-900">
      Marks Overview
    </h1>

    <p className="mt-2 text-slate-500">
      View and monitor student examination marks.
    </p>

  </div>


  {/* Summary Cards */}

  <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">


    {/* Total Records */}

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Rows size={24} />
        </div>

        <div>

          <p className="text-sm text-slate-500">
            Total Records
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {totalRecords}
          </h2>

        </div>

      </div>

    </div>


    {/* Average Marks */}

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Percent size={24} />
        </div>

        <div>

          <p className="text-sm text-slate-500">
            Average Marks
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {averageMarks}
          </h2>

        </div>

      </div>

    </div>


    {/* Passed */}

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="rounded-xl bg-green-50 p-3 text-green-600">
          <CheckCircle size={24} />
        </div>

        <div>

          <p className="text-sm text-slate-500">
            Passed
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {passedStudents}
          </h2>

        </div>

      </div>

    </div>


    {/* Failed */}

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="rounded-xl bg-red-50 p-3 text-red-600">
          <XCircle size={24} />
        </div>

        <div>

          <p className="text-sm text-slate-500">
            Failed
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {failedStudents}
          </h2>

        </div>

      </div>

    </div>

  </div>


  {/* Filters */}

  <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

    <h2 className="text-lg font-bold text-slate-900">
      Search & Filter
    </h2>

    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">


      {/* Search */}

      <div className="relative">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => {
  setSearchTerm(event.target.value);
  setCurrentPage(1);
}}
          placeholder="Search student or register number"
          className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

      </div>


      {/* Subject Filter */}

      <select
        value={selectedSubject}
        onChange={(event) => {
  setSelectedSubject(event.target.value);
  setCurrentPage(1);
}}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >

        <option value="">
          All Subjects
        </option>

        {subjects.map((subject) => (

          <option
            key={subject}
            value={subject}
          >
            {subject}
          </option>

        ))}

      </select>


      {/* Grade Filter */}

      <select
        value={selectedGrade}
        onChange={(event) => {
  setSelectedGrade(event.target.value);
  setCurrentPage(1);
}}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >

        <option value="">
          All Grades
        </option>

        <option value="A+">
          A+
        </option>

        <option value="A">
          A
        </option>

        <option value="B+">
          B+
        </option>

        <option value="B">
          B
        </option>

        <option value="C">
          C
        </option>

        <option value="Fail">
          Fail
        </option>

      </select>

    </div>

  </div>


  {/* Marks Table */}

  <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

    <div className="flex items-center justify-between">

      <div>

        <h2 className="text-xl font-bold text-slate-900">
          Student Marks
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          View all examination marks submitted by faculty.
        </p>

      </div>


      <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">

        {filteredMarks.length} Records

      </div>

    </div>


    <div className="mt-6 overflow-x-auto">

      {filteredMarks.length === 0 ? (

        <div className="py-12 text-center">

          <Eye
            size={40}
            className="mx-auto text-slate-300"
          />

          <h3 className="mt-3 font-semibold text-slate-700">
            No marks found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            No student marks match your search criteria.
          </p>

        </div>

      ) : (

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-200 text-left text-sm text-slate-500">

              <th className="pb-4 font-medium">
                Student
              </th>

              <th className="pb-4 font-medium">
                Register Number
              </th>

              <th className="pb-4 font-medium">
                Subject
              </th>

              <th className="pb-4 font-medium">
                Marks
              </th>

              <th className="pb-4 font-medium">
                Percentage
              </th>

              <th className="pb-4 font-medium">
                Grade
              </th>

              <th className="pb-4 font-medium">
                Status
              </th>

            </tr>

          </thead>


          <tbody>

            {paginatedMarks.map((mark) => (

              <tr
                key={mark.id}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >

                <td className="py-4 font-medium text-slate-900">
                  {mark.studentName}
                </td>


                <td className="py-4 text-sm text-slate-500">
                  {mark.registerNumber}
                </td>


                <td className="py-4 text-sm text-slate-600">
                  {mark.subject}
                </td>


                <td className="py-4 font-bold text-slate-900">
                  {mark.marks}
                </td>


                <td className="py-4 text-sm text-slate-600">
                  {mark.percentage}
                </td>


                <td className="py-4">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      mark.marks >= 50
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {mark.grade}
                  </span>

                </td>


                <td className="py-4">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      Number(mark.marks) >= 50
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {Number(mark.marks) >= 50
                      ? "Passed"
                      : "Failed"}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}
      {filteredMarks.length > 0 && (
  <div className="mt-6 border-t border-slate-200 pt-4">
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

  </div>

</div>

);
}

export default AdminMarks;
