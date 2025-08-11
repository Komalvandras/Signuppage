// src/components/Brand.tsx
import type { JSX } from 'solid-js';

type BrandProps = {
  class?: string;          // Solid's way
  className?: string;      // tolerate React-style to avoid errors
  children?: JSX.Element;  // optional: allow children if you ever need
};

export default function Brand(props: BrandProps) {
  const cls = () => props.class ?? props.className ?? '';

  return (
    <a href="/" class={`flex items-center gap-2 select-none ${cls()}`}>
      {/* Swap this for an <img src="/logo.svg" ... /> when you have a real logo */}
      <span class="text-2xl font-extrabold tracking-tight">
        <span class="text-gray-900">Level</span>
        <span class="text-indigo-600">Nine</span>
      </span>
    </a>
  );
}
