import { LegalPageLayout } from '@/components/legal/legal-page-layout'

export const metadata = {
  title: 'Privacy Policy — RenewalGuard',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-2 space-y-3 text-sm text-muted-foreground">{children}</div>
    </section>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="June 2026">
      <p className="text-sm text-muted-foreground">
        This Privacy Policy explains how RenewalGuard (&quot;RenewalGuard,&quot; &quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) collects, uses, and protects your information when
        you use our renewal tracking and reminder service (the &quot;Service&quot;).
      </p>

      <Section title="1. Information we collect">
        <p>We collect the following information when you use the Service:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong className="text-foreground">Account information</strong> — your name and email address, collected when you sign up.</li>
          <li><strong className="text-foreground">Renewal data</strong> — the subscriptions, domains, passports, certifications, memberships, and other recurring obligations you choose to track, along with their renewal dates, amounts, and any notes you add.</li>
          <li><strong className="text-foreground">Usage data</strong> — basic information about how you interact with the Service, such as pages visited and features used, which helps us understand what&apos;s working and what isn&apos;t.</li>
        </ul>
      </Section>

      <Section title="2. How we use your information">
        <p>We use the information we collect to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Provide and operate the Service, including displaying your dashboard and renewal list.</li>
          <li>Send you reminder emails ahead of your renewal deadlines.</li>
          <li>Understand usage patterns and improve the product over time.</li>
        </ul>
      </Section>

      <Section title="3. We do not sell your data">
        <p>
          We do not sell, rent, or trade your personal data or renewal data to third parties for
          marketing or any other purpose. Your data is used solely to provide and improve the
          Service.
        </p>
      </Section>

      <Section title="4. Third-party services we use">
        <p>We rely on a small number of trusted third-party providers to operate the Service:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong className="text-foreground">Supabase</strong> — authentication and database storage for your account and renewal data.</li>
          <li><strong className="text-foreground">Resend</strong> — delivery of reminder and account-related emails.</li>
          <li><strong className="text-foreground">Vercel</strong> — application hosting and infrastructure.</li>
        </ul>
        <p>
          Each of these providers only receives the data necessary to perform their function and
          is bound by their own privacy and security practices.
        </p>
      </Section>

      <Section title="5. Deleting your account and data">
        <p>
          You can delete your account at any time from your account settings. Deleting your
          account permanently removes your renewal data and personal information from our active
          systems. If you&apos;d like help with this or have questions about what&apos;s retained,
          contact us at the email address below.
        </p>
      </Section>

      <Section title="6. Cookies">
        <p>
          We use a session cookie strictly to keep you signed in. We do not use advertising or
          third-party tracking cookies.
        </p>
      </Section>

      <Section title="7. Governing law">
        <p>This Privacy Policy is governed by the laws of Nigeria.</p>
      </Section>

      <Section title="8. Contact">
        <p>
          If you have questions about this Privacy Policy or how your data is handled, contact us
          at{' '}
          <a href="mailto:hello@renewalguard.site" className="font-medium text-primary hover:underline">
            hello@renewalguard.site
          </a>
          .
        </p>
      </Section>
    </LegalPageLayout>
  )
}
