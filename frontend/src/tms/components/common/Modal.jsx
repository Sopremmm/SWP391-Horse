export default function Modal({ title, onClose, children, wide = false }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(17,24,39,0.55)", backdropFilter: "blur(2px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full overflow-auto"
        style={{ maxWidth: wide ? 680 : 540, maxHeight: "88vh" }}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100"
        >
          <span className="text-base font-semibold text-slate-800">{title}</span>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-transparent border-none"
          >
            <i className="ti ti-x text-xl" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
