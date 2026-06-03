import { ReactNode } from "react";
import { Navigation } from "./Navigation";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col-reverse md:flex-row md:min-h-screen bg-slate-950">
      <Navigation />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
    </div>
  );
}
