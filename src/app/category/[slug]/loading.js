export default function Loading() {
  return (
    <main className="px-4 py-8 mx-auto max-w-6xl">
      <div className="h-7 w-56 bg-muted rounded mb-2" />
      <div className="h-4 w-80 bg-muted rounded mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border rounded-md p-3">
            <div className="aspect-square w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded mt-3" />
          </div>
        ))}
      </div>
    </main>
  )
}
