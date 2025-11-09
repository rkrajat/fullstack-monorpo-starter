'use client';

import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { logout } from '@/lib/auth';

export default function DashboardPage() {
  useAuthGuard(); // Protect this page - redirects to /login if not authenticated

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.me,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Failed to load user data</p>
          <button
            onClick={logout}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <button
            onClick={logout}
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="mt-2 text-muted-foreground">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>

        {/* User Info Card */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Profile</h3>
            <div className="mt-4 space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-lg font-semibold">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg font-semibold">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Account Status</h3>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <p className="text-lg font-semibold">Active</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Your account is in good standing
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
            <div className="mt-4 space-y-2">
              <button className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                Edit Profile
              </button>
              <button className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Additional Content Area */}
        <div className="mt-8 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold">Getting Started</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            This is your dashboard. You can add more features and content here as you
            build out your application.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border p-4">
              <h4 className="font-medium">Next Steps</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Add more routes and pages</li>
                <li>• Integrate additional APIs</li>
                <li>• Customize the UI components</li>
                <li>• Set up data models</li>
              </ul>
            </div>
            <div className="rounded-md border p-4">
              <h4 className="font-medium">Resources</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Check out the README.md</li>
                <li>• Review the API documentation</li>
                <li>• Explore shadcn/ui components</li>
                <li>• Read the CLAUDE.md file</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
