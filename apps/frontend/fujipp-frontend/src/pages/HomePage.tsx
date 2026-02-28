import { ArrowRight, Sparkles } from 'lucide-react'

export function HomePage() {
  return (
    <section className="grid w-full gap-6 md:gap-8">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-10">
        <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-accent/20 blur-3xl" />

        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-light text-muted-foreground">
          <Sparkles className="size-3.5" />
          FUJIPP WEBSITE
        </p>
        <h2 className="relative mt-4 max-w-3xl text-3xl leading-tight font-semibold text-card-foreground md:text-5xl">
          Build, share, and ship clean work with one personal home base.
        </h2>
        <p className="relative mt-4 max-w-2xl text-base leading-relaxed font-light text-muted-foreground md:text-lg">
          This is the HOME page. The fixed navbar and theme system are active here, so you can
          validate layout, spacing, and theme changes directly on the first page.
        </p>

        <div className="relative mt-7 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-light text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Explore work
            <ArrowRight className="size-4" />
          </button>
          <button
            type="button"
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-light text-foreground transition-colors hover:bg-muted"
          >
            Contact me
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs tracking-wide font-light text-muted-foreground">SECTION</p>
          <h3 className="mt-2 text-lg font-semibold text-card-foreground">Introduction</h3>
          <p className="mt-2 text-sm leading-relaxed font-light text-muted-foreground">
            A concise overview of who you are and what you currently focus on.
          </p>
        </article>
        <article className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs tracking-wide font-light text-muted-foreground">SECTION</p>
          <h3 className="mt-2 text-lg font-semibold text-card-foreground">Featured Projects</h3>
          <p className="mt-2 text-sm leading-relaxed font-light text-muted-foreground">
            Highlight your strongest work and direct visitors to case studies.
          </p>
        </article>
        <article className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs tracking-wide font-light text-muted-foreground">SECTION</p>
          <h3 className="mt-2 text-lg font-semibold text-card-foreground">Now / Updates</h3>
          <p className="mt-2 text-sm leading-relaxed font-light text-muted-foreground">
            Post current goals, build logs, and latest updates to keep it active.
          </p>
        </article>
      </div>
    </section>
  )
}
