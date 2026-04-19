const LOGO_PATH = "/logo.png";

function BrandLogo({ className = "" }) {
  return (
    <div
      className={`bg-white border border-green-100 rounded-lg overflow-hidden flex items-center justify-center ${className}`.trim()}
    >
      <img
        src={LOGO_PATH}
        alt="V.K. Group logo"
        className="h-full w-full object-contain p-2"
        onError={(event) => {
          event.currentTarget.style.display = "none";
          const fallback = event.currentTarget.nextElementSibling;
          if (fallback) {
            fallback.classList.remove("hidden");
          }
        }}
      />
      <span className="hidden text-[10px] font-semibold tracking-[0.3em] text-gray-500">
        LOGO
      </span>
    </div>
  );
}

export default BrandLogo;
