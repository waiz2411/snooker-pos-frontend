
async function request(url, options = {}) {
  const token = localStorage.getItem("token"); // Or from Redux/Context

  // const BASE_URL = "http://127.0.0.1:8000/api";
  const BASE_URL = "https://snooker-pos-backend-3.onrender.com/api";
  

  let headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // If the body is FormData, don't set Content-Type (browser will handle it)
  const isFormData = options.body instanceof FormData;

  // console.log ("::::::::::::::::::::::::",isFormData);
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(BASE_URL + url, {
      ...options,
      headers,
      credentials: 'omit', // <-- add this line
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    // Return JSON if available
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text(); // fallback for non-JSON
  } catch (error) {
    console.error("HTTP Error:", error.message);
    throw error;
  }
}

// Reusable helpers
export const http = {
  get: (url, options) => request(url, { method: "GET", ...options }),
  post: (url, body, options) =>
    request(url, { method: "POST", body: JSON.stringify(body), ...options }),
  postFormData: (url, body, options) =>
    request(url, { method: "POST", body: body, ...options }),

  put: (url, body, options) =>
    request(url, { method: "PUT", body: JSON.stringify(body), ...options }),
  patch: (url, body, options) =>
    request(url, { method: "PATCH", body: JSON.stringify(body), ...options }),
  delete: (url, options) => request(url, { method: "DELETE", ...options }),
};
