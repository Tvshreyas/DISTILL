import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { redirect, notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import LivingArchive from "@/components/LivingArchive";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function ReflectionViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId, getToken } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const token = await getToken({ template: "convex" });
  if (token) {
    convex.setAuth(token);
  }

  const reflection = await convex.query(api.reflections.getById, {
    reflectionId: id as Id<"reflections">,
  });

  if (!reflection) {
    notFound();
  }

  return (
    <LivingArchive
      reflectionId={id as Id<"reflections">}
      initialData={reflection}
    />
  );
}
