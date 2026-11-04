import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { supabase, supabaseReady, ADMIN_EMAIL, STORE_WHATSAPP } from "../supabase";

const categories = [
  "All", "Rice & Atta", "Dals & Pulses", "Oils & Ghee", "Spices & Masalas",
  "Sugar & Salt", "Biscuits", "Snacks", "Chocolates", "Tea & Coffee",
  "Dairy", "Bakery", "Fruits", "Vegetables", "Personal Care", "Bath & Body",
  "Hair Care", "Oral Care", "Home Cleaning", "Dishwash", "Laundry",
  "Kitchen Needs", "Pooja Items", "Baby Care", "Health & Wellness",
  "Beverages", "Instant Foods", "Dry Fruits", "Pet Care", "Stationery"
];

const initialProducts = [
  ["Sona Masoori Rice","Rice & Atta","🍚","1 kg"],["Basmati Rice","Rice & Atta","🍚","1 kg"],["Brown Rice","Rice & Atta","🌾","1 kg"],["Wheat Atta","Rice & Atta","🌾","1 kg"],["Maida","Rice & Atta","🥣","1 kg"],["Rava / Sooji","Rice & Atta","🥣","1 kg"],
  ["Toor Dal","Dals & Pulses","🫘","1 kg"],["Moong Dal","Dals & Pulses","🫘","1 kg"],["Masoor Dal","Dals & Pulses","🫘","1 kg"],["Chana Dal","Dals & Pulses","🫘","1 kg"],["Urad Dal","Dals & Pulses","🫘","1 kg"],["Rajma","Dals & Pulses","🫘","500 g"],["Kabuli Chana","Dals & Pulses","🫘","500 g"],
  ["Sunflower Oil","Oils & Ghee","🫒","1 L"],["Groundnut Oil","Oils & Ghee","🫒","1 L"],["Rice Bran Oil","Oils & Ghee","🫒","1 L"],["Coconut Oil","Oils & Ghee","🥥","500 ml"],["Cow Ghee","Oils & Ghee","🧈","500 ml"],
  ["Red Chilli Powder","Spices & Masalas","🌶️","200 g"],["Turmeric Powder","Spices & Masalas","🟡","100 g"],["Coriander Powder","Spices & Masalas","🌿","200 g"],["Cumin Seeds","Spices & Masalas","🌱","100 g"],["Mustard Seeds","Spices & Masalas","🌱","100 g"],["Garam Masala","Spices & Masalas","🥘","100 g"],["Sambar Powder","Spices & Masalas","🥘","100 g"],
  ["Sugar","Sugar & Salt","🍬","1 kg"],["Jaggery","Sugar & Salt","🟤","1 kg"],["Iodised Salt","Sugar & Salt","🧂","1 kg"],["Rock Salt","Sugar & Salt","🧂","500 g"],
  ["Marie Biscuits","Biscuits","🍪","Pack"],["Cream Biscuits","Biscuits","🍪","Pack"],["Cookies","Biscuits","🍪","Pack"],["Potato Chips","Snacks","🍟","Pack"],["Mixture","Snacks","🥨","Pack"],["Peanuts","Snacks","🥜","250 g"],["Popcorn","Snacks","🍿","Pack"],["Milk Chocolate","Chocolates","🍫","Pack"],
  ["Tea Powder","Tea & Coffee","☕","250 g"],["Instant Coffee","Tea & Coffee","☕","100 g"],["Fresh Milk","Dairy","🥛","500 ml"],["Curd","Dairy","🥣","500 g"],["Butter","Dairy","🧈","Pack"],["Paneer","Dairy","🧀","200 g"],["Bread","Bakery","🍞","Pack"],["Rusk","Bakery","🍞","Pack"],
  ["Apple","Fruits","🍎","1 kg"],["Banana","Fruits","🍌","Dozen"],["Orange","Fruits","🍊","1 kg"],["Grapes","Fruits","🍇","1 kg"],["Mango","Fruits","🥭","1 kg"],["Potato","Vegetables","🥔","1 kg"],["Onion","Vegetables","🧅","1 kg"],["Tomatoes","Vegetables","🍅","1 kg"],["Carrot","Vegetables","🥕","1 kg"],["Green Chilli","Vegetables","🌶️","250 g"],["Coriander Leaves","Vegetables","🌿","Bunch"],
  ["Bathing Soap","Bath & Body","🧼","Piece"],["Handwash","Bath & Body","🧴","Bottle"],["Shampoo","Hair Care","🧴","Bottle"],["Hair Oil","Hair Care","🧴","Bottle"],["Toothpaste","Oral Care","🪥","Pack"],["Toothbrush","Oral Care","🪥","Piece"],
  ["Floor Cleaner","Home Cleaning","🧹","1 L"],["Toilet Cleaner","Home Cleaning","🧴","Bottle"],["Dishwash Liquid","Dishwash","🫧","Bottle"],["Dishwash Bar","Dishwash","🧼","Piece"],["Detergent Powder","Laundry","🧺","1 kg"],["Fabric Softener","Laundry","🧺","Bottle"],
  ["Steel Plates","Kitchen Needs","🍽️","Set"],["Storage Containers","Kitchen Needs","🥡","Set"],["Agarbatti","Pooja Items","🪔","Pack"],["Camphor","Pooja Items","🪔","Pack"],["Baby Powder","Baby Care","👶","Pack"],["Baby Soap","Baby Care","🧼","Piece"],["Mineral Water","Beverages","💧","1 L"],["Soft Drinks","Beverages","🥤","Bottle"],["Noodles","Instant Foods","🍜","Pack"],["Ready Mix","Instant Foods","🥣","Pack"],["Cashew Nuts","Dry Fruits","🥜","250 g"],["Almonds","Dry Fruits","🥜","250 g"],["Raisins","Dry Fruits","🍇","250 g"],["Pet Food","Pet Care","🐾","Pack"],["Notebook","Stationery","📒","Piece"]
].map((p, i) => ({ id: i + 1, name: p[0], category: p[1], emoji: p[2], unit: p[3] }));

const money = n => "₹" + Number(n || 0).toFixed(2);

// Product-specific real-photo searches. Each item gets its own keyword and lock ID.
// Photos are sourced from Flickr through LoremFlickr (not AI-generated).
const productPhotoTags = {
  "Sona Masoori Rice": "sona masoori rice",
  "Basmati Rice": "basmati rice",
  "Brown Rice": "brown rice grains",
  "Wheat Atta": "wheat flour",
  "Maida": "maida flour",
  "Rava / Sooji": "semolina sooji",
  "Toor Dal": "toor dal pigeon peas",
  "Moong Dal": "moong dal mung beans",
  "Masoor Dal": "masoor dal red lentils",
  "Chana Dal": "chana dal split chickpeas",
  "Urad Dal": "urad dal black gram",
  "Rajma": "rajma kidney beans",
  "Kabuli Chana": "kabuli chana chickpeas",
  "Sunflower Oil": "sunflower cooking oil bottle",
  "Groundnut Oil": "groundnut peanut oil bottle",
  "Rice Bran Oil": "rice bran cooking oil bottle",
  "Coconut Oil": "coconut oil bottle",
  "Cow Ghee": "indian cow ghee bowl",
  "Red Chilli Powder": "red chilli powder spice",
  "Turmeric Powder": "turmeric powder spice",
  "Coriander Powder": "coriander powder spice",
  "Cumin Seeds": "cumin seeds jeera",
  "Mustard Seeds": "mustard seeds rai",
  "Garam Masala": "garam masala spice powder",
  "Sambar Powder": "sambar masala powder",
  "Sugar": "white sugar crystals",
  "Jaggery": "jaggery gur blocks",
  "Iodised Salt": "table salt crystals",
  "Rock Salt": "rock salt pink salt",
  "Marie Biscuits": "marie biscuits",
  "Cream Biscuits": "cream sandwich biscuits",
  "Cookies": "cookies biscuits",
  "Potato Chips": "potato chips crisps",
  "Mixture": "indian namkeen mixture snack",
  "Peanuts": "peanuts groundnuts",
  "Popcorn": "popcorn bowl",
  "Milk Chocolate": "milk chocolate pieces",
  "Tea Powder": "black tea leaves powder",
  "Instant Coffee": "instant coffee granules",
  "Fresh Milk": "fresh milk glass bottle",
  "Curd": "indian curd yogurt bowl",
  "Butter": "butter block",
  "Paneer": "paneer cubes indian cottage cheese",
  "Bread": "fresh sliced bread loaf",
  "Rusk": "tea rusk toast",
  "Apple": "red apples fruit",
  "Banana": "ripe bananas fruit",
  "Orange": "fresh oranges fruit",
  "Grapes": "fresh grapes bunch",
  "Mango": "ripe mango fruit",
  "Potato": "fresh potatoes vegetable",
  "Onion": "red onions vegetable",
  "Tomatoes": "fresh red tomatoes vegetable",
  "Carrot": "fresh carrots vegetable",
  "Green Chilli": "green chilli peppers",
  "Coriander Leaves": "fresh coriander cilantro leaves",
  "Bathing Soap": "bar bathing soap",
  "Handwash": "liquid hand wash bottle",
  "Shampoo": "shampoo bottle",
  "Hair Oil": "hair oil bottle",
  "Toothpaste": "toothpaste tube",
  "Toothbrush": "toothbrush",
  "Floor Cleaner": "floor cleaning liquid bottle",
  "Toilet Cleaner": "toilet cleaner bottle",
  "Dishwash Liquid": "dishwashing liquid bottle",
  "Dishwash Bar": "dishwashing soap bar",
  "Detergent Powder": "laundry detergent powder",
  "Fabric Softener": "fabric softener bottle",
  "Steel Plates": "stainless steel dinner plates",
  "Storage Containers": "kitchen food storage containers",
  "Agarbatti": "incense sticks agarbatti",
  "Camphor": "camphor cubes kapoor",
  "Baby Powder": "baby talcum powder bottle",
  "Baby Soap": "baby soap bar",
  "Mineral Water": "mineral water bottle",
  "Soft Drinks": "soft drink glass bottle",
  "Noodles": "instant noodles bowl",
  "Ready Mix": "indian instant food mix",
  "Cashew Nuts": "cashew nuts",
  "Almonds": "almonds nuts",
  "Raisins": "raisins dried grapes",
  "Pet Food": "dry pet food kibble",
  "Notebook": "paper notebook stationery"
};
const productPhotoUrl = product => {
  if (product.imageUrl) return product.imageUrl;
  const slug = String(product.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `/products/${slug}.webp`;
};
const heroPhotoUrl = "/kirana-shop-banner.png";
const statuses = ["Order Received", "Estimate Sent", "Customer Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

export default function App() {
  const [products, setProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("balaji_products")) || initialProducts; } catch { return initialProducts; }
  });
  const [cart, setCart] = useState({});
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("shop");
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem("balaji_orders")) || []; } catch { return []; }
  });
  const [deletedOrders, setDeletedOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem("balaji_deleted_orders")) || []; } catch { return []; }
  });
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [customItem, setCustomItem] = useState("");
  const [customQty, setCustomQty] = useState("1");
  const [customItems, setCustomItems] = useState([]);
  const [adminEmail, setAdminEmail] = useState(ADMIN_EMAIL);
  const [adminPassword, setAdminPassword] = useState("");
  const [admin, setAdmin] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [orderFilter, setOrderFilter] = useState("All");

  useEffect(() => { localStorage.setItem("balaji_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("balaji_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("balaji_deleted_orders", JSON.stringify(deletedOrders)); }, [deletedOrders]);

  useEffect(() => {
    if (!supabaseReady) return;
    let alive = true;
    supabase.from("products").select("payload").then(({ data, error }) => {
      if (!alive || error || !data?.length) return;
      setProducts(data.map(row => row.payload));
    });
    supabase.auth.getSession().then(({ data }) => {
      const user = data?.session?.user;
      if (user?.email?.toLowerCase() === ADMIN_EMAIL) { setAdmin(true); setView("admin"); }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const allowed = session?.user?.email?.toLowerCase() === ADMIN_EMAIL;
      setAdmin(!!allowed);
      if (allowed) setView("admin");
      else if (!session) setAdmin(false);
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!supabaseReady || !admin) return;
    supabase.from("products").select("id", { count: "exact", head: true }).then(async ({ count, error }) => {
      if (!error && count === 0) {
        const rows = initialProducts.map(product => ({ id: product.id, payload: product }));
        const result = await supabase.from("products").upsert(rows);
        if (result.error) showNotice("Could not initialise product catalogue: " + result.error.message);
      }
    });
  }, [admin]);

  useEffect(() => {
    if (!supabaseReady || !admin) return;
    supabase.from("orders").select("payload,is_deleted").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (error) { showNotice("Could not load orders: " + error.message); return; }
      setOrders((data || []).filter(r => !r.is_deleted).map(r => r.payload));
      setDeletedOrders((data || []).filter(r => r.is_deleted).map(r => r.payload));
    });
  }, [admin]);

  function captureLocation() {
    if (!navigator.geolocation) { setLocationMessage("This browser does not support location sharing."); return; }
    setLocationMessage("Getting your location… Please allow location access.");
    navigator.geolocation.getCurrentPosition(
      pos => {
        setDeliveryLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: Math.round(pos.coords.accuracy) });
        setLocationMessage("Location captured successfully.");
      },
      err => setLocationMessage(err.code === 1 ? "Location permission was denied. You can still enter your address." : "Could not get location. Please try again or enter your address."),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }

  const filteredProducts = useMemo(() => products.filter(p =>
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  ), [products, category, search]);
  const cartItems = products.filter(p => cart[p.id] > 0);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const customCount = customItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  const totalCartCount = count + customCount;

  function showNotice(message) { setNotice(message); setTimeout(() => setNotice(""), 3000); }
  function changeQty(id, amount) {
    setCart(old => {
      const next = { ...old, [id]: Math.max(0, (old[id] || 0) + amount) };
      if (!next[id]) delete next[id];
      return next;
    });
  }
  function addCustomItem(e) {
    e.preventDefault();
    if (customItem.trim()) { setCustomItems(old => [...old, { name: customItem.trim(), quantity: Math.max(1, Number(customQty) || 1) }]); setCustomItem(""); setCustomQty("1"); showNotice("Item added to cart."); }
  }
  function submitOrder(e) {
    e.preventDefault();
    if (!customer.name.trim() || !/^[6-9]\d{9}$/.test(customer.phone) || !customer.address.trim()) {
      showNotice("Please enter a valid name, 10-digit mobile number and address."); return;
    }
    if (!count && !customCount) { showNotice("Please add at least one item."); return; }
    const order = {
      id: "BH" + Date.now().toString().slice(-8),
      customer: { ...customer },
      items: cartItems.map(p => ({ ...p, quantity: cart[p.id], quotedPrice: "" })),
      customItems: customItems.map(item => ({ ...item, quotedPrice: "" })),
      deliveryLocation, total: null, status: "Order Received", date: new Date().toLocaleString("en-IN")
    };
    if (supabaseReady) {
      supabase.from("orders").insert({ id: order.id, payload: order, status: order.status, is_deleted: false })
        .then(({ error }) => { if (error) showNotice("Order save failed. Please try again: " + error.message); });
    }
    setOrders(old => [order, ...old]);
    setSubmittedOrderId(order.id);
    setCart({}); setCustomItems([]); setCheckout(false);
    setCustomer({ name: "", phone: "", address: "" }); setDeliveryLocation(null); setLocationMessage(""); setView("shop");
    showNotice("Your request has been submitted.");
  }
  async function login(e) {
    e.preventDefault();
    if (!supabaseReady) { showNotice("Supabase is not configured. Add the .env values first."); return; }
    if (adminEmail.trim().toLowerCase() !== ADMIN_EMAIL) { showNotice("This email is not authorised for store administration."); return; }
    if (!adminPassword) { showNotice("Please enter your admin password."); return; }
    const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: adminPassword });
    if (error) showNotice("Login failed: " + error.message);
    else { setAdminPassword(""); setAuthMessage("Login successful."); }
  }
  function updateOrder(id, patch) {
    setOrders(old => old.map(o => o.id === id ? { ...o, ...patch } : o));
    const current = orders.find(o => o.id === id);
    if (supabaseReady && current && admin) {
      const updated = { ...current, ...patch };
      supabase.from("orders").update({ payload: updated, status: updated.status, updated_at: new Date().toISOString() }).eq("id", id)
        .then(({ error }) => { if (error) showNotice("Order update failed: " + error.message); });
    }
  }
  function updateItemQuote(orderId, itemIndex, value, custom = false) {
    setOrders(old => old.map(o => {
      if (o.id !== orderId) return o;
      const key = custom ? "customItems" : "items";
      const updated = [...(o[key] || [])];
      updated[itemIndex] = { ...updated[itemIndex], quotedPrice: value };
      return { ...o, [key]: updated };
    }));
  }
  useEffect(() => {
    if (!supabaseReady || !admin) return;
    const timer = setTimeout(() => {
      orders.forEach(order => supabase.from("orders").update({ payload: order, status: order.status, updated_at: new Date().toISOString() }).eq("id", order.id));
    }, 500);
    return () => clearTimeout(timer);
  }, [orders, admin]);

  function getEstimate(order) {
    const regular = (order.items || []).reduce((s, i) => s + (Number(i.quotedPrice) || 0) * i.quantity, 0);
    const custom = (order.customItems || []).reduce((s, i) => s + (Number(i.quotedPrice) || 0) * (i.quantity || 1), 0);
    return regular + custom;
  }
  function sendEstimate(order) {
    const allItems = [...(order.items || []), ...(order.customItems || [])];
    if (!allItems.length || allItems.some(i => i.quotedPrice === "" || i.quotedPrice == null || Number(i.quotedPrice) < 0)) {
      showNotice("Enter an estimated price for every requested item first."); return;
    }
    const total = getEstimate(order);
    const lines = allItems.map(i => `• ${i.name} x ${i.quantity || 1} — ${money(Number(i.quotedPrice) * (i.quantity || 1))}`);
    const message = `Hello ${order.customer.name},\n\nThank you for your order request at BALAJI HOME NEEDS.\nOrder ID: ${order.id}\n\nEstimated items:\n${lines.join("\n")}\n\nEstimated total: ${money(total)}\n\nPlease reply YES to confirm this order. Prices/availability may be reconfirmed by our store.\nStore WhatsApp: +${STORE_WHATSAPP}`;
    const phone = "91" + order.customer.phone.replace(/\D/g, "").slice(-10);
    updateOrder(order.id, { total, status: "Estimate Sent", estimateSentAt: new Date().toLocaleString("en-IN") });
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }
  function moveOrderToDeleted(order) {
    if (!window.confirm(`Move order ${order.id} to Deleted Orders?`)) return;
    setOrders(old => old.filter(o => o.id !== order.id));
    const deleted = { ...order, deletedAt: new Date().toLocaleString("en-IN") };
    setDeletedOrders(old => [deleted, ...old]);
    if (supabaseReady) supabase.from("orders").update({ payload: deleted, is_deleted: true }).eq("id", order.id);
  }
  function restoreOrder(id) {
    const order = deletedOrders.find(o => o.id === id);
    if (!order) return;
    const { deletedAt, ...restored } = order;
    setOrders(old => [restored, ...old]);
    setDeletedOrders(old => old.filter(o => o.id !== id));
    if (supabaseReady) supabase.from("orders").update({ payload: restored, is_deleted: false }).eq("id", id);
  }
  function permanentlyDeleteOrder(id) {
    if (window.confirm("Permanently delete this order? This cannot be undone.")) setDeletedOrders(old => old.filter(o => o.id !== id));
  }
  function deleteProduct(id) {
    if (window.confirm("Delete this product?")) setProducts(old => old.filter(p => p.id !== id));
  }

  return (
    <>
    <style>{`.product-picture {
  overflow: hidden;
  position: relative;
}
.product-picture img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 150px;
  object-fit: cover;
  border-radius: inherit;
}
.photo-unavailable-label { display:none; min-height:150px; place-items:center; color:#687568; font-size:.85rem; }
.product-picture.photo-unavailable .photo-unavailable-label { display:grid; }
.hero-photo { background-size:cover; background-position:center; background-repeat:no-repeat; }
}`}</style>
    <div className="app-shell">
      {!supabaseReady && <div className="top-strip">Setup required: configure Supabase environment variables before accepting live orders.</div>}
      <div className="top-strip">Fresh groceries • Everyday essentials • Delivered with care <span>Welcome to your neighbourhood store</span></div>
      <header className="header">
        <button className="brand" onClick={() => { setView("shop"); setCategory("All"); }}>
          <span className="brand-icon">🛒</span><span><b>BALAJI</b><small>HOME NEEDS</small></span>
        </button>
        <input className="search-box" placeholder="⌕  Search rice, oil, snacks and more..." value={search}
          onChange={e => { setSearch(e.target.value); setView("shop"); }} />
        <div className="header-actions">
          <button onClick={() => { setView("admin"); setAdmin(false); }}>♙ Admin</button>
          <button className="cart-button" onClick={() => setCheckout(true)}>🛒 Cart <b>{totalCartCount}</b></button>
        </div>
      </header>

      {view === "shop" && <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">✦ YOUR LOCAL GROCERY STORE</span>
            <h1>Everyday needs,<br /><i>delivered with care.</i></h1>
            <p>Choose what your home needs. Send your list to us and receive a personalised estimate on WhatsApp.</p>
            <button className="primary-button" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>Browse products →</button>
            <span className="hero-note">✓ No online prices · Personalised quotation · Confirm before delivery</span>
          </div>
          <div className="hero-image hero-photo" style={{backgroundImage:`linear-gradient(0deg,rgba(20,35,18,.62),rgba(20,35,18,.04)),url(${heroPhotoUrl})`}}><div className="fresh-badge">FRESH<br />DAILY</div><div className="image-caption">Good things <small>for every home.</small></div></div>
        </section>
        <section className="benefits">
          <div>📝 <b>Easy order requests</b><small>Select products and quantities</small></div>
          <div>💬 <b>Personalised estimate</b><small>Receive prices on WhatsApp</small></div>
          <div>🚚 <b>Delivery after confirmation</b><small>We prepare your confirmed order</small></div>
        </section>
        <section className="category-section">
          <div className="section-heading"><div><span className="eyebrow">EXPLORE OUR STORE</span><h2>Shop by category</h2></div></div>
          <div className="category-list">{categories.map((c, i) => <button key={c} className={category === c ? "category active" : "category"}
            onClick={() => { setCategory(c); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>
            <span>{["🛍️","🍚","🫘","🫒","🌶️","🧂","🍪","🍟","🍫","☕","🥛","🍞","🍎","🥕","🧴","🧼","💇","🪥","🧹","🫧","🧺","🍽️","🪔","👶","💊","🥤","🍜","🥜","🐾","📒"][i]}</span>{c}
          </button>)}</div>
        </section>
        <section className="products-section" id="products">
          <div className="section-heading"><div><span className="eyebrow">ADD WHAT YOU NEED</span><h2>{category === "All" ? "Browse all products" : category}</h2></div><span>{filteredProducts.length} items</span></div>
          <div className="product-grid">{filteredProducts.map(p => <article className="product-card" key={p.id}>
            <div className="product-picture"><img src={productPhotoUrl(p)} alt={`Real photo of ${p.name}`} loading="lazy" onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.classList.add("photo-unavailable"); }} /><span className="photo-unavailable-label">Photo unavailable</span></div><div className="product-info"><small>{p.category}</small><h3>{p.name}</h3><p>{p.unit}</p>
              <div className="product-bottom"><b>Add to cart</b>{cart[p.id] ? <div className="quantity"><button onClick={() => changeQty(p.id, -1)}>−</button><b>{cart[p.id]}</b><button onClick={() => changeQty(p.id, 1)}>+</button></div> : <button className="add-button" onClick={() => changeQty(p.id, 1)}>＋ Add</button>}</div>
            </div></article>)}</div>
          {!filteredProducts.length && <p className="empty">No products found. Try another search or request it below.</p>}
        </section>
        <section className="custom-section"><div><span className="eyebrow">CAN'T FIND WHAT YOU NEED?</span><h2>Request any other item</h2><p>Type a product that is not listed. We will check availability and include it in your estimate.</p></div>
          <form onSubmit={addCustomItem}><input value={customItem} onChange={e => setCustomItem(e.target.value)} placeholder="Enter item name..." required /><input aria-label="Quantity" type="number" min="1" step="1" value={customQty} onChange={e => setCustomQty(e.target.value)} style={{maxWidth:110}} /><button className="primary-button">Add to cart</button></form>
        </section>
        {customItems.length > 0 && <p className="custom-added">Requested: {customItems.map(item => `${item.name} × ${item.quantity}`).join(", ")} <button onClick={() => setCustomItems([])}>Clear</button></p>}
      </main>}

      {view === "admin" && <main className="admin-page">
        {!admin ? <form className="login-card" onSubmit={login}><div className="login-icon">🔐</div><h2>Store Admin</h2><p>Sign in using your authorised admin email and password.</p><input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="Admin email" required /><input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Admin password" autoComplete="current-password" required /><button className="primary-button">Login</button>{authMessage && <p className="delivery-note">{authMessage}</p>}<button type="button" className="back-button" onClick={() => setView("shop")}>← Back to store</button></form> :
          <>
            <div className="admin-heading"><div><span className="eyebrow">STORE MANAGEMENT</span><h1>Admin Dashboard</h1><p>Review requests, enter prices and send estimates on WhatsApp.</p></div><button className="back-button" onClick={() => { supabaseReady && supabase.auth.signOut(); setAdmin(false); setView("shop"); }}>← Store</button></div>
            <div className="stats-grid"><div><small>Total requests</small><h2>{orders.length}</h2></div><div><small>New requests</small><h2>{orders.filter(o => o.status === "Order Received").length}</h2></div><div><small>Awaiting confirmation</small><h2>{orders.filter(o => o.status === "Estimate Sent").length}</h2></div><div><small>Confirmed orders</small><h2>{orders.filter(o => ["Customer Confirmed","Preparing","Out for Delivery","Delivered"].includes(o.status)).length}</h2></div></div>
            <section className="panel"><div className="section-heading"><h2>Customer order requests</h2><select value={orderFilter} onChange={e => setOrderFilter(e.target.value)}><option>All</option>{statuses.map(s => <option key={s}>{s}</option>)}</select></div>
              {!orders.filter(o => orderFilter === "All" || o.status === orderFilter).length && <p className="empty">No customer requests yet.</p>}
              {orders.filter(o => orderFilter === "All" || o.status === orderFilter).map(o => <div className="order-card" key={o.id}>
                <div className="order-top"><b>{o.id}</b><span>{o.date}</span><strong>{o.status}</strong></div>
                <p><b>{o.customer.name}</b> · <a href={`tel:${o.customer.phone}`}>{o.customer.phone}</a></p><p>{o.customer.address}</p>
                {o.deliveryLocation && <p className="admin-location">📍 Customer GPS: {o.deliveryLocation.latitude.toFixed(6)}, {o.deliveryLocation.longitude.toFixed(6)} · Accuracy ±{o.deliveryLocation.accuracy} m · <a href={`https://www.google.com/maps?q=${o.deliveryLocation.latitude},${o.deliveryLocation.longitude}`} target="_blank" rel="noreferrer">Open delivery location in Google Maps ↗</a></p>}
                <h4>Requested products — enter your estimate prices</h4>
                {(o.items || []).map((item, idx) => <div className="manage-product" key={item.id}><span>{item.name} × {item.quantity} {item.unit ? `(${item.unit})` : ""}</span><label>₹ <input aria-label={`Price for ${item.name}`} type="number" min="0" step="0.01" placeholder="Enter price" value={item.quotedPrice ?? ""} onChange={e => updateItemQuote(o.id, idx, e.target.value)} style={{width:120}} /></label></div>)}
                {(o.customItems || []).map((item, idx) => <div className="manage-product" key={`${item.name}-${idx}`}><span>Other: {item.name} × {item.quantity || 1}</span><label>₹ <input aria-label={`Price for ${item.name}`} type="number" min="0" step="0.01" placeholder="Enter price" value={item.quotedPrice ?? ""} onChange={e => updateItemQuote(o.id, idx, e.target.value, true)} style={{width:120}} /></label></div>)}
                <div className="total-line"><b>Estimate total</b><strong>{money(getEstimate(o))}</strong></div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                  <button className="primary-button" type="button" onClick={() => sendEstimate(o)}>💬 Save estimate & send WhatsApp</button>
                  <select value={o.status} onChange={e => updateOrder(o.id, {status:e.target.value})}>{statuses.map(s => <option key={s}>{s}</option>)}</select>
                  <button type="button" className="delete-order-button" onClick={() => moveOrderToDeleted(o)}>Move to deleted</button>
                </div>
                {o.status === "Estimate Sent" && <p className="delivery-note">Waiting for customer confirmation on WhatsApp. Change status to “Customer Confirmed” only after they agree.</p>}
              </div>)}
            </section>
            <section className="panel"><div className="section-heading"><h2>Deleted orders ({deletedOrders.length})</h2><button className="back-button" type="button" onClick={() => setShowDeleted(v => !v)}>{showDeleted ? "Hide" : "View deleted orders"}</button></div>
              {showDeleted && (deletedOrders.length ? deletedOrders.map(o => <div className="order-card" key={o.id}><div className="order-top"><b>{o.id}</b><span>Deleted: {o.deletedAt || "—"}</span><strong>{o.status}</strong></div><p>{o.customer?.name} · {o.customer?.phone}</p><div className="deleted-actions"><button className="primary-button" type="button" onClick={() => restoreOrder(o.id)}>Restore order</button><button className="delete-order-button" type="button" onClick={() => permanentlyDeleteOrder(o.id)}>Permanently delete</button></div></div>) : <p className="empty">No deleted orders.</p>)}
            </section>
            <section className="panel"><h2>Manage product catalogue</h2><p className="delivery-note">Add products available in your shop. No prices are shown to customers.</p>
              <form className="add-product-form" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); const name = String(f.get("name")).trim(); if (!name) return; const product = {id:Date.now(),name,category:f.get("category"),unit:f.get("unit") || "Piece",emoji:"🛒",imageUrl:String(f.get("imageUrl") || "").trim()}; setProducts(old => [...old,product]); if (supabaseReady) supabase.from("products").upsert({id:product.id,payload:product}); e.currentTarget.reset(); showNotice("Product added to catalogue."); }}>
                <input name="name" placeholder="Product name" required /><input name="unit" placeholder="Unit e.g. 1 kg" /><input name="imageUrl" type="url" placeholder="Real product photo URL (optional)" /><select name="category">{categories.slice(1).map(c => <option key={c}>{c}</option>)}</select><button className="primary-button">Add product</button>
              </form>
              {products.map(p => <div className="manage-product" key={p.id}><span>{p.emoji} {p.name} · {p.category}</span><button onClick={() => {if(window.confirm("Delete this product?")) setProducts(old => old.filter(x => x.id !== p.id));}}>Delete</button></div>)}
            </section>
            <button className="back-button" onClick={() => {supabaseReady && supabase.auth.signOut(); setAdmin(false);setView("shop");}}>Logout</button>
          </>}
      </main>}

      {checkout && <div className="modal-backdrop" onClick={() => setCheckout(false)}><div className="checkout-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setCheckout(false)}>✕</button><span className="eyebrow">BALAJI HOME NEEDS</span><h2>Your Cart</h2>
        {!count && !customCount ? <p className="empty">Your request list is empty. Add products first.</p> : <>
          <p>Review your requested items. <b>No payment is collected now.</b> We will send an estimate to your WhatsApp.</p>
          <div className="checkout-items">{cartItems.map(p => <div key={p.id}><span>{p.emoji} {p.name} ({p.unit})</span><div className="quantity"><button onClick={() => changeQty(p.id,-1)}>−</button><b>{cart[p.id]}</b><button onClick={() => changeQty(p.id,1)}>+</button></div></div>)}</div>
          {customItems.length > 0 && <div><b>Other requested items:</b>{customItems.map((item,i) => <p key={`${item.name}-${i}`}>• {item.name} × {item.quantity} <button type="button" onClick={() => setCustomItems(old => old.filter((_,idx)=>idx!==i))}>Remove</button></p>)}</div>}
          <p className="delivery-note">The store will check availability, add prices and send you an estimate on WhatsApp. Delivery is arranged only after you confirm.</p>
          <form className="customer-form" onSubmit={submitOrder}><h3>Your details</h3><input required placeholder="Your full name" value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/><input required type="tel" maxLength="10" placeholder="10-digit WhatsApp mobile number" value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value.replace(/\D/g,"")})}/><textarea required placeholder="Full delivery address" value={customer.address} onChange={e=>setCustomer({...customer,address:e.target.value})}/>
            <div className="location-picker"><div><b>Share delivery location (optional)</b><p>Allow location access to help the store find your delivery address.</p></div><button type="button" className="location-button" onClick={captureLocation}>📍 {deliveryLocation ? "Update location" : "Use my current location"}</button>
              {locationMessage && <small>{locationMessage}</small>}
              {deliveryLocation && <div className="location-confirmed">✓ Location saved · <a href={`https://www.google.com/maps?q=${deliveryLocation.latitude},${deliveryLocation.longitude}`} target="_blank" rel="noreferrer">Preview on map</a> <button type="button" onClick={()=>setDeliveryLocation(null)}>Remove</button></div>}
            </div>
            <button className="primary-button" type="submit">Send order for estimate</button></form>
        </>}
      </div></div>}
      {submittedOrderId && <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="checkout-modal" style={{maxWidth:480,textAlign:"center"}}><div className="login-icon">✓</div><span className="eyebrow">REQUEST RECEIVED</span><h2>Thank you!</h2><p>Your order request has been submitted successfully. The store will check availability and send your estimate on WhatsApp.</p><div style={{padding:18,background:"#f4f7f1",borderRadius:12,margin:"18px 0"}}><small>YOUR ORDER ID</small><h2 style={{letterSpacing:2}}>{submittedOrderId}</h2><button type="button" className="back-button" onClick={() => { navigator.clipboard?.writeText(submittedOrderId); showNotice("Order ID copied."); }}>Copy Order ID</button></div><p><b>Please save your Order ID for future reference.</b></p><button className="primary-button" type="button" onClick={() => setSubmittedOrderId("")}>Close</button></div></div>}
      <footer><b>BALAJI HOME NEEDS</b><p>Everyday essentials, delivered with care.</p><small>© {new Date().getFullYear()} Balaji Home Needs. All rights reserved.</small></footer>
      {count + customCount > 0 && view === "shop" && <button className="floating-cart" onClick={()=>setCheckout(true)}>🛒 View Cart · {totalCartCount} items</button>}
      {notice && <div className="toast">{notice}</div>}
    </div>
    </>
  );
}
