const BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "/api";
const req = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
};

export const api = {
  getTasks: ()              => req('GET',  '/tasks'),
  createTask: (body)        => req('POST', '/tasks', body),
  markToday: (id)           => req('POST', `/tasks/${id}/today`),
  stopTask: (id)            => req('POST', `/tasks/${id}/stop`),
  deleteTask: (id)          => req('DELETE', `/tasks/${id}`),
};
