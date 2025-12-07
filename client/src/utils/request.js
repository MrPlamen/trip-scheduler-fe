const request = async (method, url, data, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  const fetchOptions = {
    method,
    headers,
    credentials: "include",  // very important for sessions
    ...options,
  };

  if (data) {
    fetchOptions.body = JSON.stringify(data);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw await response.json().catch(() => ({}));
  }

  return await response.json().catch(() => ({}));
};

export default {
  get: (url, options) => request('GET', url, null, options),
  post: (url, data, options) => request('POST', url, data, options),
  put: (url, data, options) => request('PUT', url, data, options),
  delete: (url, data, options) => request('DELETE', url, data, options),
};
