import { Button } from "@/components/ui/button";
import { login } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import { normalizeIranPhone, isValidIranMobile } from "@/utils/phone";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const authLogin = useAuthStore((state) => state.login);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    const normalizedPhone = normalizeIranPhone(phone);

    if (!normalizedPhone || !password.trim()) {
      setError("شماره تماس و رمز عبور الزامی است");
      return;
    }

    if (!isValidIranMobile(phone)) {
      setError("شماره تماس معتبر نیست");
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        phone: normalizedPhone,
        password,
      });

      authLogin(response.user, response.token);

      const from = location.state?.from || "/";

      navigate(from);
    } catch {
      setError("شماره تماس یا رمز عبور اشتباه است");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-xl border p-6"
      >
        <h1 className="text-center text-3xl font-bold">ورود</h1>

        <div className="space-y-2">
          <label className="text-sm font-medium">شماره تماس</label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09121234567"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">رمز عبور</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "در حال ورود..." : "ورود"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          حساب ندارید؟{" "}
          <Link to="/register" className="text-primary hover:underline">
            ثبت نام
          </Link>
        </p>
      </form>
    </div>
  );
}
