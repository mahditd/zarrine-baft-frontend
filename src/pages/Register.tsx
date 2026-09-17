import { Button } from "@/components/ui/button";
import { register } from "@/api/authApi";
import { normalizeIranPhone, isValidIranMobile } from "@/utils/phone";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",

    email: "",

    password: "",
    confirm_password: "",

    company_name: "",
    company_phone: "",

    country: "Iran",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!form.full_name.trim()) {
      setError("نام و نام خانوادگی الزامی است");
      return;
    }

    if (form.password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }

    if (form.password !== form.confirm_password) {
      setError("تکرار رمز عبور صحیح نیست");
      return;
    }

    const normalizedPhone = normalizeIranPhone(form.phone);

    if (!normalizedPhone || !isValidIranMobile(form.phone)) {
      setError("شماره تماس معتبر نیست");
      return;
    }

    try {
      setLoading(true);

      await register({
        ...form,
        phone: normalizedPhone,

        email: form.email || undefined,

        company_name: form.company_name || undefined,

        company_phone: form.company_phone || undefined,

        country: form.country || undefined,

        address: form.address || undefined,
      });

      navigate("/login");
    } catch {
      setError("ثبت نام انجام نشد");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-xl space-y-5 rounded-xl border p-6"
      >
        <h1 className="text-center text-3xl font-bold">ثبت نام</h1>

        <input
          value={form.full_name}
          onChange={(e) => updateField("full_name", e.target.value)}
          placeholder="نام و نام خانوادگی"
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder="شماره تماس"
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="ایمیل (اختیاری)"
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          type="password"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          placeholder="رمز عبور"
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          type="password"
          value={form.confirm_password}
          onChange={(e) => updateField("confirm_password", e.target.value)}
          placeholder="تکرار رمز عبور"
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          value={form.company_name}
          onChange={(e) => updateField("company_name", e.target.value)}
          placeholder="نام شرکت (اختیاری)"
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          value={form.company_phone}
          onChange={(e) => updateField("company_phone", e.target.value)}
          placeholder="شماره شرکت (اختیاری)"
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          value={form.country}
          onChange={(e) => updateField("country", e.target.value)}
          placeholder="کشور"
          className="w-full rounded-md border px-3 py-2"
        />

        <textarea
          value={form.address}
          onChange={(e) => updateField("address", e.target.value)}
          placeholder="آدرس"
          className="min-h-24 w-full rounded-md border px-3 py-2"
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "در حال ثبت..." : "ثبت نام"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          حساب دارید؟{" "}
          <Link to="/login" className="text-primary hover:underline">
            ورود
          </Link>
        </p>
      </form>
    </div>
  );
}
