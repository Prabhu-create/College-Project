const API_URL = "http://localhost:5083/api/attendance";

export async function getAttendance() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to load attendance");
  }

  return await response.json();
}

export async function createAttendance(attendance) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(attendance),
  });

  if (!response.ok) {
    throw new Error("Failed to create attendance");
  }

  return await response.json();
}

export async function updateAttendance(id, attendance) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: Number(id),
      studentId: Number(attendance.studentId),
      date: attendance.date,
      status: attendance.status,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update attendance");
  }
}

export async function deleteAttendance(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete attendance");
  }
}