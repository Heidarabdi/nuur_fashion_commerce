import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ApiProvider } from '@nuur-fashion-commerce/api'
import { Toaster } from 'sonner'

import Header from '../components/Header'
import { Footer } from '../components/Footer'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Nuur Fashion Commerce',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
})

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-foreground/60 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Go Home
          </a>
          <a
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-full font-medium hover:bg-secondary transition-colors"
          >
            Browse Shop
          </a>
        </div>
      </div>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ApiProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <HeadContent />
          {/* Prevent flash of unstyled content for dark mode */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const theme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                })();
              `,
            }}
          />
        </head>
        <body className="font-sans bg-background text-foreground">
          <Header />
          <div className="pt-16 min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
              className: 'font-sans',
            }}
          />
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </body>
      </html>
    </ApiProvider>
  )
}

