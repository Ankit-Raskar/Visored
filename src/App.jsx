import { useState, useRef, useEffect, useCallback } from "react";
// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}


// ─── ANIMATED NUMBER COUNTER ──────────────────────────────────────────────────
function AnimatedNumber({ value, prefix="", suffix="", duration=900 }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);
  const frameRef = useRef(null);
  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const start = performance.now();
    const from = 0;
    const to = parseFloat(String(value).replace(/[^0-9.]/g,"")) || 0;
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(from + (to - from) * ease));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);
  return <span>{prefix}{display.toLocaleString("en-IN")}{suffix}</span>;
}

// ─── DAYS REMAINING ───────────────────────────────────────────────────────────
function Countdown({ targetDate }) {
  const diff = new Date(targetDate) - new Date();
  if (diff <= 0) return <span style={{color:"#dc2626",fontWeight:700,fontSize:28}}>Expired</span>;
  const days = Math.ceil(diff / 86400000);
  const urgent = days <= 3;
  return (
    <div style={{display:"flex",alignItems:"baseline",gap:6}}>
      <span style={{fontFamily:"'Fraunces',serif",fontSize:32,fontWeight:900,color: urgent ? "#dc2626" : "#111827",lineHeight:1}}>{days}</span>
      <span style={{fontSize:18,fontWeight:600,color: urgent ? "#dc2626" : "#374151"}}>days</span>
    </div>
  );
}

// ─── SKELETON LOADER ─────────────────────────────────────────────────────────
function Skeleton({ w="100%", h=16, r=8, mb=0 }) {
  return <div style={{width:w,height:h,borderRadius:r,background:"linear-gradient(90deg,#f1f5f9 0%,#e2e8f0 40%,#f8fafc 60%,#f1f5f9 100%)",backgroundSize:"300% 100%",animation:"shimmer 1.7s ease-in-out infinite",marginBottom:mb}}/>;
}

function SkeletonDashboard() {
  return (
    <div style={{display:"flex",minHeight:"calc(100vh - 58px)"}}>
      <aside style={{width:264,background:"#fff",borderRight:"1.5px solid #f3f4f6",padding:"22px 16px",flexShrink:0}}>
        <Skeleton w="100%" h={160} r={14} mb={16}/>
        <Skeleton w="60%" h={10} r={4} mb={12}/>
        {[0,1,2,3].map(i=><Skeleton key={i} w="100%" h={40} r={10} mb={6}/>)}
      </aside>
      <main style={{flex:1,padding:"28px 32px"}}>
        <Skeleton w="260px" h={32} r={8} mb={8}/>
        <Skeleton w="340px" h={16} r={6} mb={24}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
          {[0,1,2,3].map(i=><Skeleton key={i} w="100%" h={72} r={12}/>)}
        </div>
        <Skeleton w="100%" h={64} r={12} mb={12}/>
        {[0,1,2,3].map(i=><Skeleton key={i} w="100%" h={64} r={14} mb={10}/>)}
      </main>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

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
  const [drawn, setDrawn] = useState(0);
  // Defer to next frame so CSS transition fires every mount
  useEffect(() => { const id = requestAnimationFrame(() => setDrawn(pct)); return () => cancelAnimationFrame(id); }, [pct]);
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)",display:"block",filter:`drop-shadow(0 0 5px ${color}55)`}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ-(drawn/100)*circ}
        style={{transition:"stroke-dashoffset 1.1s cubic-bezier(.34,1.1,.64,1)"}}/>
    </svg>
  );
}

function Badge({children,v="neutral"}) {
  const C={green:["#dcfce7","#15803d"],amber:["#fef3c7","#92400e"],red:["#fee2e2","#b91c1c"],blue:["#dbeafe","#1d4ed8"],purple:["#ede9fe","#6d28d9"],neutral:["#f1f5f9","#475569"]}[v]||["#f1f5f9","#475569"];
  return <span style={{background:C[0],color:C[1],fontSize:10.5,fontWeight:600,padding:"3px 9px",borderRadius:20,whiteSpace:"nowrap"}}>{children}</span>;
}

function Toast({msg,type}) {
  const C={error:["#fef2f2","#dc2626"],info:["#eff6ff","#2563eb"],success:["#f0fdf4","#16a34a"]}[type||"success"];
  const icon=type==="error"?"✕":type==="info"?"i":"✓";
  return (
    <div style={{position:"fixed",top:18,right:18,zIndex:9999,background:C[0],border:`1.5px solid ${C[1]}44`,color:C[1],padding:"11px 18px 11px 12px",borderRadius:14,fontSize:13,fontWeight:600,boxShadow:`0 12px 36px rgba(0,0,0,.13),0 0 0 1px ${C[1]}18`,display:"flex",alignItems:"center",gap:10,animation:"toastIn .38s cubic-bezier(.34,1.56,.64,1) both"}}>
      <div style={{width:22,height:22,borderRadius:"50%",background:C[1],color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,flexShrink:0}}>{icon}</div>
      {msg}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═════════════════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const isMobile = useWindowWidth() < 768;
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
    <div style={{minHeight:"100vh",display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",fontFamily:"'Sora',system-ui,sans-serif"}}>
      {/* Left Panel */}
      <div style={{background:"linear-gradient(160deg,#0f1a0f 0%,#0a2e1a 50%,#082215 100%)",display:isMobile?"none":"flex",flexDirection:"column",justifyContent:"space-between",padding:"48px 52px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 20% 80%,rgba(22,163,74,0.12) 0%,transparent 60%),radial-gradient(circle at 80% 20%,rgba(22,163,74,0.08) 0%,transparent 50%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none"}}/>

        {/* Brand */}
        <div style={{display:"flex",alignItems:"center",gap:12,position:"relative",animation:"slideL .55s cubic-bezier(.34,1.2,.64,1) both"}}>
          <div style={{width:38,height:38,background:"linear-gradient(135deg,#16a34a,#15803d)",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,animation:"breathe 2.8s ease-in-out infinite"}}>🎓</div>
          <span style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:900,color:"#fff",letterSpacing:"-0.03em"}}>Visored</span>
        </div>

        {/* Hero text */}
        <div style={{position:"relative"}}>
          <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#4ade80",marginBottom:16,animation:"fadeUp .5s .1s both"}}>Smart Student Onboarding</div>
          <h1 style={{fontFamily:"'Fraunces',serif",fontSize:42,fontWeight:900,color:"#fff",lineHeight:1.15,letterSpacing:"-0.03em",marginBottom:20,animation:"fadeUp .5s .17s both"}}>
            Your journey<br/>starts here.
          </h1>
          <p style={{fontSize:14.5,color:"#86efac",lineHeight:1.7,maxWidth:340,animation:"fadeUp .5s .24s both"}}>
            Visored guides every student through document verification, fees, course registration, mentoring and compliance — all in one intelligent platform.
          </p>

          {/* Feature pills — staggered */}
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:28}}>
            {["📄 Document Verification","💳 Fee Tracking","📚 Course Registration","🎯 Mentoring","🤖 AI Assistant"].map((f,i)=>(
              <span key={f} style={{background:"rgba(22,163,74,0.15)",border:"1px solid rgba(22,163,74,0.3)",color:"#86efac",fontSize:12,fontWeight:500,padding:"6px 14px",borderRadius:20,display:"inline-block",animation:`fadeUp .4s ${.3+i*.07}s both`,transition:"background .18s,transform .18s"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(22,163,74,.28)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(22,163,74,.15)";e.currentTarget.style.transform="translateY(0)";}}>{f}</span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",position:"relative",animation:"fadeIn .6s .6s both"}}>
          SRM Institute of Science & Technology, Chennai · Batch 2024–28
        </div>
      </div>

      {/* Right Panel */}
      <div style={{background:"#f9fafb",display:"flex",alignItems:"center",justifyContent:"center",padding:isMobile?"32px 20px":"48px 52px",minHeight:isMobile?"100vh":"auto"}}>
        <div style={{width:"100%",maxWidth:400,animation:"fadeUp .45s .05s both"}}>

          <h2 style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:700,color:"#111827",marginBottom:6,letterSpacing:"-0.02em"}}>
            Welcome back
          </h2>
          <p style={{fontSize:13.5,color:"#6b7280",marginBottom:28}}>Sign in to continue your onboarding</p>

          {/* Tabs — spring active indicator */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",background:"#f3f4f6",borderRadius:12,padding:4,marginBottom:28}}>
            {["student","admin"].map(t=>(
              <button key={t} onClick={()=>{setTab(t);setId("");setPass("");setError("");}}
                style={{padding:"10px",borderRadius:9,border:"none",cursor:"pointer",
                  fontFamily:"inherit",fontSize:13.5,fontWeight:600,
                  transition:"all .28s cubic-bezier(.34,1.56,.64,1)",
                  background:tab===t?"#fff":"transparent",
                  color:tab===t?"#111827":"#9ca3af",
                  boxShadow:tab===t?"0 2px 10px rgba(0,0,0,.1)":"none",
                  transform:tab===t?"scale(1.03)":"scale(1)"}}>
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
                  background:"#fff",outline:"none",transition:"border-color .18s,box-shadow .18s"}}
                onFocus={e=>{e.target.style.borderColor="#16a34a";e.target.style.boxShadow="0 0 0 3px rgba(22,163,74,.12)";}}
                onBlur={e=>{e.target.style.borderColor=error?"#fca5a5":"#e5e7eb";e.target.style.boxShadow="none";}}/>
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
                    background:"#fff",outline:"none",transition:"border-color .18s,box-shadow .18s"}}
                  onFocus={e=>{e.target.style.borderColor="#16a34a";e.target.style.boxShadow="0 0 0 3px rgba(22,163,74,.12)";}}
                  onBlur={e=>{e.target.style.borderColor=error?"#fca5a5":"#e5e7eb";e.target.style.boxShadow="none";}}/>
                <button onClick={()=>setShow(!showPass)}
                  style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                    background:"none",border:"none",cursor:"pointer",color:"#9ca3af",fontSize:16,transition:"color .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.color="#374151"}
                  onMouseLeave={e=>e.currentTarget.style.color="#9ca3af"}>
                  {showPass?"🙈":"👁"}
                </button>
              </div>
            </div>

            {error && (
              <div style={{background:"#fef2f2",border:"1.5px solid #fca5a5",borderRadius:9,
                padding:"10px 14px",fontSize:12.5,color:"#dc2626",fontWeight:500,animation:"springUp .35s both"}}>
                ⚠ {error}
              </div>
            )}

            <button onClick={handleLogin} disabled={loading||!id||!pass}
              style={{padding:"13px",borderRadius:11,border:"none",cursor:loading||!id||!pass?"not-allowed":"pointer",
                background:loading||!id||!pass?"#d1d5db":"linear-gradient(135deg,#16a34a,#15803d)",
                color:loading||!id||!pass?"#9ca3af":"#fff",fontSize:14,fontWeight:700,
                fontFamily:"inherit",transition:"box-shadow .2s,background .2s",
                boxShadow:loading||!id||!pass?"none":"0 4px 18px rgba(22,163,74,.38)"}}>
              {loading
                ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    <span style={{width:14,height:14,border:"2px solid rgba(255,255,255,.4)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite"}}/>
                    Signing in…
                  </span>
                : `Sign in as ${tab==="student"?"Student":"Admin"} →`}
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

        /* ── Entrances ── */
        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px) scale(.98)} to{opacity:1;transform:none} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes slideL   { from{opacity:0;transform:translateX(-22px)} to{opacity:1;transform:none} }
        /* spring: overshoot then settle */
        @keyframes springUp { 0%{opacity:0;transform:translateY(14px) scale(.94)}
                              55%{opacity:1;transform:translateY(-3px) scale(1.02)}
                              78%{transform:translateY(1px) scale(.99)}
                              100%{transform:none} }
        /* toast from right with spring */
        @keyframes toastIn  { from{opacity:0;transform:translateX(60px) scale(.88)}
                              to{opacity:1;transform:none} }
        /* chat message pop */
        @keyframes msgIn    { from{opacity:0;transform:translateY(8px) scale(.96)}
                              to{opacity:1;transform:none} }
        /* typing dots */
        @keyframes bounce   { 0%,60%,100%{transform:translateY(0);opacity:.3}
                              30%{transform:translateY(-6px);opacity:1} }
        /* skeleton shimmer */
        @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        /* logo breathe */
        @keyframes breathe  { 0%,100%{box-shadow:0 0 18px rgba(22,163,74,.45)}
                              50%{box-shadow:0 0 34px rgba(22,163,74,.8)} }
        /* spinner */
        @keyframes spin     { to{transform:rotate(360deg)} }
        /* page-level entry */
        @keyframes pageIn   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes voicePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(1.12)} }

        /* ── Micro-interactions (global) ── */
        button { transition: transform .13s cubic-bezier(.34,1.56,.64,1), opacity .13s !important; }
        button:active:not(:disabled) { transform: scale(.93) !important; }

        /* card hover lift helper */
        .lift:hover { transform: translateY(-3px) !important;
                      box-shadow: 0 10px 28px rgba(0,0,0,.09) !important; }
        .lift { transition: transform .2s cubic-bezier(.4,0,.2,1),
                            box-shadow .2s cubic-bezier(.4,0,.2,1) !important; }

        /* smooth thin scrollbar */
        ::-webkit-scrollbar       { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:99px; }

        html,body,#root { width:100%;min-height:100vh;margin:0;padding:0;overflow-x:hidden; }
        * { box-sizing:border-box; }
        input,button { outline:none; }
      `}</style>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════
function AdminDashboard({ onLogout, dark, setDark }) {
  const isMobile = useWindowWidth() < 768;
  const [page, setPage]       = useState("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch]   = useState("");
  const [selected, setSel]    = useState(null);
  const [filter, setFilter]   = useState("all");
  const [toast, setToast]     = useState(null);
  const [sendingId, setSendId]= useState(null);
  const [aiInsight, setAiInsight] = useState(null);
  const [insightLoading, setInsightLoad] = useState(false);
  const [emailDraft, setEmailDraft] = useState(null);
  const [emailLoading, setEmailLoad] = useState(null);

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

  const generateInsight = () => {
    setInsightLoad(true);
    setTimeout(() => {
      const atRisk = STUDENTS_DB.filter(s=>s.status<50||!s.fees);
      const insight = `🔍 **AI Batch Analysis — Feb 2026**\n\n**At-Risk Students (${atRisk.length}):** ${atRisk.map(s=>s.name).join(", ")} — these students have below 50% progress or unpaid fees and are at risk of missing the March 3 deadline.\n\n**Bottleneck Identified:** Document verification is the biggest blocker — ${STUDENTS_DB.filter(s=>s.docs<9).length} students still have incomplete docs. Recommend a WhatsApp broadcast reminder today.\n\n**Prediction:** At current pace, ${STUDENTS_DB.filter(s=>s.status>=80).length} students will complete onboarding before Mar 3. Consider scheduling a walk-in helpdesk session for students below 50%.\n\n**Recommended Action:** Send targeted reminders to Aman Singh & Divya Krishnan immediately — they have 0 courses registered and may be disengaged.`;
      setAiInsight(insight);
      setInsightLoad(false);
    }, 2000);
  };

  const generateEmailDraft = (student) => {
    setEmailLoad(student.id);
    setTimeout(() => {
      const issues = [];
      if (student.docs < 9) issues.push(`${9-student.docs} document(s) still missing (deadline: Feb 20)`);
      if (!student.fees) issues.push("fee payment pending");
      if (student.courses === 0) issues.push("course registration not started (deadline: Feb 23)");
      if (student.compliance < 5) issues.push(`${5-student.compliance} compliance module(s) incomplete`);
      const draft = {
        to: student.email,
        subject: `[URGENT] Action Required: Complete Your Onboarding — ${student.name} (${student.roll})`,
        body: `Dear ${student.name},\n\nThis is a friendly reminder from the Registrar's Office, SRM Institute of Science & Technology.\n\nYour current onboarding progress is ${student.status}%, and the following items require your immediate attention:\n\n${issues.map((x,i)=>`${i+1}. ${x.charAt(0).toUpperCase()+x.slice(1)}`).join("\n")}\n\nPlease log in to the Visored portal and complete these steps as soon as possible. Classes begin on March 3, 2026, and incomplete onboarding may affect your enrollment status.\n\nIf you need assistance, contact us at helpdesk@srm.edu.in or call Ext. 1800 (Mon–Sat, 9AM–6PM).\n\nWarm regards,\nRegistrar's Office\nSRM Institute of Science & Technology`,
      };
      setEmailDraft(draft);
      setEmailLoad(null);
    }, 1600);
  };

  const sendReminder = (id) => {
    setSendId(id);
    setTimeout(()=>{ setSendId(null); showToast("Reminder sent successfully!"); },1200);
  };

  const dm   = dark;
  const abg  = dm ? "#0f172a" : "#f9fafb";
  const asurf= dm ? "#1e293b" : "#fff";
  const abdr = dm ? "#334155" : "#f3f4f6";
  const atx1 = dm ? "#f1f5f9" : "#111827";
  const atx2 = dm ? "#94a3b8" : "#6b7280";

  return (
    <div style={{fontFamily:"'Sora',system-ui,sans-serif",background:abg,minHeight:"100vh",color:atx1,width:"100%",transition:"background .35s,color .35s"}}>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}

      {/* Admin Topbar */}
      <header style={{background:"#111827",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",height:58,padding:"0 24px",gap:10}}>
          <div style={{width:30,height:30,background:"linear-gradient(135deg,#16a34a,#15803d)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🎓</div>
          <span style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:900,color:"#fff",letterSpacing:"-0.03em"}}>Visored</span>
          {!isMobile && <span style={{fontSize:11,fontWeight:600,background:"rgba(22,163,74,0.25)",color:"#4ade80",padding:"3px 10px",borderRadius:20,marginLeft:4,letterSpacing:"0.04em"}}>ADMIN</span>}
          {isMobile ? (
            <button onClick={()=>setMobileNav(!mobileNav)} style={{marginLeft:"auto",background:"none",border:"none",color:"#fff",fontSize:24,cursor:"pointer",padding:"4px 8px",lineHeight:1}}>☰</button>
          ) : null}
        </div>
        {/* Mobile drawer */}
        {isMobile && mobileNav && (
          <div style={{background:"#1a2e1a",borderTop:"1px solid rgba(255,255,255,0.1)"}}>
            {[["overview","🏠 Overview"],["students","👥 Students"],["analytics","📊 Analytics"]].map(([id,label])=>(
              <button key={id} onClick={()=>{setPage(id);setSel(null);setMobileNav(false);}}
                style={{display:"block",width:"100%",padding:"14px 24px",border:"none",borderBottom:"1px solid rgba(255,255,255,0.05)",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:page===id?700:400,background:page===id?"rgba(22,163,74,0.2)":"transparent",color:page===id?"#4ade80":"rgba(255,255,255,0.7)",textAlign:"left"}}>
                {label}
              </button>
            ))}
            <button onClick={onLogout} style={{display:"block",width:"100%",padding:"14px 24px",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:14,background:"transparent",color:"#f87171",textAlign:"left"}}>🚪 Sign out</button>
          </div>
        )}
        {!isMobile && (
          <nav style={{display:"flex",gap:2,padding:"0 8px"}}>
            {[["overview","Overview"],["students","Students"],["analytics","Analytics"]].map(([id,label])=>(
              <button key={id} onClick={()=>{setPage(id);setSel(null);}}
                style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:page===id?600:400,background:page===id?"rgba(255,255,255,0.12)":"transparent",color:page===id?"#fff":"rgba(255,255,255,0.5)",transition:"all .15s"}}>
                {label}
              </button>
            ))}
          </nav>
        )}
        {!isMobile && <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:12,paddingRight:24}}>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>Dr. Admin · Registrar's Office</div>
          <button onClick={()=>setDark(d=>!d)} title={dark?"Light mode":"Dark mode"}
            style={{width:34,height:34,borderRadius:9,border:"1.5px solid rgba(255,255,255,0.2)",background:"transparent",color:"rgba(255,255,255,0.8)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
            {dark?"☀️":"🌙"}
          </button>
          <button onClick={onLogout}
            style={{padding:"7px 16px",borderRadius:9,border:"1.5px solid rgba(255,255,255,0.2)",
              background:"transparent",color:"rgba(255,255,255,0.7)",fontSize:12,fontWeight:600,
              cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,0.7)";}}>
            Sign out
          </button>
        </div>}
      </header>

      <div style={{padding:isMobile?"16px":"28px 32px",maxWidth:"100%",margin:"0 auto"}}>

        {/* OVERVIEW */}
        {page==="overview" && <>
          <div style={{marginBottom:24}}>
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4}}>Admin Overview</h2>
            <p style={{fontSize:13.5,color:atx2}}>Batch 2024–28 onboarding status · {new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</p>
          </div>
          {/* Stat cards — animated counters */}
          <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(5,1fr)",gap:12,marginBottom:28}}>
            {[
              ["👥",stats.total,"Total Students",dm?"#1e3a2e":"#f0fdf4","#16a34a"],
              ["✅",stats.complete,"Fully Onboarded",dm?"#1e3a2e":"#f0fdf4","#16a34a"],
              ["⏳",stats.total-stats.complete-stats.pending,"In Progress",dm?"#2e2a00":"#fefce8","#d97706"],
              ["🔴",stats.pending,"Below 50%",dm?"#3a1a1a":"#fef2f2","#dc2626"],
              ["💳",stats.feesPending,"Fees Pending",dm?"#3a1a1a":"#fef2f2","#dc2626"],
            ].map(([icon,val,label,bg,col],i)=>(
              <div key={label} className="lift" style={{background:bg,border:`1.5px solid ${col}22`,borderRadius:13,padding:"16px 18px",transition:"background .35s",animation:`springUp .5s ${i*.07}s both`}}>
                <div style={{fontSize:22,marginBottom:6}}>{icon}</div>
                <div style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:700,color:col,lineHeight:1}}><AnimatedNumber value={val} duration={900}/></div>
                <div style={{fontSize:11.5,color:atx2,marginTop:4,fontWeight:500}}>{label}</div>
              </div>
            ))}
          </div>

          {/* Average progress */}
          <div style={{background:asurf,border:`1.5px solid ${abdr}`,borderRadius:14,padding:"20px 24px",marginBottom:24,transition:"background .35s"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div>
                <div style={{fontSize:15,fontWeight:700,marginBottom:2,color:atx1}}>Batch Onboarding Progress</div>
                <div style={{fontSize:12.5,color:atx2}}>Average completion across all {stats.total} students</div>
              </div>
              <div style={{fontFamily:"'Fraunces',serif",fontSize:36,fontWeight:700,color:clr(stats.avgProgress)}}><AnimatedNumber value={stats.avgProgress} suffix="%" duration={1000}/></div>
            </div>
            <div style={{height:10,background:abdr,borderRadius:5,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${stats.avgProgress}%`,borderRadius:5,
                background:`linear-gradient(90deg,#16a34a,#22c55e)`,transition:"width 1s ease"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:10,fontSize:12,color:atx2}}>
              <span>0%</span><span>Target: 100% by Mar 3</span><span>100%</span>
            </div>
          </div>

          {/* Stage breakdown */}
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16}}>
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
          <div style={{background:"#fff",border:"1.5px solid #f3f4f6",borderRadius:14,overflow:"auto"}}>
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
                      <div style={{display:"flex",gap:5}}>
                      <button onClick={()=>sendReminder(s.id)} disabled={sendingId===s.id}
                        style={{padding:"5px 10px",borderRadius:7,border:"1.5px solid #e5e7eb",
                          background:sendingId===s.id?"#f3f4f6":"#fff",color:"#374151",fontSize:11,
                          fontWeight:600,cursor:sendingId===s.id?"wait":"pointer",fontFamily:"inherit",
                          transition:"all .15s",whiteSpace:"nowrap"}}
                        onMouseEnter={e=>{if(sendingId!==s.id){e.currentTarget.style.borderColor="#16a34a";e.currentTarget.style.color="#16a34a";}}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.color="#374151";}}>
                        {sendingId===s.id?"Sending…":"📧 Remind"}
                      </button>
                      <button onClick={()=>generateEmailDraft(s)} disabled={emailLoading===s.id}
                        style={{padding:"5px 10px",borderRadius:7,border:"1.5px solid #e5e7eb",
                          background:emailLoading===s.id?"#f3f4f6":"#fff",color:"#6d28d9",fontSize:11,
                          fontWeight:600,cursor:"pointer",fontFamily:"inherit",
                          transition:"all .15s",whiteSpace:"nowrap",borderColor:"#ede9fe"}}
                        onMouseEnter={e=>{e.currentTarget.style.background="#ede9fe";}}
                        onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}>
                        {emailLoading===s.id?"Writing…":"✨ AI Email"}
                      </button>
                      </div>
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
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"280px 1fr",gap:20}}>
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
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
              <h2 style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,letterSpacing:"-0.02em"}}>Analytics</h2>
              <button onClick={generateInsight} disabled={insightLoading}
                style={{padding:"10px 20px",borderRadius:10,border:"none",background:insightLoading?"#e5e7eb":"linear-gradient(135deg,#6d28d9,#7c3aed)",color:insightLoading?"#9ca3af":"#fff",fontSize:13,fontWeight:700,cursor:insightLoading?"wait":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 16px rgba(109,40,217,0.35)"}}>
                {insightLoading?<>⏳ Analyzing batch data…</>:<>✨ Generate AI Insight</>}
              </button>
            </div>

            {/* AI Insight Panel */}
            {aiInsight && (
              <div style={{background:"linear-gradient(135deg,#faf5ff,#ede9fe)",border:"1.5px solid #c4b5fd",borderRadius:14,padding:"20px 22px",marginBottom:20,animation:"fadeUp .4s ease",position:"relative"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div style={{width:32,height:32,background:"linear-gradient(135deg,#6d28d9,#7c3aed)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🤖</div>
                  <div style={{fontSize:14,fontWeight:700,color:"#4c1d95"}}>AI Batch Intelligence Report</div>
                  <button onClick={()=>setAiInsight(null)} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:"#9ca3af",fontSize:18,lineHeight:1}}>×</button>
                </div>
                <div style={{fontSize:13,color:"#374151",lineHeight:1.7}} dangerouslySetInnerHTML={{__html:aiInsight.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br/>")}}/>
              </div>
            )}

            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:20}}>

              {/* Branch breakdown — visual bar chart */}
              <div style={{background:"#fff",border:"1.5px solid #f3f4f6",borderRadius:14,padding:"20px 22px"}}>
                <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Progress by Branch</div>
                <div style={{fontSize:12,color:"#6b7280",marginBottom:20}}>Average onboarding completion per department</div>
                {/* Visual bar chart */}
                <div style={{display:"flex",alignItems:"flex-end",gap:12,height:140,marginBottom:12,padding:"0 4px"}}>
                  {["ECE","CSE","ME","CE","EEE"].map((branch,i)=>{
                    const branchStudents = STUDENTS_DB.filter(s=>s.branch===branch);
                    const avg = branchStudents.length ? Math.round(branchStudents.reduce((a,s)=>a+s.status,0)/branchStudents.length) : 0;
                    const colors = ["#16a34a","#2563eb","#7c3aed","#d97706","#dc2626"];
                    return (
                      <div key={branch} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                        <div style={{fontSize:11,fontWeight:700,color:colors[i]}}>{avg}%</div>
                        <div style={{width:"100%",height:Math.max(8,avg*1.2),background:colors[i],borderRadius:"6px 6px 0 0",transition:"height 1s ease",opacity:0.85}}/>
                        <div style={{fontSize:11,fontWeight:600,color:"#374151"}}>{branch}</div>
                        <div style={{fontSize:10,color:"#9ca3af"}}>{branchStudents.length}s</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{height:1,background:"#f3f4f6",marginBottom:12}}/>
                {["ECE","CSE","ME","CE","EEE"].map((branch)=>{
                  const branchStudents = STUDENTS_DB.filter(s=>s.branch===branch);
                  const avg = branchStudents.length ? Math.round(branchStudents.reduce((a,s)=>a+s.status,0)/branchStudents.length) : 0;
                  return (
                    <div key={branch} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                      <span style={{fontSize:11.5,fontWeight:600,color:"#374151",width:32}}>{branch}</span>
                      <div style={{flex:1,height:5,background:"#f3f4f6",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${avg}%`,background:clr(avg),borderRadius:3,transition:"width 1s ease"}}/>
                      </div>
                      <Badge v={avg>=80?"green":avg>=50?"amber":"red"}>{avg}%</Badge>
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
                  <div key={label} style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
                    <span style={{fontSize:20,width:28,textAlign:"center"}}>{icon}</span>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:13,fontWeight:600,color:"#374151"}}>{label}</span>
                        <span style={{fontSize:12,fontWeight:700,color:clr(pct)}}>{pct}%</span>
                      </div>
                      <div style={{height:8,background:"#f3f4f6",borderRadius:4,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${clr(pct)},${clr(pct)}aa)`,borderRadius:4,transition:"width 1s ease"}}/>
                      </div>
                      <div style={{fontSize:11,color:"#9ca3af",marginTop:3}}>{Math.round(STUDENTS_DB.length*pct/100)}/{STUDENTS_DB.length} students complete</div>
                    </div>
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
                      <button onClick={()=>generateEmailDraft(s)} disabled={emailLoading===s.id}
                        style={{padding:"6px 12px",borderRadius:8,border:"1.5px solid #ede9fe",
                          background:"#fff",color:"#6d28d9",fontSize:12,fontWeight:600,
                          cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                        {emailLoading===s.id?"Writing…":"✨ AI Email"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Email Draft Modal */}
            {emailDraft && (
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setEmailDraft(null)}>
                <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:600,maxHeight:"85vh",overflow:"auto",boxShadow:"0 24px 80px rgba(0,0,0,0.2)",animation:"fadeUp .3s ease"}} onClick={e=>e.stopPropagation()}>
                  <div style={{padding:"20px 22px",borderBottom:"1.5px solid #f3f4f6",display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:36,height:36,background:"linear-gradient(135deg,#6d28d9,#7c3aed)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>✨</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:15,fontWeight:700,color:"#111827"}}>AI-Generated Email Draft</div>
                      <div style={{fontSize:12,color:"#6b7280"}}>Personalized for this student's specific pending tasks</div>
                    </div>
                    <button onClick={()=>setEmailDraft(null)} style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af",fontSize:22,lineHeight:1}}>×</button>
                  </div>
                  <div style={{padding:"20px 22px"}}>
                    <div style={{marginBottom:12}}>
                      <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#9ca3af",marginBottom:4}}>To</div>
                      <div style={{fontSize:13,color:"#374151",background:"#f9fafb",padding:"8px 12px",borderRadius:8}}>{emailDraft.to}</div>
                    </div>
                    <div style={{marginBottom:12}}>
                      <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#9ca3af",marginBottom:4}}>Subject</div>
                      <div style={{fontSize:13,color:"#374151",background:"#f9fafb",padding:"8px 12px",borderRadius:8,fontWeight:600}}>{emailDraft.subject}</div>
                    </div>
                    <div style={{marginBottom:16}}>
                      <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#9ca3af",marginBottom:4}}>Body</div>
                      <textarea readOnly value={emailDraft.body} style={{width:"100%",height:240,padding:"12px",border:"1.5px solid #e5e7eb",borderRadius:10,fontSize:13,fontFamily:"inherit",color:"#374151",lineHeight:1.6,resize:"none",background:"#f9fafb"}}/>
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={()=>{showToast("Email sent successfully!","success");setEmailDraft(null);}} style={{flex:1,padding:"11px",borderRadius:10,border:"none",background:"#16a34a",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>📧 Send Email</button>
                      <button onClick={()=>{navigator.clipboard?.writeText(emailDraft.body);showToast("Copied to clipboard!","info");}} style={{padding:"11px 18px",borderRadius:10,border:"1.5px solid #e5e7eb",background:"#fff",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📋 Copy</button>
                      <button onClick={()=>setEmailDraft(null)} style={{padding:"11px 18px",borderRadius:10,border:"1.5px solid #e5e7eb",background:"#fff",color:"#6b7280",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Discard</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STUDENT DASHBOARD (preserved from previous version)
// ═════════════════════════════════════════════════════════════════════════════
function StudentDashboard({ onLogout, dark, setDark }) {
  const isMobile = useWindowWidth() < 768;
  const [page,setPage]           = useState("dashboard");
  const [mobileNav,setMobileNav] = useState(false);
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
  const [voiceSpeaking,setVoiceSpeaking] = useState(false);
  const synthRef = useRef(typeof window!=="undefined"?window.speechSynthesis:null);

  // Stop AI speech
  const stopSpeech = useCallback(()=>{
    if(synthRef.current){ synthRef.current.cancel(); }
    setVoiceSpeaking(false);
  },[]);

  // Speak AI reply aloud
  const speakReply = useCallback((text)=>{
    if(!synthRef.current) return;
    stopSpeech();
    const clean = text.replace(/\*\*(.*?)\*\*/g,"$1").replace(/•/g,"").replace(/\n/g," ");
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang  = "en-IN";
    utter.rate  = 1.05;
    utter.pitch = 1;
    const voices    = synthRef.current.getVoices();
    const preferred = voices.find(v=>v.lang.startsWith("en")&&v.name.toLowerCase().includes("female"))
                   || voices.find(v=>v.lang.startsWith("en-IN"))
                   || voices.find(v=>v.lang.startsWith("en"));
    if(preferred) utter.voice = preferred;
    utter.onstart = ()=>setVoiceSpeaking(true);
    utter.onend   = ()=>setVoiceSpeaking(false);
    utter.onerror = ()=>setVoiceSpeaking(false);
    synthRef.current.speak(utter);
  },[stopSpeech]);

  useEffect(()=>{if(msgsRef.current)msgsRef.current.scrollTop=msgsRef.current.scrollHeight;},[messages,aiLoading]);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3200)};

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

  const getMockReply = (text) => {
    const q = text.toLowerCase();
    const nl = "\n";
    const missing = docs.filter(d=>d.status==="missing");
    const compPending = compliance.filter(c=>!c.done);
    const compDoneCount = compliance.filter(c=>c.done).length;

    // Greetings
    if (q.match(/^(hi|hey|hello|good morning|good evening|sup|yo)\b/)) {
      const greetings = ["Hey Arjun! 👋","Hello, Arjun!","Hi there, Arjun! 😊"];
      const g = greetings[Math.floor(Math.random()*greetings.length)];
      return g + " I'm **EduBot**, your smart onboarding assistant.\n\nYour current progress is **" + overallPct + "%** — here's your snapshot:\n\n• 📄 Docs: " + verifiedCount + "/9 verified" + (missing.length?" ⚠️ "+missing.length+" pending":"")+"\n• 💳 Fees: ✅ Fully paid\n• 📚 Courses: " + credits + "/19 credits"+(confirmed?"":" — elective needed")+"\n• 🎯 Compliance: " + compDoneCount + "/5 modules done\n\nWhat can I help you with today?";
    }

    // Documents
    if (q.match(/doc|upload|certif|marksheet|aadhaar|transfer|affidavit|missing|pending|verif/)) {
      if (missing.length === 0) return "Great news, Arjun! ✅ **All 9 documents have been verified.** You're fully cleared on the documents front!\n\nYour Student ID card will be issued after final admin review. No further uploads needed.";
      return "Arjun, you have **" + missing.length + " document(s) still missing** — these need urgent attention:\n\n" +
        missing.map(d => "❗ **" + d.name + "**\n   → " + d.sub).join(nl+nl) + nl+nl +
        "⏰ **Deadline: Feb 20, 2026** (that's just 2 days away!)\n\n**How to upload:**\n1. Scroll to the Document Verification card\n2. Click **↑ Upload** next to each missing document\n3. Accepted formats: PDF, JPG, PNG (max 5MB)\n\n⚠️ Late submission may delay your Student ID card and library access. Don't wait!";
    }

    // Courses / electives
    if (q.match(/elective|course|credit|register|ec10[123]|signal|digital logic|microcontroll|timetable/)) {
      if (confirmed) return "🎉 You're all set, Arjun! Course registration is **complete — 19/19 credits** locked in.\n\nYour selected elective (**" + (elective?.name||"EC102") + "**) has been confirmed. You'll receive your timetable on the LMS portal by **Feb 27**.\n\nNext up: Complete your remaining **" + compPending.length + " compliance module(s)** before March 1!";
      return "For ECE B.Tech (2024-28), I'd strongly recommend:\n\n🏆 **EC102 — Digital Logic Design** (5 credits)\n_This is the smart pick, Arjun. Here's why:_\n\n• Directly feeds into VLSI, Embedded Systems, and Chip Design roles\n• High placement relevance — top companies like Intel, Texas Instruments, Qualcomm recruit for this\n• Prof. has a 4.7/5 student rating from previous batches\n• 28/40 seats filled — still comfortable space\n\nAlternatives:\n• **EC101** — Signals & Systems (good theory, 32/40 seats)\n• **EC103** — Microcontrollers (limited! 38/40 seats — almost full)\n\n⏰ Registration closes **Feb 23 at 11:59 PM** — you're currently at **14/19 credits**. Go to the Course Registration card and pick your elective now!";
    }

    // Orientation
    if (q.match(/orientat|feb.?28|auditorium|inaugur|welcome/)) {
      return "🎓 **Orientation Day — Feb 28, 2026**\n\n📍 Main Auditorium, SRM Campus\n⏰ 9:00 AM sharp (doors open 8:30 AM)\n\n**Schedule:**\n• 9:00 AM — Welcome address by Vice Chancellor\n• 10:00 AM — Department-wise breakout sessions\n• 11:30 AM — Library & LMS orientation\n• 12:30 PM — Meet your faculty mentor\n• 2:00 PM — Campus tour & cultural intro\n\n**Bring with you:**\n• Provisional admission letter\n• Any valid photo ID\n• Notepad (tips will be shared!)\n\nDress code is **smart casual / formal**. Don't be late, Arjun — first impressions matter! 😄";
    }

    // LMS / portal / account
    if (q.match(/lms|portal|login|activate|account|email|password|srmist\.edu/)) {
      return "Here's how to activate your **LMS & Institute Email**, Arjun:\n\n**Step 1 — LMS Portal**\n1. Visit **lms.srmist.edu.in**\n2. Click _First-time Login_\n3. Username: **24ECE047**\n4. Temporary password: your DOB (DDMMYYYY)\n5. Change password on first login\n\n**Step 2 — Institute Email**\n• Your email: **arjun.rathi@srm.edu.in**\n• Login via Google Workspace using institute credentials\n\n**Step 3 — Mobile App**\n• Download _SRM Academia_ from Play Store / App Store\n• Your timetable, attendance & grades will be here\n\n📞 Helpdesk: **helpdesk@srm.edu.in** · Ext. **1800** (Mon–Sat, 9AM–6PM)";
    }

    // Mentor
    if (q.match(/mentor|priya|menon|feb.?25|meeting|faculty|advisor|discuss|prepare|first meet/)) {
      return "Your faculty mentor is **Dr. Priya Menon** 👩‍🏫\n_Asst. Professor, ECE Dept · PhD, IIT Madras · 12 years experience_\n\n📅 **First Meeting: Feb 25, 2026 at 10:00 AM**\n📍 ECE Block, Room 312\n📧 priya.m@srm.edu.in\n\n**What to prepare for your first session:**\n• 2–3 academic goals for your first semester\n• Areas of interest (VLSI? Embedded? Communications?)\n• Any concerns about course load or hostel\n• Questions about research opportunities or internships\n\n**Pro tip from EduBot:** Mentors love students who come prepared. Write down 3 specific questions beforehand — it shows initiative and makes the session more productive! 💡\n\nNeed to reschedule? Email Dr. Menon at least 48 hours before.";
    }

    // Fees / payment
    if (q.match(/fee|payment|paid|receipt|money|rupee|₹|transaction|txn|refund/)) {
      return "Your fees are **fully cleared**, Arjun! ✅ Here's the complete breakdown:\n\n| Component | Amount | Date |\n|---|---|---|\n| Tuition Fee | ₹1,20,000 | Jan 8 |\n| Hostel Fee | ₹48,000 | Jan 8 |\n| Mess Deposit | ₹12,000 | Jan 8 |\n| Lab & Library | ₹8,500 | Jan 9 |\n\n💰 **Total Paid: ₹1,88,500**\n🔖 Reference: **TXN-2024-47891**\n\nYou can download your official receipt from the **Fee Payment section** → _Download Receipt_ button.\n\nNo additional payments are due for Semester 1. 🎉";
    }

    // Compliance modules
    if (q.match(/compliance|module|anti.?ragg|safety|integrity|conduct|code of|library module|campus safety/)) {
      if (compPending.length === 0) return "🏆 Amazing, Arjun! You've completed **all 5 compliance modules**. You're fully cleared on the compliance front!\n\nThis unlocks your **Final Admission Clearance** — great work!";
      return "You've done **" + compDoneCount + "/5** compliance modules so far. Here's what's left:\n\n" +
        compPending.map(c => "⏳ **" + c.label + "** — Due " + c.due).join(nl) + nl+nl +
        "**How to complete them:**\n1. Open the **Mentoring & Compliance** card below\n2. Click any module checkbox to mark it done\n3. Each module takes about 10–15 minutes\n\n⚠️ All modules must be finished by **March 1** to receive your final admission clearance. Don't leave these for the last minute, Arjun!";
    }

    // Hostel / mess
    if (q.match(/hostel|room|block a|mess|food|canteen|check.?in|warden|laundry/)) {
      return "Your hostel details, Arjun:\n\n🏠 **Block A, Room 214** (Allotted Jan 12)\n\n**Check-in:** Open anytime — bring your allotment letter + photo ID\n**Warden contact:** Block A Warden · warden.a@srm.edu.in\n\n**Mess Timings:**\n🌅 Breakfast: 7:00 – 9:00 AM\n☀️ Lunch: 12:00 – 2:00 PM\n🌙 Dinner: 7:00 – 9:00 PM\n\n**Facilities in Block A:** WiFi, laundry room (basement), study hall (ground floor), gym access (8AM–8PM)\n\n📧 Hostel queries: **hostel@srm.edu.in**\n🍽️ Mess issues: Speak to the Mess Manager directly (Mess Hall, Ground Floor)";
    }

    // Classes / start date
    if (q.match(/class|start|march.?3|mar.?3|begin|semester|first day/)) {
      const remaining = [];
      if (missing.length > 0) remaining.push("Upload " + missing.length + " document(s) by Feb 20");
      if (!confirmed) remaining.push("Complete course registration by Feb 23");
      remaining.push("Attend Orientation on Feb 28");
      if (compPending.length > 0) remaining.push("Finish " + compPending.length + " compliance module(s) by Mar 1");
      return "🎓 **Classes begin March 3, 2026!**\n\nYou're " + overallPct + "% ready. Here's your final checklist before Day 1:\n\n" +
        remaining.map((r,i)=>`${i+1}. ${r}`).join(nl) + nl+nl +
        "Your timetable will be live on the LMS by **Feb 27**. Make sure you install the _SRM Academia_ app before then!\n\n" +
        (remaining.length <= 1 ? "You're almost there, Arjun — just the finishing touches! 🚀" : "Stay on top of these and you'll start March 3 with zero stress! 💪");
    }

    // Progress / status / summary
    if (q.match(/progress|status|summary|overview|how am i|where am i|complete|percent|percent/)) {
      return "Here's your full onboarding status, Arjun:\n\n📊 **Overall: " + overallPct + "% complete**\n\n" +
        "📄 **Documents:** " + verifiedCount + "/9 verified" + (missing.length ? " ⚠️ " + missing.length + " missing (due Feb 20)" : " ✅") + "\n" +
        "💳 **Fees:** ₹1,88,500 paid ✅\n" +
        "📚 **Courses:** " + credits + "/19 credits" + (confirmed ? " ✅" : " ⏳ — pick elective by Feb 23") + "\n" +
        "🎯 **Compliance:** " + compDoneCount + "/5 modules" + (compDoneCount===5 ? " ✅" : " ⏳ — " + compPending.length + " pending by Mar 1") + "\n\n" +
        "**Your next 3 actions:**\n" +
        (missing.length ? "1. Upload Transfer Certificate & Anti-Ragging Affidavit\n" : "") +
        (!confirmed ? (missing.length?"2":"1") + ". Register your elective (EC102 recommended)\n" : "") +
        (compPending.length ? (missing.length&&!confirmed?"3":missing.length||!confirmed?"2":"1") + ". Complete compliance modules\n" : "") +
        "\nYou're doing well — keep pushing, Arjun! 🙌";
    }

    // Contacts / helpdesk
    if (q.match(/contact|helpdesk|registrar|support|phone|email|ext|number|reach|call/)) {
      return "📞 **Key Contacts at SRM**, Arjun:\n\n• **Helpdesk:** helpdesk@srm.edu.in · Ext. **1800**\n• **Registrar's Office:** registrar@srm.edu.in · Ext. **1200**\n• **Hostel Office:** hostel@srm.edu.in · Ext. **1500**\n• **Mentor:** priya.m@srm.edu.in\n• **Library:** library@srm.edu.in\n\n🕒 Office hours: **Mon–Sat, 9AM–5PM**\n\nFor urgent issues, the helpdesk responds within **24 hours** on weekdays. You can also walk into the Admin Block (Ground Floor) between 10AM–4PM.";
    }

    // What to do next / priority
    if (q.match(/what.*do|next|priority|urgent|important|first|todo|action|should i/)) {
      if (missing.length > 0) return "🚨 **Top priority right now: Upload your missing documents!**\n\nYou have **" + missing.length + " doc(s)** due in just **2 days (Feb 20)**:\n" +
        missing.map(d=>"• "+d.name).join(nl) + "\n\nAfter that:\n2. Pick your elective → confirm courses by Feb 23\n3. Finish compliance modules before Mar 1\n4. Attend Orientation on Feb 28\n\nDon't delay the docs, Arjun — that's the most time-sensitive item!";
      if (!confirmed) return "📋 **Your next priority: Complete course registration!**\n\nYou're at **14/19 credits** — just need to pick one elective. I recommend **EC102 (Digital Logic Design)**.\n\n⏰ Deadline: **Feb 23 at 11:59 PM**\n\nAfter that, knock out your **" + compPending.length + " compliance modules** (due Mar 1) and you'll be fully onboarded! 🎉";
      return "You're in great shape, Arjun! 🌟\n\nFocus areas:\n1. Complete **" + compPending.length + " compliance module(s)** — due Mar 1\n2. Attend **Orientation** on Feb 28 at 9AM\n3. Check your **timetable** on LMS after Feb 27\n\nClasses begin March 3 — you're nearly ready! 🚀";
    }

    // Fallback — intelligent context-aware default
    const fallbacks = [
      "Hmm, I want to make sure I give you the right info, Arjun! I'm best at helping with:\n\n• 📄 **Documents** — pending uploads & deadlines\n• 📚 **Courses** — elective selection & registration\n• 🎯 **Compliance** — module completion\n• 🏠 **Hostel** — room & mess info\n• 📅 **Key dates** — orientation, classes, mentor meeting\n• 🔐 **LMS** — portal activation\n\nCould you rephrase your question? I'm here to help!",
      "I want to help, Arjun! Based on your current status (**" + overallPct + "% complete**), the most important things right now are:\n\n" + (missing.length?"• Upload "+missing.length+" pending document(s) by Feb 20\n":"") + (!confirmed?"• Register your elective by Feb 23\n":"") + (compPending.length?"• Complete "+compPending.length+" compliance module(s) by Mar 1\n":"") + "\nAsk me specifically about any of these — I've got all the details!",
      "Great question! I may need a bit more context to give you the best answer. Try asking me things like:\n\n_\"What documents are still pending?\"_\n_\"Which elective should I pick for ECE?\"_\n_\"What happens at orientation?\"_\n_\"How do I activate my LMS account?\"_\n\nI'm powered by Visored's knowledge base and know everything about your specific onboarding journey! 🤖"
    ];
    return fallbacks[Math.floor(Math.random()*fallbacks.length)];
  };

  // Simulate realistic streaming: show response word by word, then speak
  const streamReply = useCallback((reply) => {
    const words = reply.split(" ");
    let i = 0;
    setMessages(prev => [...prev, {role:"assistant", content:""}]);
    const interval = setInterval(() => {
      i++;
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length-1] = {role:"assistant", content: words.slice(0,i).join(" ")};
        return updated;
      });
      if (i >= words.length) {
        clearInterval(interval);
        setAiLoad(false);
        speakReply(reply);
      }
    }, 28);
  }, [speakReply]);

  const sendChat=useCallback(async(e,prefill)=>{
    if(e)e.preventDefault();
    const text=prefill||inputVal.trim();
    if(!text||aiLoading)return;
    setInput("");
    setMessages(prev=>[...prev,{role:"user",content:text}]);
    setAiLoad(true);
    if(!chatOpen)setChatOpen(true);
    // Simulate thinking delay (800–1400ms)
    await new Promise(r=>setTimeout(r,800+Math.random()*600));
    const reply = getMockReply(text);
    streamReply(reply);
  },[inputVal,messages,aiLoading,chatOpen,docs,compliance,confirmed,credits,overallPct,streamReply]);


  const quickAsk=q=>{setInput(q);setTimeout(()=>sendChat(null,q),60);};
  const md=text=><span dangerouslySetInnerHTML={{__html:text.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br/>")}}/>;

  const STAGES=[
    {id:"docs",   emoji:"📄",label:"Document Verification",  sub:`${verifiedCount}/9 verified`,       pct:Math.round(verifiedCount/9*100), v:verifiedCount<9?"amber":"green"},
    {id:"fee",    emoji:"💳",label:"Fee Payment",            sub:"₹1,88,500 paid · Complete",          pct:100,                             v:"green"},
    {id:"courses",emoji:"📚",label:"Course Registration",    sub:confirmed?"19/19 credits done":`${credits}/19 credits · pick elective`, pct:Math.round(credits/19*100), v:confirmed?"green":"amber"},
    {id:"mentor", emoji:"🎯",label:"Mentoring & Compliance", sub:`${compDone}/5 modules complete`,    pct:Math.round(compDone/5*100),       v:compDone===5?"green":"blue"},
  ];

  // Dark mode palette
  const dm     = dark;
  const bg     = dm ? "#0f172a" : "#f9fafb";
  const surf   = dm ? "#1e293b" : "#ffffff";
  const bdr    = dm ? "#334155" : "#f3f4f6";
  const tx1    = dm ? "#f1f5f9" : "#111827";
  const tx2    = dm ? "#94a3b8" : "#6b7280";
  const tx3    = dm ? "#64748b" : "#9ca3af";

  return (
    <div style={{fontFamily:"'Sora',system-ui,sans-serif",background:bg,minHeight:"100vh",color:tx1,width:"100%",transition:"background .35s,color .35s"}}>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}

      {/* Topbar */}
      <header style={{background:surf,borderBottom:`1.5px solid ${bdr}`,display:"flex",alignItems:"center",padding:"0 16px",position:"sticky",top:0,zIndex:100,height:58,gap:8,transition:"background .35s,border-color .35s"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginRight:32}}>
          <div style={{width:30,height:30,background:"linear-gradient(135deg,#16a34a,#15803d)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🎓</div>
          <span style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:900,color:tx1,letterSpacing:"-0.03em"}}>Visored</span>
        </div>
        {!isMobile && (
          <nav style={{display:"flex",gap:2}}>
            {[["dashboard","Dashboard"],["timeline","Timeline"],["roadmap","🗺 Roadmap"],["notifications","Alerts"]].map(([id,label])=>(
              <button key={id} onClick={()=>setPage(id)}
                style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:page===id?600:400,background:page===id?"#f0fdf4":"transparent",color:page===id?"#16a34a":tx2,transition:"all .15s",position:"relative"}}>
                {label}
                {id==="notifications"&&unread>0&&<span style={{position:"absolute",top:2,right:4,width:14,height:14,background:"#ef4444",borderRadius:"50%",fontSize:9,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{unread}</span>}
              </button>
            ))}
          </nav>
        )}
        {isMobile && (
          <button onClick={()=>setMobileNav(!mobileNav)} style={{marginLeft:"auto",background:"none",border:"none",fontSize:24,cursor:"pointer",color:tx2,padding:"4px 8px",lineHeight:1}}>☰</button>
        )}
        {!isMobile && <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:12}}>
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
              <div style={{fontSize:12.5,fontWeight:600,color:tx1,lineHeight:1.2}}>Arjun Rathi</div>
              <div style={{fontSize:10.5,color:tx3}}>24ECE047</div>
            </div>
          </div>
          {/* Dark mode toggle */}
          <button onClick={()=>setDark(d=>!d)} title={dark?"Light mode":"Dark mode"}
            style={{width:36,height:36,borderRadius:10,border:`1.5px solid ${bdr}`,background:surf,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,transition:"all .2s",flexShrink:0}}>
            {dark?"☀️":"🌙"}
          </button>
          <button onClick={onLogout}
            style={{padding:"7px 14px",borderRadius:9,border:`1.5px solid ${bdr}`,background:surf,
              color:tx2,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#dc2626";e.currentTarget.style.color="#dc2626";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=bdr;e.currentTarget.style.color=tx2;}}>
            Sign out
          </button>
        </div>}
      </header>

      {/* ROADMAP PAGE */}
      {page==="roadmap"&&(
        <div style={{maxWidth:700,margin:"0 auto",padding:isMobile?"16px 14px 80px":"36px 24px"}}>
          <div style={{marginBottom:28}}>
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,letterSpacing:"-0.02em",marginBottom:6}}>Your Onboarding Quest 🗺️</h2>
            <p style={{fontSize:13,color:"#6b7280"}}>Complete all stages before classes begin on March 3</p>
          </div>
          {/* Quest map visual */}
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {[
              {id:"docs",   emoji:"📄",title:"Document Verification",  desc:"Upload all required certificates and affidavits",     pct:Math.round(verifiedCount/9*100),  done:verifiedCount===9, urgent:docs.filter(d=>d.status==="missing").length>0, reward:"Student ID Card unlocked",  step:1},
              {id:"fee",    emoji:"💳",title:"Fee Payment",            desc:"Tuition, hostel, mess & lab fees cleared",             pct:100,                               done:true,               urgent:false,                                             reward:"Hostel room allotted",      step:2},
              {id:"courses",emoji:"📚",title:"Course Registration",    desc:"Select your elective and lock in 19 credits",          pct:Math.round(credits/19*100),        done:confirmed,          urgent:!confirmed,                                        reward:"Timetable released",        step:3},
              {id:"mentor", emoji:"🎯",title:"Mentoring & Compliance", desc:"Meet Dr. Priya Menon & finish 5 compliance modules",   pct:Math.round(compDone/5*100),        done:compDone===5,       urgent:false,                                             reward:"Final clearance granted",   step:4},
              {id:"ready",  emoji:"🎓",title:"Classes Begin!",         desc:"You're fully onboarded — welcome to SRM!",             pct:overallPct===100?100:0,            done:overallPct===100,   urgent:false,                                             reward:"Academic journey starts",   step:5},
            ].map((q,i,arr)=>{
              const isActive = !q.done && (i===0 || arr[i-1].done);
              const isLocked = !q.done && i>0 && !arr[i-1].done;
              const bc = q.done?"#16a34a":isActive?q.urgent?"#ef4444":"#f59e0b":"#e5e7eb";
              const bg = q.done?"#f0fdf4":isActive?q.urgent?"#fef2f2":"#fffbeb":"#f9fafb";
              return (
                <div key={q.id} style={{display:"flex",gap:0,position:"relative"}}>
                  {/* Connector line */}
                  {i<arr.length-1&&<div style={{position:"absolute",left:27,top:58,bottom:-2,width:3,background:q.done?"#16a34a":"#e5e7eb",zIndex:0,borderRadius:2}}/>}
                  <div style={{display:"flex",gap:16,flex:1,paddingBottom:i<arr.length-1?24:0,position:"relative",zIndex:1}}>
                    {/* Step circle */}
                    <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center"}}>
                      <div style={{width:56,height:56,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,background:bg,border:`3px solid ${bc}`,boxShadow:isActive?`0 0 0 5px ${bc}22`:q.done?"0 0 0 4px #16a34a22":"none",transition:"all .3s"}}>
                        {q.done?"✅":isLocked?"🔒":q.emoji}
                      </div>
                    </div>
                    {/* Card */}
                    <div style={{flex:1,background:"#fff",border:`1.5px solid ${isActive?bc:"#f3f4f6"}`,borderRadius:14,padding:"16px 18px",marginBottom:0,boxShadow:isActive?"0 4px 20px rgba(0,0,0,0.07)":"none",transition:"all .3s",opacity:isLocked?0.55:1}}>
                      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:8}}>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                            <span style={{fontSize:10.5,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:bc}}>Stage {q.step}</span>
                            {isActive&&<Badge v={q.urgent?"red":"amber"}>{q.urgent?"Urgent":"Active"}</Badge>}
                            {q.done&&<Badge v="green">✓ Complete</Badge>}
                            {isLocked&&<Badge v="neutral">🔒 Locked</Badge>}
                          </div>
                          <div style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:3}}>{q.title}</div>
                          <div style={{fontSize:12.5,color:"#6b7280"}}>{q.desc}</div>
                        </div>
                        {!isLocked&&<div style={{position:"relative",flexShrink:0}}>
                          <ProgressRing pct={q.pct} size={52} stroke={4.5} color={bc}/>
                          <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:bc}}>{q.pct}%</span>
                        </div>}
                      </div>
                      {/* Progress bar */}
                      {!isLocked&&<div style={{height:5,background:"#f3f4f6",borderRadius:3,overflow:"hidden",marginBottom:10}}>
                        <div style={{height:"100%",width:`${q.pct}%`,background:bc,borderRadius:3,transition:"width 1s ease"}}/>
                      </div>}
                      {/* Reward */}
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div style={{fontSize:11.5,color:q.done?"#16a34a":"#9ca3af",display:"flex",alignItems:"center",gap:5}}>
                          <span>{q.done?"🏆":"🎁"}</span>
                          <span style={{fontWeight:q.done?600:400}}>{q.reward}</span>
                        </div>
                        {isActive&&<button onClick={()=>{setPage("dashboard");setActive(q.id);}} style={{padding:"5px 14px",borderRadius:8,border:"none",background:bc,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Go →</button>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Peer comparison */}
          <div style={{marginTop:24,background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",border:"1.5px solid #86efac",borderRadius:14,padding:"18px 20px"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#15803d",marginBottom:10}}>📊 How You Compare (Anonymous)</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              {[["Your Progress",`${overallPct}%`,"#16a34a"],["Batch Average","58%","#6b7280"],["Top 25% of Batch","74%+","#7c3aed"]].map(([l,v,c])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:700,color:c}}>{v}</div>
                  <div style={{fontSize:11,color:"#6b7280",marginTop:3}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:12,height:6,background:"rgba(255,255,255,0.5)",borderRadius:3,overflow:"hidden",position:"relative"}}>
              <div style={{position:"absolute",height:"100%",width:"58%",background:"#9ca3af",borderRadius:3}}/>
              <div style={{position:"absolute",height:"100%",width:`${overallPct}%`,background:"#16a34a",borderRadius:3}}/>
              <div style={{position:"absolute",height:"100%",left:"74%",width:2,background:"#7c3aed",borderRadius:1}}/>
            </div>
            <div style={{fontSize:12,color:"#15803d",marginTop:8,fontWeight:500}}>
              {overallPct>=74?"🏆 You're in the top 25% of your batch! Keep going!":overallPct>=58?"👍 You're above the batch average — just 3 more tasks!":"💪 You're close to the batch average — complete your pending docs to catch up!"}
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS PAGE */}
      {page==="notifications"&&(
        <div style={{maxWidth:680,margin:"0 auto",padding:isMobile?"16px 14px 80px":"36px 24px"}}>
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
        <div style={{maxWidth:560,margin:"0 auto",padding:isMobile?"16px 14px 80px":"36px 24px"}}>
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
        <div style={{display:"flex",minHeight:"calc(100vh - 58px)"}}>
          {/* Mobile sidebar overlay */}
          {isMobile && mobileNav && (
            <div onClick={()=>setMobileNav(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:298}}/>
          )}
          {/* Sidebar */}
          <aside style={{background:surf,borderRight:`1.5px solid ${bdr}`,padding:"22px 0",overflowY:"auto",flexShrink:0,transition:"background .35s,border-color .35s",
            ...(isMobile ? {
              position:"fixed",top:0,left:mobileNav?0:"-300px",width:280,height:"100vh",zIndex:299,
              transition:"left .25s cubic-bezier(.4,0,.2,1)",boxShadow:mobileNav?"4px 0 24px rgba(0,0,0,0.15)":"none"
            } : {
              width:264,position:"sticky",top:58,height:"calc(100vh - 58px)"
            })}}>
            {isMobile && (
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px 4px"}}>
                <span style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:"#111827"}}>Menu</span>
                <button onClick={()=>setMobileNav(false)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#6b7280",lineHeight:1}}>×</button>
              </div>
            )}
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
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:tx3,marginBottom:10,padding:"0 2px"}}>Next Deadline</div>
              <div style={{background:dm?"#1e293b":"#fef3c7",border:`1.5px solid rgba(217,119,6,0.25)`,borderRadius:12,padding:"14px"}}>
                <div style={{fontSize:12,fontWeight:600,color:"#92400e",marginBottom:8}}>{confirmed?"Document Upload":"Course Registration"}</div>
                <Countdown targetDate={confirmed?"2026-02-20T23:59:00":"2026-02-23T23:59:00"} />
                <div style={{fontSize:11,color:tx3,marginTop:8}}>{confirmed?"Feb 20, 2026 · 11:59 PM":"Feb 23, 2026 · 11:59 PM"}</div>
              </div>
            </div>

            {isMobile && (
              <div style={{padding:"16px"}}>
                <button onClick={onLogout} style={{width:"100%",padding:"11px",borderRadius:10,border:"1.5px solid #fee2e2",background:"#fff",color:"#dc2626",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🚪 Sign out</button>
              </div>
            )}
            <div style={{padding:"0 16px"}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9ca3af",marginBottom:10,padding:"0 2px"}}>Ask EduBot</div>
              {["What's my next priority?","Pending documents?","Best elective for ECE?","How to activate LMS?","What happens at orientation?"].map(q=>(
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
          <main style={{flex:1,padding:isMobile?"16px 14px 80px":"28px 32px",overflowY:"auto",minWidth:0}}>
            <div style={{marginBottom:22,animation:"fadeUp .5s ease"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16}}>
                <div>
                  <h1 style={{fontFamily:"'Fraunces',serif",fontSize:isMobile?22:28,fontWeight:700,letterSpacing:"-0.025em",color:"#111827",lineHeight:1.2,marginBottom:5}}>
                    Good morning, <span style={{color:"#16a34a",fontStyle:"italic"}}>Arjun.</span>
                  </h1>
                  <p style={{fontSize:13.5,color:"#6b7280"}}>{overallPct<100?`You're ${overallPct}% through — ${4-STAGES.filter(s=>s.pct===100).length} stage(s) left before Mar 3.`:"🎉 All complete! Classes start Mar 3."}</p>
                </div>
                {!isMobile && <div style={{display:"flex",gap:8,flexShrink:0}}>
                  <button onClick={()=>setPage("timeline")} style={{padding:"8px 16px",borderRadius:10,border:"1.5px solid #e5e7eb",background:"#fff",color:"#374151",fontSize:12.5,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📅 Timeline</button>
                  <button onClick={()=>setChatOpen(true)} style={{padding:"8px 16px",borderRadius:10,border:"none",background:"#16a34a",color:"#fff",fontSize:12.5,fontWeight:600,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 2px 8px rgba(22,163,74,0.3)"}}>💬 Ask EduBot</button>
                </div>}
              </div>
            </div>

            {/* Stat row — animated counters */}
            <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:10,marginBottom:16,animation:"fadeUp .5s .06s ease both"}}>
              {[
                [verifiedCount, "Docs Verified",  verifiedCount===9?"#f0fdf4":"#fefce8", verifiedCount===9?"#16a34a":"#d97706", "/9"],
                [188500,        "Fees Paid",       "#f0fdf4",                             "#16a34a",                             "₹", ""],
                [credits,       "Credits",         confirmed?"#f0fdf4":"#fefce8",         confirmed?"#16a34a":"#d97706",         "", "/19 cr"],
                [compDone,      "Compliance",      dm?"#1e3a5f":"#eff6ff",                "#2563eb",                             "", "/5"],
              ].map(([val,label,cardBg,col,pfx,sfx],i)=>(
                <div key={label} style={{background:dm?"#1e293b":cardBg,border:`1.5px solid ${col}22`,borderRadius:12,padding:"14px 16px",transition:"transform .15s,background .35s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:700,color:col,lineHeight:1}}>
                    {pfx==="₹"
                      ? <span>₹<AnimatedNumber value={val} duration={1100}/></span>
                      : <span><AnimatedNumber value={val} duration={800}/>{sfx}</span>
                    }
                  </div>
                  <div style={{fontSize:11.5,color:tx2,marginTop:5,fontWeight:500}}>{label}</div>
                </div>
              ))}
            </div>

            {/* Alert */}
            {docs.filter(d=>d.status==="missing").length>0&&(
              <div style={{background:dm?"#3b1a00":"#fffbeb",border:"1.5px solid #fcd34d",borderRadius:12,padding:"12px 16px",display:"flex",gap:12,alignItems:"flex-start",marginBottom:20,animation:"fadeUp .5s .1s ease both"}}>
                <span style={{fontSize:18,flexShrink:0,marginTop:1}}>⚠️</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#92400e",marginBottom:2}}>{docs.filter(d=>d.status==="missing").length} document(s) must be uploaded by Feb 20</div>
                  <div style={{fontSize:12,color:dm?"#d97706":"#78716c"}}>{docs.filter(d=>d.status==="missing").map(d=>d.name).join(" · ")} — failure to submit may delay your Student ID card.</div>
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
                  <div key={stage.id} style={{background:surf,border:`1.5px solid ${open?"#86efac":bdr}`,borderRadius:14,overflow:"hidden",boxShadow:open?"0 0 0 3px rgba(22,163,74,0.1),0 4px 16px rgba(0,0,0,.06)":"0 1px 4px rgba(0,0,0,.04)",transition:"box-shadow .25s,border-color .25s,background .35s",animation:`fadeUp .5s ${.14+idx*.06}s both`}}>
                    <div onClick={()=>setActive(open?null:stage.id)} style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",transition:"background .15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=dm?"rgba(255,255,255,.03)":"#fafafa"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div style={{width:42,height:42,borderRadius:12,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,background:stage.v==="green"?"#f0fdf4":stage.v==="amber"?"#fffbeb":stage.v==="blue"?"#eff6ff":"#f1f5f9",transition:"transform .2s"}}>{stage.emoji}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14.5,fontWeight:700,color:tx1,marginBottom:3}}>{stage.label}</div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{width:100,height:4,background:"#f3f4f6",borderRadius:2,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${stage.pct}%`,background:bc,borderRadius:2,transition:"width 1s cubic-bezier(.34,1.1,.64,1)",animation:"barFill 1s cubic-bezier(.34,1.1,.64,1)"}}/>
                          </div>
                          <span style={{fontSize:11.5,color:tx3,fontWeight:600}}>{stage.pct}%</span>
                          <span style={{fontSize:12,color:tx2}}>· {stage.sub}</span>
                        </div>
                      </div>
                      <Badge v={stage.v==="green"?"green":stage.v==="amber"?"amber":stage.v==="blue"?"blue":"neutral"}>
                        {stage.pct===100?"✓ Complete":stage.id==="docs"?"Action needed":stage.id==="courses"?"6 days left":"In progress"}
                      </Badge>
                      <span style={{color:tx3,fontSize:18,marginLeft:4,display:"inline-block",transform:`rotate(${open?90:0}deg)`,transition:"transform .28s cubic-bezier(.34,1.56,.64,1)"}}>›</span>
                    </div>

                    {open&&<div style={{borderTop:`1.5px solid ${bdr}`,padding:"20px 20px",animation:"fadeUp .28s both"}}>
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
                        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr",gap:10,marginBottom:18}}>
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

      {/* Mobile Bottom Nav */}
      {isMobile && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1.5px solid #f3f4f6",zIndex:400,display:"flex",height:60}}>
          {[["dashboard","🏠","Home"],["timeline","📅","Timeline"],["roadmap","🗺","Roadmap"],["notifications","🔔","Alerts"]].map(([id,icon,label])=>(
            <button key={id} onClick={()=>{setPage(id);setMobileNav(false);}}
              style={{flex:1,border:"none",background:page===id?"#f0fdf4":"#fff",color:page===id?"#16a34a":"#6b7280",cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,fontSize:10,fontWeight:page===id?700:500,position:"relative",borderTop:page===id?"2px solid #16a34a":"2px solid transparent"}}>
              <span style={{fontSize:19}}>{icon}</span>{label}
              {id==="notifications"&&unread>0&&<span style={{position:"absolute",top:6,left:"calc(50% + 6px)",width:14,height:14,background:"#ef4444",borderRadius:"50%",fontSize:9,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{unread}</span>}
            </button>
          ))}
          <button onClick={()=>{setChatOpen(true);}} style={{flex:1,border:"none",background:"#fff",color:"#6b7280",cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,fontSize:10,fontWeight:500,borderTop:"2px solid transparent"}}>
            <span style={{fontSize:19}}>💬</span>EduBot
          </button>
          <button onClick={onLogout} style={{flex:1,border:"none",background:"#fff",color:"#dc2626",cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,fontSize:10,fontWeight:500,borderTop:"2px solid transparent"}}>
            <span style={{fontSize:19}}>🚪</span>Logout
          </button>
        </div>
      )}

      {/* Floating Chat */}
      <div style={{position:"fixed",bottom:isMobile?74:24,right:16,zIndex:500}}>
        <div style={{position:"absolute",bottom:66,right:0,width:isMobile?"calc(100vw - 32px)":368,background:"#fff",border:"1.5px solid #f3f4f6",borderRadius:22,boxShadow:"0 24px 64px rgba(0,0,0,0.14)",display:"flex",flexDirection:"column",maxHeight:isMobile?"75vh":540,overflow:"hidden",opacity:chatOpen?1:0,pointerEvents:chatOpen?"all":"none",transform:chatOpen?"translateY(0) scale(1)":"translateY(20px) scale(0.94)",transition:"opacity .28s cubic-bezier(.4,0,.2,1), transform .28s cubic-bezier(.34,1.2,.64,1)"}}>
          <div style={{padding:"14px 16px",borderBottom:"1.5px solid #f9fafb",display:"flex",alignItems:"center",gap:10,flexShrink:0,background:"linear-gradient(135deg,#f0fdf4,#dcfce7)"}}>
            <div style={{width:38,height:38,background:"#111827",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,position:"relative"}}>
              🤖<div style={{position:"absolute",bottom:0,right:0,width:11,height:11,background:"#16a34a",borderRadius:"50%",border:"2.5px solid #f0fdf4"}}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:14.5,fontWeight:700,color:"#111827"}}>EduBot AI</div>
              <div style={{fontSize:11,color:voiceSpeaking?"#7c3aed":"#16a34a",display:"flex",alignItems:"center",gap:5,fontWeight:500,transition:"color .3s"}}>
                <span style={{width:5,height:5,background:voiceSpeaking?"#7c3aed":"#16a34a",borderRadius:"50%",display:"inline-block",animation:voiceSpeaking?"voicePulse 1s ease-in-out infinite":"none"}}/>
                {voiceSpeaking ? "🔊 Speaking…" : "Powered by Claude · Always available"}
              </div>
            </div>
            <button onClick={()=>setChatOpen(false)} style={{background:"#fff",border:"1.5px solid #e5e7eb",width:30,height:30,borderRadius:"50%",cursor:"pointer",color:"#6b7280",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,transition:"background .15s,color .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="#f3f4f6";e.currentTarget.style.color="#111827";}}
              onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color="#6b7280";}}>×</button>
          </div>
          <div ref={msgsRef} style={{flex:1,overflowY:"auto",padding:"14px 14px 8px",display:"flex",flexDirection:"column",gap:10}}>
            {messages.map((msg,i)=>(
              <div key={i} style={{display:"flex",gap:8,flexDirection:msg.role==="user"?"row-reverse":"row",animation:"msgIn .3s cubic-bezier(.34,1.2,.64,1) both"}}>
                <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:msg.role==="user"?11:14,fontWeight:700,marginTop:2,background:msg.role==="user"?"#16a34a":"#111827",color:"#fff"}}>{msg.role==="user"?"AR":"🤖"}</div>
                <div style={{maxWidth:246}}>
                  <div style={{padding:"10px 13px",borderRadius:14,fontSize:13,lineHeight:1.5,borderBottomLeftRadius:msg.role==="assistant"?4:14,borderBottomRightRadius:msg.role==="user"?4:14,background:msg.role==="user"?"#111827":"#f9fafb",color:msg.role==="user"?"#fff":"#374151",border:msg.role==="assistant"?"1.5px solid #f3f4f6":"none"}}>{md(msg.content)}</div>
                </div>
              </div>
            ))}
            {aiLoading&&<div style={{display:"flex",gap:8,animation:"msgIn .3s both"}}><div style={{width:28,height:28,background:"#111827",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div><div style={{display:"flex",alignItems:"center",gap:4,padding:"12px 14px",background:"#f9fafb",border:"1.5px solid #f3f4f6",borderRadius:14,borderBottomLeftRadius:4}}>{[0,.16,.32].map((d,i)=><div key={i} style={{width:6,height:6,background:"#9ca3af",borderRadius:"50%",animation:`bounce 1s ${d}s ease-in-out infinite`}}/>)}</div></div>}
          </div>
          <div style={{padding:"4px 12px 6px",display:"flex",flexWrap:"wrap",gap:5,flexShrink:0}}>
            {["What's my status?","Pending docs?","Best elective?","How to activate LMS?"].map(q=>(
              <button key={q} onClick={()=>quickAsk(q)} style={{fontSize:11,padding:"5px 11px",borderRadius:20,border:"1.5px solid #f3f4f6",background:"#fff",cursor:"pointer",color:"#6b7280",fontFamily:"inherit",transition:"all .18s cubic-bezier(.34,1.56,.64,1)",whiteSpace:"nowrap"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#16a34a";e.currentTarget.style.color="#16a34a";e.currentTarget.style.background="#f0fdf4";e.currentTarget.style.transform="scale(1.04)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#f3f4f6";e.currentTarget.style.color="#6b7280";e.currentTarget.style.background="#fff";e.currentTarget.style.transform="scale(1)";}}>{q}</button>
            ))}
          </div>
          <div style={{padding:"8px 12px 14px",flexShrink:0}}>
            <form onSubmit={sendChat} style={{display:"flex",gap:8,alignItems:"flex-end",border:"1.5px solid #e5e7eb",borderRadius:13,padding:"8px 10px",background:"#fff",transition:"border-color .18s,box-shadow .18s"}}
              onFocusCapture={e=>{ e.currentTarget.style.borderColor="#16a34a"; e.currentTarget.style.boxShadow="0 0 0 3px rgba(22,163,74,.1)"; }}
              onBlurCapture={e=>{ e.currentTarget.style.borderColor="#e5e7eb"; e.currentTarget.style.boxShadow="none"; }}>
              <textarea value={inputVal} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat(e);}}} placeholder="Ask anything about your onboarding…" rows={1} style={{flex:1,border:"none",outline:"none",resize:"none",fontFamily:"inherit",fontSize:13,color:"#111827",background:"transparent",maxHeight:72,lineHeight:1.4}}/>
              {voiceSpeaking && (
                <button type="button" onClick={stopSpeech} title="Stop speaking"
                  style={{width:34,height:34,borderRadius:10,border:"none",flexShrink:0,background:"#7c3aed",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,transition:"background .2s,transform .15s cubic-bezier(.34,1.56,.64,1)",boxShadow:"0 0 0 3px rgba(124,58,237,0.2)",animation:"voicePulse 1.2s ease-in-out infinite"}}>⏹</button>
              )}
              <button type="submit" disabled={aiLoading||!inputVal.trim()} style={{width:34,height:34,borderRadius:10,border:"none",flexShrink:0,background:aiLoading||!inputVal.trim()?"#f3f4f6":"#16a34a",color:aiLoading||!inputVal.trim()?"#9ca3af":"#fff",cursor:aiLoading||!inputVal.trim()?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,transition:"background .2s,transform .15s cubic-bezier(.34,1.56,.64,1)"}}>›</button>
            </form>
            <div style={{textAlign:"center",fontSize:10,color:"#d1d5db",marginTop:6}}>Visored EduBot · Powered by Claude AI</div>
          </div>
        </div>
        <button onClick={()=>setChatOpen(!chatOpen)} style={{width:54,height:54,background:chatOpen?"#374151":"#16a34a",borderRadius:"50%",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:chatOpen?"0 4px 16px rgba(0,0,0,.25)":"0 6px 24px rgba(22,163,74,0.45)",fontSize:chatOpen?22:20,color:"#fff",transition:"background .22s, box-shadow .22s, transform .22s cubic-bezier(.34,1.56,.64,1)"}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
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
  const [session, setSession] = useState(null);
  const [booting, setBooting] = useState(false);
  const [dark, setDark] = useState(false);

  const handleLogin = (role) => {
    setBooting(true);
    setTimeout(() => { setBooting(false); setSession(role); }, 1400);
  };

  // Inject viewport meta + global resets on mount
  useEffect(() => {
    // Viewport meta tag (critical for mobile)
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0';
      document.head.appendChild(meta);
    }
    // Global CSS reset for full-width layout
    const style = document.createElement('style');
    style.textContent = `
      html, body, #root {
        width: 100%;
        min-height: 100vh;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        box-sizing: border-box;
      }
      *, *::before, *::after { box-sizing: border-box; }
    `;
    document.head.appendChild(style);
  }, []);

  if (!session && !booting) return <LoginScreen onLogin={handleLogin} />;
  if (booting) return (
    <div style={{fontFamily:"'Sora',system-ui,sans-serif",background:"#f9fafb",minHeight:"100vh"}}>
      <header style={{background:"#fff",borderBottom:"1.5px solid #f3f4f6",height:58,display:"flex",alignItems:"center",padding:"0 20px",gap:10}}>
        <div style={{width:30,height:30,background:"linear-gradient(135deg,#16a34a,#15803d)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🎓</div>
        <span style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:900,letterSpacing:"-0.03em",color:"#111827"}}>Visored</span>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
          <Skeleton w="120px" h={28} r={20}/>
          <Skeleton w="80px" h={28} r={9}/>
        </div>
      </header>
      <SkeletonDashboard/>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900&family=Sora:wght@400;500;600;700&display=swap');@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
  if (session === "admin") return <AdminDashboard onLogout={() => setSession(null)} dark={dark} setDark={setDark}/>;
  return <StudentDashboard onLogout={() => setSession(null)} dark={dark} setDark={setDark}/>;
}
