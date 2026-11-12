import Image from "next/image";
import "./mobile-projects.css";

export function MobileProjectPhone({ visual, src }: { visual: string; src: string }) {
  const safeTop = ["pizza", "disney", "ruff"].includes(visual);
  return (
    <div className={`exclusive-phone ${safeTop ? "exclusive-phone--safe-top" : ""} ${visual === "google" ? "exclusive-phone--light" : ""}`} aria-hidden="true">
      <div className="exclusive-phone-screen">
        <Image src={src} alt="" width={390} height={844} sizes="(max-width: 480px) 76px, 145px" />
      </div>
    </div>
  );
}

export function MobileProjectMotion({ visual }: { visual: string }) {
  if (visual === "disney") {
    return (
      <div className="exclusive-motion exclusive-disney" aria-hidden="true">
        <picture>
          <source media="(prefers-reduced-motion: reduce)" srcSet="/doodle/assets/disney-portfolio-final.png" />
          {/* Preserve the original animated WebP rather than flattening its frames. */}
          <img src="/doodle/assets/disney-castle-route-loop.webp" alt="" loading="lazy" />
        </picture>
      </div>
    );
  }
  if (visual !== "google") return null;
  return (
    <div className="exclusive-motion google-preview" aria-hidden="true">
      <Image src="/doodle/assets/google-search-clone-portfolio.png" alt="" fill sizes="(max-width: 768px) 75vw, 1px" className="google-preview__image" />
      <div className="google-home-scene">
        <span className="google-mini-nav">Gmail&nbsp;&nbsp;&nbsp; Images&nbsp;&nbsp;&nbsp; <b>J</b></span>
        <span className="google-wordmark"><i>G</i><i>o</i><i>o</i><i>g</i><i>l</i><i>e</i></span>
        <span className="google-home-search"><em /><b>Lewis Hamilton Ferrari F40 restoration</b><i /><strong /></span>
        <span className="google-home-actions"><b>Google Search</b><b>I&apos;m Feeling Lucky</b></span>
      </div>
      <span className="google-load-line"><i /></span>
      <span className="google-scene-label google-scene-label--search">01 · SEARCH</span>
      <span className="google-scene-label google-scene-label--results">02 · EXPLORE RESULTS</span>
    </div>
  );
}
