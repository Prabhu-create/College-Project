const API_URL =
  "http://localhost:5083/api/applications";

export const getApplications = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }

  return await response.json();
};

export const createApplication = async (application) => {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(application),
  });

  if (!response.ok) {
    throw new Error("Failed to create application");
  }

  return await response.json();
};

export const updateApplication = async (
  id,
  application
) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(application),
  });

  if (!response.ok) {
    throw new Error("Failed to update application");
  }
};

export const deleteApplication = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete application");
  }
};

export const getDeletedApplications = async () => {
  const response = await fetch(
    "http://localhost:5083/api/applications/bin"
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load deleted applications"
    );
  }

  return await response.json();
};


export const restoreApplication = async (id) => {
  const response = await fetch(
    `${API_URL}/${id}/restore`,
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to restore application"
    );
  }

  return true;
};