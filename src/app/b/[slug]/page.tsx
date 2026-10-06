export default async function ShopBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Demo Barber Shop</h1>
        <p className="text-gray-500 text-sm mb-6">Slug: {slug}</p>
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <p className="text-gray-600">
            Booking page is under construction.
            <br />
            Full booking flow coming next.
          </p>
        </div>
      </div>
    </main>
  );
}
