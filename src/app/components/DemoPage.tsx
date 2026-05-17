import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function DemoPage() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <header>
        <h1 className="text-4xl font-bold mb-2">Demo Web Page</h1>
        <p className="text-lg text-muted-foreground">
          This page demonstrates how the accessibility modes work
        </p>
      </header>

      <aside className="bg-muted p-4 rounded-lg sidebar">
        <h3 className="font-semibold mb-2">Sidebar Content</h3>
        <p className="text-sm">
          This sidebar will be dimmed in Focus Mode to reduce distractions.
        </p>
      </aside>

      <main className="space-y-6">
        <article>
          <h2 className="text-2xl font-semibold mb-4">Main Content Area</h2>
          <p className="mb-4">
            This is the primary content area. In Focus Mode, this area will be
            highlighted to help you concentrate on what matters most.
          </p>

          <p className="mb-4">
            We need to <strong>leverage</strong> our <strong>synergy</strong> to{" "}
            <strong>optimize</strong> the <strong>paradigm</strong>. This sentence
            contains jargon that Simple Mode will help explain with tooltips.
          </p>

          <div className="ad bg-yellow-50 border border-yellow-200 p-4 rounded mb-4">
            <p className="text-sm font-semibold">Advertisement</p>
            <p className="text-xs">This ad will be hidden in Focus Mode</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Form Example</CardTitle>
              <CardDescription>
                Try filling this out with different modes enabled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="primary-action">
                  Submit Form
                </Button>
                <Button variant="outline">
                  Cancel
                </Button>
                <Button variant="ghost" className="calm-mode-secondary">
                  Advanced Options
                </Button>
              </div>
            </CardContent>
          </Card>
        </article>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>

          <ul className="space-y-2 mb-4">
            <li>✓ Focus Mode dims distractions</li>
            <li>✓ Simple Mode explains complex terms</li>
            <li>✓ Calm Mode enhances readability</li>
          </ul>

          {!showMore && (
            <Button onClick={() => setShowMore(true)} variant="outline">
              Show More Content
            </Button>
          )}

          {showMore && (
            <div className="mt-4 space-y-4">
              <p>
                This additional content appears when you click the button. In Calm
                Mode, secondary actions are de-emphasized to reduce cognitive load.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Feature 1</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Card content goes here</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Feature 2</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">More card content</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </section>
      </main>

      <nav className="flex gap-4 p-4 bg-card border rounded-lg">
        <a href="#home" className="hover:underline">
          Home
        </a>
        <a href="#features" className="hover:underline">
          Features
        </a>
        <a href="#about" className="hover:underline">
          About
        </a>
        <a href="#contact" className="hover:underline">
          Contact
        </a>
      </nav>
    </div>
  );
}
