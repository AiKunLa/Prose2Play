import type { IconName } from "./types";

type IconProps = {
  name: IconName;
};

export function Icon({ name }: IconProps) {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px] shrink-0" fill="none" viewBox="0 0 24 24">
      {renderIconPath(name)}
    </svg>
  );
}

function renderIconPath(name: IconName) {
  const common = {
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8
  };

  switch (name) {
    case "dashboard":
      return (
        <>
          <rect x="3" y="3" width="8" height="8" rx="2" {...common} />
          <rect x="13" y="3" width="8" height="5" rx="2" {...common} />
          <rect x="13" y="10" width="8" height="11" rx="2" {...common} />
          <rect x="3" y="13" width="8" height="8" rx="2" {...common} />
        </>
      );
    case "spark":
      return (
        <>
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" {...common} />
          <path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z" {...common} />
        </>
      );
    case "settings":
      return (
        <>
          <circle cx="12" cy="12" r="3" {...common} />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.1a1 1 0 0 0-.7-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.1a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.1a1 1 0 0 0 .6.9h.1a1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.1a1 1 0 0 0-.9.6Z" {...common} />
        </>
      );
    case "bell":
      return (
        <>
          <path d="M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7Z" {...common} />
          <path d="M10 19a2 2 0 0 0 4 0" {...common} />
        </>
      );
    case "user":
      return (
        <>
          <circle cx="12" cy="8" r="4" {...common} />
          <path d="M5 20a7 7 0 0 1 14 0" {...common} />
        </>
      );
    case "plus":
      return <path d="M12 5v14M5 12h14" {...common} />;
    case "dots":
      return (
        <>
          <circle cx="12" cy="5" r="1.4" fill="currentColor" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" />
          <circle cx="12" cy="19" r="1.4" fill="currentColor" />
        </>
      );
    case "play":
      return <path d="M8 6l10 6-10 6V6Z" {...common} />;
    case "upload":
      return (
        <>
          <path d="M12 16V4" {...common} />
          <path d="M7 9l5-5 5 5" {...common} />
          <path d="M4 20h16" {...common} />
        </>
      );
    case "document":
      return (
        <>
          <path d="M7 3h7l5 5v13H7V3Z" {...common} />
          <path d="M14 3v6h6" {...common} />
        </>
      );
    case "check":
      return <path d="M5 13l4 4L19 7" {...common} />;
    case "clock":
      return (
        <>
          <circle cx="12" cy="12" r="8" {...common} />
          <path d="M12 8v5l3 2" {...common} />
        </>
      );
    case "warning":
      return (
        <>
          <path d="M12 4l8 14H4L12 4Z" {...common} />
          <path d="M12 9v4" {...common} />
          <path d="M12 17h.01" {...common} />
        </>
      );
    case "edit":
      return (
        <>
          <path d="M4 20l4.5-1 9-9a2.1 2.1 0 0 0-3-3l-9 9L4 20Z" {...common} />
          <path d="M13.5 6.5l3 3" {...common} />
        </>
      );
    case "magic":
      return (
        <>
          <path d="M4 20l7-7" {...common} />
          <path d="M14 4l6 6" {...common} />
          <path d="M12 6l2-2" {...common} />
          <path d="M6 12l2-2" {...common} />
          <path d="M16 8l4-4" {...common} />
        </>
      );
    case "filter":
      return (
        <>
          <path d="M4 6h16" {...common} />
          <path d="M7 12h10" {...common} />
          <path d="M10 18h4" {...common} />
        </>
      );
    case "search":
      return (
        <>
          <circle cx="11" cy="11" r="6" {...common} />
          <path d="M20 20l-4.2-4.2" {...common} />
        </>
      );
    case "code":
      return (
        <>
          <path d="M8 8l-4 4 4 4" {...common} />
          <path d="M16 8l4 4-4 4" {...common} />
        </>
      );
    case "group":
      return (
        <>
          <circle cx="9" cy="9" r="3" {...common} />
          <circle cx="17" cy="10" r="2.5" {...common} />
          <path d="M4 20a5 5 0 0 1 10 0" {...common} />
          <path d="M14 20a4 4 0 0 1 6 0" {...common} />
        </>
      );
    case "refresh":
      return (
        <>
          <path d="M20 11a8 8 0 1 0 2 5" {...common} />
          <path d="M20 4v7h-7" {...common} />
        </>
      );
    case "wand":
      return (
        <>
          <path d="M4 20l11-11" {...common} />
          <path d="M14 4l1.2 3.2L18.5 8.5 15.3 9.7 14 13l-1.3-3.3L9.5 8.5l3.2-1.3L14 4Z" {...common} />
        </>
      );
    case "book":
      return (
        <>
          <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21V5.5Z" {...common} />
          <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19" {...common} />
        </>
      );
    case "lock":
      return (
        <>
          <rect x="6" y="11" width="12" height="9" rx="2" {...common} />
          <path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11" {...common} />
        </>
      );
    case "arrow":
      return <path d="M5 12h14M13 6l6 6-6 6" {...common} />;
    default:
      return <circle cx="12" cy="12" r="8" {...common} />;
  }
}
