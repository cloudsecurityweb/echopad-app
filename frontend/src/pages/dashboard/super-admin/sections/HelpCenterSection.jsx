import Section from "../components/Section";
import Card from "../components/Card";

function HelpCenterSection() {
  return (
    <Section
      title="Help Center"
      action={
        <button className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
          Add Doc
        </button>
      }
    >
      <Card>
        <p className="text-sm text-gray-600">
          Documentation management (same as client admin, with write access).
        </p>
      </Card>
    </Section>
  );
}

export default HelpCenterSection;
