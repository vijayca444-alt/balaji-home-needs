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
  // The original 83 catalogue products use the local images in /public/products.
  // Prefer these stable local paths over older URLs saved in localStorage or Supabase.
  const productId = Number(product.id);

  if (Number.isInteger(productId) && productId >= 1 && productId <= 83) {
    return `/products/${String(productId).padStart(3, "0")}.webp`;
  }

  // Newly added products can continue using their own image URL.
  return typeof product.imageUrl === "string" ? product.imageUrl.trim() : "";
};
const heroPhotoUrl = "/kirana-hero.png";
const statuses = ["Order Received", "Estimate Sent", "Customer Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
const recipeBook = [
  { id:"sambar", name:"South Indian Sambar", cuisine:"Tamil Nadu", servings:4, ingredients:[["Toor Dal","1 cup (200 g)","500 g"],["Turmeric Powder","½ tsp","100 g"],["Sambar Powder","2 tbsp","100 g"],["Tomatoes","2 medium","1 kg"],["Onion","1 medium","1 kg"]] },
  { id:"lemon-rice", name:"Lemon Rice", cuisine:"South Indian", servings:4, ingredients:[["Sona Masoori Rice","2 cups (400 g)","1 kg"],["Peanuts","2 tbsp (25 g)","250 g"],["Turmeric Powder","½ tsp","100 g"],["Mustard Seeds","1 tsp","100 g"]] },
  { id:"pongal", name:"Ven Pongal", cuisine:"Tamil Nadu", servings:4, ingredients:[["Sona Masoori Rice","1 cup (200 g)","1 kg"],["Moong Dal","½ cup (100 g)","500 g"],["Cumin Seeds","1 tsp","100 g"],["Cow Ghee","2 tbsp","500 ml"]] },
  { id:"chana", name:"Chana Masala", cuisine:"North Indian", servings:4, ingredients:[["Kabuli Chana","1 cup (200 g)","500 g"],["Onion","2 medium","1 kg"],["Tomatoes","2 medium","1 kg"],["Garam Masala","1 tsp","100 g"],["Coriander Powder","1 tbsp","200 g"]] }
];
// Balaji Home Needs shop location supplied by the owner.
const STORE_LOCATION = { latitude: 17.326766725693464, longitude: 78.52105733068217 };
const DELIVERY_RADIUS_KM = 3;
function distanceInKm(a, b) {
  const toRad = value => value * Math.PI / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

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
  const [deliveryDistanceKm, setDeliveryDistanceKm] = useState(null);
  const [deliveryBlocked, setDeliveryBlocked] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [customItem, setCustomItem] = useState("");
  const [customQty, setCustomQty] = useState("1");
  const [customUnit, setCustomUnit] = useState("500 g");
  const [customRecipeNeed, setCustomRecipeNeed] = useState("");
  const [customItems, setCustomItems] = useState([]);
  const [cartRecipeNeeds, setCartRecipeNeeds] = useState({});
  const [cartPurchaseUnits, setCartPurchaseUnits] = useState({});
  const [adminEmail, setAdminEmail] = useState(ADMIN_EMAIL);
  const [adminPassword, setAdminPassword] = useState("");
  const [admin, setAdmin] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [orderFilter, setOrderFilter] = useState("All");
  const [adminTab, setAdminTab] = useState("overview");
  const [adminProductSearch, setAdminProductSearch] = useState("");
  const [dukandarQuestion, setDukandarQuestion] = useState("");
  const [dukandarReply, setDukandarReply] = useState("Vanakkam! Tell me what you need. I can help find items in our store catalogue.");
  const [recipeImportText, setRecipeImportText] = useState("");
  const [dukandarOpen, setDukandarOpen] = useState(false);

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
    if (!navigator.geolocation) { setLocationMessage("This browser does not support location sharing. Please use a device with GPS to verify delivery eligibility."); return; }
    setLocationMessage("Checking whether your address is within our 3 km delivery area… Please allow location access.");
    navigator.geolocation.getCurrentPosition(
      pos => {
        const location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: Math.round(pos.coords.accuracy) };
        const distance = distanceInKm(STORE_LOCATION, location);
        setDeliveryLocation(location);
        setDeliveryDistanceKm(distance);
        const outside = distance > DELIVERY_RADIUS_KM;
        setDeliveryBlocked(outside);
        setLocationMessage(outside
          ? `Your location is approximately ${distance.toFixed(2)} km from our store, outside our 3 km delivery area.`
          : `Great news! Your location is approximately ${distance.toFixed(2)} km from our store and is within our delivery area.`);
      },
      err => {
        setDeliveryLocation(null); setDeliveryDistanceKm(null); setDeliveryBlocked(false);
        setLocationMessage(err.code === 1 ? "Location permission was denied. Please allow location access so we can verify whether delivery is available." : "Could not get your location. Please try again with GPS enabled.");
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 30000 }
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
  const salesOrders = orders.filter(o => ["Customer Confirmed", "Preparing", "Out for Delivery", "Delivered"].includes(o.status));
  const confirmedValue = salesOrders.reduce((sum, o) => sum + Number(o.total || getOrderValue(o)), 0);
  const uniqueCustomers = new Set(salesOrders.map(o => (o.customer?.phone || o.customer?.name || "").toLowerCase())).size;
  const productSales = Object.values(salesOrders.reduce((acc, order) => {
    (order.items || []).forEach(item => { const key = item.name || "Product"; acc[key] = acc[key] || { name: key, qty: 0, value: 0, category: item.category || "Other" }; acc[key].qty += Number(item.quantity || 0); acc[key].value += Number(item.quotedPrice || 0) * Number(item.quantity || 0); });
    return acc;
  }, {})).sort((a, b) => b.qty - a.qty).slice(0, 6);
  const categorySales = Object.values(salesOrders.reduce((acc, order) => {
    (order.items || []).forEach(item => { const key = item.category || "Other"; acc[key] = acc[key] || { name:key, value:0 }; acc[key].value += Number(item.quotedPrice || 0) * Number(item.quantity || 0); });
    return acc;
  }, {})).sort((a,b)=>b.value-a.value);
  const orderStatusCounts = statuses.map(status => ({ name:status, value:orders.filter(o=>o.status===status).length })).filter(x=>x.value>0);
  const repeatCustomers = Object.values(salesOrders.reduce((acc,o)=>{const key=(o.customer?.phone||o.customer?.name||"unknown").toLowerCase();acc[key]=(acc[key]||0)+1;return acc;},{})).filter(n=>n>1).length;
  function getOrderValue(order) {
    return [...(order.items || []), ...(order.customItems || [])].reduce((sum, item) => sum + Number(item.quotedPrice || 0) * Number(item.quantity || 1), 0);
  }
  function exportSalesCsv() {
    const rows = [["Order ID", "Date", "Customer", "Phone", "Status", "Amount"], ...salesOrders.map(o => [o.id, o.date || "", o.customer?.name || "", o.customer?.phone || "", o.status, Number(o.total || getOrderValue(o)).toFixed(2)])];
    const csv = rows.map(row => row.map(value => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "balaji-sales-report.csv"; a.click(); URL.revokeObjectURL(url);
  }

  function showNotice(message) { setNotice(message); setTimeout(() => setNotice(""), 3000); }
  function changeQty(id, amount) {
    setCart(old => {
      const next = { ...old, [id]: Math.max(0, (old[id] || 0) + amount) };
      if (!next[id]) delete next[id];
      return next;
    });
  }
  function toggleProductPause(id) {
    const updated = products.map(p => p.id === id ? { ...p, paused: !p.paused } : p);
    setProducts(updated);
    const changed = updated.find(p => p.id === id);
    if (supabaseReady && changed) supabase.from("products").upsert({ id: changed.id, payload: changed })
      .then(({ error }) => { if (error) showNotice("Stock status could not be saved: " + error.message); });
    showNotice(changed?.paused ? "Item paused and hidden from customers." : "Item resumed and visible in the store.");
  }
  function addRecipeToCart(recipe) {
    recipe.ingredients.forEach(([name, need, pack]) => {
      const product = products.find(p => p.name.toLowerCase() === name.toLowerCase() && !p.paused);
      if (product) {
        setCart(old => ({ ...old, [product.id]: Math.max(1, Number(old[product.id] || 0)) }));
        setCartRecipeNeeds(old => ({ ...old, [product.id]: need }));
        setCartPurchaseUnits(old => ({ ...old, [product.id]: pack }));
      } else {
        setCustomItems(old => [...old, { name, quantity: 1, purchaseUnit: pack, recipeNeed: need, quotedPrice: "" }]);
      }
    });
    showNotice("Recipe ingredients added. Recipe measurements and shopping pack sizes are kept separate.");
    setCheckout(true);
  }
  function askDukandar(e) {
    e.preventDefault();
    const q = dukandarQuestion.trim().toLowerCase();
    if (!q) return;
    const found = products.filter(p => !p.paused && q.includes(p.name.toLowerCase()));
    if (found.length) {
      found.forEach(p => setCart(old => ({ ...old, [p.id]: Math.max(1, Number(old[p.id] || 0)) })));
      setDukandarReply("Vanakkam! I found " + found.map(p => p.name).join(", ") + " and added the item(s) to your cart. Please review your list.");
    } else {
      setCustomItem(dukandarQuestion);
      setDukandarReply("I couldn't find an exact match. I've copied your request into the item-request box for the shopkeeper to confirm.");
      setView("shop");
      setTimeout(() => document.getElementById("custom-request")?.scrollIntoView({ behavior:"smooth", block:"center" }), 100);
    }
    setDukandarQuestion("");
  }
  function importHelloKitchenIngredients(e) {
    e.preventDefault();
    const pasted = recipeImportText.trim();
    if (!pasted) { showNotice("Paste the ingredient list from Hello Kitchen first."); return; }
    const chunks = pasted
      .replace(/\r/g, "\n")
      .split(/\n|,|;|\u2022/)
      .map(x => x.replace(/^[-*\s]+/, "").trim())
      .filter(Boolean);
    const parsed = chunks.map(chunk => {
      const match = chunk.match(/^(\d+(?:\.\d+)?\s*(?:cups?|tbsp|tablespoons?|tsp|teaspoons?|kg|kgs|g|grams?|ml|l|litres?|liters?|medium|large|small|pieces?|pcs|cloves?|pinch(?:es)?)?)\s+(?:of\s+)?(.+)$/i);
      return { need: match ? match[1].trim() : "As listed in recipe", name: (match ? match[2] : chunk).replace(/[.!]+$/, "").trim() };
    }).filter(x => x.name);
    if (!parsed.length) { showNotice("I couldn't read the ingredient list. Paste one ingredient per line."); return; }
    let matchedCount = 0;
    let customCountAdded = 0;
    parsed.forEach(item => {
      const key = item.name.toLowerCase();
      const product = products.find(p => !p.paused && (p.name.toLowerCase() === key || p.name.toLowerCase().includes(key) || key.includes(p.name.toLowerCase())));
      if (product) {
        matchedCount += 1;
        setCart(old => ({ ...old, [product.id]: Math.max(1, Number(old[product.id] || 0)) }));
        setCartRecipeNeeds(old => ({ ...old, [product.id]: item.need }));
        setCartPurchaseUnits(old => ({ ...old, [product.id]: old[product.id] || product.unit || "1 pack" }));
      } else {
        customCountAdded += 1;
        setCustomItems(old => [...old, { name: item.name, quantity: 1, purchaseUnit: "500 g", recipeNeed: item.need, source: "Hello Kitchen recipe import" }]);
      }
    });
    setRecipeImportText("");
    showNotice(`${parsed.length} ingredients imported: ${matchedCount} matched to store products and ${customCountAdded} sent as custom requests. Review pack sizes in your cart.`);
  }

  function addCustomItem(e) {
    e.preventDefault();
    if (customItem.trim()) {
      setCustomItems(old => [...old, {
        name: customItem.trim(),
        quantity: Math.max(1, Number(customQty) || 1),
        purchaseUnit: customUnit.trim() || "item",
        recipeNeed: customRecipeNeed.trim()
      }]);
      setCustomItem(""); setCustomQty("1"); setCustomUnit("500 g"); setCustomRecipeNeed("");
      showNotice("Item and shopping quantity added to cart.");
    }
  }
  function submitOrder(e) {
    e.preventDefault();
    if (!customer.name.trim() || !/^[6-9]\d{9}$/.test(customer.phone) || !customer.address.trim()) {
      showNotice("Please enter a valid name, 10-digit mobile number and address."); return;
    }
    if (!count && !customCount) { showNotice("Please add at least one item."); return; }
    if (!deliveryLocation) { setLocationMessage("Please share your current location so we can check whether your address is within 3 km of our store."); showNotice("Please verify your delivery location before submitting."); return; }
    const verifiedDistance = distanceInKm(STORE_LOCATION, deliveryLocation);
    setDeliveryDistanceKm(verifiedDistance);
    if (verifiedDistance > DELIVERY_RADIUS_KM) { setDeliveryBlocked(true); showNotice("Sorry, your address is outside our 3 km delivery area."); return; }
    if (deliveryLocation.accuracy > 150) { showNotice("GPS accuracy is low. Please update your location for a reliable delivery check."); return; }
    const order = {
      id: "BH" + Date.now().toString().slice(-8),
      customer: { ...customer },
      items: cartItems.map(p => ({ ...p, quantity: cart[p.id], purchaseUnit: cartPurchaseUnits[p.id] || p.unit || "item", recipeNeed: cartRecipeNeeds[p.id] || "", quotedPrice: "" })),
      customItems: customItems.map(item => ({ ...item, quotedPrice: "" })),
      deliveryLocation, total: null, status: "Order Received", date: new Date().toLocaleString("en-IN")
    };
    if (supabaseReady) {
      supabase.from("orders").insert({ id: order.id, payload: order, status: order.status, is_deleted: false })
        .then(({ error }) => { if (error) showNotice("Order save failed. Please try again: " + error.message); });
    }
    setOrders(old => [order, ...old]);
    setSubmittedOrderId(order.id);
    setCart({}); setCustomItems([]); setCartRecipeNeeds({}); setCartPurchaseUnits({}); setCheckout(false);
    setCustomer({ name: "", phone: "", address: "" }); setDeliveryLocation(null); setDeliveryDistanceKm(null); setDeliveryBlocked(false); setLocationMessage(""); setView("shop");
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
    const lines = allItems.map(i => `• ${i.name}: buying ${i.quantity || 1} × ${i.purchaseUnit || i.unit || "item"}${i.recipeNeed ? ` (recipe needs ${i.recipeNeed})` : ""} — ${money(Number(i.quotedPrice) * (i.quantity || 1))}`);
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
.header-actions button { white-space:nowrap; }
.recipe-page { max-width:1200px; margin:0 auto; padding:24px; }
.recipe-tab-panel { margin-top:18px; }
.dukandar-floating-button { position:fixed; right:22px; bottom:22px; z-index:80; display:flex; align-items:center; gap:10px; border:0; border-radius:999px; padding:12px 18px 12px 12px; background:#244b2c; color:#fff; font-weight:700; box-shadow:0 8px 28px #18351f45; cursor:pointer; }
.dukandar-floating-button span { width:38px; height:38px; display:grid; place-items:center; border-radius:50%; background:#f5e3c5; font-size:23px; }
.dukandar-popup-backdrop { position:fixed; inset:0; z-index:100; background:#15201666; display:flex; align-items:flex-end; justify-content:flex-end; padding:22px; }
.dukandar-popup { width:min(410px,100%); max-height:min(620px,90vh); overflow:hidden; border-radius:20px; background:#fff; box-shadow:0 18px 60px #0004; }
.dukandar-popup-head { display:flex; align-items:center; gap:12px; padding:15px 17px; background:#244b2c; color:#fff; }
.dukandar-popup-avatar { width:46px; height:46px; display:grid; place-items:center; border-radius:50%; background:#f5e3c5; font-size:27px; }
.dukandar-popup-head small { display:block; margin-top:3px; color:#e0eddf; }
.dukandar-popup-head button { margin-left:auto; border:0; background:transparent; color:#fff; font-size:20px; cursor:pointer; }
.dukandar-popup-body { padding:16px; }
.dukandar-chat-bubble,.dukandar-chat-reply { padding:12px 14px; border-radius:14px; background:#f1f6ed; color:#344a34; line-height:1.5; margin-bottom:10px; }
.dukandar-chat-reply { background:#fff7e8; }
.dukandar-popup-form { display:flex; gap:8px; margin-top:14px; }
.dukandar-popup-form input { min-width:0; flex:1; padding:12px; border:1px solid #d3ddcf; border-radius:10px; font:inherit; }
.dukandar-popup-links { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
.dukandar-popup-links button { border:1px solid #d5e1d1; background:#fff; color:#315438; border-radius:9px; padding:9px 11px; cursor:pointer; }
@media(max-width:650px) { .header-actions { flex-wrap:wrap; } .dukandar-popup-backdrop { padding:0; } .dukandar-popup { width:100%; border-radius:20px 20px 0 0; } .recipe-page { padding:14px; } }
`}</style>
    <div className="app-shell">
      {!supabaseReady && <div className="top-strip">Setup required: configure Supabase environment variables before accepting live orders.</div>}
      <div className="top-strip">Fresh groceries • Everyday essentials • Delivered with care <span>Welcome to your neighbourhood store</span></div>
      <header className="header">
        <button className="brand" onClick={() => { setView("shop"); setCategory("All"); }}>
          <span className="brand-icon">🛒</span><span><b>BALAJI</b><small>HOME NEEDS</small></span>
        </button>
        <input className="search-box" placeholder="⌕  Search products — can’t find an item? Request it here..." value={search}
          onChange={e => { setSearch(e.target.value); setView("shop"); }} />
        <div className="header-actions">
          <button type="button" onClick={() => setView("shop")}>Shop</button>
          <button type="button" onClick={() => setView("recipes")}>📖 Recipe Book</button>
          <button type="button" onClick={() => setDukandarOpen(true)}>✨ Ask Dukandar</button>
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
          <div className="hero-image hero-photo" style={{backgroundImage:`linear-gradient(0deg,rgba(20,35,18,.62),rgba(20,35,18,.04)),url(${heroPhotoUrl})`}}><div className="fresh-badge">FRESH<br />DAILY</div></div>
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
        <section className="custom-section" id="custom-request"><div><span className="eyebrow">NEED SOMETHING ELSE?</span><h2>Can’t find an item? Request it here</h2><p>Enter the recipe measurement separately from the pack size you want to buy. The shop will confirm availability.</p></div>
          <form onSubmit={addCustomItem} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:10,width:"100%"}}>
            <input value={customItem} onChange={e => setCustomItem(e.target.value)} placeholder="Enter item name..." required />
            <input value={customRecipeNeed} onChange={e => setCustomRecipeNeed(e.target.value)} placeholder="Recipe needs e.g. 2 cups (400 g)" aria-label="Recipe requirement" />
            <input aria-label="Number of packs" type="number" min="1" step="1" value={customQty} onChange={e => setCustomQty(e.target.value)} placeholder="Packs" />
            <input aria-label="Pack size or purchase unit" value={customUnit} onChange={e => setCustomUnit(e.target.value)} placeholder="Buying size e.g. 500 g" required />
            <button className="primary-button">Add shopping request</button>
          </form>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading"><div><span className="eyebrow">ADD WHAT YOU NEED</span><h2>{category === "All" ? "Browse all products" : category}</h2></div><span>{filteredProducts.length} items</span></div>
          <div className="product-grid">{filteredProducts.map(p => <article className="product-card" key={p.id}>
            <div className="product-picture"><img src={productPhotoUrl(p)} alt={`Real photo of ${p.name}`} loading="lazy" onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.classList.add("photo-unavailable"); }} /><span className="photo-unavailable-label">Photo unavailable</span></div><div className="product-info"><small>{p.category}</small><h3>{p.name}</h3><p>{p.unit}</p>
              <div className="product-bottom"><b>Add to cart</b>{cart[p.id] ? <div className="quantity"><button onClick={() => changeQty(p.id, -1)}>−</button><b>{cart[p.id]}</b><button onClick={() => changeQty(p.id, 1)}>+</button></div> : <button className="add-button" onClick={() => changeQty(p.id, 1)}>＋ Add</button>}</div>
            </div></article>)}</div>
          {!filteredProducts.length && <p className="empty">No products found. Try another search or request it below.</p>}
        </section>
        {customItems.length > 0 && <p className="custom-added">Requested: {customItems.map(item => `${item.name}: buying ${item.quantity} × ${item.purchaseUnit}${item.recipeNeed ? ` (recipe needs ${item.recipeNeed})` : ""}`).join(", ")} <button onClick={() => setCustomItems([])}>Clear</button></p>}
      </main>}


      {view === "recipes" && <main className="recipe-page">
        <div className="section-heading"><div><span className="eyebrow">COOK SOMETHING TODAY</span><h1>Recipe Book</h1><p>Browse recipes, then add the ingredients to your Balaji Home Needs cart.</p></div><button className="back-button" type="button" onClick={() => setView("shop")}>← Back to Shop</button></div>
        <section className="panel recipe-tab-panel" style={{margin:"18px 0"}}>
          <div className="section-heading"><div><span className="eyebrow">COOK SOMETHING TODAY</span><h1>Recipe Book</h1><p>Choose a recipe and add its ingredients to your shopping request.</p></div></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12}}>
            {recipeBook.map(recipe=><article key={recipe.id} style={{padding:14,border:"1px solid #e1e8dc",borderRadius:14,background:"#fff"}}>
              <small style={{color:"#66765e"}}>{recipe.cuisine} · Serves {recipe.servings}</small><h3 style={{margin:"6px 0"}}>{recipe.name}</h3>
              <p style={{fontSize:13,color:"#5f6b5b"}}>{recipe.ingredients.map(x=>`${x[0]} (${x[1]})`).join(" · ")}</p>
              <button className="primary-button" type="button" onClick={()=>addRecipeToCart(recipe)}>Add recipe ingredients</button>
            </article>)}
          </div>
          <div style={{marginTop:18,padding:18,border:"1px solid #d8e6d3",borderRadius:16,background:"linear-gradient(110deg,#f0f8e9,#fff8e9)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:14,flexWrap:"wrap"}}>
              <div style={{flex:"1 1 260px"}}><span className="eyebrow">MORE RECIPE IDEAS</span><h3 style={{margin:"5px 0"}}>Explore Hello Kitchen</h3><p style={{margin:"0 0 8px",color:"#536253"}}>Find a recipe on Hello Kitchen, copy its ingredient list and paste it below. Ask Dukandar will match items with the Balaji Home Needs catalogue.</p></div>
              <a className="primary-button" href="https://www.hellokitchen.in/" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"inline-block"}}>Open Hello Kitchen ↗</a>
            </div>
            <form onSubmit={importHelloKitchenIngredients} style={{marginTop:10}}>
              <label htmlFor="hello-kitchen-ingredients" style={{display:"block",fontWeight:700,marginBottom:7}}>Paste recipe ingredients</label>
              <textarea id="hello-kitchen-ingredients" value={recipeImportText} onChange={e=>setRecipeImportText(e.target.value)} rows={4} placeholder={"Example:\n2 cups rice\n1 onion\n2 tomatoes\n1 tsp turmeric powder"} style={{display:"block",width:"100%",boxSizing:"border-box",padding:12,border:"1px solid #cbd8ca",borderRadius:10,font:"inherit",resize:"vertical"}} />
              <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginTop:10}}><button className="primary-button" type="submit">Import ingredients to cart</button><small style={{color:"#657260"}}>Matched products are added to your cart; unavailable items become custom requests.</small></div>
            </form>
          </div>
        </section>

      </main>}

      {view === "admin" && <main className="admin-page">
        {!admin ? <form className="login-card" onSubmit={login}><div className="login-icon">🔐</div><h2>Store Admin</h2><p>Sign in using your authorised admin email and password.</p><input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="Admin email" required /><input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Admin password" autoComplete="current-password" required /><button className="primary-button">Login</button>{authMessage && <p className="delivery-note">{authMessage}</p>}<button type="button" className="back-button" onClick={() => setView("shop")}>← Back to store</button></form> :
          <>
            <div className="admin-heading"><div><span className="eyebrow">STORE MANAGEMENT</span><h1>Admin Dashboard</h1><p>Review requests, enter prices and send estimates on WhatsApp.</p></div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button className="back-button" onClick={() => { supabaseReady && supabase.auth.signOut(); setAdmin(false); setView("shop"); }}>← Store</button><button className="primary-button" onClick={() => { supabaseReady && supabase.auth.signOut(); setAdmin(false); setView("shop"); }}>Logout</button></div></div>
            <nav style={{display:"flex",gap:8,flexWrap:"wrap",margin:"18px 0"}}>{[["overview","Overview"],["analytics","Analytics & EDA"],["orders","Orders"],["stock","Products & Stock"]].map(([id,label])=><button key={id} type="button" className={adminTab===id?"primary-button":"back-button"} onClick={()=>{setAdminTab(id); document.getElementById(id==="analytics"?"admin-analytics":id==="orders"?"admin-orders":id==="stock"?"admin-stock":"admin-overview")?.scrollIntoView({behavior:"smooth",block:"start"});}}>{label}</button>)}</nav>
            <div className="stats-grid" id="admin-overview"><div><small>Total requests</small><h2>{orders.length}</h2></div><div><small>New requests</small><h2>{orders.filter(o => o.status === "Order Received").length}</h2></div><div><small>Awaiting confirmation</small><h2>{orders.filter(o => o.status === "Estimate Sent").length}</h2></div><div><small>Confirmed orders</small><h2>{orders.filter(o => ["Customer Confirmed","Preparing","Out for Delivery","Delivered"].includes(o.status)).length}</h2></div></div>
            <section className="panel analytics-panel" id="admin-analytics">
              <div className="section-heading"><div><span className="eyebrow">BUSINESS OVERVIEW</span><h2>Retail performance</h2></div><button className="primary-button" type="button" onClick={exportSalesCsv}>Download sales CSV</button></div>
              <p className="delivery-note">Sales figures include confirmed, preparing, out-for-delivery and delivered orders only. Pending estimates and cancelled orders are excluded.</p>
              <div className="stats-grid"><div><small>Confirmed sales value</small><h2>{money(confirmedValue)}</h2></div><div><small>Confirmed orders</small><h2>{salesOrders.length}</h2></div><div><small>Unique customers</small><h2>{uniqueCustomers}</h2></div><div><small>Average order value</small><h2>{money(salesOrders.length ? confirmedValue / salesOrders.length : 0)}</h2></div></div>
              <div className="section-heading"><h2>Top requested products</h2><span>By confirmed quantity</span></div>
              {productSales.length ? <div className="sales-bars">{productSales.map(item => <div className="sales-bar-row" key={item.name}><div><b>{item.name}</b><span>{item.qty} units · {money(item.value)}</span></div><div className="sales-bar-track"><i style={{width: `${Math.max(4, item.qty / productSales[0].qty * 100)}%`}} /></div></div>)}</div> : <p className="empty">Confirmed sales data will appear here after customers confirm orders and item prices are entered.</p>}
            </section>
            <section className="panel" id="admin-orders"><div className="section-heading"><h2>Customer order requests</h2><select value={orderFilter} onChange={e => setOrderFilter(e.target.value)}><option>All</option>{statuses.map(s => <option key={s}>{s}</option>)}</select></div>
              {!orders.filter(o => orderFilter === "All" || o.status === orderFilter).length && <p className="empty">No customer requests yet.</p>}
              {orders.filter(o => orderFilter === "All" || o.status === orderFilter).map(o => <div className="order-card" key={o.id}>
                <div className="order-top"><b>{o.id}</b><span>{o.date}</span><strong>{o.status}</strong></div>
                <p><b>{o.customer.name}</b> · <a href={`tel:${o.customer.phone}`}>{o.customer.phone}</a></p><p>{o.customer.address}</p>
                {o.deliveryLocation && <p className="admin-location">📍 Customer GPS: {o.deliveryLocation.latitude.toFixed(6)}, {o.deliveryLocation.longitude.toFixed(6)} · Accuracy ±{o.deliveryLocation.accuracy} m · <a href={`https://www.google.com/maps?q=${o.deliveryLocation.latitude},${o.deliveryLocation.longitude}`} target="_blank" rel="noreferrer">Open delivery location in Google Maps ↗</a></p>}
                <h4>Requested products — enter your estimate prices</h4>
                {(o.items || []).map((item, idx) => <div className="manage-product" key={item.id}><span><b>{item.name}</b><br/><small>Customer buying: {item.quantity || 1} × {item.purchaseUnit || item.unit || "item"}</small>{item.recipeNeed && <><br/><small>Recipe requires: {item.recipeNeed}</small></>}</span><label>₹ <input aria-label={`Price for ${item.name}`} type="number" min="0" step="0.01" placeholder="Enter price" value={item.quotedPrice ?? ""} onChange={e => updateItemQuote(o.id, idx, e.target.value)} style={{width:120}} /></label></div>)}
                {(o.customItems || []).map((item, idx) => <div className="manage-product" key={`${item.name}-${idx}`}><span><b>Other: {item.name}</b><br/><small>Customer buying: {item.quantity || 1} × {item.purchaseUnit || "item"}</small>{item.recipeNeed && <><br/><small>Recipe requires: {item.recipeNeed}</small></>}</span><label>₹ <input aria-label={`Price for ${item.name}`} type="number" min="0" step="0.01" placeholder="Enter price" value={item.quotedPrice ?? ""} onChange={e => updateItemQuote(o.id, idx, e.target.value, true)} style={{width:120}} /></label></div>)}
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
            <section className="panel" id="admin-stock"><h2>Manage product catalogue & stock visibility</h2><p className="delivery-note">Add products available in your shop. No prices are shown to customers.</p>
              <form className="add-product-form" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); const name = String(f.get("name")).trim(); if (!name) return; const product = {id:Date.now(),name,category:f.get("category"),unit:f.get("unit") || "Piece",emoji:"🛒",imageUrl:String(f.get("imageUrl") || "").trim()}; setProducts(old => [...old,product]); if (supabaseReady) supabase.from("products").upsert({id:product.id,payload:product}); e.currentTarget.reset(); showNotice("Product added to catalogue."); }}>
                <input name="name" placeholder="Product name" required /><input name="unit" placeholder="Unit e.g. 1 kg" /><input name="imageUrl" type="url" placeholder="Real product photo URL (optional)" /><select name="category">{categories.slice(1).map(c => <option key={c}>{c}</option>)}</select><button className="primary-button">Add product</button>
              </form>
              <input value={adminProductSearch} onChange={e=>setAdminProductSearch(e.target.value)} placeholder="Search catalogue..." style={{width:"100%",padding:10,margin:"12px 0",border:"1px solid #ccd8c8",borderRadius:9}}/>
              {products.filter(p=>p.name.toLowerCase().includes(adminProductSearch.toLowerCase())).map(p => <div className="manage-product" key={p.id}><span>{p.emoji} {p.name} · {p.category}<br/><small>{p.paused ? "Paused — hidden from customers" : "Active — visible to customers"}</small></span><div style={{display:"flex",gap:8}}><button type="button" onClick={()=>toggleProductPause(p.id)}>{p.paused ? "Resume stock" : "Pause / Hide"}</button><button onClick={() => {if(window.confirm("Delete this product?")) setProducts(old => old.filter(x => x.id !== p.id));}}>Delete</button></div></div>)}
            </section>

          </>}
      </main>}

      {checkout && <div className="modal-backdrop" onClick={() => setCheckout(false)}><div className="checkout-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setCheckout(false)}>✕</button><span className="eyebrow">BALAJI HOME NEEDS</span><h2>Your Cart</h2>
        {!count && !customCount ? <p className="empty">Your request list is empty. Add products first.</p> : <>
          <p>Review your requested items. <b>No payment is collected now.</b> We will send an estimate to your WhatsApp.</p>
          <div className="checkout-items">{cartItems.map(p => <div key={p.id} style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) auto",gap:10,alignItems:"center",padding:"12px 0"}}>
            <div><b>{p.emoji} {p.name}</b><div style={{fontSize:13,color:"#536253",marginTop:4}}>Buying size: <input aria-label={`Pack size for ${p.name}`} value={cartPurchaseUnits[p.id] ?? p.unit ?? "item"} onChange={e => setCartPurchaseUnits(old => ({...old,[p.id]:e.target.value}))} style={{width:110,padding:6,border:"1px solid #cbd8ca",borderRadius:7}} /></div>
            <div style={{fontSize:13,color:"#536253",marginTop:5}}>Recipe requirement (optional): <input aria-label={`Recipe requirement for ${p.name}`} placeholder="e.g. 2 cups (400 g)" value={cartRecipeNeeds[p.id] || ""} onChange={e => setCartRecipeNeeds(old => ({...old,[p.id]:e.target.value}))} style={{width:"min(100%,220px)",padding:6,border:"1px solid #cbd8ca",borderRadius:7}} /></div>
            <small style={{display:"block",marginTop:4}}>Shopping request: {cart[p.id]} × {cartPurchaseUnits[p.id] ?? p.unit ?? "item"}</small></div>
            <div className="quantity"><button onClick={() => changeQty(p.id,-1)}>−</button><b>{cart[p.id]}</b><button onClick={() => changeQty(p.id,1)}>+</button></div></div>)}</div>
          {customItems.length > 0 && <div><b>Other requested items:</b>{customItems.map((item,i) => <p key={`${item.name}-${i}`}>• {item.name} — buying {item.quantity} × {item.purchaseUnit || "item"}{item.recipeNeed ? `; recipe needs ${item.recipeNeed}` : ""} <button type="button" onClick={() => setCustomItems(old => old.filter((_,idx)=>idx!==i))}>Remove</button></p>)}</div>}
          <p className="delivery-note">The store will check availability, add prices and send you an estimate on WhatsApp. Delivery is arranged only after you confirm.</p>
          <form className="customer-form" onSubmit={submitOrder}><h3>Your details</h3><input required placeholder="Your full name" value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/><input required type="tel" maxLength="10" placeholder="10-digit WhatsApp mobile number" value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value.replace(/\D/g,"")})}/><textarea required placeholder="Full delivery address" value={customer.address} onChange={e=>setCustomer({...customer,address:e.target.value})}/>
            <div className="location-picker"><div><b>Share delivery location (optional)</b><p>Allow location access to help the store find your delivery address.</p></div><button type="button" className="location-button" onClick={captureLocation}>📍 {deliveryLocation ? "Update location" : "Use my current location"}</button>
              {locationMessage && <small style={{display:"block",marginTop:8,color:deliveryBlocked?"#b42318":undefined}}>{locationMessage}</small>}
              {deliveryLocation && <div className="location-confirmed">✓ GPS location checked · {deliveryDistanceKm?.toFixed(2)} km from store · <a href={`https://www.google.com/maps?q=${deliveryLocation.latitude},${deliveryLocation.longitude}`} target="_blank" rel="noreferrer">Preview on map</a> <button type="button" onClick={()=>{setDeliveryLocation(null);setDeliveryDistanceKm(null);setDeliveryBlocked(false);setLocationMessage("Location removed. Share your location again to verify delivery.");}}>Remove</button></div>}
              <small style={{display:"block",marginTop:6}}>Delivery is currently available only within 3 km of Balaji Home Needs.</small>
            </div>
            <button className="primary-button" type="submit" disabled={!deliveryLocation || deliveryBlocked || deliveryDistanceKm > DELIVERY_RADIUS_KM} style={{opacity:(!deliveryLocation || deliveryBlocked || deliveryDistanceKm > DELIVERY_RADIUS_KM)?0.55:1,cursor:(!deliveryLocation || deliveryBlocked || deliveryDistanceKm > DELIVERY_RADIUS_KM)?"not-allowed":"pointer"}}>Send order for estimate</button></form>
        </>}
      </div></div>}
      {deliveryBlocked && <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="checkout-modal" style={{maxWidth:480,textAlign:"center",padding:28}}><div style={{fontSize:46,marginBottom:10}}>💚</div><span className="eyebrow">BALAJI HOME NEEDS</span><h2>We're working hard to reach you!</h2><p>Thank you for choosing Balaji Home Needs. We currently deliver within 3 km of our store. Your location is approximately <b>{deliveryDistanceKm?.toFixed(2)} km</b> away, so delivery is not available there just yet.</p><p>We're working hard to expand our delivery service and hope to serve you soon!</p><button type="button" className="primary-button" style={{width:"100%"}} onClick={()=>{setDeliveryBlocked(false);setCheckout(false);}}>Okay, thank you</button></div></div>}
      {submittedOrderId && <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="checkout-modal" style={{maxWidth:480,textAlign:"center"}}><div className="login-icon">✓</div><span className="eyebrow">REQUEST RECEIVED</span><h2>Thank you!</h2><p>Your order request has been submitted successfully. The store will check availability and send your estimate on WhatsApp.</p><div style={{padding:18,background:"#f4f7f1",borderRadius:12,margin:"18px 0"}}><small>YOUR ORDER ID</small><h2 style={{letterSpacing:2}}>{submittedOrderId}</h2><button type="button" className="back-button" onClick={() => { navigator.clipboard?.writeText(submittedOrderId); showNotice("Order ID copied."); }}>Copy Order ID</button></div><p><b>Please save your Order ID for future reference.</b></p><button className="primary-button" type="button" onClick={() => setSubmittedOrderId("")}>Close</button></div></div>}

      {dukandarOpen && <div className="dukandar-popup-backdrop" onClick={() => setDukandarOpen(false)}>
        <section className="dukandar-popup" role="dialog" aria-modal="true" aria-label="Ask Dukandar assistant" onClick={e => e.stopPropagation()}>
          <div className="dukandar-popup-head"><div className="dukandar-popup-avatar">🧑🏻‍🍳</div><div><b>Ask Dukandar</b><small>Your Balaji Home Needs assistant</small></div><button type="button" aria-label="Close Ask Dukandar" onClick={() => setDukandarOpen(false)}>✕</button></div>
          <div className="dukandar-popup-body"><div className="dukandar-chat-bubble">Vanakkam! 🙏 What groceries do you need? I can check the store catalogue or help you request an item that is not listed.</div>
            {dukandarReply && <div className="dukandar-chat-reply">{dukandarReply}</div>}
            <form onSubmit={askDukandar} className="dukandar-popup-form"><input autoFocus value={dukandarQuestion} onChange={e=>setDukandarQuestion(e.target.value)} placeholder="Ask for an item, e.g. Toor Dal..."/><button className="primary-button" type="submit">Send</button></form>
            <div className="dukandar-popup-links"><button type="button" onClick={()=>{setDukandarOpen(false);setView("recipes");}}>📖 Open Recipe Book</button><button type="button" onClick={()=>{setDukandarOpen(false);setView("shop");}}>🛒 Browse groceries</button></div>
          </div>
        </section>
      </div>}
      {!dukandarOpen && <button type="button" className="dukandar-floating-button" onClick={()=>setDukandarOpen(true)}><span>🧑🏻‍🍳</span> Ask Dukandar</button>}
      <footer><b>BALAJI HOME NEEDS</b><p>Everyday essentials, delivered with care.</p><small>© {new Date().getFullYear()} Balaji Home Needs. All rights reserved.</small></footer>
      {count + customCount > 0 && view === "shop" && <button className="floating-cart" onClick={()=>setCheckout(true)}>🛒 View Cart · {totalCartCount} items</button>}
      {notice && <div className="toast">{notice}</div>}
    </div>
    </>
  );
}
