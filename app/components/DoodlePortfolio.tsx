"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect } from "react";


const asset = (name: string) => `/doodle/assets/${name}`;

type Project = {
  key: string;
  count: string;
  title: string;
  description: string;
  tags: string[];
  live: string;
  github: string;
  caseStudy?: string;
  featured?: boolean;
};

const projects: Project[] = [
  { key: "pizza", count: "01 / 06", title: "Antonio's Pizza", description: "Custom pizza builder, animated cutting board, cart, and routed ordering flow.", tags: ["React", "Motion", "UX"], live: "https://antonios-pizza.vercel.app", github: "https://github.com/Miingo954/Antonio-s-Pizza", caseStudy: "/case-studies/antonios-pizza", featured: true },
  { key: "disney", count: "02 / 06", title: "Disney Plus Clone", description: "A cinematic interface study focused on brand pages, routes, and animated storytelling.", tags: ["UI Study", "React", "Routes"], live: "https://disney-plus-clone-react-sepia.vercel.app/", github: "https://github.com/Miingo954/disney-plus-clone-react" },
  { key: "shrimp", count: "03 / 06", title: "RUFF Pepper Shrimp", description: "A family business experience rooted in Jamaica, memory, flavor, and story.", tags: ["Brand", "Story", "Responsive"], live: "https://ruff-pepper-shrimp.vercel.app", github: "https://github.com/Miingo954/RUFF-Pepper-Shrimp", caseStudy: "/case-studies/ruff-pepper-shrimp", featured: true },
  { key: "google", count: "04 / 06", title: "Google Search Clone", description: "A responsive search interface study powered by live data and familiar interactions.", tags: ["UI Study", "API", "Search"], live: "https://google-search-clone-react.vercel.app", github: "https://github.com/Miingo954/google-search-clone-react" },
  { key: "netflix", count: "05 / 06", title: "Netflix Streaming Clone", description: "A responsive streaming experience with live TMDB data, trailers, title pages, episode views, and a saved-list flow.", tags: ["React", "TMDB API", "Vite"], live: "https://netflix-clone-react-five-zeta.vercel.app/", github: "https://github.com/Miingo954/netflix-clone-react", caseStudy: "/case-studies/netflix-streaming", featured: true },
  { key: "social", count: "06 / 06", title: "X-Style Social Feed", description: "A social interface study with feeds, profiles, messages, bookmarks, search, and post composition.", tags: ["UI Study", "React", "Router"], live: "https://twitter-clone-react-ml9mvfeb1-miingo955.vercel.app/", github: "https://github.com/Miingo954/twitter-clone-react" },
];

const experiences = [
  { label: "Current", title: "Skinstric AI", role: "Frontend Internship · Finishing now", body: "Working with live APIs, dynamic routes, loading states, and product flows while completing frontend training." },
  { label: "Internship experience", title: "Ultaverse NFT World", role: "Frontend Development", body: "Applied responsive frontend skills in a collaborative product environment and gained experience working beyond isolated course projects." },
  { label: "Current training", title: "Frontend Simplified", role: "Frontend Development Program", body: "Building practical experience across HTML, CSS, JavaScript, React, Next.js, TypeScript, Node.js, and modern development workflows." },
];

const memories = [
  ["epcot", "Drag EPCOT monorail photo", "epcot-monorail.jpeg", "Monorail passing Spaceship Earth at EPCOT"],
  ["dinner", "Drag dinner with friends photo", "friends-dinner.jpeg", "Jamal smiling with friends at dinner"],
  ["dog", "Drag dog portrait", "dog-portrait.jpeg", "Small dog relaxing on a couch"],
  ["london-portrait", "Drag London portrait", "jamal-st-pauls.jpeg", "Jamal standing near St Paul's Cathedral in London"],
  ["sunset", "Drag beach sunset photo", "beach-sunset-new.jpeg", "Couple watching the sunset on a rocky beach"],
  ["cultural", "Drag cultural celebration photo", "friends-cultural-celebration.jpeg", "Jamal with friends at a colorful cultural celebration"],
  ["car-selfie", "Drag car selfie", "friend-car-selfie.jpeg", "A smiling friend taking a selfie with Jamal in the car"],
  ["greenwich", "Drag Greenwich photo", "greenwich-friends.jpeg", "Jamal and a friend standing between the historic Greenwich buildings"],
  ["skatepark", "Drag skatepark photo", "skatepark.jpeg", "Jamal skating at an outdoor skatepark"],
  ["disney", "Drag Disney photo", "disney-castle.jpeg", "Jamal facing Cinderella Castle at Disney World"],
  ["animal-kingdom", "Drag Animal Kingdom photo", "animal-kingdom-friends.jpeg", "Jamal smiling with a friend at Animal Kingdom"],
  ["blue-gala", "Drag gala photo", "blue-gala.jpeg", "Jamal and his partner dressed up at a blue-lit gala"],
  ["wedding-lawn", "Drag wedding lawn photo", "wedding-lawn.jpeg", "Jamal and a friend dressed for a wedding on a green lawn"],
  ["couple-selfie", "Drag couple selfie", "couple-selfie.jpeg", "Jamal posing for a close selfie with his partner"],
  ["forest-pause", "Drag forest hike photo", "forest-pause.jpeg", "Jamal pausing on a sunlit trail in a lush forest"],
] as const;

function GitHubIcon() {
  return <svg aria-hidden="true"><use href="#github-mark" /></svg>;
}

function Chrome() {
  return <>
    <a className="skip-link" href="#work">Skip to featured work</a>
    <svg className="icon-sprite" aria-hidden="true"><symbol id="github-mark" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .7a11.6 11.6 0 0 0-3.7 22.6c.6.1.8-.3.8-.6v-2.3c-3.4.7-4.1-1.4-4.1-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.4-5.5-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.6.1-3.1 0 0 1-.3 3.2 1.2a11.1 11.1 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.5.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.8 5.5-5.5 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.6 11.6 0 0 0 12 .7Z" /></symbol></svg>
    <div className="loader" aria-label="Loading portfolio"><div className="loader__mascot mascot-frame"><img src={asset("lil-mal-v2-open.png")} alt="" /></div><p className="loader__count">00</p><p className="loader__note">Clearing some desk space</p><span className="loader__track"><span /></span></div>
    <header className="topbar"><a className="signature" href="#home"><span>JF</span> Jamal Ferguson</a><p className="topbar__status"><span /> Open to frontend opportunities</p><nav aria-label="Primary navigation"><a href="#work">Work</a><a href="#experience">Experience</a><a href="#process">Process</a><a href="#about">About</a><a href="#contact">Contact</a></nav></header>
  </>;
}

function LilJam() {
  return <>
    <button className="mascot-card draggable" type="button" data-draggable aria-label="Drag Lil' Jam, Jamal's mascot"><span className="mascot-bubble" aria-live="polite">Yep, I react. Drag me around, or you can throw me too!</span><span className="mascot-frame">
      <img className="mascot-face mascot-face--default" src={asset("lil-mal-v2-open.png")} alt="Lil' Jam, Jamal Ferguson's portfolio mascot" draggable="false" />
      {(["blink", "wink", "drag", "flying", "idle"] as const).map(face => <img key={face} className={`mascot-face mascot-face--${face}`} src={asset(`lil-mal-v2-${face}.png`)} alt="" draggable="false" />)}
    </span></button>
    <button className="recall-mascot" type="button" aria-label="Bring Lil Jam back into view">↩ Call Lil’ Jam back</button>
    <img className="lil-mal-coffee" src={asset("lil-mal-real-coffee-v2.png")} alt="" aria-hidden="true" />
    <img className="lil-mal-spill" src={asset("lil-mal-coffee-spill.png")} alt="" aria-hidden="true" />
    <canvas className="lil-mal-spill-canvas" aria-hidden="true" />
  </>;
}

function Hero() {
  const secrets = [
    ["duck", "Rubber duck", "Hidden rubber duck debugging companion", "secret-rubber-duck.png"],
    ["sketchbook", "Sketchbook", "Hidden interface sketchbook", "secret-sketchbook.png"],
    ["passport", "Passport", "Hidden open passport with Jamaica, London, and Panama stamps", "secret-passport.png"],
    ["terminal", "Secret terminal", "Hidden miniature terminal", "secret-terminal.png"],
    ["github", "Golden GitHub square", "Hidden golden GitHub contribution square", "secret-github-gold.png"],
  ] as const;
  return <section className="canvas" id="home" aria-labelledby="hero-title">
    <div className="canvas__grid" aria-hidden="true" /><p className="canvas__coordinate canvas__coordinate--x">01 &nbsp; 02 &nbsp; 03 &nbsp; 04 &nbsp; 05</p><p className="canvas__coordinate canvas__coordinate--y">A<br />B<br />C<br />D<br />E</p>
    <div className="hero-copy"><p className="eyebrow">Frontend developer in Northern California</p><h1 id="hero-title">Jamal Ferguson</h1><p className="role">I build <span className="type-line" aria-live="polite" /></p><a className="view-work" href="#work">View my work</a><p className="drag-instruction">Grab anything. Drag the whole desk. There may be more to find outside the frame.</p></div>
    <button className="paper-note paper-note--idea draggable" type="button" data-draggable><span>Current thought</span>What if every click felt a little more human?</button>
    <button className="paper-note paper-note--available draggable" type="button" data-draggable><span>Currently</span>Learning, building, and looking for the next challenge.</button>
    <button className="code-card draggable" type="button" data-draggable><span className="code-card__lights" aria-hidden="true"><i /><i /><i /></span><code><b>const</b> developer = {"{"}<br />&nbsp; curious: <em>true</em>,<br />&nbsp; givingUp: <em>false</em><br />{"};"}</code></button>
    <button className="tiny-sticker tiny-sticker--react draggable" type="button" data-draggable aria-label="Drag React sticker">⚛</button>
    <button className="tiny-sticker tiny-sticker--coffee draggable" type="button" data-draggable aria-label="Drag Lil' Jam's steaming coffee"><img className="real-coffee-cup" src={asset("lil-mal-real-coffee-v2.png")} alt="A ceramic mug filled with coffee" draggable="false" /><span className="live-coffee-steam" aria-hidden="true"><i /><i /><i /><i /></span></button>
    {[["rainier", "jamal-mount-rainier.jpeg", "Jamal walking through snow at Mount Rainier in Washington State"], ["beba", "beba.jpeg", "Beba, Jamal's white dog, sitting on a couch"], ["london", "london-coffee.jpeg", "Jamal drinking coffee in London"]].map(([key, image, alt]) => <button key={key} className={`photo-card photo-card--${key} draggable`} type="button" data-draggable aria-label={`Drag ${alt} photo`}><img src={asset(image)} alt={alt} /></button>)}
    {secrets.map(([key, name, label, image]) => <button key={key} className={`desk-secret desk-secret--${key}`} type="button" data-secret={name} aria-label={label}><img src={asset(image)} alt="" draggable="false" />{key === "duck" && <small>Ask me about the bug.</small>}</button>)}
    <button className="game-secret game-secret--cartridge" type="button" aria-label="Hidden Debug Patrol game cartridge that opens Jam's debugging game"><img src={asset("secret-debug-cartridge.png")} alt="" draggable="false" /></button>
    <aside className="secret-counter" aria-live="polite"><span>Desk secrets</span><strong>0 / 5</strong></aside><p className="secret-toast" role="status" aria-live="polite" />
    <button className="shuffle-desk" type="button"><span>↻</span> Mix up my desk</button><button className="recenter-canvas" type="button" aria-label="Recenter the landing canvas"><span>⌖</span> Recenter desk</button>
    <div className="tape tape--one" aria-hidden="true" /><div className="tape tape--two" aria-hidden="true" /><span className="sketch-arrow" aria-hidden="true">↝</span><span className="sketch-star" aria-hidden="true">✦</span><span className="sketch-circle" aria-hidden="true" />
  </section>;
}

function Work() {
  return <section className="work" id="work"><header className="section-intro"><p>Selected work · drag to explore</p><h2>Things I brought to life.</h2></header><div className="freeform-board">
    {projects.map(project => <article key={project.key} className={`project-card project-card--${project.key} project-card--${project.featured ? "featured" : "secondary"} draggable`} data-draggable><span className="project-card__tape" aria-hidden="true" /><p className="project-card__count">{project.count}</p><h3>{project.title}</h3><p>{project.description}</p><div className="project-card__tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-card__actions"><a href={project.live} target="_blank" rel="noreferrer">Live project ↗</a><a className="github-link" href={project.github} target="_blank" rel="noreferrer" aria-label={`View ${project.title} source code on GitHub`}><GitHubIcon /><span>GitHub</span></a>{project.caseStudy && <a href={project.caseStudy}>Case study ↗</a>}</div></article>)}
    <div className="board-note draggable" data-draggable><p>Built with curiosity,<br />debugged with snacks.</p><span>JF</span></div>
  </div></section>;
}

function Experience() {
  return <section className="experience" id="experience" aria-labelledby="experience-title"><header><p>Experience in progress</p><h2 id="experience-title">Learning inside real product work.</h2></header><div className="experience__grid">{experiences.map(item => <article key={item.title}><span>{item.label}</span><h3>{item.title}</h3><strong>{item.role}</strong><p>{item.body}</p></article>)}</div></section>;
}

function Process() {
  return <section className="build-lab" id="process" aria-labelledby="process-title"><header className="build-lab__intro"><p>Jamal’s debugging process</p><h2 id="process-title">Find it. Trace it.<br />Fix it.</h2><span>A quick, Galaga-inspired debugging run with Lil’ Jam. Clear three focused waves and ship a healthy build.</span></header><div className="galaga-launch-card"><span className="galaga-launch-card__stars" aria-hidden="true">✦ · ⋆ · ✧ · ⋆</span><p>JAM’S DEBUG PATROL</p><h3>Debug the build.</h3><button className="run-build" type="button"><span>▶</span> Start debugging</button><small>Move: A / D or arrow keys · Fire: space · Touch and drag on mobile</small></div><div className="galaga-game" hidden role="dialog" aria-modal="true" aria-label="Jam's Debug Patrol arcade game"><canvas className="galaga-canvas" /><div className="galaga-hud" aria-live="polite"><span>FIX SCORE <b className="galaga-score">000000</b></span><div className="galaga-progress"><strong className="galaga-stage">REPRODUCE</strong><i /><i /><i /></div><span>WAVE <b className="galaga-wave">1</b> · LIVES <b className="galaga-lives">3</b></span></div><button className="galaga-close" type="button" aria-label="Exit Star Patrol">× EXIT</button><div className="galaga-intro"><p>THREE-STEP DEBUG MISSION</p><h3>Clear every bug.</h3><span>Wave 1: reproduce · Wave 2: isolate · Wave 3: fix<br />Move with ← → or A D · fire fixes with SPACE</span><button className="galaga-start" type="button">DEBUG THE BUILD</button></div><div className="galaga-message" hidden /><div className="galaga-touch" aria-hidden="true"><span>← DRAG TO MOVE →</span><b>TAP TO FIRE</b></div></div></section>;
}

function About() {
  return <section className="about" id="about"><div className="about__heading"><p>About this human</p><h2>Curious by nature.<br />Frontend by choice.</h2></div><figure className="about__portrait"><img src={asset("jamal-hero-cutout.png")} alt="Jamal Ferguson smiling with his hands folded" loading="lazy" /></figure><div className="about__copy"><p>I am a frontend developer trained through Frontend Simplified. I turn strong visual ideas into responsive, interactive experiences that feel natural to use.</p><p>My program includes frontend internships with Ultaverse NFT World and Skinstric AI, where I work with live APIs, dynamic routes, loading states, and real product flows.</p><ul aria-label="Technology toolkit">{["HTML", "CSS", "JavaScript", "React", "Next.js", "Firebase"].map(tool => <li key={tool}>{tool}</li>)}</ul></div>
    <article className="credential-card" aria-labelledby="credential-title"><a className="credential-card__preview" href={asset("jamal-ferguson-fes-certificate.pdf")} target="_blank" rel="noreferrer" aria-label="Open Jamal Ferguson's FES Institute graduation certificate PDF"><img src={asset("jamal-ferguson-fes-certificate-preview.png")} alt="FES Institute Certificate of Graduation awarded to Jamal Ferguson" loading="lazy" /><span>View full certificate ↗</span></a><div className="credential-card__copy"><p>Education · verified</p><h3 id="credential-title">Frontend Development Bootcamp</h3><strong>FES Institute · Certificate of Graduation</strong><p>Completed professional frontend training and a practical internship, demonstrating proficiency across HTML, CSS, JavaScript, React, Next.js, Node.js, TypeScript, and Redux.</p><div><a href={asset("jamal-ferguson-fes-certificate.pdf")} target="_blank" rel="noreferrer">Open certificate <span>↗</span></a><a href="https://firebasestorage.googleapis.com/v0/b/do-not-delete-jg.firebasestorage.app/o/chat_images%2F7861%2F547007fe-d662-4a20-9897-5651cb1342ce-Jamal%20Ferguson%20Certificate%20of%20Graduation.pdf?alt=media&token=e3183668-474c-4cde-9052-896bc7f054dd" target="_blank" rel="noreferrer">Verified source <span>↗</span></a></div></div></article>
    <div className="life-gallery"><div className="life-gallery__intro"><p>Life outside code</p><h3>A few frames from my world.</h3><span>Drag · click · double-click ↗</span></div><div className="memory-desk__controls"><p>Lil’ Jam was supposed to organize these…</p><button className="organize-memories" type="button" aria-expanded="false" aria-controls="memory-gallery">Arrange the photos</button></div><div className="life-gallery__board memory-desk" id="memory-gallery" aria-label="Interactive personal photo collage">{memories.map(([key, label, image, alt]) => <button key={key} className={`life-photo life-photo--${key} draggable`} type="button" data-draggable aria-label={label}><img src={asset(image)} alt={alt} /></button>)}</div><dialog className="memory-viewer" aria-label="Photo viewer"><button className="memory-viewer__close" type="button" aria-label="Close photo">×</button><img alt="" /><p /></dialog></div><div className="about__stamp" aria-hidden="true">Always<br />building</div>
  </section>;
}

function Contact() {
  return <section className="contact" id="contact"><div className="contact__mascot-dock" aria-hidden="true" /><p>Have an idea?</p><h2>Let us make something people remember.</h2><div className="contact__links"><a href="mailto:jamal.ferguson1990@gmail.com">Email me <span>↗</span></a><a href="https://github.com/Miingo954" target="_blank" rel="noreferrer">GitHub <span>↗</span></a></div><footer><span>Jamal Ferguson</span><span>Designed and built with care</span><span>© 2026</span></footer></section>;
}

export default function DoodlePortfolio() {
  useEffect(() => {
    const runtimeId = "doodle-portfolio-runtime";
    if (document.getElementById(runtimeId)) return;

    const runtime = document.createElement("script");
    runtime.id = runtimeId;
    runtime.src = "/doodle/script.js";
    runtime.async = true;
    document.body.appendChild(runtime);
  }, []);

  return <div className="doodle-portfolio"><Chrome /><LilJam /><main><Hero /><Work /><Experience /><Process /><About /><Contact /></main></div>;
}
