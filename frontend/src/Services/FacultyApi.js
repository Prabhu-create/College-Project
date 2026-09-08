const API_URL = "http://localhost:5083/api/faculty";

export async function getFaculty() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to load faculty");
  }

  return await response.json();
}

export async function createFaculty(faculty) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(faculty),
  });

  if (!response.ok) {
    throw new Error("Failed to create faculty");
  }

  return await response.json();
}

export async function updateFaculty(id, faculty) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: Number(id),
      name: faculty.name,
      employeeId: faculty.employeeId,
      department: faculty.department,
      email: faculty.email,
      phone: faculty.phone,
      designation: faculty.designation,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update faculty");
  }
}

export async function deleteFaculty(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete faculty");
  }
}