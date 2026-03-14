export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-white/20 border-t-primary animate-spin" />
    </div>
  );
}
