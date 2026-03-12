import { Slot } from "radix-ui";

import { cn } from "@common/utils/cn"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * A breadcrumb component that provides a navigation path for the user.
 * @param {string} [className] - Additional CSS classes to apply to the component.
 * @param {Object} [props] - Additional props to apply to the component.
 * @example
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *     <BreadcrumbItem href="/about">About</BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 */

/*******  ebc04350-fe56-491c-a693-e0738d466bff  *******/function Breadcrumb({
  className,
  ...props
}) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props} />
  );
}

function BreadcrumbList({
  className,
  ...props
}) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground",
        className
      )}
      {...props} />
  );
}

function BreadcrumbItem({
  className,
  ...props
}) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1", className)}
      {...props} />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("transition-colors hover:text-foreground", className)}
      {...props} />
  );
}

function BreadcrumbPage({
  className,
  ...props
}) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props} />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}>
      {children ?? (
        <ChevronRightIcon />
      )}
    </li>
  );
}

function BreadcrumbEllipsis({
  className,
  ...props
}) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-5 items-center justify-center [&>svg]:size-4", className)}
      {...props}>
      <MoreHorizontalIcon />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
};

