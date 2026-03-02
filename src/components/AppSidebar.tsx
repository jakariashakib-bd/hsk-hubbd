import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Edit3, Headphones, Trophy, MessageCircle } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
];

const studyItems = [
  { to: "/course", icon: BookOpen, label: "Study" },
  { to: "/practice", icon: Edit3, label: "Practice" },
  { to: "/listening", icon: Headphones, label: "Listening" },
];

const socialItems = [
  { to: "/progress", icon: Trophy, label: "Progress" },
  { to: "/community", icon: MessageCircle, label: "HSK Talk", badge: true },
];

const SidebarLink = ({ to, icon: Icon, label, badge }: { to: string; icon: any; label: string; badge?: boolean }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
      {badge && (
        <span className="ml-auto w-2 h-2 rounded-full bg-secondary animate-pulse-glow" />
      )}
    </NavLink>
  );
};

const AppSidebar = () => {
  return (
    <aside className="w-56 min-h-screen bg-primary flex flex-col p-4 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 py-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-sidebar-foreground/20 flex items-center justify-center brutalist-border border-sidebar-foreground/30">
          <span className="text-sidebar-foreground font-bold text-lg font-mono">H</span>
        </div>
        <span className="text-sidebar-foreground font-bold text-lg tracking-tight">HSK Hub</span>
      </div>

      {/* Main Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}
      </nav>

      {/* Study Area */}
      <div className="mt-6">
        <p className="text-sidebar-foreground/50 text-xs font-mono uppercase tracking-wider px-4 mb-2">
          Study Area
        </p>
        <nav className="flex flex-col gap-1">
          {studyItems.map((item) => (
            <SidebarLink key={item.to} {...item} />
          ))}
        </nav>
      </div>

      {/* Social */}
      <div className="mt-6">
        <p className="text-sidebar-foreground/50 text-xs font-mono uppercase tracking-wider px-4 mb-2">
          Social
        </p>
        <nav className="flex flex-col gap-1">
          {socialItems.map((item) => (
            <SidebarLink key={item.to} {...item} />
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <div className="mt-auto flex flex-col gap-2 pt-4">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground text-sm transition-colors">
          <span className="text-lg">🌐</span>
          <span>English</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-sidebar-foreground text-primary font-medium text-sm brutalist-border border-sidebar-foreground hover:opacity-90 transition-opacity">
          Sign In
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
