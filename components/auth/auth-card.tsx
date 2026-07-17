import { Logomark } from "@/components/layout/logomark";

export interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

/**
 * The centered branded card shared by the login screen in the imported
 * design (Standup Hub.dc.html) — the Numida logo + "Standup Hub" above a
 * white bordered card containing the form.
 */
export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="bg-background flex min-h-dvh w-full items-center justify-center">
      <div className="w-full max-w-[400px] px-6">
        <div className="mb-7 flex flex-col items-center">
          <Logomark size="lg" className="mb-3" />
          <div className="text-muted-foreground text-[13px]">Standup Hub</div>
        </div>
        <div className="border-border bg-card rounded-xl border p-7">
          <h1 className="mb-1 text-lg font-bold">{title}</h1>
          <p className="text-muted-foreground mb-[22px] text-[13px]">
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}
