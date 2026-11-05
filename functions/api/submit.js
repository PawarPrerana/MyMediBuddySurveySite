export async function onRequestPost({ request, env }) {
  const endpoint = env.APPS_SCRIPT_URL;
  if (!endpoint) {
    return Response.json({ ok: false, error: "Server is not configured. Please contact the survey administrator." }, { status: 500 });
  }
  try {
    const payload = await request.json();
    if (!Array.isArray(payload.answers) || payload.answers.length !== 25) {
      return Response.json({ ok: false, error: "Please provide all 25 answers." }, { status: 400 });
    }
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow"
    });
    const raw = await upstream.text();
    let result;
    try { result = JSON.parse(raw); }
    catch (_) { throw new Error("The Google Apps Script endpoint did not return a valid response. Check its deployment and authorization."); }
    if (!result.ok) {
      return Response.json({ ok: false, error: result.error || "Google Forms rejected the response." }, { status: 400 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: String(err.message || err) }, { status: 502 });
  }
}
