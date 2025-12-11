const request = async (method, url, data = null, options = {}) => {
  const headers = { "Content-Type": "application/json", ...options.headers };

  const fetchOptions = {
    method,
    headers,
    credentials: "include", 
    ...options,
  };

  if (data) {
    fetchOptions.body = JSON.stringify(data);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
   
    const errorData = await response.json().catch(() => ({}));
    throw errorData;
  }

  return await response.json().catch(() => ({}));
};

export default {
  get: (url, options) => request("GET", url, null, options),
  post: (url, data = {}, options) => request("POST", url, data, options),
  put: (url, data = {}, options) => request("PUT", url, data, options),
  delete: (url, data = {}, options) => request("DELETE", url, data, options),
};
