import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
} from "@/api/authApi";
import {
  useAuthStore,
} from "@/store/authStore";
import { Button } from "@/components/ui/button";

export default function Profile() {

  const updateUser = useAuthStore(
    (state) => state.updateUser,
  );

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",

    company_name: "",
    company_phone: "",

    country: "Iran",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await getProfile();

        const profile = response.user;

        setForm({
          full_name: profile.full_name ?? "",
          phone: profile.phone ?? "",
          email: profile.email ?? "",

          company_name:
            profile.company_name ?? "",

          company_phone:
            profile.company_phone ?? "",

          country:
            profile.country || "Iran",

          address:
            profile.address ?? "",
        });

        updateUser(profile);

      } catch {
        setError("خطا در دریافت اطلاعات پروفایل");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [updateUser]);


  function updateField(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }


  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      setSaving(true);

      const response = await updateProfile({
        full_name: form.full_name,
        email:
          form.email || undefined,

        company_name:
          form.company_name || undefined,

        company_phone:
          form.company_phone || undefined,

        country:
          form.country || undefined,

        address:
          form.address || undefined,
      });

      updateUser(response.user);

      setMessage(
        "پروفایل با موفقیت بروزرسانی شد",
      );

    } catch {
      setError(
        "خطا در بروزرسانی پروفایل",
      );
    } finally {
      setSaving(false);
    }
  }


  if (loading) {
    return (
      <div className="container mx-auto px-6 py-10">
        در حال دریافت اطلاعات...
      </div>
    );
  }


  return (
    <div className="container mx-auto max-w-xl px-6 py-10">

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border p-6"
      >

        <h1 className="text-3xl font-bold">
          پروفایل
        </h1>


        <input
          value={form.full_name}
          onChange={(e) =>
            updateField(
              "full_name",
              e.target.value,
            )
          }
          placeholder="نام"
          className="w-full rounded-md border px-3 py-2"
        />


        <input
          value={form.phone}
          disabled
          className="w-full rounded-md border bg-muted px-3 py-2"
        />


        <input
          value={form.email}
          onChange={(e) =>
            updateField(
              "email",
              e.target.value,
            )
          }
          placeholder="ایمیل"
          className="w-full rounded-md border px-3 py-2"
        />


        <input
          value={form.company_name}
          onChange={(e) =>
            updateField(
              "company_name",
              e.target.value,
            )
          }
          placeholder="نام شرکت"
          className="w-full rounded-md border px-3 py-2"
        />


        <input
          value={form.company_phone}
          onChange={(e) =>
            updateField(
              "company_phone",
              e.target.value,
            )
          }
          placeholder="شماره شرکت"
          className="w-full rounded-md border px-3 py-2"
        />


        <input
          value={form.country}
          onChange={(e) =>
            updateField(
              "country",
              e.target.value,
            )
          }
          placeholder="کشور"
          className="w-full rounded-md border px-3 py-2"
        />


        <textarea
          value={form.address}
          onChange={(e) =>
            updateField(
              "address",
              e.target.value,
            )
          }
          placeholder="آدرس"
          className="min-h-24 w-full rounded-md border px-3 py-2"
        />


        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}


        {message && (
          <p className="text-sm text-green-600">
            {message}
          </p>
        )}


        <Button
          className="w-full"
          disabled={saving}
        >
          {saving
            ? "در حال ذخیره..."
            : "ذخیره تغییرات"}
        </Button>

      </form>

    </div>
  );
}