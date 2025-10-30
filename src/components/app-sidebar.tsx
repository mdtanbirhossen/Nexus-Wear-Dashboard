"use client"

import * as React from "react"
import {
     GalleryVerticalEnd,
     ShoppingCart, Package, Users, CreditCard, Folder, Layers, Palette, Ruler, Square, Bell, Mail, HelpCircle, Settings, UserCog, Shield, Image, Share2,
     Home,
     PlusCircle
} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
     Sidebar,
     SidebarContent,
     SidebarFooter,
     SidebarHeader,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
     user: {
          name: "shadcn",
          email: "m@example.com",
          avatar: "/avatars",
     },
     teams: [
          {
               name: "Acme Inc",
               logo: GalleryVerticalEnd,
               plan: "Enterprise",
          },
     ],
     main: [
          { name: "Dashboard", url: "/", icon: Home },
     ],
     ecommerce: [
          { name: "Products", url: "/products", icon: Package },
          { name: "Add Product", url: "/products/create", icon: PlusCircle },
          { name: "Orders", url: "/orders", icon: ShoppingCart },
          { name: "Customers", url: "/customers", icon: Users },
          { name: "Payments", url: "/payments", icon: CreditCard },
     ],
     catalog: [
          { name: "Categories", url: "/categories", icon: Folder },
          { name: "Add Category", url: "/categories/create", icon: PlusCircle },
          { name: "Subcategories", url: "/subCategories", icon: Layers },
          { name: "Add Subcategory", url: "/subCategories/create", icon: PlusCircle },
          { name: "Colors", url: "/color", icon: Palette },
          { name: "Add Color", url: "/color/create", icon: PlusCircle },
          { name: "Sizes", url: "/size", icon: Ruler },
          { name: "Add Size", url: "/size/create", icon: PlusCircle },
          //     { name: "Fabrics", url: "/fabrics", icon: Square },
          //     { name: "Materials", url: "/materials", icon: Square },
     ],
     //   marketing: [
     //     { name: "Subscribers", url: "/subscribers", icon: Mail },
     //     { name: "Notifications", url: "/notifications", icon: Bell },
     //     { name: "Banners", url: "/banners", icon: Image },
     //     { name: "Social Links", url: "/social-links", icon: Share2 },
     //   ],
     //   support: [
     //     { name: "FAQ", url: "/faq", icon: HelpCircle },
     //     { name: "Contacts", url: "/contacts", icon: Mail },
     //   ],
     userManagement: [
          { name: "Users", url: "/users", icon: Users },
          { name: "Admins", url: "/admin", icon: UserCog },
          { name: "Roles & Permissions", url: "/role", icon: Shield },
     ],
     settings: [
          { name: "General Settings", url: "/settings/general", icon: Settings },
          { name: "System Preferences", url: "/settings/system", icon: Settings },
     ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
     return (
          <Sidebar collapsible="icon" {...props}>
               <SidebarHeader>
                    <TeamSwitcher teams={data.teams} />
               </SidebarHeader>

               <SidebarContent>
                    <NavProjects title="Main" items={data.main} />
                    <NavProjects title="Ecommerce" items={data.ecommerce} />
                    <NavProjects title="Catalog" items={data.catalog} />
                    {/* <NavProjects title="Marketing" items={data.marketing} /> */}
                    {/* <NavProjects title="Support" items={data.support} /> */}
                    <NavProjects title="User Management" items={data.userManagement} />
                    <NavProjects title="Settings" items={data.settings} />
               </SidebarContent>


               <SidebarFooter>
                    <NavUser user={data.user} />
               </SidebarFooter>

               {/* <SidebarRail /> */}
          </Sidebar>
     )
}
