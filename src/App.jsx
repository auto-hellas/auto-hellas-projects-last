import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  SlidersHorizontal,
  Star,
  CarFront,
  ShieldCheck,
  MessageCircle,
  Plus,
  Trash2,
  Database,
} from 'lucide-react';

const stats = [
  { label: 'Επιλεγμένα αυτοκίνητα', value: '100%' },
  { label: 'Χρηματοδότηση', value: 'Διαθέσιμη' },
  { label: 'Trade-in', value: 'Άμεση εκτίμηση' },
  { label: 'Υποστήριξη', value: 'Άμεση επικοινωνία' },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Ελεγμένα οχήματα',
    text: 'Καθαρή premium παρουσίαση με έμφαση στην αξιοπιστία και στη σωστή πληροφόρηση.',
  },
  {
    icon: CarFront,
    title: 'Πολλές φωτογραφίες',
    text: 'Κάθε αγγελία έχει εικόνα, βασικά χαρακτηριστικά και γρήγορη φόρμα ενδιαφέροντος.',
  },
  {
    icon: MessageCircle,
    title: 'Άμεσο lead',
    text: 'Τηλέφωνο, email και καθαρή προβολή στοιχείων επικοινωνίας.',
  },
];

const fallbackInventory = [
  {
    id: 1,
    title: 'Mercedes-Benz CLA 250e Shooting Brake AMG',
    price: '€31.900',
    year: 2021,
    km: '98.000 km',
    fuel: 'Plug-in Hybrid',
    transmission: 'Αυτόματο',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
];

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const defaultImage =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80';

function StatCard({ value, label }) {
  return (
    <div className="ah-card ah-stat-card">
      <div className="ah-stat-line" />
      <div className="ah-stat-value">{value}</div>
      <div className="ah-stat-label">{label}</div>
    </div>
  );
}

function VehicleCard({ car }) {
  return (
    <div className="ah-card ah-vehicle-card">
      <div className="ah-vehicle-image-wrap">
        <img src={car.image || defaultImage} alt={car.title} className="ah-vehicle-image" />
        <div className="ah-vehicle-overlay" />
        <div className="ah-vehicle-badges">
          {car.featured ? <span className="ah-badge ah-badge-light">Προτεινόμενο</span> : null}
          <span className="ah-badge">{car.year}</span>
        </div>
        <div className="ah-vehicle-bottom">
          <h3 className="ah-vehicle-title">{car.title}</h3>
          <div className="ah-price">{car.price}</div>
        </div>
      </div>
      <div className="ah-vehicle-body">
        <div className="ah-spec-grid">
          <div className="ah-spec"><Gauge size={16} /> {car.km}</div>
          <div className="ah-spec"><Fuel size={16} /> {car.fuel}</div>
          <div className="ah-spec"><Calendar size={16} /> {car.year}</div>
          <div className="ah-spec"><SlidersHorizontal size={16} /> {car.transmission}</div>
        </div>
        <div className="ah-row ah-gap-sm ah-mt-md">
          <button className="ah-btn ah-btn-primary ah-btn-block">Προβολή αγγελίας</button>
          <button className="ah-btn ah-btn-secondary ah-btn-block">Επικοινωνία</button>
        </div>
      </div>
    </div>
  );
}

export default function AutoHellasPremiumDemo() {
  const [query, setQuery] = useState('');
  const [fuel, setFuel] = useState('all');
  const [transmission, setTransmission] = useState('all');
  const [yearFrom, setYearFrom] = useState('all');
  const [cars, setCars] = useState([]);
  const [isLoadingCars, setIsLoadingCars] = useState(true);
  const [carsError, setCarsError] = useState('');
  const [form, setForm] = useState({
    title: '',
    price: '',
    year: '',
    km: '',
    fuel: 'Βενζίνη',
    transmission: 'Αυτόματο',
    imageFile: null,
    featured: true,
  });

  useEffect(() => {
    let active = true;

    const loadCars = async () => {
      if (!supabase) {
        if (!active) return;
        setCars(fallbackInventory);
        setCarsError('Λείπουν τα Supabase environment variables. Εμφανίζεται προσωρινό demo απόθεμα.');
        setIsLoadingCars(false);
        return;
      }

      setIsLoadingCars(true);
      setCarsError('');

      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (!active) return;

      if (error) {
        console.error(error);
        setCars(fallbackInventory);
        setCarsError('Δεν έγινε φόρτωση από τη βάση. Εμφανίζεται προσωρινό demo απόθεμα.');
      } else {
        setCars(Array.isArray(data) ? data : []);
      }

      setIsLoadingCars(false);
    };

    loadCars();
    return () => {
      active = false;
    };
  }, []);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchQuery = (car.title || '').toLowerCase().includes(query.toLowerCase());
      const matchFuel = fuel === 'all' ? true : (car.fuel || '').toLowerCase().includes(fuel.toLowerCase());
      const matchTransmission =
        transmission === 'all'
          ? true
          : (car.transmission || '').toLowerCase().includes(transmission.toLowerCase());
      const matchYearFrom = yearFrom === 'all' ? true : Number(car.year) >= Number(yearFrom);
      return matchQuery && matchFuel && matchTransmission && matchYearFrom;
    });
  }, [cars, query, fuel, transmission, yearFrom]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      title: '',
      price: '',
      year: '',
      km: '',
      fuel: 'Βενζίνη',
      transmission: 'Αυτόματο',
      imageFile: null,
      featured: true,
    });
  };

  const handleAddCar = async () => {
    if (!form.title || !form.price || !form.year) {
      setCarsError('Συμπλήρωσε τίτλο, τιμή και έτος.');
      return;
    }

    if (!supabase) {
      setCarsError('Δεν υπάρχει σύνδεση με Supabase ακόμη.');
      return;
    }

    setCarsError('');
    let imageUrl = defaultImage;

    if (form.imageFile) {
      const fileExt = form.imageFile.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `cars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, form.imageFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: form.imageFile.type,
        });

      if (uploadError) {
        console.error(uploadError);
        setCarsError('Η φωτογραφία δεν ανέβηκε.');
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('car-images').getPublicUrl(filePath);
      imageUrl = publicUrlData.publicUrl;
    }

    const payload = {
      title: form.title,
      price: form.price,
      year: Number(form.year),
      km: form.km || '—',
      fuel: form.fuel,
      transmission: form.transmission,
      image: imageUrl,
      featured: form.featured,
    };

    const { data, error } = await supabase.from('cars').insert(payload).select().single();

    if (error) {
      console.error(error);
      setCarsError('Η αγγελία δεν αποθηκεύτηκε. Έλεγξε table / permissions / keys.');
      return;
    }

    setCars((prev) => [data, ...prev]);
    resetForm();
  };

  const handleDeleteCar = async (id) => {
    if (!supabase) {
      setCarsError('Δεν υπάρχει σύνδεση με Supabase ακόμη.');
      return;
    }

    const previousCars = cars;
    setCars((prev) => prev.filter((car) => car.id !== id));

    const { error } = await supabase.from('cars').delete().eq('id', id);

    if (error) {
      console.error(error);
      setCars(previousCars);
      setCarsError('Η διαγραφή απέτυχε. Η αγγελία επανήλθε.');
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, Arial, sans-serif; background: #050505; color: #f4f4f5; }
        a { color: inherit; text-decoration: none; }
        .ah-page { min-height: 100vh; background: linear-gradient(180deg, #050505 0%, #090909 45%, #030303 100%); }
        .ah-shell { max-width: 1240px; margin: 0 auto; padding: 0 24px; }
        .ah-header { position: sticky; top: 0; z-index: 30; border-bottom: 1px solid #27272a; background: rgba(0,0,0,.9); backdrop-filter: blur(12px); }
        .ah-header-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 0; }
        .ah-brand-top { font-size: 12px; text-transform: uppercase; letter-spacing: .35em; color: #71717a; }
        .ah-brand-main { font-size: 28px; font-weight: 800; letter-spacing: .06em; }
        .ah-brand-main span { color: #a1a1aa; }
        .ah-nav { display: flex; gap: 24px; color: #d4d4d8; }
        .ah-btn { border: 0; border-radius: 16px; padding: 12px 18px; font-weight: 700; cursor: pointer; }
        .ah-btn-primary { background: #f4f4f5; color: #111827; }
        .ah-btn-secondary { background: transparent; color: #f4f4f5; border: 1px solid #3f3f46; }
        .ah-btn-block { width: 100%; }
        .ah-hero { display: grid; grid-template-columns: 1.1fr .9fr; gap: 40px; padding: 56px 0; }
        .ah-pill { display: inline-block; margin-bottom: 18px; padding: 8px 14px; border: 1px solid #27272a; border-radius: 999px; background: #09090b; color: #d4d4d8; font-size: 14px; }
        .ah-title { font-size: clamp(38px, 6vw, 62px); line-height: 1.02; font-weight: 900; margin: 0; }
        .ah-title span { color: #e4e4e7; }
        .ah-subtitle { margin-top: 18px; max-width: 760px; color: #d4d4d8; font-size: 18px; line-height: 1.75; }
        .ah-search-panel, .ah-card { border: 1px solid #27272a; background: linear-gradient(180deg, #111111, #050505); border-radius: 28px; }
        .ah-search-panel { padding: 18px; margin-top: 24px; }
        .ah-search-grid { display: grid; grid-template-columns: 1.3fr .9fr .9fr .9fr auto; gap: 12px; }
        .ah-input, .ah-select { width: 100%; background: #09090b; border: 1px solid #27272a; color: #f4f4f5; border-radius: 16px; padding: 14px 16px; font-size: 15px; }
        .ah-input-wrap { position: relative; }
        .ah-input-wrap svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #71717a; }
        .ah-input-wrap .ah-input { padding-left: 42px; }
        .ah-action-row { display: flex; gap: 12px; margin-top: 18px; flex-wrap: wrap; }
        .ah-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 26px; }
        .ah-stat-card { min-height: 148px; padding: 22px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .ah-stat-line { width: 64px; height: 1px; background: linear-gradient(90deg, transparent, #d4d4d8, transparent); margin-bottom: 12px; }
        .ah-stat-value { font-size: 28px; font-weight: 800; line-height: 1.1; }
        .ah-stat-label { margin-top: 10px; font-size: 14px; color: #e4e4e7; }
        .ah-showcase { position: relative; min-height: 460px; overflow: hidden; }
        .ah-showcase img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .ah-showcase-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,0,0,.82), rgba(0,0,0,.35), transparent); }
        .ah-showcase-content { position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 28px; }
        .ah-badge { display: inline-flex; align-items: center; border: 1px solid #3f3f46; background: rgba(0,0,0,.55); color: #f4f4f5; border-radius: 999px; padding: 6px 12px; font-size: 12px; }
        .ah-badge-light { background: #f4f4f5; color: #111827; }
        .ah-section { padding: 26px 0 52px; }
        .ah-section-title { font-size: 36px; margin: 10px 0 8px; }
        .ah-section-kicker { font-size: 13px; letter-spacing: .24em; text-transform: uppercase; color: #71717a; }
        .ah-section-text { color: #a1a1aa; line-height: 1.7; }
        .ah-toolbar { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 22px; }
        .ah-toolbar-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; width: min(860px, 100%); }
        .ah-alert { margin-bottom: 20px; border-radius: 24px; padding: 16px 18px; }
        .ah-alert-warning { border: 1px solid rgba(217,119,6,.35); background: rgba(120,53,15,.25); color: #fde68a; }
        .ah-alert-muted { border: 1px solid #3f3f46; background: rgba(9,9,11,.85); color: #d4d4d8; }
        .ah-inventory-grid, .ah-benefit-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 22px; }
        .ah-vehicle-card { overflow: hidden; }
        .ah-vehicle-image-wrap { position: relative; height: 240px; }
        .ah-vehicle-image { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ah-vehicle-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent, rgba(0,0,0,.8)); }
        .ah-vehicle-badges { position: absolute; top: 16px; left: 16px; display: flex; gap: 8px; flex-wrap: wrap; }
        .ah-vehicle-bottom { position: absolute; left: 16px; right: 16px; bottom: 16px; display: flex; justify-content: space-between; align-items: end; gap: 12px; }
        .ah-vehicle-title { margin: 0; max-width: 70%; font-size: 20px; line-height: 1.15; }
        .ah-price { background: #f4f4f5; color: #111827; border-radius: 16px; padding: 10px 12px; font-weight: 800; }
        .ah-vehicle-body { padding: 18px; }
        .ah-spec-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; color: #d4d4d8; }
        .ah-spec { display: flex; align-items: center; gap: 8px; font-size: 14px; }
        .ah-row { display: flex; }
        .ah-gap-sm { gap: 12px; }
        .ah-mt-md { margin-top: 18px; }
        .ah-benefit-card { padding: 24px; }
        .ah-benefit-icon { width: 52px; height: 52px; display: inline-flex; align-items: center; justify-content: center; border-radius: 18px; background: #09090b; border: 1px solid #27272a; margin-bottom: 16px; }
        .ah-split-card { display: grid; grid-template-columns: .9fr 1.1fr; gap: 26px; padding: 28px; }
        .ah-list { display: grid; gap: 12px; color: #d4d4d8; }
        .ah-admin-list { margin-top: 24px; padding: 18px; border: 1px solid #27272a; border-radius: 24px; background: rgba(0,0,0,.35); }
        .ah-admin-item { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 14px 16px; border: 1px solid #27272a; border-radius: 18px; background: #09090b; }
        .ah-form-card { padding: 24px; }
        .ah-form-grid { display: grid; gap: 12px; }
        .ah-form-two { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
        .ah-file-wrap { border: 1px solid #27272a; background: #09090b; border-radius: 16px; padding: 12px; }
        .ah-file-wrap label { display: block; margin-bottom: 8px; color: #a1a1aa; font-size: 14px; }
        .ah-checkbox { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border: 1px solid #27272a; border-radius: 16px; background: rgba(9,9,11,.85); }
        .ah-location-grid { display: grid; grid-template-columns: .9fr 1.1fr; gap: 26px; padding: 24px; }
        .ah-contact-box { border: 1px solid #27272a; border-radius: 18px; background: rgba(9,9,11,.9); padding: 16px; }
        .ah-contact-kicker { margin-bottom: 8px; font-size: 11px; text-transform: uppercase; letter-spacing: .22em; color: #71717a; }
        .ah-map-panel { min-height: 360px; border: 1px solid #27272a; border-radius: 24px; background: linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%); display: flex; align-items: center; justify-content: center; text-align: center; padding: 24px; }
        .ah-footer { border-top: 1px solid #27272a; background: rgba(0,0,0,.8); }
        .ah-footer-grid { display: grid; grid-template-columns: 1fr 1fr auto; gap: 26px; padding: 34px 0; }
        .ah-stack { display: grid; gap: 12px; }
        .ah-inline { display: flex; align-items: center; gap: 10px; }
        .ah-muted { color: #a1a1aa; }
        @media (max-width: 1024px) {
          .ah-hero, .ah-split-card, .ah-location-grid, .ah-footer-grid { grid-template-columns: 1fr; }
          .ah-stat-grid, .ah-inventory-grid, .ah-benefit-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .ah-search-grid, .ah-toolbar-grid { grid-template-columns: 1fr 1fr; }
          .ah-nav { display: none; }
        }
        @media (max-width: 720px) {
          .ah-shell { padding: 0 16px; }
          .ah-stat-grid, .ah-inventory-grid, .ah-benefit-grid, .ah-search-grid, .ah-toolbar-grid, .ah-form-two { grid-template-columns: 1fr; }
          .ah-title { font-size: 36px; }
          .ah-section-title { font-size: 30px; }
          .ah-vehicle-bottom { flex-direction: column; align-items: start; }
          .ah-vehicle-title { max-width: 100%; }
          .ah-action-row, .ah-row { flex-direction: column; }
          .ah-btn-block { width: 100%; }
        }
      `}</style>

      <div className="ah-page">
        <header className="ah-header">
          <div className="ah-shell ah-header-inner">
            <div>
              <div className="ah-brand-top">Premium Used Cars</div>
              <div className="ah-brand-main">Auto-Hellas <span>ΓΕΩΡΓΑΤΣΗΣ</span></div>
            </div>
            <nav className="ah-nav">
              <a href="#inventory">Απόθεμα</a>
              <a href="#why">Γιατί εμάς</a>
              <a href="#contact">Επικοινωνία</a>
            </nav>
            <button className="ah-btn ah-btn-primary">Ζητήστε προσφορά</button>
          </div>
        </header>

        <main className="ah-shell">
          <section className="ah-hero">
            <div>
              <div className="ah-pill">Black premium dealer website</div>
              <h1 className="ah-title">
                Το δικό σου site για <span>μεταχειρισμένα αυτοκίνητα</span>, χωρίς να εξαρτάσαι μόνο από πλατφόρμες τρίτων.
              </h1>
              <p className="ah-subtitle">
                Premium εμφάνιση, αναζήτηση οχημάτων, σελίδα για κάθε αγγελία, γρήγορη επικοινωνία και δομή ώστε να ανεβάζεις εσύ φωτογραφίες, χαρακτηριστικά και τιμές.
              </p>

              <div className="ah-search-panel">
                <div className="ah-search-grid">
                  <div className="ah-input-wrap">
                    <Search size={16} />
                    <input className="ah-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Μάρκα ή μοντέλο" />
                  </div>
                  <select className="ah-select" value={fuel} onChange={(e) => setFuel(e.target.value)}>
                    <option value="all">Όλα τα καύσιμα</option>
                    <option value="βενζίνη">Βενζίνη</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="plug-in">Plug-in Hybrid</option>
                  </select>
                  <select className="ah-select" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                    <option value="all">Όλα τα κιβώτια</option>
                    <option value="αυτόματο">Αυτόματο</option>
                    <option value="χειροκίνητο">Χειροκίνητο</option>
                  </select>
                  <select className="ah-select" value={yearFrom} onChange={(e) => setYearFrom(e.target.value)}>
                    <option value="all">Από οποιοδήποτε έτος</option>
                    <option value="2024">Από 2024</option>
                    <option value="2023">Από 2023</option>
                    <option value="2022">Από 2022</option>
                    <option value="2021">Από 2021</option>
                    <option value="2020">Από 2020</option>
                  </select>
                  <button className="ah-btn ah-btn-primary" onClick={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })}>
                    Αναζήτηση
                  </button>
                </div>
                <div className="ah-action-row">
                  <button className="ah-btn ah-btn-primary">Δες απόθεμα</button>
                  <button className="ah-btn ah-btn-secondary">Σχεδίαση για κινητό & desktop</button>
                </div>
              </div>

              <div className="ah-stat-grid">
                {stats.map((item) => (
                  <StatCard key={item.label} value={item.value} label={item.label} />
                ))}
              </div>
            </div>

            <div className="ah-card ah-showcase">
              <img src={defaultImage} alt="Premium dealership" />
              <div className="ah-showcase-overlay" />
              <div className="ah-showcase-content">
                <div className="ah-inline" style={{ justifyContent: 'space-between' }}>
                  <span className="ah-badge ah-badge-light">Demo Homepage</span>
                  <span className="ah-badge">Black • Premium • Fast</span>
                </div>
                <div>
                  <div className="ah-inline ah-muted" style={{ marginBottom: 10 }}><Star size={16} /> Προβολή με έμφαση στο αυτοκίνητο</div>
                  <h2 style={{ fontSize: 34, lineHeight: 1.15, margin: 0 }}>Δυνατό πρώτο impression για πελάτες που ψάχνουν σοβαρό κατάστημα.</h2>
                  <p className="ah-subtitle" style={{ fontSize: 16, maxWidth: 520 }}>
                    Η αρχική σελίδα μπορεί να δείχνει προσφορές, νέα παραλαβή, χρηματοδότηση, trade-in και άμεση επικοινωνία.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="inventory" className="ah-section">
            <div className="ah-toolbar">
              <div>
                <div className="ah-section-kicker">Inventory</div>
                <h2 className="ah-section-title">Αγγελίες οχημάτων</h2>
                <p className="ah-section-text">Οι αγγελίες που περνάς στο panel πιο κάτω εμφανίζονται αυτόματα εδώ.</p>
              </div>
              <div className="ah-toolbar-grid">
                <div className="ah-input-wrap">
                  <Search size={16} />
                  <input className="ah-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Αναζήτηση π.χ. Mercedes, Peugeot..." />
                </div>
                <select className="ah-select" value={fuel} onChange={(e) => setFuel(e.target.value)}>
                  <option value="all">Όλα</option>
                  <option value="βενζίνη">Βενζίνη</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="plug-in">Plug-in Hybrid</option>
                </select>
                <select className="ah-select" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                  <option value="all">Όλα τα κιβώτια</option>
                  <option value="αυτόματο">Αυτόματο</option>
                  <option value="χειροκίνητο">Χειροκίνητο</option>
                </select>
                <select className="ah-select" value={yearFrom} onChange={(e) => setYearFrom(e.target.value)}>
                  <option value="all">Από οποιοδήποτε έτος</option>
                  <option value="2024">Από 2024</option>
                  <option value="2023">Από 2023</option>
                  <option value="2022">Από 2022</option>
                  <option value="2021">Από 2021</option>
                  <option value="2020">Από 2020</option>
                </select>
              </div>
            </div>

            {carsError ? <div className="ah-alert ah-alert-warning">{carsError}</div> : null}
            {isLoadingCars ? <div className="ah-alert ah-alert-muted">Γίνεται φόρτωση αγγελιών από τη βάση δεδομένων...</div> : null}
            {!isLoadingCars && cars.length === 0 ? (
              <div className="ah-alert ah-alert-muted">
                Δεν υπάρχει ακόμη ενεργό απόθεμα. Πρόσθεσε την πρώτη αγγελία από το panel διαχείρισης πιο κάτω.
              </div>
            ) : null}

            <div className="ah-inventory-grid">
              {filteredCars.map((car) => (
                <VehicleCard key={car.id} car={car} />
              ))}
            </div>
          </section>

          <section id="why" className="ah-section">
            <div style={{ maxWidth: 760, marginBottom: 24 }}>
              <div className="ah-section-kicker">Γιατί δικό σου site</div>
              <h2 className="ah-section-title">Να χτίζεις δικό σου brand, όχι μόνο ξένη πλατφόρμα</h2>
              <p className="ah-section-text">Το site λειτουργεί σαν η βιτρίνα της επιχείρησής σου: πιο premium εικόνα, καλύτερη εμπιστοσύνη και περισσότερα απευθείας τηλέφωνα.</p>
            </div>
            <div className="ah-benefit-grid">
              {benefits.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="ah-card ah-benefit-card">
                    <div className="ah-benefit-icon"><Icon size={24} /></div>
                    <h3 style={{ margin: '0 0 10px', fontSize: 22 }}>{item.title}</h3>
                    <p className="ah-section-text" style={{ margin: 0 }}>{item.text}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="ah-section">
            <div className="ah-card ah-split-card">
              <div>
                <div className="ah-section-kicker">Dealer CMS Demo</div>
                <h2 className="ah-section-title">Πρόσθεσε αγγελίες από εδώ</h2>
                <div className="ah-list">
                  <div>• Οι αγγελίες αποθηκεύονται online στη Supabase</div>
                  <div>• Μόλις πατήσεις προσθήκη, γράφονται στη βάση και εμφανίζονται στο απόθεμα</div>
                  <div>• Μπορείς να βάλεις τίτλο, τιμή, έτος, χιλιόμετρα, καύσιμο και φωτογραφία</div>
                  <div>• Αυτή είναι η βάση για κανονικό admin panel και σύνδεση με το domain</div>
                </div>

                <div className="ah-admin-list">
                  <div className="ah-inline" style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}><Database size={20} /> Ενεργές αγγελίες</div>
                  <div className="ah-stack">
                    {cars.map((car) => (
                      <div key={car.id} className="ah-admin-item">
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{car.title}</div>
                          <div className="ah-muted" style={{ marginTop: 4, fontSize: 14 }}>{car.price} • {car.year} • {car.km}</div>
                        </div>
                        <button className="ah-btn ah-btn-secondary" onClick={() => handleDeleteCar(car.id)}>
                          <Trash2 size={16} /> Διαγραφή
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ah-card ah-form-card">
                <div className="ah-inline" style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}><CarFront size={20} /> Νέα αγγελία</div>
                <div className="ah-form-grid">
                  <input className="ah-input" value={form.title} onChange={(e) => handleFormChange('title', e.target.value)} placeholder="Τίτλος αγγελίας" />
                  <div className="ah-form-two">
                    <input className="ah-input" value={form.price} onChange={(e) => handleFormChange('price', e.target.value)} placeholder="Τιμή π.χ. €18.900" />
                    <input className="ah-input" value={form.year} onChange={(e) => handleFormChange('year', e.target.value)} placeholder="Έτος π.χ. 2021" />
                  </div>
                  <div className="ah-form-two">
                    <input className="ah-input" value={form.km} onChange={(e) => handleFormChange('km', e.target.value)} placeholder="Χιλιόμετρα π.χ. 98.000 km" />
                    <div className="ah-file-wrap">
                      <label>Φωτογραφία αυτοκινήτου</label>
                      <input type="file" accept="image/*" onChange={(e) => handleFormChange('imageFile', e.target.files?.[0] || null)} />
                    </div>
                  </div>
                  <div className="ah-form-two">
                    <select className="ah-select" value={form.fuel} onChange={(e) => handleFormChange('fuel', e.target.value)}>
                      <option value="Βενζίνη">Βενζίνη</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                    </select>
                    <select className="ah-select" value={form.transmission} onChange={(e) => handleFormChange('transmission', e.target.value)}>
                      <option value="Αυτόματο">Αυτόματο</option>
                      <option value="Χειροκίνητο">Χειροκίνητο</option>
                    </select>
                  </div>
                  <label className="ah-checkbox">
                    <input type="checkbox" checked={form.featured} onChange={(e) => handleFormChange('featured', e.target.checked)} />
                    Προτεινόμενη αγγελία
                  </label>
                  <div className="ah-row ah-gap-sm">
                    <button className="ah-btn ah-btn-primary ah-btn-block" onClick={handleAddCar}><Plus size={16} /> Προσθήκη αγγελίας</button>
                    <button className="ah-btn ah-btn-secondary ah-btn-block" onClick={resetForm}>Καθαρισμός</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="ah-section">
            <div className="ah-card ah-location-grid">
              <div>
                <div className="ah-section-kicker">Τοποθεσία</div>
                <h2 className="ah-section-title">Βρες μας εύκολα</h2>
                <p className="ah-section-text">Η έκθεσή μας βρίσκεται σε κεντρικό σημείο στα Γιαννιτσά, με εύκολη πρόσβαση για επίσκεψη και επικοινωνία.</p>
                <div className="ah-stack" style={{ marginTop: 20 }}>
                  <div className="ah-inline"><MapPin size={18} /> Εγνατίας 3, Γιαννιτσά, 58100</div>
                  <div className="ah-contact-box">
                    <div className="ah-contact-kicker">Σταθερά τηλέφωνα</div>
                    <div className="ah-inline"><Phone size={18} /> 23820-27679 • 23820-81550</div>
                  </div>
                  <div className="ah-contact-box">
                    <div className="ah-contact-kicker">Κινητά τηλέφωνα</div>
                    <div className="ah-inline"><Phone size={18} /> 6977-412-558</div>
                  </div>
                  <div className="ah-inline"><Mail size={18} /> xgeorgatsis@gmail.com</div>
                  <div>
                    <a className="ah-btn ah-btn-primary" href="https://www.google.com/maps/search/?api=1&query=%CE%95%CE%B3%CE%BD%CE%B1%CF%84%CE%AF%CE%B1%CF%82+3%2C+%CE%93%CE%B9%CE%B1%CE%BD%CE%BD%CE%B9%CF%84%CF%83%CE%AC+58100" target="_blank" rel="noreferrer">Οδηγίες στο χάρτη</a>
                  </div>
                </div>
              </div>
              <div className="ah-map-panel">
                <div>
                  <div style={{ width: 64, height: 64, margin: '0 auto 16px', display: 'grid', placeItems: 'center', borderRadius: 999, background: '#f4f4f5', color: '#111827' }}><MapPin size={30} /></div>
                  <div className="ah-section-kicker">Σημείο επιχείρησης</div>
                  <div style={{ fontSize: 34, fontWeight: 800, marginTop: 10 }}>Εγνατίας 3</div>
                  <div className="ah-muted" style={{ marginTop: 8 }}>Γιαννιτσά, Τ.Κ. 58100</div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer id="contact" className="ah-footer">
          <div className="ah-shell ah-footer-grid">
            <div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>Auto-Hellas ΓΕΩΡΓΑΤΣΗΣ</div>
              <p className="ah-section-text" style={{ maxWidth: 360 }}>Σχεδιασμός για αντιπροσωπεία μεταχειρισμένων με premium εικόνα και εύκολη διαχείριση αγγελιών.</p>
            </div>
            <div className="ah-stack">
              <div className="ah-contact-box">
                <div className="ah-contact-kicker">Σταθερά</div>
                <div className="ah-stack">
                  <div className="ah-inline"><Phone size={16} /> 23820-27679</div>
                  <div className="ah-inline"><Phone size={16} /> 23820-81550</div>
                </div>
              </div>
              <div className="ah-contact-box">
                <div className="ah-contact-kicker">Κινητά</div>
                <div className="ah-stack">
                  <div className="ah-inline"><Phone size={16} /> 6977-937-444</div>
                  <div className="ah-inline"><Phone size={16} /> 6977-412-558</div>
                </div>
              </div>
              <div className="ah-inline"><Mail size={16} /> xgeorgatsis@gmail.com</div>
              <div className="ah-inline"><MapPin size={16} /> Γιαννιτσά</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button className="ah-btn ah-btn-primary">Ζητήστε επικοινωνία</button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
