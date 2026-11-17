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
        className="flex size-12 items-center justify-center rounded-full text-fg transition-colors duration-150 hover:text-accent"
      >
        <svg width="28" height="20" viewBox="0 0 28 20" aria-hidden="true" focusable="false">
          <rect x="1" y="3" width="26" height="3.5" rx="1" fill="currentColor" />
          <rect x="1" y="13.5" width="26" height="3.5" rx="1" fill="currentColor" />
        </svg>
      </button>
      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        className="menu-dialog m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-fg backdrop:bg-transparent"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="mx-auto flex min-h-full max-w-[1100px] flex-col px-5 pt-[env(safe-area-inset-top)] pb-[calc(2rem+env(safe-area-inset-bottom))] md:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" onClick={close} aria-label="Leonida Companion home" className="rounded-xl">
              <Wordmark />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={close}
              className="flex size-12 items-center justify-center rounded-full text-fg transition-colors duration-150 hover:text-accent"
            >
              <CloseIcon size={28} />
            </button>
          </div>
          <nav aria-label="Menu" className="mt-8 flex flex-1 flex-col gap-10 md:mt-16">
            <ul className="flex flex-col gap-1">
              {navTabs.map((tab) => {
                const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
                return (
                  <li key={tab.href}>
                    <Link
                      href={tab.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-14 items-center gap-4 rounded-2xl py-2 text-[clamp(2rem,1.6rem+2vw,3rem)] font-medium transition-colors duration-150 hover:text-accent ${
                        active ? "text-accent" : "text-fg"
                      }`}
                    >
                      <NavGlyph icon={tab.icon} size={32} />
                      {tab.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="flex flex-col gap-1 border-t border-line pt-6">
              {secondaryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="flex min-h-12 items-center rounded-xl text-lg text-muted transition-colors duration-150 hover:text-fg"
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
