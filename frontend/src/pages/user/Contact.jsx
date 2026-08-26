import { Mail, Phone, MapPin } from "lucide-react";
import Breadcrumb from "../../components/common/Breadcrumb";

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "Contact" }]} />

      <div className="bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card p-8 space-y-6">
        <h1 className="text-2xl font-display font-bold text-ink">Get in Touch</h1>
        <p className="font-body text-muted">
          Have a question about an order, a product, or your account? We're here to help.
        </p>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 bg-primary-50/50 rounded-xl2 p-4">
            <Mail size={18} className="text-primary-600 mt-0.5" />
            <div>
              <p className="font-display font-semibold text-sm text-ink">Email</p>
              <p className="text-sm font-body text-muted">support@zyqora.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-primary-50/50 rounded-xl2 p-4">
            <Phone size={18} className="text-primary-600 mt-0.5" />
            <div>
              <p className="font-display font-semibold text-sm text-ink">Phone</p>
              <p className="text-sm font-body text-muted">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-primary-50/50 rounded-xl2 p-4">
            <MapPin size={18} className="text-primary-600 mt-0.5" />
            <div>
              <p className="font-display font-semibold text-sm text-ink">Address</p>
              <p className="text-sm font-body text-muted">New Delhi, India</p>
            </div>
          </div>
        </div>

        <p className="text-sm font-body text-muted pt-2">
          Our support team typically responds within 24 hours on business days.
        </p>
      </div>
    </div>
  );
}