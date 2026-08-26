import Breadcrumb from "../../components/common/Breadcrumb";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By creating an account or making a purchase on Zyqora, you agree to be bound by these Terms & Conditions and our Privacy Policy.",
  },
  {
    title: "2. Orders & Payments",
    body: "All orders are subject to product availability. Payments are processed securely through our payment partner. Prices are listed in Indian Rupees and are inclusive of applicable taxes unless stated otherwise.",
  },
  {
    title: "3. Shipping & Delivery",
    body: "Delivery timelines are estimates and may vary based on location and courier availability. Zyqora is not liable for delays caused by circumstances beyond our control.",
  },
  {
    title: "4. Returns & Cancellations",
    body: "Orders can be cancelled before they are shipped. Once an order is delivered, return eligibility depends on the product category and condition of the item.",
  },
  {
    title: "5. Account Responsibility",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
  },
  {
    title: "6. Changes to Terms",
    body: "Zyqora reserves the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the revised terms.",
  },
];

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "Terms & Conditions" }]} />

      <div className="bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card p-8 space-y-6">
        <h1 className="text-2xl font-display font-bold text-ink">Terms & Conditions</h1>
        <p className="text-sm font-body text-muted">Last updated: August 2026</p>

        <div className="space-y-5">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="font-display font-semibold text-ink mb-1">{section.title}</h2>
              <p className="text-sm font-body text-muted leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}