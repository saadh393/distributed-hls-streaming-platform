export async function fetch_signed_url() {
  try {
    const res = await fetch("/api/video/init", {
      credentials: "include"
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Something went wrong")
    }

    return data;

  } catch (error) {
    throw error || "Something went wrong"
  }
}

export async function get_upload_permission({ baseurl, token, fileName, totalChunks }) {
  try {
    const res = await fetch(baseurl, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileName, totalChunks })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Something went wrong")
    }

    return data;
  } catch (err) {
    throw err || "Something went wrong"
  }
}

export async function upload_chunk({ baseurl, token, formData }) {
  try {
    const res = await fetch(baseurl, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Something went wrong")
    }

    return data;
  } catch (err) {
    throw err || "Something went wrong"
  }
}

export async function complete_upload({ baseurl, token }) {
  try {
    const res = await fetch(baseurl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Something went wrong")
    }

    return data;
  } catch (err) {
    throw err || "Something went wrong"
  }
}