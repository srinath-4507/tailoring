import "./App.css";
import {
  NavLink,
  Routes,
  Route,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import {
  createOrder,
  getOrders,
  createReview,
  getReviews,
  registerUser,
  loginUser,
} from "./api";
import { Toast } from "./Toast";
import { AuthProvider, useAuth } from "./AuthContext";

const WHATSAPP_LINK =
  "https://wa.me/917418007184?text=Hi%2C%20I%20want%20to%20stitch%20a%20ladies%20dress%20at%20Sathya%20Tailoring";

const SERVICES = [
  {
    id: "bridal-blouse",
    name: "Bridal & Designer Blouses",
    short:
      "Princess cut, boat neck, puff sleeves, maggam-style patterns and more.",
    long:
      "Perfect for weddings, receptions and engagement functions. Includes lining, neat finishing and design discussion on WhatsApp.",
    priceRange: "₹650 – ₹1,800 (stitching only)",
    basePrice: 650,
    time: "4–7 working days (per blouse)",
    available: true,
    addons: [
      { code: "piping", label: "Neck / sleeve piping", extra: 80 },
      { code: "pads", label: "Blouse pads", extra: 150 },
      { code: "tassels", label: "Fancy back tassels", extra: 120 },
      { code: "embroidery-ready", label: "Embroidery margin ready", extra: 100 },
    ],
    note: "Fabric and embroidery charges are separate. Trial fitting available for local customers.",
  },
  {
    id: "kurtis-churidar",
    name: "Kurtis & Churidars",
    short:
      "Straight cut, A-line, umbrella and anarkali styles for office & college.",
    long:
      "Comfortable cottons and fancy materials stitched with soft finishing, side slits and pockets on request.",
    priceRange: "₹500 – ₹1,400 (top only)",
    basePrice: 500,
    time: "3–6 working days",
    available: true,
    addons: [
      { code: "lining", label: "Full lining", extra: 120 },
      { code: "pockets", label: "Side pockets", extra: 100 },
      { code: "pant", label: "Matching pant stitching", extra: 250 },
      { code: "dupatta-edge", label: "Dupatta roll / edge", extra: 80 },
    ],
    note: "You can bring a well-fitting old kurti; same measurement can be used.",
  },
  {
    id: "kids-wear",
    name: "Kids Frocks & Lehengas",
    short:
      "Birthday frocks, pavadai-sattai and lehenga sets with soft lining.",
    long:
      "Extra care for kids – soft materials, no poking stitches, and enough ease so they can run and play happily.",
    priceRange: "₹450 – ₹1,600 (depending on style)",
    basePrice: 450,
    time: "4–8 working days",
    available: true,
    addons: [
      { code: "bow", label: "Back bow / belt", extra: 90 },
      { code: "can-can", label: "Extra flare (can-can style)", extra: 200 },
      { code: "hairband", label: "Matching hairband", extra: 80 },
    ],
    note: "For small kids, measurements can be shared by height + chest only.",
  },
  {
    id: "alterations",
    name: "Alterations & Restyling",
    short:
      "Tight/loose, length changes, zip change and giving old dresses a new life.",
    long:
      "Perfect option to fix favourite dresses or resize outfits after weight change.",
    priceRange: "₹80 – ₹450 (based on work)",
    basePrice: 80,
    time: "1–3 working days",
    available: true,
    addons: [
      { code: "zip", label: "Zip replacement", extra: 120 },
      { code: "neck-change", label: "Neck pattern change", extra: 220 },
      { code: "sleeve-change", label: "Sleeve add / remove", extra: 180 },
    ],
    note: "Final price is confirmed after seeing the dress in person or on video call.",
  },
];

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, logout } = useAuth();
  
  return (
    <div className="site">
      <ScrollToTop />

      {/* NAVBAR */}
      <header className="navbar">
        <div className="brand">
          <span className="logo-mark">S</span>
          <div>
            <div className="logo-title">Sathya Tailoring</div>
            <div className="logo-sub">Ladies & Kids Boutique Tailor</div>
          </div>
        </div>
        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/reviews">Reviews</NavLink>
          <NavLink to="/orders">My Orders</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: '#be185d' }}>Hi, {user.name}</span>
              <button 
                onClick={logout}
                style={{ 
                  background: 'none', 
                  border: '1px solid #fecaca', 
                  borderRadius: '20px', 
                  padding: '4px 12px', 
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  color: '#9d174d'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/auth">Login / Register</NavLink>
          )}
        </nav>
      </header>

      {/* ROUTES */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} Sathya Tailoring, Gudiyattam. All rights
          reserved.
        </p>
        <p className="footer-small">
          Designed with love by her child 💗 • React + Vite
        </p>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={WHATSAPP_LINK}
        className="floating-whatsapp"
        target="_blank"
        rel="noreferrer"
      >
        💬
      </a>
    </div>
  );
}

/* ---------------- HOME PAGE ---------------- */

function HomePage() {
  return (
    <>
      {/* Moving offer bar */}
      <div className="offer-bar">
        <div className="offer-marquee">
          ✨ Festive Offer: 10% off on bridal blouse stitching • Free saree fall
          for blouse orders above ₹1500 • Combo offer for mother & daughter
          dresses ✨
        </div>
      </div>

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-text" data-animate="fade-up">
          <p className="chip">Home-based ladies tailor • Gudiyattam</p>
          <h1>
            Perfect fitting,{" "}
            <span className="accent">beautiful styling</span> for every woman.
          </h1>
          <p className="hero-desc">
            From bridal blouses to everyday kurtis, each dress is stitched by
            Sathya with neat finishing, feminine detailing and a soft, comfy
            feel – right from her home in Gudiyattam.
          </p>

          <div className="hero-tags">
            <span>Bridal & designer blouses</span>
            <span>Party wear & gowns</span>
            <span>Kids frocks & lehengas</span>
            <span>Alterations & restyling</span>
          </div>

          <div className="hero-actions">
            <a
              className="btn primary"
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
            >
              ✨ Order on WhatsApp
            </a>
            <NavLink className="btn ghost" to="/services">
              View all services
            </NavLink>
          </div>

          <p className="small-note">
            WhatsApp: <strong>74180 07184</strong> • Click the button to chat
            directly with Sathya.
          </p>
        </div>

        <div className="hero-visual" data-animate="fade-left">
          <div className="hero-main-photo" />
          <div className="hero-pill hero-pill-top">
            Soft silk bridal blouse with elbow sleeve & border work.
          </div>
          <div className="hero-pill hero-pill-bottom">
            Kids party frock with layered skirt & cute bow.
          </div>
        </div>
      </section>

      {/* QUICK HIGHLIGHTS */}
      <section className="section soft">
        <div className="section-header" data-animate="fade-up">
          <h2>Why Ladies Prefer Sathya Tailoring</h2>
          <p className="section-subtitle">
            A small home tailoring studio with care like family — and neat work
            like a boutique.
          </p>
        </div>

        <div className="highlight-grid">
          <div className="highlight-card" data-animate="fade-up">
            <h3>👗 Boutique-level finishing</h3>
            <p>Clean stitches, lining, and perfect fitting — no rushed work.</p>
          </div>
          <div className="highlight-card" data-animate="fade-up">
            <h3>🕒 On-time delivery</h3>
            <p>Clear promise date and honest updates on WhatsApp.</p>
          </div>
          <div className="highlight-card" data-animate="fade-up">
            <h3>💬 Easy communication</h3>
            <p>Send designs, doubts and feedback directly to Sathya on chat.</p>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------- SERVICES PAGE ---------------- */

function ServicesPage() {
  return (
    <section id="services" className="section">
      <div className="section-header" data-animate="fade-up">
        <h2>Stitching Services</h2>
        <p className="section-subtitle">
          Elegant, feminine and comfortable tailoring for all occasions — from
          daily wear to grand functions.
        </p>
      </div>

      <div className="service-grid">
        {SERVICES.map((s) => (
          <div key={s.id} className="service-card" data-animate="fade-up">
            <div className="icon-circle">👗</div>
            <h3>{s.name}</h3>
            <p>{s.short}</p>
            <p className="service-price-line">{s.priceRange}</p>
            <p className="service-time-line">⏱ Delivery: {s.time}</p>
            <div className="service-actions">
              <NavLink className="btn ghost small" to={`/services/${s.id}`}>
                View details &amp; book
              </NavLink>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- SERVICE DETAIL PAGE ---------------- */

function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = SERVICES.find((s) => s.id === id);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    mode: "visit",
    addons: [],
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [estimated, setEstimated] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (service) {
      setEstimated(service.basePrice);
    }
  }, [service]);

  if (!service) {
    return (
      <section className="section">
        <div className="section-header">
          <h2>Service not found</h2>
          <p className="section-subtitle">
            The service you are trying to view does not exist.
          </p>
          <button
            className="btn primary"
            onClick={() => navigate("/services")}
          >
            Back to all services
          </button>
        </div>
      </section>
    );
  }

  const toggleAddon = (code) => {
    setForm((prev) => {
      const exists = prev.addons.includes(code);
      const addons = exists
        ? prev.addons.filter((c) => c !== code)
        : [...prev.addons, code];

      let total = service.basePrice;
      service.addons.forEach((a) => {
        if (addons.includes(a.code)) total += a.extra;
      });
      setEstimated(total);

      return { ...prev, addons };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!form.phone.trim()) {
      err.phone = "Phone is required";
    } else if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      err.phone = "Enter 10-digit mobile number";
    }
    if (!form.date.trim()) err.date = "Preferred delivery date is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const orderPayload = {
      serviceId: service.id,
      serviceName: service.name,
      name: form.name.trim(),
      phone: form.phone.trim(),
      date: form.date,
      mode: form.mode,
      addons: form.addons,
      notes: form.notes.trim(),
      estimate: estimated,
    };

    setSubmitting(true);
    try {
      const saved = await createOrder(orderPayload);

      // optional: also keep in localStorage as a backup
      try {
        const existingRaw = localStorage.getItem("sathyaOrders");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        existing.push({
          ...orderPayload,
          id: saved?._id || Date.now(),
          createdAt: saved?.createdAt || new Date().toISOString(),
          status: saved?.status || "Pending",
        });
        localStorage.setItem("sathyaOrders", JSON.stringify(existing));
      } catch {
        // ignore localStorage failure
      }

      setToast({
        message: ` Booking placed successfully! Service: ${service.name} | Estimate: ₹${orderPayload.estimate}`,
        type: "success",
      });
      
      setTimeout(() => navigate("/orders"), 2000);
    } catch (err) {
      console.error("Error creating order:", err);
      setToast({
        message: " Failed to save order. Please try again or contact on WhatsApp.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section service-detail">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <button className="back-link" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="service-detail-header">
        <h2>{service.name}</h2>
        <div className="badge-row">
          <span className="badge price">{service.priceRange}</span>
          <span className="badge time">⏱ {service.time}</span>
          <span
            className={
              service.available ? "badge available" : "badge not-available"
            }
          >
            {service.available
              ? "Currently accepting orders"
              : "Temporarily full"}
          </span>
        </div>
        <p className="service-detail-long">{service.long}</p>
        <p className="service-detail-note">{service.note}</p>
      </div>

      <div className="service-layout">
        <div className="service-addons card-like">
          <h3>Optional add-on work</h3>
          <p className="small-soft">
            Tick the extra works you want for this dress. Estimate will update
            automatically.
          </p>
          <ul className="addon-list">
            {service.addons.map((a) => (
              <li key={a.code}>
                <label>
                  <input
                    type="checkbox"
                    checked={form.addons.includes(a.code)}
                    onChange={() => toggleAddon(a.code)}
                  />
                  <span>{a.label}</span>
                  <span className="addon-price">+ ₹{a.extra}</span>
                </label>
              </li>
            ))}
          </ul>

          <div className="estimate-box">
            <p className="estimate-label">Estimated stitching amount</p>
            <p className="estimate-value">₹{estimated ?? service.basePrice}</p>
            <p className="estimate-note">
              Final price will be confirmed after checking fabric &amp; pattern.
            </p>
          </div>
        </div>

        <form className="service-booking card-like" onSubmit={handleSubmit}>
          <h3>Book this work</h3>

          <label>
            Your name
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </label>

          <label>
            Phone / WhatsApp
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <span className="error-text">{errors.phone}</span>
            )}
          </label>

          <label>
            Preferred delivery date
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
            {errors.date && <span className="error-text">{errors.date}</span>}
          </label>

          <label>
            How will you give measurement?
            <select name="mode" value={form.mode} onChange={handleChange}>
              <option value="visit">
                I will visit with fabric and sample dress
              </option>
              <option value="send-measurements">
                I will send measurements on WhatsApp
              </option>
              <option value="video-call">
                Need video call help for measurements
              </option>
            </select>
          </label>

          <label>
            Extra notes (optional)
            <textarea
              name="notes"
              rows="3"
              placeholder="Example: boat neck, elbow sleeve, deep back with tie knot"
              value={form.notes}
              onChange={handleChange}
            />
          </label>

          <button
            type="submit"
            className="btn primary full-width"
            disabled={submitting}
          >
            {submitting ? "Saving booking..." : "Confirm booking"}
          </button>
          <p className="form-note">
            Booking details are saved in the tailoring system and also shown
            under “My Orders”.
          </p>
        </form>
      </div>
    </section>
  );
}

/* ---------------- GALLERY PAGE ---------------- */

function GalleryPage() {
  return (
    <section id="gallery" className="section soft">
      <div className="section-header" data-animate="fade-up">
        <h2>Design Inspiration Gallery</h2>
        <p className="section-subtitle">
          These are sample styles for ideas. You can bring your own fabric and
          reference photos — Sathya will stitch similar styles for you.
        </p>
      </div>

      <div className="gallery-grid">
        <div className="gallery-card" data-animate="zoom-in">
          <div className="gallery-img img-1" />
          <div className="gallery-info">
            Bridal silk blouse with elbow sleeves and rich border detailing.
          </div>
        </div>

        <div className="gallery-card" data-animate="zoom-in">
          <div className="gallery-img img-2" />
          <div className="gallery-info">
            Pastel anarkali-style gown — perfect for receptions and sangeet.
          </div>
        </div>

        <div className="gallery-card" data-animate="zoom-in">
          <div className="gallery-img img-3" />
          <div className="gallery-info">
            Floral kids frock with bow and layered flare for birthday parties.
          </div>
        </div>

        <div className="gallery-card" data-animate="zoom-in">
          <div className="gallery-img img-4" />
          <div className="gallery-info">
            Simple cotton kurti with neat finish — ideal for daily wear.
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- REVIEWS PAGE ---------------- */

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Priya",
    area: "Gudiyattam",
    rating: 5,
    text: "Blouse fitting was perfect in the first trial itself. She understood exactly what design I wanted just from a photo.",
  },
  {
    id: 2,
    name: "Lakshmi",
    area: "Nellorepet",
    rating: 5,
    text: "My daughter's birthday frock came out so cute and comfy. She didn't want to remove it the whole day!",
  },
];

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", area: "", rating: 5, text: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const backendReviews = await getReviews();
        setReviews([...INITIAL_REVIEWS, ...backendReviews]);
      } catch (err) {
        console.error("Error loading reviews:", err);
        setReviews(INITIAL_REVIEWS);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!form.text.trim()) err.text = "Please write your feedback";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      area: form.area.trim(),
      rating: Number(form.rating),
      text: form.text.trim(),
    };

    setSubmitting(true);
    try {
      const saved = await createReview(payload);
      setReviews((prev) => [...prev, saved]);
      setToast({
        message: "✅ Thank you for your review! It has been posted successfully.",
        type: "success",
      });
      setForm({ name: "", area: "", rating: 5, text: "" });
    } catch (err) {
      console.error("Error saving review:", err);
      setToast({
        message: "❌ Could not save your review. Please try again or send it on WhatsApp.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="section-header" data-animate="fade-up">
        <h2>Customer Reviews</h2>
        <p className="section-subtitle">
          Real feedback from ladies who have stitched their dresses with Sathya.
        </p>
      </div>

      <div className="review-grid">
        {reviews.map((r) => (
          <div
            key={r._id || r.id}
            className="review-card"
            data-animate="fade-up"
          >
            <div className="stars">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>
            <p className="review-text">“{r.text}”</p>
            <p className="review-name">
              — {r.name}
              {r.area ? `, ${r.area}` : ""}
            </p>
          </div>
        ))}
      </div>

      <div className="auth-card review-form" data-animate="fade-up">
        <h3>Post your review</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Your name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </label>

          <label>
            Area (optional)
            <input
              type="text"
              name="area"
              placeholder="Example: Buddhar Nagar"
              value={form.area}
              onChange={handleChange}
            />
          </label>

          <label>
            Rating
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
            >
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Very good</option>
              <option value={3}>3 - Good</option>
              <option value={2}>2 - Okay</option>
              <option value={1}>1 - Poor</option>
            </select>
          </label>

          <label>
            Your experience
            <textarea
              name="text"
              rows="3"
              value={form.text}
              onChange={handleChange}
            />
            {errors.text && <span className="error-text">{errors.text}</span>}
          </label>

          <button
            type="submit"
            className="btn primary full-width"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit review"}
          </button>
          <p className="form-note">
            Reviews are now stored in the tailoring system and shown publicly on
            this page.
          </p>
        </form>
      </div>
    </section>
  );
}

/* ---------------- ORDERS PAGE ---------------- */

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const backendOrders = await getOrders();
        if (backendOrders && backendOrders.length) {
          setOrders(backendOrders);
        } else {
          // fallback to localStorage if backend empty
          const raw = localStorage.getItem("sathyaOrders");
          if (raw) setOrders(JSON.parse(raw));
        }
      } catch (err) {
        console.error("Error loading orders:", err);
        try {
          const raw = localStorage.getItem("sathyaOrders");
          if (raw) setOrders(JSON.parse(raw));
        } catch {
          // ignore
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="section">
      <div className="section-header" data-animate="fade-up">
        <h2>My Stitching History</h2>
        <p className="section-subtitle">
          These are the booking requests saved in the system. For any changes,
          you can message directly on WhatsApp.
        </p>
      </div>

      {loading ? (
        <div className="section-subtitle" style={{ textAlign: 'center', padding: '40px 0' }}>
          ⏳ Loading your orders…
        </div>
      ) : orders.length === 0 ? (
        <p className="section-subtitle">
          No bookings yet. Go to Services, open a design and click “Book this
          work”.
        </p>
      ) : (
        <div className="orders-table" data-animate="fade-up">
          <table>
            <thead>
              <tr>
                <th>Date created</th>
                <th>Service</th>
                <th>Name</th>
                <th>Delivery date</th>
                <th>Estimate</th>
                <th>Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .slice()
                .reverse()
                .map((o) => (
                  <tr key={o._id || o.id}>
                    <td>
                      {new Date(o.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td>{o.serviceName}</td>
                    <td>{o.name}</td>
                    <td>{o.date}</td>
                    <td>₹{o.estimate}</td>
                    <td>{o.mode?.replace?.("-", " ")}</td>
                    <td>{o.status || "Pending"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* ---------------- CONTACT PAGE ---------------- */

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErr = {};
    if (!form.name.trim()) newErr.name = "Name is required";
    if (!form.phone.trim()) {
      newErr.phone = "Phone is required";
    } else if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      newErr.phone = "Enter 10-digit mobile number";
    }
    if (!form.message.trim()) newErr.message = "Please enter your requirement";
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    alert(
      `Thank you, ${form.name}! Your request has been recorded.\nSathya will contact you on ${form.phone}.`
    );
    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="contact-card" data-animate="fade-up">
        <h2>Contact & Orders</h2>
        <p>
          Share your design ideas on WhatsApp, send photos, or drop your
          measurements. Visits can be planned based on your timing.
        </p>

        <div className="contact-details">
          <p>
            <strong>Tailor:</strong> Sathya S
          </p>
          <p>
            <strong>Shop name:</strong> Sathya Tailoring
          </p>
          <p>
            <strong>Address:</strong> 59/8, Buddhar Nagar, Nellorepet,
            Gudiyattam – 632602
          </p>
          <p>
            <strong>Phone / WhatsApp:</strong> +91 74180 07184
          </p>
        </div>

        <a
          className="btn primary full-width"
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
        >
          💬 Chat with Sathya on WhatsApp
        </a>
      </div>

      <form
        className="contact-form"
        onSubmit={handleSubmit}
        data-animate="fade-up"
      >
        <h3>Quick Enquiry Form</h3>
        <label>
          Your name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </label>

        <label>
          Phone / WhatsApp
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </label>

        <label>
          What do you want to stitch?
          <textarea
            rows="4"
            name="message"
            placeholder="Example: bridal blouse + lehenga before next Sunday"
            value={form.message}
            onChange={handleChange}
          />
          {errors.message && (
            <span className="error-text">{errors.message}</span>
          )}
        </label>

        <button type="submit" className="btn primary full-width">
          Send enquiry
        </button>
        <p className="form-note">
          This form still works as a front-end demo. Later we can wire it to
          email / WhatsApp automation.
        </p>
      </form>
    </section>
  );
}

/* ---------------- AUTH (LOGIN / REGISTER) ---------------- */

function AuthPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [registerErrors, setRegisterErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setLoginErrors({});
    setRegisterErrors({});
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setLoginErrors({ ...loginErrors, [e.target.name]: "" });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setRegisterErrors({ ...registerErrors, [e.target.name]: "" });
  };

  const validateLogin = () => {
    const err = {};
    if (!loginData.username.trim()) {
      err.username = "Username is required";
    }
    if (!loginData.password.trim()) {
      err.password = "Password is required";
    } else if (loginData.password.length < 4) {
      err.password = "Password should be at least 4 characters";
    }
    setLoginErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateRegister = () => {
    const err = {};
    if (!registerData.name.trim()) err.name = "Name is required";
    if (!registerData.username.trim()) err.username = "Username is required";
    if (!registerData.phone.trim()) {
      err.phone = "Phone is required";
    } else if (!/^[0-9]{10}$/.test(registerData.phone.trim())) {
      err.phone = "Enter 10-digit mobile number";
    }
    if (!registerData.password.trim()) {
      err.password = "Password is required";
    } else if (registerData.password.length < 4) {
      err.password = "Password should be at least 4 characters";
    }
    if (registerData.confirm !== registerData.password) {
      err.confirm = "Passwords do not match";
    }
    setRegisterErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    
    setSubmitting(true);
    try {
      const response = await loginUser({
        username: loginData.username.trim(),
        password: loginData.password
      });
      
      login(response.user);
      setToast({
        message: ` Welcome back, ${response.user.name}!`,
        type: "success"
      });
      
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setToast({
        message: ` ${err.message}`,
        type: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    
    setSubmitting(true);
    try {
      const response = await registerUser({
        name: registerData.name.trim(),
        username: registerData.username.trim(),
        phone: registerData.phone.trim(),
        password: registerData.password
      });
      
      setToast({
        message: ` Registration successful! Welcome, ${response.user.name}!`,
        type: "success"
      });
      
      setRegisterData({ name: "", username: "", phone: "", password: "", confirm: "" });
      setTimeout(() => setMode("login"), 2000);
    } catch (err) {
      setToast({
        message: ` ${err.message}`,
        type: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (user) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <section className="section auth-section">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="section-header" data-animate="fade-up">
        <h2>Customer Account</h2>
        <p className="section-subtitle">
          Create an account to save your measurements and order history (demo
          only for now).
        </p>
      </div>

      <div className="auth-card" data-animate="fade-up">
        <div className="auth-tabs">
          <button
            className={mode === "login" ? "auth-tab active" : "auth-tab"}
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "register" ? "auth-tab active" : "auth-tab"}
            onClick={() => switchMode("register")}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <label>
              Username
              <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleLoginChange}
              />
              {loginErrors.username && (
                <span className="error-text">{loginErrors.username}</span>
              )}
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
              />
              {loginErrors.password && (
                <span className="error-text">{loginErrors.password}</span>
              )}
            </label>

            <button type="submit" className="btn primary full-width" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>
            <p className="form-note">
              Enter your username and password to login.
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <label>
              Name
              <input
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleRegisterChange}
              />
              {registerErrors.name && (
                <span className="error-text">{registerErrors.name}</span>
              )}
            </label>

            <label>
              Username
              <input
                type="text"
                name="username"
                value={registerData.username}
                onChange={handleRegisterChange}
              />
              {registerErrors.username && (
                <span className="error-text">{registerErrors.username}</span>
              )}
            </label>

            <label>
              Phone
              <input
                type="tel"
                name="phone"
                value={registerData.phone}
                onChange={handleRegisterChange}
              />
              {registerErrors.phone && (
                <span className="error-text">{registerErrors.phone}</span>
              )}
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
              />
              {registerErrors.password && (
                <span className="error-text">{registerErrors.password}</span>
              )}
            </label>

            <label>
              Confirm password
              <input
                type="password"
                name="confirm"
                value={registerData.confirm}
                onChange={handleRegisterChange}
              />
              {registerErrors.confirm && (
                <span className="error-text">{registerErrors.confirm}</span>
              )}
            </label>

            <button type="submit" className="btn primary full-width" disabled={submitting}>
              {submitting ? "Creating account..." : "Register"}
            </button>
            <p className="form-note">
              Create an account to save your orders and track your tailoring history.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

/* ---------------- NOT FOUND ---------------- */

function NotFoundPage() {
  return (
    <section className="section">
      <div className="section-header">
        <h2>Page not found</h2>
        <p className="section-subtitle">
          The page you&apos;re looking for doesn&apos;t exist. Please use the
          menu to navigate.
        </p>
      </div>
    </section>
  );
}

export default App;
