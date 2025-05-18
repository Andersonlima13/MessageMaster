import * as React from "react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children: React.ReactNode;
}

interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface SidebarItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  active?: boolean;
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  return (
    <aside
      className={cn("flex flex-col w-64 bg-white border-r border-neutral-200", className)}
      {...props}
    >
      {children}
    </aside>
  );
}

export function SidebarSection({
  title,
  collapsible = false,
  defaultOpen = true,
  className,
  children,
  ...props
}: SidebarSectionProps) {
  if (collapsible) {
    return (
      <Collapsible
        defaultOpen={defaultOpen}
        className={cn("px-3 py-2", className)}
        {...props}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-neutral-500">
          {title}
          <div className="text-neutral-400">
            <ChevronDown className="h-4 w-4 collapsible-open" />
            <ChevronRight className="h-4 w-4 collapsible-closed" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>{children}</CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div className={cn("px-3 py-2", className)} {...props}>
      {title && <h4 className="text-sm font-medium text-neutral-500 mb-1">{title}</h4>}
      {children}
    </div>
  );
}

export function SidebarItem({
  icon,
  active = false,
  href = "#",
  className,
  children,
  ...props
}: SidebarItemProps) {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
        active
          ? "bg-primary-50 text-primary-700"
          : "text-neutral-600 hover:bg-neutral-100",
        className
      )}
      {...props}
    >
      {icon && <span className="mr-3">{icon}</span>}
      <span>{children}</span>
    </a>
  );
}
