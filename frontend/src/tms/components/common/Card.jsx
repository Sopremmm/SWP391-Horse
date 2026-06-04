export default function Card({ children, style = {}, className = "" }) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
