"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  clientLabel: string;
  title: string;
  description: string;
  imageSrc: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  active: boolean;
  order: number;
}

const EMPTY_PROJECT: Omit<Project, "id" | "active" | "order"> = {
  clientLabel: "",
  title: "",
  description: "",
  imageSrc: "",
  stat1Value: "",
  stat1Label: "",
  stat2Value: "",
  stat2Label: "",
};

function generateId() {
  return `project-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Project Form ──────────────────────────────────────────────────────────────

interface ProjectFormProps {
  initial: Project;
  onSave: (p: Project) => void;
  onCancel: () => void;
}

function ProjectForm({ initial, onSave, onCancel }: ProjectFormProps) {
  const [form, setForm] = useState<Project>(initial);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [localPreview, setLocalPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set(field: keyof Project) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);

    // Show local preview immediately — no need to wait for GitHub
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      setForm((prev) => ({ ...prev, imageSrc: data.path }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
      setLocalPreview("");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]";
  const labelCls =
    "mb-1 block text-xs font-semibold uppercase tracking-widest text-white/50";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Client Label</label>
          <input
            className={inputCls}
            value={form.clientLabel}
            onChange={set("clientLabel")}
            placeholder="BRAND x STUDIO"
            required
          />
        </div>

        {/* Image upload */}
        <div>
          <label className={labelCls}>Project Image</label>

          {/* Preview — local object URL shown immediately, path used after upload */}
          {(localPreview || form.imageSrc) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={localPreview || form.imageSrc}
              alt="preview"
              className="mb-2 h-24 w-full rounded-xl object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}

          {/* Drop zone / file picker */}
          <label
            className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-4 py-3 text-center text-xs transition ${
              uploading
                ? "border-white/20 text-white/30"
                : "border-white/20 text-white/40 hover:border-[#F97316]/50 hover:text-[#F97316]"
            }`}
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Uploading…
              </span>
            ) : (
              <>
                <span className="text-base leading-none">↑</span>
                <span>{form.imageSrc ? "Replace image" : "Upload image"}</span>
                <span className="text-white/25">PNG, JPG, WEBP — max 5 MB</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading}
              onChange={handleFileChange}
            />
          </label>

          {uploadError && (
            <p className="mt-1.5 text-xs text-red-400">{uploadError}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelCls}>Title</label>
        <input
          className={inputCls}
          value={form.title}
          onChange={set("title")}
          placeholder="Project headline in ALL CAPS"
          required
        />
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={3}
          value={form.description}
          onChange={set("description")}
          placeholder="Brief project description"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Stat 1 — Value</label>
          <input
            className={inputCls}
            value={form.stat1Value}
            onChange={set("stat1Value")}
            placeholder="3"
            required
          />
        </div>
        <div>
          <label className={labelCls}>Stat 1 — Label</label>
          <input
            className={inputCls}
            value={form.stat1Label}
            onChange={set("stat1Label")}
            placeholder="campaigns"
            required
          />
        </div>
        <div>
          <label className={labelCls}>Stat 2 — Value</label>
          <input
            className={inputCls}
            value={form.stat2Value}
            onChange={set("stat2Value")}
            placeholder="FULL"
            required
          />
        </div>
        <div>
          <label className={labelCls}>Stat 2 — Label</label>
          <input
            className={inputCls}
            value={form.stat2Label}
            onChange={set("stat2Label")}
            placeholder="CGI Pipeline"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploading}
          className="rounded-xl bg-[#F97316] px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#ea6c0a] disabled:opacity-50"
        >
          Save Project
        </button>
      </div>
    </form>
  );
}

// ─── Project Card (admin preview) ─────────────────────────────────────────────

interface AdminCardProps {
  project: Project;
  activeCount: number;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

function AdminCard({
  project,
  activeCount,
  onEdit,
  onToggleActive,
  onDelete,
}: AdminCardProps) {
  const canActivate = project.active || activeCount < 2;

  return (
    <div
      className={`rounded-2xl border p-5 transition ${
        project.active
          ? "border-[#F97316]/40 bg-[#F97316]/5"
          : "border-white/10 bg-white/3"
      }`}
    >
      {/* Image preview */}
      {project.imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.imageSrc}
          alt={project.title}
          className="mb-3 h-28 w-full rounded-xl object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}

      <div className="mb-1 flex items-start justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#F97316]">
          {project.clientLabel}
        </p>
        {project.active && (
          <span className="shrink-0 rounded-full bg-[#F97316]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F97316]">
            Live
          </span>
        )}
      </div>

      <p className="mb-2 text-sm font-bold leading-snug text-white">
        {project.title}
      </p>
      <p className="mb-3 line-clamp-2 text-xs text-white/50">
        {project.description}
      </p>

      <div className="mb-4 flex gap-3 text-xs text-white/60">
        <span>
          <strong className="text-[#F97316]">{project.stat1Value}</strong>{" "}
          {project.stat1Label}
        </span>
        <span>
          <strong className="text-[#F97316]">{project.stat2Value}</strong>{" "}
          {project.stat2Label}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onEdit}
          className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10"
        >
          Edit
        </button>
        <button
          onClick={onToggleActive}
          disabled={!canActivate}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
            project.active
              ? "border border-red-500/40 text-red-400 hover:bg-red-500/10"
              : "border border-green-500/40 text-green-400 hover:bg-green-500/10"
          }`}
          title={
            !canActivate ? "Deactivate another project first" : undefined
          }
        >
          {project.active ? "Deactivate" : "Set Live"}
        </button>
        <button
          onClick={onDelete}
          className="ml-auto rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400/70 transition hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showToast = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 4000);
    },
    []
  );

  // Load all projects
  useEffect(() => {
    fetch("/api/admin/projects")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Failed to load projects");
        if (!Array.isArray(data)) throw new Error("Unexpected response format");
        setProjects(data);
      })
      .catch((err) => showToast(err.message ?? "Failed to load projects", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const activeCount = projects.filter((p) => p.active).length;

  // Save full projects array to GitHub
  async function saveAll(updated: Project[]) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: updated }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setProjects(updated);
      showToast("Saved! Changes will be live in ~1 minute.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(updated: Project) {
    const next = projects.map((p) => (p.id === updated.id ? updated : p));
    saveAll(next);
    setEditingProject(null);
  }

  function handleAdd(project: Project) {
    const next = [
      ...projects,
      { ...project, id: generateId(), active: false, order: projects.length },
    ];
    saveAll(next);
    setShowAddForm(false);
  }

  function handleToggleActive(id: string) {
    const target = projects.find((p) => p.id === id);
    if (!target) return;

    if (!target.active && activeCount >= 2) return; // guard

    const next = projects.map((p) =>
      p.id === id ? { ...p, active: !p.active } : p
    );
    saveAll(next);
  }

  function handleDelete(id: string) {
    const next = projects.filter((p) => p.id !== id);
    saveAll(next);
    setDeleteConfirm(null);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  // ── Render ──

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <p className="text-sm text-white/40">Loading…</p>
      </div>
    );
  }

  const liveProjects = projects.filter((p) => p.active);
  const inactiveProjects = projects.filter((p) => !p.active);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 max-w-sm rounded-xl px-5 py-3 text-sm font-semibold shadow-lg ${
            toast.type === "success"
              ? "bg-green-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="font-display text-lg font-bold uppercase italic tracking-widest text-white">
              MICHHUB
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#F97316]">
              CMS — Proof of Impact
            </p>
          </div>
          <div className="flex items-center gap-4">
            {saving && (
              <span className="flex items-center gap-1.5 text-xs text-white/40">
                <svg
                  className="h-3.5 w-3.5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Saving…
              </span>
            )}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10"
            >
              View Site ↗
            </a>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/50 transition hover:bg-white/10"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Info banner */}
        <div className="mb-8 rounded-xl border border-white/10 bg-white/3 px-5 py-4 text-sm text-white/50">
          <strong className="text-white/80">How it works:</strong> Mark exactly
          2 projects as <span className="text-[#F97316]">Live</span> — those are
          the ones visitors see on the site. Changes commit to GitHub and go live
          in ~1 minute.
        </div>

        {/* Live Projects */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">
              Live on Site{" "}
              <span className="text-[#F97316]">({liveProjects.length}/2)</span>
            </h2>
          </div>

          {liveProjects.length === 0 ? (
            <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/30">
              No active projects. Set 2 projects as Live below.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {liveProjects.map((p) => (
                <AdminCard
                  key={p.id}
                  project={p}
                  activeCount={activeCount}
                  onEdit={() => setEditingProject(p)}
                  onToggleActive={() => handleToggleActive(p.id)}
                  onDelete={() => setDeleteConfirm(p.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* All Projects */}
        {inactiveProjects.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/40">
              Project Library (Inactive)
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inactiveProjects.map((p) => (
                <AdminCard
                  key={p.id}
                  project={p}
                  activeCount={activeCount}
                  onEdit={() => setEditingProject(p)}
                  onToggleActive={() => handleToggleActive(p.id)}
                  onDelete={() => setDeleteConfirm(p.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Add New Project */}
        <section>
          {showAddForm ? (
            <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
              <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-white/80">
                Add New Project
              </h2>
              <ProjectForm
                initial={{
                  id: "",
                  active: false,
                  order: projects.length,
                  ...EMPTY_PROJECT,
                }}
                onSave={handleAdd}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 py-5 text-sm font-semibold text-white/40 transition hover:border-[#F97316]/40 hover:text-[#F97316]"
            >
              <span className="text-lg leading-none">+</span> Add New Project to
              Library
            </button>
          )}
        </section>
      </main>

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
            <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-white/80">
              Edit Project
            </h2>
            <ProjectForm
              initial={editingProject}
              onSave={handleEdit}
              onCancel={() => setEditingProject(null)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111] p-6 text-center shadow-2xl">
            <p className="mb-2 text-base font-bold text-white">
              Delete this project?
            </p>
            <p className="mb-6 text-sm text-white/50">
              This cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
