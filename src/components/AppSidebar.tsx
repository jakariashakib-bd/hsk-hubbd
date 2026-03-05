import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Edit3, Trophy, ClipboardList, Shield, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import hskhubLogo from "@/assets/hskhub-logo.png";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
];

const studyItems = [
  { to: "/course", icon: BookOpen, label: "Study" },
  { to: "/practice", icon: Edit3, label: "Practice" },
  { to: "/mock-test", icon: ClipboardList, label: "Mock Exams" },
];

const socialItems = [
  { to: "/progress", icon: Trophy, label: "Progress" },
  { to: "/pinyin-dictionary", icon: BookOpen, label: "Pinyin Dictionary" },
];

const SidebarLink = ({ to, icon: Icon, label, badge }: { to: string; icon: any; label: string; badge?: boolean }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));

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
      {badge && <span className="ml-auto w-2 h-2 rounded-full bg-secondary animate-pulse-glow" />}
    </NavLink>
  );
};

const AppSidebar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-56 min-h-screen bg-primary flex flex-col p-4 fixed left-0 top-0 z-40">
      <div className="flex items-center justify-center px-2 py-4 mb-4">
        <img
          src={hskhubLogo}
          alt="HSK Hub"
          className="h-8 w-auto mix-blend-multiply"
        />
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => <SidebarLink key={item.to} {...item} />)}
      </nav>

      <div className="mt-6">
        <p className="text-sidebar-foreground/50 text-xs font-mono uppercase tracking-wider px-4 mb-2">Study Area</p>
        <nav className="flex flex-col gap-1">
          {studyItems.map((item) => <SidebarLink key={item.to} {...item} />)}
        </nav>
      </div>

      <div className="mt-6">
        <p className="text-sidebar-foreground/50 text-xs font-mono uppercase tracking-wider px-4 mb-2">Social</p>
        <nav className="flex flex-col gap-1">
          {socialItems.map((item) => <SidebarLink key={item.to} {...item} />)}
        </nav>
      </div>

      {isAdmin && (
        <div className="mt-6">
          <p className="text-sidebar-foreground/50 text-xs font-mono uppercase tracking-wider px-4 mb-2">Admin</p>
          <nav className="flex flex-col gap-1">
            <SidebarLink to="/admin" icon={Shield} label="Admin Panel" />
          </nav>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2 pt-4">
        {user ? (
          <>
            <div className="px-4 py-2 text-sidebar-foreground/70 text-xs font-mono truncate">
              {user.email}
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-sidebar-foreground text-primary font-medium text-sm brutalist-border border-sidebar-foreground hover:opacity-90 transition-opacity"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-sidebar-foreground text-primary font-medium text-sm brutalist-border border-sidebar-foreground hover:opacity-90 transition-opacity"
          >
            <LogIn size={16} /> Sign In
          </button>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
