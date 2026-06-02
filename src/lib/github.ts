/**
 * GitHub Contents API helpers.
 * Used by the admin to read/write JSON files directly to the repo,
 * which serves as the zero-infrastructure CMS data store.
 */

const GITHUB_API = "https://api.github.com";

const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const filePath = process.env.GITHUB_FILE_PATH ?? "data/projects.json";
const portfolioFilePath = process.env.GITHUB_PORTFOLIO_FILE_PATH ?? "data/portfolio.json";
const branch = process.env.GITHUB_BRANCH ?? "main";

const DEFAULT_CONTENT = JSON.stringify(
  {
    projects: [
      {
        id: "selecta-1",
        clientLabel: "SELECTA x CUTS STUDIO",
        title: "THREE FLAVOR UNIVERSES. FULL CGI. BROADCAST-READY.",
        description:
          "Cinema-quality CGI montages for three hero flavors — Crunchy Choco Malt, Avocado Dream, and New York Cheesecake. Full pipeline from Houdini simulations to Blender rendering to After Effects compositing. Delivered on a tight broadcast deadline.",
        imageSrc: "/videos/work1.png",
        stat1Value: "3",
        stat1Label: "campaigns",
        stat2Value: "FULL",
        stat2Label: "CGI Pipeline",
        active: true,
        order: 0,
      },
      {
        id: "selecta-2",
        clientLabel: "SELECTA x CUTS STUDIO",
        title: "THREE FLAVOR UNIVERSES. FULL CGI. BROADCAST-READY.",
        description:
          "Cinema-quality CGI montages for three hero flavors — Crunchy Choco Malt, Avocado Dream, and New York Cheesecake. Full pipeline from Houdini simulations to Blender rendering to After Effects compositing. Delivered on a tight broadcast deadline.",
        imageSrc: "/videos/work2.png",
        stat1Value: "3",
        stat1Label: "campaigns",
        stat2Value: "FULL",
        stat2Label: "CGI Pipeline",
        active: true,
        order: 1,
      },
    ],
  },
  null,
  2
);

function headers() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

interface GitHubFileResponse {
  content: string;
  sha: string;
  encoding: string;
}

/**
 * Fetch the current file content + sha (needed for updates).
 * If the file doesn't exist yet, seeds it with default content and returns that.
 */
export async function getProjectsFile(): Promise<{
  content: string;
  sha: string;
}> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
  const res = await fetch(url, { headers: headers(), cache: "no-store" });

  // File doesn't exist yet — create it with default content
  if (res.status === 404) {
    await updateProjectsFile(DEFAULT_CONTENT, "", "chore: initialise projects.json");
    // Re-fetch to get the sha
    const res2 = await fetch(url, { headers: headers(), cache: "no-store" });
    if (!res2.ok) throw new Error(`GitHub API error after seed: ${res2.status}`);
    const data2 = (await res2.json()) as GitHubFileResponse;
    const decoded2 = Buffer.from(data2.content.replace(/\n/g, ""), "base64").toString("utf-8");
    return { content: decoded2, sha: data2.sha };
  }

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as GitHubFileResponse;
  const decoded = Buffer.from(
    data.content.replace(/\n/g, ""),
    "base64"
  ).toString("utf-8");

  return { content: decoded, sha: data.sha };
}

// ─── Portfolio file helpers ───────────────────────────────────────────────────

export interface PortfolioItem {
  id: string;
  title: string;
  tags: string;
  imageSrc: string;
  url?: string;
  order: number;
}

const DEFAULT_PORTFOLIO_CONTENT = JSON.stringify(
  {
    items: [
      { id: "cherry-on-top", title: "CHERRY ON TOP SINGAPORE 3D BILLBOARD", tags: "3D CGI PRODUCTION", imageSrc: "/projects/project2.png", url: "", order: 0 },
      { id: "nekocee-marian", title: "NEKOCEE BY KATH MELENDEZ WITH MARIAN RIVERA DANTES", tags: "VFX / COMPOSITING", imageSrc: "/projects/project1.png", url: "", order: 1 },
      { id: "vaseline-gambit", title: "VASELINE GAMBIT X MICH", tags: "VFX / COMPOSITING", imageSrc: "/projects/project3.png", url: "", order: 2 },
      { id: "diatabs-advance", title: "DIATABS ADVANCE", tags: "3D CGI PRODUCTION", imageSrc: "/projects/project4.png", url: "", order: 3 },
      { id: "michelle-dee", title: "MICHELLE DEE GOWN TRANSFORMATION VFX BREAKDOWN", tags: "3D CGI PRODUCTION / EDITING & VFX / COMPOSITING", imageSrc: "/projects/project5.png", url: "", order: 4 },
      { id: "bliss-lux", title: "BLISS LUX FRAGRANCE", tags: "3D CGI PRODUCTION", imageSrc: "/projects/project6.png", url: "", order: 5 },
      { id: "locally", title: "LOCALLY 3D BILLBOARD", tags: "3D CGI PRODUCTION / VFX / COMPOSITING", imageSrc: "/projects/project7.png", url: "", order: 6 },
      { id: "selecta-beat-the-init", title: "SELECTA BEAT THE INIT", tags: "3D CGI PRODUCTION", imageSrc: "/projects/project8.png", url: "", order: 7 },
      { id: "oppo-find", title: "OPPO FIND N2 BILLBOARD", tags: "VFX / COMPOSITING", imageSrc: "/projects/project9.png", url: "", order: 8 },
      { id: "sm-axcs", title: "SM AXCS CGI BAG", tags: "3D CGI PRODUCTION", imageSrc: "/projects/project10.png", url: "", order: 9 },
    ],
  },
  null,
  2
);

export async function getPortfolioFile(): Promise<{ content: string; sha: string }> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${portfolioFilePath}?ref=${branch}`;
  const res = await fetch(url, { headers: headers(), cache: "no-store" });

  if (res.status === 404) {
    await updatePortfolioFile(DEFAULT_PORTFOLIO_CONTENT, "", "chore: initialise portfolio.json");
    const res2 = await fetch(url, { headers: headers(), cache: "no-store" });
    if (!res2.ok) throw new Error(`GitHub API error after seed: ${res2.status}`);
    const data2 = (await res2.json()) as GitHubFileResponse;
    const decoded2 = Buffer.from(data2.content.replace(/\n/g, ""), "base64").toString("utf-8");
    return { content: decoded2, sha: data2.sha };
  }

  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);

  const data = (await res.json()) as GitHubFileResponse;
  const decoded = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8");
  return { content: decoded, sha: data.sha };
}

export async function updatePortfolioFile(
  newContent: string,
  sha: string,
  commitMessage = "chore: update portfolio items"
): Promise<void> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${portfolioFilePath}`;
  const encoded = Buffer.from(newContent, "utf-8").toString("base64");

  const body: Record<string, string> = { message: commitMessage, content: encoded, branch };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);
}

// ─── Testimonials file helpers ───────────────────────────────────────────────

const testimonialFilePath = process.env.GITHUB_TESTIMONIALS_FILE_PATH ?? "data/testimonials.json";

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  affiliation: string;
  order: number;
}

const DEFAULT_TESTIMONIALS_CONTENT = JSON.stringify(
  {
    testimonials: [
      {
        id: "t-1",
        quote: "Outstanding job and exceeded all expectations. It was a pleasure to work with them on a second-first project and am looking forward to start the next one asap.",
        author: "Larisa Pruski",
        affiliation: "CEO, ABS-CBN",
        order: 0,
      },
      {
        id: "t-2",
        quote: "MichHub brought our campaign to life in a way we couldn't have imagined. The quality was cinema-grade and the team was incredibly professional throughout.",
        author: "James Reyes",
        affiliation: "Brand Manager, Unilever",
        order: 1,
      },
      {
        id: "t-3",
        quote: "From the first brief to final delivery, every checkpoint was met with precision. The visuals they produced set a new standard for our brand.",
        author: "Sofia Tan",
        affiliation: "Creative Lead, MSI",
        order: 2,
      },
    ],
  },
  null,
  2
);

export async function getTestimonialsFile(): Promise<{ content: string; sha: string }> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${testimonialFilePath}?ref=${branch}`;
  const res = await fetch(url, { headers: headers(), cache: "no-store" });

  if (res.status === 404) {
    await updateTestimonialsFile(DEFAULT_TESTIMONIALS_CONTENT, "", "chore: initialise testimonials.json");
    const res2 = await fetch(url, { headers: headers(), cache: "no-store" });
    if (!res2.ok) throw new Error(`GitHub API error after seed: ${res2.status}`);
    const data2 = (await res2.json()) as GitHubFileResponse;
    const decoded2 = Buffer.from(data2.content.replace(/\n/g, ""), "base64").toString("utf-8");
    return { content: decoded2, sha: data2.sha };
  }

  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);

  const data = (await res.json()) as GitHubFileResponse;
  const decoded = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8");
  return { content: decoded, sha: data.sha };
}

export async function updateTestimonialsFile(
  newContent: string,
  sha: string,
  commitMessage = "chore: update testimonials"
): Promise<void> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${testimonialFilePath}`;
  const encoded = Buffer.from(newContent, "utf-8").toString("base64");

  const body: Record<string, string> = { message: commitMessage, content: encoded, branch };
  if (sha) body.sha = sha;

  const res = await fetch(url, { method: "PUT", headers: headers(), body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);
}

// ─── Projects file helpers ────────────────────────────────────────────────────

/** Commit an updated projects.json back to the repo. */
export async function updateProjectsFile(
  newContent: string,
  sha: string,
  commitMessage = "chore: update featured projects"
): Promise<void> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`;
  const encoded = Buffer.from(newContent, "utf-8").toString("base64");

  const body: Record<string, string> = {
    message: commitMessage,
    content: encoded,
    branch,
  };
  // sha is required for updates, omitted for creates
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);
  }
}
