import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import GitHubMark from "../../components/GitHubMark";
import { caseStudies, getCaseStudy } from "../data";
import styles from "./page.module.css";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  return {
    title: `${study.title} Case Study | Jamal Ferguson`,
    description: study.summary,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();

  return (
    <main
      className={styles.page}
      style={{ "--accent": study.accent } as React.CSSProperties}
    >
      <nav className={styles.nav} aria-label="Case study navigation">
        {/* Full document loads keep the temporary interaction runtime from duplicating global listeners. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">
          <Image
            className={styles.navLogo}
            src="/doodle/assets/jf-logo.png"
            alt=""
            width={256}
            height={217}
          />
          <span>Jamal Ferguson</span>
        </a>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/?section=work">Back to workbench</a>
      </nav>
      <header className={styles.hero}>
        <p>
          {study.index} · {study.eyebrow}
        </p>
        <h1>{study.title}</h1>
        <strong>{study.summary}</strong>
        <div className={styles.actions}>
          <a href={study.liveUrl} target="_blank" rel="noreferrer">
            View live project <span className={styles.externalArrow}>↗</span>
          </a>
          <a
            className="github-link"
            href={study.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            <GitHubMark /> View GitHub{" "}
            <span className={styles.externalArrow}>↗</span>
          </a>
        </div>
      </header>
      <section className={styles.stack} aria-label="Technology used">
        {study.stack.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>
      <section
        className={styles.story}
        aria-label={`${study.title} project story`}
      >
        {study.sections.map((section, index) => (
          <article key={section.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </div>
          </article>
        ))}
      </section>
      <footer className={styles.footer}>
        <p>Want to talk about the build?</p>
        <a href="mailto:jamal.ferguson1990@gmail.com">
          Email Jamal <span className={styles.externalArrow}>↗</span>
        </a>
      </footer>
    </main>
  );
}
