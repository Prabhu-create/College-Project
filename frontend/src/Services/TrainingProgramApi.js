const API_URL = "http://localhost:5083/api/trainingprograms";

export async function getTrainingPrograms() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch training programs");
  }

  return await response.json();
}

export async function createTrainingProgram(program) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(program),
  });

  if (!response.ok) {
    throw new Error("Failed to create training program");
  }

  return await response.json();
}

export async function updateTrainingProgram(id, program) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...program,
      id: Number(id),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update training program");
  }
}

export async function deleteTrainingProgram(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete training program");
  }
}

// Get deleted training programs
export async function getDeletedTrainingPrograms() {
  const response = await fetch(`${API_URL}/bin`);

  if (!response.ok) {
    throw new Error("Failed to load deleted training programs");
  }

  return await response.json();
}

// Restore deleted training program
export async function restoreTrainingProgram(id) {
  const response = await fetch(`${API_URL}/restore/${id}`, {
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error("Failed to restore training program");
  }
}