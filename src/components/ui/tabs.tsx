"use client";

import * as React from "react";

export type TabKey = string;

export interface TabsProps {
  tabs: { key: TabKey; label: string; count?: number }[];
  current: TabKey;
  onChange: (key: TabKey) => void;
  className?: string;
}

export function Tabs({ tabs, current, onChange, className }: TabsProps) {
  return (
    <div className={["flex items-center gap-2 border-b border-neutral-800", className ?? ""].join(" ")}
    >
      {tabs.map((t) => {
        const active = t.key === current;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={[
              "px-3 py-2 text-sm font-medium rounded-t-md",
              active
                ? "text-neutral-100 border border-neutral-800 border-b-transparent bg-neutral-900"
                : "text-neutral-400 hover:text-neutral-200",
            ].join(" ")}
          >
            <span>{t.label}</span>
            {typeof t.count === "number" && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1 text-[11px] text-neutral-300 border border-neutral-800">
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}


