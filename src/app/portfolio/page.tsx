"use client";

import { useState, useEffect, type ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brandEase, staggerContainer, cardRevealItem } from "@/lib/motion-presets";
import dynamic from "next/dynamic";

const PageLoader = dynamic(
  () => import("@/components/PageLoader").then((m) => ({ default: m.PageLoader })),
  { ssr: false }
);

// ─── Social Icons ─────────────────────────────────────────────────────────────
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

const menuSocialLinks: {
  label: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
];

const navItems: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/#contact-form" },
];

const footerLinks = ["Home", "Services", "Process", "Work", "About", "FAQs"];

// ─── Portfolio Data ────────────────────────────────────────────────────────────

interface PortfolioItem {
  id: string;
  title: string;
  tags: string;
  imageSrc: string;
  url?: string;
  order: number;
}

// ─── Components ───────────────────────────────────────────────────────────────

function PortfolioTile({ item, index }: { item: PortfolioItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const hasLink = !!item.url;

  const content = (
    <>
      {/* Main image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageSrc}
        alt={item.title}
        loading="eager"
        fetchPriority={index < 2 ? "high" : "auto"}
        className="h-full w-full object-cover"
        style={{ aspectRatio: "16/10", minHeight: "280px" }}
      />

      {/* Base overlay — always visible, darkens image */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Hover overlay — additional darkening */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-500 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* VIEW PROJECT button — appears on hover */}
      {hasLink && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="flex h-10 items-center justify-center rounded-[12px] border border-white bg-transparent px-5 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:border-[#F97316] hover:bg-[#F97316] sm:px-8">
            VIEW PROJECT
          </span>
        </div>
      )}

      {/* Bottom info overlay — always visible */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-5 py-6 sm:px-6 sm:py-7">
        <h3 className="mb-2.5 text-[14px] font-bold uppercase leading-snug text-white sm:text-[16px] lg:text-[18px] line-clamp-2">
          {item.title}
        </h3>
        <span className="inline-block rounded-sm bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/80 sm:text-[12px]">
          {item.tags}
        </span>
      </div>
    </>
  );

  return (
    <motion.div
      variants={cardRevealItem}
      className="group relative overflow-hidden bg-[#141414] cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hasLink ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
          {content}
        </a>
      ) : (
        content
      )}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPortfolioItems(data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageLoader onComplete={() => setLoaderDone(true)} />
    <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col" style={{ visibility: loaderDone ? undefined : "hidden" }}>
      {/* ─── Mobile Menu Overlay ──────────────────────────────────── */}
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
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="max-w-[min(100%,20rem)] text-center font-display text-[1.35rem] uppercase italic leading-snug text-white transition-colors hover:text-[#F97316] min-[400px]:text-3xl sm:text-4xl"
                >
                  {label}
                </Link>
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

      {/* ─── Mobile Nav ───────────────────────────────────────────── */}
      <nav className="relative z-20 flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-6 lg:hidden">
        <Link
          href="/"
          className="relative block h-14 w-[min(360px,82vw)] shrink-0 -ml-[10px]"
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

      {/* ─── Desktop Nav ──────────────────────────────────────────── */}
      <nav className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-4 relative z-20 px-10 xl:px-16 2xl:px-20 pt-8 max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1520px] w-full mx-auto">
        <div className="flex justify-start items-center min-w-0">
          <Link
            href="/"
            className="relative block h-[4.5rem] w-[380px] max-w-full shrink-0 xl:h-[5.25rem] xl:w-[460px] -ml-[10px]"
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
            <Link
              key={href}
              href={href}
              className={`text-center text-[10px] font-medium uppercase tracking-[0.12em] transition-colors xl:text-[11px] ${
                href === "/portfolio"
                  ? "text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex justify-end items-center min-w-0">
          <Link href="/#contact-form">
            <Button className="flex h-10 shrink-0 items-center justify-center rounded-[12px] border-transparent bg-[#F97316] px-5 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#ea6c0a] sm:px-8">
              Inquire Now
            </Button>
          </Link>
        </div>
      </nav>

      
      {/* ─── Portfolio Grid ───────────────────────────────────────── */}
      <main className="flex-1">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2"
          variants={staggerContainer}
          initial={reduceMotion ? "show" : "hidden"}
          animate={reduceMotion ? "show" : (loaderDone ? "show" : "hidden")}
        >
          {portfolioItems.map((item, i) => (
            <PortfolioTile key={item.id} item={item} index={i} />
          ))}
          {portfolioItems.length === 0 && (
            <div className="col-span-2 flex items-center justify-center py-32 text-white/20 text-sm">
              Loading portfolio…
            </div>
          )}
        </motion.div>
      </main>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <motion.footer
        className="bg-[#F97316] px-5 sm:px-8 lg:px-10 xl:px-16 pt-12 pb-8 sm:pt-14 lg:pt-16 lg:pb-10"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: brandEase }}
      >
        {/* ── Mobile layout ─────────────────────────────────── */}
        <div className="lg:hidden flex flex-col items-center text-center">
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
          <p className="text-white/85 text-[12px] mb-6">
            NDA-ready · Proposals in 48hrs · Enterprise billing · 30-day support
          </p>
          <div className="w-full border-t border-white/20 mb-8" />

          <p className="text-white text-[20px] font-sans font-semibold mb-4">Quick Links</p>
          <nav className="flex flex-col mb-8">
            {footerLinks.map((link) => (
              <a
                key={link}
                href={`/#${link.toLowerCase()}`}
                className="text-white text-[16px] leading-[2.5] hover:underline"
              >
                {link}
              </a>
            ))}
          </nav>
          <div className="w-full border-t border-white/20 mb-8" />

          <p className="text-white text-[20px] font-sans font-semibold mb-5">Contact</p>
          <div className="mb-8 flex w-full flex-col items-center gap-5 px-1">
            <div className="flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-8">
              <div className="flex items-center gap-2">
                <Phone className="h-[18px] w-[18px] shrink-0 text-white" />
                <span className="whitespace-nowrap text-[14px] text-white">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-[18px] w-[18px] shrink-0 text-white" />
                <span className="whitespace-nowrap text-[14px] text-white">admin@michhub.com</span>
              </div>
            </div>
            <div className="mx-auto flex w-full flex-row items-start justify-center gap-2.5 sm:max-w-[34rem] md:max-w-[36rem]">
              <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-white" />
              <span className="min-w-0 text-[14px] leading-snug text-white text-left">
                123 Cloud Avenue, Tech City, CA 94088, USA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-8">
            {[FacebookIcon, LinkedinIcon, TwitterIcon, InstagramIcon].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="text-white hover:text-white/70 transition-colors">
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>

          <p className="text-white/80 text-[12px] text-center">
            © 2026 Media Innovation and Creative Haven corp. All rights reserved
          </p>
        </div>

        {/* ── Desktop layout ────────────────────────────────── */}
        <div className="hidden lg:block max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1520px] mx-auto">
          <div className="grid grid-cols-3 gap-8 mb-10">
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
                NDA-ready · Proposals in 48hrs · Enterprise billing · 30-day support
              </p>
            </div>

            <div className="flex flex-col items-start text-left">
              <p className="text-white text-[20px] font-sans font-semibold mb-4">Quick Links</p>
              <nav className="flex flex-col items-start">
                {footerLinks.map((link) => (
                  <a
                    key={link}
                    href={`/#${link.toLowerCase()}`}
                    className="text-white text-[15px] leading-[2.4] hover:underline"
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex flex-col items-start text-left">
              <p className="mb-5 font-sans text-[20px] font-semibold text-white">Contact</p>
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

          <div className="border-t border-white/20 mb-6" />

          <div className="flex items-center justify-center gap-6 mb-5">
            {[FacebookIcon, LinkedinIcon, TwitterIcon, InstagramIcon].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="text-white hover:text-white/70 transition-colors">
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>

          <p className="text-white/80 text-[12px] text-center">
            © 2026 Media Innovation and Creative Haven corp. All rights reserved
          </p>
        </div>
      </motion.footer>
    </div>
    </>
  );
}
