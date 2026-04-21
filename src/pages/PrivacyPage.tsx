import { Link } from "react-router-dom";
import { Eye, Lock, Shield, UserX } from "lucide-react";

const principles = [
  {
    icon: UserX,
    title: "No Accounts",
    description:
      "No login, no user profiles, no personal information collected from visitors.",
  },
  {
    icon: Eye,
    title: "Transparent",
    description:
      "This policy describes the only data we see and why. No hidden tracking.",
  },
  {
    icon: Shield,
    title: "Minimal Data",
    description:
      "We collect aggregate, anonymous usage patterns — never data that identifies you personally.",
  },
  {
    icon: Lock,
    title: "Secure Infrastructure",
    description:
      "Data in transit is encrypted. External resources use their own security and privacy practices.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#0A4A0A] sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              This site does not collect personal information from visitors.
              Here is the full, plain-language version of what we see and how
              we handle it.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="bg-white rounded-lg p-6 shadow-sm border text-center"
              >
                <principle.icon
                  size={36}
                  className="text-[#0A4A0A] mx-auto mb-3"
                  aria-hidden="true"
                />
                <h2 className="text-lg font-bold text-[#222222] mb-2">
                  {principle.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-muted-foreground space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              What we do not collect
            </h2>
            <p>
              Duty Station Relocation has no user accounts, no login, and no
              submission forms. We do not collect names, email addresses,
              phone numbers, addresses, payment information, or any other
              personally identifiable information from visitors to this site.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              What we do collect
            </h2>
            <p>
              Two categories of anonymous, aggregate data are collected so we
              can understand how the site is used and keep it working well:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Google Analytics (gtag):</strong> standard web analytics
                including pages viewed, approximate geographic region (derived
                from IP, then discarded), browser type, device type, and
                referral source. Google processes this data on our behalf.
                See{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline underline-offset-2 hover:no-underline"
                >
                  Google's privacy policy
                </a>{" "}
                for details on their handling.
              </li>
              <li>
                <strong>Application usage events:</strong> anonymous interaction
                events (e.g. "user viewed a station detail page", "user clicked
                an external resource"). These events carry no identifying data
                and are used to understand which features are useful.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              Cookies
            </h2>
            <p>
              This site uses Google Analytics, which sets cookies to support
              its anonymous measurement. We do not set any advertising cookies,
              retargeting pixels, or other tracking mechanisms. You can block
              analytics cookies at any time using your browser settings or a
              privacy extension.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              External resources
            </h2>
            <p>
              Each duty station page links to third-party resources (housing,
              schools, weather, etc.). When you click through, you leave this
              site and the destination's own privacy policy applies. We don't
              pre-load third-party content in the background, and we don't
              share any information about you with those destinations.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              Security
            </h2>
            <p>
              The site is served over HTTPS. Production traffic is protected
              in transit by TLS. Our managed hosting provider and database
              enforce encryption at rest and role-based access to any
              back-office systems.
            </p>
            <p>
              Security vulnerabilities should be reported per our{" "}
              <a
                href="https://github.com/MetaPhase-Consulting/dutystation/blob/main/SECURITY.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline underline-offset-2 hover:no-underline"
              >
                security policy
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              Your rights
            </h2>
            <p>
              Because we do not collect personal information from visitors,
              there are no individual records to access, correct, or delete.
              If you have a concern about data associated with you
              specifically, open an issue on our{" "}
              <a
                href="https://github.com/MetaPhase-Consulting/dutystation/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline underline-offset-2 hover:no-underline"
              >
                GitHub repository
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              Changes to this policy
            </h2>
            <p>
              We may update this policy as the site evolves. Changes are
              committed to the{" "}
              <a
                href="https://github.com/MetaPhase-Consulting/dutystation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline underline-offset-2 hover:no-underline"
              >
                public repository
              </a>{" "}
              so the revision history is always available. Continued use of
              the site after changes constitutes acceptance.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              See also
            </h2>
            <p>
              <Link
                to="/disclaimer"
                className="text-blue-700 underline underline-offset-2 hover:no-underline"
              >
                Site disclaimer
              </Link>
              {" · "}
              <Link
                to="/accessibility"
                className="text-blue-700 underline underline-offset-2 hover:no-underline"
              >
                Accessibility statement
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
