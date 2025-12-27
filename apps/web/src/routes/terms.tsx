import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})

function TermsPage() {
  return (
    <div className="min-h-screen pt-10">
      <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-foreground/60 mb-12">Last updated: December 2024</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-foreground/70 leading-relaxed">
                By accessing and using the Nuur website and services, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
              <p className="text-foreground/70 leading-relaxed mb-4">
                You agree to use our website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use of the website.
              </p>
              <ul className="list-disc pl-6 text-foreground/70 space-y-2">
                <li>You must be at least 18 years old to make purchases</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree to provide accurate and complete information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Products and Pricing</h2>
              <p className="text-foreground/70 leading-relaxed">
                We strive to display accurate product descriptions and pricing. However, we reserve the right to correct any errors and to change prices without notice. All prices are in USD unless otherwise stated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Orders and Payment</h2>
              <p className="text-foreground/70 leading-relaxed">
                When you place an order, you are making an offer to purchase. We reserve the right to accept or decline your order. Payment must be received before orders are processed. We accept major credit cards and other payment methods as indicated at checkout.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
              <p className="text-foreground/70 leading-relaxed">
                All content on this website, including images, text, graphics, logos, and software, is the property of Nuur and is protected by copyright and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
              <p className="text-foreground/70 leading-relaxed">
                Nuur shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of our website or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
              <p className="text-foreground/70 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the site constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
              <p className="text-foreground/70 leading-relaxed">
                For questions about these Terms & Conditions, contact us at{' '}
                <a href="mailto:legal@nuur.com" className="text-primary hover:underline">
                  legal@nuur.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
