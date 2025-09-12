import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUserProfile } from "../actions/user/user.actions";

export default async  function Page({ children }) {
   const { user } = await getUserProfile()

   console.log(user)
  
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
