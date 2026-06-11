"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "@/src/contexts/AdminAuthContext";
import {
  LayoutDashboard,
  FolderOpen,
  BarChart3,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import "./admin.css";
import FaviconLoader from "@/src/components/FaviconLoader";
import ToastRenderer from "@/src/components/admin/ToastRenderer";

const navItems = [
  {
    section: "Overview",
    links: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    section: "Content",
    links: [
      { href: "/admin/categories", label: "Categories", icon: FolderOpen },
      { href: "/admin/topics", label: "Topics", icon: BarChart3 },
    ],
  },
  {
    section: "Media",
    links: [{ href: "/admin/images", label: "Image Queue", icon: ImageIcon }],
  },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading, logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on the login page, render without the shell
  const isLoginPage =
    pathname === "/admin/login" ||
    pathname === "/admin/login/" ||
    pathname.endsWith("/admin/login") ||
    pathname.endsWith("/admin/login/");

  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [loading, isAuthenticated, isLoginPage, router]);

  // Show loading skeleton while checking auth
  if (loading && !isLoginPage) {
    return (
      <div className="admin-login-page">
        <div style={{ textAlign: "center" }}>
          <div
            className="admin-skeleton"
            style={{ width: 200, height: 24, margin: "0 auto 12px" }}
          />
          <div
            className="admin-skeleton"
            style={{ width: 140, height: 16, margin: "0 auto" }}
          />
        </div>
      </div>
    );
  }

  // Login page — render without sidebar
  if (isLoginPage) {
    return <><ToastRenderer />{children}</>;
  }

  // Not authenticated — don't render anything (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <div className="admin-shell">
      {/* Mobile hamburger */}
      <button
        className="admin-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-brand">
          <h1>
            <span className="brand-dot" />
            AI Index Admin
          </h1>
          <span>Content Management</span>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((section) => (
            <div key={section.section} className="admin-sidebar-section">
              <p className="admin-sidebar-section-label">{section.section}</p>
              {section.links.map((link) => {
                const Icon = link.icon;
                // Fix: Dashboard should only be active on exact match,
                // other items can use startsWith
                const isActive =
                  link.href === "/admin"
                    ? pathname === "/admin" || pathname === "/admin/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`admin-nav-link ${isActive ? "active" : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-badge">
            <div className="avatar">{userInitials}</div>
            <div className="user-info">
              <div className="user-name">{user?.name || "Admin"}</div>
              <div className="user-email">{user?.email || ""}</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={logout}>
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">{children}</main>
      <ToastRenderer />
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <FaviconLoader />
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
