export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          SlotUp
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Book your haircut and avoid waiting
        </p>
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <p className="text-sm text-gray-500 mb-4">
            Website is being built. Demo shop will be available soon.
          </p>
          <a
            href="/b/demo-barber"
            className="inline-block w-full bg-black text-white py-3 px-6 rounded-xl font-medium text-center"
          >
            Try Demo Barber Shop
          </a>
        </div>
      </div>
    </main>
  );
}
