const API_URL = "http://localhost:5247/api/Activities";

export async function getActivities() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function createActivity(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteActivity(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}
