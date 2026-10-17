import { initials } from '@/app/lib/utils';

/** Initials avatar — no external image dependency. */
export default function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-700"
    >
      {initials(name)}
    </span>
  );
}
