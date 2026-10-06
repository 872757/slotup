import { supabase } from "@/lib/supabase";
import type { Shop, Service } from "@/lib/types";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import BookingWizard from "@/components/BookingWizard";

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const { slug } = await params;
  const { service: serviceId } = await searchParams;

  if (!serviceId) {
    redirect(`/b/${slug}`);
  }

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single<Shop>();

  if (!shop) {
    notFound();
  }

  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .eq("shop_id", shop.id)
    .eq("active", true)
    .single<Service>();

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen p-4 max-w-lg mx-auto pb-24">
      <header className="pt-6 pb-6">
        <Link
          href={`/b/${slug}`}
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back
        </Link>
        <h1 className="text-xl font-bold text-gray-900 mt-3">{shop.name}</h1>
        <p className="text-sm text-gray-500">Book your slot</p>
      </header>

      <BookingWizard shop={shop} service={service} />
    </main>
  );
}
