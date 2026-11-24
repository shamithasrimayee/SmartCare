import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, Bell, CalendarDays, Check, ChevronRight, CircleHelp, Clock3,
  Cpu, FileText, LayoutDashboard, MapPin, Menu, Monitor, Plus, Search,
  Settings, ShieldCheck, Smartphone, Trash2, Wrench, X, Laptop, Tv,
  Refrigerator, WashingMachine, Watch, Gamepad2, Printer, Speaker, Pencil,
  History, AlertTriangle, ClipboardList
} from "lucide-react";

const categories = [
  "Smartphone", "Laptop", "Tablet", "Smartwatch", "Television",
  "Refrigerator", "Washing Machine", "Air Conditioner", "Gaming Console",
  "Printer", "Speaker", "Other"
];

const starterDevices = [
  { id: 1, name: "iPhone 15", brand: "Apple", category: "Smartphone", model: "15 · 128 GB", purchaseDate: "2025-02-12", warrantyEnd: "2027-02-12", nextService: "2026-12-10", status: "Good" },
  { id: 2, name: "IdeaPad Slim 5", brand: "Lenovo", category: "Laptop", model: "14IMH9", purchaseDate: "2024-08-20", warrantyEnd: "2026-08-20", nextService: "2026-12-02", status: "Needs attention" },
  { id: 3, name: "Samsung Smart TV", brand: "Samsung", category: "Television", model: "Crystal UHD", purchaseDate: "2023-11-05", warrantyEnd: "2025-11-05", nextService: "", status: "Good" }
];

const shops = [
  { name: "TechCare Service Hub", specialty: "Phones · Laptops · Tablets", distance: "2.1 km", rating: "4.7", phone: "+91 98765 43210" },
  { name: "Digital Repair Point", specialty: "TVs · Audio · Gaming", distance: "3.4 km", rating: "4.5", phone: "+91 98765 12340" },
  { name: "HomeTech Solutions", specialty: "AC · Refrigerator · Washing machine", distance: "4.8 km", rating: "4.6", phone: "+91 99887 76655" }
];

const iconFor = (category) => {
  const props = { size: 20 };
  if (category === "Smartphone" || category === "Smartwatch") return <Smartphone {...props} />;
  if (category === "Laptop" || category === "Tablet") return <Laptop {...props} />;
  if (category === "Television") return <Tv {...props} />;
  if (category === "Refrigerator") return <Refrigerator {...props} />;
  if (category === "Washing Machine" || category === "Air Conditioner") return <Activity {...props} />;
  if (category === "Gaming Console") return <Gamepad2 {...props} />;
  if (category === "Printer") return <Printer {...props} />;
  if (category === "Speaker") return <Speaker {...props} />;
  return <Cpu {...props} />;
};

const today = new Date();
const dateText = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Not set";
const daysUntil = (value) => value ? Math.ceil((new Date(`${value}T00:00:00`) - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000) : null;

export default function App() {
  const [devices, setDevices] = useState(() => {
    try { return JSON.parse(localStorage.getItem("smartcare-devices")) || starterDevices; }
    catch { return starterDevices; }
  });
  const [active, setActive] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", brand: "", category: "Smartphone", model: "", purchaseDate: "", warrantyEnd: "", nextService: "" });
  const [notice, setNotice] = useState("");
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("smartcare-history")) || [{ id: 1, title: "SmartCare profile created", detail: "Your device care space is ready", date: "2026-11-24" }]; }
    catch { return []; }
  });

  useEffect(() => localStorage.setItem("smartcare-devices", JSON.stringify(devices)), [devices]);
  useEffect(() => localStorage.setItem("smartcare-history", JSON.stringify(history)), [history]);

  const alerts = useMemo(() => devices.flatMap(d => {
    const result = [];
    const warrantyDays = daysUntil(d.warrantyEnd);
    const serviceDays = daysUntil(d.nextService);
    if (warrantyDays !== null && warrantyDays >= 0 && warrantyDays <= 30)
      result.push({ id: `${d.id}-w`, device: d.name, type: "Warranty", date: d.warrantyEnd, days: warrantyDays });
    if (serviceDays !== null && serviceDays <= 30)
      result.push({ id: `${d.id}-s`, device: d.name, type: "Service", date: d.nextService, days: serviceDays });
    return result;
  }), [devices]);

  const filtered = devices.filter(d => `${d.name} ${d.brand} ${d.category}`.toLowerCase().includes(search.toLowerCase()));

  function openAdd() {
    setEditing(null);
    setForm({ name: "", brand: "", category: "Smartphone", model: "", purchaseDate: "", warrantyEnd: "", nextService: "" });
    setModal(true);
  }
  function openEdit(device) {
    setEditing(device.id);
    setForm({ name: device.name, brand: device.brand, category: device.category, model: device.model, purchaseDate: device.purchaseDate, warrantyEnd: device.warrantyEnd, nextService: device.nextService });
    setModal(true);
  }
  function saveDevice(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editing) {
      setDevices(prev => prev.map(d => d.id === editing ? { ...d, ...form } : d));
      setHistory(prev => [{ id: Date.now(), title: `${form.name} details updated`, detail: "Device information was edited", date: new Date().toISOString().slice(0,10) }, ...prev]);
      setNotice("Device updated successfully");
    } else {
      const item = { id: Date.now(), ...form, status: "Good" };
      setDevices(prev => [item, ...prev]);
      setHistory(prev => [{ id: Date.now(), title: `${form.name} added`, detail: "New device added to Product Care Passport", date: new Date().toISOString().slice(0,10) }, ...prev]);
      setNotice("Device added to your Product Care Passport");
    }
    setModal(false);
    setTimeout(() => setNotice(""), 3000);
  }
  function removeDevice(id) {
    const item = devices.find(d => d.id === id);
    if (!window.confirm(`Remove ${item?.name || "this device"} from SmartCare?`)) return;
    setDevices(prev => prev.filter(d => d.id !== id));
    setHistory(prev => [{ id: Date.now(), title: `${item?.name || "Device"} removed`, detail: "Device removed from your list", date: new Date().toISOString().slice(0,10) }, ...prev]);
  }
  function recordService(device) {
    setHistory(prev => [{ id: Date.now(), title: `Service recorded: ${device.name}`, detail: "Service visit marked in Product Care Passport", date: new Date().toISOString().slice(0,10) }, ...prev]);
    setNotice("Service activity added to history");
    setTimeout(() => setNotice(""), 3000);
  }

  const nav = [
    ["Dashboard", LayoutDashboard], ["My Devices", Smartphone], ["Maintenance Alerts", Bell],
    ["Warranty", ShieldCheck], ["Repair Shops", Wrench], ["Service History", History]
  ];
  const pageTitle = active === "Dashboard" ? "Your device care, simplified." : active;
  const pageSub = active === "Dashboard" ? "One place to manage every electronic device you own." : "Keep your devices organised and cared for.";

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><ShieldCheck size={23}/></div><div><b>SmartCare</b><small>DEVICE CARE HUB</small></div></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{nav.map(([label, Icon]) => <button key={label} className={`nav-item ${active === label ? "active" : ""}`} onClick={() => setActive(label)}><Icon size={18}/><span>{label}</span>{label === "Maintenance Alerts" && alerts.length > 0 && <em>{alerts.length}</em>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><CircleHelp size={19}/><b>Need a hand?</b><p>Your device care journey starts here.</p></div><button className="nav-item" onClick={() => setNotice("Settings will be available in a future version.")}><Settings size={18}/>Settings</button><div className="profile"><div className="avatar">SC</div><div><b>SmartCare User</b><small>Personal account</small></div></div></div>
    </aside>

    <main className="main">
      <header className="topbar"><div className="mobile-brand"><ShieldCheck size={22}/> SmartCare</div><div className="crumb">Workspace <ChevronRight size={14}/> <b>{active}</b></div><div className="top-actions"><div className="today"><CalendarDays size={16}/> {today.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div><button className="icon-button" title="Alerts" onClick={() => setActive("Maintenance Alerts")}><Bell size={18}/>{alerts.length > 0 && <i/>}</button></div></header>

      <section className="page-heading"><div><div className="eyebrow">SMARTCARE OVERVIEW</div><h1>{pageTitle}</h1><p>{pageSub}</p></div>{active !== "Repair Shops" && active !== "Service History" && <button className="primary" onClick={openAdd}><Plus size={18}/> Add device</button>}</section>

      {active === "Dashboard" && <>
        <section className="hero"><div className="hero-copy"><span className="hero-tag"><ShieldCheck size={14}/> YOUR PRODUCT CARE PASSPORT</span><h2>Every device has a story.<br/><span>Keep it all in one place.</span></h2><p>Track purchases, warranties, maintenance and repairs through the complete life of your electronics.</p><button className="hero-button" onClick={openAdd}>Add your first device <ChevronRight size={16}/></button></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="device-stack"><div className="device-phone"><div className="phone-camera"/><div className="phone-screen"><ShieldCheck size={32}/><b>Protected</b><small>Care Passport</small></div></div><div className="device-tablet"><Monitor size={45}/><span>SMARTCARE</span></div></div><div className="floating-check"><Check size={17}/></div></div></section>
        <section className="stats-grid">
          <Stat icon={<Cpu/>} label="Total devices" value={devices.length} note="Across all categories"/>
          <Stat icon={<Bell/>} label="Upcoming alerts" value={alerts.length} note="Next 30 days"/>
          <Stat icon={<ShieldCheck/>} label="Active warranties" value={devices.filter(d => daysUntil(d.warrantyEnd) >= 0).length} note="Based on saved dates"/>
          <Stat icon={<ClipboardList/>} label="Care activities" value={history.length} note="In your care history"/>
        </section>
        <section className="content-grid"><div className="panel devices-panel"><div className="panel-head"><div><h3>Your devices</h3><p>Your personal electronics collection</p></div><button className="text-button" onClick={() => setActive("My Devices")}>View all <ChevronRight size={15}/></button></div><DeviceList devices={devices.slice(0,4)} onEdit={openEdit} onDelete={removeDevice} onService={recordService}/></div><div className="panel alerts-panel"><div className="panel-head"><div><h3>Coming up</h3><p>Dates worth keeping an eye on</p></div><Bell size={18} className="muted-icon"/></div>{alerts.length ? alerts.slice(0,4).map(a => <div className="alert-row" key={a.id}><div className="alert-symbol"><Clock3 size={17}/></div><div className="alert-info"><b>{a.type} · {a.device}</b><small>{dateText(a.date)}</small></div><span className="days-pill">{a.days === 0 ? "Today" : `${a.days} days`}</span></div>) : <Empty icon={<Check/>} title="All clear for now" text="No warranty or service dates due in the next 30 days."/>}</div></section>
        <section className="passport-strip"><div className="passport-icon"><FileText size={22}/></div><div><b>Your Product Care Passport</b><p>Each device gets a continuous record of ownership, warranty, service and repair activity.</p></div><button onClick={() => setActive("Service History")}>View care history <ChevronRight size={15}/></button></section>
      </>}

      {active === "My Devices" && <section className="panel full-panel"><div className="panel-head"><div><h3>All devices</h3><p>{devices.length} devices in your collection</p></div><div className="search-box"><Search size={16}/><input placeholder="Search devices..." value={search} onChange={e => setSearch(e.target.value)}/></div></div><DeviceList devices={filtered} onEdit={openEdit} onDelete={removeDevice} onService={recordService}/></section>}

      {active === "Maintenance Alerts" && <section className="panel full-panel"><div className="panel-head"><div><h3>Maintenance & warranty alerts</h3><p>Upcoming dates within the next 30 days</p></div></div>{alerts.length ? alerts.map(a => <div className="alert-row large" key={a.id}><div className="alert-symbol"><AlertTriangle size={18}/></div><div className="alert-info"><b>{a.type} reminder · {a.device}</b><small>Due {dateText(a.date)}</small></div><span className="days-pill">{a.days === 0 ? "Today" : `${a.days} days left`}</span></div>) : <Empty icon={<Check/>} title="You're up to date" text="Add warranty expiry and next service dates to see reminders here."/>}</section>}

      {active === "Warranty" && <section className="panel full-panel"><div className="panel-head"><div><h3>Warranty tracker</h3><p>Warranty dates for all saved devices</p></div></div>{devices.length ? devices.map(d => { const days = daysUntil(d.warrantyEnd); return <div className="warranty-row" key={d.id}><div className="device-icon">{iconFor(d.category)}</div><div className="alert-info"><b>{d.name}</b><small>{d.brand} · {d.category}</small></div><div className="warranty-date"><b>{dateText(d.warrantyEnd)}</b><small>{days === null ? "Expiry not added" : days < 0 ? "Expired" : `${days} days remaining`}</small></div><span className={`status ${days === null ? "neutral" : days < 0 ? "expired" : "good"}`}>{days === null ? "Not set" : days < 0 ? "Expired" : "Active"}</span></div>}) : <Empty icon={<ShieldCheck/>} title="No devices yet" text="Add a device to start tracking its warranty."/>}</section>}

      {active === "Repair Shops" && <section className="panel full-panel"><div className="panel-head"><div><h3>Repair shop directory</h3><p>Sample listings for the prototype — contact and location details are demo data.</p></div></div><div className="shop-grid">{shops.map(shop => <div className="shop-card" key={shop.name}><div className="shop-icon"><Wrench size={21}/></div><div className="shop-rating">★ {shop.rating}</div><h3>{shop.name}</h3><p>{shop.specialty}</p><div className="shop-meta"><span><MapPin size={14}/>{shop.distance}</span><span><Smartphone size={14}/>{shop.phone}</span></div><button className="outline-button" onClick={() => setNotice(`Demo listing: ${shop.name}. Verify details before visiting.`)}>View shop details <ChevronRight size={15}/></button></div>)}</div><div className="demo-note">These are illustrative listings only. Live nearby repair-shop search, verified ratings and map directions require a maps/business data integration.</div></section>}

      {active === "Service History" && <section className="panel full-panel"><div className="panel-head"><div><h3>Product Care Passport activity</h3><p>A timeline of changes and service records</p></div></div>{history.length ? <div className="timeline">{history.map(item => <div className="timeline-item" key={item.id}><div className="timeline-dot"><History size={15}/></div><div><b>{item.title}</b><p>{item.detail}</p><small>{dateText(item.date)}</small></div></div>)}</div> : <Empty icon={<History/>} title="No activity yet" text="Add a device or record a service to start your timeline."/>}</section>}

      <footer>© 2026 SmartCare · A prototype for complete electronic-device care</footer>
    </main>

    {notice && <div className="toast"><Check size={17}/>{notice}<button onClick={() => setNotice("")}><X size={15}/></button></div>}
    {modal && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModal(false); }}><form className="modal" onSubmit={saveDevice}><div className="modal-head"><div><span className="eyebrow">PRODUCT CARE PASSPORT</span><h2>{editing ? "Edit device" : "Add a device"}</h2><p>Save the details you want to keep track of.</p></div><button type="button" className="icon-button" onClick={() => setModal(false)}><X size={19}/></button></div><div className="form-grid"><label className="wide">Device name *<input required value={form.name} placeholder="e.g. My smartphone" onChange={e => setForm({...form, name:e.target.value})}/></label><label>Brand<input value={form.brand} placeholder="e.g. Samsung" onChange={e => setForm({...form, brand:e.target.value})}/></label><label>Category<select value={form.category} onChange={e => setForm({...form, category:e.target.value})}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Model<input value={form.model} placeholder="Model number" onChange={e => setForm({...form, model:e.target.value})}/></label><label>Purchase date<input type="date" value={form.purchaseDate} onChange={e => setForm({...form, purchaseDate:e.target.value})}/></label><label>Warranty expiry<input type="date" value={form.warrantyEnd} onChange={e => setForm({...form, warrantyEnd:e.target.value})}/></label><label>Next service date<input type="date" value={form.nextService} onChange={e => setForm({...form, nextService:e.target.value})}/></label></div><div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setModal(false)}>Cancel</button><button className="primary" type="submit"><Check size={17}/>{editing ? "Save changes" : "Add to SmartCare"}</button></div></form></div>}
  </div>;
}

function Stat({ icon, label, value, note }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className="stat-icon">{icon}</div></div><strong>{value}</strong><small>{note}</small></div>;
}
function Empty({ icon, title, text }) {
  return <div className="empty-state"><div>{icon}</div><b>{title}</b><p>{text}</p></div>;
}
function DeviceList({ devices, onEdit, onDelete, onService }) {
  if (!devices.length) return <Empty icon={<Smartphone/>} title="No devices found" text="Add a device or try a different search." />;
  return <div className="device-list">{devices.map(d => <div className="device-row" key={d.id}><div className="device-icon">{iconFor(d.category)}</div><div className="device-main"><b>{d.name}</b><small>{d.brand || "Brand not set"} · {d.category}{d.model ? ` · ${d.model}` : ""}</small></div><div className="device-warranty"><small>Warranty expiry</small><b>{dateText(d.warrantyEnd)}</b></div><span className={`status ${d.status === "Needs attention" ? "warning" : "good"}`}>{d.status}</span><div className="row-actions"><button title="Record service" onClick={() => onService(d)}><Wrench size={16}/></button><button title="Edit device" onClick={() => onEdit(d)}><Pencil size={16}/></button><button title="Remove device" onClick={() => onDelete(d.id)}><Trash2 size={16}/></button></div></div>)}</div>;
}