import Image from "next/image";
import "./mobile-projects.css";

export function MobileProjectPhone({ visual, src }: { visual: string; src: string }) {
  const safeTop = ["pizza", "disney", "ruff"].includes(visual);
  return (
    <div className={`exclusive-phone ${safeTop ? "exclusive-phone--safe-top" : ""} ${visual === "google" ? "exclusive-phone--light" : ""}`} aria-hidden="true">
      <div className="exclusive-phone-screen">
        <Image src={src} alt="" width={390} height={844} sizes="(max-width: 480px) 76px, (max-width: 768px) 145px, 190px" />
      </div>
    </div>
  );
}

export function MobileProjectMotion({ visual }: { visual: string }) {
  if (visual === "disney") {
    return (
      <div className="exclusive-motion exclusive-disney" aria-hidden="true">
        <div className="disney-live-preview" aria-label="Live animated preview of the Disney castle landing route">
          <iframe
            src="https://disney-plus-clone-react-sepia.vercel.app/#/brand/disney"
            title="Disney Plus castle route animated preview"
            loading="lazy"
            tabIndex={-1}
          />
        </div>
      </div>
    );
  }
  if (visual !== "google") return null;
  return (
    <div className="exclusive-motion google-preview" aria-hidden="true">
      <Image src="/doodle/assets/google-search-clone-portfolio.png" alt="" fill sizes="(max-width: 768px) 75vw, 70vw" className="google-preview__image" />
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
