export type CaseStudy = {
  slug: string;
  index: string;
  title: string;
  summary: string;
  eyebrow: string;
  accent: string;
  liveUrl: string;
  githubUrl: string;
  stack: string[];
  sections: { title: string; body: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "antonios-pizza",
    index: "01",
    title: "Antonio's Pizza",
    eyebrow: "Ordering experience",
    summary:
      "A playful pizza builder that turns a familiar checkout flow into a visual, hands on interaction.",
    accent: "#ff806f",
    liveUrl: "https://antonios-pizza.vercel.app",
    githubUrl: "https://github.com/Miingo954/Antonio-s-Pizza",
    stack: ["React", "Motion", "Routing", "Responsive UI"],
    sections: [
      {
        title: "The challenge",
        body: "Make a multi step food order feel clear without losing the personality of a neighborhood pizza shop. The interface needed to handle choices, pricing, cart state, and navigation while keeping the experience fun.",
      },
      {
        title: "My role",
        body: "I designed and built the frontend experience, including the pizza customization flow, animated cutting board, cart interactions, and routed ordering screens.",
      },
      {
        title: "Technical approach",
        body: "I separated the ordering journey into reusable React views and shared state. Immediate visual feedback connects each selection to the pizza and cart, while responsive layouts keep the flow usable on smaller screens.",
      },
      {
        title: "Hardest problem",
        body: "The main challenge was keeping customization state and pricing understandable across the builder and cart. I focused on predictable updates and visible feedback so users always know what changed.",
      },
      {
        title: "Result",
        body: "The finished project is a complete interactive ordering concept with a distinctive visual system and a clear path from customization to cart.",
      },
      {
        title: "What I learned",
        body: "This project strengthened my understanding of state driven interfaces and showed me how motion can explain an interaction instead of simply decorating it.",
      },
    ],
  },
  {
    slug: "ruff-pepper-shrimp",
    index: "02",
    title: "RUFF Pepper Shrimp",
    eyebrow: "Family business story",
    summary:
      "A responsive brand experience rooted in Jamaica, family memory, flavor, and the story behind the food.",
    accent: "#f6dc69",
    liveUrl: "https://ruff-pepper-shrimp.vercel.app",
    githubUrl: "https://github.com/Miingo954/RUFF-Pepper-Shrimp",
    stack: ["Brand design", "Storytelling", "Responsive UI", "Frontend"],
    sections: [
      {
        title: "The challenge",
        body: "Present a family food business as more than a menu. The site needed to communicate where the recipe came from, why it matters, and what makes the experience memorable.",
      },
      {
        title: "My role",
        body: "I shaped the visual direction and built the responsive frontend, combining the product, family story, and Jamaican influence into one cohesive experience.",
      },
      {
        title: "Technical approach",
        body: "The page uses strong editorial sections, intentional image placement, and responsive type to guide visitors through the story. Components are organized around content rather than generic page blocks.",
      },
      {
        title: "Hardest problem",
        body: "The hardest part was balancing atmosphere with clarity. I refined the hierarchy so the visuals build emotion while the business and product remain easy to understand.",
      },
      {
        title: "Result",
        body: "The final experience gives the brand its own voice and makes its origin story a central part of the product instead of an afterthought.",
      },
      {
        title: "What I learned",
        body: "I learned to treat content and visual identity as part of the interface architecture, especially when a project depends on authenticity and personal history.",
      },
    ],
  },
  {
    slug: "netflix-streaming",
    index: "03",
    title: "Netflix Streaming Clone",
    eyebrow: "API driven application",
    summary:
      "A responsive streaming interface with live TMDB data, trailers, title details, episode views, and a saved list flow.",
    accent: "#e54848",
    liveUrl: "https://netflix-clone-react-five-zeta.vercel.app/",
    githubUrl: "https://github.com/Miingo954/netflix-clone-react",
    stack: ["React", "TMDB API", "Vite", "Routing"],
    sections: [
      {
        title: "The challenge",
        body: "Build a recognizable streaming experience around live data while handling several content types, routes, detail states, and responsive layouts.",
      },
      {
        title: "My role",
        body: "I built the React frontend and connected it to TMDB data for browsing, trailers, title pages, episode views, and saved titles.",
      },
      {
        title: "Technical approach",
        body: "Reusable content components handle changing API data across rows and detail views. Routed pages give titles their own destination, while loading and empty states keep the interface understandable as data changes.",
      },
      {
        title: "Hardest problem",
        body: "The key challenge was making inconsistent external data feel consistent inside one interface. I added defensive rendering and reusable presentation rules for missing artwork, metadata, and media.",
      },
      {
        title: "Result",
        body: "The project works as a complete streaming product study rather than a single static screen, with browsing, discovery, detail, and saved list interactions.",
      },
      {
        title: "What I learned",
        body: "I gained practical experience shaping API responses into resilient UI and managing the relationship between routes, asynchronous data, and reusable components.",
      },
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
