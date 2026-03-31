"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  type ComponentType,
  type FormEvent,
  type RefObject,
} from "react";
import { useHorizontalDragScroll } from "@/hooks/useHorizontalDragScroll";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { JumblingMetric } from "@/components/JumblingMetric";
import {
  brandEase,
  cardRevealItem,
  fadeUpItem,
  heroStatsStaggerContainer,
  staggerContainer,
} from "@/lib/motion-presets";
import { Button } from "@/components/ui/button";
import {
  Play,
  Menu,
  X,
  Clapperboard,
  Hammer,
  Briefcase,
  Globe,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  Images,
  Send,
} from "lucide-react";

// ─── Social icon SVGs (not in this lucide-react version) ──────────────────────
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 4l16 16M20 4 4 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M2 3h6.5L21.5 21H15z" />
    </svg>
  );
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const menuSocialLinks: {
  label: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
];

// ─── Data ─────────────────────────────────────────────────────────────────────

const navItems: { label: string; href: string }[] = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Projects", href: "#work" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

const clientLogos = [
  { src: "/clients/barebliss.png", alt: "Bare Bliss" },
  { src: "/clients/bear.png", alt: "Bear Brand" },
  { src: "/clients/hebebeauty.png", alt: "Hebe Beauty" },
  { src: "/clients/kiko.png", alt: "Kiko Milano" },
  { src: "/clients/maybeline.png", alt: "Maybelline" },
  { src: "/clients/mihoyo.png", alt: "HoYoverse" },
  { src: "/clients/mitsubishi.png", alt: "Mitsubishi" },
  { src: "/clients/ml.png", alt: "Mobile Legends" },
  { src: "/clients/msi.png", alt: "MSI" },
  { src: "/clients/nutriasia.png", alt: "NutriAsia" },
  { src: "/clients/oppo.png", alt: "OPPO" },
  { src: "/clients/prulife.png", alt: "Pru Life UK" },
  { src: "/clients/pubg.png", alt: "PUBG" },
  { src: "/clients/rog.png", alt: "ROG" },
  { src: "/clients/sealy.png", alt: "Sealy" },
  { src: "/clients/selecta.png", alt: "Selecta" },
  { src: "/clients/uaap.png", alt: "UAAP" },
  { src: "/clients/unilever.png", alt: "Unilever" },
  { src: "/clients/v.png", alt: "V" },
  { src: "/clients/vaseline.png", alt: "Vaseline" },
  { src: "/clients/you.png", alt: "You C1000" },
] as const;

const problemCards = [
  {
    num: "01",
    title: "VISUALS THAT DON'T CONVERT",
    body: "Significant budgets allocated to campaigns that look competent but fail to stand out. The content gets published, performs below benchmark, and leaves no lasting brand impression in the market. The issue isn't the strategy, it's the execution quality.",
  },
  {
    num: "02",
    title: "VENDORS WHO DON'T UNDERSTAND BRANDS",
    body: "The production brief is clear. The final output is template-level work — generic motion graphics, stock-style compositions, and off-brand colour choices that undermine the identity you spent years building. You paid for custom. You got commodity.",
  },
  {
    num: "03",
    title: "NO CREATIVE CONTINUITY",
    body: "Every campaign feels like it came from a different studio. Inconsistent visual language, shifting aesthetics, and a lack of brand coherence across touchpoints erodes trust and dilutes the equity you've built. Great brands demand a consistent visual standard.",
  },
];

type ProblemCardData = (typeof problemCards)[number];

type ProblemCloneMarker = "leading-03" | "trailing-01";

function centerChildInHorizontalScroller(
  scroller: HTMLElement,
  child: HTMLElement,
) {
  const cardLeft =
    child.getBoundingClientRect().left -
    scroller.getBoundingClientRect().left +
    scroller.scrollLeft;
  const cardCenter = cardLeft + child.offsetWidth / 2;
  scroller.scrollLeft = Math.max(0, cardCenter - scroller.clientWidth / 2);
}

/** Mobile horizontal strips: center slide scales up while scrolling (rAF, no CSS transition). */
function useCarouselCenterScale(
  scrollRef: RefObject<HTMLDivElement | null>,
  reduceMotion: boolean,
) {
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Apply the "center grow + side peeking" effect on mobile + tablet widths.
    const isMobile = () => window.matchMedia("(max-width: 1279px)").matches;
    const motionOk = () =>
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scales = new Map<HTMLElement, number>();
    let rafId = 0;

    const clearScales = () => {
      scales.clear();
      for (const child of Array.from(el.children)) {
        const h = child as HTMLElement;
        h.style.removeProperty("transform");
        h.style.removeProperty("z-index");
      }
    };

    const tick = () => {
      rafId = 0;
      if (!isMobile() || !motionOk() || reduceMotion) {
        clearScales();
        return;
      }
      const rect = el.getBoundingClientRect();
      // If the element is not actually laid out (e.g. hidden by a breakpoint),
      // avoid applying transforms based on a zero-size rect.
      if (rect.width < 1) {
        clearScales();
        return;
      }
      const mid = rect.left + rect.width / 2;
      const falloff = Math.max(rect.width * 0.4, 190);
      const lerp = 0.32;
      let anyMoving = false;

      for (const child of Array.from(el.children)) {
        const h = child as HTMLElement;
        const cr = h.getBoundingClientRect();
        const cMid = cr.left + cr.width / 2;
        const dist = Math.abs(cMid - mid);
        const rawT = Math.max(0, Math.min(1, 1 - dist / falloff));
        const t = rawT * rawT * (3 - 2 * rawT);
        const target = 0.93 + t * 0.13;
        const prev = scales.get(h);
        const start = prev === undefined ? target : prev;
        const next = start + (target - start) * lerp;
        scales.set(h, next);
        if (Math.abs(next - target) > 0.004) anyMoving = true;
        h.style.transform = `scale(${next.toFixed(4)})`;
        h.style.zIndex = String(Math.round(target * 100));
      }

      if (anyMoving) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    el.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    schedule();

    return () => {
      el.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      cancelAnimationFrame(rafId);
      clearScales();
    };
  }, [reduceMotion, scrollRef]);
}

function IndustryProblemCard({
  card,
  className,
  decorativeClone,
  cloneMarker,
  variant,
}: {
  card: ProblemCardData;
  className?: string;
  decorativeClone?: boolean;
  cloneMarker?: ProblemCloneMarker;
  variant?: "scroll" | "grid";
}) {
  const layout: "scroll" | "grid" = variant ?? "scroll";
  return (
    <div
      className={cn(
        "relative flex flex-col origin-center overflow-hidden rounded-[1.75rem] border border-white/40 bg-[#0A0A0A] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-shadow will-change-transform hover:shadow-[0_0_40px_rgba(249,115,22,0.12)]",
        layout === "scroll" &&
          "h-[19rem] w-[17.5rem] shrink-0 sm:h-[18.5rem] sm:w-[20rem] sm:p-4 md:h-[19.5rem] md:w-[22.5rem] md:min-w-0 md:will-change-auto md:p-6 lg:h-[20rem] lg:w-[23.5rem] lg:p-8 xl:h-[21rem] xl:w-[24.5rem] xl:p-9",
        layout === "grid" &&
          "h-[19rem] w-full shrink md:min-w-0 sm:h-[18.5rem] sm:p-4 md:h-[19.5rem] md:p-6 lg:h-[20rem] lg:p-8 xl:h-[22.5rem] xl:p-9",
        layout === "scroll" && !decorativeClone && "max-xl:snap-center max-xl:snap-always",
        layout === "scroll" &&
          decorativeClone &&
          "max-xl:[scroll-snap-align:none]",
        className
      )}
      style={{
        backgroundImage: [
          "linear-gradient(to top, rgba(6,6,6,0.9) 0%, rgba(6,6,6,0.72) 22%, rgba(6,6,6,0.38) 48%, rgba(6,6,6,0.12) 72%, rgba(6,6,6,0) 100%)",
          "url('/cta.png')",
        ].join(", "),
        backgroundSize: "cover, cover",
        backgroundPosition: "center, center",
        backgroundRepeat: "no-repeat, no-repeat",
      }}
      aria-hidden={decorativeClone ? true : undefined}
      data-problem-card={decorativeClone ? undefined : card.num}
      data-problem-clone={cloneMarker}
    >
      <span className="font-display flex-none text-[#F97316] text-[44px] leading-none sm:text-[48px] lg:text-[64px]">
        {card.num}
      </span>
      <div className="mt-auto flex flex-col pt-6 sm:pt-5">
        <h3 className="mb-2 text-[15px] font-bold uppercase leading-snug text-white sm:text-[16px] lg:text-[18px]">
          {card.title}
        </h3>
        <p className="text-[13px] leading-[1.45] text-white/85 sm:text-[14px] md:text-[15px]">
          {card.body}
        </p>
      </div>
    </div>
  );
}

const capabilityCards = [
  {
    title: "VFX & COMPOSITING",
    description:
      "Seamless visual effects indistinguishable from reality. Set extensions, CG integration, and invisible corrections that elevate your campaign's production value.",
    tags: ["AE", "BLENDER", "COMPOSITION"],
    image: "/capabilities/vfx%20compositing.webp",
  },
  {
    title: "3D CGI WORLD-BUILDING",
    description:
      "Photorealistic product visualization, character simulation, and environment builds for commercial production and brand communications.",
    tags: ["3D", "HOUDINI", "BLENDER"],
    image: "/capabilities/cgi.jpg",
  },
  {
    title: "MOTION DESIGN",
    description:
      "Kinetic typography, animated brand systems, and broadcast-ready motion graphics that make your message impossible to ignore and truly unforgettable impact.",
    tags: ["AE", "MOTION", "BRAND"],
    image: "/capabilities/motiondesign.webp",
  },
  {
    title: "CONTENT & SOCIAL",
    description:
      "Platform-native content built for conversion. Reels, shorts, and digital campaigns engineered to stop the scroll and drive action.",
    tags: ["SOCIAL", "REELS", "CONTENT"],
    image: "/capabilities/social.webp",
  },
];

type CapabilityCardData = (typeof capabilityCards)[number];
type CapabilityCloneMarker = "leading-last" | "trailing-first";

function CapabilityCardBody({ card }: { card: CapabilityCardData }) {
  return (
    <>
      <div className="flex h-[168px] min-h-0 min-[420px]:h-[182px] sm:h-[200px] lg:h-[280px] xl:h-[296px] shrink-0 flex-none p-2 min-[420px]:p-2.5 sm:p-3 lg:p-3.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image}
          alt={card.title}
          className="h-full w-full rounded-md object-cover"
        />
      </div>
      <div className="p-3.5 sm:p-5 lg:p-6 flex flex-col flex-1">
        <h3 className="text-[#F97316] font-bold uppercase text-[15px] sm:text-[17px] lg:text-[18px] mb-2 sm:mb-3 leading-snug">
          {card.title}
        </h3>
        <p className="mb-3 flex-1 text-[13px] leading-[1.45] text-white/85 sm:mb-4 sm:text-[14px] md:text-[15px]">
          {card.description}
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#2A2A2A] text-white text-[10px] sm:text-[12px] px-2 sm:px-[10px] py-0.5 sm:py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function CapabilityMobileSlide({
  card,
  decorativeClone,
  cloneMarker,
  capabilityIndex,
}: {
  card: CapabilityCardData;
  decorativeClone?: boolean;
  cloneMarker?: CapabilityCloneMarker;
  capabilityIndex?: number;
}) {
  return (
    <div
      className={cn(
        "relative flex w-[min(17.5rem,calc(100vw-2rem))] shrink-0 origin-center flex-col rounded-2xl border border-white/40 bg-[#1A1A1A] transition-shadow will-change-transform hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]",
        !decorativeClone && "max-md:snap-center max-md:snap-always",
        decorativeClone && "max-md:[scroll-snap-align:none] pointer-events-none select-none",
      )}
      data-capability-card={
        capabilityIndex !== undefined ? String(capabilityIndex) : undefined
      }
      data-capability-clone={cloneMarker}
      aria-hidden={decorativeClone ? true : undefined}
    >
      {/* Inner clips content to radius; outer stays overflow-visible so hover glow isn’t cut off */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl">
        <CapabilityCardBody card={card} />
      </div>
    </div>
  );
}

function CapabilityGridCard({ card }: { card: CapabilityCardData }) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/40 bg-[#1A1A1A] transition-shadow hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] md:w-auto">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl">
        <CapabilityCardBody card={card} />
      </div>
    </div>
  );
}

const processSteps = [
  {
    num: "1",
    title: "DISCOVERY & SCOPING",
    description:
      "We align on your objectives and success criteria. You receive a detailed proposal within 48 hours.",
  },
  {
    num: "2",
    title: "CONCEPT & PRE-VIZ",
    description:
      "Storyboards, style frames, and motion tests. Nothing moves forward without your sign-off.",
  },
  {
    num: "3",
    title: "BUILD & REVIEW",
    description:
      "Structured review cycles at every milestone. You see real work at every checkpoint.",
  },
  {
    num: "4",
    title: "DELIVER & SUPPORT",
    description:
      "Final assets in every format you need. 30-day post-delivery support included.",
  },
];

const portfolioProjects = [
  {
    clientLabel: "SELECTA x CUTS STUDIO",
    title: "THREE FLAVOR UNIVERSES. FULL CGI. BROADCAST-READY.",
    description:
      "Cinema-quality CGI montages for three hero flavors — Crunchy Choco Malt, Avocado Dream, and New York Cheesecake. Full pipeline from Houdini simulations to Blender rendering to After Effects compositing. Delivered on a tight broadcast deadline.",
    imageSrc: "/videos/work1.png",
    stat1Value: "3",
    stat1Label: "campaigns",
    stat2Value: "FULL",
    stat2Label: "CGI Pipeline",
  },
  {
    clientLabel: "SELECTA x CUTS STUDIO",
    title: "THREE FLAVOR UNIVERSES. FULL CGI. BROADCAST-READY.",
    description:
      "Cinema-quality CGI montages for three hero flavors — Crunchy Choco Malt, Avocado Dream, and New York Cheesecake. Full pipeline from Houdini simulations to Blender rendering to After Effects compositing. Delivered on a tight broadcast deadline.",
    imageSrc: "/videos/work2.png",
    stat1Value: "3",
    stat1Label: "campaigns",
    stat2Value: "FULL",
    stat2Label: "CGI Pipeline",
  },
];

const differenceCards = [
  {
    Icon: Clapperboard,
    title: "CINEMATIC DNA",
    description:
      "Film-level standards on every project. Grounded realism, natural motion, invisible VFX.",
    image: "/difference/diff1.avif",
  },
  {
    Icon: Hammer,
    title: "HOLLYWOOD PIPELINE",
    description:
      "Nuke, Houdini, Blender, PFTrack. The same tools used by the world's top VFX houses applied to your brand's advantage.",
    image: "/difference/diff2.jpg",
  },
  {
    Icon: Briefcase,
    title: "ENTERPRISE READY",
    description:
      "Fixed-scope proposals, NDA-protected. Built for procurement teams who need accountability and creativity.",
    image: "/difference/diff3.avif",
  },
  {
    Icon: Globe,
    title: "PH-BASED. GLOBAL GRADE.",
    description:
      "International-standard output at Philippine pricing. A cost advantage with zero compromise on quality, consistency, or professionalism.",
    image: "/difference/diff4.jpg",
  },
];

const leftRoles = [
  { title: "DIRECTORS", subtitle: "Creative vision & storytelling" },
  { title: "PRODUCERS", subtitle: "Project management & delivery" },
  { title: "COLORISTS", subtitle: "Grading, look dev & finishing" },
];

const rightRoles = [
  { title: "VFX ARTISTS", subtitle: "Compositing, CGI & simulations" },
  { title: "EDITORS", subtitle: "Pacing, narrative & assembly" },
  { title: "SOUND DESIGNERS", subtitle: "SFX, mixing & mastering" },
];

const footerLinks = ["Home", "Services", "Process", "Work", "About", "FAQs"];

/** Type treatment only (matches hero supporting copy) — combine with each section’s own max-width / alignment / spacing */
/** Base + sm unchanged; lg+ is +4px vs former 18px (web / large screens only) */
const SECTION_INTRO_FONT =
  "text-white text-[14px] sm:text-[16px] lg:text-[22px] leading-relaxed [text-shadow:0_2px_16px_rgba(0,0,0,0.9)]";

/** Vertical orange flow — button-aligned #F97316; use with `bg-[#0A0A0A]` + `style={{ backgroundImage: … }}` */
const SECTION_ORANGE_FLOW_GRADIENT =
  "linear-gradient(180deg, #0A0A0A 0%, #120805 5%, rgba(249, 115, 22, 0.28) 22%, rgba(249, 115, 22, 0.62) 40%, rgba(249, 115, 22, 0.82) 50%, rgba(249, 115, 22, 0.58) 60%, rgba(234, 88, 12, 0.35) 72%, #0A0A0A 92%, #0A0A0A 100%)";

const CONTACT_EMAIL = "admin@michhub.com";

function submitContactMailto(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const name = String(fd.get("name") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim();
  const message = String(fd.get("message") ?? "").trim();
  const subject = encodeURIComponent(
    name ? `Website inquiry from ${name}` : "Website inquiry",
  );
  const body = encodeURIComponent(
    [
      name && `Name: ${name}`,
      email && `Email: ${email}`,
      "",
      message || "(No message provided.)",
    ]
      .filter(Boolean)
      .join("\n"),
  );
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

// ─── Components ───────────────────────────────────────────────────────────────

interface ProjectCardProps {
  clientLabel: string;
  title: string;
  description: string;
  imageSrc: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
}

function ProjectCard({
  clientLabel,
  title,
  description,
  imageSrc,
  stat1Value,
  stat1Label,
  stat2Value,
  stat2Label,
}: ProjectCardProps) {
  const statBlocks = (
    <>
      <div className="min-w-0 text-center lg:text-left">
        <p className="font-bold leading-none text-[#F97316] text-[18px] sm:text-[20px] lg:text-[26px] xl:text-[30px]">
          {stat1Value}
        </p>
        <p className="mt-1 break-words text-[11px] leading-snug text-[#9CA3AF] sm:text-[12px] lg:text-[13px] xl:text-[14px]">
          {stat1Label}
        </p>
      </div>
      <div className="min-w-0 text-center lg:text-left">
        <p className="font-bold leading-none text-[#F97316] text-[18px] sm:text-[20px] lg:text-[26px] xl:text-[30px]">
          {stat2Value}
        </p>
        <p className="mt-1 break-words text-[11px] leading-snug text-[#9CA3AF] sm:text-[12px] lg:text-[13px] xl:text-[14px]">
          {stat2Label}
        </p>
      </div>
    </>
  );

  return (
    <div className="flex w-full min-w-0 flex-col items-stretch overflow-hidden rounded-2xl border border-white/40 bg-[#1A1A1A] min-[500px]:flex-row lg:flex-col">
      <div className="relative h-[min(12.5rem,42vw)] min-h-[9.5rem] w-full shrink-0 min-[500px]:h-auto min-[500px]:!self-stretch min-[500px]:w-[44%] lg:h-[340px] xl:h-[380px] lg:w-full lg:self-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col p-3.5 min-[400px]:p-4 sm:p-5 lg:flex-row lg:items-stretch lg:gap-6 lg:p-6">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <p className="mb-2 break-words text-[10px] font-bold uppercase tracking-normal text-[#F97316] min-[400px]:text-[11px]">
            CLIENT: {clientLabel}
          </p>
          <h3 className="mb-2 font-display text-[14px] uppercase leading-snug text-white min-[400px]:text-[15px] sm:text-[18px] lg:mb-3 lg:text-[22px]">
            {title}
          </h3>
          <p className="mb-auto line-clamp-6 text-[12px] leading-[1.4] text-white/85 min-[400px]:text-[13px] min-[500px]:line-clamp-5 lg:mb-0 lg:line-clamp-none lg:flex-1 lg:text-[14px]">
            {description}
          </p>

          <div className="lg:hidden">
            <div className="my-2.5 border-t border-[#F97316]/50 sm:my-3" />
            <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3">{statBlocks}</div>
          </div>
        </div>

        <div className="mt-4 hidden shrink-0 flex-row items-stretch gap-5 self-stretch lg:mt-0 lg:flex">
          <div className="w-px shrink-0 self-stretch bg-[#F97316]/50" aria-hidden />
          <div className="flex min-w-[5.5rem] flex-col justify-center gap-5 sm:min-w-[6.5rem] lg:min-w-[7.75rem] lg:gap-6 xl:min-w-[8.5rem]">
            {statBlocks}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-white/40 bg-[#111111] rounded-[14px] px-4 py-4 text-left transition-shadow duration-300 ease-out hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] sm:px-5 sm:py-5 lg:px-6",
        className,
      )}
    >
      <h4 className="mb-1 text-[14px] font-bold uppercase leading-snug text-white sm:text-[16px] lg:text-[17px]">
        {title}
      </h4>
      <p className="text-[13px] leading-[1.45] text-white/85 sm:text-[14px]">{subtitle}</p>
    </div>
  );
}

const HERO_REEL_SRC = "/videos/heroreel.mp4";

/** Defers mounting the reel until idle time so text/LCP can paint first; skips when save-data or reduced motion. */
function HeroBackgroundVideo() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData === true;

    if (mq.matches || saveData) return;

    const enable = () => {
      if (!cancelled) setShowVideo(true);
    };

    const ricId =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(enable, { timeout: 2500 })
        : undefined;
    const timeoutId =
      ricId === undefined ? window.setTimeout(enable, 300) : undefined;

    return () => {
      cancelled = true;
      if (ricId !== undefined) window.cancelIdleCallback(ricId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  if (!showVideo) return null;

  return (
    <video
      aria-hidden
      className="absolute inset-0 z-[1] h-full w-full object-cover pointer-events-none"
      src={HERO_REEL_SRC}
      autoPlay
      muted
      playsInline
      loop
      preload="metadata"
      disablePictureInPicture
      controls={false}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const problemCardsScrollRef = useRef<HTMLDivElement>(null);
  const capabilityCardsScrollRef = useRef<HTMLDivElement>(null);

  useHorizontalDragScroll(problemCardsScrollRef);
  useHorizontalDragScroll(capabilityCardsScrollRef);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    // Smooth scroll for single-page navigation with an offset.
    // `scrollIntoView()` doesn't let us reliably apply offsets, so we read
    // the element's `scroll-margin-top` (Tailwind `scroll-mt-*`) and subtract it.
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const computed = window.getComputedStyle(el);
      const scrollMarginTop = Number.parseFloat(computed.scrollMarginTop || "0");
      const offset = Number.isFinite(scrollMarginTop) ? scrollMarginTop : 0;
      // For the contact page, we want the *full* contact form to be visible
      // (the CTA banner above should not remain peeking at the top).
      const extraDown = id === "contact-form" ? 120 : id === "work" ? 60 : 0;
      const top = window.scrollY + rect.top - offset + extraDown;
      window.scrollTo({ top, behavior: "smooth" });
    });
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const el = problemCardsScrollRef.current;
    if (!el) return;
    const centerCard01 = () => {
      // Carousel is visible up to `xl` (we use `xl:hidden` for it),
      // so keep this centering logic in sync with that.
      if (window.matchMedia("(min-width: 1280px)").matches) return;
      const card01 = el.querySelector<HTMLElement>('[data-problem-card="01"]');
      if (!card01) return;
      centerChildInHorizontalScroller(el, card01);
    };
    centerCard01();
    requestAnimationFrame(() => {
      centerCard01();
      requestAnimationFrame(centerCard01);
    });
    window.addEventListener("resize", centerCard01);
    return () => window.removeEventListener("resize", centerCard01);
  }, []);

  useEffect(() => {
    const el = problemCardsScrollRef.current;
    if (!el) return;

    // Keep looping logic enabled for the same breakpoints as the carousel UI.
    const isDesktop = () => window.matchMedia("(min-width: 1280px)").matches;

    const directionRef = { current: null as "left" | "right" | null };
    let lastScrollLeft = el.scrollLeft;

    const handleLoopJump = () => {
      if (isDesktop()) return;
      const r1 = el.querySelector<HTMLElement>('[data-problem-card="01"]');
      const r2 = el.querySelector<HTMLElement>('[data-problem-card="02"]');
      const r3 = el.querySelector<HTMLElement>('[data-problem-card="03"]');
      const cLeading = el.querySelector<HTMLElement>(
        '[data-problem-clone="leading-03"]',
      );
      const cTrailing = el.querySelector<HTMLElement>(
        '[data-problem-clone="trailing-01"]',
      );
      if (!r1 || !r2 || !r3) return;

      const scRect = el.getBoundingClientRect();
      const mid = scRect.left + scRect.width / 2;
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const nearEnd = el.scrollLeft >= maxScrollLeft - 2;
      const nearStart = el.scrollLeft <= 2;
      const dist = (node: HTMLElement) => {
        const r = node.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        return Math.abs(cx - mid);
      };

      let best: HTMLElement | null = null;
      let bestD = Infinity;
      for (const node of [r1, r2, r3, cLeading, cTrailing]) {
        if (!node) continue;
        const d = dist(node);
        if (d < bestD) {
          bestD = d;
          best = node;
        }
      }
      if (!best) return;

      // On tablet widths, snap can keep you "stuck" on card 03
      // (trailing clone isn't picked as a best snap target).
      // If the user swiped to the end, loop back to card 01.
      if (directionRef.current === "right" && nearEnd) {
        centerChildInHorizontalScroller(el, r1);
        return;
      }
      // If the user swiped to the start, loop back to card 03.
      if (directionRef.current === "left" && nearStart) {
        centerChildInHorizontalScroller(el, r3);
        return;
      }

      if (best === cTrailing) {
        centerChildInHorizontalScroller(el, r1);
      } else if (best === cLeading) {
        centerChildInHorizontalScroller(el, r3);
      }
    };

    let debounceTimer: ReturnType<typeof setTimeout> | undefined;
    const onScrollDebounce = () => {
      // Remember direction so we can decide which loop transition to trigger.
      const next = el.scrollLeft;
      if (next > lastScrollLeft + 0.5) directionRef.current = "right";
      else if (next < lastScrollLeft - 0.5) directionRef.current = "left";
      lastScrollLeft = next;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(handleLoopJump, 120);
    };

    el.addEventListener("scrollend", handleLoopJump);
    el.addEventListener("scroll", onScrollDebounce, { passive: true });

    return () => {
      el.removeEventListener("scrollend", handleLoopJump);
      el.removeEventListener("scroll", onScrollDebounce);
      clearTimeout(debounceTimer);
    };
  }, []);

  useLayoutEffect(() => {
    const el = capabilityCardsScrollRef.current;
    if (!el) return;
    const centerFirstCapability = () => {
      if (window.matchMedia("(min-width: 768px)").matches) return;
      const first = el.querySelector<HTMLElement>('[data-capability-card="0"]');
      if (!first) return;
      centerChildInHorizontalScroller(el, first);
    };
    centerFirstCapability();
    requestAnimationFrame(() => {
      centerFirstCapability();
      requestAnimationFrame(centerFirstCapability);
    });
    window.addEventListener("resize", centerFirstCapability);
    return () => window.removeEventListener("resize", centerFirstCapability);
  }, []);

  useEffect(() => {
    const el = capabilityCardsScrollRef.current;
    if (!el) return;

    const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

    const handleLoopJump = () => {
      if (isDesktop()) return;
      const c0 = el.querySelector<HTMLElement>('[data-capability-card="0"]');
      const c1 = el.querySelector<HTMLElement>('[data-capability-card="1"]');
      const c2 = el.querySelector<HTMLElement>('[data-capability-card="2"]');
      const c3 = el.querySelector<HTMLElement>('[data-capability-card="3"]');
      const cLeading = el.querySelector<HTMLElement>(
        '[data-capability-clone="leading-last"]',
      );
      const cTrailing = el.querySelector<HTMLElement>(
        '[data-capability-clone="trailing-first"]',
      );
      if (!c0 || !c1 || !c2 || !c3) return;

      const scRect = el.getBoundingClientRect();
      const mid = scRect.left + scRect.width / 2;
      const dist = (node: HTMLElement) => {
        const r = node.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        return Math.abs(cx - mid);
      };

      let best: HTMLElement | null = null;
      let bestD = Infinity;
      for (const node of [c0, c1, c2, c3, cLeading, cTrailing]) {
        if (!node) continue;
        const d = dist(node);
        if (d < bestD) {
          bestD = d;
          best = node;
        }
      }
      if (!best) return;

      if (best === cTrailing) {
        centerChildInHorizontalScroller(el, c0);
      } else if (best === cLeading) {
        centerChildInHorizontalScroller(el, c3);
      }
    };

    let debounceTimer: ReturnType<typeof setTimeout> | undefined;
    const onScrollDebounce = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(handleLoopJump, 120);
    };

    el.addEventListener("scrollend", handleLoopJump);
    el.addEventListener("scroll", onScrollDebounce, { passive: true });

    return () => {
      el.removeEventListener("scrollend", handleLoopJump);
      el.removeEventListener("scroll", onScrollDebounce);
      clearTimeout(debounceTimer);
    };
  }, []);

  useCarouselCenterScale(problemCardsScrollRef, reduceMotion);
  useCarouselCenterScale(capabilityCardsScrollRef, reduceMotion);

  return (
    <main className="bg-[#0A0A0A] text-white">
      {/* ─── Mobile Menu Overlay ─────────────────────────────────── */}
      <AnimatePresence initial={false} mode="wait">
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-50 flex h-dvh flex-col bg-black/90 lg:hidden"
            initial={{ x: "14%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "14%", opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="absolute right-5 top-5 z-10 p-1 text-white sm:right-8 sm:top-6"
          >
            <X className="h-8 w-8" />
          </button>
          <nav
            className="flex w-full flex-1 min-h-0 flex-col items-center justify-center gap-5 overflow-y-auto px-6 py-6"
            aria-label="Primary"
          >
            {navItems.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="max-w-[min(100%,20rem)] text-center font-display text-[1.35rem] uppercase italic leading-snug text-white transition-colors hover:text-[#F97316] min-[400px]:text-3xl sm:text-4xl"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="shrink-0 border-t border-white/[0.08] px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
            <div className="flex items-center justify-center gap-10">
              {menuSocialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  onClick={() => setMenuOpen(false)}
                  className="text-white transition-colors hover:text-[#F97316]"
                >
                  <Icon className="h-7 w-7" />
                </a>
              ))}
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════════════════ */}
      <section
        id="home"
        className="relative flex min-h-[97dvh] sm:min-h-[97dvh] md:min-h-[97dvh] lg:min-h-screen scroll-mt-20 flex-col justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 z-0 bg-[#0A0A0A]"
          style={{ backgroundImage: SECTION_ORANGE_FLOW_GRADIENT }}
          aria-hidden
        />
        <HeroBackgroundVideo />
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          aria-hidden
        >
          {/* Base scrim — consistent readability over motion */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/[0.88]" />
          {/* Vignette — draws focus to center content */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 95% 80% at 50% 38%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.82) 100%)",
            }}
          />
          {/* Warm edge tie-in to brand orange (very subtle) */}
          <div
            className="absolute inset-0 mix-blend-soft-light opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 100% 70% at 50% 100%, rgba(249,115,22,0.22) 0%, transparent 55%)",
            }}
          />
        </div>

        {/* Mobile Nav */}
        <nav className="relative z-20 flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-6 lg:hidden">
          <Link
            href="/"
            className="relative block h-14 w-[min(360px,82vw)] shrink-0"
          >
            <Image
              src="/logo.svg"
              alt="MichHub"
              fill
              className="object-contain object-left"
              priority
              sizes="360px"
            />
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="text-white p-1 mr-1 sm:mr-2 mt-1"
          >
            <Menu className="h-7 w-7" />
          </button>
        </nav>

        {/* Desktop Nav — 1fr / auto / 1fr keeps links centered in the bar */}
        <nav className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-4 relative z-20 px-10 xl:px-16 2xl:px-20 pt-8 max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1520px] w-full mx-auto">
          <div className="flex justify-start items-center min-w-0">
            <Link
              href="/"
              className="relative block h-[4.5rem] w-[380px] max-w-full shrink-0 xl:h-[5.25rem] xl:w-[460px]"
            >
              <Image
                src="/logo.svg"
                alt="MichHub"
                fill
                className="object-contain object-left"
                priority
                sizes="(min-width: 1280px) 460px, 380px"
              />
            </Link>
          </div>
          <div className="flex max-w-[56rem] flex-wrap items-center justify-center gap-x-4 gap-y-2 xl:max-w-[68rem] xl:gap-x-5">
            {navItems.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-center text-[10px] font-medium uppercase tracking-[0.12em] text-white/70 transition-colors hover:text-white xl:text-[11px]"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="flex justify-end items-center min-w-0">
            <Button
              onClick={() => scrollToSection("contact-form")}
              className="flex h-10 shrink-0 items-center justify-center rounded-[12px] border-transparent bg-[#F97316] px-5 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#ea6c0a] sm:px-8"
            >
              Inquire Now
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col flex-1 items-center justify-center px-5 sm:px-8 py-10 sm:py-12 lg:px-10 xl:px-16">
          <motion.div
            className="flex flex-col items-center text-center w-full max-w-[960px] lg:max-w-[1040px] xl:max-w-[1120px] mx-auto"
            initial={reduceMotion ? false : { opacity: 0, y: 26 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: brandEase, delay: 0.06 }}
          >
            <h1 className="font-display italic uppercase leading-none mb-5 sm:mb-6 lg:mb-8 [text-shadow:0_2px_32px_rgba(0,0,0,0.85),0_1px_3px_rgba(0,0,0,0.9)]">
              <span className="block text-white text-[38px] sm:text-[52px] md:text-[64px] lg:text-[80px] xl:text-[96px]">
                TRANSFORMING
              </span>
              <span className="block text-[38px] sm:text-[52px] md:text-[64px] lg:text-[80px] xl:text-[96px]">
                <span className="text-[#F97316] drop-shadow-[0_0_40px_rgba(249,115,22,0.35)]">
                  VISIONS{" "}
                </span>
                <span className="text-white">INTO </span>
                <span className="text-[#F97316] drop-shadow-[0_0_40px_rgba(249,115,22,0.35)]">
                  REALITY
                </span>
              </span>
            </h1>
            <p
              className={cn(
                SECTION_INTRO_FONT,
                "text-center max-w-[280px] sm:max-w-[380px] lg:max-w-[580px] xl:max-w-[640px] 2xl:max-w-[720px] mb-7 sm:mb-8 lg:mb-10",
              )}
            >
              We create cinema-grade VFX, CGI, and motion design that doesn&apos;t
              just perform, it positions your brand as the standard your entire
              industry measures itself against.
            </p>
            <div className="mx-auto flex w-full max-w-[min(100%,22rem)] flex-col items-stretch justify-center gap-3 px-1 sm:max-w-none sm:w-auto sm:flex-row sm:items-center sm:px-0">
              <Button
                onClick={() => scrollToSection("contact-form")}
                className="flex h-10 w-full items-center justify-center rounded-[12px] border-transparent bg-[#F97316] px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#ea6c0a] sm:h-12 sm:w-auto sm:px-8 sm:text-sm"
              >
                INQUIRE ABOUT OUR SERVICES
              </Button>
              <Button
                onClick={() => scrollToSection("work")}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] border border-white bg-transparent px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 sm:h-12 sm:w-auto sm:px-8 sm:text-sm"
              >
                <Play className="h-4 w-4 fill-white text-white" />
                VIEW OUR WORK
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="relative z-20 border-t border-white/[0.08] w-full">
          <motion.div
            className="grid grid-cols-3 max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-10 xl:px-16 py-5 sm:py-6 lg:py-8"
            variants={heroStatsStaggerContainer}
            initial={reduceMotion ? "show" : "hidden"}
            animate="show"
          >
            {[
              { value: "50+", label: "PROJECTS" },
              { value: "100%", label: "ON-TIME" },
              { value: "10+", label: "BRAND PARTNERS" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUpItem}
                className={`flex flex-col items-center gap-1 ${
                  i === 1 ? "border-x border-white/[0.08]" : ""
                }`}
              >
                <JumblingMetric
                  value={stat.value}
                  scrambleMs={2400}
                  startAfterMs={Math.round(920 + i * 160)}
                  className="font-display text-white text-[28px] sm:text-[36px] lg:text-[48px] leading-none"
                />
                <span className="text-white uppercase text-[10px] sm:text-[11px] tracking-[0.12em] font-sans">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — BRAND PROOF / BELIEF
      ═══════════════════════════════════════════════════════════ */}
      <AnimatedSection className="bg-black py-10 sm:py-14 lg:py-20 min-h-0 sm:min-h-[52vh] lg:min-h-[58vh] flex flex-col justify-center overflow-x-hidden">
        <div className="w-full max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-16">
          <p
            className={cn(
              SECTION_INTRO_FONT,
              "text-center max-w-[300px] sm:max-w-[420px] lg:max-w-[560px] xl:max-w-[640px] mx-auto mb-6 sm:mb-8 lg:mb-10",
            )}
          >
            collaborated with well known brands
          </p>
        </div>
        <div className="w-full max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-16 mb-8 sm:mb-10 lg:mb-12">
          <div className="relative w-full overflow-hidden py-1">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-black from-25% to-transparent min-[420px]:w-14 sm:w-20"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-black from-25% to-transparent min-[420px]:w-14 sm:w-20"
              aria-hidden
            />
            <div
              className={`flex items-center gap-5 sm:gap-6 md:gap-8 lg:gap-10 ${
                reduceMotion
                  ? "mx-auto w-full max-w-full flex-wrap justify-center"
                  : "client-logo-marquee-track w-max"
              }`}
            >
              {(reduceMotion ? clientLogos : [...clientLogos, ...clientLogos]).map(
                ({ src, alt }, i) => (
                  <div
                    key={`${src}-${i}`}
                    className="relative h-[4.5rem] w-[4.5rem] shrink-0 min-[420px]:h-20 min-[420px]:w-20 sm:h-20 sm:w-20 md:h-20 md:w-20 lg:h-24 lg:w-24 xl:h-28 xl:w-28"
                  >
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      className="object-contain object-center p-1 min-[420px]:p-1.5 sm:p-2"
                    sizes="(max-width: 419px) 64px, (max-width: 639px) 72px, (max-width: 1024px) 80px, 112px"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="w-full max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-16">
          <div className="flex flex-col items-center text-center mb-12 sm:mb-14 lg:mb-16">
            <p className="text-[#F97316] uppercase text-[13px] font-bold tracking-[0.22em] mb-4">
              WHAT WE BELIEVE
            </p>
            <h2 className="font-display italic uppercase text-white text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] leading-tight max-w-[640px] md:max-w-[720px] lg:max-w-[800px] xl:max-w-[880px] mb-4">
              VISIBILITY FADES.{" "}
              <span className="text-[#F97316]">BRAND AUTHORITY</span>{" "}
              DOESN&apos;T. WE BUILD THE VISUALS THAT MAKE YOURS PERMANENT.
            </h2>
            <div className="w-20 h-[3px] bg-[#F97316] rounded-full" />
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — INDUSTRY PROBLEM
      ═══════════════════════════════════════════════════════════ */}
      <AnimatedSection
        id="problem"
        className="flex min-h-dvh min-h-screen scroll-mt-20 flex-col justify-center bg-[#0A0A0A] px-4 py-10 sm:min-h-[52vh] sm:px-8 sm:py-14 lg:min-h-[58vh] lg:px-10 lg:py-20 xl:px-16"
        style={{ backgroundImage: SECTION_ORANGE_FLOW_GRADIENT }}
      >
        <div className="w-full max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1520px] mx-auto">
          <div className="flex flex-col items-center text-center mb-4 sm:mb-8 lg:mb-10">
            <p className="text-[#F97316] uppercase text-[13px] font-bold tracking-[0.22em] mb-4">
              THE INDUSTRY PROBLEM
            </p>
            <h2 className="font-display italic uppercase text-white text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] leading-tight max-w-full md:max-w-[720px] lg:max-w-[820px] xl:max-w-[920px] mb-4">
              GREAT BRANDS DESERVE<br className="sm:hidden" /> BETTER<br className="hidden sm:block lg:hidden" /> THAN<br className="sm:hidden" /> AVERAGE PRODUCTIONS
            </h2>
            <p
              className={cn(
                SECTION_INTRO_FONT,
                "max-w-[min(100%,26rem)] sm:max-w-[28rem] md:max-w-[420px] lg:max-w-[560px] xl:max-w-[640px] px-1 sm:px-0",
              )}
            >
              These are the challenges we see enterprise brands face every day —
              and the reason they partner with us.
            </p>
          </div>
          <div className="mb-5 sm:mb-6 md:mb-7 lg:mb-8 xl:mb-9">
            <motion.div
              ref={problemCardsScrollRef}
              role="region"
              aria-label="Industry challenges, swipe horizontally for more"
              className="swipe-x -mx-4 flex min-h-[24rem] cursor-grab snap-x snap-mandatory items-center gap-4 overflow-x-auto pb-6 pt-3 pl-[max(1rem,calc(50%-8.75rem))] pr-[max(1rem,calc(50%-8.75rem))] scrollbar-hide sm:-mx-8 sm:min-h-[26rem] sm:gap-4 sm:pb-7 sm:pt-4 sm:pl-[max(1rem,calc(50%-10rem))] sm:pr-[max(1rem,calc(50%-10rem))] md:pl-[max(1rem,calc(50%-11.25rem))] md:pr-[max(1rem,calc(50%-11.25rem))] lg:min-h-[22rem] lg:gap-2 lg:py-5 lg:pl-[max(1rem,calc(50%-11.75rem))] lg:pr-[max(1rem,calc(50%-11.75rem))] md:hidden xl:hidden"
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={reduceMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true, amount: "some", margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.55, ease: brandEase }}
            >
              <div className="max-xl:shrink-0 max-xl:[scroll-snap-align:none]">
                <IndustryProblemCard
                  card={problemCards[2]}
                  decorativeClone
                  cloneMarker="leading-03"
                  className="pointer-events-none select-none"
                  variant="scroll"
                />
              </div>
              {problemCards.map((card) => (
                <div
                  key={card.num}
                  className="max-xl:shrink-0 max-xl:snap-center max-xl:snap-always"
                >
                  <IndustryProblemCard card={card} variant="scroll" />
                </div>
              ))}
              <div className="max-xl:shrink-0 max-xl:[scroll-snap-align:none]">
                <IndustryProblemCard
                  card={problemCards[0]}
                  decorativeClone
                  cloneMarker="trailing-01"
                  className="pointer-events-none select-none"
                  variant="scroll"
                />
              </div>
            </motion.div>

            {/* Medium screens (tablets): stacked single-column grid */}
            <motion.div
              className="hidden md:grid md:grid-cols-1 md:gap-5 md:justify-items-center xl:hidden"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {problemCards.map((card) => (
                <motion.div key={card.num} variants={cardRevealItem}>
                  <IndustryProblemCard
                    card={card}
                    variant="grid"
                    className="w-[28.5rem] max-w-full"
                  />
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="hidden xl:grid xl:grid-cols-3 xl:gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {problemCards.map((card) => (
                <motion.div key={card.num} variants={cardRevealItem}>
                  <IndustryProblemCard card={card} variant="grid" />
                </motion.div>
              ))}
            </motion.div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-[min(100%,22rem)] sm:max-w-none sm:w-auto mx-auto px-1 sm:px-0">
            <Button
              onClick={() => scrollToSection("contact-form")}
              className="flex h-10 w-full items-center justify-center rounded-[12px] border-transparent bg-[#F97316] px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#ea6c0a] sm:h-12 sm:w-auto sm:px-8 sm:text-sm"
            >
              TALK TO US ABOUT YOUR BRAND
            </Button>
            <Button className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] border border-white bg-transparent px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 sm:h-12 sm:w-auto sm:px-8 sm:text-sm">
              <HelpCircle className="h-4 w-4" />
              SEE HOW WE SOLVE THIS
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — CAPABILITIES
      ═══════════════════════════════════════════════════════════ */}
      <AnimatedSection
        id="services"
        className="flex min-h-dvh min-h-screen flex-col justify-center scroll-mt-20 bg-[#0A0A0A] px-4 py-10 sm:min-h-[52vh] sm:px-8 sm:py-14 lg:min-h-[58vh] lg:px-10 lg:py-20 xl:px-16"
        style={{ backgroundImage: SECTION_ORANGE_FLOW_GRADIENT }}
      >
        <div className="w-full max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1520px] mx-auto">
          <div className="flex flex-col items-center text-center mb-4 sm:mb-8 lg:mb-10">
            <p className="text-[#F97316] uppercase text-[13px] font-bold tracking-[0.22em] mb-4">
              OUR CAPABILITIES
            </p>
            <h2 className="font-display italic uppercase text-white text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] leading-tight max-w-[640px] md:max-w-[720px] lg:max-w-[800px] xl:max-w-[880px] mb-4">
              FULL-SPECTRUM PRODUCTION. ONE STUDIO. ONE STANDARD OF EXCELLENCE.
            </h2>
            <p
              className={cn(
                SECTION_INTRO_FONT,
                "max-w-[300px] sm:max-w-[420px] lg:max-w-[560px] xl:max-w-[640px]",
              )}
            >
              Every discipline your brand needs to own its visual category, under
              one roof.
            </p>
          </div>
          <div className="mb-5 sm:mb-6 lg:mb-7 xl:mb-8">
            <motion.div
              ref={capabilityCardsScrollRef}
              role="region"
              aria-label="Capabilities, swipe horizontally for more"
              className="swipe-x -mx-4 flex min-h-0 cursor-grab snap-x snap-mandatory items-center gap-4 overflow-x-auto pb-6 pt-3 pl-[max(1rem,calc(50%-8.75rem))] pr-[max(1rem,calc(50%-8.75rem))] scrollbar-hide sm:-mx-8 sm:min-h-0 sm:gap-5 sm:pb-7 sm:pt-4 md:hidden"
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={reduceMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true, amount: "some", margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.55, ease: brandEase }}
            >
              <div className="max-md:shrink-0 max-md:[scroll-snap-align:none]">
                <CapabilityMobileSlide
                  card={capabilityCards[3]}
                  decorativeClone
                  cloneMarker="leading-last"
                />
              </div>
              {capabilityCards.map((card, i) => (
                <div
                  key={card.title}
                  className="max-md:shrink-0 max-md:snap-center max-md:snap-always"
                >
                  <CapabilityMobileSlide card={card} capabilityIndex={i} />
                </div>
              ))}
              <div className="max-md:shrink-0 max-md:[scroll-snap-align:none]">
                <CapabilityMobileSlide
                  card={capabilityCards[0]}
                  decorativeClone
                  cloneMarker="trailing-first"
                />
              </div>
            </motion.div>
            <motion.div
              className="hidden md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6 md:cursor-default"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              {capabilityCards.map((card) => (
                <motion.div key={card.title} variants={cardRevealItem}>
                  <CapabilityGridCard card={card} />
                </motion.div>
              ))}
            </motion.div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-[min(100%,22rem)] sm:max-w-none sm:w-auto mx-auto px-1 sm:px-0">
            <Button
                onClick={() => scrollToSection("contact-form")}
              className="flex h-10 w-full items-center justify-center rounded-[12px] border-transparent bg-[#F97316] px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#ea6c0a] sm:h-12 sm:w-auto sm:px-8 sm:text-sm"
            >
              REQUEST A CUSTOM QUOTE
            </Button>
            <Button className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] border border-white bg-transparent px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 sm:h-12 sm:w-auto sm:px-8 sm:text-sm">
              <Images className="h-4 w-4" />
              VIEW OUR PORTFOLIO
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5 — PROCESS
      ═══════════════════════════════════════════════════════════ */}
      <AnimatedSection
        id="process"
        className="flex min-h-dvh min-h-screen scroll-mt-20 flex-col items-stretch justify-center bg-black px-4 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24 xl:px-16"
      >
        <div className="w-full max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1520px] mx-auto">
          <div className="flex flex-col items-center text-center mb-12 sm:mb-14 lg:mb-16">
            <p className="text-[#F97316] uppercase text-[13px] font-bold tracking-[0.22em] mb-4">
              OUR PROCESS
            </p>
            <h2 className="font-display italic uppercase text-white text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] leading-tight max-w-[640px] md:max-w-[720px] lg:max-w-[680px] xl:max-w-[760px] 2xl:max-w-[820px] mb-4">
              STRUCTURED FOR ENTERPRISE. ENGINEERED FOR EXCELLENCE.
            </h2>
            <p
              className={cn(
                SECTION_INTRO_FONT,
                "max-w-[300px] sm:max-w-[420px] lg:max-w-[720px] xl:max-w-[820px] 2xl:max-w-[900px]",
              )}
            >
              Clear milestones, documented deliverables, and complete visibility
              at every stage.
            </p>
          </div>
          <motion.div
            className="w-full max-w-[min(100%,20.5rem)] min-[400px]:max-w-[min(100%,23rem)] sm:max-w-[480px] md:max-w-[600px] lg:max-w-[920px] xl:max-w-[1040px] 2xl:max-w-[1120px] mx-auto px-3 min-[400px]:px-4 sm:px-0 lg:pl-14 xl:pl-20 2xl:pl-24"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
          >
            {processSteps.map((step, i) => {
              const isLast = i === processSteps.length - 1;
              return (
                <motion.div
                  key={step.num}
                  variants={fadeUpItem}
                  className="flex gap-3 sm:gap-6 lg:gap-8 items-stretch"
                >
                  <div className="flex w-12 shrink-0 flex-col items-center self-stretch sm:w-16 lg:w-20">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F97316] sm:h-16 sm:w-16 lg:h-20 lg:w-20">
                      <span className="font-display text-[24px] leading-none text-white sm:text-[32px] lg:text-[40px]">
                        {step.num}
                      </span>
                    </div>
                    {!isLast && (
                      <div className="min-h-[1.5rem] w-[2px] flex-1 bg-[#F97316]" aria-hidden />
                    )}
                  </div>
                  <div className={`min-w-0 flex-1 pt-2 sm:pt-3 lg:pt-4 ${isLast ? "pb-0" : "pb-8 sm:pb-10 lg:pb-12"}`}>
                    <h3 className="text-white font-bold uppercase text-[15px] sm:text-[16px] lg:text-[18px] mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-[13px] leading-[1.45] text-white/85 sm:text-[14px] lg:text-[19px]">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          <div className="mt-12 sm:mt-14 lg:mt-16 w-full max-w-[min(100%,22rem)] sm:max-w-none mx-auto px-1 sm:px-0 flex justify-center">
            <Button
              onClick={() => scrollToSection("contact-form")}
              className="flex h-10 w-full items-center justify-center rounded-[12px] border-transparent bg-[#F97316] px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#ea6c0a] sm:h-12 sm:w-auto sm:min-w-[300px] sm:px-8 sm:text-sm"
            >
              BOOK A STRATEGY CALL
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6 — PORTFOLIO / PROOF OF IMPACT
      ═══════════════════════════════════════════════════════════ */}
      <AnimatedSection
        id="work"
        className="flex min-h-dvh min-h-screen flex-col justify-center overflow-x-hidden scroll-mt-20 bg-[#0A0A0A] px-4 py-10 sm:min-h-[52vh] sm:px-8 sm:py-16 lg:min-h-[58vh] lg:px-10 lg:py-24 xl:px-16"
      >
        <div className="mx-auto w-full max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1520px] min-w-0">
          <div className="mb-8 flex flex-col items-center px-1 text-center sm:mb-10 sm:px-0 lg:mb-14">
            <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.22em] text-[#F97316] sm:mb-4">
              PROOF OF IMPACT
            </p>
            <h2 className="mx-auto max-w-[min(100%,22rem)] font-display text-[28px] uppercase italic leading-[1.08] text-white min-[400px]:max-w-[min(100%,26rem)] min-[400px]:text-[32px] sm:max-w-[640px] sm:text-[40px] sm:leading-tight md:text-[48px] lg:text-[56px] lg:max-w-[760px] xl:max-w-[880px]">
              THE WORK SPEAKS FOR ITSELF
            </h2>
          </div>
          <motion.div
            className="mx-auto mb-8 flex w-full min-w-0 max-w-[1100px] flex-col gap-3.5 sm:mb-10 sm:gap-4 md:grid md:grid-cols-2 md:gap-5 lg:mb-12 lg:max-w-[1240px] lg:gap-6 xl:max-w-[1340px] 2xl:max-w-[1420px]"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
          >
            {portfolioProjects.map((project, i) => (
              <motion.div key={i} variants={cardRevealItem}>
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </motion.div>
          <div className="mx-auto flex w-full max-w-[min(100%,22rem)] flex-col items-stretch justify-center gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:items-center px-1 sm:px-0">
            <Button
              onClick={() => scrollToSection("contact-form")}
              className="flex h-10 w-full items-center justify-center rounded-[12px] border-transparent bg-[#F97316] px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#ea6c0a] sm:h-12 sm:w-auto sm:px-8 sm:text-sm"
            >
              GET RESULTS LIKE THIS
            </Button>
            <Button
              onClick={() => scrollToSection("work")}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] border border-white bg-transparent px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 sm:h-12 sm:w-auto sm:px-8 sm:text-sm"
            >
              <Play className="h-4 w-4 fill-white text-white" />
              VIEW OUR WORK
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7 — THE MICH DIFFERENCE
      ═══════════════════════════════════════════════════════════ */}
      <AnimatedSection
        id="about"
        className="flex min-h-screen scroll-mt-20 flex-col items-stretch justify-center bg-[#0A0A0A] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24 xl:px-16"
      >
        <div className="w-full max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1520px] mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8 sm:mb-10 lg:mb-14">
            <p className="text-[#F97316] uppercase text-[13px] font-bold tracking-[0.22em] mb-4">
              THE MICH DIFFERENCE
            </p>
            <h2 className="mx-auto max-w-full font-display italic uppercase text-white text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] leading-tight md:max-w-[720px] lg:max-w-[800px] xl:max-w-[880px] mb-4">
              WHAT SETS US APART
            </h2>
            <p
              className={cn(
                SECTION_INTRO_FONT,
                "max-w-[min(100%,20rem)] sm:max-w-[28rem] lg:max-w-[48rem] xl:max-w-[56rem] 2xl:max-w-[64rem]",
              )}
            >
              A visual identity so distinctive your audience recognizes your brand
              before they see your logo.
            </p>
          </div>

          {/* Cards — 2×2 on small screens; single row of four from lg */}
          <motion.div
            className="mx-auto mb-10 grid w-full min-w-0 grid-cols-2 gap-3 sm:gap-4 lg:mb-12 lg:grid-cols-4 lg:gap-4 xl:gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {differenceCards.map(({ Icon, title, description, image }) => (
              <motion.div
                key={title}
                variants={cardRevealItem}
                className="relative flex min-h-[17.5rem] min-w-0 flex-col overflow-hidden rounded-xl border border-white/40 bg-[#141414] shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-shadow hover:shadow-[0_0_40px_rgba(249,115,22,0.12)] sm:min-h-[18.5rem] md:min-h-[19rem] lg:min-h-[20rem] xl:min-h-[21.5rem]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Bottom-weighted scrim: dark at bottom, fades toward top so photo stays visible */}
                <div
                  className="pointer-events-none absolute inset-0 z-[1]"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.88) 22%, rgba(0,0,0,0.62) 48%, rgba(0,0,0,0.28) 72%, rgba(0,0,0,0.06) 100%)",
                  }}
                />
                <div className="relative z-10 mt-auto flex flex-col items-start p-3.5 sm:p-5 lg:p-6">
                  <Icon className="mb-2 h-9 w-9 shrink-0 text-white sm:mb-2.5 sm:h-10 sm:w-10 lg:mb-3 lg:h-11 lg:w-11" />
                  <h3 className="text-left text-[15px] font-bold uppercase leading-snug text-[#F97316] sm:text-[17px] lg:text-[18px]">
                    {title}
                  </h3>
                  <p className="mt-2 text-left text-[13px] leading-[1.45] text-white/85 sm:mt-2.5 sm:text-[14px] md:text-[15px]">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA — same mobile width cap as Proof of Impact / dual CTAs */}
          <div className="mx-auto flex w-full max-w-[min(100%,22rem)] flex-col items-stretch justify-center px-1 sm:max-w-none sm:items-center sm:px-0">
            <Button
              onClick={() => scrollToSection("contact-form")}
              className="flex h-10 w-full items-center justify-center rounded-[12px] border-transparent bg-[#F97316] px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#ea6c0a] sm:h-12 sm:w-auto sm:px-8 sm:text-sm"
            >
              BOOK A STRATEGY CALL
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8 — TEAM
      ═══════════════════════════════════════════════════════════ */}
      <AnimatedSection
        id="team"
        className="flex min-h-screen scroll-mt-20 flex-col justify-center overflow-x-hidden overflow-y-visible bg-[#0A0A0A] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24 xl:px-16"
        style={{ backgroundImage: SECTION_ORANGE_FLOW_GRADIENT }}
      >
        <div className="max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1520px] mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8 sm:mb-10 lg:mb-12">
            <p className="text-[#F97316] uppercase text-[13px] font-bold tracking-[0.22em] mb-4">
              OUR TEAM
            </p>
            <h2 className="mx-auto mb-4 max-w-[min(100%,16.5rem)] font-display text-[28px] uppercase italic leading-tight text-white min-[400px]:max-w-[min(100%,18rem)] min-[400px]:text-[30px] sm:max-w-[640px] sm:text-[40px] md:text-[48px] lg:text-[56px] lg:max-w-[900px] xl:max-w-[1000px] 2xl:max-w-[1080px]">
              OVER FIVE DECADES OF COMBINED EXPERIENCE
            </h2>
            <p
              className={cn(
                SECTION_INTRO_FONT,
                "max-w-[min(100%,23rem)] sm:max-w-[34rem] lg:max-w-[54rem] xl:max-w-[62rem] 2xl:max-w-[70rem]",
              )}
            >
              MICH Studios is powered by a multidisciplinary team of directors,
              producers, VFX artists, editors, colorists, and sound designers —
              each bringing years of specialized expertise to every project.
            </p>
          </div>

          {/* Team stats */}
          <motion.div
            className="grid grid-cols-3 max-w-[360px] sm:max-w-[480px] lg:max-w-[600px] xl:max-w-[720px] 2xl:max-w-[800px] mx-auto mb-10 sm:mb-12 lg:mb-14"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
          >
            {[
              { value: "5+", label: "YEARS" },
              { value: "10+", label: "YEARS" },
              { value: "6", label: "DISCIPLINES" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUpItem}
                className={`flex flex-col items-center gap-1 ${
                  i === 1 ? "border-x border-white/[0.1]" : ""
                }`}
              >
                <JumblingMetric
                  value={stat.value}
                  scrambleMs={2400}
                  className="font-display text-white text-[32px] sm:text-[40px] lg:text-[48px] leading-none"
                />
                <span className="text-white uppercase text-[10px] sm:text-[11px] tracking-[0.12em] font-sans">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Role cards — mobile: uniform size; z-index 1→6 so each card stacks above the previous (1 bottom, 6 top) */}
          <div className="mx-auto max-w-[900px] lg:max-w-[1240px] xl:max-w-[1360px]">
            <motion.div
              className="relative isolate mx-auto max-w-[min(100%,24.5rem)] pb-4 min-[400px]:max-w-[27rem] sm:hidden"
              variants={staggerContainer}
              initial={reduceMotion ? "show" : "hidden"}
              whileInView={reduceMotion ? undefined : "show"}
              viewport={{ once: true, amount: 0.12, margin: "0px 0px -8% 0px" }}
            >
              <div className="grid grid-cols-2 items-start gap-x-0">
                <div className="flex min-w-0 flex-col gap-6 min-[400px]:gap-7">
                  {leftRoles.map((role, row) => (
                    <motion.div
                      key={role.title}
                      variants={cardRevealItem}
                      className="relative min-w-0"
                      style={{ zIndex: row * 2 + 1 }}
                    >
                      <RoleCard
                        {...role}
                        className="flex h-[6.75rem] w-full flex-col justify-center rounded-2xl pr-5 shadow-[0_10px_28px_rgba(0,0,0,0.55)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.5),0_0_40px_rgba(249,115,22,0.15)] min-[400px]:h-[7rem] min-[400px]:pr-6 [&_h4]:line-clamp-2 [&_p]:line-clamp-2 [&_p]:max-w-[9.25rem] min-[400px]:[&_p]:max-w-[10rem]"
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="-ml-[1.35rem] flex min-w-0 flex-col gap-6 pt-14 min-[400px]:-ml-[1.65rem] min-[400px]:gap-7 min-[400px]:pt-16">
                  {rightRoles.map((role, row) => (
                    <motion.div
                      key={role.title}
                      variants={cardRevealItem}
                      className="relative min-w-0"
                      style={{ zIndex: row * 2 + 2 }}
                    >
                      <RoleCard
                        {...role}
                        className="flex h-[6.75rem] w-full flex-col items-end justify-center rounded-2xl pl-5 text-right shadow-[0_12px_32px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.55),0_0_40px_rgba(249,115,22,0.15)] min-[400px]:h-[7rem] min-[400px]:pl-6 [&_h4]:line-clamp-2 [&_p]:line-clamp-2"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
            {/* sm–md: 2 cols; lg+: 3×2 (directors row, then VFX row) */}
            <motion.div
              className="hidden sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5"
              variants={staggerContainer}
              initial={reduceMotion ? "show" : "hidden"}
              whileInView={reduceMotion ? undefined : "show"}
              viewport={{ once: true, amount: 0.12, margin: "0px 0px -8% 0px" }}
            >
              {[...leftRoles, ...rightRoles].map((role) => (
                <motion.div key={role.title} variants={cardRevealItem}>
                  <RoleCard {...role} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 9 — MID-PAGE CTA BANNER
      ═══════════════════════════════════════════════════════════ */}
      <AnimatedSection
        id="contact"
        className="relative flex min-h-[50dvh] flex-col justify-center overflow-hidden scroll-mt-20 px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16 xl:px-16"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.32), rgba(0,0,0,0.42)), url('/cta.png'), ${SECTION_ORANGE_FLOW_GRADIENT}`,
          backgroundSize: "cover, cover, cover",
          backgroundPosition: "center, center, center",
        }}
      >
        <motion.div
          className="mx-auto flex max-w-[700px] flex-col items-center text-center lg:max-w-[920px] xl:max-w-[1060px] 2xl:max-w-[1140px]"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.div variants={fadeUpItem}>
            <div className="mb-6 h-[2px] w-[60px] bg-[#F97316] sm:mb-8 mx-auto" />
          </motion.div>
          <motion.h2
            variants={fadeUpItem}
            className="mb-6 max-w-[580px] font-display text-[28px] italic leading-tight text-white sm:mb-8 sm:text-[36px] md:text-[44px] lg:max-w-[880px] lg:text-[52px] xl:max-w-[1000px] 2xl:max-w-[1100px]"
          >
            Your Brand Deserves Work That Outlasts the Campaign It Was Made For.
          </motion.h2>
          <motion.div
            variants={fadeUpItem}
            className="mx-auto flex w-full max-w-[min(100%,22rem)] flex-col items-stretch justify-center px-1 sm:max-w-none sm:items-center sm:px-0"
          >
            <Button
              onClick={() => scrollToSection("contact-form")}
              className="flex h-10 w-full items-center justify-center rounded-[12px] border-transparent bg-[#F97316] px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#ea6c0a] sm:h-12 sm:w-auto sm:px-8 sm:text-sm"
            >
              GET A CUSTOM QUOTE
            </Button>
          </motion.div>
        </motion.div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════
          CONTACT FORM (below CTA)
      ═══════════════════════════════════════════════════════════ */}
      <AnimatedSection
        id="contact-form"
        aria-label="Contact form"
        className="scroll-mt-20 flex min-h-dvh min-h-screen flex-col justify-center border-t border-white/[0.06] bg-[#0A0A0A] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20 xl:px-16"
      >
        <motion.div
          className="mx-auto flex w-full max-w-[480px] flex-col items-center md:max-w-[560px] lg:max-w-[640px] xl:max-w-[720px]"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
        >
          <motion.div
            variants={fadeUpItem}
            className="mb-10 w-full text-center sm:mb-12"
          >
            <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.22em] text-[#F97316] sm:mb-4 lg:mb-4">
              CONTACT
            </p>
            <h2 className="mx-auto mb-4 max-w-[min(100%,18rem)] font-display text-[28px] uppercase italic leading-tight text-white min-[400px]:max-w-[min(100%,20rem)] min-[400px]:text-[32px] sm:max-w-[640px] sm:text-[40px] md:text-[44px] lg:max-w-[900px] lg:text-[56px] xl:max-w-[1000px] 2xl:max-w-[1080px]">
              START THE CONVERSATION
            </h2>
            <p
              className={cn(
                SECTION_INTRO_FONT,
                "mx-auto max-w-full px-1 text-[15px] leading-relaxed sm:max-w-[28rem] sm:px-0 sm:text-[16px] lg:max-w-[54rem] lg:px-0 xl:max-w-[62rem] 2xl:max-w-[70rem]",
              )}
            >
              Share your goals, timeline, and what you need. We read every message
              and usually reply within one business day.
            </p>
          </motion.div>

          <motion.div variants={fadeUpItem} className="w-full">
            <form
              onSubmit={submitContactMailto}
              className="flex w-full flex-col gap-5"
            >
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-white/70"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full rounded-[12px] border border-white/[0.14] bg-white/[0.06] px-4 py-3 text-[15px] text-white placeholder:text-white/35 focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-white/70"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-[12px] border border-white/[0.14] bg-white/[0.06] px-4 py-3 text-[15px] text-white placeholder:text-white/35 focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-white/70"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  className="min-h-[8rem] w-full resize-y rounded-[12px] border border-white/[0.14] bg-white/[0.06] px-4 py-3 text-[15px] text-white placeholder:text-white/35 focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
                  placeholder="Tell us about your project…"
                />
              </div>
              <div className="flex w-full justify-end">
                <Button
                  type="submit"
                  className="flex h-11 w-1/3 min-w-[5.5rem] items-center justify-center gap-2 rounded-[12px] border-transparent bg-[#F97316] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#ea6c0a] sm:h-12 sm:text-sm"
                >
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </form>
          </motion.div>

          <motion.div
            variants={fadeUpItem}
            className="relative my-10 w-full sm:my-12"
            role="separator"
          >
            <div className="absolute inset-0 flex items-center" aria-hidden>
              <div className="w-full border-t border-white/[0.1]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0A0A0A] px-4 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
                or reach us through
              </span>
            </div>
          </motion.div>

          <motion.p variants={fadeUpItem} className="mt-3 text-center sm:mt-4">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-block max-w-full break-words text-2xl font-semibold leading-tight tracking-tight text-[#F97316] transition-colors hover:text-[#fb923c] hover:underline min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem]"
            >
              {CONTACT_EMAIL}
            </a>
          </motion.p>
        </motion.div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <motion.footer
        className="bg-[#F97316] px-5 sm:px-8 lg:px-10 xl:px-16 pt-12 pb-8 sm:pt-14 lg:pt-16 lg:pb-10"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: brandEase }}
      >
        {/* ── Mobile layout ─────────────────────────────────── */}
        <div className="lg:hidden flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-4 flex flex-col items-center">
            <Link
              href="/"
              className="relative mx-auto block h-[4.5rem] w-[min(100%,220px)] shrink-0 sm:h-20 sm:w-[240px]"
            >
              <Image
                src="/logoalt.svg"
                alt="MichHub"
                fill
                className="object-contain object-center"
                sizes="240px"
              />
            </Link>
          </div>
          {/* Tagline */}
          <p className="text-white/85 text-[12px] mb-6">
            NDA-ready · Proposals in 48hrs · Enterprise billing · 30-day support
          </p>
          <div className="w-full border-t border-white/20 mb-8" />

          {/* Quick Links */}
          <p className="text-white text-[20px] font-sans font-semibold mb-4">
            Quick Links
          </p>
          <nav className="flex flex-col mb-8">
            {footerLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-white text-[16px] leading-[2.5] hover:underline"
              >
                {link}
              </a>
            ))}
          </nav>
          <div className="w-full border-t border-white/20 mb-8" />

          {/* Contact — row 1: phone + email centered; row 2: address centered */}
          <p className="text-white text-[20px] font-sans font-semibold mb-5">
            Contact
          </p>
          <div className="mb-8 flex w-full flex-col items-center gap-5 px-1">
            <div className="flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-8">
              <div className="flex items-center gap-2">
                <Phone className="h-[18px] w-[18px] shrink-0 text-white" />
                <span className="whitespace-nowrap text-[14px] text-white">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-[18px] w-[18px] shrink-0 text-white" />
                <span className="whitespace-nowrap text-[14px] text-white">
                  admin@michhub.com
                </span>
              </div>
            </div>
            <div className="mx-auto flex w-full flex-row items-start justify-center gap-2.5 sm:max-w-[34rem] md:max-w-[36rem]">
              <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-white" />
              <span className="min-w-0 text-[14px] leading-snug text-white text-left">
                123 Cloud Avenue, Tech City, CA 94088, USA
              </span>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-6 mb-8">
            {[FacebookIcon, LinkedinIcon, TwitterIcon, InstagramIcon].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="text-white hover:text-white/70 transition-colors">
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-white/80 text-[12px] text-center">
            © 2026 Media Innovation and Creative Haven corp. All rights reserved
          </p>
        </div>

        {/* ── Desktop layout ────────────────────────────────── */}
        <div className="hidden lg:block max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1520px] mx-auto">
          {/* 3-col grid */}
          <div className="grid grid-cols-3 gap-8 mb-10">
            {/* Col 1: Logo + tagline */}
            <div className="flex flex-col items-start">
              <div className="mb-4 flex flex-col items-start">
                <Link
                  href="/"
                  className="relative block h-[5rem] w-[200px] shrink-0 xl:h-[5.5rem] xl:w-[230px]"
                >
                  <Image
                    src="/logoalt.svg"
                    alt="MichHub"
                    fill
                    className="object-contain object-left"
                    sizes="(min-width: 1280px) 230px, 200px"
                  />
                </Link>
              </div>
              <p className="text-white/85 text-[12px] leading-relaxed max-w-[220px] xl:max-w-[280px]">
                NDA-ready · Proposals in 48hrs · Enterprise billing · 30-day
                support
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div className="flex flex-col items-start text-left">
              <p className="text-white text-[20px] font-sans font-semibold mb-4">
                Quick Links
              </p>
              <nav className="flex flex-col items-start">
                {footerLinks.map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="text-white text-[15px] leading-[2.4] hover:underline"
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>

            {/* Col 3: Contact */}
            <div className="flex flex-col items-start text-left">
              <p className="mb-5 font-sans text-[20px] font-semibold text-white">
                Contact
              </p>
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center justify-start gap-3">
                  <Phone className="h-[18px] w-[18px] shrink-0 text-white" />
                  <span className="text-[14px] text-white">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center justify-start gap-3">
                  <Mail className="h-[18px] w-[18px] shrink-0 text-white" />
                  <span className="text-[14px] text-white">admin@michhub.com</span>
                </div>
                <div className="flex max-w-[16rem] flex-row items-start gap-2 xl:max-w-[20rem]">
                  <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-white" />
                  <span className="text-[14px] leading-snug text-white">
                    123 Cloud Avenue, Tech City, CA 94088, USA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 mb-6" />

          {/* Social icons */}
          <div className="flex items-center justify-center gap-6 mb-5">
            {[FacebookIcon, LinkedinIcon, TwitterIcon, InstagramIcon].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="text-white hover:text-white/70 transition-colors">
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-white/80 text-[12px] text-center">
            © 2026 Media Innovation and Creative Haven corp. All rights reserved
          </p>
        </div>
      </motion.footer>
    </main>
  );
}
