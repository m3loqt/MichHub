"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ─── Testimonial types ────────────────────────────────────────────────────────

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  affiliation: string;
  order: number;
}

// ─── Portfolio types ───────────────────────────────────────────────────────────

interface PortfolioItem {
  id: string;
  title: string;
  tags: string;
  imageSrc: string;
  url?: string;
  order: number;
}

const EMPTY_PORTFOLIO_ITEM: Omit<PortfolioItem, "id" | "order"> = {
  title: "",
  tags: "",
  imageSrc: "",
  url: "",
};

function generatePortfolioId() {
  return `portfolio-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Portfolio Form ────────────────────────────────────────────────────────────

interface PortfolioFormProps {
  initial: PortfolioItem;
  onSave: (item: PortfolioItem) => void;
  onCancel: () => void;
}

function PortfolioForm({ initial, onSave, onCancel }: PortfolioFormProps) {
  const [form, setForm] = useState<PortfolioItem>(initial);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [localPreview, setLocalPreview] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set(field: keyof PortfolioItem) {
    return (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setLocalPreview(URL.createObjectURL(file));
    setPendingFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    let imageSrc = form.imageSrc;

    if (pendingFile) {
      setUploading(true);
      setUploadError("");
      try {
        const fd = new FormData();
        fd.append("file", pendingFile);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        imageSrc = data.path;
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    onSave({ ...form, imageSrc });
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]";
  const labelCls =
    "mb-1 block text-xs font-semibold uppercase tracking-widest text-white/50";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Title</label>
          <input
            className={inputCls}
            value={form.title}
            onChange={set("title")}
            placeholder="PROJECT TITLE IN ALL CAPS"
            required
          />
        </div>

        {/* Image upload */}
        <div>
          <label className={labelCls}>Image</label>
          {(localPreview || form.imageSrc) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={localPreview || form.imageSrc}
              alt="preview"
              className="mb-2 h-36 w-full rounded-xl object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/20 px-4 py-3 text-center text-xs text-white/40 transition hover:border-[#F97316]/50 hover:text-[#F97316]">
            <>
              <span className="text-base leading-none">↑</span>
              <span>{pendingFile ? pendingFile.name : (form.imageSrc ? "Replace image" : "Upload image")}</span>
              <span className="text-white/25">PNG, JPG, WEBP — max 5 MB · saved on publish</span>
            </>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading}
              onChange={handleFileChange}
            />
          </label>
          {uploadError && <p className="mt-1.5 text-xs text-red-400">{uploadError}</p>}
        </div>
      </div>

      <div>
        <label className={labelCls}>Tags</label>
        <input
          className={inputCls}
          value={form.tags}
          onChange={set("tags")}
          placeholder="3D CGI PRODUCTION / VFX / COMPOSITING"
          required
        />
      </div>

      <div>
        <label className={labelCls}>URL (optional)</label>
        <input
          className={inputCls}
          value={form.url ?? ""}
          onChange={set("url")}
          placeholder="https://youtube.com/watch?v=..."
          type="url"
        />
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
          {uploading ? "Uploading…" : "Save Item"}
        </button>
      </div>
    </form>
  );
}

// ─── Portfolio Admin Card ──────────────────────────────────────────────────────

interface PortfolioAdminCardProps {
  item: PortfolioItem;
  onEdit: () => void;
  onDelete: () => void;
}

function PortfolioAdminCard({ item, onEdit, onDelete }: PortfolioAdminCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 p-5 transition">
      {item.imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageSrc}
          alt={item.title}
          className="mb-3 h-36 w-full rounded-xl object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}
      <p className="mb-1 text-sm font-bold leading-snug text-white line-clamp-2">{item.title}</p>
      <p className="mb-1 text-[11px] text-white/40 uppercase tracking-widest">{item.tags}</p>
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 block truncate text-[11px] text-[#F97316]/70 hover:text-[#F97316]"
        >
          {item.url}
        </a>
      )}
      <div className="mt-3 flex gap-2">
        <button
          onClick={onEdit}
          className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10"
        >
          Edit
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

interface Project {
  id: string;
  clientLabel: string;
  title: string;
  description: string;
  imageSrc: string;
  releaseDate: string;
  url?: string;
  active: boolean;
  order: number;
}

const EMPTY_PROJECT: Omit<Project, "id" | "active" | "order"> = {
  clientLabel: "",
  title: "",
  description: "",
  imageSrc: "",
  releaseDate: "",
  url: "",
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
  // Pending file is held locally — GitHub commit only happens on Save
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set(field: keyof Project) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    // Show a local blob preview immediately — no GitHub push yet
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setPendingFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    let imageSrc = form.imageSrc;

    // Only push to GitHub when the user actually hits Save
    if (pendingFile) {
      setUploading(true);
      setUploadError("");
      try {
        const fd = new FormData();
        fd.append("file", pendingFile);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        imageSrc = data.path;
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
        setUploading(false);
        return; // abort save — don't call onSave with a broken path
      } finally {
        setUploading(false);
      }
    }

    onSave({ ...form, imageSrc });
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
              className="mb-2 h-48 w-full rounded-xl object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}

          {/* Drop zone / file picker */}
          <label
            className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/20 px-4 py-3 text-center text-xs text-white/40 transition hover:border-[#F97316]/50 hover:text-[#F97316]"
          >
            <>
              <span className="text-base leading-none">↑</span>
              <span>{pendingFile ? pendingFile.name : (form.imageSrc ? "Replace image" : "Upload image")}</span>
              <span className="text-white/25">PNG, JPG, WEBP — max 5 MB · saved on publish</span>
            </>
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

      <div>
        <label className={labelCls}>Date of Release</label>
        <input
          className={inputCls}
          value={form.releaseDate}
          onChange={set("releaseDate")}
          placeholder="March 2024"
          required
        />
      </div>

      <div>
        <label className={labelCls}>Project URL <span className="normal-case text-white/30">(optional — opens on card click)</span></label>
        <input
          className={inputCls}
          type="url"
          value={form.url ?? ""}
          onChange={set("url")}
          placeholder="https://..."
        />
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
          {uploading ? "Uploading…" : "Save Project"}
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
  const canActivate = project.active || activeCount < 4;

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
          className="mb-3 h-48 w-full rounded-xl object-cover"
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

      <div className="mb-4 text-xs text-white/60">
        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">Date of Release</span>
        <p className="mt-0.5 font-bold text-[#F97316]">{project.releaseDate}</p>
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
            !canActivate ? "Deactivate another project first (max 4 live)" : undefined
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
  const [tab, setTab] = useState<"projects" | "portfolio" | "testimonials">("projects");

  // ── Projects state ──
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

  // ── Testimonials state ──
  const [draftTestimonials, setDraftTestimonials] = useState<Testimonial[]>([]);
  const [savedTestimonials, setSavedTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [testimonialsSaving, setTestimonialsSaving] = useState(false);
  const [expandedTestimonialId, setExpandedTestimonialId] = useState<string | null>(null);
  const [testimonialPreviewIndex, setTestimonialPreviewIndex] = useState(0);
  const [previewFading, setPreviewFading] = useState(false);

  // ── Portfolio state ──
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioSaving, setPortfolioSaving] = useState(false);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<PortfolioItem | null>(null);
  const [showAddPortfolioForm, setShowAddPortfolioForm] = useState(false);
  const [deletePortfolioConfirm, setDeletePortfolioConfirm] = useState<string | null>(null);

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

  // Load testimonials when tab switches
  useEffect(() => {
    if (tab !== "testimonials" || draftTestimonials.length > 0) return;
    setTestimonialsLoading(true);
    fetch("/api/admin/testimonials")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Failed to load testimonials");
        if (!Array.isArray(data)) throw new Error("Unexpected response format");
        setDraftTestimonials(data);
        setSavedTestimonials(data);
      })
      .catch((err) => showToast(err.message ?? "Failed to load testimonials", "error"))
      .finally(() => setTestimonialsLoading(false));
  }, [tab, draftTestimonials.length, showToast]);

  // Load portfolio items when tab switches to portfolio
  useEffect(() => {
    if (tab !== "portfolio" || portfolioItems.length > 0) return;
    setPortfolioLoading(true);
    fetch("/api/admin/portfolio")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Failed to load portfolio");
        if (!Array.isArray(data)) throw new Error("Unexpected response format");
        setPortfolioItems(data);
      })
      .catch((err) => showToast(err.message ?? "Failed to load portfolio", "error"))
      .finally(() => setPortfolioLoading(false));
  }, [tab, portfolioItems.length, showToast]);

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

    if (!target.active && activeCount >= 4) return; // guard

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

  // ── Portfolio handlers ──

  async function saveAllPortfolio(updated: PortfolioItem[]) {
    setPortfolioSaving(true);
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updated }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setPortfolioItems(updated);
      showToast("Saved! Changes will be live in ~1 minute.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setPortfolioSaving(false);
    }
  }

  function handleEditPortfolioItem(updated: PortfolioItem) {
    const next = portfolioItems.map((item) => (item.id === updated.id ? updated : item));
    saveAllPortfolio(next);
    setEditingPortfolioItem(null);
  }

  function handleAddPortfolioItem(item: PortfolioItem) {
    const next = [
      ...portfolioItems,
      { ...item, id: generatePortfolioId(), order: portfolioItems.length },
    ];
    saveAllPortfolio(next);
    setShowAddPortfolioForm(false);
  }

  function handleDeletePortfolioItem(id: string) {
    const next = portfolioItems
      .filter((item) => item.id !== id)
      .map((item, i) => ({ ...item, order: i }));
    saveAllPortfolio(next);
    setDeletePortfolioConfirm(null);
  }

  // ── Testimonials handlers ──

  function updateDraftField(id: string, field: keyof Testimonial, value: string) {
    setDraftTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  }

  function toggleTestimonialExpand(id: string, index: number) {
    if (expandedTestimonialId === id) {
      setExpandedTestimonialId(null);
    } else {
      setExpandedTestimonialId(id);
      setTestimonialPreviewIndex(index);
    }
  }

  function addTestimonial() {
    const newT: Testimonial = {
      id: `t-${Date.now()}`,
      quote: "",
      author: "",
      affiliation: "",
      order: draftTestimonials.length,
    };
    setDraftTestimonials((prev) => [...prev, newT]);
    setExpandedTestimonialId(newT.id);
    setTestimonialPreviewIndex(draftTestimonials.length);
  }

  function deleteTestimonial(id: string) {
    setDraftTestimonials((prev) =>
      prev.filter((t) => t.id !== id).map((t, i) => ({ ...t, order: i }))
    );
    if (expandedTestimonialId === id) setExpandedTestimonialId(null);
    setTestimonialPreviewIndex(0);
  }

  async function saveTestimonials() {
    setTestimonialsSaving(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonials: draftTestimonials }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setSavedTestimonials(draftTestimonials);
      showToast("Testimonials saved! Changes will be live in ~1 minute.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setTestimonialsSaving(false);
    }
  }

  const testimonialsHaveChanges =
    JSON.stringify(draftTestimonials) !== JSON.stringify(savedTestimonials);

  useEffect(() => {
    setPreviewFading(true);
    const id = setTimeout(() => setPreviewFading(false), 160);
    return () => clearTimeout(id);
  }, [testimonialPreviewIndex]);

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
      <header className="top-0 z-40 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex flex-col items-start">
            <div className="relative h-30 w-[180px] -ml-[6px]">
              <Image
                src="/logo.svg"
                alt="MichHub"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {(saving || portfolioSaving || testimonialsSaving) && (
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

        {/* Tab switcher */}
        <div className="mb-8 flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1 w-fit">
          <button
            onClick={() => setTab("projects")}
            className={`rounded-lg px-5 py-2 text-xs font-bold uppercase tracking-widest transition ${
              tab === "projects"
                ? "bg-[#F97316] text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            Featured Projects
          </button>
          <button
            onClick={() => setTab("portfolio")}
            className={`rounded-lg px-5 py-2 text-xs font-bold uppercase tracking-widest transition ${
              tab === "portfolio"
                ? "bg-[#F97316] text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setTab("testimonials")}
            className={`rounded-lg px-5 py-2 text-xs font-bold uppercase tracking-widest transition ${
              tab === "testimonials"
                ? "bg-[#F97316] text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            Testimonials
          </button>
        </div>

        {/* ── Testimonials Tab ── */}
        {tab === "testimonials" && (
          testimonialsLoading ? (
            <p className="py-12 text-center text-sm text-white/40">Loading…</p>
          ) : (
            <div className="flex gap-8">

              {/* Left — live preview (sticky) */}
              <div className="w-[52%] shrink-0">
                <div className="sticky top-8">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    Live Preview
                  </p>
                  <div className="flex flex-col items-center border border-[#F97316] px-8 py-10 text-center">
                    <p className="mb-8 text-[13px] font-bold uppercase tracking-[0.22em] text-[#F97316]">
                      WHAT OUR CLIENTS SAY
                    </p>
                    {draftTestimonials.length > 0 && (() => {
                      const t = draftTestimonials[testimonialPreviewIndex] ?? draftTestimonials[0];
                      return (
                        <div
                          className={`w-full transition-opacity duration-150 ${previewFading ? "opacity-0" : "opacity-100"}`}
                        >
                          <div className="min-h-[96px]">
                            <p className="text-[15px] leading-relaxed text-white">
                              {t.quote
                                ? `"${t.quote}"`
                                : <span className="italic text-white/20">No quote yet…</span>}
                            </p>
                          </div>
                          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                            {t.author || <span className="italic text-white/20">Author name</span>}
                          </p>
                          <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-white/40">
                            {t.affiliation || <span className="italic">Position, Company</span>}
                          </p>
                        </div>
                      );
                    })()}
                    <div className="mt-8 flex items-center gap-2.5">
                      {draftTestimonials.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setTestimonialPreviewIndex(i)}
                          className={`rounded-full transition-all duration-200 ${
                            i === testimonialPreviewIndex
                              ? "h-2 w-2 bg-white"
                              : "h-1.5 w-1.5 bg-white/25 hover:bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — accordion edit panels */}
              <div className="flex-1 min-w-0">
                <div className="space-y-2">
                  {draftTestimonials.map((t, i) => {
                    const isOpen = expandedTestimonialId === t.id;
                    const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]";
                    const labelCls = "mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/40";
                    return (
                      <div
                        key={t.id}
                        className={`rounded-xl border transition-colors duration-200 ${
                          isOpen ? "border-[#F97316]/40 bg-[#F97316]/5" : "border-white/10 bg-white/[0.03]"
                        }`}
                      >
                        {/* Accordion header — div to avoid nested <button> */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleTestimonialExpand(t.id, i)}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleTestimonialExpand(t.id, i); } }}
                          className="flex w-full cursor-pointer items-center justify-between px-4 py-3.5 text-left select-none"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-white/30">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="truncate text-sm font-semibold text-white">
                              {t.author || `Testimonial ${i + 1}`}
                            </span>
                            {t.affiliation && (
                              <span className="hidden truncate text-xs text-white/35 sm:block">
                                {t.affiliation}
                              </span>
                            )}
                          </div>
                          <div className="ml-3 flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); deleteTestimonial(t.id); }}
                              className="rounded-lg px-2 py-1 text-[11px] text-red-400/50 transition hover:bg-red-500/10 hover:text-red-400"
                              aria-label="Delete testimonial"
                            >
                              ✕
                            </button>
                            <svg
                              className={`h-4 w-4 text-white/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        {/* Accordion body — CSS grid animate */}
                        <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                          <div className="overflow-hidden">
                            <div className="border-t border-white/10 px-4 pb-5 pt-4 space-y-3">
                              <div>
                                <label className={labelCls}>Quote</label>
                                <textarea
                                  rows={4}
                                  value={t.quote}
                                  onChange={(e) => updateDraftField(t.id, "quote", e.target.value)}
                                  className={`${inputCls} resize-none`}
                                  placeholder="Enter testimonial quote…"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className={labelCls}>Author Name</label>
                                  <input
                                    value={t.author}
                                    onChange={(e) => updateDraftField(t.id, "author", e.target.value)}
                                    className={inputCls}
                                    placeholder="Full name"
                                  />
                                </div>
                                <div>
                                  <label className={labelCls}>Position, Company</label>
                                  <input
                                    value={t.affiliation}
                                    onChange={(e) => updateDraftField(t.id, "affiliation", e.target.value)}
                                    className={inputCls}
                                    placeholder="CEO, Company Name"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add testimonial */}
                <button
                  onClick={addTestimonial}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 py-4 text-sm font-semibold text-white/40 transition hover:border-[#F97316]/40 hover:text-[#F97316]"
                >
                  <span className="text-lg leading-none">+</span> Add Testimonial
                </button>

                {/* Publish + Undo */}
                <div className="mt-6 flex items-center justify-end gap-3">
                  <div
                    className={`transition-all duration-200 ${
                      testimonialsHaveChanges
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-1 pointer-events-none"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setDraftTestimonials(savedTestimonials)}
                      className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/10"
                    >
                      Undo Changes
                    </button>
                  </div>
                  <button
                    onClick={saveTestimonials}
                    disabled={testimonialsSaving}
                    className="rounded-xl bg-[#F97316] px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#ea6c0a] disabled:opacity-50"
                  >
                    {testimonialsSaving ? "Saving…" : "Publish Changes"}
                  </button>
                </div>
              </div>

            </div>
          )
        )}

        {/* ── Portfolio Tab ── */}
        {tab === "portfolio" && (
          <>
            {portfolioLoading ? (
              <p className="py-12 text-center text-sm text-white/40">Loading…</p>
            ) : (
              <>
                {portfolioItems.length > 0 && (
                  <section className="mb-8">
                    <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/80">
                      Portfolio Items{" "}
                      <span className="text-[#F97316]">({portfolioItems.length})</span>
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {portfolioItems
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((item) => (
                          <PortfolioAdminCard
                            key={item.id}
                            item={item}
                            onEdit={() => setEditingPortfolioItem(item)}
                            onDelete={() => setDeletePortfolioConfirm(item.id)}
                          />
                        ))}
                    </div>
                  </section>
                )}

                <section>
                  {showAddPortfolioForm ? (
                    <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
                      <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-white/80">
                        Add Portfolio Item
                      </h2>
                      <PortfolioForm
                        initial={{ id: "", order: portfolioItems.length, ...EMPTY_PORTFOLIO_ITEM }}
                        onSave={handleAddPortfolioItem}
                        onCancel={() => setShowAddPortfolioForm(false)}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddPortfolioForm(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 py-5 text-sm font-semibold text-white/40 transition hover:border-[#F97316]/40 hover:text-[#F97316]"
                    >
                      <span className="text-lg leading-none">+</span> Add Portfolio Item
                    </button>
                  )}
                </section>
              </>
            )}
          </>
        )}

        {/* ── Projects Tab ── */}
        {tab === "projects" && <>

        {/* Live Projects */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">
              Live on Site{" "}
              <span className="text-[#F97316]">({liveProjects.length}/4)</span>
            </h2>
          </div>

          {liveProjects.length === 0 ? (
            <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/30">
              No active projects. Set up to 4 projects as Live below.
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

        </>}
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

      {/* Portfolio Edit Modal */}
      {editingPortfolioItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
            <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-white/80">
              Edit Portfolio Item
            </h2>
            <PortfolioForm
              initial={editingPortfolioItem}
              onSave={handleEditPortfolioItem}
              onCancel={() => setEditingPortfolioItem(null)}
            />
          </div>
        </div>
      )}

      {/* Portfolio Delete Confirm Modal */}
      {deletePortfolioConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111] p-6 text-center shadow-2xl">
            <p className="mb-2 text-base font-bold text-white">Delete this portfolio item?</p>
            <p className="mb-6 text-sm text-white/50">This cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeletePortfolioConfirm(null)}
                className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePortfolioItem(deletePortfolioConfirm)}
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
