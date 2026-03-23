export default function FloatingShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/5 rounded-full animate-float-slow" />
      <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-accent/5 rounded-full animate-blob" />
      <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-primary/3 rounded-full animate-float" style={{ animationDelay: "2s" }} />
    </div>
  );
}
