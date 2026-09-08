const API_URL =
  "http://localhost:5083/api/trainingapplications";

export async function applyForTraining(
  studentId,
  trainingProgramId
) {
  const response = await fetch(
    `${API_URL}/apply`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: Number(studentId),
        trainingProgramId: Number(trainingProgramId),
        appliedDate: new Date().toISOString(),
        status: "Applied",
        isDeleted: false,
      }),
    }
  );

  if (response.status === 409) {
    throw new Error(
      "You have already applied for this training program."
    );
  }

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "Training application API error:",
      response.status,
      errorText
    );

    throw new Error(
      errorText ||
        "Failed to apply for training program."
    );
  }

  return await response.json();
}

export async function getStudentTrainingApplications(
  studentId
) {
  const response = await fetch(
    `${API_URL}/student/${studentId}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch training applications."
    );
  }

  return await response.json();
}