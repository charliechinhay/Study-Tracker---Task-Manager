const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
console.log("🔧 API BASE_URL:", BASE_URL);
export { BASE_URL };

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const cleanBase = BASE_URL.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.replace(/^\/+/, "");

  const finalUrl = `${cleanBase}/${cleanEndpoint}`;
  console.log("🌐 Fetching:", finalUrl);

  const res = await fetch(finalUrl, {
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP error ${res.status}`);
  }

  return res.json();
};
