// Mirrors backend internal/utils/phone.go (SRS 3.2).
// Accepts 0912…, +98912…, 0098912…, 98912…, 912…, spaces/dashes/parens,
// Persian/Arabic digits. Returns 11-digit 09xxxxxxxxx or null.
export function normalizeIranPhone(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let ascii = "";
  for (const ch of trimmed) {
    const code = ch.charCodeAt(0);
    if (code >= 48 && code <= 57) {
      ascii += ch;
    } else if (code >= 0x06f0 && code <= 0x06f9) {
      ascii += String.fromCharCode(48 + (code - 0x06f0));
    } else if (code >= 0x0660 && code <= 0x0669) {
      ascii += String.fromCharCode(48 + (code - 0x0660));
    } else if (ch === "+") {
      ascii += ch;
    } else if (
      ch === " " ||
      ch === "-" ||
      ch === "(" ||
      ch === ")" ||
      ch === "/" ||
      ch === "."
    ) {
      continue;
    } else {
      return null;
    }
  }

  let national: string;
  if (ascii.startsWith("+98")) {
    national = "0" + ascii.slice(3);
  } else if (ascii.startsWith("0098")) {
    national = "0" + ascii.slice(4);
  } else if (ascii.startsWith("98")) {
    national = "0" + ascii.slice(2);
  } else if (ascii.startsWith("0")) {
    national = ascii;
  } else if (ascii.length === 10) {
    national = "0" + ascii;
  } else {
    return null;
  }

  if (national.length !== 11 || !national.startsWith("0")) return null;
  if (!/^\d{11}$/.test(national)) return null;

  return national;
}

// Personal login/register phones must be Iranian mobiles (09…).
export function isValidIranMobile(input: string): boolean {
  const normalized = normalizeIranPhone(input);
  return normalized !== null && normalized.startsWith("09");
}
