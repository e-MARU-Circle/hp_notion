"use client";

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const Footer = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!open) return;
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target) && buttonRef.current && !buttonRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <footer className="border-t border-stone-200 mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center text-sm text-stone-500">
        <p>© 2025 ABOJC. All Rights Reserved.</p>

        <div className="relative flex items-center gap-3">
          {/* Footer navigation (visible on sm+). Mirrors header anchors. */}
          <nav className="hidden sm:flex items-center gap-4">
            <Link href="#about" className="hover:text-stone-800 transition-colors">About Us</Link>
            <Link href="#papers" className="hover:text-stone-800 transition-colors">論文紹介</Link>
            <Link href="#members" className="hover:text-stone-800 transition-colors">Group Members</Link>
            <Link href="#contact" className="hover:text-stone-800 transition-colors">Contact Us</Link>
          </nav>

          {/* Three-dots button to open a small window (popover) */}
          <button
            ref={buttonRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls="footer-more-menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-stone-300 text-stone-600 hover:text-stone-900 hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/50"
            title="More"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M6 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
            </svg>
          </button>

          {open && (
            <div
              ref={menuRef}
              id="footer-more-menu"
              role="menu"
              aria-label="Footer menu"
              className="absolute right-0 top-full mt-2 w-56 rounded-md border border-stone-200 bg-white shadow-lg ring-1 ring-black/5 p-2 z-20"
            >
              <div className="px-2 py-1.5 text-xs uppercase tracking-wide text-stone-400">Navigation</div>
              <div className="flex flex-col">
                <Link
                  href="#about"
                  role="menuitem"
                  className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100"
                  onClick={() => setOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="#papers"
                  role="menuitem"
                  className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100"
                  onClick={() => setOpen(false)}
                >
                  論文紹介
                </Link>
                <Link
                  href="#members"
                  role="menuitem"
                  className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100"
                  onClick={() => setOpen(false)}
                >
                  Group Members
                </Link>
                <Link
                  href="#contact"
                  role="menuitem"
                  className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100"
                  onClick={() => setOpen(false)}
                >
                  Contact Us
                </Link>
              </div>

              {/* GitHub リンクは削除 */}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
