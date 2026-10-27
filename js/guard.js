const SESSION_KEY = "guardtrack.session", GUARDS_KEY = "guardtrack.guards", EVENTS_KEY = "guardtrack.events";
const $ = selector => document.querySelector(selector);
function readSession() {
  for (const storage of [localStorage, sessionStorage]) {
    try {
      const raw = storage.getItem(SESSION_KEY);
      if (!raw) continue;
      const session = JSON.parse(raw);
      if (session && typeof session.email === "string" && ["admin", "guard"].includes(session.role)) return session;
      storage.removeItem(SESSION_KEY);
    } catch { try { storage.removeItem(SESSION_KEY); } catch {} }
  }
  return null;
}
function logout() {
  for (const storage of [localStorage, sessionStorage]) { try { storage.removeItem(SESSION_KEY); } catch (error) { console.warn("Could not clear session", error); } }
  window.location.replace("./login.html");
}
const session = readSession();
if (!session) {
  window.location.replace("./login.html");
} else if (session.role !== "guard") {
  window.location.replace("./index.html");
} else {
  const seed = [
    { id:"GT-101",name:"Marco Dela Cruz",site:"Cebu Business Park",lat:10.318,lng:123.905,status:"Active" },
    { id:"GT-102",name:"Ramon Santos",site:"Cebu Port Area",lat:10.296,lng:123.902,status:"Idle" },
    { id:"GT-103",name:"Jose Villanueva",site:"IT Park",lat:10.33,lng:123.906,status:"Alert" },
    { id:"GT-104",name:"Paolo Reyes",site:"Cebu Business Park",lat:10.321,lng:123.899,status:"Offline" },
    { id:"GT-105",name:"Angelo Garcia",site:"IT Park",lat:10.327,lng:123.911,status:"Active" }
  ];
  let guards;
  try { guards = JSON.parse(localStorage.getItem(GUARDS_KEY) || "null"); } catch { guards = null; }
  if (!Array.isArray(guards) || !guards.length) guards = seed.map(g => ({...g}));
  let guard = guards.find(g => g.id === session.guardId) || guards[0];
  function save() { localStorage.setItem(GUARDS_KEY, JSON.stringify(guards)); }
  function log(message) {
    let events;
    try { events = JSON.parse(localStorage.getItem(EVENTS_KEY) || "[]"); } catch { events = []; }
    if (!Array.isArray(events)) events = [];
    events.unshift(new Date().toLocaleTimeString() + " — " + message);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(0, 40)));
  }
  function paint() {
    guard = guards.find(g => g.id === guard.id) || guard;
    $("#welcome").textContent = "Hello, " + (session.name || "Guard").split(" ")[0];
    $("#profileName").textContent = session.name || "Guard";
    $("#avatar").textContent = (session.name || "Guard").split(/\s+/).map(x => x[0]).join("").slice(0, 2).toUpperCase();
    $("#assignment").textContent = guard.site;
    $("#statusBadge").textContent = guard.status;
    $("#statusBadge").className = "state " + guard.status;
    $("#togglePatrol").textContent = guard.status === "Active" ? "End patrol" : "Start patrol";
  }
  $("#profileButton")?.addEventListener("click", event => { event.stopPropagation(); $("#profileMenu").classList.toggle("hidden"); });
  $("#logout")?.addEventListener("click", logout);
  document.addEventListener("click", event => { if (!event.target.closest(".profile-wrap")) $("#profileMenu").classList.add("hidden"); });
  $("#togglePatrol").addEventListener("click", () => {
    guard.status = guard.status === "Active" ? "Idle" : "Active";
    save(); log(session.name + (guard.status === "Active" ? " started" : " ended") + " patrol at " + guard.site); paint();
  });
  $("#checkin").addEventListener("click", () => {
    $("#checkinResult").textContent = "Checkpoint check-in recorded at " + new Date().toLocaleString() + " (simulated).";
    log(session.name + " checked in at " + guard.site);
  });
  $("#sos").addEventListener("click", () => {
    if (confirm("Send a simulated SOS alert? This does not contact emergency services.")) {
      guard.status = "Alert"; save(); log("SIMULATED SOS ALERT: " + session.name + " at " + guard.site); paint();
      $("#sosResult").textContent = "Demo SOS recorded at " + new Date().toLocaleTimeString() + ". No emergency services were contacted.";
    }
  });
  paint();
}
