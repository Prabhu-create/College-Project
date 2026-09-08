const API_URL =
  "http://localhost:5083/api/companies";

export async function getCompanies() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch companies");
  }

  return await response.json();
}

export async function createCompany(company) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(company),
  });

  if (!response.ok) {
    throw new Error("Failed to create company");
  }

  return await response.json();
}

export async function updateCompany(id, company) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...company,
      id: Number(id),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update company");
  }

  return true;
}

export async function deleteCompany(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete company");
  }

  return true;
}

export async function getDeletedCompanies() {
  const response = await fetch(`${API_URL}/bin`);

  if (!response.ok) {
    throw new Error("Failed to load deleted companies");
  }

  return await response.json();
}

export async function restoreCompany(id) {
  const response = await fetch(
    `${API_URL}/restore/${id}`,
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to restore company");
  }

  return true;
}