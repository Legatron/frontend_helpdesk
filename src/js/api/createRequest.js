const createRequest = async (options = {}) => {
  const { method = 'GET', headers = {}, body, ...rest } = options;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(options.url, config);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return null; // нет содержимого
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export default createRequest;
