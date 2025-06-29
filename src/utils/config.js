export const api = "http://localhost:3333/api";
export const uploads = "http://localhost:3333/uploads";

export const requestConfig = (method, data, token) => {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    config.body = JSON.stringify(data);
  }

  return config;
};
