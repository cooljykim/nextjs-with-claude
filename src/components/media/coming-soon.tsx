import { EmptyState } from "@/components/media/empty-state";
import { Section } from "@/components/media/section";

/** A landing-page section that has a title but no content yet. */
export function ComingSoon({ title }: { title: string }) {
  return (
    <Section title={title}>
      <EmptyState message="Coming soon." />
    </Section>
  );
}
