/**
 * GitHub Contents API helpers.
 * Used by the admin to read/write projects.json directly to the repo,
 * which serves as the zero-infrastructure CMS data store.
 */

const GITHUB_API = "https://api.github.com";

const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const filePath = process.env.GITHUB_FILE_PATH ?? "data/projects.json";
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
