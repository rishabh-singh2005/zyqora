export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-lg border border-primary-100 text-sm font-body disabled:opacity-40 hover:border-primary-500 transition"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-body transition ${
            p === page
              ? "bg-zyqora-gradient text-white"
              : "border border-primary-100 hover:border-primary-500"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-lg border border-primary-100 text-sm font-body disabled:opacity-40 hover:border-primary-500 transition"
      >
        Next
      </button>
    </div>
  );
}