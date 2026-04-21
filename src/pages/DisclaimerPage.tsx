import { Link } from "react-router-dom";
import { AlertTriangle, ExternalLink, Info, Scale } from "lucide-react";

const principles = [
  {
    icon: Info,
    title: "Informational Only",
    description:
      "This website is an informational, non-official resource. It is not an official U.S. government system.",
  },
  {
    icon: Scale,
    title: "No Legal Guarantees",
    description:
      "Content is provided without warranty and does not create legal rights, guarantees, or obligations.",
  },
  {
    icon: ExternalLink,
    title: "Third-Party Links",
    description:
      "External data and links are provided for convenience. Availability, accuracy, and ownership remain with their providers.",
  },
  {
    icon: AlertTriangle,
    title: "Verify Before Deciding",
    description:
      "Details change over time. Independently verify critical information before making any relocation decision.",
  },
];

export default function DisclaimerPage() {
  return (
    <div className="bg-white">
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#0A4A0A] sm:text-5xl">
              Disclaimer
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Plain-language terms about what this site is, what it is not, and
              how to use the information it provides.
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
              Not an official U.S. government system
            </h2>
            <p>
              This website is an informational, non-official resource built by{" "}
              <a
                href="https://metaphase.tech"
                target="_blank"
                rel="noopener noreferrer"
                data-brand="metaphase"
                className="text-orange-500 font-semibold hover:underline"
              >
                MetaPhase
              </a>{" "}
              and offered as a free, open-source CivicTech contribution. It is
              not operated by U.S. Customs and Border Protection (CBP), the
              Department of Homeland Security (DHS), or any federal agency. No
              content here should be read as an official government statement,
              policy, or endorsement.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              CBP is not responsible for relocation costs
            </h2>
            <p>
              CBP is not responsible for relocation costs, travel expenses,
              housing expenses, or any related personal costs associated with
              assignment decisions informed by this site. Any financial
              commitment you make in connection with a potential duty station
              is your own.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              External links and third-party data
            </h2>
            <p>
              Each duty station page links out to third-party resources —
              housing, schools, crime statistics, cost of living, weather,
              transit, and moving guidance. These links are provided as a
              convenience. Accuracy, availability, ownership, and any content
              you encounter after following a link remain entirely with the
              destination provider. We don't control and aren't responsible for
              third-party content.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              Data currency and user responsibility
            </h2>
            <p>
              Assignment information, community details, and external resources
              may change. We refresh our data on a regular schedule, but
              accuracy is not guaranteed. You are responsible for independently
              verifying any detail that would factor into a relocation decision
              — including current station status, available positions, local
              amenities, and community conditions — directly with CBP and with
              the relevant local sources.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              No warranty
            </h2>
            <p>
              Content on this site is provided "as is" without warranty of any
              kind, express or implied, including but not limited to warranties
              of merchantability, fitness for a particular purpose, accuracy,
              or non-infringement. Use of this site does not create any
              contract, obligation, or guarantee between you and MetaPhase,
              CBP, or any other party.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              Questions
            </h2>
            <p>
              Questions or corrections about the information on this site may
              be opened as an issue on the{" "}
              <a
                href="https://github.com/MetaPhase-Consulting/dutystation/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline underline-offset-2 hover:no-underline"
              >
                GitHub repository
              </a>
              . See also our{" "}
              <Link
                to="/privacy"
                className="text-blue-700 underline underline-offset-2 hover:no-underline"
              >
                privacy policy
              </Link>{" "}
              and{" "}
              <Link
                to="/accessibility"
                className="text-blue-700 underline underline-offset-2 hover:no-underline"
              >
                accessibility statement
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
