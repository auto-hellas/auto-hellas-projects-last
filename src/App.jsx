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
  ChevronRight,
  CarFront,
  Camera,
  ShieldCheck,
  MessageCircle,
  Plus,
  Trash2,
  Database,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    text: 'Κουμπί για τηλέφωνο, Viber/WhatsApp, φόρμα επικοινωνίας και αίτημα για ανταλλαγή.',
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

function VehicleCard({ car }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-950 to-black shadow-2xl">
        <div className="relative h-56 overflow-hidden">
          <img src={car.image} alt={car.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute left-4 top-4 flex gap-2">
            {car.featured && (
              <Badge className="rounded-full border border-zinc-700 bg-zinc-100 text-black">
                Προτεινόμενο
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="rounded-full border border-zinc-700 bg-black/70 text-zinc-100"
            >
              {car.year}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <h3 className="max-w-[70%] text-lg font-semibold leading-tight text-white">
              {car.title}
            </h3>
            <div className="rounded-2xl border border-zinc-700 bg-zinc-100 px-3 py-2 text-sm font-bold text-black shadow-lg">
              {car.price}
            </div>
          </div>
        </div>
        <CardContent className="p-5">
          <div className="grid grid-cols-2 gap-3 text-sm text-zinc-300">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4" /> {car.km}
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4" /> {car.fuel}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> {car.year}
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" /> {car.transmission}
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <Button className="flex-1 rounded-2xl bg-zinc-100 text-black hover:bg-zinc-200">
              Προβολή αγγελίας
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-2xl border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-900"
            >
              Επικοινωνία
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
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
  image: '',
  imageFile: null,
  featured: true,
});

  useEffect(() => {
    let isMounted = true;

    const loadCars = async () => {
      if (!supabase) {
        if (isMounted) {
          setCars(fallbackInventory);
          setCarsError('Λείπουν τα Supabase environment variables. Εμφανίζεται προσωρινό demo απόθεμα.');
          setIsLoadingCars(false);
        }
        return;
      }

      setIsLoadingCars(true);
      setCarsError('');

      const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });

      if (!isMounted) return;

      if (error) {
        console.error('Supabase load failed', error);
        setCars(fallbackInventory);
        setCarsError('Δεν έγινε φόρτωση από τη βάση. Εμφανίζεται προσωρινό demo απόθεμα.');
      } else {
        setCars(Array.isArray(data) ? data : []);
      }

      setIsLoadingCars(false);
    };

    loadCars();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return cars.filter((car) => {
      const matchQuery = car.title.toLowerCase().includes(query.toLowerCase());
      const matchFuel = fuel === 'all' ? true : car.fuel.toLowerCase().includes(fuel.toLowerCase());
      const matchTransmission =
        transmission === 'all' ? true : car.transmission.toLowerCase().includes(transmission.toLowerCase());
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
    image: '',
    imageFile: null,
    featured: true,
  });
};

 const handleAddCar = async () => {
  if (!form.title || !form.price || !form.year) return;

  if (!supabase) {
    setCarsError('Δεν υπάρχει σύνδεση με Supabase ακόμη.');
    return;
  }

  setCarsError('');

  let imageUrl =
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80';

  if (form.imageFile) {
    const fileExt = form.imageFile.name.split('.').pop();
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
      console.error('Supabase upload failed', uploadError);
      setCarsError('Η φωτογραφία δεν ανέβηκε.');
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('car-images')
      .getPublicUrl(filePath);

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
    console.error('Supabase insert failed', error);
    setCarsError('Η αγγελία δεν αποθηκεύτηκε. Έλεγξε table / permissions / keys.');
    return;
  }

  setCars((prev) => [data, ...prev]);
  resetForm();
};

    setCarsError('');

    const payload = {
      title: form.title,
      price: form.price,
      year: Number(form.year),
      km: form.km || '—',
      fuel: form.fuel,
      transmission: form.transmission,
      image:
        form.image ||
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
      featured: form.featured,
    };

    const { data, error } = await supabase.from('cars').insert(payload).select().single();

    if (error) {
      console.error('Supabase insert failed', error);
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
      console.error('Supabase delete failed', error);
      setCars(previousCars);
      setCarsError('Η διαγραφή απέτυχε. Η αγγελία επανήλθε.');
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#050505_0%,#090909_45%,#030303_100%)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(180,180,180,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(120,120,120,0.08),transparent_22%)]" />

      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">Premium Used Cars</div>
            <div className="text-2xl font-bold tracking-[0.08em] text-zinc-100">
              Auto-Hellas <span className="text-zinc-400">ΓΕΩΡΓΑΤΣΗΣ</span>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
            <a href="#inventory" className="hover:text-white">
              Απόθεμα
            </a>
            <a href="#why" className="hover:text-white">
              Γιατί εμάς
            </a>
            <a href="#contact" className="hover:text-white">
              Επικοινωνία
            </a>
          </nav>
          <Button className="rounded-2xl bg-zinc-100 text-black hover:bg-zinc-200">Ζητήστε προσφορά</Button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-5 rounded-full border border-zinc-800 bg-zinc-950/90 px-4 py-1 text-zinc-300">
                Black premium dealer website
              </Badge>
              <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Το δικό σου site για <span className="text-zinc-200">μεταχειρισμένα αυτοκίνητα</span>, χωρίς να
                εξαρτάσαι μόνο από πλατφόρμες τρίτων.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
                Premium εμφάνιση, αναζήτηση οχημάτων, σελίδα για κάθε αγγελία, γρήγορη επικοινωνία και δομή ώστε να
                ανεβάζεις εσύ φωτογραφίες, χαρακτηριστικά και τιμές.
              </p>
            </motion.div>

            <div className="mt-8 rounded-[2rem] border border-zinc-800/80 bg-black/70 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Μάρκα ή μοντέλο"
                    className="h-12 rounded-2xl border-zinc-800 bg-zinc-950/90 pl-10 text-white placeholder:text-zinc-500"
                  />
                </div>
                <Select value={fuel} onValueChange={setFuel}>
                  <SelectTrigger className="h-12 rounded-2xl border-zinc-800 bg-zinc-950/90 text-white">
                    <SelectValue placeholder="Καύσιμο" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Όλα τα καύσιμα</SelectItem>
                    <SelectItem value="βενζίνη">Βενζίνη</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="plug-in">Plug-in Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={transmission} onValueChange={setTransmission}>
                  <SelectTrigger className="h-12 rounded-2xl border-zinc-800 bg-zinc-950/90 text-white">
                    <SelectValue placeholder="Κιβώτιο" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Όλα τα κιβώτια</SelectItem>
                    <SelectItem value="αυτόματο">Αυτόματο</SelectItem>
                    <SelectItem value="χειροκίνητο">Χειροκίνητο</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={yearFrom} onValueChange={setYearFrom}>
                  <SelectTrigger className="h-12 rounded-2xl border-zinc-800 bg-zinc-950/90 text-white">
                    <SelectValue placeholder="Από έτος" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Από οποιοδήποτε έτος</SelectItem>
                    <SelectItem value="2024">Από 2024</SelectItem>
                    <SelectItem value="2023">Από 2023</SelectItem>
                    <SelectItem value="2022">Από 2022</SelectItem>
                    <SelectItem value="2021">Από 2021</SelectItem>
                    <SelectItem value="2020">Από 2020</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="lg"
                  onClick={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-12 rounded-2xl bg-zinc-100 px-6 text-black hover:bg-zinc-200"
                >
                  Αναζήτηση
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <Button size="lg" className="rounded-2xl bg-zinc-100 px-6 text-black hover:bg-zinc-200">
                Δες απόθεμα <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl border-zinc-700 bg-transparent px-6 text-zinc-100 hover:bg-zinc-900"
              >
                Σχεδίαση για κινητό & desktop
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((item) => (
                <Card
                  key={item.label}
                  className="overflow-hidden rounded-3xl border border-zinc-700/80 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black shadow-[0_12px_35px_rgba(0,0,0,0.35)]"
                >
                  <CardContent className="flex h-[148px] flex-col items-center justify-center px-4 py-5 text-center">
                    <div className="mb-3 h-px w-16 bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
                    <div
                      className={`max-w-full font-extrabold leading-tight tracking-tight text-zinc-50 ${
                        item.value.length > 14 ? 'text-base sm:text-lg lg:text-xl' : 'text-lg sm:text-xl lg:text-2xl'
                      }`}
                    >
                      {item.value}
                    </div>
                    <div className="mt-3 max-w-full text-sm font-medium leading-snug text-zinc-200">{item.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }}>
            <Card className="overflow-hidden rounded-[2rem] border border-zinc-800/80 bg-zinc-950/80 shadow-2xl backdrop-blur-xl">
              <div className="relative h-full min-h-[420px]">
                <img
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80"
                  alt="Premium dealership"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
                <div className="relative flex h-full flex-col justify-between p-6">
                  <div className="flex items-start justify-between">
                    <Badge className="rounded-full border border-zinc-700 bg-zinc-100 text-black">Demo Homepage</Badge>
                    <div className="rounded-2xl border border-zinc-800 bg-black/60 px-4 py-2 text-sm text-zinc-300">
                      Black • Premium • Fast
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-zinc-300">
                      <Star className="h-4 w-4" /> Προβολή με έμφαση στο αυτοκίνητο
                    </div>
                    <h2 className="text-3xl font-bold leading-tight">
                      Δυνατό πρώτο impression για πελάτες που ψάχνουν σοβαρό κατάστημα.
                    </h2>
                    <p className="mt-4 max-w-lg text-zinc-300">
                      Η αρχική σελίδα μπορεί να δείχνει προσφορές, νέα παραλαβή, χρηματοδότηση, trade-in και άμεση
                      επικοινωνία.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section id="inventory" className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.25em] text-zinc-500">Inventory</div>
            <h2 className="mt-2 text-3xl font-bold">Αγγελίες οχημάτων</h2>
            <p className="mt-2 text-zinc-400">Ξεκινάμε από λευκή σελίδα. Οι αγγελίες που περνάς στο panel πιο κάτω εμφανίζονται αυτόματα εδώ.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 lg:w-full lg:max-w-[860px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Αναζήτηση π.χ. Mercedes, Peugeot..."
                className="rounded-2xl border-zinc-800 bg-zinc-950/80 pl-10 text-white placeholder:text-zinc-500"
              />
            </div>
            <Select value={fuel} onValueChange={setFuel}>
              <SelectTrigger className="rounded-2xl border-zinc-800 bg-zinc-950/80 text-white">
                <SelectValue placeholder="Καύσιμο" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλα</SelectItem>
                <SelectItem value="βενζίνη">Βενζίνη</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="plug-in">Plug-in Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={transmission} onValueChange={setTransmission}>
              <SelectTrigger className="rounded-2xl border-zinc-800 bg-zinc-950/80 text-white">
                <SelectValue placeholder="Κιβώτιο" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλα τα κιβώτια</SelectItem>
                <SelectItem value="αυτόματο">Αυτόματο</SelectItem>
                <SelectItem value="χειροκίνητο">Χειροκίνητο</SelectItem>
              </SelectContent>
            </Select>
            <Select value={yearFrom} onValueChange={setYearFrom}>
              <SelectTrigger className="rounded-2xl border-zinc-800 bg-zinc-950/80 text-white">
                <SelectValue placeholder="Από έτος" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Από οποιοδήποτε έτος</SelectItem>
                <SelectItem value="2024">Από 2024</SelectItem>
                <SelectItem value="2023">Από 2023</SelectItem>
                <SelectItem value="2022">Από 2022</SelectItem>
                <SelectItem value="2021">Από 2021</SelectItem>
                <SelectItem value="2020">Από 2020</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {carsError && (
          <div className="mb-6 rounded-[2rem] border border-amber-700/40 bg-amber-950/30 p-5 text-amber-100">
            {carsError}
          </div>
        )}

        {isLoadingCars && (
          <div className="mb-6 rounded-[2rem] border border-zinc-700 bg-zinc-950/80 p-5 text-zinc-300">
            Γίνεται φόρτωση αγγελιών από τη βάση δεδομένων...
          </div>
        )}

        {!isLoadingCars && cars.length === 0 && (
          <div className="mb-6 rounded-[2rem] border border-dashed border-zinc-700 bg-zinc-950/80 p-5 text-zinc-300">
            Δεν υπάρχει ακόμη ενεργό απόθεμα. Πρόσθεσε την πρώτη αγγελία από το panel διαχείρισης πιο κάτω.
            <div className="mt-2 text-sm text-zinc-500">
              Η αναζήτηση στην αρχική σελίδα είναι ήδη συνδεδεμένη με τα φίλτρα του αποθέματος.
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((car) => (
            <VehicleCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      <section id="why" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <div className="text-sm uppercase tracking-[0.25em] text-zinc-500">Γιατί δικό σου site</div>
          <h2 className="mt-2 text-3xl font-bold">Να χτίζεις δικό σου brand, όχι μόνο ξένη πλατφόρμα</h2>
          <p className="mt-3 text-zinc-400">
            Το site λειτουργεί σαν η βιτρίνα της επιχείρησής σου: πιο premium εικόνα, καλύτερη εμπιστοσύνη, περισσότερα
            απευθείας τηλέφωνα και δυνατότητα να βγάζεις lead χωρίς να εξαρτάσαι αποκλειστικά από marketplace.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="rounded-[2rem] border border-zinc-800/80 bg-zinc-950/80">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-2xl border border-zinc-800 bg-black p-3">
                    <Icon className="h-6 w-6 text-zinc-200" />
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-zinc-400">{item.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <Card className="overflow-hidden rounded-[2rem] border border-zinc-800/80 bg-gradient-to-br from-zinc-950 via-black to-zinc-950">
          <CardContent className="grid gap-8 p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
            <div>
              <div className="text-sm uppercase tracking-[0.25em] text-zinc-400">Dealer CMS Demo</div>
              <h2 className="mt-2 text-3xl font-bold">Πρόσθεσε αγγελίες από εδώ</h2>
              <div className="mt-5 space-y-3 text-zinc-300">
                <div>• Οι αγγελίες αποθηκεύονται πλέον online στη Supabase</div>
                <div>• Μόλις πατήσεις προσθήκη, γράφονται στη βάση και εμφανίζονται στο απόθεμα</div>
                <div>• Μπορείς να βάλεις τίτλο, τιμή, έτος, χιλιόμετρα, καύσιμο και φωτογραφία</div>
                <div>• Αυτό είναι η βάση για κανονικό admin panel και σύνδεση με το domain</div>
              </div>

              <div className="mt-8 rounded-[2rem] border border-zinc-800 bg-black/60 p-5">
                <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Database className="h-5 w-5" /> Ενεργές αγγελίες
                </div>
                <div className="space-y-3">
                  {cars.map((car) => (
                    <div
                      key={car.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium text-zinc-100">{car.title}</div>
                        <div className="mt-1 text-sm text-zinc-500">
                          {car.price} • {car.year} • {car.km}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteCar(car.id)}
                        className="shrink-0 rounded-xl border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-900"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Διαγραφή
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-zinc-800 bg-black/60 p-6">
              <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <CarFront className="h-5 w-5" /> Νέα αγγελία
              </div>
              <div className="grid gap-3 text-sm text-zinc-300">
                <Input
                  value={form.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="Τίτλος αγγελίας"
                  className="rounded-2xl border-zinc-800 bg-zinc-950/80 text-white placeholder:text-zinc-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={form.price}
                    onChange={(e) => handleFormChange('price', e.target.value)}
                    placeholder="Τιμή π.χ. €18.900"
                    className="rounded-2xl border-zinc-800 bg-zinc-950/80 text-white placeholder:text-zinc-500"
                  />
                  <Input
                    value={form.year}
                    onChange={(e) => handleFormChange('year', e.target.value)}
                    placeholder="Έτος π.χ. 2021"
                    className="rounded-2xl border-zinc-800 bg-zinc-950/80 text-white placeholder:text-zinc-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={form.km}
                    onChange={(e) => handleFormChange('km', e.target.value)}
                    placeholder="Χιλιόμετρα π.χ. 98.000 km"
                    className="rounded-2xl border-zinc-800 bg-zinc-950/80 text-white placeholder:text-zinc-500"
                  />
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-3">
  <label className="mb-2 block text-sm text-zinc-400">Φωτογραφία αυτοκινήτου</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => handleFormChange('imageFile', e.target.files?.[0] || null)}
    className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-zinc-200"
  />
</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Select value={form.fuel} onValueChange={(value) => handleFormChange('fuel', value)}>
                    <SelectTrigger className="rounded-2xl border-zinc-800 bg-zinc-950/80 text-white">
                      <SelectValue placeholder="Καύσιμο" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Βενζίνη">Βενζίνη</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={form.transmission} onValueChange={(value) => handleFormChange('transmission', value)}>
                    <SelectTrigger className="rounded-2xl border-zinc-800 bg-zinc-950/80 text-white">
                      <SelectValue placeholder="Κιβώτιο" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Αυτόματο">Αυτόματο</SelectItem>
                      <SelectItem value="Χειροκίνητο">Χειροκίνητο</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-zinc-200">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => handleFormChange('featured', e.target.checked)}
                    className="h-4 w-4"
                  />
                  Προτεινόμενη αγγελία
                </label>
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleAddCar} className="flex-1 rounded-2xl bg-zinc-100 text-black hover:bg-zinc-200">
                    <Plus className="mr-2 h-4 w-4" /> Προσθήκη αγγελίας
                  </Button>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1 rounded-2xl border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-900"
                  >
                    Καθαρισμός
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <Card className="overflow-hidden rounded-[2rem] border border-zinc-800/80 bg-gradient-to-br from-zinc-950 via-black to-zinc-950">
          <CardContent className="grid gap-8 p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
            <div className="flex flex-col justify-center">
              <div className="text-sm uppercase tracking-[0.25em] text-zinc-500">Τοποθεσία</div>
              <h2 className="mt-2 text-3xl font-bold">Βρες μας εύκολα</h2>
              <p className="mt-4 text-zinc-300">
                Η έκθεσή μας βρίσκεται σε κεντρικό σημείο στα Γιαννιτσά, με εύκολη πρόσβαση για επίσκεψη και επικοινωνία.
              </p>
              <div className="mt-6 space-y-5 text-zinc-300">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-zinc-200" /> <span>Εγνατίας 3, Γιαννιτσά, 58100</span>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.22em] text-zinc-500">Σταθερά τηλέφωνα</div>
                  <div className="flex items-center gap-3 text-zinc-100">
                    <Phone className="h-5 w-5 text-zinc-200" /> <span>23820-27679 • 23820-81550</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.22em] text-zinc-500">Κινητά τηλέφωνα</div>
                  <div className="flex items-center gap-3 text-zinc-100">
                    <Phone className="h-5 w-5 text-zinc-200" /> <span>6977-412-558</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-zinc-200" /> <span>xgeorgatsis@gmail.com</span>
                </div>
              </div>
              <div className="mt-6">
                <Button asChild size="lg" className="rounded-2xl bg-zinc-100 text-black hover:bg-zinc-200">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=%CE%95%CE%B3%CE%BD%CE%B1%CF%84%CE%AF%CE%B1%CF%82+3%2C+%CE%93%CE%B9%CE%B1%CE%BD%CE%BD%CE%B9%CF%84%CF%83%CE%AC+58100"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Οδηγίες στο χάρτη
                  </a>
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-[1.5rem] border border-zinc-800 bg-black/60">
              <div className="relative flex h-[360px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.07),transparent_20%),linear-gradient(135deg,#0a0a0a_0%,#111111_50%,#0a0a0a_100%)]">
                <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
                <div className="absolute left-[18%] top-[28%] h-24 w-24 rounded-full bg-zinc-200/5 blur-3xl" />
                <div className="absolute right-[20%] bottom-[18%] h-28 w-28 rounded-full bg-zinc-200/5 blur-3xl" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-zinc-700 bg-zinc-100 text-black shadow-2xl">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Σημείο επιχείρησης</div>
                  <div className="mt-3 text-2xl font-bold text-zinc-100">Εγνατίας 3</div>
                  <div className="mt-2 text-zinc-300">Γιαννιτσά, Τ.Κ. 58100</div>
                  <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/90 px-4 py-3 text-sm text-zinc-400">
                    Interactive χάρτης ανοίγει με το κουμπί “Οδηγίες στο χάρτη” χωρίς να διακόπτεται η προεπισκόπηση.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer id="contact" className="border-t border-zinc-800/80 bg-black/80">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3 lg:px-8">
          <div>
            <div className="text-xl font-bold">Auto-Hellas ΓΕΩΡΓΑΤΣΗΣ</div>
            <p className="mt-3 max-w-sm text-zinc-400">
              Σχεδιασμός για αντιπροσωπεία μεταχειρισμένων με premium εικόνα και εύκολη διαχείριση αγγελιών.
            </p>
          </div>
          <div className="space-y-4 text-zinc-300">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-zinc-500">Σταθερά</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4" /> 23820-27679
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4" /> 23820-81550
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-zinc-500">Κινητά</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4" /> 6977-937-444
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4" /> 6977-412-558
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4" /> xgeorgatsis@gmail.com
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4" /> Γιαννιτσά
            </div>
          </div>
          <div className="flex items-center md:justify-end">
            <Button size="lg" className="rounded-2xl bg-zinc-100 text-black hover:bg-zinc-200">
              Ζητήστε επικοινωνία
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
