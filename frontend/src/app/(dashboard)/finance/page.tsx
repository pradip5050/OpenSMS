"use client";

import RazorpayGateway from "@/components/dashboard/finance/RazorpayGateway";

export default function Finance() {
  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col max-h-screen">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Finance</h1>
      </div>
      <RazorpayGateway />
    </main>
  );
}
