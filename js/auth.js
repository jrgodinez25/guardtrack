const DEMO_KEY = "guardtrack.demoAccounts";
const SESSION_KEY = "guardtrack.session";
const DEFAULT_ACCOUNTS = [
  { email: "admin@guardtrack.com", password: "admin123", name: "GuardTrack Admin", role: "admin", guardId: null },
  { email: "guard.juan@guardtrack.com", password: "guard123", name: "Juan Dela Cruz", role: "guard", guardId: "GT-101" }
];
const $ = (selector) => document.querySelector(selector);

function readStoredSession() {
  for (const storage of [localStorage, sessionStorage]) {
    try {
      const raw = storage.getItem(SESSION_KEY);
      if (!raw) continue;
      const session = JSON.parse(raw);
      if (session && typeof session.email === "string" && ["admin", "guard"].includes(session.role)) return session;
      storage.removeItem(SESSION_KEY);
    } catch {
      try { storage.removeItem(SESSION_KEY); } catch {}
    }
  }
  return null;
}
function goForRole(role) { window.location.replace(role === "admin" ? "./index.html" : "./guard.html"); }
function initializeAccounts() {
  let users;
  try { users = JSON.parse(localStorage.getItem(DEMO_KEY) || "null"); } catch { users = null; }
  if (!Array.isArray(users) || !users.some(u => u?.email === "admin@guardtrack.com") || !users.some(u => u?.email === "guard.juan@guardtrack.com")) {
    localStorage.setItem(DEMO_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  }
  return users;
}
const form = $("#loginForm");
const error = $("#error");
try {
  const existing = readStoredSession();
  if (existing) goForRole(existing.role);
  const accounts = initializeAccounts();

  document.querySelectorAll(".demo-fill").forEach(button => button.addEventListener("click", () => {
    $("#email").value = button.dataset.email || "";
    $("#password").value = button.dataset.password || "";
    if (error) error.textContent = "";
  }));
  $("#togglePassword")?.addEventListener("click", event => {
    const password = $("#password");
    password.type = password.type === "password" ? "text" : "password";
    event.currentTarget.textContent = password.type === "password" ? "Show" : "Hide";
    event.currentTarget.setAttribute("aria-label", password.type === "password" ? "Show password" : "Hide password");
  });
  form?.addEventListener("submit", event => {
    event.preventDefault();
    if (error) error.textContent = "";
    const email = $("#email").value.trim().toLowerCase();
    const password = $("#password").value;
    const user = accounts.find(candidate => String(candidate.email || "").toLowerCase() === email && candidate.password === password);
    if (!user) {
      if (error) error.textContent = "The email or password is incorrect. Select a demo account below to autofill the credentials.";
      return;
    }
    const session = { email: user.email, name: user.name, role: user.role, guardId: user.guardId || null, issuedAt: Date.now() };
    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      const storage = $("#remember")?.checked ? localStorage : sessionStorage;
      storage.setItem(SESSION_KEY, JSON.stringify(session));
      const saved = JSON.parse(storage.getItem(SESSION_KEY) || "null");
      if (!saved || saved.role !== user.role || saved.email !== user.email) throw new Error("Session could not be verified.");
      goForRole(user.role);
    } catch (storageError) {
      if (error) error.textContent = "Your browser blocked session storage. Enable site data for this site, reload, and try again.";
      console.error("GuardTrack sign-in failed:", storageError);
    }
  });
} catch (startupError) {
  console.error("GuardTrack authentication initialization failed:", startupError);
  if (error) error.textContent = "Sign-in could not initialize. Reload this page and try again.";
}
