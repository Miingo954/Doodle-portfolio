"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SiCss,
  SiExpress,
  SiFirebase,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { TbApi, TbFileCv } from "react-icons/tb";
import GitHubMark from "./GitHubMark";
import type { AppDispatch, RootState } from "../store";
import { setActiveFilter, toggleTheme } from "../store";
import DraggableJam from "./DraggableJam";

const projects = [
  {
    number: "01",
    title: "Antonio's Pizza Ordering Experience",
    shortTitle: "Antonio's Pizza",
    type: "Ordering experience",
    description:
      "An immersive pizza ordering experience with a visual build your own flow, dynamic pizza pages, and a persistent cart.",
    tags: ["Next.js", "TypeScript", "Dynamic routes", "Persistent cart"],
    categories: ["React", "UI"],
    visual: "pizza",
    preview: "",
    mobilePreview: "/doodle/assets/mobile-antonios.jpg",
    accent: "#ff806f",
    live: "https://antonios-pizza.vercel.app",
    github: "https://github.com/Miingo954/Antonio-s-Pizza",
    caseStudy: "/case-studies/antonios-pizza",
  },
  {
    number: "02",
    title: "Netflix Streaming Clone",
    shortTitle: "Netflix",
    type: "API driven application",
    description:
      "A responsive streaming platform with live catalog data, trailer playback, title and episode pages, and a guest first saved list.",
    tags: ["React", "TMDB API", "Vite", "Routing"],
    categories: ["React", "UI"],
    visual: "netflix",
    preview: "/doodle/assets/netflix-portfolio-final.png",
    mobilePreview: "/doodle/assets/mobile-netflix.jpg",
    accent: "#e54848",
    live: "https://netflix-clone-react-five-zeta.vercel.app/",
    github: "https://github.com/Miingo954/netflix-clone-react",
    caseStudy: "/case-studies/netflix-streaming",
  },
  {
    number: "03",
    title: "Disney+ Experience Clone",
    shortTitle: "Disney+",
    type: "Cinematic UI study",
    description:
      "A media platform with branded collection hubs, dynamic title and episode pages, a persistent My List, and responsive navigation.",
    tags: ["React", "TMDB API", "Responsive UI", "Motion"],
    categories: ["React", "UI"],
    visual: "disney",
    preview: "/doodle/assets/disney-portfolio-final.png",
    mobilePreview: "/doodle/assets/mobile-disney.jpg",
    accent: "#2d68d8",
    live: "https://disney-plus-clone-react-sepia.vercel.app/",
    github: "https://github.com/Miingo954/disney-plus-clone-react",
    caseStudy: null,
  },
  {
    number: "04",
    title: "X Style Social Feed Clone",
    shortTitle: "Social feed",
    type: "Social platform",
    description:
      "A guest friendly social platform with a home feed, profiles, messages, notifications, bookmarks, search, and post composition.",
    tags: ["React", "React Router", "Responsive UI", "Media"],
    categories: ["React", "UI"],
    visual: "social",
    preview: "/doodle/assets/social-feed-portfolio.png",
    mobilePreview: "/doodle/assets/mobile-social.jpg",
    accent: "#2087d8",
    live: "https://twitter-clone-react-ml9mvfeb1-miingo955.vercel.app/",
    github: "https://github.com/Miingo954/twitter-clone-react",
    caseStudy: null,
  },
  {
    number: "05",
    title: "Google Style Search Clone",
    shortTitle: "Search",
    type: "Search experience",
    description:
      "A responsive search app with shareable query routes, live results, category tabs, dark mode, and accessible loading states.",
    tags: ["React", "Public APIs", "Lazy loading", "CSS"],
    categories: ["React", "UI"],
    visual: "google",
    preview: "/doodle/assets/google-search-clone-portfolio.png",
    mobilePreview: "/doodle/assets/mobile-google.jpg",
    accent: "#4285f4",
    live: "https://google-search-clone-react.vercel.app",
    github: "https://github.com/Miingo954/google-search-clone-react",
    caseStudy: null,
  },
  {
    number: "06",
    title: "RUFF Pepper Shrimp",
    shortTitle: "RUFF Pepper Shrimp",
    type: "Family business story",
    description:
      "A production ready website for a Broward County family business, pairing Jamaican storytelling with responsive product presentation and a direct text to order flow.",
    tags: ["Next.js", "TypeScript", "Brand story", "Responsive UI"],
    categories: ["Brand"],
    visual: "ruff",
    preview: "/doodle/assets/ruff-portfolio.jpg",
    mobilePreview: "/doodle/assets/mobile-ruff.jpg",
    accent: "#f6dc69",
    live: "https://ruff-pepper-shrimp.vercel.app",
    github: "https://github.com/Miingo954/RUFF-Pepper-Shrimp",
    caseStudy: "/case-studies/ruff-pepper-shrimp",
  },
];

const filters = ["All", "React", "UI", "Brand"];
const modalSkills = [
  { Icon: SiTypescript, name: "TypeScript", color: "#3178c6" },
  { Icon: SiJavascript, name: "JavaScript", color: "#d6b900" },
  { Icon: SiHtml5, name: "HTML5", color: "#e34f26" },
  { Icon: SiCss, name: "CSS3", color: "#663399" },
  { Icon: SiReact, name: "React", color: "#149eca" },
  { Icon: SiNextdotjs, name: "Next.js", color: "#000000" },
  { Icon: SiNodedotjs, name: "Node.js", color: "#339933" },
  { Icon: SiExpress, name: "Express", color: "#000000" },
  { Icon: SiTailwindcss, name: "Tailwind CSS", color: "#06b6d4" },
  { Icon: SiRedux, name: "Redux", color: "#764abc" },
  { Icon: SiFirebase, name: "Firebase", color: "#ff9100" },
  { Icon: TbApi, name: "REST APIs", color: "#168d87" },
];
const tools = [
  "React",
  "Next.js",
  "TypeScript",
  "Redux",
  "Tailwind CSS",
  "Firebase",
];
const typePhrases = [
  "interfaces that feel human.",
  "responsive React experiences.",
  "playful digital products.",
];

function Arrow() {
  return <span className="external-arrow" aria-hidden="true" />;
}

export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactOpening, setContactOpening] = useState(false);
  const [contactClosing, setContactClosing] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const contactDialogRef = useRef<HTMLDialogElement>(null);
  const contactCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const contactOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const dispatch = useDispatch<AppDispatch>();
  const activeFilter = useSelector(
    (state: RootState) => state.portfolio.activeFilter,
  );
  const theme = useSelector((state: RootState) => state.portfolio.theme);
  const visibleProjects = projects.filter(
    (project) =>
      activeFilter === "All" || project.categories.includes(activeFilter),
  );

  useEffect(() => {
    const dialog = contactDialogRef.current;
    if (!dialog) return;
    if (contactOpen && !dialog.open) dialog.showModal();
    if (!contactOpen && dialog.open) dialog.close();
  }, [contactOpen]);

  useEffect(
    () => () => {
      if (contactCloseTimerRef.current) {
        clearTimeout(contactCloseTimerRef.current);
      }
      if (contactOpenTimerRef.current) {
        clearTimeout(contactOpenTimerRef.current);
      }
    },
    [],
  );

  const openContactDialog = () => {
    if (contactCloseTimerRef.current) {
      clearTimeout(contactCloseTimerRef.current);
      contactCloseTimerRef.current = null;
    }
    if (contactOpenTimerRef.current) {
      clearTimeout(contactOpenTimerRef.current);
    }
    setContactClosing(false);
    setContactOpening(true);
    setContactOpen(true);
    contactOpenTimerRef.current = setTimeout(() => {
      setContactOpening(false);
      contactOpenTimerRef.current = null;
    }, 520);
  };

  const closeContactDialog = () => {
    if (!contactOpen || contactClosing) return;
    if (contactOpenTimerRef.current) {
      clearTimeout(contactOpenTimerRef.current);
      contactOpenTimerRef.current = null;
    }
    setContactOpening(false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setContactOpen(false);
      return;
    }
    setContactClosing(true);
    contactCloseTimerRef.current = setTimeout(() => {
      contactDialogRef.current?.close();
      contactCloseTimerRef.current = null;
      setContactOpen(false);
      setContactClosing(false);
    }, 440);
  };

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const message = String(formData.get("message") ?? "");
    const subject = encodeURIComponent(`Portfolio hello from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );
    window.location.href = `mailto:jamal.ferguson1990@gmail.com?subject=${subject}&body=${body}`;
  };

  useEffect(() => {
    const phrase = typePhrases[phraseIndex];
    const isComplete = typedText === phrase;
    const isEmpty = typedText.length === 0;
    const delay = isComplete && !isDeleting ? 1300 : isDeleting ? 34 : 62;
    const timer = window.setTimeout(() => {
      if (isComplete && !isDeleting) {
        setIsDeleting(true);
        return;
      }
      if (isEmpty && isDeleting) {
        setIsDeleting(false);
        setPhraseIndex((index) => (index + 1) % typePhrases.length);
        return;
      }
      setTypedText((current) =>
        isDeleting ? current.slice(0, -1) : phrase.slice(0, current.length + 1),
      );
    }, delay);
    return () => window.clearTimeout(timer);
  }, [isDeleting, phraseIndex, typedText]);

  return (
    <main
      className={`portfolio-shell min-h-screen overflow-hidden bg-canvas text-ink ${theme === "dark" ? "theme-dark" : ""}`}
    >
      <header className="page-load-header fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-canvas/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <a
            href="#home"
            className="site-brand font-mono text-sm font-bold tracking-tight"
          >
            <Image
              className="site-brand-logo"
              src="/doodle/assets/jf-logo.png"
              alt=""
              width={256}
              height={217}
              priority
            />
            <span>
              <span className="text-mint">&lt;</span> JamalFerguson.dev{" "}
              <span className="text-mint">/&gt;</span>
            </span>
          </a>
          <div className="flex items-center gap-3 sm:gap-7">
            <nav
              className="hidden items-center gap-7 text-sm text-soft sm:flex"
              aria-label="Primary navigation"
            >
              <a className="transition hover:text-mint" href="#work">
                Work
              </a>
              <a
                className="transition hover:text-mint"
                href="#about"
                onClick={(event) => {
                  event.preventDefault();
                  openContactDialog();
                }}
              >
                About
              </a>
              <a className="transition hover:text-mint" href="#contact">
                Contact
              </a>
            </nav>
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-panel text-lg shadow-sm transition hover:-translate-y-0.5 hover:border-mint"
            >
              <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
            </button>
            <button
              type="button"
              aria-label={`${mobileMenuOpen ? "Close" : "Open"} navigation menu`}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-panel text-ink shadow-sm transition hover:border-mint sm:hidden"
            >
              <span className="relative block h-4 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 top-0 h-0.5 w-5 rounded bg-current transition ${mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""}`}
                />
                <span
                  className={`absolute left-0 top-[7px] h-0.5 w-5 rounded bg-current transition ${mobileMenuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`absolute left-0 top-[14px] h-0.5 w-5 rounded bg-current transition ${mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className={`absolute inset-x-4 top-[78px] overflow-hidden rounded-xl border border-line bg-panel shadow-2xl transition-all duration-200 sm:hidden ${mobileMenuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}
        >
          <div className="flex flex-col p-2 text-base font-semibold">
            {[
              ["Work", "#work"],
              ["About", "#about"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={(event) => {
                  setMobileMenuOpen(false);
                  if (label === "About") {
                    event.preventDefault();
                    openContactDialog();
                  }
                }}
                className="rounded-lg px-4 py-3 text-soft transition hover:bg-mint/10 hover:text-mint"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <section
        id="home"
        className="doodle-hero relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-12 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:px-12"
      >
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 opacity-25 [background-image:radial-gradient(#0b7f6a_1px,transparent_1px)] [background-size:38px_38px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
        <div className="hero-copy relative z-10 max-w-3xl">
          <p className="hero-eyebrow mb-5 font-mono text-sm font-semibold uppercase tracking-[0.24em] text-mint">
            Full-Stack Developer · Northern California
          </p>
          <h1 className="hero-title text-5xl font-bold leading-[.96] tracking-[-0.055em] sm:text-7xl lg:text-[88px]">
            Thoughtful interfaces,
            <span className="block text-mint">built with personality.</span>
          </h1>
          <p
            className="type-line mt-6 text-2xl font-semibold sm:text-3xl"
            aria-live="polite"
          >
            I build <span className="type-accent">{typedText}</span>
            <span className="type-cursor" aria-hidden="true">
              |
            </span>
          </p>
          <p className="hero-description mt-7 max-w-2xl text-lg leading-8 text-soft sm:text-xl">
            I’m <span className="text-[#fc8f82] font-bold">Jamal Ferguson</span>. I turn strong visual ideas into responsive React
            experiences that feel clear, useful, and human.
          </p>
          <p className="doodle-note mt-6" aria-hidden="true">
            made with curiosity + a lot of coffee
          </p>
          <div className="hero-actions mt-9 flex flex-wrap gap-4">
            <a
              href="#work"
              className="rounded-md bg-mint px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-ink"
            >
              View selected work
            </a>
            <a
              href="#contact"
              className="rounded-md border border-mint px-6 py-3.5 text-sm font-bold text-mint transition hover:bg-mint/10"
            >
              Let’s talk
            </a>
          </div>
          <ul
            className="hero-tools mt-10 flex flex-wrap gap-2"
            aria-label="Technology toolkit"
          >
            {tools.map((tool) => (
              <li
                key={tool}
                className="rounded border border-line bg-panel/80 px-3 py-1.5 font-mono text-xs text-soft"
              >
                {tool}
              </li>
            ))}
          </ul>
        </div>

        <div className="doodle-portrait relative z-10 mx-auto w-full max-w-[560px] self-end lg:justify-self-end">
          <div className="hero-portrait-crop relative aspect-[1086/1083] w-full overflow-hidden">
            <Image
              src="/doodle/assets/jamal-hero-cutout.png"
              alt="Jamal Ferguson"
              width={1086}
              height={1448}
              priority
              className="absolute left-0 top-0 z-10 h-auto w-full max-w-none drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section
        id="work"
        className="doodle-work border-y-2 border-ink bg-surface py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.22em] text-mint">
                Selected work
              </p>
              <h2 className="doodle-heading mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                A closer look at what I build.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Filter projects">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={activeFilter === filter}
                  onClick={() => dispatch(setActiveFilter(filter))}
                  className={`rounded-full border px-4 py-2 text-sm transition ${activeFilter === filter ? "border-mint bg-mint text-white" : "border-line bg-panel/60 text-soft hover:border-mint hover:text-mint"}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="project-showcase-list mt-12">
            {visibleProjects.map((project, index) => (
              <article
                key={project.number}
                className={`project-showcase ${index % 2 ? "project-showcase-reverse" : ""}`}
              >
                <div
                  className={`project-visual project-visual--${project.visual}`}
                  role="group"
                  aria-label={`${project.shortTitle} desktop and mobile previews`}
                >
                  <div className="project-screen">
                    <div
                      className={`project-image project-image--${project.visual}`}
                    >
                      {project.visual === "pizza" ? (
                        <div className="project-pizza-scene">
                          <Image
                            src="/doodle/assets/orbit-kitchen-bg.png"
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, 55vw"
                            className="project-pizza-kitchen"
                          />
                          <Image
                            src="/doodle/assets/orbit-pizza-board.png"
                            alt=""
                            width={500}
                            height={500}
                            className="project-pizza-board"
                          />
                          <div className="project-pizza-copy">
                            <span>BENEVENUTI · ANTONIO&apos;S</span>
                            <strong>
                              Pull up a chair.
                              <br />
                              Your pie awaits.
                            </strong>
                          </div>
                        </div>
                      ) : (
                        <Image
                          src={project.preview}
                          alt={`${project.shortTitle} desktop interface preview`}
                          fill
                          sizes="(max-width: 768px) 100vw, 55vw"
                          className="project-preview-image"
                        />
                      )}
                    </div>
                    <div className="project-copy">
                      <p
                        className="project-meta"
                        style={{ color: project.accent }}
                      >
                        <span>{project.number}</span>
                        <span>{project.type}</span>
                      </p>
                      <h3>{project.title}</h3>
                      <p className="project-summary">{project.description}</p>
                      <ul
                        className="project-tags"
                        aria-label="Technologies and features"
                      >
                        {project.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                      <div className="project-links">
                        {project.caseStudy ? (
                          <Link href={project.caseStudy}>
                            Case study <Arrow />
                          </Link>
                        ) : null}
                        <a href={project.live} target="_blank" rel="noreferrer">
                          Live site <Arrow />
                        </a>
                        <a
                          className="github-link"
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`View ${project.title} on GitHub`}
                        >
                          <GitHubMark /> GitHub <Arrow />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="project-phone" aria-hidden="true">
                    <Image
                      src={project.mobilePreview}
                      alt=""
                      fill
                      sizes="140px"
                      className="project-phone-image"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
          {visibleProjects.length === 0 && (
            <p className="mt-12 text-soft">
              No projects match that filter yet.
            </p>
          )}
        </div>
      </section>

      <section
        id="contact"
        className="doodle-contact border-t-2 border-ink bg-coral text-white"
      >
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-5 py-20 sm:px-8 lg:flex-row lg:items-end lg:px-12">
          <div>
            <p className="font-mono text-sm font-bold uppercase tracking-[0.22em]">
              Have an idea?
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              Let’s build something people remember.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              className="contact-email rounded-md px-6 py-3.5 text-sm font-bold"
              href="mailto:jamal.ferguson1990@gmail.com"
            >
              Email me <Arrow />
            </a>
            <a
              className="contact-github github-link rounded-md border border-white px-6 py-3.5 text-sm font-bold"
              href="https://github.com/Miingo954"
              target="_blank"
              rel="noreferrer"
            >
              <GitHubMark /> GitHub <Arrow />
            </a>
          </div>
        </div>
      </section>

      <footer className="portfolio-footer border-t border-ink/10 px-5 py-9 text-sm text-soft sm:px-8 lg:px-12">
        <a className="footer-brand" href="#home" aria-label="Back to top">
          <Image
            className="footer-brand-logo"
            src="/doodle/assets/jf-logo.png"
            alt="JF"
            width={256}
            height={217}
          />
          <span>JamalFerguson.dev</span>
        </a>
        <nav className="footer-links" aria-label="Social and résumé links">
          <a href="https://github.com/Miingo954" target="_blank" rel="noreferrer">
            <SiGithub aria-hidden="true" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/jamal-ferguson-31a2b73a2/"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin aria-hidden="true" />
            LinkedIn
          </a>
          <a
            href="/doodle/assets/jamal-ferguson-resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            <TbFileCv aria-hidden="true" />
            Resume
          </a>
        </nav>
        <p>© 2026 Jamal Ferguson</p>
        <p className="footer-stack">React · Redux Toolkit · Tailwind CSS</p>
      </footer>

      <DraggableJam onOpenContact={openContactDialog} />

      <dialog
        ref={contactDialogRef}
        className={`contact-modal ${contactOpening ? "is-opening" : ""} ${contactClosing ? "is-closing" : ""}`}
        aria-labelledby="contact-modal-about-title"
        onClose={() => {
          setContactOpen(false);
          setContactOpening(false);
          setContactClosing(false);
        }}
        onCancel={(event) => {
          event.preventDefault();
          closeContactDialog();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") closeContactDialog();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeContactDialog();
        }}
      >
        <button
          className="contact-modal-close"
          type="button"
          aria-label="Close contact dialog"
          onClick={closeContactDialog}
        >
          ×
        </button>
        <div className="contact-modal-about">
          <p className="contact-modal-eyebrow">A little about me</p>
          <h2 id="contact-modal-about-title">
            Frontend roots. <span>Full stack direction.</span>
          </h2>
          <p className="contact-modal-bio">
            I’m Jamal Ferguson, a developer building thoughtful interfaces and
            growing across the full stack. I connect responsive React products
            to APIs, application logic, and data shaped by real user needs.
          </p>
          <div className="contact-modal-skills" aria-label="Technical skills">
            {modalSkills.map((skill) => (
              <div
                className="contact-modal-skill"
                key={skill.name}
                tabIndex={0}
                aria-label={skill.name}
              >
                <i aria-hidden="true" style={{ color: skill.color }}>
                  <skill.Icon />
                </i>
                <span aria-hidden="true">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="contact-modal-form-panel">
          <p className="contact-modal-eyebrow">Open to new opportunities</p>
          <h2 id="contact-modal-title">Let’s have a chat!</h2>
          <p className="contact-modal-prompt">
            I’m currently open to new opportunities.
          </p>
          <form className="contact-modal-form" onSubmit={handleContactSubmit}>
            <label>
              Name
              <input autoComplete="name" name="name" required />
            </label>
            <label>
              Email
              <input autoComplete="email" name="email" type="email" required />
            </label>
            <label className="contact-modal-message-field">
              Message
              <textarea name="message" rows={3} required />
            </label>
            <button type="submit">
              Send it my way <Arrow />
            </button>
          </form>
          <a
            className="contact-modal-direct"
            href="mailto:jamal.ferguson1990@gmail.com"
          >
            Or email me directly
          </a>
        </div>
      </dialog>
    </main>
  );
}
