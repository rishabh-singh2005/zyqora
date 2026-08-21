import Breadcrumb from "../../components/common/Breadcrumb";
import PricingPlans from "../../components/product/PricingPlans";

export default function Pricing() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "Pricing Plans" }]} />
      <PricingPlans />
    </div>
  );
}