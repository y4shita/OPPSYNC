import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Bookmark, CalendarDays, Check, FileText, ImagePlus, Leaf, Plus, Sparkles, Target, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({ meta: [
    { title: "OppSync — Your campus, in sync" },
    { name: "description", content: "Discover campus opportunities with OppSync. Turn announcements and posters into your next big thing." },
    { property: "og:title", content: "OppSync — Your campus, in sync" },
    { property: "og:description", content: "One Campus. Every Opportunity. Every Event. Powered by Gemma 4." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

const examples = [
  { id: 1, type: "Hackathon", title: "Build something.\nBreak the ordinary.", name: "Campus AI Hackathon", date: "24 Oct 2026", eligibility: "All students · Teams of 2–4", description: "A weekend of big ideas, late-night builds, and turning your what-if into something real.", color: "lavender", icon: "code" },
  { id: 2, type: "Scholarship", title: "Big dreams.\nA little head start.", name: "Future Makers Scholarship", date: "31 Oct 2026", eligibility: "Undergraduate students", description: "Give your next chapter a boost with support for your studies and a community of curious minds.", color: "pink", icon: "star" },
  { id: 3, type: "Club Event", title: "Find your people.\nMake your mark.", name: "Creative Club Meetup", date: "18 Oct 2026", eligibility: "Everyone is welcome", description: "Meet fellow creatives, swap ideas, and make a little something together. No experience needed.", color: "green", icon: "flower" },
];

function Index() {
  const [mode, setMode] = useState<"text" | "poster">("text");
  const [text, setText] = useState("");
  const [poster, setPoster] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("All opportunities");
  const [saved, setSaved] = useState<number[]>([]);
  const [detail, setDetail] = useState<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const shown = examples.filter(item => filter === "All opportunities" || (filter === "Saved" ? saved.includes(item.id) : item.type === filter));
  const selected = examples.find(item => item.id === detail);
  function extract() {
    if (mode === "text" && !text.trim()) { setNotice("Add an announcement first."); return; }
    if (mode === "poster" && !poster) { setNotice("Choose a poster first."); return; }
    setNotice("This is the web UI preview. Live Gemma 4 extraction runs in your Python app; it is not connected here.");
  }
  return (
    <div className="app-shell">
      <header className="site-header">
        <a href="/" className="brand"><span className="brand-symbol"><Target size={25}/></span>OppSync<span className="brand-dot">*</span></a>
        <span className="header-tagline">One campus. Endless possibilities.</span>
        <Button variant="ghost" className="saved-nav" onClick={() => { setFilter(filter === "Saved" ? "All opportunities" : "Saved"); document.getElementById("opportunities")?.scrollIntoView({ behavior: "smooth" }); }}><Bookmark size={16}/>Saved<span className="saved-count">{saved.length}</span></Button>
      </header>

      <main>
        <section className="workspace">
          <div className="workspace-top">
            <div className="intro">
              <span className="eyebrow"><span className="status-dot"/> YOUR CAMPUS, IN SYNC</span>
              <h1>Your next<br/><span className="italic-heading">big thing.</span><Sparkles className="heading-spark" aria-hidden="true"/></h1>
              <p>Less scrolling. More showing up.<br/>Every opportunity, a little closer.</p>
            </div>
            <div className="sticker-scene" aria-label="Illustrated campus opportunity notes">
              <div className="sticker lavender-sticker"><span>MAKE IT<br/>HAPPEN.</span><ArrowUpRight size={46}/></div>
              <div className="sticker pink-sticker"><Sparkles size={32}/><span>your next<br/><strong>what if?</strong></span></div>
              <div className="sticker green-sticker"><Leaf size={29}/><span>grow<br/>together.</span></div>
              <span className="scene-star">✳</span>
              <span className="scene-caption">good things are<br/>just around the corner ↗</span>
            </div>
          </div>

          <div className="composer">
            <div className="composer-heading"><div className="composer-title"><span className="small-icon"><Plus size={18}/></span><h2>Found something interesting?</h2></div><span className="gemma-label"><Sparkles size={13}/> Powered by Gemma 4</span></div>
            <div className="composer-tabs" role="tablist" aria-label="Announcement source">
              <Button role="tab" aria-selected={mode === "text"} variant="ghost" className={mode === "text" ? "source-tab active" : "source-tab"} onClick={() => {setMode("text");setNotice("");}}><FileText/>Paste announcement</Button>
              <Button role="tab" aria-selected={mode === "poster"} variant="ghost" className={mode === "poster" ? "source-tab active" : "source-tab"} onClick={() => {setMode("poster");setNotice("");}}><ImagePlus/>Upload poster</Button>
            </div>
            {mode === "text" ? <Textarea aria-label="Announcement text" className="announcement-input" value={text} onChange={e => {setText(e.target.value);setNotice("");}} placeholder="Drop that announcement here. The messy WhatsApp forward counts, too…"/> : <div className="poster-upload"><input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" aria-label="Poster image" onChange={e => {const file = e.target.files?.[0]; if (!file) return; if (!['image/png','image/jpeg','image/webp'].includes(file.type)) {setNotice("Choose a PNG, JPG, or WebP image.");return;} const reader = new FileReader(); reader.onload = () => {if (typeof reader.result === "string") {setPoster(reader.result);setFileName(file.name);setNotice("");}};reader.readAsDataURL(file);}}/>{poster && <img src={poster} alt="Selected opportunity poster"/>}<Button variant="ghost" onClick={() => fileInput.current?.click()}><ImagePlus/>{fileName || "Choose a poster"}</Button><span>PNG, JPG or WebP</span></div>}
            <div className="composer-bottom"><span className="session-note"><span className="status-dot"/>Just this session. No noise.</span><Button className="extract-button" onClick={extract}>Find the opportunity <Sparkles size={16}/></Button></div>
            {notice && <p className="notice" role="status">{notice}</p>}
          </div>
        </section>

        <section className="opportunities-section" id="opportunities">
          <div className="section-heading"><div><span className="eyebrow">A LITTLE POSSIBILITY GOES A LONG WAY</span><h2>On your radar<span className="radar-dot">.</span></h2></div><span className="example-label">Sample opportunities <ArrowDown size={14}/></span></div>
          <div className="filter-row" role="group" aria-label="Filter opportunities">{["All opportunities", "Hackathon", "Scholarship", "Club Event", "Saved"].map(label => <Button key={label} variant="ghost" className={filter === label ? "filter-button selected" : "filter-button"} onClick={() => setFilter(label)}>{label === "Saved" && <Bookmark size={14}/>} {label}</Button>)}</div>
          <div className="opportunity-grid">{shown.map(item => <article className={`opportunity-card ${item.color}`} key={item.id}>
            <div className="card-top"><span className="type-label">{item.type}</span><Button variant="ghost" size="icon" className="bookmark-button" aria-label={saved.includes(item.id) ? `Unsave ${item.name}` : `Save ${item.name}`} title={saved.includes(item.id) ? "Remove from saved" : "Save opportunity"} onClick={() => setSaved(saved.includes(item.id) ? saved.filter(id => id !== item.id) : [...saved, item.id])}>{saved.includes(item.id) ? <Check/> : <Bookmark/>}</Button></div>
            <div className="card-art" aria-hidden="true">{item.icon === "code" ? <span className="code-art">&lt; / &gt;</span> : item.icon === "star" ? <span className="star-art">✷</span> : <span className="flower-art">✿</span>}<span className="art-orbit"/></div>
            <h3>{item.title}</h3><p className="opportunity-name">{item.name}</p><div className="card-meta"><CalendarDays size={14}/>{item.date}<span>·</span><span>Sample</span></div>
            <Button variant="ghost" className="card-link" onClick={() => setDetail(item.id)}>Take a look <ArrowUpRight size={19}/></Button>
          </article>)}</div>
          {shown.length === 0 && <div className="empty-state"><Bookmark size={28}/><h3>Room for your next big thing.</h3><p>No saved opportunities yet.</p></div>}
        </section>
      </main>
      <footer><a href="/" className="footer-brand">OppSync<span>*</span></a><span>One Campus. Every Opportunity. Every Event.</span><span className="footer-credit">Made for curious minds <Sparkles size={13}/></span></footer>
      {selected && <div className="dialog-backdrop" onClick={() => setDetail(null)}><section className={`detail-dialog ${selected.color}`} role="dialog" aria-modal="true" aria-label={selected.name} onClick={e => e.stopPropagation()}><Button variant="ghost" size="icon" className="dialog-close" aria-label="Close details" onClick={() => setDetail(null)}><X/></Button><span className="type-label">{selected.type} · Sample opportunity</span><h2>{selected.name}</h2><p>{selected.description}</p><div className="detail-line"><CalendarDays size={18}/><span>{selected.date}</span></div><div className="detail-line"><Users size={18}/><span>{selected.eligibility}</span></div><Button className="extract-button" onClick={() => {setSaved(saved.includes(selected.id) ? saved.filter(id => id !== selected.id) : [...saved, selected.id]);}}><Bookmark/>{saved.includes(selected.id) ? "Remove from saved" : "Save opportunity"}</Button></section></div>}
    </div>
  );
}
