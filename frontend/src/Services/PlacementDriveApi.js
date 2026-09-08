const API_URL = "http://localhost:5083/api/placementdrives";

export async function getPlacementDrives() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch placement drives");
  }

  return await response.json();
}

export async function getPlacementDrive(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch placement drive");
  }

  return await response.json();
}

export async function createPlacementDrive(drive) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(drive),
  });

  if (!response.ok) {
    throw new Error("Failed to create placement drive");
  }

  return await response.json();
}

export async function updatePlacementDrive(id, drive) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...drive,
      id: Number(id),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update placement drive");
  }
}

export async function deletePlacementDrive(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete placement drive");
  }
}

export async function getDeletedPlacementDrives() {
  const response = await fetch(`${API_URL}/bin`);

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "API Status:",
      response.status
    );

    console.error(
      "API Error:",
      errorText
    );

    throw new Error(
      `Failed to fetch deleted placement drives: ${errorText}`
    );
  }

  return await response.json();
}

export async function restorePlacementDrive(id) {
  const response = await fetch(`${API_URL}/restore/${id}`, {
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error("Failed to restore placement drive");
  }
}