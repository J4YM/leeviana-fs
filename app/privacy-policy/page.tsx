import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Leevienna FS",
  description: "Privacy Policy for Leevienna FS",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Last Updated: {new Date().toLocaleDateString()}</h2>
            <p className="text-muted-foreground">
              Leevienna FS ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Information We Collect</h2>
            <p className="text-muted-foreground mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Name and contact information (email address, phone number)</li>
              <li>Shipping and billing addresses</li>
              <li>Payment information (processed securely through our payment providers)</li>
              <li>Order history and preferences</li>
              <li>Communications with us (chat messages, customer support inquiries)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and provide customer support</li>
              <li>Send you updates about our products and services (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Data Storage and Security</h2>
            <p className="text-muted-foreground">
              Your data is stored securely using Supabase, a trusted cloud database provider. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground mb-4">We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Supabase:</strong> For database and authentication services</li>
              <li><strong>Facebook/Google:</strong> For OAuth authentication (optional)</li>
              <li><strong>Payment Processors:</strong> For secure payment processing</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              These services have their own privacy policies governing the use of your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise these rights, please contact us or visit our <a href="/data-deletion" className="text-accent-peach hover:underline">Data Deletion</a> page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Cookies</h2>
            <p className="text-muted-foreground">
              We use cookies and similar technologies to enhance your experience, analyze usage, and assist with marketing efforts. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none space-y-2 text-muted-foreground mt-4">
              <li>Email: support@leeviennafs.com</li>
              <li>Website: <a href="/#contact" className="text-accent-peach hover:underline">Contact Page</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

