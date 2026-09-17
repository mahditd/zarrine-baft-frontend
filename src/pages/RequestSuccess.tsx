import { Link } from "react-router-dom";

export default function RequestSuccess() {
  return (
    <div className="container mx-auto flex flex-col items-center px-6 py-20 text-center">

      <h1 className="text-3xl font-bold">
        درخواست شما ثبت شد
      </h1>

      <p className="mt-3 text-muted-foreground">
        درخواست شما با موفقیت ارسال شد.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-md bg-primary px-5 py-2 text-primary-foreground"
      >
        بازگشت به محصولات
      </Link>

    </div>
  );
}