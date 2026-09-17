import { Button } from "@/components/ui/button";
import { Search, User, ClipboardList, History, Shield } from "lucide-react";
import { useRequestStore } from "@/store/requestStore";
import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router-dom";

export function Header() {
  const requestCount = useRequestStore((state) => state.items.length);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.user?.role === "admin");

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        {/* Logo */}
        <div className="text-2xl font-bold text-primary">زرینه بافت</div>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-sm">
          <Link to="/" className="hover:text-primary">
            محصولات
          </Link>

          <Link
            to="/requests"
            className="flex items-center gap-2 hover:text-primary"
          >
            <ClipboardList size={18} />
            درخواست‌ها
            {requestCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                {requestCount}
              </span>
            )}
          </Link>

          <Link
            to="/my-requests"
            className="flex items-center gap-2 hover:text-primary"
          >
            <History size={18} />
            درخواست‌های من
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-2 hover:text-primary"
            >
              <Shield size={18} />
              مدیریت
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            aria-label="جستجو"
            onClick={() => {
              document
                .getElementById("catalog")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Search size={18} />
          </Button>

          <Link to={isAuthenticated ? "/profile" : "/login"}>
            <Button>
              <User size={18} />
              {isAuthenticated ? "پروفایل" : "ورود"}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
