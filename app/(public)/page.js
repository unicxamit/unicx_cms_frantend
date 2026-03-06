import Image from "next/image";
import Link from "next/link";
import Section from "../../shared/ui/Section";
import Heading from "../../shared/ui/Heading";
import Button from "../../shared/ui/Button";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <Section>
        <Heading
          title="Migration Scaffold Ready"
          subtitle="Performance-first Next.js foundation for the new UniCX rebuild."
        />
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <Image
            src="/assets/images/unicx-image/title_logo4.png"
            alt="UniCX"
            width={1200}
            height={600}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
        <div className="mt-6">
          <Button asChild>
            <Link href="/blog">View Blog Feature Example</Link>
          </Button>
        </div>
      </Section>
    </div>
  );
}
