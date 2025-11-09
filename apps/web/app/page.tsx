export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">Fullstack Monorepo Template</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A production-ready monorepo template with Next.js, Express, and MongoDB
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Frontend</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Next.js 16 with App Router</li>
              <li>React 19</li>
              <li>TanStack Query</li>
              <li>Tailwind CSS + shadcn/ui</li>
              <li>TypeScript strict mode</li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Backend</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Express.js</li>
              <li>MongoDB + Mongoose</li>
              <li>Winston logger</li>
              <li>Zod validation</li>
              <li>JWT authentication ready</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Monorepo Features</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Turborepo for fast builds and caching</li>
            <li>pnpm workspaces</li>
            <li>Shared TypeScript and ESLint configs</li>
            <li>Shared types package</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
