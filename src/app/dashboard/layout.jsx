import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page({ children }) {
  return (
    <SidebarProvider className=" ">
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="-mt-2">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
