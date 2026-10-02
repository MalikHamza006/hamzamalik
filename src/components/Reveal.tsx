"use client";

import { useEffect, useRef, useState } from "react";
import type { ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  variant?: "up" | "clip";
  className?: string;
  as?: ElementType;
  once?: boolean;
  amount?: number;
};

export default function Reveal({
  children,
  delay = 0,
  variant = "up",
  className = "",
  as: Tag = "div",
  once = true,
  amount = 0.05,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: amount, rootMargin: "0px 0px -2% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, amount]);

  const MotionTag = Tag as ElementType;

  return (
    <MotionTag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`${variant === "clip" ? "reveal-clip" : "reveal"} ${
        visible ? "is-visible" : ""
      } ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </MotionTag>
  );
}