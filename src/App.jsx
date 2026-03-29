import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
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
  ChevronRight,
  CarFront,
  Camera,
  ShieldCheck,
  MessageCircle,
  Plus,
  Trash2,
  Database,
} from 'lucide-react'

const starterInventory = [
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
]

const stats = [
  { label: 'Επιλεγμένα αυτοκίνητα', value: '100%' },
  { label: 'Χρηματοδότηση', value: 'Διαθέσιμη' },
  { label: 'Trade-in', value: 'Άμεση εκτίμηση' },
  { label: 'Υποστήριξη', value: 'Άμεση επικοινωνία' },
]

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Ελεγμένα οχήματα',
    text: 'Καθαρή, premium παρουσίαση με έμφαση στην αξιοπιστία και στη σωστή πληροφόρηση.',
  },
  {
    icon: Camera,
    title: 'Πολλές φωτογραφίες',
    text: 'Κάθε αγγελία μπορεί να έχει gallery, βασικά χαρακτηριστικά και ξεκάθαρη φόρμα ενδιαφέροντος.',
  },
  {
    icon: MessageCircle,
    title: 'Άμεσο lead',
    text: 'Κουμπί για τηλέφωνο, email και φόρμα επικοινωνίας για γρήγορο ενδιαφέρον.',
  },
]

function Button({ children, href, onClick, variant = 'solid', type = 'button' }) {
  const className = variant === 'outline' ? 'btn btn-outline' : 'btn btn-solid'

  if (href) {
    return (
      <a className={className} href={href} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <button className={className} type={type} onClick={onClick}>
      {children}
    </button>
  )
}

function Card({ children, className = '' }) {
  return <div className={`card ${className}`.trim()}>{children}</div>
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
    </label>
  )
}

function VehicleCard({ car }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
      <Card className="vehicle-card">
        <div className="vehicle-image-wrap">
          <img src={car.image} alt={car.title} className="vehicle-image" />
          <div className="vehicle-overlay" />
          <div className="vehicle-badges">
            {car.featured && <span className="badge badge-light">Προτεινόμενο</span>}
            <span className="badge badge-dark">{car.year}</span>
          </div>
          <div className="vehicle-title-row">
            <h3>{car.title}</h3>
            <div className="price-pill">{car.price}</div>
          </div>
        </div>
        <div className="vehicle-content">
          <div className="spec-grid">
            <div><Gauge size={16} /> {car.km}</div>
            <div><Fuel size={16} /> {car.fuel}</div>
            <div><Calendar size={16} /> {car.year}</div>
            <div><SlidersHorizontal size={16} /> {car.transmission}</div>
          </div>
          <div className="button-row">
            <Button>Προβολή αγγελίας</Button>
            <Button variant="outline">Επικοινωνία</Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default function App() {
  const [query, setQuery] = useState('')
  const [fuel, setFuel] = useState('all')
  const [transmission, setTransmission] = useState('all')
  const [yearFrom, setYearFrom] = useState('all')
  const [cars, setCars] = useState(starterInventory)
  const [form, setForm] = useState({
    title: '',
    price: '',
    year: '',
    km: '',
    fuel: 'Βενζίνη',
    transmission: 'Αυτόματο',
    image: '',
    featured: true,
  })

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('auto-hellas-inventory-v1')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length) {
          setCars(parsed)
        }
      }
    } catch (error) {
      console.error('Local inventory load failed', error)
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('auto-hellas-inventory-v1', JSON.stringify(cars))
    } catch (error) {
      console.error('Local inventory save failed', error)
    }
  }, [cars])

  const filtered = useMemo(() => {
    return cars.filter((car) => {
      const matchQuery = car.title.toLowerCase().includes(query.toLowerCase())
      const matchFuel = fuel === 'all' ? true : car.fuel.toLowerCase().includes(fuel.toLowerCase())
      const matchTransmission = transmission === 'all' ? true : car.transmission.toLowerCase().includes(transmission.toLowerCase())
      const matchYearFrom = yearFrom === 'all' ? true : Number(car.year) >= Number(yearFrom)
      return matchQuery && matchFuel && matchTransmission && matchYearFrom
    })
  }, [cars, query, fuel, transmission, yearFrom])

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setForm({
      title: '',
      price: '',
      year: '',
      km: '',
      fuel: 'Βενζίνη',
      transmission: 'Αυτόματο',
      image: '',
      featured: true,
    })
  }

  const handleAddCar = () => {
    if (!form.title || !form.price || !form.year) return

    const nextCar = {
      id: Date.now(),
      title: form.title,
      price: form.price,
      year: Number(form.year),
      km: form.km || '—',
      fuel: form.fuel,
      transmission: form.transmission,
      image: form.image || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
      featured: form.featured,
    }

    setCars((prev) => [nextCar, ...prev])
    resetForm()
  }

  const handleDeleteCar = (id) => {
    setCars((prev) => prev.filter((car) => car.id !== id))
  }

  return (
    <div className="page-shell">
      <div className="page-glow" />

      <header className="site-header">
        <div className="container header-inner">
          <div>
            <div className="eyebrow">Premium Used Cars</div>
            <div className="brand-title">Auto-Hellas <span>ΓΕΩΡΓΑΤΣΗΣ</span></div>
          </div>
          <nav className="desktop-nav">
            <a href="#inventory">Απόθεμα</a>
            <a href="#why">Γιατί εμάς</a>
            <a href="#contact">Επικοινωνία</a>
          </nav>
          <Button>Ζητήστε προσφορά</Button>
        </div>
      </header>

      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="hero-pill">Black premium dealer website</div>
              <h1>
                Το δικό σου site για <span>μεταχειρισμένα αυτοκίνητα</span>, χωρίς να εξαρτάσαι μόνο από πλατφόρμες τρίτων.
              </h1>
              <p className="hero-copy">
                Premium εμφάνιση, αναζήτηση οχημάτων, σελίδα για κάθε αγγελία, γρήγορη επικοινωνία και δομή ώστε να ανεβάζεις εσύ φωτογραφίες, χαρακτηριστικά και τιμές.
              </p>
            </motion.div>

            <Card className="search-panel">
              <div className="search-grid">
                <div className="input-icon-wrap">
                  <Search className="input-icon" size={16} />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Μάρκα ή μοντέλο" />
                </div>
                <select value={fuel} onChange={(e) => setFuel(e.target.value)}>
                  <option value="all">Όλα τα καύσιμα</option>
                  <option value="βενζίνη">Βενζίνη</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="plug-in">Plug-in Hybrid</option>
                </select>
                <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                  <option value="all">Όλα τα κιβώτια</option>
                  <option value="αυτόματο">Αυτόματο</option>
                  <option value="χειροκίνητο">Χειροκίνητο</option>
                </select>
                <select value={yearFrom} onChange={(e) => setYearFrom(e.target.value)}>
                  <option value="all">Από οποιοδήποτε έτος</option>
                  <option value="2024">Από 2024</option>
                  <option value="2023">Από 2023</option>
                  <option value="2022">Από 2022</option>
                  <option value="2021">Από 2021</option>
                  <option value="2020">Από 2020</option>
                </select>
                <Button onClick={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })}>
                  Αναζήτηση
                </Button>
              </div>
            </Card>

            <div className="hero-actions">
              <Button href="#inventory">Δες απόθεμα <ChevronRight size={16} /></Button>
              <Button href="#cms" variant="outline">Panel αγγελιών</Button>
            </div>

            <div className="stats-grid">
              {stats.map((item) => (
                <Card key={item.label} className="stat-card">
                  <div className="stat-line" />
                  <div className={`stat-value ${item.value.length > 14 ? 'stat-value-small' : ''}`}>{item.value}</div>
                  <div className="stat-label">{item.label}</div>
                </Card>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }}>
            <Card className="hero-card">
              <div className="hero-image-card">
                <img
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80"
                  alt="Premium dealership"
                />
                <div className="hero-image-overlay" />
                <div className="hero-image-content">
                  <div className="hero-image-top">
                    <span className="badge badge-light">Demo Homepage</span>
                    <div className="mini-chip">Black • Premium • Fast</div>
                  </div>
                  <div>
                    <div className="hero-image-note"><Star size={16} /> Προβολή με έμφαση στο αυτοκίνητο</div>
                    <h2>Δυνατό πρώτο impression για πελάτες που ψάχνουν σοβαρό κατάστημα.</h2>
                    <p>Η αρχική σελίδα μπορεί να δείχνει προσφορές, νέα παραλαβή, χρηματοδότηση, trade-in και άμεση επικοινωνία.</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section id="inventory" className="section-gap">
        <div className="container">
          <div className="section-head inventory-head">
            <div>
              <div className="section-eyebrow">Inventory</div>
              <h2>Αγγελίες οχημάτων</h2>
              <p>Ξεκινάμε από λευκή σελίδα. Οι αγγελίες που περνάς στο panel πιο κάτω εμφανίζονται αυτόματα εδώ.</p>
            </div>
            <div className="inventory-filter-grid">
              <div className="input-icon-wrap">
                <Search className="input-icon" size={16} />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Αναζήτηση π.χ. Mercedes, Peugeot..." />
              </div>
              <select value={fuel} onChange={(e) => setFuel(e.target.value)}>
                <option value="all">Όλα</option>
                <option value="βενζίνη">Βενζίνη</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="plug-in">Plug-in Hybrid</option>
              </select>
              <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                <option value="all">Όλα τα κιβώτια</option>
                <option value="αυτόματο">Αυτόματο</option>
                <option value="χειροκίνητο">Χειροκίνητο</option>
              </select>
              <select value={yearFrom} onChange={(e) => setYearFrom(e.target.value)}>
                <option value="all">Από οποιοδήποτε έτος</option>
                <option value="2024">Από 2024</option>
                <option value="2023">Από 2023</option>
                <option value="2022">Από 2022</option>
                <option value="2021">Από 2021</option>
                <option value="2020">Από 2020</option>
              </select>
            </div>
          </div>

          {cars.length === 0 && (
            <Card className="empty-state">
              Δεν υπάρχει ακόμη ενεργό απόθεμα. Πρόσθεσε την πρώτη αγγελία από το panel διαχείρισης πιο κάτω.
              <div className="empty-note">Η αναζήτηση στην αρχική σελίδα είναι ήδη συνδεδεμένη με τα φίλτρα του αποθέματος.</div>
            </Card>
          )}

          <div className="inventory-grid">
            {filtered.map((car) => (
              <VehicleCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="section-gap">
        <div className="container">
          <div className="section-head narrow">
            <div className="section-eyebrow">Γιατί δικό σου site</div>
            <h2>Να χτίζεις δικό σου brand, όχι μόνο ξένη πλατφόρμα</h2>
            <p>Το site λειτουργεί σαν η βιτρίνα της επιχείρησής σου: πιο premium εικόνα, καλύτερη εμπιστοσύνη και περισσότερα απευθείας τηλέφωνα.</p>
          </div>
          <div className="benefits-grid">
            {benefits.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title} className="benefit-card">
                  <div className="benefit-icon"><Icon size={24} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section id="cms" className="section-gap">
        <div className="container">
          <Card className="cms-shell">
            <div>
              <div className="section-eyebrow">Dealer CMS Demo</div>
              <h2>Πρόσθεσε αγγελίες από εδώ</h2>
              <div className="cms-points">
                <div>• Οι αγγελίες αποθηκεύονται προσωρινά στο browser σου με local storage.</div>
                <div>• Μόλις πατήσεις προσθήκη, εμφανίζονται κατευθείαν στο απόθεμα επάνω.</div>
                <div>• Μπορείς να βάλεις τίτλο, τιμή, έτος, χιλιόμετρα, καύσιμο και φωτογραφία.</div>
                <div>• Αυτό είναι η βάση πριν το συνδέσουμε με κανονικό backend και domain.</div>
              </div>

              <Card className="active-list-card">
                <div className="list-title"><Database size={18} /> Ενεργές αγγελίες στο demo</div>
                <div className="active-list">
                  {cars.map((car) => (
                    <div key={car.id} className="active-item">
                      <div className="active-item-text">
                        <div className="active-item-title">{car.title}</div>
                        <div className="active-item-sub">{car.price} • {car.year} • {car.km}</div>
                      </div>
                      <Button variant="outline" onClick={() => handleDeleteCar(car.id)}>
                        <Trash2 size={16} /> Διαγραφή
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="form-card">
              <div className="list-title"><CarFront size={18} /> Νέα αγγελία</div>
              <div className="form-grid">
                <Field label="Τίτλος αγγελίας">
                  <input value={form.title} onChange={(e) => handleFormChange('title', e.target.value)} placeholder="π.χ. Mercedes-Benz CLA 250e AMG" />
                </Field>
                <div className="two-col">
                  <Field label="Τιμή">
                    <input value={form.price} onChange={(e) => handleFormChange('price', e.target.value)} placeholder="π.χ. €18.900" />
                  </Field>
                  <Field label="Έτος">
                    <input value={form.year} onChange={(e) => handleFormChange('year', e.target.value)} placeholder="π.χ. 2021" />
                  </Field>
                </div>
                <div className="two-col">
                  <Field label="Χιλιόμετρα">
                    <input value={form.km} onChange={(e) => handleFormChange('km', e.target.value)} placeholder="π.χ. 98.000 km" />
                  </Field>
                  <Field label="Link φωτογραφίας">
                    <input value={form.image} onChange={(e) => handleFormChange('image', e.target.value)} placeholder="https://..." />
                  </Field>
                </div>
                <div className="two-col">
                  <Field label="Καύσιμο">
                    <select value={form.fuel} onChange={(e) => handleFormChange('fuel', e.target.value)}>
                      <option>Βενζίνη</option>
                      <option>Diesel</option>
                      <option>Hybrid</option>
                      <option>Plug-in Hybrid</option>
                    </select>
                  </Field>
                  <Field label="Κιβώτιο">
                    <select value={form.transmission} onChange={(e) => handleFormChange('transmission', e.target.value)}>
                      <option>Αυτόματο</option>
                      <option>Χειροκίνητο</option>
                    </select>
                  </Field>
                </div>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => handleFormChange('featured', e.target.checked)}
                  />
                  Προτεινόμενη αγγελία
                </label>
                <div className="button-row">
                  <Button onClick={handleAddCar}><Plus size={16} /> Προσθήκη αγγελίας</Button>
                  <Button variant="outline" onClick={resetForm}>Καθαρισμός</Button>
                </div>
              </div>
            </Card>
          </Card>
        </div>
      </section>

      <section className="section-gap">
        <div className="container">
          <Card className="location-shell">
            <div>
              <div className="section-eyebrow">Τοποθεσία</div>
              <h2>Βρες μας εύκολα</h2>
              <p>Η έκθεσή μας βρίσκεται σε κεντρικό σημείο στα Γιαννιτσά, με εύκολη πρόσβαση για επίσκεψη και επικοινωνία.</p>
              <div className="location-stack">
                <div className="icon-line"><MapPin size={18} /> <span>Εγνατίας 3, Γιαννιτσά, 58100</span></div>

                <Card className="contact-box">
                  <div className="mini-eyebrow">Σταθερά τηλέφωνα</div>
                  <div className="icon-line"><Phone size={18} /> <span>23820-27679 • 23820-81550</span></div>
                </Card>

                <Card className="contact-box">
                  <div className="mini-eyebrow">Κινητά τηλέφωνα</div>
                  <div className="icon-line"><Phone size={18} /> <span>6977-937-444 • 6977-412-558</span></div>
                </Card>

                <div className="icon-line"><Mail size={18} /> <span>xgeorgatsis@gmail.com</span></div>
              </div>
              <div className="location-action">
                <Button href="https://www.google.com/maps/search/?api=1&query=%CE%95%CE%B3%CE%BD%CE%B1%CF%84%CE%AF%CE%B1%CF%82+3%2C+%CE%93%CE%B9%CE%B1%CE%BD%CE%BD%CE%B9%CF%84%CF%83%CE%AC+58100">
                  Οδηγίες στο χάρτη
                </Button>
              </div>
            </div>
            <Card className="map-preview-card">
              <div className="map-preview-inner">
                <div className="map-dot"><MapPin size={30} /></div>
                <div className="mini-eyebrow">Σημείο επιχείρησης</div>
                <div className="map-address-title">Εγνατίας 3</div>
                <div className="map-address-sub">Γιαννιτσά, Τ.Κ. 58100</div>
                <div className="map-note">Interactive χάρτης ανοίγει με το κουμπί “Οδηγίες στο χάρτη”.</div>
              </div>
            </Card>
          </Card>
        </div>
      </section>

      <footer id="contact" className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="footer-brand">Auto-Hellas ΓΕΩΡΓΑΤΣΗΣ</div>
            <p>Σχεδιασμός για αντιπροσωπεία μεταχειρισμένων με premium εικόνα και εύκολη διαχείριση αγγελιών.</p>
          </div>
          <div className="footer-contact-stack">
            <Card className="contact-box">
              <div className="mini-eyebrow">Σταθερά</div>
              <div className="contact-list">
                <div className="icon-line"><Phone size={16} /> <span>23820-27679</span></div>
                <div className="icon-line"><Phone size={16} /> <span>23820-81550</span></div>
              </div>
            </Card>
            <Card className="contact-box">
              <div className="mini-eyebrow">Κινητά</div>
              <div className="contact-list">
                <div className="icon-line"><Phone size={16} /> <span>6977-937-444</span></div>
                <div className="icon-line"><Phone size={16} /> <span>6977-412-558</span></div>
              </div>
            </Card>
            <div className="icon-line"><Mail size={16} /> <span>xgeorgatsis@gmail.com</span></div>
            <div className="icon-line"><MapPin size={16} /> <span>Γιαννιτσά</span></div>
          </div>
          <div className="footer-cta-wrap">
            <Button>Ζητήστε επικοινωνία</Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
