import { cn } from "@/lib/utils";

export function AntigravityLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-10 w-10", className)}
        >
            <rect x="0" y="0" width="64" height="64" rx="16" className="fill-primary" />
            <rect x="14" y="36" width="16" height="16" rx="2" className="fill-primary-foreground" />
            <rect x="34" y="36" width="16" height="16" rx="2" className="fill-primary-foreground" />
            <rect x="14" y="16" width="16" height="16" rx="2" className="fill-primary-foreground" />
            <rect
                x="36"
                y="12"
                width="16"
                height="16"
                rx="2"
                className="fill-primary-foreground"
                transform="rotate(5 44 20)"
            />
        </svg>
    );
}
