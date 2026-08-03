import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkClient from "./WorkClient";

export const metadata: Metadata = {
  title: "All Projects & Works",
  description:
    "Browse web designs, UI/UX launches, and automation workflows by Laraib Mujahid.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-hidden bg-background">
      <Navbar />
      <main id="main" className="flex flex-1 flex-col">
        <WorkClient />
      </main>
      <Footer />
    </div>
  );
}
