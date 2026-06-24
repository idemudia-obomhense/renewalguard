import { LegalPageLayout } from '@/components/legal/legal-page-layout'

export const metadata = {
  title: 'Terms of Service — RenewalGuard',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-2 space-y-3 text-sm text-muted-foreground">{children}</div>
    </section>
  )
}

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="June 2026">
      <p className="text-sm text-muted-foreground">
        These Terms of Service (&quot;Terms&quot;) govern your use of RenewalGuard
        (&quot;RenewalGuard,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By
        creating an account or using the Service, you agree to these Terms.
      </p>

      <Section title="1. Acceptance of terms">
        <p>
          By accessing or using RenewalGuard, you confirm that you accept these Terms and agree to
          comply with them. If you do not agree, please do not use the Service.
        </p>
      </Section>

      <Section title="2. Description of the service">
        <p>
          RenewalGuard is a renewal tracking and reminder tool. It helps you keep track of
          subscriptions, domains, passports, certifications, memberships, and other recurring
          obligations, and sends you reminders ahead of their renewal dates.
        </p>
      </Section>

      <Section title="3. Your responsibilities">
        <p>As a user of the Service, you agree to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Provide accurate information about your account and the renewals you track.</li>
          <li>
            Not misuse the Service — including attempting to disrupt it, access it through
            unauthorized means, or use it for any unlawful purpose.
          </li>
        </ul>
      </Section>

      <Section title="4. Free tier and paid plans">
        <p>
          RenewalGuard currently offers a free tier. We may introduce paid plans with additional
          features in the future; any such changes will be communicated clearly before they affect
          your account.
        </p>
      </Section>

      <Section title="5. Changes to the service">
        <p>
          We may modify, suspend, or discontinue any part of the Service at any time. Where
          reasonably possible, we will provide notice of material changes that affect your use of
          the Service.
        </p>
      </Section>

      <Section title="6. No warranty">
        <p>
          RenewalGuard is currently in its MVP/beta phase and is provided &quot;as is&quot; and
          &quot;as available,&quot; without warranties of any kind, whether express or implied,
          including as to reliability, availability, or fitness for a particular purpose.
        </p>
      </Section>

      <Section title="7. Limitation of liability">
        <p>
          To the fullest extent permitted by law, RenewalGuard shall not be liable for any
          indirect, incidental, or consequential damages — including missed renewals or financial
          loss — arising from your use of, or inability to use, the Service. Reminders are provided
          as a convenience and do not replace your own diligence in tracking important deadlines.
        </p>
      </Section>

      <Section title="8. Account termination">
        <p>
          We may suspend or terminate your account if you violate these Terms or misuse the
          Service. You may also delete your own account at any time from your account settings.
        </p>
      </Section>

      <Section title="9. Governing law">
        <p>These Terms are governed by the laws of Nigeria.</p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about these Terms can be sent to{' '}
          <a href="mailto:hello@renewalguard.site" className="font-medium text-primary hover:underline">
            hello@renewalguard.site
          </a>
          .
        </p>
      </Section>
    </LegalPageLayout>
  )
}
