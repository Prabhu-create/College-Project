const API_URL = "http://localhost:5083/api/marks";

export async function getMarks() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to load marks");
  }

  return await response.json();
}

export async function createMark(mark) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mark),
  });

  if (!response.ok) {
    throw new Error("Failed to create mark");
  }

  return await response.json();
}

export async function updateMark(id, mark) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: Number(id),
      studentId: Number(mark.studentId),
      studentName: mark.studentName,
      registerNumber: mark.registerNumber,
      subject: mark.subject,
      marks: Number(mark.marks),
      percentage: mark.percentage,
      grade: mark.grade,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update mark");
  }
}

export async function deleteMark(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete mark");
  }
}