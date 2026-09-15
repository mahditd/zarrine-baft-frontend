import { Button } from "@/components/ui/button"
import { Search, User, ClipboardList } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">

        {/* Logo */}
        <div className="text-2xl font-bold text-primary">
          زرینه بافت
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-sm">
          <a
            href="#"
            className="hover:text-primary"
          >
            محصولات
          </a>

          <a
            href="#"
            className="flex items-center gap-2 hover:text-primary"
          >
            <ClipboardList size={18} />
            درخواست‌ها
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">

          <Button variant="outline" size="icon">
            <Search size={18} />
          </Button>

          <Button>
            <User size={18} />
            ورود
          </Button>

        </div>

      </div>
    </header>
  )
}