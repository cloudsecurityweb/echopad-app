import Section from "../components/Section";
import Card from "../components/Card";
import { feedbackItems } from "../data/mockData";

function FeedbackSection() {
  return (
    <Section title="Feedback & Escalations">
      <Card>
        <div className="space-y-4">
          {feedbackItems.map(item => (
            <div
              key={item.id}
              className="flex justify-between items-start border-b pb-3 last:border-0"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {item.clientName}
                </p>
                <p className="text-sm text-gray-600">
                  {item.subject}
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}

export default FeedbackSection;
