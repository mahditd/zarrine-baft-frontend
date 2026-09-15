export function Footer() {
  return (
    <footer className="border-t bg-white">

      <div className="container mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} زرینه بافت.
        تمامی حقوق محفوظ است.
      </div>

    </footer>
  )
}