import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { to: "/admin", label: "داشبورد", end: true },
  { to: "/admin/products", label: "محصولات" },
  { to: "/admin/requests", label: "درخواست‌ها" },
  { to: "/admin/taxonomy", label: "دسته‌بندی‌ها" },
];

export function AdminLayout() {
  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">پنل مدیریت</h1>

      <nav className="mt-6 flex flex-wrap gap-2 border-b pb-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cn(
                "rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted",
                isActive && "border-primary bg-primary text-primary-foreground",
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}
