import { Link } from "react-router-dom";
import { PageMeta } from "@/components/PageMeta";
import {
  Contrast,
  Keyboard,
  Ear,
  MousePointerClick,
  Smartphone,
  Type,
} from "lucide-react";

const features = [
  {
    icon: Keyboard,
    title: "Keyboard Navigation",
    description:
      "Every interactive element is reachable and operable with a keyboard. Focus states are visible.",
  },
  {
    icon: Ear,
    title: "Screen Reader Support",
    description:
      "Headings, landmarks, form labels, and ARIA attributes are authored so assistive technology can navigate the site cleanly.",
  },
  {
    icon: Contrast,
    title: "Color Contrast",
    description:
      "Text and interactive elements meet or exceed WCAG 2.1 AA contrast ratios. Color is never the only way to convey information.",
  },
  {
    icon: MousePointerClick,
    title: "Large Touch Targets",
    description:
      "Buttons and links are sized for reliable interaction on touch devices and for users with limited fine motor control.",
  },
  {
    icon: Type,
    title: "Readable Typography",
    description:
      "Line heights, font sizes, and line lengths are set to accommodate low-vision readers and readers with cognitive disabilities.",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description:
      "The site reflows cleanly from small phones up to wide desktops without horizontal scrolling or content clipping.",
  },
];

export default function AccessibilityPage() {
  return (
    <div className="bg-white">
      <PageMeta
        title="Accessibility"
        description="Duty Station Relocation targets WCAG 2.1 AA and Section 508 conformance. Keyboard navigation, screen reader support, color contrast, touch targets, readable typography, responsive design."
        path="/accessibility"
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#0A4A0A] sm:text-5xl">
              Accessibility
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Duty Station Relocation is built to be usable by everyone,
              including people with disabilities. We target WCAG 2.1 AA and
              Section 508 conformance.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-lg p-6 shadow-sm border"
              >
                <feature.icon
                  size={32}
                  className="text-[#0A4A0A] mb-3"
                  aria-hidden="true"
                />
                <h2 className="text-lg font-bold text-[#222222] mb-2">
                  {feature.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
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
              Our commitment
            </h2>
            <p>
              This is a public, open-source CivicTech site. Accessibility is a
              release gate — a change that introduces a serious or critical
              WCAG violation is treated the same as a broken test: it does not
              ship.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              Standards we follow
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>WCAG 2.1 Level AA</strong> — the conformance target for
                every page.
              </li>
              <li>
                <strong>Section 508</strong> — the U.S. federal accessibility
                standard for information and communication technology.
              </li>
              <li>
                <strong>WAI-ARIA 1.2</strong> — for composite widgets like
                combo boxes, menus, and the interactive map.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              How we test
            </h2>
            <p>
              Automated testing alone catches a fraction of real-world
              accessibility issues. We combine automation with manual review:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                Every pull request runs{" "}
                <a
                  href="https://github.com/dequelabs/axe-core-npm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline underline-offset-2 hover:no-underline"
                >
                  axe-core
                </a>{" "}
                in unit tests (via jest-axe), in our end-to-end Playwright
                suite, and as a standalone CLI scan against key routes.
              </li>
              <li>
                Keyboard-only walkthroughs and screen-reader spot-checks
                (VoiceOver on macOS, NVDA on Windows) on notable releases.
              </li>
              <li>
                Lighthouse CI runs on every build with an accessibility score
                threshold.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              Known limitations
            </h2>
            <p>
              The interactive map relies on pointer interaction. We provide a
              keyboard-accessible station list alongside the map so users who
              cannot use pointer input can still reach every station. If you
              hit a barrier that isn't addressed here, we want to know.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A4A0A] mb-3">
              Feedback
            </h2>
            <p>
              If an accessibility barrier on this site affects you, please
              open an issue on the{" "}
              <a
                href="https://github.com/MetaPhase-Consulting/dutystation/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline underline-offset-2 hover:no-underline"
              >
                GitHub repository
              </a>{" "}
              with a description of the problem, the page you were on, and the
              assistive technology you were using. We treat these reports as
              priority.
            </p>
            <p>
              See also the{" "}
              <Link
                to="/disclaimer"
                className="text-blue-700 underline underline-offset-2 hover:no-underline"
              >
                site disclaimer
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-blue-700 underline underline-offset-2 hover:no-underline"
              >
                privacy policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
