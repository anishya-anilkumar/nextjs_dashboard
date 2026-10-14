import { GlobeAltIcon } from '@heroicons/react/24/outline';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 leading-none text-white ${className}`}>
      <GlobeAltIcon className="h-10 w-10 rotate-[15deg]" aria-hidden />
      <p className="font-display text-3xl">Acme</p>
    </div>
  );
}
