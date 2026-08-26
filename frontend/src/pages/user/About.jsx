import Breadcrumb from "../../components/common/Breadcrumb";
import logo from "../../assets/logo.png";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "About Us" }]} />

      <div className="bg-white/80 backdrop-blur-sm rounded-xl2 shadow-card p-8 space-y-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Zyqora" className="h-14 w-14 rounded-xl2" />
          <div>
            <h1 className="text-2xl font-display font-bold text-ink">About Zyqora</h1>
            <p className="text-sm font-body text-muted">Shop Beyond Ordinary</p>
          </div>
        </div>

        <p className="font-body text-ink leading-relaxed">
          Zyqora is an online marketplace built to make everyday shopping feel effortless
          and enjoyable. From trending fashion and accessories to home essentials and
          electronics, we bring together curated collections that fit real, everyday needs.
        </p>

        <p className="font-body text-ink leading-relaxed">
          Our mission is simple: make quality products accessible, deliver them reliably,
          and give every customer a shopping experience that feels personal — not generic.
          Every feature on this platform, from secure checkout to real-time order tracking,
          is designed with that goal in mind.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 pt-4">
          {[
            { title: "Curated Selection", desc: "Handpicked products across every category" },
            { title: "Secure Payments", desc: "Industry-standard checkout, every time" },
            { title: "Reliable Delivery", desc: "Fast, tracked shipping to your doorstep" },
          ].map((item) => (
            <div key={item.title} className="bg-primary-50/50 rounded-xl2 p-4">
              <p className="font-display font-semibold text-sm text-ink">{item.title}</p>
              <p className="text-xs font-body text-muted mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}