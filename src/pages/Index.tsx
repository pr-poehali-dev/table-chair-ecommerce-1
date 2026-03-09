import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const CATALOG_URL = "https://functions.poehali.dev/ad4cf3d6-daa4-46d3-a12e-7450cde2ed86";
const SUBMIT_URL = "https://functions.poehali.dev/d44ce627-6827-4dbe-a081-0c0cc8d835e4";

const HERO_IMG = "https://cdn.poehali.dev/projects/be1b219e-f7ec-4829-9956-6c1dc29e759f/files/18b4fdba-8757-4266-a03c-922df7340420.jpg";
const DESK_IMG = "https://cdn.poehali.dev/projects/be1b219e-f7ec-4829-9956-6c1dc29e759f/files/9521eb3a-d91f-439c-869e-43ea6fe97b29.jpg";

const NAV_LINKS = [
  { label: "Главная", id: "hero" },
  { label: "Каталог", id: "catalog" },
  { label: "О компании", id: "about" },
  { label: "Контакты", id: "contacts" },
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

interface Product {
  id: number;
  name: string;
  category: string;
  material: string;
  style: string;
  price: number;
  image: string;
  tag: string | null;
}

interface CartItem extends Product {
  qty: number;
}

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formComment, setFormComment] = useState("");
  const [formSending, setFormSending] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetch(CATALOG_URL)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .finally(() => setLoadingCatalog(false));
  }, []);

  const filtered = products.filter((p) => {
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

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const changeQty = (id: number, delta: number) => {
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const openOrderModal = (product: Product) => {
    setOrderProduct(product);
  };

  const sendOrder = async (cartItems: CartItem[], comment?: string) => {
    if (!formName.trim() || !formPhone.trim()) {
      setFormError("Пожалуйста, заполните имя и телефон");
      return;
    }
    setFormSending(true);
    setFormError("");
    try {
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          phone: formPhone,
          comment: comment || formComment,
          cart: cartItems.map((i) => ({ name: i.name, price: i.price, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setFormSuccess(true);
        setFormName("");
        setFormPhone("");
        setFormComment("");
        setCart([]);
        setCartOpen(false);
        setOrderProduct(null);
      } else {
        setFormError("Ошибка при отправке. Попробуйте ещё раз.");
      }
    } catch {
      setFormError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setFormSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <button onClick={() => handleNav("hero")} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[hsl(var(--charcoal))] flex items-center justify-center">
              <span className="text-white font-cormorant font-bold text-sm">М</span>
            </div>
            <span className="font-cormorant font-semibold text-xl tracking-widest text-[hsl(var(--charcoal))] uppercase">
              Мир Столов и Стульев
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button key={link.id} onClick={() => handleNav(link.id)} className={`nav-link ${activeNav === link.id ? "active" : ""}`}>
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a href="tel:+79613509525" className="hidden md:block font-ibm text-xs tracking-wider text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--gold))] transition-colors">
              +7 (961) 350-95-25
            </a>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:text-[hsl(var(--gold))] transition-colors"
            >
              <Icon name="ShoppingCart" size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[hsl(var(--gold))] text-white text-[10px] font-ibm font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <button key={link.id} onClick={() => handleNav(link.id)} className={`nav-link text-left ${activeNav === link.id ? "active" : ""}`}>
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="font-cormorant text-2xl text-[hsl(var(--charcoal))]">Корзина</h2>
              <button onClick={() => setCartOpen(false)}><Icon name="X" size={20} /></button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[hsl(var(--muted-foreground))]">
                <Icon name="ShoppingCart" size={48} />
                <p className="font-ibm text-sm">Корзина пуста</p>
                <button className="gold-btn" onClick={() => { setCartOpen(false); scrollTo("catalog"); }}>
                  Перейти в каталог
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b border-border pb-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-cormorant text-base font-semibold text-[hsl(var(--charcoal))] leading-tight mb-1">{item.name}</p>
                        <p className="font-ibm text-sm text-[hsl(var(--charcoal))]">{item.price.toLocaleString("ru-RU")} ₽</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => changeQty(item.id, -1)} className="w-7 h-7 border border-border flex items-center justify-center hover:border-[hsl(var(--charcoal))] transition-colors">
                            <Icon name="Minus" size={12} />
                          </button>
                          <span className="font-ibm text-sm w-4 text-center">{item.qty}</span>
                          <button onClick={() => changeQty(item.id, 1)} className="w-7 h-7 border border-border flex items-center justify-center hover:border-[hsl(var(--charcoal))] transition-colors">
                            <Icon name="Plus" size={12} />
                          </button>
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors">
                            <Icon name="Trash2" size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-5 border-t border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-ibm text-sm text-[hsl(var(--muted-foreground))]">Итого:</span>
                    <span className="font-cormorant text-2xl font-semibold text-[hsl(var(--charcoal))]">{cartTotal.toLocaleString("ru-RU")} ₽</span>
                  </div>

                  {formSuccess ? (
                    <div className="bg-green-50 border border-green-200 p-4 text-center">
                      <Icon name="CheckCircle" size={24} className="mx-auto text-green-600 mb-2" />
                      <p className="font-ibm text-sm text-green-700">Заявка отправлена! Мы свяжемся с вами в течение 30 минут.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Ваше имя *"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors"
                      />
                      <input
                        type="tel"
                        placeholder="Телефон *"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors"
                      />
                      {formError && <p className="font-ibm text-xs text-red-500">{formError}</p>}
                      <button
                        className="gold-btn w-full disabled:opacity-60"
                        disabled={formSending}
                        onClick={() => sendOrder(cart)}
                      >
                        {formSending ? "Отправляем..." : "Оформить заказ"}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* QUICK ORDER MODAL */}
      {orderProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOrderProduct(null)} />
          <div className="relative bg-white w-full max-w-md shadow-2xl p-8">
            <button className="absolute top-4 right-4" onClick={() => setOrderProduct(null)}>
              <Icon name="X" size={20} />
            </button>
            <h3 className="font-cormorant text-2xl text-[hsl(var(--charcoal))] mb-2">Заказать товар</h3>
            <p className="font-ibm text-sm text-[hsl(var(--muted-foreground))] mb-6">{orderProduct.name} — {orderProduct.price.toLocaleString("ru-RU")} ₽</p>

            {formSuccess ? (
              <div className="bg-green-50 border border-green-200 p-6 text-center">
                <Icon name="CheckCircle" size={32} className="mx-auto text-green-600 mb-3" />
                <p className="font-ibm text-sm text-green-700">Заявка отправлена! Мы свяжемся с вами в течение 30 минут.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-2">Имя *</label>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors"
                  />
                </div>
                <div>
                  <label className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-2">Телефон *</label>
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors"
                  />
                </div>
                <div>
                  <label className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-2">Комментарий</label>
                  <textarea
                    rows={3}
                    placeholder="Расскажите о вашем запросе..."
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors resize-none"
                  />
                </div>
                {formError && <p className="font-ibm text-xs text-red-500">{formError}</p>}
                <button
                  className="gold-btn w-full disabled:opacity-60"
                  disabled={formSending}
                  onClick={() => sendOrder([{ ...orderProduct, qty: 1 }])}
                >
                  {formSending ? "Отправляем..." : "Отправить заявку"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMG})` }} />
        <div className="absolute inset-0 bg-[hsl(var(--charcoal))]/70" />
        <div className="hero-texture" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <p className="section-label mb-6 animate-fade-in-up" style={{ animationFillMode: "forwards" }}>
              Профессиональная мебель
            </p>
            <h1 className="font-cormorant text-6xl md:text-8xl text-white font-light leading-[0.9] mb-8 animate-fade-in-up delay-100" style={{ animationFillMode: "forwards" }}>
              Столы и стулья <br />
              <em className="italic text-[hsl(var(--gold))]">премиум-класса</em>
            </h1>
            <p className="font-ibm text-white/70 text-sm leading-relaxed mb-10 max-w-md animate-fade-in-up delay-200" style={{ animationFillMode: "forwards" }}>
              Более 5 лет поставляем качественную мебель для офисов, переговорных залов, представительских кабинетов и частных домов по всей России.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300" style={{ animationFillMode: "forwards" }}>
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

          <div className="bg-white p-6 mb-10 border border-border space-y-5">
            <div>
              <p className="font-ibm text-xs tracking-widest uppercase text-[hsl(var(--muted-foreground))] mb-3">Категория</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button key={c} className={`filter-chip ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <p className="font-ibm text-xs tracking-widest uppercase text-[hsl(var(--muted-foreground))] mb-3">Материал</p>
                <div className="flex flex-wrap gap-2">
                  {MATERIALS.map((m) => (
                    <button key={m} className={`filter-chip ${material === m ? "active" : ""}`} onClick={() => setMaterial(m)}>{m}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-ibm text-xs tracking-widest uppercase text-[hsl(var(--muted-foreground))] mb-3">Стиль</p>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map((s) => (
                    <button key={s} className={`filter-chip ${style === s ? "active" : ""}`} onClick={() => setStyle(s)}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-ibm text-xs tracking-widest uppercase text-[hsl(var(--muted-foreground))] mb-3">Цена</p>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map((pr, idx) => (
                    <button key={pr.label} className={`filter-chip ${priceIdx === idx ? "active" : ""}`} onClick={() => setPriceIdx(idx)}>{pr.label}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <p className="font-ibm text-xs text-[hsl(var(--muted-foreground))] tracking-wider uppercase">
              {loadingCatalog ? "Загружаем..." : `Найдено: ${filtered.length} товаров`}
            </p>
            <button
              className="font-ibm text-xs tracking-wider text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--gold))] transition-colors flex items-center gap-2"
              onClick={() => { setCategory("Все"); setMaterial("Все"); setStyle("Все"); setPriceIdx(0); }}
            >
              <Icon name="RotateCcw" size={12} />
              Сбросить фильтры
            </button>
          </div>

          {loadingCatalog ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border border-border">
                  <div className="bg-gray-100 animate-pulse" style={{ aspectRatio: "4/3" }} />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
                    <div className="h-5 bg-gray-100 animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-gray-100 animate-pulse rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center">
              <Icon name="PackageSearch" size={48} className="mx-auto text-[hsl(var(--muted-foreground))] mb-4" />
              <p className="font-cormorant text-3xl text-[hsl(var(--muted-foreground))]">Товары не найдены</p>
              <p className="font-ibm text-sm text-[hsl(var(--muted-foreground))] mt-2">Попробуйте изменить параметры фильтрации</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <div key={product.id} className="product-card border border-border">
                  <div className="product-image relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    {product.tag && (
                      <span className="absolute top-3 left-3 bg-[hsl(var(--gold))] text-white font-ibm text-xs tracking-wider px-3 py-1">
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))]">{product.category}</span>
                      <span className="text-[hsl(var(--border))]">·</span>
                      <span className="font-ibm text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground))]">{product.material}</span>
                    </div>
                    <h3 className="font-cormorant text-xl font-semibold text-[hsl(var(--charcoal))] mb-3 leading-tight">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-cormorant text-2xl font-semibold text-[hsl(var(--charcoal))]">
                        {product.price.toLocaleString("ru-RU")} ₽
                      </span>
                      <div className="flex gap-2">
                        <button
                          className="outline-btn !py-2 !px-3 !text-xs"
                          onClick={() => addToCart(product)}
                          title="В корзину"
                        >
                          <Icon name="ShoppingCart" size={14} />
                        </button>
                        <button
                          className="gold-btn !py-2 !px-4 !text-xs"
                          onClick={() => { setFormSuccess(false); setFormError(""); openOrderModal(product); }}
                        >
                          Заказать
                        </button>
                      </div>
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
                ФОРМА основана в 2019 году. За эти годы мы зарекомендовали себя как надёжный поставщик качественной мебели по всей России.
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
                <img src={DESK_IMG} alt="О компании" className="w-full h-full object-cover" />
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
                  { icon: "Mail", label: "Email", value: "info.forma-mebel@mail.ru" },
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

              {formSuccess ? (
                <div className="py-8 text-center">
                  <Icon name="CheckCircle" size={48} className="mx-auto text-green-600 mb-4" />
                  <p className="font-cormorant text-2xl text-[hsl(var(--charcoal))] mb-2">Заявка отправлена!</p>
                  <p className="font-ibm text-sm text-[hsl(var(--muted-foreground))]">Мы свяжемся с вами в течение 30 минут в рабочее время.</p>
                  <button className="gold-btn mt-6" onClick={() => setFormSuccess(false)}>Отправить ещё</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-2">Имя *</label>
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-2">Телефон *</label>
                    <input
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-2">Комментарий</label>
                    <textarea
                      rows={4}
                      placeholder="Расскажите о вашем запросе..."
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors resize-none"
                    />
                  </div>
                  {formError && <p className="font-ibm text-xs text-red-500">{formError}</p>}
                  <button
                    className="gold-btn w-full disabled:opacity-60"
                    disabled={formSending}
                    onClick={() => sendOrder([])}
                  >
                    {formSending ? "Отправляем..." : "Отправить заявку"}
                  </button>
                  <p className="font-ibm text-[10px] text-[hsl(var(--muted-foreground))] text-center leading-relaxed">
                    Нажимая «Отправить», вы соглашаетесь с политикой обработки персональных данных
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[hsl(var(--charcoal))] py-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-white/10 flex items-center justify-center">
              <span className="text-white font-cormorant font-bold text-xs">М</span>
            </div>
            <span className="font-cormorant text-white tracking-widest text-lg uppercase">Мир Столов и Стульев</span>
          </div>

          <nav className="flex gap-6">
            {NAV_LINKS.map((link) => (
              <button key={link.id} onClick={() => handleNav(link.id)} className="font-ibm text-[10px] tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors">
                {link.label}
              </button>
            ))}
          </nav>

          <p className="font-ibm text-[10px] text-white/30 tracking-wider">
            © 2024 МИР СТОЛОВ И СТУЛЬЕВ. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}
