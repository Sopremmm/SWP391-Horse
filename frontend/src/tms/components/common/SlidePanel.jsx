export default function SlidePanel({ open, onClose, title, children, width = "420px" }) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-[9998] bg-black/30"
        onClick={onClose}
      />
      <div
        className="fixed top-0 right-0 h-full z-[9999] bg-white shadow-2xl flex flex-col"
        style={{ width, maxWidth: "100vw" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors bg-transparent border-none"
          >
            <i className="ti ti-x text-slate-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </>
  );
}
