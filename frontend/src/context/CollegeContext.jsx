import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getTrainingPrograms,
  createTrainingProgram,
  updateTrainingProgram as updateTrainingProgramApi,
  deleteTrainingProgram as deleteTrainingProgramApi,
  getDeletedTrainingPrograms,
  restoreTrainingProgram as restoreTrainingProgramApi,
} from "../Services/TrainingProgramApi.js";

import {
  getApplications,
  createApplication,
  updateApplication as updateApplicationApi,
  deleteApplication as deleteApplicationApi,
  getDeletedApplications,
  restoreApplication as restoreApplicationApi,
} from "../Services/ApplicationApi.js";

import {
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "../Services/AttendanceApi.js";

import {
  getMarks,
  createMark,
  updateMark,
  deleteMark,
} from "../Services/MarksApi.js";

import {
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "../Services/FacultyApi.js";

import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany as deleteCompanyApi,
  getDeletedCompanies,
  restoreCompany as restoreCompanyApi,
} from "../Services/CompanyApi.js";

import {
  getPlacementDrives,
  createPlacementDrive,
  updatePlacementDrive,
  deletePlacementDrive,
  getDeletedPlacementDrives,
  restorePlacementDrive,
} from "../Services/PlacementDriveApi.js";

import {
  applyForTraining,
  getStudentTrainingApplications,
} from "../Services/TrainingApplicationApi.js";


const CollegeContext = createContext();

const initialStudents = [
  {
    id: 1,
    name: "Arun Kumar",
    registerNumber: "22CS101",
    department: "Computer Science",
    year: "Final Year",
    email: "arun@example.com",
    phone: "9876543210",
    cgpa: 8.7,
    skills: "React, Java",
    status: "Eligible",
  },
  {
    id: 2,
    name: "Priya Sharma",
    registerNumber: "22IT102",
    department: "Information Technology",
    year: "Final Year",
    email: "priya@example.com",
    phone: "9876543211",
    cgpa: 9.1,
    skills: "Python, SQL",
    status: "Eligible",
  },
];

const initialPrograms = [
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
];

const initialAttendanceRecords = {};

const initialApplications = [
  {
    id: 1,
    studentId: 1,
    student: "Arun Kumar",
    registerNumber: "22CS101",
    company: "TCS",
    role: "Software Developer",
    package: "7.5 LPA",
    appliedDate: "2026-08-18",
    status: "Shortlisted",
  },
];

export function CollegeProvider({ children }) {
  const API_URL = "http://localhost:5083/api/students";
  const FACULTY_API_URL = "http://localhost:5083/api/faculty";

  const [students, setStudents] = useState([]);

const [drives, setDrives] = useState([]);
const [drivesLoading, setDrivesLoading] = useState(true);
const [drivesError, setDrivesError] = useState("");

const [trainingPrograms, setTrainingPrograms] = useState([]);
const [trainingProgramsLoading, setTrainingProgramsLoading] =
  useState(true);
const [trainingProgramsError, setTrainingProgramsError] =
  useState("");

const [faculty, setFaculty] = useState([]);
const [facultyLoading, setFacultyLoading] = useState(true);
const [facultyError, setFacultyError] = useState("");

const [attendanceRecords, setAttendanceRecords] = useState([]);
const [attendanceLoading, setAttendanceLoading] = useState(true);
const [attendanceError, setAttendanceError] = useState("");

const [marksRecords, setMarksRecords] = useState([]);
const [marksLoading, setMarksLoading] = useState(true);
const [marksError, setMarksError] = useState("");

const [companies, setCompanies] = useState([]);

const [companiesLoading, setCompaniesLoading] =
  useState(true);

const [companiesError, setCompaniesError] =
  useState("");


const [applications, setApplications] = useState([]);
const [applicationsLoading, setApplicationsLoading] =
  useState(true);
const [applicationsError, setApplicationsError] =
  useState("");

useEffect(() => {
  const loadStudents = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load students");
      }

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  loadStudents();
}, []);

useEffect(() => {
  const loadFaculty = async () => {
    try {
      setFacultyLoading(true);
      setFacultyError("");

      const data = await getFaculty();

      setFaculty(data);
    } catch (error) {
      console.error("Failed to load faculty:", error);
      setFacultyError("Failed to load faculty.");
    } finally {
      setFacultyLoading(false);
    }
  };

  loadFaculty();
}, []);

useEffect(() => {
  const loadPlacementDrives = async () => {
    try {
      setDrivesLoading(true);
      setDrivesError("");

      const data = await getPlacementDrives();

      setDrives(data);
    } catch (error) {
      console.error("Failed to load placement drives:", error);
      setDrivesError("Failed to load placement drives.");
    } finally {
      setDrivesLoading(false);
    }
  };

  loadPlacementDrives();
}, []);

useEffect(() => {
  const loadAttendance = async () => {
    try {
      setAttendanceLoading(true);
      setAttendanceError("");

      const data = await getAttendance();

      setAttendanceRecords(data);
    } catch (error) {
      console.error("Failed to load attendance:", error);
      setAttendanceError("Failed to load attendance.");
    } finally {
      setAttendanceLoading(false);
    }
  };

  loadAttendance();
}, []);


useEffect(() => {
  const loadTrainingPrograms = async () => {
    try {
      setTrainingProgramsLoading(true);
      setTrainingProgramsError("");

      const data = await getTrainingPrograms();

      setTrainingPrograms(data);
    } catch (error) {
      console.error(
        "Failed to load training programs:",
        error
      );

      setTrainingProgramsError(
        "Failed to load training programs."
      );
    } finally {
      setTrainingProgramsLoading(false);
    }
  };

  loadTrainingPrograms();
}, []);

useEffect(() => {
  const loadApplications = async () => {
    try {
      setApplicationsLoading(true);
      setApplicationsError("");

      const data = await getApplications();

      setApplications(data);
    } catch (error) {
      console.error(
        "Failed to load applications:",
        error
      );

      setApplicationsError(
        "Failed to load applications."
      );
    } finally {
      setApplicationsLoading(false);
    }
  };

  loadApplications();
}, []);

useEffect(() => {
  const loadMarks = async () => {
    try {
      setMarksLoading(true);
      setMarksError("");

      const data = await getMarks();

      setMarksRecords(data);
    } catch (error) {
      console.error("Failed to load marks:", error);
      setMarksError("Failed to load marks.");
    } finally {
      setMarksLoading(false);
    }
  };

  loadMarks();
}, []);

useEffect(() => {

  const loadCompanies = async () => {

    try {

      setCompaniesLoading(true);
      setCompaniesError("");

      const data = await getCompanies();

      setCompanies(data);

    } catch (error) {

      console.error(
        "Failed to load companies:",
        error
      );

      setCompaniesError(
        "Failed to load companies."
      );

    } finally {

      setCompaniesLoading(false);

    }

  };

  loadCompanies();

}, []);


const addFaculty = async (newFaculty) => {
  try {
    const createdFaculty = await createFaculty(newFaculty);

    setFaculty((previous) => [
      createdFaculty,
      ...previous,
    ]);

    return createdFaculty;
  } catch (error) {
    console.error("Failed to add faculty:", error);
    throw error;
  }
};

const editFaculty = async (id, updatedFaculty) => {
  try {
    await updateFaculty(id, updatedFaculty);

    setFaculty((previous) =>
      previous.map((item) =>
        item.id === Number(id)
          ? {
              ...item,
              ...updatedFaculty,
              id: Number(id),
            }
          : item
      )
    );
  } catch (error) {
    console.error("Failed to update faculty:", error);
    throw error;
  }
};


const removeFaculty = async (id) => {
  try {
    await deleteFaculty(id);

    setFaculty((previous) =>
      previous.filter(
        (item) => item.id !== Number(id)
      )
    );
  } catch (error) {
    console.error("Failed to delete faculty:", error);
    throw error;
  }
};
 

  const addStudent = async (student) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    if (!response.ok) {
      throw new Error("Failed to add student");
    }

    const newStudent = await response.json();

    setStudents((previous) => [
      ...previous,
      newStudent,
    ]);
  } catch (error) {
    console.error("Error adding student:", error);
    alert("Failed to add student.");
  }
};

const updateStudent = async (studentId, updatedStudent) => {
  try {
    const id = Number(studentId);

    if (!Number.isInteger(id)) {
      console.error("Invalid student ID:", studentId);
      alert("Invalid student ID.");
      return false;
    }

    const studentData = {
      id: id,
      name: updatedStudent.name,
      registerNumber: updatedStudent.registerNumber,
      department: updatedStudent.department,
      year: updatedStudent.year,
      email: updatedStudent.email,
      password: updatedStudent.password,
      phone: updatedStudent.phone,
      cgpa: Number(updatedStudent.cgpa),
      skills: updatedStudent.skills,
    };

    console.log("UPDATING STUDENT:", studentData);

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("UPDATE ERROR STATUS:", response.status);
      console.error("UPDATE ERROR RESPONSE:", errorText);

      throw new Error("Failed to update student");
    }

    const calculatedStatus =
      Number(updatedStudent.cgpa) >= 7.5
        ? "Eligible"
        : "Not Eligible";

    setStudents((previous) =>
      previous.map((student) =>
        Number(student.id) === id
          ? {
              ...student,
              ...updatedStudent,
              id: id,
              cgpa: Number(updatedStudent.cgpa),
              status: calculatedStatus,
            }
          : student
      )
    );

    return true;
  } catch (error) {
    console.error("Error updating student:", error);
    alert("Failed to update student.");
    return false;
  }
};

  const deleteStudent = async (studentId) => {
  try {
    const response = await fetch(
      `${API_URL}/${studentId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete student");
    }

    setStudents((previous) =>
      previous.filter(
        (student) => student.id !== studentId
      )
    );
  } catch (error) {
    console.error("Error deleting student:", error);
    alert("Failed to delete student.");
  }
};  

const addDrive = async (drive) => {
  try {
    const newDrive = {
      ...drive,
      companyId: Number(drive.companyId),
      openings: Number(drive.openings || 0),
      status: drive.status || "Active",
      isDeleted: false,
    };

    const createdDrive =
      await createPlacementDrive(newDrive);

    setDrives((previous) => [
      ...previous,
      createdDrive,
    ]);

    return createdDrive;
  } catch (error) {
    console.error(
      "Failed to add placement drive:",
      error
    );

    throw error;
  }
};

const updateDrive = async (
  driveId,
  updatedDrive
) => {
  try {
    const drive = {
      ...updatedDrive,
      id: Number(driveId),
      companyId: Number(updatedDrive.companyId),
      openings: Number(
        updatedDrive.openings || 0
      ),
    };

    await updatePlacementDrive(
      driveId,
      drive
    );

    // Reload from API so companyDetails is also available
    const updatedDrives =
      await getPlacementDrives();

    setDrives(updatedDrives);

    return true;
  } catch (error) {
    console.error(
      "Failed to update placement drive:",
      error
    );

    throw error;
  }
};

const deleteDrive = async (driveId) => {
  try {
    await deletePlacementDrive(driveId);

    setDrives((previous) =>
      previous.filter(
        (drive) => drive.id !== Number(driveId)
      )
    );
  } catch (error) {
    console.error(
      "Failed to delete placement drive:",
      error
    );

    throw error;
  }
};

const getDeletedDrives = async () => {
  try {
    return await getDeletedPlacementDrives();
  } catch (error) {
    console.error(
      "Failed to load deleted placement drives:",
      error
    );

    throw error;
  }
};

const restoreDrive = async (driveId) => {
  try {
    await restorePlacementDrive(driveId);

    const response = await getPlacementDrives();

    setDrives(response);

    return true;
  } catch (error) {
    console.error(
      "Failed to restore placement drive:",
      error
    );

    throw error;
  }
};

 /* const addProgram = (program) => {
    setPrograms((previous) => [
      ...previous,
      {
        ...program,
        id: Date.now(),
      },
    ]);
  };*/

  const addAttendance = async (attendance) => {
  try {
    const newAttendance = {
      studentId: Number(attendance.studentId),
      date: attendance.date,
      status: attendance.status,
    };

    const createdAttendance =
      await createAttendance(newAttendance);

    setAttendanceRecords((previous) => [
      ...previous,
      createdAttendance,
    ]);

    return createdAttendance;
  } catch (error) {
    console.error("Failed to add attendance:", error);
    alert("Failed to save attendance.");
    throw error;
  }
};

const editAttendance = async (id, attendance) => {
  try {
    await updateAttendance(id, attendance);

    setAttendanceRecords((previous) =>
      previous.map((item) =>
        item.id === Number(id)
          ? {
              ...item,
              ...attendance,
              id: Number(id),
              studentId: Number(attendance.studentId),
            }
          : item
      )
    );
  } catch (error) {
    console.error("Failed to update attendance:", error);
    alert("Failed to update attendance.");
    throw error;
  }
};

const removeAttendance = async (id) => {
  try {
    await deleteAttendance(id);

    setAttendanceRecords((previous) =>
      previous.filter(
        (item) => item.id !== Number(id)
      )
    );
  } catch (error) {
    console.error("Failed to delete attendance:", error);
    alert("Failed to delete attendance.");
    throw error;
  }
};

const addMarksRecord = async (mark) => {
  try {
    const createdMark = await createMark(mark);

    setMarksRecords((previous) => [
      createdMark,
      ...previous,
    ]);

    return createdMark;
  } catch (error) {
    console.error("Failed to add mark:", error);
    throw error;
  }
};

const updateMarksRecord = async (markId, updatedMark) => {
  try {
    const id = Number(markId);

    const markData = {
      id,
      studentId: Number(updatedMark.studentId),
      studentName: updatedMark.studentName,
      registerNumber: updatedMark.registerNumber,
      subject: updatedMark.subject,
      marks: Number(updatedMark.marks),
      percentage: updatedMark.percentage,
      grade: updatedMark.grade,
    };

    await updateMark(id, markData);

    setMarksRecords((previous) =>
      previous.map((mark) =>
        Number(mark.id) === id
          ? {
              ...mark,
              ...markData,
              id,
            }
          : mark
      )
    );

    return true;
  } catch (error) {
    console.error("Failed to update mark:", error);
    throw error;
  }
};

const deleteMarksRecord = async (markId) => {
  try {
    await deleteMark(markId);

    setMarksRecords((previous) =>
      previous.filter(
        (mark) => mark.id !== Number(markId)
      )
    );
  } catch (error) {
    console.error("Failed to delete mark:", error);
    throw error;
  }
};

const addApplication = async (application) => {
  try {
    const newApplication = {
      ...application,
      studentId: Number(application.studentId),
      appliedDate:
        application.appliedDate ||
        new Date().toISOString(),
    };

    const createdApplication =
      await createApplication(newApplication);

    setApplications((previous) => [
      ...previous,
      createdApplication,
    ]);

    return createdApplication;
  } catch (error) {
    console.error(
      "Failed to add application:",
      error
    );

    alert("Failed to add application.");

    throw error;
  }
};

const updateApplication = async (
  applicationId,
  updatedApplication
) => {
  try {
    const application = {
      ...updatedApplication,
      id: Number(applicationId),
      studentId: Number(updatedApplication.studentId),
    };

    await updateApplicationApi(
      applicationId,
      application
    );

    setApplications((previous) =>
      previous.map((item) =>
        item.id === Number(applicationId)
          ? application
          : item
      )
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to update application:",
      error
    );

    alert("Failed to update application.");

    return false;
  }
};

const updateApplicationStatus = async (
  applicationId,
  status
) => {
  try {
    const existingApplication = applications.find(
      (application) =>
        application.id === Number(applicationId)
    );

    if (!existingApplication) {
      throw new Error("Application not found");
    }

    const updatedApplication = {
      ...existingApplication,
      id: Number(applicationId),
      studentId: Number(existingApplication.studentId),
      status: status,
    };

    await updateApplicationApi(
      applicationId,
      updatedApplication
    );

    setApplications((previous) =>
      previous.map((application) =>
        application.id === Number(applicationId)
          ? updatedApplication
          : application
      )
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to update application status:",
      error
    );

    alert("Failed to update application status.");

    return false;
  }
};

const deleteApplication = async (applicationId) => {
  try {
    await deleteApplicationApi(applicationId);

    setApplications((previous) =>
      previous.filter(
        (application) =>
          application.id !== Number(applicationId)
      )
    );
  } catch (error) {
    console.error(
      "Failed to delete application:",
      error
    );

    alert("Failed to delete application.");
  }
};

const getDeletedApplicationsList = async () => {
  try {
    const deletedApplications =
      await getDeletedApplications();

    return deletedApplications;
  } catch (error) {
    console.error(
      "Failed to load deleted applications:",
      error
    );

    throw error;
  }
};


const restoreApplication = async (applicationId) => {
  try {
    await restoreApplicationApi(applicationId);

    // Reload active applications after restore
    const updatedApplications =
      await getApplications();

    setApplications(updatedApplications);

    return true;
  } catch (error) {
    console.error(
      "Failed to restore application:",
      error
    );

    alert("Failed to restore application.");

    return false;
  }
};

const addTrainingProgram = async (program) => {
  try {
    const newProgram = {
      ...program,
      students: Number(program.students || 0),
      completion: Number(program.completion || 0),
      status:
        Number(program.completion || 0) >= 100
          ? "Completed"
          : "Active",
    };

    const createdProgram =
      await createTrainingProgram(newProgram);

    setTrainingPrograms((previous) => [
      ...previous,
      createdProgram,
    ]);

    return createdProgram;
  } catch (error) {
    console.error(
      "Failed to add training program:",
      error
    );

    alert("Failed to add training program.");

    throw error;
  }
};

const updateTrainingProgram = async (updatedProgram) => {
  try {
    const program = {
      ...updatedProgram,
      id: Number(updatedProgram.id),
      students: Number(updatedProgram.students || 0),
      completion: Number(updatedProgram.completion || 0),
      status:
        Number(updatedProgram.completion || 0) >= 100
          ? "Completed"
          : "Active",
    };

    await updateTrainingProgramApi(
      program.id,
      program
    );

    setTrainingPrograms((previous) =>
      previous.map((item) =>
        item.id === program.id
          ? program
          : item
      )
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to update training program:",
      error
    );

    alert("Failed to update training program.");

    return false;
  }
};

const deleteTrainingProgram = async (id) => {
  try {
    await deleteTrainingProgramApi(id);

    setTrainingPrograms((previous) =>
      previous.filter(
        (program) => program.id !== Number(id)
      )
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to delete training program:",
      error
    );

    alert("Failed to delete training program.");

    return false;
  }
};

const getDeletedTrainingProgramsList = async () => {
  try {
    return await getDeletedTrainingPrograms();
  } catch (error) {
    console.error(
      "Failed to load deleted training programs:",
      error
    );

    throw error;
  }
};

const restoreTrainingProgram = async (id) => {
  try {
    await restoreTrainingProgramApi(id);

    // Reload active training programs
    const updatedPrograms = await getTrainingPrograms();

    setTrainingPrograms(updatedPrograms);

    return true;
  } catch (error) {
    console.error(
      "Failed to restore training program:",
      error
    );

    alert("Failed to restore training program.");

    return false;
  }
};

const getDeletedStudents = async () => {
  const response = await fetch(`${API_URL}/bin`);

  if (!response.ok) {
    throw new Error("Failed to load deleted students");
  }

  return await response.json();
};

const restoreStudent = async (studentId) => {
  try {
    const id = Number(studentId);

    if (!Number.isInteger(id)) {
      throw new Error("Invalid student ID");
    }

    const response = await fetch(
      `${API_URL}/${id}/restore`,
      {
        method: "PUT",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "RESTORE ERROR:",
        errorText
      );
      throw new Error("Failed to restore student");
    }

    // Reload the student list
    const studentsResponse = await fetch(API_URL);

    if (studentsResponse.ok) {
      const data = await studentsResponse.json();
      setStudents(data);
    }

    return true;
  } catch (error) {
    console.error(
      "Error restoring student:",
      error
    );

    alert("Failed to restore student.");
    return false;
  }
};

const getDeletedFaculty = async () => {
  try {
    const response = await fetch(
      `${FACULTY_API_URL}/bin`
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "BIN ERROR:",
        response.status,
        errorText
      );

      throw new Error(
        "Failed to load deleted faculty"
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Failed to load deleted faculty:",
      error
    );

    throw error;
  }
};

const restoreFaculty = async (id) => {
  try {
    const response = await fetch(
      `${FACULTY_API_URL}/restore/${id}`,
      {
        method: "PUT",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "RESTORE ERROR:",
        response.status,
        errorText
      );

      throw new Error("Failed to restore faculty");
    }

    // Reload active faculty
    const facultyResponse = await fetch(
      FACULTY_API_URL
    );

    if (facultyResponse.ok) {
      const data = await facultyResponse.json();

      setFaculty(data);
    }

    return true;

  } catch (error) {
    console.error(
      "Failed to restore faculty:",
      error
    );

    throw error;
  }
};

const addCompany = async (company) => {
  try {
    const newCompany = {
      name: company.name,
      industry: company.industry,
      location: company.location,
      website: company.website || "",
      contact: company.contact || "",
      status: company.status || "Active",
      isDeleted: false,
    };

    const createdCompany =
      await createCompany(newCompany);

    setCompanies((previous) => [
      createdCompany,
      ...previous,
    ]);

    return createdCompany;
  } catch (error) {
    console.error(
      "Failed to add company:",
      error
    );

    throw error;
  }
};

const editCompany = async (
  id,
  updatedCompany
) => {
  try {
    const company = {
      name: updatedCompany.name,
      industry: updatedCompany.industry,
      location: updatedCompany.location,
      website: updatedCompany.website || "",
      contact: updatedCompany.contact || "",
      status: updatedCompany.status || "Active",
    };

    await updateCompany(id, company);

    setCompanies((previous) =>
      previous.map((item) =>
        item.id === Number(id)
          ? {
              ...item,
              ...company,
              id: Number(id),
            }
          : item
      )
    );
  } catch (error) {
    console.error(
      "Failed to update company:",
      error
    );

    throw error;
  }
};


const removeCompany = async (id) => {

  try {

    await deleteCompanyApi(id);

    setCompanies((previous) =>
      previous.filter(
        (company) =>
          company.id !== Number(id)
      )
    );

  } catch (error) {

    console.error(
      "Failed to delete company:",
      error
    );

    throw error;
  }

};


const loadDeletedCompanies = async () => {

  return await getDeletedCompanies();

};

const restoreCompany = async (companyId) => {
  try {
    await restoreCompanyApi(companyId);

    // Reload companies after restore
    const updatedCompanies = await getCompanies();

    setCompanies(updatedCompanies);

    return true;
  } catch (error) {
    console.error("Failed to restore company:", error);
    throw error;
  }
};

const applyTraining = async (
  studentId,
  trainingProgramId
) => {
  try {
    const application =
      await applyForTraining(
        studentId,
        trainingProgramId
      );

    return application;
  } catch (error) {
    console.error(
      "Failed to apply for training program:",
      error
    );

    throw error;
  }
};

const getStudentTrainingApps = async (
  studentId
) => {
  try {
    return await getStudentTrainingApplications(
      studentId
    );
  } catch (error) {
    console.error(
      "Failed to load student training applications:",
      error
    );

    throw error;
  }
};


  return (
    <CollegeContext.Provider
      value={{
  students,
  drives,
  drivesLoading,
  drivesError,
  faculty,
  facultyLoading,
  facultyError,
  attendanceRecords,
  attendanceLoading,
  attendanceError,
  marksRecords,
  marksLoading,
  marksError,
  applications,
  applicationsLoading,
  applicationsError,
  trainingPrograms,
  trainingProgramsLoading,
  trainingProgramsError,
  companies,
  companiesLoading,
  companiesError,
  
  

  addStudent,
  updateStudent,
  deleteStudent,
  restoreStudent,
  getDeletedStudents,

  addDrive,
  updateDrive,
  deleteDrive,
  getDeletedDrives,
  restoreDrive,

  addAttendance,
  editAttendance,
  removeAttendance,

  addFaculty,
  editFaculty,
  removeFaculty,
  getDeletedFaculty,
  restoreFaculty,

  addMarksRecord,
  updateMarksRecord,
  deleteMarksRecord,

  addCompany,
  editCompany,
  removeCompany,
  getDeletedCompanies,
  restoreCompany,

addApplication,
updateApplication,
updateApplicationStatus,
deleteApplication,
getDeletedApplications: getDeletedApplicationsList,
restoreApplication,

addTrainingProgram,
updateTrainingProgram,
deleteTrainingProgram,
getDeletedTrainingPrograms: getDeletedTrainingProgramsList,
restoreTrainingProgram,

applyTraining,
getStudentTrainingApps,

}}
    >
      {children}
    </CollegeContext.Provider>
  );
}

export function useCollege() {
  return useContext(CollegeContext);
}