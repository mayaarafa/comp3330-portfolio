import { cn } from "@/lib/utils";

function TypographyH1({ children, className }) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance pt-2",
        className
      )}
    >
      {children}
    </h1>
  );
}

function TypographyH2({ children }) {
  return (
    <h2 className="scroll-m-20 border-b py-2 text-3xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

function TypographyH3({ children }) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  );
}

function TypographyP({ children, className }) {
  return <p className={cn("leading-7", className)}>{children}</p>;
}

function TypographyMuted({ children }) {
  return <p className="text-muted-foreground text-sm">{children}</p>;
}

export {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographyMuted,
};
