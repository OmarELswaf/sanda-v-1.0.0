import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const Drawer = React.forwardRef<
  React.ElementRef<typeof Dialog.Root>,
  React.ComponentProps<typeof Dialog.Root> & { shouldScaleBackground?: boolean }
>(({ className, shouldScaleBackground = true, ...props }, ref) => (
  <Dialog.Root
    ref={ref}
    className={cn("fixed z-50 h-full w-full max-w-[320px]", className)}
    {...props}
  >
    <Dialog.Portal />
    <Dialog.Overlay
      className={cn(
        "fixed inset-0 z-40 bg-black/80 backdrop-blur-sm",
        shouldScaleBackground && "sm:bg-black/90"
      )}
    />
    <Dialog.Content
      className={cn(
        "flex h-full flex-col w-full bg-background p-6 shadow-lg",
        "pointer-events-auto"
      )}
    >
      <Dialog.Close
        className={cn(
          "absolute right-4 top-2 rounded-half p-1 text-muted-foreground hover:text-foreground"
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Dialog.Close>
      <Dialog.Header className="mb-4">
        <slot name="header" />
      </Dialog.Header>
      <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
        <slot name="title" />
      </Dialog.Title>
      <Dialog.Description className="text-sm text-muted-foreground mt-2">
        <slot name="description" />
      </Dialog.Description>
      <div className="mt-auto pb-4">
        <slot />
      </div>
      <Dialog.Footer className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <slot name="footer" />
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
));
Drawer.displayName = Dialog.Root.displayName;

const DrawerTrigger = Dialog.Trigger;
const DrawerPortal = Dialog.Portal;
const DrawerClose = Dialog.Close;
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay ref={ref} className={cn("fixed inset-0 z-40 bg-black/80", className)} {...props} />
));
DrawerOverlay.displayName = Dialog.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content>
>(({ className, children, ...props }, ref) => (
  <Dialog.Content
    ref={ref}
    className={cn(
      "flex h-full flex-col w-full bg-background p-6 shadow-lg pointer-events-auto",
      className
    )}
    {...props}
  >
    {children}
  </Dialog.Content>
));
DrawerContent.displayName = Dialog.Content.displayName;

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DrawerTitle.displayName = Dialog.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DrawerDescription.displayName = Dialog.Description.displayName;

export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerClose,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};