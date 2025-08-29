export async function postJson(url, body, { signal, credentials = 'include' } = {}) {
  const res = await fetch("/api" + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials,
    signal,
    body: JSON.stringify(body),
  });

  let data = null;
  try { data = await res.json(); } catch (_) { }

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.code = data?.code;
    err.fieldErrors = data?.fieldErrors;
    throw err;
  }
  return data;
}

export async function getJson(url, args) {
  const res = await fetch("/api" + url, {
    headers: { 'Content-Type': 'application/json' },
    ...args
  });

  let data = null;
  try { data = await res.json(); } catch (_) { }

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.code = data?.code;
    err.fieldErrors = data?.fieldErrors;
    throw err;
  }
  return data;
}

export async function patchJson(url, body, { signal, credentials = 'include' } = {}) {
  const res = await fetch("/api" + url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials,
    signal,
    body: JSON.stringify(body),
  });

  let data = null;
  try { data = await res.json(); } catch (_) { }

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.code = data?.code;
    err.fieldErrors = data?.fieldErrors;
    throw err;
  }
  return data;
}

export async function deleteJson(url, { signal, credentials = 'include' } = {}) {
  const res = await fetch("/api" + url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials,
    signal,
  });

  let data = null;
  try { data = await res.json(); } catch (_) { }

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.code = data?.code;
    err.fieldErrors = data?.fieldErrors;
    throw err;
  }
  return data;
}

export async function getVideoById(videoId) {
  const res = await fetch(`/api/feed/${videoId}`, {
    headers: { 'Content-Type': 'application/json' }
  });

  let data = null;
  try { data = await res.json(); } catch (_) { }

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.code = data?.code;
    err.fieldErrors = data?.fieldErrors;
    throw err;
  }
  return data;
}