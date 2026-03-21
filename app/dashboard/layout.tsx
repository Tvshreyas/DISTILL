"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { ShaderAnimation } from "@/components/ui/shader-lines";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/dashboard/library", label: "Archive", icon: LibraryIcon },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
] as const;

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function LibraryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function SignOutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-soft-black font-sans selection:bg-peach selection:text-soft-black">
      {/* Analog Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.12] mix-blend-multiply bg-[url('https://grain-y.vercel.app/noise.svg')] bg-repeat z-50" />

      {/* Floating Ghost Navbar (Desktop) */}
      <div className="hidden md:flex fixed top-8 left-1/2 -translate-x-1/2 z-40">
        <nav className="flex items-center gap-1 p-2 bg-white/40 backdrop-blur-xl brutal-border border-4 border-soft-black rounded-2xl shadow-2xl">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive(href)
                  ? "bg-sage text-soft-black brutal-border-sm -translate-y-1 brutal-shadow-xs"
                  : "text-muted-text hover:text-soft-black hover:bg-sage/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <div className="w-[2px] h-6 bg-soft-black/10 mx-2" />
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-muted-text hover:text-peach-dark hover:bg-peach/10 rounded-xl transition-all"
          >
            <SignOutIcon className="w-4 h-4" />
            Sign out
          </button>
        </nav>
      </div>

      {/* Main content area */}
      <div className="relative min-h-screen">
        {/* Dynamic Focus Header with Shader */}
        <header className="relative h-64 w-full border-b-4 border-soft-black bg-white overflow-hidden group">
          <ShaderAnimation />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white brutal-border border-2 border-soft-black rounded-[2rem] shadow-xl group-hover:scale-110 transition-transform duration-500">
                <div className="w-4 h-4 rounded-full bg-peach animate-pulse" />
              </div>
              <h2 className="font-grotesk text-5xl font-black lowercase tracking-tighter text-soft-black">
                {NAV_ITEMS.find(i => isActive(i.href))?.label || "Home"}
              </h2>
            </div>
          </div>
        </header>

        {/* Scrollable Children */}
        <main className="max-w-7xl mx-auto p-8 pb-32">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation (Refined Ghost Style) */}
      <nav className="md:hidden fixed bottom-8 left-8 right-8 h-18 bg-white/60 backdrop-blur-2xl brutal-border border-4 border-soft-black rounded-[2rem] flex items-center justify-around z-[60] shadow-2xl">
        {NAV_ITEMS.map(({ href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 p-4 rounded-2xl transition-all ${
              isActive(href) ? "bg-peach brutal-border-sm -translate-y-4 scale-110 shadow-xl text-soft-black" : "text-muted-text"
            }`}
          >
            <Icon className="w-6 h-6" />
          </Link>
        ))}
      </nav>
    </div>
  );
}
