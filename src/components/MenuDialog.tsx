"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { CloseIcon, NavGlyph } from "@/components/Icons";
import { Wordmark } from "@/components/LogoMark";
import { navTabs, secondaryLinks } from "@/config/site";

/** Two-bar hamburger opening a full-screen native <dialog> menu. */
export function MenuDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => triggerRef.current?.focus();
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className="icon-btn size-11 text-fg"
      >
        <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true" focusable="false">
          <rect y="1" width="20" height="2" rx="1" fill="currentColor" />
          <rect x="6" y="11" width="14" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>
      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        className="menu-dialog m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-fg"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="flex min-h-full flex-col px-[var(--gutter)] pt-[env(safe-area-inset-top)] pb-[calc(2rem+env(safe-area-inset-bottom))]">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" onClick={close} aria-label="Leonida Companion home" className="rounded-md">
              <Wordmark />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={close}
              className="icon-btn size-11 text-fg"
            >
              <CloseIcon size={22} />
            </button>
          </div>
          <nav aria-label="Menu" className="mt-6 flex flex-1 flex-col gap-10 md:mt-14">
            <p className="eyebrow">Navigate</p>
            <ul className="-mt-6 flex flex-col border-t border-line">
              {navTabs.map((tab, index) => {
                const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
                return (
                  <li key={tab.href}>
                    <Link
                      href={tab.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={`group flex min-h-16 items-center gap-4 border-b border-line py-3 transition-colors duration-150 hover:text-accent ${
                        active ? "text-accent" : "text-fg"
                      }`}
                    >
                      <span className="w-7 font-mono text-[12px] text-faint">0{index + 1}</span>
                      <span className="display flex-1 text-[clamp(2.5rem,2rem+3vw,4rem)]">{tab.label}</span>
                      <NavGlyph icon={tab.icon} size={26} className="text-muted transition-colors duration-150 group-hover:text-accent" />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {secondaryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="flex min-h-11 items-center font-mono text-[13px] tracking-[0.08em] text-muted uppercase transition-colors duration-150 hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>
    </>
  );
}
