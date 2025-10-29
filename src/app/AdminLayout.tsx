"use client";

import { ReactNode, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/useRedux";
import { Separator } from "@radix-ui/react-separator";
import {
     Breadcrumb,
     BreadcrumbItem,
     BreadcrumbList,
     BreadcrumbPage,
     BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AdminLayout({ children }: { children: ReactNode }) {
     const pathname = usePathname();
     // console.log(pathname)
     const formattedPathname = pathname.slice(1).replace(/^./, c => c.toUpperCase());
     const router = useRouter();
     const { token, _persist } = useAppSelector((state) => state.auth);

     const hideSidebar = pathname === "/signin";

     useEffect(() => {
          if (_persist?.rehydrated && !token && pathname !== "/signin") {
               router.replace("/signin");
          }
     }, [_persist?.rehydrated, token, pathname, router]);

     if (!token && pathname !== "/signin") {
          return null;
     }

     return (
          <SidebarProvider>
               <Toaster position="bottom-right" reverseOrder={false} />
               <div className="flex w-full min-h-screen overflow-hidden">
                    {!hideSidebar && <AppSidebar />}

                    {!hideSidebar ? (
                         <main className="flex-1 w-full overflow-hidden">
                              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                                   <SidebarTrigger className="-ml-1" />
                                   <Separator
                                        orientation="vertical"
                                        className="mr-2 data-[orientation=vertical]:h-4"
                                   />
                                   <Breadcrumb>
                                        <BreadcrumbList>
                                             <BreadcrumbSeparator className="hidden md:block" />
                                             <BreadcrumbItem>
                                                  <BreadcrumbPage>{formattedPathname}</BreadcrumbPage>
                                             </BreadcrumbItem>
                                        </BreadcrumbList>
                                   </Breadcrumb>
                              </header>

                              {/* 👇 Wrap children in scrollable area */}
                              <div className="p-4 w-full overflow-x-auto">
                                   {children}
                              </div>
                         </main>
                    ) : (
                         <div className="flex-1">{children}</div>
                    )}
               </div>

          </SidebarProvider>
     );
}