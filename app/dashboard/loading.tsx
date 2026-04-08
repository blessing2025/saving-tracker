export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-pulse">
          <div className="h-8 w-48 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-slate-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-56 bg-slate-200 rounded-2xl"></div>
          <div className="h-56 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    </div>
  )
}