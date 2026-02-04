import type { HTMLAttributes } from "react";

type CreditOverlayProps = HTMLAttributes<HTMLDivElement>;

export default function CreditOverlay({
  children,
  className = "",
  ...props
}: CreditOverlayProps) {
  return (
    <div
      className={`fixed z-99 px-4 py-3 text-xs text-white font-sans pointer-events-none ${className}`}
      {...props}
    >
      <div className="pointer-events-auto">{children}</div>
    </div>
  );
}
