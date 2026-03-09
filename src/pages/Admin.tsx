import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const ADMIN_URL = "https://functions.poehali.dev/0025e3c3-36b5-46fc-aa5d-ce89125e5b73";
const ADMIN_TOKEN = "forma-admin-2024";

const CATEGORIES = ["Столы", "Стулья"];
const MATERIALS = ["Дуб", "Массив", "Кожа", "Ткань", "Металл", "Стекло"];
const STYLES = ["Классика", "Современный", "Скандинавский", "Лофт"];
const TAGS = ["", "Хит продаж", "Новинка", "Премиум", "Акция"];

interface Product {
  id: number;
  name: string;
  category: string;
  material: string;
  style: string;
  price: number;
  image_url: string;
  tag: string | null;
  is_active: boolean;
}

const empty: Omit<Product, "id"> = {
  name: "", category: "Столы", material: "Дуб", style: "Классика",
  price: 0, image_url: "", tag: null, is_active: true,
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Product, "id">>(empty);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const headers = { "Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(ADMIN_URL, { headers });
      const data = await res.json();
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) load();
  }, [authed]);

  const handleLogin = () => {
    if (password === "forma2024") setAuthed(true);
    else alert("Неверный пароль");
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setCreating(false);
    setForm({ name: p.name, category: p.category, material: p.material, style: p.style, price: p.price, image_url: p.image_url || "", tag: p.tag, is_active: p.is_active });
    setMsg("");
  };

  const openCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm(empty);
    setMsg("");
  };

  const closeForm = () => { setEditing(null); setCreating(false); };

  const save = async () => {
    if (!form.name || !form.price) { setMsg("Заполните название и цену"); return; }
    setSaving(true);
    setMsg("");
    try {
      if (creating) {
        await fetch(ADMIN_URL, { method: "POST", headers, body: JSON.stringify(form) });
      } else if (editing) {
        await fetch(ADMIN_URL, { method: "PUT", headers, body: JSON.stringify({ ...form, id: editing.id }) });
      }
      await load();
      closeForm();
    } catch {
      setMsg("Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Удалить товар?")) return;
    await fetch(`${ADMIN_URL}?id=${id}`, { method: "DELETE", headers });
    await load();
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[hsl(var(--charcoal))] flex items-center justify-center p-4">
        <div className="bg-white p-10 w-full max-w-sm shadow-2xl">
          <div className="w-10 h-10 bg-[hsl(var(--charcoal))] flex items-center justify-center mb-6">
            <span className="text-white font-cormorant font-bold text-sm">М</span>
          </div>
          <h1 className="font-cormorant text-3xl text-[hsl(var(--charcoal))] mb-2">Админ-панель</h1>
          <p className="font-ibm text-xs text-[hsl(var(--muted-foreground))] mb-8">Мир Столов и Стульев</p>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors mb-4"
          />
          <button className="gold-btn w-full" onClick={handleLogin}>Войти</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[hsl(var(--charcoal))] flex items-center justify-center">
            <span className="text-white font-cormorant font-bold text-sm">М</span>
          </div>
          <div>
            <h1 className="font-cormorant text-xl text-[hsl(var(--charcoal))] font-semibold">Управление каталогом</h1>
            <p className="font-ibm text-[10px] text-[hsl(var(--muted-foreground))] tracking-wider uppercase">Мир Столов и Стульев</p>
          </div>
        </div>
        <div className="flex gap-3">
          <a href="/" className="outline-btn !py-2 !px-4 !text-xs">На сайт</a>
          <button className="gold-btn !py-2 !px-4 !text-xs" onClick={openCreate}>
            <Icon name="Plus" size={14} />
            Добавить товар
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Icon name="Loader2" size={32} className="animate-spin text-[hsl(var(--muted-foreground))]" />
          </div>
        ) : (
          <div className="bg-white border border-border overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-border bg-gray-50">
                <tr>
                  <th className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] text-left px-6 py-4">Товар</th>
                  <th className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] text-left px-4 py-4 hidden md:table-cell">Категория</th>
                  <th className="font-ibm text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground))] text-left px-4 py-4 hidden md:table-cell">Цена</th>
                  <th className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] text-left px-4 py-4 hidden md:table-cell">Статус</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.image_url && (
                          <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-ibm text-sm font-medium text-[hsl(var(--charcoal))]">{p.name}</p>
                          {p.tag && <span className="font-ibm text-[10px] text-[hsl(var(--gold))]">{p.tag}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="font-ibm text-xs text-[hsl(var(--muted-foreground))]">{p.category} · {p.material}</span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="font-cormorant text-lg font-semibold text-[hsl(var(--charcoal))]">{p.price.toLocaleString("ru-RU")} ₽</span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className={`font-ibm text-[10px] tracking-wider px-2 py-1 ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {p.is_active ? "Активен" : "Скрыт"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEdit(p)} className="p-2 hover:text-[hsl(var(--gold))] transition-colors">
                          <Icon name="Pencil" size={16} />
                        </button>
                        <button onClick={() => del(p.id)} className="p-2 hover:text-red-500 transition-colors">
                          <Icon name="Trash2" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="py-16 text-center">
                <Icon name="Package" size={40} className="mx-auto text-[hsl(var(--muted-foreground))] mb-3" />
                <p className="font-ibm text-sm text-[hsl(var(--muted-foreground))]">Нет товаров. Добавьте первый!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FORM MODAL */}
      {(editing || creating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeForm} />
          <div className="relative bg-white w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-white">
              <h2 className="font-cormorant text-2xl text-[hsl(var(--charcoal))]">
                {creating ? "Новый товар" : "Редактировать"}
              </h2>
              <button onClick={closeForm}><Icon name="X" size={20} /></button>
            </div>

            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-2">Название *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors"
                  placeholder="Стол Директор Pro"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-2">Категория</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors bg-white"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-2">Материал</label>
                  <select
                    value={form.material}
                    onChange={(e) => setForm({ ...form, material: e.target.value })}
                    className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors bg-white"
                  >
                    {MATERIALS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-2">Стиль</label>
                  <select
                    value={form.style}
                    onChange={(e) => setForm({ ...form, style: e.target.value })}
                    className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors bg-white"
                  >
                    {STYLES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-2">Метка</label>
                  <select
                    value={form.tag || ""}
                    onChange={(e) => setForm({ ...form, tag: e.target.value || null })}
                    className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors bg-white"
                  >
                    {TAGS.map((t) => <option key={t} value={t}>{t || "Без метки"}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-2">Цена (₽) *</label>
                <input
                  type="number"
                  value={form.price || ""}
                  onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                  className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors"
                  placeholder="89000"
                />
              </div>

              <div>
                <label className="font-ibm text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-2">Ссылка на фото</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full border border-border px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[hsl(var(--charcoal))] transition-colors"
                  placeholder="https://..."
                />
                {form.image_url && (
                  <img src={form.image_url} alt="preview" className="mt-3 h-32 object-cover" />
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_active" className="font-ibm text-sm text-[hsl(var(--charcoal))]">Показывать на сайте</label>
              </div>

              {msg && <p className="font-ibm text-xs text-red-500">{msg}</p>}
            </div>

            <div className="px-6 py-5 border-t border-border flex gap-3">
              <button className="outline-btn flex-1" onClick={closeForm}>Отмена</button>
              <button className="gold-btn flex-1 disabled:opacity-60" disabled={saving} onClick={save}>
                {saving ? "Сохраняем..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
