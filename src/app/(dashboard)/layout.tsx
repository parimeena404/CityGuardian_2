"use client";

import React from "react";
import AppShell from "@/components/AppShell";
import AuthGate from "@/components/AuthGate";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <AuthGate>{children}</AuthGate>
    </AppShell>
  );
}
