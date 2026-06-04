export function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export function fmtDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

export function fmtCurrency(n) {
  if (n == null) return "—";
  return "$" + Number(n).toLocaleString();
}

export function fmtMillions(n) {
  if (n == null) return "—";
  return "$" + (Number(n) / 1_000_000).toFixed(2) + "M";
}

export function initials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}
