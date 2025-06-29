"use client";

import { convertCase, getInitial } from "@repo/common";
import {
  ChevronRightIcon,
  ChevronsUpDownIcon,
  FileTextIcon,
  LayoutGridIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
  TagIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import * as React from "react";
import { LogoutDialogForm } from "~/components/forms/auth-form";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "~/components/ui/sidebar";
import { site } from "~/lib/constants";
import { cn } from "~/lib/utils";
import type { User } from "~/types";

export type SidebarNavigation = {
  groups: {
    key: string;
    title: string;
    menus: {
      key: string;
      icon: string;
      href: string;
      title: string;
      active?: string[];
      items: { href: string; title: string; active?: string[] }[];
    }[];
  }[];
};

export function AppSidebar({ user: _user }: { user: User }) {
  const _params = useParams();
  const session = useSession();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isMobile, state } = useSidebar();
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);

  const params = Object.entries(_params).reduce((acc, [_, value]) => {
    return [...(acc ?? []), ...(typeof value === "string" ? [value] : [])];
  }, [] as string[]);

  const navigation: SidebarNavigation = {
    groups: [
      {
        key: "main-menu",
        title: "Main Menu",
        menus: [
          {
            items: [],
            icon: "tag",
            key: "products",
            title: "Products",
            href: "/dashboard/products",
            active: [
              "/dashboard/products",
              "/dashboard/products/new",
              `/dashboard/products/${params[0]}`,
            ],
          },
        ],
      },
    ],
  };

  const user = React.useMemo(
    () => session?.data?.user ?? _user,
    [session, _user],
  );

  return (
    <React.Fragment>
      <LogoutDialogForm open={openLogoutDialog} setOpen={setOpenLogoutDialog} />
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard">
                  <div className="relative size-8 rounded-sm border bg-neutral-50">
                    <Image
                      fill
                      alt="Logo"
                      sizes="50vw"
                      src="/static/logo.png"
                      className="object-contain p-0.5"
                    />
                  </div>
                  {state === "expanded" ? (
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-bold">Dashboard</span>
                      <span className="truncate font-medium text-xs">
                        {site.name}
                      </span>
                    </div>
                  ) : null}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea>
            {navigation.groups.map((group, i) => (
              <SidebarGroup key={i}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarMenu>
                  {group.menus.map((menu, j) => {
                    const menuActiveDir = [
                      ...(menu?.active ?? []),
                      ...(menu?.items?.length > 0
                        ? menu.items.flatMap((item) => item?.active ?? [])
                        : []),
                    ];

                    return (
                      <React.Fragment key={j}>
                        {menu?.items?.length > 0 ? (
                          <Collapsible
                            asChild
                            className="group/collapsible"
                            defaultOpen={
                              menu.href === pathname ||
                              menuActiveDir.includes(pathname) ||
                              menu.items.some((item) => item.href === pathname)
                            }
                          >
                            <SidebarMenuItem>
                              {menu.href !== "#" ? (
                                <React.Fragment>
                                  <SidebarMenuButton
                                    asChild
                                    tooltip={menu.title}
                                    isActive={menu.href === pathname}
                                  >
                                    <Link href={menu.href}>
                                      <SidebarIcon icon={menu.icon} />
                                      <span>{menu.title}</span>
                                    </Link>
                                  </SidebarMenuButton>
                                  <CollapsibleTrigger asChild>
                                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                                      <ChevronRightIcon />
                                    </SidebarMenuAction>
                                  </CollapsibleTrigger>
                                </React.Fragment>
                              ) : (
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuButton tooltip={menu.title}>
                                    <SidebarIcon icon={menu.icon} />
                                    <span>{menu.title}</span>
                                    <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                  </SidebarMenuButton>
                                </CollapsibleTrigger>
                              )}
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {menu.items?.map((item, k) => {
                                    const itemActiveDir = item?.active ?? [];

                                    return (
                                      <SidebarMenuSubItem key={k}>
                                        <SidebarMenuSubButton
                                          asChild
                                          isActive={
                                            item.href === pathname ||
                                            itemActiveDir.includes(pathname)
                                          }
                                        >
                                          <Link href={item.href}>
                                            {item.title}
                                          </Link>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    );
                                  })}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </SidebarMenuItem>
                          </Collapsible>
                        ) : (
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              asChild
                              tooltip={menu.title}
                              isActive={
                                menu.href === pathname ||
                                menuActiveDir.includes(pathname)
                              }
                            >
                              <Link href={menu.href}>
                                <div className="flex items-center justify-start gap-2">
                                  <SidebarIcon
                                    icon={menu.icon}
                                    className="size-4"
                                  />
                                  <span className="flex-1">{menu.title}</span>
                                </div>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )}
                      </React.Fragment>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroup>
            ))}
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="size-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        {getInitial(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                    <ChevronsUpDownIcon className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={4}
                  side={isMobile ? "bottom" : "right"}
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="size-8 rounded-lg">
                        <AvatarImage src={user.fmt.image} alt={user.name} />
                        <AvatarFallback className="rounded-lg">
                          {getInitial(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user.name}
                        </span>
                        <span className="truncate text-xs">
                          {`@${user.username}`}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <div className="flex items-center justify-start gap-2">
                          <SunIcon className="size-4 dark:hidden" />
                          <MoonIcon className="hidden size-4 dark:block" />
                          <span>{convertCase(theme ?? "system")}</span>
                        </div>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center justify-start gap-2"
                    onClick={() => {
                      setOpenLogoutDialog(true);
                    }}
                  >
                    <LogOutIcon className="size-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </React.Fragment>
  );
}

export function AppSidebarShell({
  children,
  breadcrumb,
}: React.PropsWithChildren<{
  breadcrumb: { items: { title: string; href: string | null }[] };
}>) {
  return (
    <React.Fragment>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="!h-4 mr-2" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumb?.items?.map((item, i) => {
                const isLast = i === breadcrumb?.items?.length - 1;
                return (
                  <React.Fragment key={i}>
                    <BreadcrumbItem
                      className={cn(isLast ? "block" : "hidden md:block")}
                    >
                      {item?.href ? (
                        <BreadcrumbLink href={item?.href}>
                          {item?.title}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage
                          className={cn(
                            isLast
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {item?.title}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {!isLast ? (
                      <BreadcrumbSeparator className="hidden md:block" />
                    ) : null}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6">{children}</div>
    </React.Fragment>
  );
}

function SidebarIcon({
  icon,
  ...props
}: React.SVGProps<SVGSVGElement> & { icon: string }) {
  const Icon =
    {
      tag: TagIcon,
      "layout-grid": LayoutGridIcon,
    }?.[icon] ?? FileTextIcon;

  return <Icon {...props} />;
}
