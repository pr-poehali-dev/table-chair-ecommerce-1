import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/be1b219e-f7ec-4829-9956-6c1dc29e759f/files/026eaf12-9b9e-4d8b-8781-940341758630.jpg";
const DESK_IMG = "https://cdn.poehali.dev/projects/be1b219e-f7ec-4829-9956-6c1dc29e759f/files/9521eb3a-d91f-439c-869e-43ea6fe97b29.jpg";
const CHAIR_IMG = "https://cdn.poehali.dev/projects/be1b219e-f7ec-4829-9956-6c1dc29e759f/files/4e1ee7f5-1321-4b5f-b8b9-80868fdd8a1a.jpg";
const TABLE_SET_IMG = "https://cdn.poehali.dev/projects/be1b219e-f7ec-4829-9956-6c1dc29e759f/files/606016e5-59ef-4be6-9c4c-20c8b993d56d.jpg";

const NAV_LINKS = [
  { label: "Главная", id: "hero" },
  { label: "Каталог", id: "catalog" },
  { label: "О компании", id: "about" },
  { label: "Контакты", id: "contacts" },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Стол Директор Pro",
    category: "Столы",
    material: "Дуб",
    style: "Классика",
    price: 89000,
    image: DESK_IMG,
    tag: "Хит продаж",
  },
  {
    id: 2,
    name: "Кресло Престиж",
    category: "Стулья",
    material: "Кожа",
    style: "Классика",
    price: 47500,
    image: CHAIR_IMG,
    tag: "Новинка",
  },
  {
    id: 3,
    name: "Обеденная группа Nord",
    category: "Столы",
    material: "Массив",
    style: "Скандинавский",
    price: 134000,
    image: TABLE_SET_IMG,
    tag: null,
  },
  {
    id: 4,
    name: "Стол переговорный Elite",
    category: "Столы",
    material: "Дуб",
    style: "Современный",
    price: 215000,
    image: DESK_IMG,
    tag: "Премиум",
  },
  {
    id: 5,
    name: "Стул Мадрид",
    category: "Стулья",
    material: "Ткань",
    style: "Современный",
    price: 18900,
    image: CHAIR_IMG,
    tag: null,
  },
  {
    id: 6,
    name: "Стол рабочий Artisan",
    category: "Столы",
    material: "Массив",
    style: "Скандинавский",
    price: 62000,
    image: TABLE_SET_IMG,
    tag: null,
  },
];

const CATEGORIES = ["Все", "Столы", "Стулья"];
const MATERIALS = ["Все", "Дуб", "Массив", "Кожа", "Ткань"];
const STYLES = ["Все", "Классика", "Современный", "Скандинавский"];
const PRICE_RANGES = [
  { label: "Все цены", min: 0, max: Infinity },
  { label: "До 50 000 ₽", min: 0, max: 50000 },
  { label: "50 000 — 100 000 ₽", min: 50000, max: 100000 },
  { label: "100 000 — 200 000 ₽", min: 100000, max: 200000 },
  { label: "От 200 000 ₽", min: 200000, max: Infinity },
];

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export default function Index() {
  const [activeNav, setActiveNav] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [category, setCategory] = useState("Все");
  const [material, setMaterial] = useState("Все");
  const [style, setStyle] = useState("Все");
  const [priceIdx, setPriceIdx] = useState(0);

  const filtered = PRODUCTS.filter((p) => {
    const catOk = category === "Все" || p.category === category;
    const matOk = material === "Все" || p.material === material;
    const styOk = style === "Все" || p.style === style;
    const { min, max } = PRICE_RANGES[priceIdx];
    const priceOk = p.price >= min && p.price <= max;
    return catOk && matOk && styOk && priceOk;
  });

  const handleNav = (id: string) => {
    setActiveNav(id);
    setMobileMenuOpen(false);
    scrollTo(id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <button
            onClick={() => handleNav("hero")}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-[hsl(var(--charcoal))] flex items-center justify-center">
              <span className="text-white font-cormorant font-bold text-sm">F</span>
            </div>
            <span className="font-cormorant font-semibold text-xl tracking-widest text-[hsl(var(--charcoal))] uppercase">
              Forma
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`nav-link ${activeNav === link.id ? "active" : ""}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+79613509525" className="font-ibm text-xs tracking-wider text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--gold))] transition-colors">
              +7 (961) 350-95-25
            </a>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`nav-link text-left ${activeNav === link.id ? "active" : ""}`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="absolute inset-0 bg-[hsl(var(--charcoal))]/70" />
        <div className="hero-texture" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <p className="section-label mb-6 animate-fade-in-up" style={{ animationFillMode: "forwards" }}>
              Профессиональная мебель
            </p>
            <h1
              className="font-cormorant text-6xl md:text-8xl text-white font-light leading-[0.9] mb-8 animate-fade-in-up delay-100"
              style={{ animationFillMode: "forwards" }}
            >
              Столы и стулья <br />
              <em className="italic text-[hsl(var(--gold))]">премиум-класса</em>
            </h1>
            <p
              className="font-ibm text-white/70 text-sm leading-relaxed mb-10 max-w-md animate-fade-in-up delay-200"
              style={{ animationFillMode: "forwards" }}
            >
              Более 15 лет поставляем качественную мебель для офисов, переговорных залов и представительских кабинетов по всей России.
            </p>
            <div
              className="flex flex-wrap gap-4 animate-fade-in-up delay-300"
              style={{ animationFillMode: "forwards" }}
            >
              <button className="gold-btn" onClick={() => handleNav("catalog")}>
                Смотреть каталог
              </button>
              <button
                className="outline-btn !border-white/40 !text-white hover:!bg-white hover:!text-[hsl(var(--charcoal))]"
                onClick={() => handleNav("contacts")}
              >
                Связаться с нами
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-6">
            {[
              { num: "5", label: "Лет на рынке" },
              { num: "1 000+", label: "Довольных клиентов" },
              { num: "500+", label: "Позиций в каталоге" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-cormorant text-3xl text-white font-semibold">{s.num}</div>
                <div className="font-ibm text-white/60 text-xs tracking-wider mt-1 uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <p className="section-label mb-3">Каталог товаров</p>
            <div className="flex items-end gap-4 mb-2">
              <h2 className="font-cormorant text-5xl md:text-6xl font-light text-[hsl(var(--charcoal))]">
                Наши изделия
              </h2>
              <span className="divider-gold mb-3" />
            </div>
            <p className="font-ibm text-sm text-[hsl(var(--muted-foreground))] max-w-lg leading-relaxed">
              Весь ассортимент изготавливается из сертифицированных материалов с гарантией качества 5 лет.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 mb-10 border border-border space-y-5">
            <div>
              <p className="font-ibm text-xs tracking-widest uppercase text-[hsl(var(--muted-foreground))] mb-3">Категория</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    className={`filter-chip ${category === c ? "active" : ""}`}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <p className="font-ibm text-xs tracking-widest uppercase text-[hsl(var(--muted-foreground))] mb-3">Материал</p>
                <div className="flex flex-wrap gap-2">
                  {MATERIALS.map((m) => (
                    <button
                      key={m}
                      className={`filter-chip ${material === m ? "active" : ""}`}
                      onClick={() => setMaterial(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-ibm text-xs tracking-widest uppercase text-[hsl(var(--muted-foreground))] mb-3">Стиль</p>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      className={`filter-chip ${style === s ? "active" : ""}`}
                      onClick={() => setStyle(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-ibm text-xs tracking-widest uppercase text-[hsl(var(--muted-foreground))] mb-3">Цена</p>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map((pr, idx) => (
                    <button
                      key={pr.label}
                      className={`filter-chip ${priceIdx === idx ? "active" : ""}`}
                      onClick={() => setPriceIdx(idx)}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <p className="font-ibm text-xs text-[hsl(var(--muted-foreground))] tracking-wider uppercase">
              Найдено: {filtered.length} товаров
            </p>
            <button
              className="font-ibm text-xs tracking-wider text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--gold))] transition-colors flex items-center gap-2"
              onClick={() => { setCategory("Все"); setMaterial("Все"); setStyle("Все"); setPriceIdx(0); }}
            >
              <Icon name="RotateCcw" size={12} />
              Сбросить фильтры
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <Icon name="PackageSearch" size={48} className="mx-auto text-[hsl(var(--muted-foreground))] mb-4" />
              <p className="font-cormorant text-3xl text-[hsl(var(--muted-foreground))]">
                Товары не найдены
              </p>
              <p className="font-ibm text-sm text-[hsl(var(--muted-foreground))] mt-2">
                Попробуйте изменить параметры фильтрации
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <div key={product.id} className="product-card border border-border">
                  <div className="product-image relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.tag && (
                      <span className="absolute top-3 left-3 bg-[hsl(var(--gold))] text-white font-ibm text-xs tracking-wider px-3 py-1">
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))]">
                        {product.category}
                      </span>
                      <span className="text-[hsl(var(--border))]">·</span>
                      <span className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))]">
                        {product.material}
                      </span>
                    </div>
                    <h3 className="font-cormorant text-xl font-semibold text-[hsl(var(--charcoal))] mb-3 leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-cormorant text-2xl font-semibold text-[hsl(var(--charcoal))]">
                        {product.price.toLocaleString("ru-RU")} ₽
                      </span>
                      <button className="gold-btn !py-2 !px-5 !text-xs">
                        Заказать
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-[hsl(var(--charcoal))]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label mb-4">О компании</p>
              <h2 className="font-cormorant text-5xl md:text-6xl text-white font-light leading-tight mb-6">
                Мебель, которой <em className="italic text-[hsl(var(--gold))]">доверяют</em>
              </h2>
              <p className="font-ibm text-white/60 text-sm leading-relaxed mb-6">
                FORMA основана в 2019 году. За эти годы мы зарекомендовали себя как надёжный поставщик качественной мебели по всей России.
              </p>
              <p className="font-ibm text-white/60 text-sm leading-relaxed mb-10">
                Каждое изделие изготавливается на нашем производстве в Подмосковье из сертифицированного сырья. Мы не работаем с перекупщиками — только прямые поставки и собственный контроль качества.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-10">
                {[
                  { icon: "Shield", title: "Гарантия 5 лет", desc: "На все изделия без исключений" },
                  { icon: "Truck", title: "Доставка по РФ", desc: "Сборка и установка в подарок" },
                  { icon: "Settings", title: "Под заказ", desc: "Индивидуальные размеры и цвет" },
                  { icon: "Award", title: "Сертификаты", desc: "Все материалы сертифицированы" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="w-10 h-10 flex-shrink-0 border border-[hsl(var(--gold))]/30 flex items-center justify-center">
                      <Icon name={item.icon} size={18} className="text-[hsl(var(--gold))]" />
                    </div>
                    <div>
                      <div className="font-ibm text-xs text-white tracking-wide font-medium mb-1">{item.title}</div>
                      <div className="font-ibm text-xs text-white/50">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="gold-btn" onClick={() => scrollTo("contacts")}>
                Получить консультацию
              </button>
            </div>

            <div className="relative">
              <div className="overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <img
                  src={DESK_IMG}
                  alt="О компании"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[hsl(var(--gold))] p-6 hidden md:block">
                <div className="font-cormorant text-4xl text-white font-bold">5+</div>
                <div className="font-ibm text-xs text-white/80 tracking-wider uppercase mt-1">Лет опыта</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="section-label mb-4">Контакты</p>
              <h2 className="font-cormorant text-5xl md:text-6xl font-light text-[hsl(var(--charcoal))] mb-6">
                Свяжитесь с нами
              </h2>
              <p className="font-ibm text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-10">
                Оставьте заявку или позвоните напрямую — наш менеджер ответит в течение 30 минут в рабочее время.
              </p>

              <div className="space-y-6">
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 (961) 350-95-25" },
                  { icon: "Mail", label: "Email", value: "info@forma-mebel.ru" },
                  { icon: "Clock", label: "Режим работы", value: "Пн–Пт: 9:00 — 19:00, Сб: 10:00 — 16:00" },
                ].map((c) => (
                  <div key={c.label} className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-[hsl(var(--charcoal))] flex items-center justify-center flex-shrink-0">
                      <Icon name={c.icon} size={16} className="text-[hsl(var(--gold))]" />
                    </div>
                    <div>
                      <div className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] mb-1">{c.label}</div>
                      <div className="font-ibm text-sm text-[hsl(var(--charcoal))]">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-border p-8">
              <h3 className="font-cormorant text-2xl text-[hsl(var(--charcoal))] mb-6">Оставить заявку</h3>
              <div className="space-y-4">
                <div>
                  <label className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-2">
                    Имя *
                  </label>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors"
                  />
                </div>
                <div>
                  <label className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors"
                  />
                </div>
                <div>
                  <label className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-2">
                    Комментарий
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Расскажите о вашем запросе..."
                    className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors resize-none"
                  />
                </div>
                <button className="gold-btn w-full">
                  Отправить заявку
                </button>
                <p className="font-ibm text-[10px] text-[hsl(var(--muted-foreground))] text-center leading-relaxed">
                  Нажимая «Отправить», вы соглашаетесь с политикой обработки персональных данных
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[hsl(var(--charcoal))] py-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-white/10 flex items-center justify-center">
              <span className="text-white font-cormorant font-bold text-xs">F</span>
            </div>
            <span className="font-cormorant text-white tracking-widest text-lg uppercase">Forma</span>
          </div>

          <nav className="flex gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className="font-ibm text-[10px] tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <p className="font-ibm text-[10px] text-white/30 tracking-wider">
            © 2024 FORMA. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}