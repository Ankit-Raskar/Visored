import { useState, useRef, useEffect, useCallback } from "react";

// ─── CREDENTIALS ─────────────────────────────────────────────────────────────
const USERS = {
  student: { id:"24ECE047", pass:"arjun2024", role:"student" },
  admin:   { id:"admin@srm.edu.in", pass:"admin123", role:"admin" },
};

// ─── STUDENT DATA ─────────────────────────────────────────────────────────────
const STUDENTS_DB = [
  { id:1, roll:"24ECE047", name:"Arjun Rathi",    branch:"ECE", batch:"2024-28", email:"arjun.rathi@srm.edu.in",    phone:"+91 98765 43210", hostel:"A-214", status:65,  docs:7, fees:true,  courses:14, compliance:2 },
  { id:2, roll:"24ECE048", name:"Ravi Kumar",      branch:"ECE", batch:"2024-28", email:"ravi.kumar@srm.edu.in",     phone:"+91 98712 34567", hostel:"A-215", status:80,  docs:9, fees:true,  courses:19, compliance:4 },
  { id:3, roll:"24CSE012", name:"Priya Sharma",    branch:"CSE", batch:"2024-28", email:"priya.sharma@srm.edu.in",   phone:"+91 87654 32109", hostel:"B-102", status:45,  docs:5, fees:true,  courses:12, compliance:1 },
  { id:4, roll:"24CSE031", name:"Aman Singh",      branch:"CSE", batch:"2024-28", email:"aman.singh@srm.edu.in",     phone:"+91 99887 76655", hostel:"C-301", status:30,  docs:4, fees:false, courses:0,  compliance:0 },
  { id:5, roll:"24ME019",  name:"Sneha Patel",     branch:"ME",  batch:"2024-28", email:"sneha.patel@srm.edu.in",    phone:"+91 91234 56789", hostel:"B-204", status:90,  docs:9, fees:true,  courses:19, compliance:5 },
  { id:6, roll:"24CE007",  name:"Karthik Nair",    branch:"CE",  batch:"2024-28", email:"karthik.nair@srm.edu.in",   phone:"+91 90011 22334", hostel:"D-110", status:55,  docs:6, fees:true,  courses:14, compliance:2 },
  { id:7, roll:"24EEE022", name:"Divya Krishnan",  branch:"EEE", batch:"2024-28", email:"divya.k@srm.edu.in",        phone:"+91 88001 23456", hostel:"B-307", status:20,  docs:3, fees:false, courses:0,  compliance:0 },
  { id:8, roll:"24ECE055", name:"Rohan Mehta",     branch:"ECE", batch:"2024-28", email:"rohan.mehta@srm.edu.in",    phone:"+91 97865 43210", hostel:"A-310", status:75,  docs:8, fees:true,  courses:19, compliance:3 },
];

const INITIAL_DOCS = [
  {id:1,name:"10th Mark Sheet",        sub:"CBSE Board",            status:"verified"},
  {id:2,name:"12th Mark Sheet",        sub:"CBSE Board",            status:"verified"},
  {id:3,name:"JEE Main Scorecard",     sub:"95.4 percentile",       status:"verified"},
  {id:4,name:"Aadhaar Card",           sub:"Identity Proof",        status:"verified"},
  {id:5,name:"Medical Certificate",    sub:"Govt Hospital",         status:"verified"},
  {id:6,name:"Allotment Letter",       sub:"JoSAA Round 3",         status:"verified"},
  {id:7,name:"Community Certificate",  sub:"State Govt",            status:"verified"},
  {id:8,name:"Transfer Certificate",   sub:"Required · Due Feb 20", status:"missing"},
  {id:9,name:"Anti-Ragging Affidavit", sub:"Parent + Student sign", status:"missing"},
];
const FEES=[{label:"Tuition Fee",amount:120000,date:"Jan 8"},{label:"Hostel Fee",amount:48000,date:"Jan 8"},{label:"Mess Deposit",amount:12000,date:"Jan 8"},{label:"Lab & Library",amount:8500,date:"Jan 9"}];
const CORES=[{code:"MA101",name:"Engineering Mathematics I",credits:4,prof:"Prof. R. Sharma"},{code:"PH101",name:"Physics for Engineers",credits:4,prof:"Prof. K. Nair"},{code:"ME101",name:"Engineering Drawing",credits:3,prof:"Prof. S. Verma"},{code:"CS101",name:"C Programming",credits:3,prof:"Prof. A. Gupta"}];
const ELECTIVES=[{code:"EC101",name:"Signals & Systems",credits:5,seats:32,total:40,tag:"Popular",rec:false},{code:"EC102",name:"Digital Logic Design",credits:5,seats:28,total:40,tag:"Recommended",rec:true},{code:"EC103",name:"Microcontrollers & Embedded",credits:5,seats:38,total:40,tag:"Limited",rec:false}];
const COMPLIANCE_INIT=[{id:1,label:"Anti-Ragging Awareness",done:true,due:"Completed"},{id:2,label:"Campus Safety Induction",done:true,due:"Completed"},{id:3,label:"Academic Integrity Policy",done:false,due:"Feb 28"},{id:4,label:"Library & Digital Resources",done:false,due:"Mar 1"},{id:5,label:"Student Code of Conduct",done:false,due:"Mar 1"}];
const TIMELINE=[{date:"Jan 10",label:"Admitted & ID Issued",done:true},{date:"Jan 11",label:"Institute Email Activated",done:true},{date:"Jan 12",label:"Documents Submitted",done:true},{date:"Jan 15",label:"Fee Payment Cleared",done:true},{date:"Feb 10",label:"Hostel Room Allotted",done:true},{date:"Feb 20",label:"Document Upload Deadline",done:false,alert:true},{date:"Feb 23",label:"Course Registration Closes",done:false,alert:true},{date:"Feb 25",label:"First Mentor Meeting",done:false},{date:"Feb 28",label:"Orientation Day",done:false},{date:"Mar 3",label:"Classes Begin",done:false,milestone:true}];

const SYSTEM_PROMPT = `You are EduBot, a warm and intelligent Student Onboarding Assistant for Visored — SRM Institute of Science & Technology's smart onboarding platform.
Student: Arjun Rathi (24ECE047) · B.Tech ECE · Batch 2024-28
Onboarding: 65% complete. Missing docs: Transfer Certificate & Anti-Ragging Affidavit (due Feb 20). Course reg: 14/19 credits, needs elective by Feb 23. Mentor: Dr. Priya Menon (Feb 25, 10AM, ECE Blk Rm 312). Compliance: 2/5 done.
Electives: EC101 Signals & Systems, EC102 Digital Logic Design (RECOMMENDED), EC103 Microcontrollers (limited seats).
Key dates: Feb 20 docs, Feb 23 courses, Feb 28 orientation (9AM Main Auditorium), Mar 3 classes begin.
Contacts: helpdesk@srm.edu.in Ext.1800 | registrar@srm.edu.in | hostel@srm.edu.in
Be warm, concise, use "Arjun" occasionally. Always mention deadlines. Keep under 200 words unless complex.`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = n => "₹" + n.toLocaleString("en-IN");
const clr = (pct) => pct >= 80 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626";

function ProgressRing({ pct, size=96, stroke=5.5, color="#16a34a" }) {
  const r=(size-stroke*2)/2, circ=2*Math.PI*r;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)",display:"block"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ-(pct/100)*circ}
        style={{transition:"stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"}}/>
    </svg>
  );
}

function Badge({children,v="neutral"}) {
  const C={green:["#dcfce7","#15803d"],amber:["#fef3c7","#92400e"],red:["#fee2e2","#b91c1c"],blue:["#dbeafe","#1d4ed8"],purple:["#ede9fe","#6d28d9"],neutral:["#f1f5f9","#475569"]}[v]||["#f1f5f9","#475569"];
  return <span style={{background:C[0],color:C[1],fontSize:10.5,fontWeight:600,padding:"3px 9px",borderRadius:20,whiteSpace:"nowrap"}}>{children}</span>;
}

function Toast({msg,type}) {
  const C={error:["#fef2f2","#dc2626"],info:["#eff6ff","#2563eb"],success:["#f0fdf4","#16a34a"]}[type||"success"];
  return <div style={{position:"fixed",top:18,right:18,zIndex:9999,background:C[0],border:`1.5px solid ${C[1]}44`,color:C[1],padding:"11px 18px",borderRadius:12,fontSize:13,fontWeight:600,boxShadow:"0 8px 32px rgba(0,0,0,0.12)",display:"flex",alignItems:"center",gap:8,animation:"toastIn .25s ease"}}>{type==="error"?"✕":type==="info"?"ℹ":"✓"} {msg}</div>;
}

// ═════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═════════════════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [tab, setTab]       = useState("student");
  const [id, setId]         = useState("");
  const [pass, setPass]     = useState("");
  const [showPass, setShow] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoad]  = useState(false);

  const hints = {
    student: { id: "24ECE047", pass: "arjun2024", label: "Roll Number", ph: "e.g. 24ECE047" },
    admin:   { id: "admin@srm.edu.in", pass: "admin123", label: "Admin Email", ph: "admin@srm.edu.in" },
  };

  const handleLogin = () => {
    setError(""); setLoad(true);
    setTimeout(() => {
      const u = tab === "student" ? USERS.student : USERS.admin;
      if (id === u.id && pass === u.pass) {
        onLogin(tab);
      } else {
        setError("Invalid credentials. Check the hint below.");
      }
      setLoad(false);
    }, 900);
  };

  const fillHint = () => { setId(hints[tab].id); setPass(hints[tab].pass); };

  return (
    <div style={{minHeight:"100vh",display:"grid",gridTemplateColumns:"1fr 1fr",fontFamily:"'Sora',system-ui,sans-serif"}}>
      {/* Left Panel */}
      <div className="login-left-panel" style={{background:"linear-gradient(160deg,#0f1a0f 0%,#0a2e1a 50%,#082215 100%)",
        display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"32px 28px",
        position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 20% 80%,rgba(22,163,74,0.12) 0%,transparent 60%),radial-gradient(circle at 80% 20%,rgba(22,163,74,0.08) 0%,transparent 50%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none"}}/>

        {/* Brand */}
        <div style={{display:"flex",alignItems:"center",gap:12,position:"relative"}}>
          <div style={{width:38,height:38,background:"linear-gradient(135deg,#16a34a,#15803d)",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 0 24px rgba(22,163,74,0.5)"}}>🎓</div>
          <span style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:900,color:"#fff",letterSpacing:"-0.03em"}}>Visored</span>
        </div>

        {/* Hero text */}
        <div style={{position:"relative"}}>
          <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#4ade80",marginBottom:16}}>Smart Student Onboarding</div>
          <h1 style={{fontFamily:"'Fraunces',serif",fontSize:42,fontWeight:900,color:"#fff",lineHeight:1.15,letterSpacing:"-0.03em",marginBottom:20}}>
            Your journey<br/>starts here.
          </h1>
          <p style={{fontSize:14.5,color:"#86efac",lineHeight:1.7,maxWidth:340}}>
            Visored guides every student through document verification, fees, course registration, mentoring and compliance — all in one intelligent platform.
          </p>

          {/* Feature pills */}
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:28}}>
            {["📄 Document Verification","💳 Fee Tracking","📚 Course Registration","🎯 Mentoring","🤖 AI Assistant"].map(f=>(
              <span key={f} style={{background:"rgba(22,163,74,0.15)",border:"1px solid rgba(22,163,74,0.3)",color:"#86efac",fontSize:12,fontWeight:500,padding:"6px 14px",borderRadius:20}}>{f}</span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",position:"relative"}}>
          SRM Institute of Science & Technology, Chennai · Batch 2024–28
        </div>
      </div>

      {/* Right Panel */}
      <div style={{background:"#f9fafb",display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 52px"}}>
        <div style={{width:"100%",maxWidth:400,animation:"fadeUp .5s ease"}}>

          <h2 style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:700,color:"#111827",marginBottom:6,letterSpacing:"-0.02em"}}>
            Welcome back
          </h2>
          <p style={{fontSize:13.5,color:"#6b7280",marginBottom:28}}>Sign in to continue your onboarding</p>

          {/* Tabs */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",background:"#f3f4f6",borderRadius:12,padding:4,marginBottom:28}}>
            {["student","admin"].map(t=>(
              <button key={t} onClick={()=>{setTab(t);setId("");setPass("");setError("");}}
                style={{padding:"10px",borderRadius:9,border:"none",cursor:"pointer",
                  fontFamily:"inherit",fontSize:13.5,fontWeight:600,transition:"all .2s",
                  background:tab===t?"#fff":"transparent",
                  color:tab===t?"#111827":"#9ca3af",
                  boxShadow:tab===t?"0 2px 8px rgba(0,0,0,0.08)":"none"}}>
                {t==="student"?"🎓 Student":"🛡️ Admin"}
              </button>
            ))}
          </div>

          {/* Form */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label style={{fontSize:12.5,fontWeight:600,color:"#374151",display:"block",marginBottom:6}}>
                {hints[tab].label}
              </label>
              <input value={id} onChange={e=>setId(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                placeholder={hints[tab].ph}
                style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${error?"#fca5a5":"#e5e7eb"}`,
                  borderRadius:10,fontSize:13.5,fontFamily:"inherit",color:"#111827",
                  background:"#fff",outline:"none",transition:"border-color .15s"}}
                onFocus={e=>e.target.style.borderColor="#86efac"}
                onBlur={e=>e.target.style.borderColor=error?"#fca5a5":"#e5e7eb"}/>
            </div>
            <div>
              <label style={{fontSize:12.5,fontWeight:600,color:"#374151",display:"block",marginBottom:6}}>Password</label>
              <div style={{position:"relative"}}>
                <input value={pass} onChange={e=>setPass(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                  type={showPass?"text":"password"}
                  placeholder="Enter your password"
                  style={{width:"100%",padding:"11px 42px 11px 14px",border:`1.5px solid ${error?"#fca5a5":"#e5e7eb"}`,
                    borderRadius:10,fontSize:13.5,fontFamily:"inherit",color:"#111827",
                    background:"#fff",outline:"none",transition:"border-color .15s"}}
                  onFocus={e=>e.target.style.borderColor="#86efac"}
                  onBlur={e=>e.target.style.borderColor=error?"#fca5a5":"#e5e7eb"}/>
                <button onClick={()=>setShow(!showPass)}
                  style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                    background:"none",border:"none",cursor:"pointer",color:"#9ca3af",fontSize:16}}>
                  {showPass?"🙈":"👁"}
                </button>
              </div>
            </div>

            {error && (
              <div style={{background:"#fef2f2",border:"1.5px solid #fca5a5",borderRadius:9,
                padding:"10px 14px",fontSize:12.5,color:"#dc2626",fontWeight:500}}>
                ⚠ {error}
              </div>
            )}

            <button onClick={handleLogin} disabled={loading||!id||!pass}
              style={{padding:"13px",borderRadius:11,border:"none",cursor:loading||!id||!pass?"not-allowed":"pointer",
                background:loading||!id||!pass?"#d1d5db":"linear-gradient(135deg,#16a34a,#15803d)",
                color:loading||!id||!pass?"#9ca3af":"#fff",fontSize:14,fontWeight:700,
                fontFamily:"inherit",transition:"all .2s",
                boxShadow:loading||!id||!pass?"none":"0 4px 16px rgba(22,163,74,0.35)"}}>
              {loading ? "Signing in…" : `Sign in as ${tab==="student"?"Student":"Admin"} →`}
            </button>
          </div>

          {/* Hint card */}
          <div style={{marginTop:20,background:"#fff",border:"1.5px solid #e5e7eb",borderRadius:12,padding:"14px 16px"}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#9ca3af",marginBottom:8}}>
              Demo Credentials
            </div>
            <div style={{fontSize:12.5,color:"#374151",marginBottom:3}}>
              <strong>ID:</strong> <code style={{background:"#f3f4f6",padding:"1px 6px",borderRadius:4}}>{hints[tab].id}</code>
            </div>
            <div style={{fontSize:12.5,color:"#374151",marginBottom:10}}>
              <strong>Pass:</strong> <code style={{background:"#f3f4f6",padding:"1px 6px",borderRadius:4}}>{hints[tab].pass}</code>
            </div>
            <button onClick={fillHint}
              style={{fontSize:12,fontWeight:600,color:"#16a34a",background:"#f0fdf4",
                border:"1.5px solid #bbf7d0",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontFamily:"inherit"}}>
              ✦ Auto-fill credentials
            </button>
          </div>

        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900&family=Sora:wght@300;400;500;600;700;800&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes toastIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:none}}
        @keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes bounce{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}
        *{box-sizing:border-box;}
        input,button{outline:none;}
        
        /* ── RESPONSIVE BREAKPOINTS ── */
        @media (max-width: 1024px) {
          /* Tablet adjustments */
          [style*="gridTemplateColumns"] {
            grid-template-columns: 220px 1fr !important;
          }
        }
        
        @media (max-width: 768px) {
          /* Mobile: Stack everything vertically */
          [style*="gridTemplateColumns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          
          [style*="gridTemplateColumns: 280px 1fr"],
          [style*="gridTemplateColumns: 264px 1fr"],
          [style*="gridTemplateColumns: 268px 1fr"] {
            grid-template-columns: 1fr !important;
          }
          
          /* Hide left login panel on mobile, show stacked */
          .login-left-panel {
            display: none !important;
          }
          
          /* Sidebar becomes bottom nav or hidden */
          aside[style*="borderRight"] {
            display: none;
          }
          
          /* Full width main content */
          main {
            padding: 16px !important;
            max-width: 100% !important;
          }
          
          /* Responsive grids */
          [style*="gridTemplateColumns: repeat(4,1fr)"],
          [style*="gridTemplateColumns: repeat(5,1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          
          [style*="gridTemplateColumns: 1fr 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          
          /* Mobile topbar */
          header {
            padding: 0 12px !important;
            flex-wrap: wrap;
          }
          
          /* Hide desktop-only elements on mobile */
          .desktop-only {
            display: none !important;
          }
          
          /* Chat panel full width on mobile */
          .chat-panel {
            width: calc(100vw - 24px) !important;
            right: 12px !important;
            left: 12px !important;
            max-height: 70vh !important;
          }
          
          /* Smaller fonts for mobile */
          h1, .greeting {
            font-size: 22px !important;
          }
          
          h2 {
            font-size: 20px !important;
          }
          
          /* Stack flex items */
          [style*="display:flex"][style*="gap"] {
            flex-wrap: wrap !important;
          }
          
          /* Mobile tables scroll */
          table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
        }
        
        @media (max-width: 480px) {
          /* Extra small mobile */
          [style*="fontSize:26"],
          [style*="fontSize:28"] {
            font-size: 20px !important;
          }
          
          [style*="gridTemplateColumns: repeat(2,1fr)"] {
            grid-template-columns: 1fr !important;
          }
          
          /* Single column layouts */
          [style*="gridTemplateColumns: 280px 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════
function AdminDashboard({ onLogout }) {
  const [page, setPage]       = useState("overview");
  const [search, setSearch]   = useState("");
  const [selected, setSel]    = useState(null);
  const [filter, setFilter]   = useState("all");
  const [toast, setToast]     = useState(null);
  const [sendingId, setSendId]= useState(null);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const filtered = STUDENTS_DB.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.toLowerCase().includes(search.toLowerCase()) || s.branch.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter==="all"||
      (filter==="pending"&&s.status<50)||
      (filter==="inprogress"&&s.status>=50&&s.status<100)||
      (filter==="complete"&&s.status===100);
    return matchSearch && matchFilter;
  });

  const stats = {
    total: STUDENTS_DB.length,
    complete: STUDENTS_DB.filter(s=>s.status===100).length,
    pending: STUDENTS_DB.filter(s=>s.status<50).length,
    feesPending: STUDENTS_DB.filter(s=>!s.fees).length,
    avgProgress: Math.round(STUDENTS_DB.reduce((a,s)=>a+s.status,0)/STUDENTS_DB.length),
  };

  const sendReminder = (id) => {
    setSendId(id);
    setTimeout(()=>{ setSendId(null); showToast("Reminder sent successfully!"); },1200);
  };

  return (
    <div style={{fontFamily:"'Sora',system-ui,sans-serif",background:"#f9fafb",minHeight:"100vh",color:"#111827"}}>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}

      {/* Admin Topbar */}
      <header style={{background:"#111827",height:58,display:"flex",alignItems:"center",padding:"0 24px",position:"sticky",top:0,zIndex:100,gap:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginRight:32}}>
          <div style={{width:30,height:30,background:"linear-gradient(135deg,#16a34a,#15803d)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🎓</div>
          <span style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:900,color:"#fff",letterSpacing:"-0.03em"}}>Visored</span>
          <span style={{fontSize:11,fontWeight:600,background:"rgba(22,163,74,0.25)",color:"#4ade80",padding:"3px 10px",borderRadius:20,marginLeft:4,letterSpacing:"0.04em"}}>ADMIN</span>
        </div>
        <nav style={{display:"flex",gap:2}}>
          {[["overview","Overview"],["students","Students"],["analytics","Analytics"]].map(([id,label])=>(
            <button key={id} onClick={()=>{setPage(id);setSel(null);}}
              style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",
                fontFamily:"inherit",fontSize:13,fontWeight:page===id?600:400,
                background:page===id?"rgba(255,255,255,0.12)":"transparent",
                color:page===id?"#fff":"rgba(255,255,255,0.5)",transition:"all .15s"}}>
              {label}
            </button>
          ))}
        </nav>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>Dr. Admin · Registrar's Office</div>
          <button onClick={onLogout}
            style={{padding:"7px 16px",borderRadius:9,border:"1.5px solid rgba(255,255,255,0.2)",
              background:"transparent",color:"rgba(255,255,255,0.7)",fontSize:12,fontWeight:600,
              cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,0.7)";}}>
            Sign out
          </button>
        </div>
      </header>

      <div style={{padding:"28px 32px",maxWidth:1200,margin:"0 auto"}}>

        {/* OVERVIEW */}
        {page==="overview" && <>
          <div style={{marginBottom:24}}>
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Admin Overview</h2>
            <p style={{fontSize:13.5,color:"#6b7280"}}>Batch 2024–28 onboarding status · {new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</p>
          </div>
          {/* Stat cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:28}}>
            {[
              ["👥",stats.total,"Total Students","#f0fdf4","#16a34a"],
              ["✅",stats.complete,"Fully Onboarded","#f0fdf4","#16a34a"],
              ["⏳",stats.total-stats.complete-stats.pending,"In Progress","#fefce8","#d97706"],
              ["🔴",stats.pending,"Below 50%","#fef2f2","#dc2626"],
              ["💳",stats.feesPending,"Fees Pending","#fef2f2","#dc2626"],
            ].map(([icon,val,label,bg,col])=>(
              <div key={label} style={{background:bg,border:`1.5px solid ${col}22`,borderRadius:13,padding:"16px 18px",transition:"transform .15s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{fontSize:22,marginBottom:6}}>{icon}</div>
                <div style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:700,color:col,lineHeight:1}}>{val}</div>
                <div style={{fontSize:11.5,color:"#6b7280",marginTop:4,fontWeight:500}}>{label}</div>
              </div>
            ))}
          </div>

          {/* Average progress */}
          <div style={{background:"#fff",border:"1.5px solid #f3f4f6",borderRadius:14,padding:"20px 24px",marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div>
                <div style={{fontSize:15,fontWeight:700,marginBottom:2}}>Batch Onboarding Progress</div>
                <div style={{fontSize:12.5,color:"#6b7280"}}>Average completion across all {stats.total} students</div>
              </div>
              <div style={{fontFamily:"'Fraunces',serif",fontSize:36,fontWeight:700,color:clr(stats.avgProgress)}}>{stats.avgProgress}%</div>
            </div>
            <div style={{height:10,background:"#f3f4f6",borderRadius:5,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${stats.avgProgress}%`,borderRadius:5,
                background:`linear-gradient(90deg,#16a34a,#22c55e)`,transition:"width 1s ease"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:10,fontSize:12,color:"#9ca3af"}}>
              <span>0%</span><span>Target: 100% by Mar 3</span><span>100%</span>
            </div>
          </div>

          {/* Stage breakdown */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {[
              {label:"Document Verification",icon:"📄",done:STUDENTS_DB.filter(s=>s.docs===9).length,total:stats.total},
              {label:"Fee Payment",icon:"💳",done:STUDENTS_DB.filter(s=>s.fees).length,total:stats.total},
              {label:"Course Registration",icon:"📚",done:STUDENTS_DB.filter(s=>s.courses===19).length,total:stats.total},
              {label:"Compliance Modules",icon:"🎯",done:STUDENTS_DB.filter(s=>s.compliance===5).length,total:stats.total},
            ].map(s=>{
              const pct=Math.round(s.done/s.total*100);
              return (
                <div key={s.label} style={{background:"#fff",border:"1.5px solid #f3f4f6",borderRadius:13,padding:"16px 20px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                    <span style={{fontSize:20}}>{s.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13.5,fontWeight:600,color:"#111827"}}>{s.label}</div>
                      <div style={{fontSize:12,color:"#6b7280"}}>{s.done}/{s.total} students complete</div>
                    </div>
                    <Badge v={pct>=80?"green":pct>=50?"amber":"red"}>{pct}%</Badge>
                  </div>
                  <div style={{height:6,background:"#f3f4f6",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:clr(pct),borderRadius:3,transition:"width 1s ease"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </>}

        {/* STUDENTS TABLE */}
        {page==="students" && !selected && <>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div>
              <h2 style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Student Management</h2>
              <p style={{fontSize:13,color:"#6b7280"}}>{filtered.length} students · Click a row to view details</p>
            </div>
            <button onClick={()=>showToast("Report exported as CSV!","info")}
              style={{padding:"9px 18px",borderRadius:10,border:"1.5px solid #e5e7eb",background:"#fff",
                color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
              📥 Export CSV
            </button>
          </div>

          {/* Search + Filter */}
          <div style={{display:"flex",gap:10,marginBottom:16}}>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search by name, roll no, or branch…"
              style={{flex:1,padding:"10px 14px",border:"1.5px solid #e5e7eb",borderRadius:10,fontSize:13,
                fontFamily:"inherit",color:"#111827",background:"#fff"}}
              onFocus={e=>e.target.style.borderColor="#86efac"}
              onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
            <div style={{display:"flex",gap:6}}>
              {[["all","All"],["inprogress","In Progress"],["pending","Below 50%"],["complete","Complete"]].map(([v,l])=>(
                <button key={v} onClick={()=>setFilter(v)}
                  style={{padding:"8px 14px",borderRadius:9,border:`1.5px solid ${filter===v?"#16a34a":"#e5e7eb"}`,
                    background:filter===v?"#f0fdf4":"#fff",color:filter===v?"#16a34a":"#6b7280",
                    fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{background:"#fff",border:"1.5px solid #f3f4f6",borderRadius:14,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:"#f9fafb",borderBottom:"1.5px solid #f3f4f6"}}>
                  {["Student","Roll No","Branch","Progress","Docs","Fees","Courses","Actions"].map(h=>(
                    <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,
                      letterSpacing:"0.07em",textTransform:"uppercase",color:"#9ca3af",whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s,i)=>(
                  <tr key={s.id}
                    style={{borderBottom:"1.5px solid #f9fafb",cursor:"pointer",transition:"background .1s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"}
                    onMouseLeave={e=>e.currentTarget.style.background="#fff"}
                    onClick={()=>setSel(s)}>
                    <td style={{padding:"13px 16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:32,height:32,borderRadius:"50%",background:`hsl(${s.id*47},60%,50%)`,
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>
                          {s.name.split(" ").map(n=>n[0]).join("")}
                        </div>
                        <span style={{fontSize:13.5,fontWeight:600,color:"#111827"}}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{padding:"13px 16px",fontSize:12.5,color:"#6b7280",fontWeight:500}}>{s.roll}</td>
                    <td style={{padding:"13px 16px"}}><Badge v="neutral">{s.branch}</Badge></td>
                    <td style={{padding:"13px 16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:80,height:5,background:"#f3f4f6",borderRadius:3,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${s.status}%`,background:clr(s.status),borderRadius:3}}/>
                        </div>
                        <span style={{fontSize:12,fontWeight:600,color:clr(s.status)}}>{s.status}%</span>
                      </div>
                    </td>
                    <td style={{padding:"13px 16px"}}><Badge v={s.docs===9?"green":"amber"}>{s.docs}/9</Badge></td>
                    <td style={{padding:"13px 16px"}}><Badge v={s.fees?"green":"red"}>{s.fees?"✓ Paid":"Pending"}</Badge></td>
                    <td style={{padding:"13px 16px"}}><Badge v={s.courses===19?"green":s.courses>0?"amber":"red"}>{s.courses}/19 cr</Badge></td>
                    <td style={{padding:"13px 16px"}} onClick={e=>e.stopPropagation()}>
                      <button onClick={()=>sendReminder(s.id)} disabled={sendingId===s.id}
                        style={{padding:"5px 12px",borderRadius:7,border:"1.5px solid #e5e7eb",
                          background:sendingId===s.id?"#f3f4f6":"#fff",color:"#374151",fontSize:11.5,
                          fontWeight:600,cursor:sendingId===s.id?"wait":"pointer",fontFamily:"inherit",
                          transition:"all .15s",whiteSpace:"nowrap"}}
                        onMouseEnter={e=>{if(sendingId!==s.id){e.currentTarget.style.borderColor="#16a34a";e.currentTarget.style.color="#16a34a";}}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.color="#374151";}}>
                        {sendingId===s.id?"Sending…":"📧 Remind"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length===0&&<div style={{padding:"40px",textAlign:"center",color:"#9ca3af",fontSize:14}}>No students match your search.</div>}
          </div>
        </>}

        {/* STUDENT DETAIL VIEW */}
        {page==="students" && selected && (
          <div style={{animation:"fadeUp .3s ease"}}>
            <button onClick={()=>setSel(null)}
              style={{marginBottom:20,padding:"8px 16px",borderRadius:9,border:"1.5px solid #e5e7eb",
                background:"#fff",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
              ← Back to Students
            </button>
            <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:20}}>
              {/* Profile card */}
              <div>
                <div style={{background:"#fff",border:"1.5px solid #f3f4f6",borderRadius:14,overflow:"hidden",marginBottom:14}}>
                  <div style={{background:`linear-gradient(135deg,hsl(${selected.id*47},60%,40%),hsl(${selected.id*47},50%,30%))`,height:80}}/>
                  <div style={{padding:"0 20px 20px",textAlign:"center",marginTop:-32}}>
                    <div style={{width:64,height:64,borderRadius:"50%",background:`hsl(${selected.id*47},60%,50%)`,
                      display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",
                      fontSize:22,fontWeight:700,color:"#fff",border:"4px solid #fff",
                      boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}>
                      {selected.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div style={{fontWeight:700,fontSize:16,color:"#111827",marginBottom:2}}>{selected.name}</div>
                    <div style={{fontSize:12,color:"#6b7280",marginBottom:12}}>{selected.roll} · {selected.branch}</div>
                    <div style={{position:"relative",width:72,height:72,margin:"0 auto 8px"}}>
                      <ProgressRing pct={selected.status} size={72} stroke={5} color={clr(selected.status)}/>
                      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:clr(selected.status),lineHeight:1}}>{selected.status}%</span>
                      </div>
                    </div>
                    <div style={{fontSize:11.5,color:"#6b7280"}}>Onboarding complete</div>
                  </div>
                </div>
                <div style={{background:"#fff",border:"1.5px solid #f3f4f6",borderRadius:12,padding:"16px"}}>
                  {[["Email",selected.email],["Phone",selected.phone],["Hostel",selected.hostel],["Batch",selected.batch]].map(([l,v])=>(
                    <div key={l} style={{marginBottom:10}}>
                      <div style={{fontSize:10.5,color:"#9ca3af",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>{l}</div>
                      <div style={{fontSize:12.5,fontWeight:500,color:"#374151"}}>{v}</div>
                    </div>
                  ))}
                  <button onClick={()=>sendReminder(selected.id)} disabled={sendingId===selected.id}
                    style={{width:"100%",marginTop:6,padding:"9px",borderRadius:9,border:"none",
                      background:"#16a34a",color:"#fff",fontSize:13,fontWeight:600,
                      cursor:"pointer",fontFamily:"inherit"}}>
                    {sendingId===selected.id?"Sending…":"📧 Send Reminder"}
                  </button>
                </div>
              </div>

              {/* Stage breakdown */}
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {[
                  {icon:"📄",label:"Document Verification",val:`${selected.docs}/9`,pct:Math.round(selected.docs/9*100),note:selected.docs<9?`${9-selected.docs} doc(s) missing`:"All documents verified"},
                  {icon:"💳",label:"Fee Payment",val:selected.fees?"₹1,88,500":"₹0",pct:selected.fees?100:0,note:selected.fees?"All fees cleared":"Payment pending"},
                  {icon:"📚",label:"Course Registration",val:`${selected.courses}/19 cr`,pct:Math.round(selected.courses/19*100),note:selected.courses===19?"All credits registered":`${19-selected.courses} credits remaining`},
                  {icon:"🎯",label:"Compliance Modules",val:`${selected.compliance}/5`,pct:Math.round(selected.compliance/5*100),note:selected.compliance===5?"All modules complete":`${5-selected.compliance} module(s) remaining`},
                ].map(s=>(
                  <div key={s.label} style={{background:"#fff",border:"1.5px solid #f3f4f6",borderRadius:13,padding:"16px 20px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                      <span style={{fontSize:22}}>{s.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:700,color:"#111827"}}>{s.label}</div>
                        <div style={{fontSize:12,color:"#6b7280"}}>{s.note}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:clr(s.pct)}}>{s.val}</div>
                        <Badge v={s.pct===100?"green":s.pct>=50?"amber":"red"}>{s.pct}%</Badge>
                      </div>
                    </div>
                    <div style={{height:6,background:"#f3f4f6",borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${s.pct}%`,background:clr(s.pct),borderRadius:3,transition:"width .8s ease"}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {page==="analytics" && (
          <div>
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,letterSpacing:"-0.02em",marginBottom:20}}>Analytics</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>

              {/* Branch breakdown */}
              <div style={{background:"#fff",border:"1.5px solid #f3f4f6",borderRadius:14,padding:"20px 22px"}}>
                <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Progress by Branch</div>
                <div style={{fontSize:12,color:"#6b7280",marginBottom:16}}>Average onboarding completion</div>
                {["ECE","CSE","ME","CE","EEE"].map(branch=>{
                  const branchStudents = STUDENTS_DB.filter(s=>s.branch===branch);
                  const avg = branchStudents.length ? Math.round(branchStudents.reduce((a,s)=>a+s.status,0)/branchStudents.length) : 0;
                  return (
                    <div key={branch} style={{marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:13,fontWeight:600,color:"#374151"}}>{branch}</span>
                        <span style={{fontSize:12,fontWeight:700,color:clr(avg)}}>{avg}% avg · {branchStudents.length} students</span>
                      </div>
                      <div style={{height:7,background:"#f3f4f6",borderRadius:4,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${avg}%`,background:clr(avg),borderRadius:4,transition:"width 1s ease"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stage completion */}
              <div style={{background:"#fff",border:"1.5px solid #f3f4f6",borderRadius:14,padding:"20px 22px"}}>
                <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Stage Completion Rate</div>
                <div style={{fontSize:12,color:"#6b7280",marginBottom:16}}>% of students who finished each stage</div>
                {[
                  ["📄","Documents",Math.round(STUDENTS_DB.filter(s=>s.docs===9).length/STUDENTS_DB.length*100)],
                  ["💳","Fee Payment",Math.round(STUDENTS_DB.filter(s=>s.fees).length/STUDENTS_DB.length*100)],
                  ["📚","Courses",Math.round(STUDENTS_DB.filter(s=>s.courses===19).length/STUDENTS_DB.length*100)],
                  ["🎯","Compliance",Math.round(STUDENTS_DB.filter(s=>s.compliance===5).length/STUDENTS_DB.length*100)],
                ].map(([icon,label,pct])=>(
                  <div key={label} style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                    <span style={{fontSize:18,width:24,textAlign:"center"}}>{icon}</span>
                    <span style={{fontSize:13,fontWeight:600,color:"#374151",width:100}}>{label}</span>
                    <div style={{flex:1,height:7,background:"#f3f4f6",borderRadius:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct}%`,background:clr(pct),borderRadius:4,transition:"width 1s ease"}}/>
                    </div>
                    <span style={{fontSize:12,fontWeight:700,color:clr(pct),width:36,textAlign:"right"}}>{pct}%</span>
                  </div>
                ))}
              </div>

              {/* At risk students */}
              <div style={{background:"#fff",border:"1.5px solid #f3f4f6",borderRadius:14,padding:"20px 22px",gridColumn:"1/-1"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:2}}>⚠ At-Risk Students</div>
                    <div style={{fontSize:12,color:"#6b7280"}}>Students below 50% completion needing immediate attention</div>
                  </div>
                  <button onClick={()=>{showToast(`Bulk reminder sent to ${STUDENTS_DB.filter(s=>s.status<50).length} students!`,"info");}}
                    style={{padding:"8px 16px",borderRadius:9,border:"none",background:"#dc2626",
                      color:"#fff",fontSize:12.5,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                    Send Bulk Reminder
                  </button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {STUDENTS_DB.filter(s=>s.status<50).map(s=>(
                    <div key={s.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",
                      background:"#fef2f2",border:"1.5px solid #fecaca",borderRadius:10}}>
                      <div style={{width:34,height:34,borderRadius:"50%",background:`hsl(${s.id*47},60%,50%)`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>
                        {s.name.split(" ").map(n=>n[0]).join("")}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13.5,fontWeight:600,color:"#111827"}}>{s.name}</div>
                        <div style={{fontSize:11.5,color:"#6b7280"}}>{s.roll} · {s.branch} · {!s.fees?"Fees unpaid · ":""}{s.docs<9?`${9-s.docs} docs missing`:"Docs OK"}</div>
                      </div>
                      <Badge v="red">{s.status}%</Badge>
                      <button onClick={()=>sendReminder(s.id)}
                        style={{padding:"6px 14px",borderRadius:8,border:"1.5px solid #fca5a5",
                          background:"#fff",color:"#dc2626",fontSize:12,fontWeight:600,
                          cursor:"pointer",fontFamily:"inherit"}}>
                        📧 Remind
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STUDENT DASHBOARD (preserved from previous version)
// ═════════════════════════════════════════════════════════════════════════════
function StudentDashboard({ onLogout }) {
  const [page,setPage]           = useState("dashboard");
  const [docs,setDocs]           = useState(INITIAL_DOCS);
  const [compliance,setComp]     = useState(COMPLIANCE_INIT);
  const [elective,setElective]   = useState(null);
  const [confirmed,setConfirmed] = useState(false);
  const [activeCard,setActive]   = useState("docs");
  const [chatOpen,setChatOpen]   = useState(false);
  const [messages,setMessages]   = useState([{role:"assistant",content:"Hello Arjun! 👋 Welcome to **Visored**.\n\nYou're **65% through** onboarding. Two urgent items:\n• Upload **Transfer Certificate** by Feb 20\n• Complete **course registration** by Feb 23\n\nAsk me anything — I'm here 24/7!"}]);
  const [inputVal,setInput]      = useState("");
  const [aiLoading,setAiLoad]    = useState(false);
  const [toast,setToast]         = useState(null);
  const [uploading,setUploading] = useState(null);
  const [notifs,setNotifs]       = useState([{id:1,read:false,icon:"⚠️",title:"Document deadline approaching",sub:"Transfer Certificate due in 3 days",time:"2h ago"},{id:2,read:false,icon:"📅",title:"Course registration closes soon",sub:"Feb 23 · Only 6 days left",time:"5h ago"},{id:3,read:true,icon:"✅",title:"Fee payment confirmed",sub:"₹1,88,500 · Ref TXN-2024-47891",time:"Jan 9"},{id:4,read:true,icon:"🏠",title:"Hostel allotted",sub:"Block A, Room 214",time:"Jan 12"},{id:5,read:true,icon:"👩‍🏫",title:"Mentor assigned",sub:"Dr. Priya Menon · First meet Feb 25",time:"Jan 15"}]);
  const msgsRef = useRef(null);

  useEffect(()=>{if(msgsRef.current)msgsRef.current.scrollTop=msgsRef.current.scrollHeight;},[messages,aiLoading]);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3200);};
  const verifiedCount=docs.filter(d=>d.status==="verified").length;
  const compDone=compliance.filter(c=>c.done).length;
  const credits=confirmed?19:14;
  const overallPct=Math.round((verifiedCount/9)*25+25+(credits/19)*25+(compDone/5)*25);
  const unread=notifs.filter(n=>!n.read).length;

  const handleUpload=id=>{setUploading(id);setTimeout(()=>{setDocs(p=>p.map(d=>d.id===id?{...d,status:"verified"}:d));setUploading(null);showToast("Document uploaded & submitted for verification!");},1800);};
  const toggleComp=id=>setComp(p=>p.map(c=>c.id===id?{...c,done:!c.done,due:!c.done?"Completed":COMPLIANCE_INIT.find(x=>x.id===id).due}:c));

  const confirmCourses=()=>{
    if(!elective){showToast("Please select an elective first.","error");return;}
    setConfirmed(true);
    showToast("🎉 Course registration confirmed! 19/19 credits complete.");
    sendChat(null,"I just confirmed my course registration with "+elective.name+". What should I do next?");
  };

  const sendChat=useCallback(async(e,prefill)=>{
    if(e)e.preventDefault();
    const text=prefill||inputVal.trim();
    if(!text||aiLoading)return;
    setInput("");
    const newMsgs=[...messages,{role:"user",content:text}];
    setMessages(newMsgs);setAiLoad(true);
    if(!chatOpen)setChatOpen(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-5-20250929",max_tokens:1000,system:SYSTEM_PROMPT,messages:newMsgs.map(m=>({role:m.role,content:m.content}))})});
      const data=await res.json();
      setMessages(p=>[...p,{role:"assistant",content:data.content?.[0]?.text||"Something went wrong. Please try again."}]);
    }catch{setMessages(p=>[...p,{role:"assistant",content:"I couldn't connect right now. Please try again."}]);}
    setAiLoad(false);
  },[inputVal,messages,aiLoading,chatOpen]);

  const quickAsk=q=>{setInput(q);setTimeout(()=>sendChat(null,q),60);};
  const md=text=><span dangerouslySetInnerHTML={{__html:text.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br/>")}}/>;

  const STAGES=[
    {id:"docs",   emoji:"📄",label:"Document Verification",  sub:`${verifiedCount}/9 verified`,       pct:Math.round(verifiedCount/9*100), v:verifiedCount<9?"amber":"green"},
    {id:"fee",    emoji:"💳",label:"Fee Payment",            sub:"₹1,88,500 paid · Complete",          pct:100,                             v:"green"},
    {id:"courses",emoji:"📚",label:"Course Registration",    sub:confirmed?"19/19 credits done":`${credits}/19 credits · pick elective`, pct:Math.round(credits/19*100), v:confirmed?"green":"amber"},
    {id:"mentor", emoji:"🎯",label:"Mentoring & Compliance", sub:`${compDone}/5 modules complete`,    pct:Math.round(compDone/5*100),       v:compDone===5?"green":"blue"},
  ];

  return (
    <div style={{fontFamily:"'Sora',system-ui,sans-serif",background:"#f9fafb",minHeight:"100vh",color:"#111827"}}>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}

      {/* Topbar */}
      <header style={{background:"#fff",borderBottom:"1.5px solid #f3f4f6",height:58,display:"flex",alignItems:"center",padding:"0 24px",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginRight:32}}>
          <div style={{width:30,height:30,background:"linear-gradient(135deg,#16a34a,#15803d)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🎓</div>
          <span style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:900,color:"#111827",letterSpacing:"-0.03em"}}>Visored</span>
        </div>
        <nav style={{display:"flex",gap:2}}>
          {[["dashboard","Dashboard"],["timeline","Timeline"],["notifications","Alerts"]].map(([id,label])=>(
            <button key={id} onClick={()=>setPage(id)}
              style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:page===id?600:400,background:page===id?"#f0fdf4":"transparent",color:page===id?"#16a34a":"#6b7280",transition:"all .15s",position:"relative"}}>
              {label}
              {id==="notifications"&&unread>0&&<span style={{position:"absolute",top:2,right:4,width:14,height:14,background:"#ef4444",borderRadius:"50%",fontSize:9,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{unread}</span>}
            </button>
          ))}
        </nav>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:20,padding:"5px 14px 5px 8px"}}>
            <div style={{width:26,height:26,position:"relative",flexShrink:0}}>
              <ProgressRing pct={overallPct} size={26} stroke={3}/>
              <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:700,color:"#16a34a"}}>{overallPct}</span>
            </div>
            <span style={{fontSize:12,fontWeight:600,color:"#15803d"}}>{overallPct}% complete</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",padding:"4px 10px 4px 4px",borderRadius:20,border:"1.5px solid #f3f4f6",background:"#fff"}}>
            <div style={{width:30,height:30,background:"linear-gradient(135deg,#16a34a,#15803d)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff"}}>AR</div>
            <div>
              <div style={{fontSize:12.5,fontWeight:600,color:"#111827",lineHeight:1.2}}>Arjun Rathi</div>
              <div style={{fontSize:10.5,color:"#9ca3af"}}>24ECE047</div>
            </div>
          </div>
          <button onClick={onLogout}
            style={{padding:"7px 14px",borderRadius:9,border:"1.5px solid #e5e7eb",background:"#fff",
              color:"#6b7280",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#dc2626";e.currentTarget.style.color="#dc2626";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.color="#6b7280";}}>
            Sign out
          </button>
        </div>
      </header>

      {/* NOTIFICATIONS PAGE */}
      {page==="notifications"&&(
        <div style={{maxWidth:680,margin:"36px auto",padding:"0 24px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,letterSpacing:"-0.02em"}}>Notifications</h2>
            <button onClick={()=>setNotifs(p=>p.map(n=>({...n,read:true})))} style={{fontSize:12,color:"#16a34a",background:"none",border:"none",cursor:"pointer",fontWeight:600,fontFamily:"inherit"}}>Mark all read</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {notifs.map(n=>(
              <div key={n.id} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}
                style={{background:"#fff",border:`1.5px solid ${n.read?"#f3f4f6":"#bbf7d0"}`,borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"flex-start",gap:14,cursor:"pointer",transition:"all .15s",boxShadow:n.read?"none":"0 0 0 3px rgba(22,163,74,0.07)"}}>
                <span style={{fontSize:22,flexShrink:0}}>{n.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13.5,fontWeight:600,color:n.read?"#374151":"#111827",marginBottom:2}}>{n.title}</div>
                  <div style={{fontSize:12.5,color:"#6b7280"}}>{n.sub}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                  <span style={{fontSize:11,color:"#9ca3af"}}>{n.time}</span>
                  {!n.read&&<span style={{width:8,height:8,background:"#16a34a",borderRadius:"50%",display:"block"}}/>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TIMELINE PAGE */}
      {page==="timeline"&&(
        <div style={{maxWidth:560,margin:"36px auto",padding:"0 24px"}}>
          <h2 style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,letterSpacing:"-0.02em",marginBottom:8}}>Onboarding Timeline</h2>
          <p style={{fontSize:13,color:"#6b7280",marginBottom:28}}>Your journey from admission to first day of classes</p>
          <div style={{position:"relative"}}>
            <div style={{position:"absolute",left:15,top:14,bottom:14,width:2,background:"#e5e7eb",borderRadius:1}}/>
            {TIMELINE.map((t,i)=>(
              <div key={i} style={{display:"flex",gap:20,paddingBottom:20,position:"relative"}}>
                <div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,background:t.done?"#16a34a":t.alert?"#fef9c3":t.milestone?"#ede9fe":"#f3f4f6",border:`2px solid ${t.done?"#16a34a":t.alert?"#fbbf24":t.milestone?"#7c3aed":"#e5e7eb"}`,color:t.done?"#fff":t.alert?"#92400e":t.milestone?"#6d28d9":"#9ca3af",position:"relative",zIndex:1,fontWeight:700}}>
                  {t.done?"✓":t.milestone?"★":t.alert?"!":i+1}
                </div>
                <div style={{flex:1,paddingTop:4}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                    <span style={{fontSize:13.5,fontWeight:t.done?500:600,color:t.done?"#6b7280":t.milestone?"#6d28d9":t.alert?"#92400e":"#111827"}}>{t.label}</span>
                    {t.alert&&!t.done&&<Badge v="amber">Deadline</Badge>}
                    {t.milestone&&<Badge v="purple">Milestone</Badge>}
                  </div>
                  <div style={{fontSize:11.5,color:"#9ca3af"}}>{t.date}, 2026</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DASHBOARD PAGE */}
      {page==="dashboard"&&(
        <div style={{display:"grid",gridTemplateColumns:"264px 1fr",minHeight:"calc(100vh - 58px)"}}>
          {/* Sidebar */}
          <aside style={{background:"#fff",borderRight:"1.5px solid #f3f4f6",padding:"22px 0",position:"sticky",top:58,height:"calc(100vh - 58px)",overflowY:"auto"}}>
            <div style={{padding:"0 16px",marginBottom:24}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9ca3af",marginBottom:10,padding:"0 2px"}}>Progress</div>
              <div style={{background:"#f9fafb",border:"1.5px solid #f3f4f6",borderRadius:14,padding:"18px 14px",textAlign:"center"}}>
                <div style={{position:"relative",width:96,height:96,margin:"0 auto 12px"}}>
                  <ProgressRing pct={overallPct}/>
                  <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,color:"#111827",lineHeight:1}}>{overallPct}%</span>
                    <span style={{fontSize:10,color:"#9ca3af",marginTop:2}}>complete</span>
                  </div>
                </div>
                <div style={{fontSize:12,color:"#6b7280"}}><strong style={{color:"#16a34a"}}>{STAGES.filter(s=>s.pct===100).length} of 4</strong> stages done</div>
                <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:10}}>
                  {STAGES.map(s=><div key={s.id} style={{width:10,height:10,borderRadius:"50%",background:s.pct===100?"#16a34a":s.pct>0?"#fbbf24":"#e5e7eb",transition:"background .4s"}}/>)}
                </div>
              </div>
            </div>

            <div style={{padding:"0 16px",marginBottom:22}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9ca3af",marginBottom:10,padding:"0 2px"}}>Stages</div>
              <nav style={{display:"flex",flexDirection:"column",gap:2}}>
                {STAGES.map((s,i)=>(
                  <button key={s.id} onClick={()=>setActive(activeCard===s.id?null:s.id)}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"9px 8px",borderRadius:10,border:`1px solid ${activeCard===s.id?"#bbf7d0":"transparent"}`,background:activeCard===s.id?"#f0fdf4":"transparent",cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all .15s",width:"100%"}}>
                    <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11.5,background:s.pct===100?"#16a34a":activeCard===s.id?"#dcfce7":"#f3f4f6",border:`2px solid ${s.pct===100?"#16a34a":activeCard===s.id?"#16a34a":"#e5e7eb"}`,color:s.pct===100?"#fff":activeCard===s.id?"#16a34a":"#9ca3af",fontWeight:700}}>
                      {s.pct===100?"✓":i+1}
                    </div>
                    <span style={{fontSize:12.5,fontWeight:activeCard===s.id?600:500,color:activeCard===s.id?"#16a34a":"#374151",flex:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.label}</span>
                    <Badge v={s.v==="green"?"green":s.v==="amber"?"amber":s.v==="blue"?"blue":"neutral"}>{s.pct===100?"Done":`${s.pct}%`}</Badge>
                  </button>
                ))}
              </nav>
            </div>

            <div style={{padding:"0 16px",marginBottom:22}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9ca3af",marginBottom:10,padding:"0 2px"}}>Next Deadline</div>
              <div style={{background:"#fef3c7",border:"1.5px solid rgba(217,119,6,0.25)",borderRadius:12,padding:"14px"}}>
                <div style={{fontSize:12,fontWeight:600,color:"#92400e",marginBottom:4}}>{confirmed?"Document Upload":"Course Registration"}</div>
                <div style={{fontFamily:"'Fraunces',serif",fontSize:26,color:"#111827",lineHeight:1}}>{confirmed?"3 days":"6 days"}</div>
                <div style={{fontSize:11,color:"#78716c",marginTop:4}}>{confirmed?"Feb 20, 2026":"Feb 23, 2026 · 11:59 PM"}</div>
              </div>
            </div>

            <div style={{padding:"0 16px"}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9ca3af",marginBottom:10,padding:"0 2px"}}>Ask EduBot</div>
              {["Pending documents?","Best elective for ECE?","When is orientation?","How to activate LMS?"].map(q=>(
                <button key={q} onClick={()=>{setChatOpen(true);quickAsk(q);}}
                  style={{width:"100%",textAlign:"left",background:"#f9fafb",border:"1.5px solid #f3f4f6",borderRadius:9,padding:"8px 11px",marginBottom:5,fontSize:12,color:"#374151",cursor:"pointer",fontFamily:"inherit",transition:"all .15s",display:"flex",alignItems:"center",gap:8}}
                  onMouseEnter={e=>{e.currentTarget.style.background="#f0fdf4";e.currentTarget.style.borderColor="#bbf7d0";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="#f9fafb";e.currentTarget.style.borderColor="#f3f4f6";}}>
                  <span style={{color:"#16a34a",fontSize:13}}>✦</span>{q}
                </button>
              ))}
            </div>
          </aside>

          {/* Main */}
          <main style={{padding:"28px 32px",overflowY:"auto"}}>
            <div style={{marginBottom:22,animation:"fadeUp .5s ease"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16}}>
                <div>
                  <h1 style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:700,letterSpacing:"-0.025em",color:"#111827",lineHeight:1.2,marginBottom:5}}>
                    Good morning, <span style={{color:"#16a34a",fontStyle:"italic"}}>Arjun.</span>
                  </h1>
                  <p style={{fontSize:13.5,color:"#6b7280"}}>{overallPct<100?`You're ${overallPct}% through — ${4-STAGES.filter(s=>s.pct===100).length} stage(s) left before Mar 3.`:"🎉 All complete! Classes start Mar 3."}</p>
                </div>
                <div style={{display:"flex",gap:8,flexShrink:0}}>
                  <button onClick={()=>setPage("timeline")} style={{padding:"8px 16px",borderRadius:10,border:"1.5px solid #e5e7eb",background:"#fff",color:"#374151",fontSize:12.5,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📅 Timeline</button>
                  <button onClick={()=>setChatOpen(true)} style={{padding:"8px 16px",borderRadius:10,border:"none",background:"#16a34a",color:"#fff",fontSize:12.5,fontWeight:600,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 2px 8px rgba(22,163,74,0.3)"}}>💬 Ask EduBot</button>
                </div>
              </div>
            </div>

            {/* Stat row */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20,animation:"fadeUp .5s .06s ease both"}}>
              {[[`${verifiedCount}/9`,"Docs Verified",verifiedCount===9?"#f0fdf4":"#fefce8",verifiedCount===9?"#16a34a":"#d97706"],["₹1,88,500","Fees Paid","#f0fdf4","#16a34a"],[`${credits}/19 cr`,"Credits",confirmed?"#f0fdf4":"#fefce8",confirmed?"#16a34a":"#d97706"],[`${compDone}/5`,"Compliance","#eff6ff","#2563eb"]].map(([val,label,bg,col],i)=>(
                <div key={label} style={{background:bg,border:`1.5px solid ${col}22`,borderRadius:12,padding:"14px 16px",transition:"transform .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:700,color:col,lineHeight:1}}>{val}</div>
                  <div style={{fontSize:11.5,color:"#6b7280",marginTop:5,fontWeight:500}}>{label}</div>
                </div>
              ))}
            </div>

            {/* Alert */}
            {docs.filter(d=>d.status==="missing").length>0&&(
              <div style={{background:"#fffbeb",border:"1.5px solid #fcd34d",borderRadius:12,padding:"12px 16px",display:"flex",gap:12,alignItems:"flex-start",marginBottom:20,animation:"fadeUp .5s .1s ease both"}}>
                <span style={{fontSize:18,flexShrink:0,marginTop:1}}>⚠️</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#92400e",marginBottom:2}}>{docs.filter(d=>d.status==="missing").length} document(s) must be uploaded by Feb 20</div>
                  <div style={{fontSize:12,color:"#78716c"}}>{docs.filter(d=>d.status==="missing").map(d=>d.name).join(" · ")} — failure to submit may delay your Student ID card.</div>
                </div>
                <button onClick={()=>setActive("docs")} style={{padding:"6px 14px",borderRadius:8,border:"none",background:"#92400e",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Fix Now</button>
              </div>
            )}

            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#9ca3af",marginBottom:12,animation:"fadeUp .5s .12s ease both"}}>Onboarding Stages</div>

            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {STAGES.map((stage,idx)=>{
                const open=activeCard===stage.id;
                const bc=stage.v==="green"?"#16a34a":stage.v==="amber"?"#f59e0b":stage.v==="blue"?"#3b82f6":"#9ca3af";
                return (
                  <div key={stage.id} style={{background:"#fff",border:`1.5px solid ${open?"#86efac":"#f3f4f6"}`,borderRadius:14,overflow:"hidden",boxShadow:open?"0 0 0 3px rgba(22,163,74,0.08)":"none",transition:"all .2s",animation:`fadeUp .5s ${.14+idx*.05}s ease both`}}>
                    <div onClick={()=>setActive(open?null:stage.id)} style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
                      <div style={{width:42,height:42,borderRadius:12,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,background:stage.v==="green"?"#f0fdf4":stage.v==="amber"?"#fffbeb":stage.v==="blue"?"#eff6ff":"#f1f5f9"}}>{stage.emoji}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14.5,fontWeight:700,color:"#111827",marginBottom:3}}>{stage.label}</div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{width:100,height:4,background:"#f3f4f6",borderRadius:2,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${stage.pct}%`,background:bc,borderRadius:2,transition:"width .8s ease"}}/>
                          </div>
                          <span style={{fontSize:11.5,color:"#9ca3af",fontWeight:600}}>{stage.pct}%</span>
                          <span style={{fontSize:12,color:"#6b7280"}}>· {stage.sub}</span>
                        </div>
                      </div>
                      <Badge v={stage.v==="green"?"green":stage.v==="amber"?"amber":stage.v==="blue"?"blue":"neutral"}>
                        {stage.pct===100?"✓ Complete":stage.id==="docs"?"Action needed":stage.id==="courses"?"6 days left":"In progress"}
                      </Badge>
                      <span style={{color:"#9ca3af",fontSize:18,marginLeft:4,display:"inline-block",transform:`rotate(${open?90:0}deg)`,transition:"transform .2s"}}>›</span>
                    </div>

                    {open&&<div style={{borderTop:"1.5px solid #f9fafb",padding:"20px 20px"}}>
                      {/* DOCS */}
                      {stage.id==="docs"&&<>
                        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#9ca3af",marginBottom:10}}>Document Checklist — {verifiedCount}/9</div>
                        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
                          {docs.map(doc=>(
                            <div key={doc.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",border:`1.5px solid ${doc.status==="verified"?"#bbf7d0":"#fecaca"}`,borderRadius:9,background:doc.status==="verified"?"#f0fdf4":"#fff",transition:"all .2s"}}>
                              <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,background:doc.status==="verified"?"#16a34a":"#ef4444",color:"#fff"}}>{doc.status==="verified"?"✓":"!"}</div>
                              <div style={{flex:1}}>
                                <div style={{fontWeight:600,color:"#111827",fontSize:13}}>{doc.name}</div>
                                <div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>{doc.sub}</div>
                              </div>
                              {doc.status==="verified"?<Badge v="green">Verified</Badge>:
                                <button onClick={()=>handleUpload(doc.id)} disabled={uploading===doc.id}
                                  style={{padding:"5px 14px",borderRadius:8,border:"1.5px solid #d1d5db",background:uploading===doc.id?"#f9fafb":"#fff",color:"#374151",fontSize:12,fontWeight:600,cursor:uploading===doc.id?"wait":"pointer",fontFamily:"inherit"}}>
                                  {uploading===doc.id?"Uploading…":"↑ Upload"}
                                </button>}
                            </div>
                          ))}
                        </div>
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          <button onClick={()=>{setChatOpen(true);quickAsk("What documents are pending and what exactly should I submit?");}} style={{padding:"9px 18px",borderRadius:10,border:"none",background:"#111827",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Ask EduBot for help</button>
                          <span style={{fontSize:12,color:"#9ca3af"}}>Deadline: <strong style={{color:"#dc2626"}}>Feb 20, 2026</strong></span>
                        </div>
                      </>}

                      {/* FEE */}
                      {stage.id==="fee"&&<>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18}}>
                          {[["Total Paid","₹1,88,500","#16a34a"],["Transaction Ref","TXN-2024-47891","#2563eb"],["Date","Jan 8–9, 2026","#6b7280"]].map(([l,v,c])=>(
                            <div key={l} style={{background:"#f9fafb",border:"1.5px solid #f3f4f6",borderRadius:10,padding:"12px",textAlign:"center"}}>
                              <div style={{fontSize:10.5,color:"#9ca3af",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:5}}>{l}</div>
                              <div style={{fontSize:13,fontWeight:700,color:c}}>{v}</div>
                            </div>
                          ))}
                        </div>
                        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,marginBottom:16}}>
                          <thead><tr>{["Component","Paid on","Amount"].map(h=><th key={h} style={{textAlign:h==="Amount"?"right":"left",padding:"8px 0",fontSize:10.5,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:"#9ca3af",borderBottom:"1.5px solid #f3f4f6"}}>{h}</th>)}</tr></thead>
                          <tbody>{FEES.map(f=><tr key={f.label}><td style={{padding:"11px 0",borderBottom:"1.5px solid #f9fafb",color:"#374151",fontWeight:500}}>{f.label}</td><td style={{padding:"11px 0",borderBottom:"1.5px solid #f9fafb"}}><Badge v="green">✓ {f.date}</Badge></td><td style={{padding:"11px 0",borderBottom:"1.5px solid #f9fafb",textAlign:"right",fontWeight:600,color:"#111827"}}>{fmt(f.amount)}</td></tr>)}</tbody>
                        </table>
                        <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderTop:"2px solid #f3f4f6",marginBottom:14}}>
                          <span style={{fontWeight:700,fontSize:14}}>Total Paid</span>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <span style={{fontWeight:800,fontSize:16,fontFamily:"'Fraunces',serif"}}>{fmt(FEES.reduce((a,f)=>a+f.amount,0))}</span>
                            <Badge v="green">✓ Cleared</Badge>
                          </div>
                        </div>
                        <button onClick={()=>showToast("Receipt downloaded!")} style={{padding:"9px 18px",borderRadius:10,border:"1.5px solid #e5e7eb",background:"#fff",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📄 Download Receipt</button>
                      </>}

                      {/* COURSES */}
                      {stage.id==="courses"&&<>
                        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"#f9fafb",borderRadius:10,marginBottom:18}}>
                          <div style={{flex:1,height:6,background:"#e5e7eb",borderRadius:3,overflow:"hidden"}}>
                            <div style={{height:"100%",background:"#16a34a",borderRadius:3,width:confirmed?"100%":"74%",transition:"width 1s ease"}}/>
                          </div>
                          <span style={{fontSize:13.5,fontWeight:800,color:"#111827",fontFamily:"'Fraunces',serif",whiteSpace:"nowrap"}}>{confirmed?19:14}<span style={{fontSize:12,color:"#9ca3af",fontWeight:400}}>/19 cr</span></span>
                        </div>
                        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#9ca3af",marginBottom:8}}>Core Courses</div>
                        <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:18}}>
                          {CORES.map(c=>(
                            <div key={c.code} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",border:"1.5px solid #bbf7d0",borderRadius:9,background:"#f0fdf4",fontSize:13}}>
                              <span style={{fontSize:10.5,fontWeight:700,color:"#9ca3af",width:44,flexShrink:0}}>{c.code}</span>
                              <div style={{flex:1}}><div style={{fontWeight:600,color:"#111827"}}>{c.name}</div><div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>{c.prof}</div></div>
                              <span style={{fontSize:11.5,color:"#6b7280"}}>{c.credits} cr</span>
                              <Badge v="green">✓</Badge>
                            </div>
                          ))}
                        </div>
                        {!confirmed?<>
                          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#d97706",marginBottom:8}}>Select Elective · Deadline Feb 23</div>
                          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
                            {ELECTIVES.map(el=>(
                              <div key={el.code} onClick={()=>setElective(el)}
                                style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",border:`1.5px ${elective?.code===el.code?"solid #16a34a":"dashed #d1d5db"}`,borderRadius:9,fontSize:13,cursor:"pointer",background:elective?.code===el.code?"#f0fdf4":"#fff",transition:"all .15s"}}>
                                <span style={{fontSize:10.5,fontWeight:700,color:"#9ca3af",width:44,flexShrink:0}}>{el.code}</span>
                                <div style={{flex:1}}><div style={{fontWeight:600,color:"#111827"}}>{el.name}</div><div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>{el.seats}/{el.total} seats</div></div>
                                <span style={{fontSize:12,color:"#6b7280"}}>{el.credits} cr</span>
                                <Badge v={elective?.code===el.code?"green":el.tag==="Limited"?"amber":el.rec?"green":"neutral"}>{elective?.code===el.code?"✓ Selected":el.tag}</Badge>
                              </div>
                            ))}
                          </div>
                          <div style={{display:"flex",gap:8}}>
                            <button onClick={confirmCourses} style={{padding:"10px 22px",borderRadius:10,border:"none",background:"#111827",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 2px 8px rgba(0,0,0,0.15)"}}>Confirm Registration →</button>
                            <button onClick={()=>quickAsk("Which elective is best for ECE — Signals & Systems, Digital Logic Design, or Microcontrollers?")} style={{padding:"10px 18px",borderRadius:10,border:"1.5px solid #e5e7eb",background:"#fff",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Ask AI for advice</button>
                          </div>
                        </>:(
                          <div style={{padding:"16px 18px",background:"#f0fdf4",border:"1.5px solid #86efac",borderRadius:12,display:"flex",alignItems:"center",gap:14}}>
                            <span style={{fontSize:28}}>🎉</span>
                            <div><div style={{fontWeight:700,color:"#15803d",fontSize:14.5}}>Registration Complete!</div><div style={{fontSize:12.5,color:"#6b7280",marginTop:3}}>{elective?.name} · 19/19 credits locked in · Confirmation sent to your email</div></div>
                          </div>
                        )}
                      </>}

                      {/* MENTOR */}
                      {stage.id==="mentor"&&<>
                        <div style={{display:"flex",alignItems:"flex-start",gap:16,padding:"16px 18px",background:"#f9fafb",border:"1.5px solid #f3f4f6",borderRadius:12,marginBottom:18}}>
                          <div style={{width:52,height:52,borderRadius:"50%",flexShrink:0,background:"linear-gradient(135deg,#16a34a,#15803d)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:700}}>P</div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:2}}>Dr. Priya Menon</div>
                            <div style={{fontSize:12.5,color:"#6b7280",marginBottom:10}}>Asst. Professor · ECE Dept · PhD, IIT Madras</div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
                              {[["✉️","priya.m@srm.edu.in"],["🏢","ECE Block, Room 312"],["📅","Feb 25, 10 AM"]].map(([i,t])=>(
                                <span key={t} style={{fontSize:12,color:"#374151",display:"flex",alignItems:"center",gap:5}}>{i}<span style={{color:"#6b7280"}}>{t}</span></span>
                              ))}
                            </div>
                          </div>
                          <button onClick={()=>quickAsk("What should I discuss with Dr. Priya Menon in my first mentoring meeting?")} style={{padding:"7px 14px",borderRadius:8,border:"1.5px solid #e5e7eb",background:"#fff",color:"#374151",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Prep with AI →</button>
                        </div>
                        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#9ca3af",marginBottom:10}}>Compliance Modules — {compDone}/5</div>
                        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
                          {compliance.map(item=>(
                            <div key={item.id} onClick={()=>toggleComp(item.id)}
                              style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",border:`1.5px solid ${item.done?"#bbf7d0":"#f3f4f6"}`,borderRadius:9,fontSize:13,cursor:"pointer",background:item.done?"#f0fdf4":"#fff",transition:"all .2s"}}>
                              <div style={{width:20,height:20,borderRadius:5,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${item.done?"#16a34a":"#d1d5db"}`,background:item.done?"#16a34a":"#fff",color:"#fff",fontSize:10,fontWeight:700,transition:"all .2s"}}>{item.done?"✓":""}</div>
                              <span style={{flex:1,color:item.done?"#374151":"#6b7280",fontWeight:item.done?600:400}}>{item.label}</span>
                              <span style={{fontSize:11.5,color:item.done?"#16a34a":"#9ca3af",fontWeight:item.done?600:400}}>{item.due}</span>
                            </div>
                          ))}
                        </div>
                        <button onClick={()=>quickAsk("What compliance modules are remaining and how do I complete them?")} style={{padding:"9px 18px",borderRadius:10,border:"none",background:"#111827",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Get step-by-step guidance</button>
                      </>}
                    </div>}
                  </div>
                );
              })}
            </div>

            <div style={{marginTop:20,padding:"14px 18px",background:"#f0fdf4",border:"1.5px solid #bbf7d0",borderRadius:12,display:"flex",alignItems:"center",gap:12,animation:"fadeUp .5s .4s ease both"}}>
              <span style={{fontSize:20}}>💡</span>
              <span style={{fontSize:13,color:"#374151",flex:1}}><strong style={{color:"#15803d"}}>EduBot tip:</strong> Upload your Transfer Certificate first — it's the most urgent pending item. Classes begin March 3.</span>
              <button onClick={()=>{setChatOpen(true);quickAsk("What's the most important thing I should do right now to complete my onboarding?");}} style={{padding:"6px 14px",borderRadius:8,border:"1.5px solid #86efac",background:"#fff",color:"#16a34a",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Ask AI →</button>
            </div>
          </main>
        </div>
      )}

      {/* Floating Chat */}
      <div style={{position:"fixed",bottom:24,right:24,zIndex:500}}>
        <div style={{position:"absolute",bottom:66,right:0,width:368,background:"#fff",border:"1.5px solid #f3f4f6",borderRadius:22,boxShadow:"0 20px 60px rgba(0,0,0,0.12)",display:"flex",flexDirection:"column",maxHeight:540,overflow:"hidden",opacity:chatOpen?1:0,pointerEvents:chatOpen?"all":"none",transform:chatOpen?"translateY(0) scale(1)":"translateY(16px) scale(0.96)",transition:"all .22s cubic-bezier(.4,0,.2,1)"}}>
          <div style={{padding:"14px 16px",borderBottom:"1.5px solid #f9fafb",display:"flex",alignItems:"center",gap:10,flexShrink:0,background:"linear-gradient(135deg,#f0fdf4,#dcfce7)"}}>
            <div style={{width:38,height:38,background:"#111827",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,position:"relative"}}>
              🤖<div style={{position:"absolute",bottom:0,right:0,width:11,height:11,background:"#16a34a",borderRadius:"50%",border:"2.5px solid #f0fdf4"}}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:14.5,fontWeight:700,color:"#111827"}}>EduBot AI</div>
              <div style={{fontSize:11,color:"#16a34a",display:"flex",alignItems:"center",gap:5,fontWeight:500}}>
                <span style={{width:5,height:5,background:"#16a34a",borderRadius:"50%",display:"inline-block"}}/>Powered by Claude · Always available
              </div>
            </div>
            <button onClick={()=>setChatOpen(false)} style={{background:"#fff",border:"1.5px solid #e5e7eb",width:30,height:30,borderRadius:"50%",cursor:"pointer",color:"#6b7280",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>×</button>
          </div>
          <div ref={msgsRef} style={{flex:1,overflowY:"auto",padding:"14px 14px 8px",display:"flex",flexDirection:"column",gap:10}}>
            {messages.map((msg,i)=>(
              <div key={i} style={{display:"flex",gap:8,flexDirection:msg.role==="user"?"row-reverse":"row",animation:"msgIn .2s ease"}}>
                <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:msg.role==="user"?11:14,fontWeight:700,marginTop:2,background:msg.role==="user"?"#16a34a":"#111827",color:"#fff"}}>{msg.role==="user"?"AR":"🤖"}</div>
                <div style={{maxWidth:246}}>
                  <div style={{padding:"10px 13px",borderRadius:14,fontSize:13,lineHeight:1.5,borderBottomLeftRadius:msg.role==="assistant"?4:14,borderBottomRightRadius:msg.role==="user"?4:14,background:msg.role==="user"?"#111827":"#f9fafb",color:msg.role==="user"?"#fff":"#374151",border:msg.role==="assistant"?"1.5px solid #f3f4f6":"none"}}>{md(msg.content)}</div>
                </div>
              </div>
            ))}
            {aiLoading&&<div style={{display:"flex",gap:8}}><div style={{width:28,height:28,background:"#111827",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div><div style={{display:"flex",alignItems:"center",gap:3,padding:"12px 14px",background:"#f9fafb",border:"1.5px solid #f3f4f6",borderRadius:14,borderBottomLeftRadius:4}}>{[0,.18,.36].map((d,i)=><div key={i} style={{width:5,height:5,background:"#9ca3af",borderRadius:"50%",animation:`bounce 1.1s ${d}s infinite`}}/>)}</div></div>}
          </div>
          <div style={{padding:"4px 12px 6px",display:"flex",flexWrap:"wrap",gap:5,flexShrink:0}}>
            {["Pending docs?","Best elective?","Orientation?","LMS setup"].map(q=>(
              <button key={q} onClick={()=>quickAsk(q)} style={{fontSize:11,padding:"5px 11px",borderRadius:20,border:"1.5px solid #f3f4f6",background:"#fff",cursor:"pointer",color:"#6b7280",fontFamily:"inherit",transition:"all .15s",whiteSpace:"nowrap"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#16a34a";e.currentTarget.style.color="#16a34a";e.currentTarget.style.background="#f0fdf4";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#f3f4f6";e.currentTarget.style.color="#6b7280";e.currentTarget.style.background="#fff";}}>{q}</button>
            ))}
          </div>
          <div style={{padding:"8px 12px 14px",flexShrink:0}}>
            <form onSubmit={sendChat} style={{display:"flex",gap:8,alignItems:"flex-end",border:"1.5px solid #e5e7eb",borderRadius:13,padding:"8px 10px",background:"#fff"}}>
              <textarea value={inputVal} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat(e);}}} placeholder="Ask anything about your onboarding…" rows={1} style={{flex:1,border:"none",outline:"none",resize:"none",fontFamily:"inherit",fontSize:13,color:"#111827",background:"transparent",maxHeight:72,lineHeight:1.4}}/>
              <button type="submit" disabled={aiLoading||!inputVal.trim()} style={{width:34,height:34,borderRadius:10,border:"none",flexShrink:0,background:aiLoading||!inputVal.trim()?"#f3f4f6":"#16a34a",color:aiLoading||!inputVal.trim()?"#9ca3af":"#fff",cursor:aiLoading||!inputVal.trim()?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,transition:"all .15s"}}>›</button>
            </form>
            <div style={{textAlign:"center",fontSize:10,color:"#d1d5db",marginTop:6}}>Visored EduBot · Powered by Claude AI</div>
          </div>
        </div>
        <button onClick={()=>setChatOpen(!chatOpen)} style={{width:54,height:54,background:chatOpen?"#374151":"#16a34a",borderRadius:"50%",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 24px rgba(22,163,74,0.4)",fontSize:chatOpen?22:20,color:"#fff",transition:"all .2s"}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          {chatOpen?"×":"💬"}
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ROOT
// ═════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [session, setSession] = useState(null); // null | "student" | "admin"

  if (!session) return <LoginScreen onLogin={role => setSession(role)} />;
  if (session === "admin") return <AdminDashboard onLogout={() => setSession(null)} />;
  return <StudentDashboard onLogout={() => setSession(null)} />;
}
