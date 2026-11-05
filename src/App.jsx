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


const recipeBook = [
  {
    id: "veg-biryani", title: "Vegetable Biryani", category: "Lunch & Dinner",
    time: "40 min", difficulty: "Medium", servings: 4, emoji: "🍲",
    description: "A fragrant one-pot rice dish with vegetables and warming spices.",
    ingredients: [
      { name: "Basmati Rice", quantity: 2, unit: "cups" }, { name: "Onion", quantity: 2, unit: "medium" },
      { name: "Tomatoes", quantity: 2, unit: "medium" }, { name: "Carrot", quantity: 1, unit: "cup" },
      { name: "Green Chilli", quantity: 2, unit: "pieces" }, { name: "Curd", quantity: 0.5, unit: "cup" },
      { name: "Coriander Leaves", quantity: 1, unit: "bunch" }, { name: "Garam Masala", quantity: 2, unit: "tsp" }
    ],
    steps: ["Wash and soak the basmati rice for 20 minutes.", "Slice the onions and chop the vegetables and tomatoes.", "Cook onions, tomatoes, vegetables, green chilli and spices until fragrant.", "Add curd, rice and water; mix gently.", "Cover and cook until the rice is tender. Rest for 5 minutes before serving."]
  },
  {
    id: "idli", title: "Soft Idli", category: "Breakfast",
    time: "25 min* plus batter fermentation", difficulty: "Easy", servings: 4, emoji: "🥥",
    description: "Pillowy steamed idlis, perfect with chutney or sambar.",
    ingredients: [
      { name: "Urad Dal", quantity: 1, unit: "cup" }, { name: "Rice", quantity: 3, unit: "cups" },
      { name: "Iodised Salt", quantity: 1, unit: "tsp" }
    ],
    steps: ["Soak rice and urad dal separately for 4–6 hours.", "Grind to a smooth batter and mix with salt.", "Ferment the batter overnight in a warm place.", "Pour into greased idli moulds.", "Steam for 10–12 minutes and serve hot."]
  },
  {
    id: "sambar", title: "Andhra-style Sambar", category: "Lunch & Dinner",
    time: "35 min", difficulty: "Easy", servings: 4, emoji: "🥣",
    description: "Comforting lentil and vegetable sambar with a tangy finish.",
    ingredients: [
      { name: "Toor Dal", quantity: 1, unit: "cup" }, { name: "Tomatoes", quantity: 2, unit: "pieces" },
      { name: "Onion", quantity: 1, unit: "piece" }, { name: "Carrot", quantity: 1, unit: "piece" },
      { name: "Tamarind", quantity: 1, unit: "small lemon-sized ball" }, { name: "Sambar Powder", quantity: 2, unit: "tbsp" },
      { name: "Turmeric Powder", quantity: 0.5, unit: "tsp" }, { name: "Mustard Seeds", quantity: 1, unit: "tsp" }
    ],
    steps: ["Pressure-cook toor dal with turmeric until soft.", "Soak tamarind in warm water and extract the pulp.", "Cook chopped vegetables and onion until tender.", "Add tamarind extract and sambar powder; simmer.", "Stir in mashed dal and simmer for 5 minutes. Temper mustard seeds and add."]
  },
  {
    id: "dosa", title: "Crispy Dosa", category: "Breakfast",
    time: "20 min* plus batter fermentation", difficulty: "Easy", servings: 4, emoji: "🥞",
    description: "Golden, crisp dosa made with a fermented rice and lentil batter.",
    ingredients: [
      { name: "Rice", quantity: 3, unit: "cups" }, { name: "Urad Dal", quantity: 1, unit: "cup" },
      { name: "Iodised Salt", quantity: 1, unit: "tsp" }, { name: "Sunflower Oil", quantity: 2, unit: "tbsp" }
    ],
    steps: ["Soak rice and urad dal separately for 4–6 hours.", "Grind, combine and ferment the batter overnight.", "Add salt and adjust the batter with a little water.", "Spread a ladle of batter thinly on a hot tawa.", "Drizzle oil around the edges and cook until crisp; fold and serve."]
  },
  {
    id: "poha", title: "Quick Vegetable Poha", category: "Breakfast",
    time: "20 min", difficulty: "Easy", servings: 2, emoji: "🍋",
    description: "A light breakfast with flattened rice, vegetables and a gentle spice tempering.",
    ingredients: [
      { name: "Poha", quantity: 2, unit: "cups" }, { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Peanuts", quantity: 0.25, unit: "cup" }, { name: "Green Chilli", quantity: 1, unit: "piece" },
      { name: "Turmeric Powder", quantity: 0.25, unit: "tsp" }, { name: "Coriander Leaves", quantity: 0.25, unit: "bunch" }
    ],
    steps: ["Rinse poha briefly and drain; let it soften.", "Sauté peanuts until crisp and set aside.", "Cook onion and green chilli until soft.", "Add turmeric and poha; toss gently.", "Finish with peanuts and coriander leaves."]
  },
  {
    id: "pakoda", title: "Onion Pakoda", category: "Snacks",
    time: "25 min", difficulty: "Easy", servings: 4, emoji: "🧅",
    description: "Crispy onion fritters for a rainy-day tea-time snack.",
    ingredients: [
      { name: "Besan", quantity: 1, unit: "cup" }, { name: "Onion", quantity: 2, unit: "large" },
      { name: "Green Chilli", quantity: 2, unit: "pieces" }, { name: "Red Chilli Powder", quantity: 0.5, unit: "tsp" },
      { name: "Sunflower Oil", quantity: 2, unit: "cups for frying" }
    ],
    steps: ["Slice onions thinly and chop green chillies.", "Mix onion with chilli powder and a pinch of salt.", "Add besan gradually to make a lightly coated mixture.", "Heat oil and drop small portions carefully.", "Fry until crisp and golden; drain and serve hot."]
  },
  {
    id: "payasam", title: "Rice Payasam", category: "Sweets",
    time: "35 min", difficulty: "Easy", servings: 4, emoji: "🥛",
    description: "A creamy traditional dessert made with rice, milk and cardamom.",
    ingredients: [
      { name: "Rice", quantity: 0.5, unit: "cup" }, { name: "Fresh Milk", quantity: 1, unit: "litre" },
      { name: "Sugar", quantity: 0.5, unit: "cup" }, { name: "Cashew Nuts", quantity: 2, unit: "tbsp" },
      { name: "Raisins", quantity: 1, unit: "tbsp" }, { name: "Cow Ghee", quantity: 1, unit: "tbsp" }
    ],
    steps: ["Wash rice and drain.", "Bring milk to a gentle boil in a heavy pan.", "Add rice and simmer, stirring often, until soft.", "Add sugar and cook until dissolved.", "Fry cashews and raisins in ghee; add to the payasam and serve warm or chilled."]
  },
  {
    id: "lemon-rice", title: "South Indian Lemon Rice", category: "Lunch & Dinner",
    time: "20 min", difficulty: "Easy", servings: 3, emoji: "🍋",
    description: "A bright, tangy rice dish with peanuts and a simple tempering.",
    ingredients: [
      { name: "Rice", quantity: 2, unit: "cups cooked" }, { name: "Peanuts", quantity: 0.25, unit: "cup" },
      { name: "Mustard Seeds", quantity: 1, unit: "tsp" }, { name: "Green Chilli", quantity: 2, unit: "pieces" },
      { name: "Turmeric Powder", quantity: 0.25, unit: "tsp" }, { name: "Coriander Leaves", quantity: 0.25, unit: "bunch" }
    ],
    steps: ["Cook rice and spread it on a plate to cool.", "Roast peanuts until crisp.", "Temper mustard seeds and green chillies in a little oil.", "Add turmeric and cooked rice; toss gently.", "Turn off the heat, add lemon juice and coriander leaves, then mix."]
  }
];

const recipePackages = [
  { id: "breakfast-pack", title: "South Indian Breakfast Pack", description: "Everyday essentials for idli, dosa and upma.", recipeIds: ["idli", "dosa", "poha"], emoji: "🌅" },
  { id: "biryani-pack", title: "Biryani Night Pack", description: "Rice, vegetables and spices for a family biryani.", recipeIds: ["veg-biryani"], emoji: "🍲" },
  { id: "sambar-pack", title: "Sambar & Rice Pack", description: "A pantry starter for a comforting South Indian meal.", recipeIds: ["sambar", "lemon-rice"], emoji: "🥣" },
  { id: "snack-pack", title: "Tea-time Snack Pack", description: "Build a cosy snack break with homemade pakoda.", recipeIds: ["pakoda"], emoji: "☕" },
  { id: "sweet-pack", title: "Festival Sweet Pack", description: "Ingredients for a traditional rice payasam.", recipeIds: ["payasam"], emoji: "🪔" }
];

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
  const [recipeSearch, setRecipeSearch] = useState("");
  const [recipeCategory, setRecipeCategory] = useState("All");
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState([
    { role: "assistant", text: "Namaste! I'm Ask Dukandar. Tell me what you want to cook or which grocery item you need. I can help you explore recipes and add matching store items to your cart." }
  ]);

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
  const salesOrders = orders.filter(o => ["Customer Confirmed", "Preparing", "Out for Delivery", "Delivered"].includes(o.status));
  const confirmedValue = salesOrders.reduce((sum, o) => sum + Number(o.total || getOrderValue(o)), 0);
  const uniqueCustomers = new Set(salesOrders.map(o => (o.customer?.phone || o.customer?.name || "").toLowerCase())).size;
  const productSales = Object.values(salesOrders.reduce((acc, order) => {
    (order.items || []).forEach(item => { const key = item.name || "Product"; acc[key] = acc[key] || { name: key, qty: 0, value: 0 }; acc[key].qty += Number(item.quantity || 0); acc[key].value += Number(item.quotedPrice || 0) * Number(item.quantity || 0); });
    return acc;
  }, {})).sort((a, b) => b.qty - a.qty).slice(0, 6);
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
.recipe-page,.assistant-page{max-width:1200px;margin:0 auto;padding:30px 24px 70px}
.recipe-hero{min-height:300px;border-radius:28px;padding:48px;display:flex;align-items:center;justify-content:space-between;gap:24px;overflow:hidden;background:linear-gradient(120deg,#153d2b,#286b45 62%,#e6a84b);color:#fff;position:relative}
.recipe-hero>div:first-child{max-width:620px;position:relative;z-index:1}.recipe-hero h1{font-size:clamp(2.5rem,5vw,4.6rem);line-height:1.02;margin:12px 0}.recipe-hero p{font-size:1.08rem;line-height:1.7;max-width:560px;color:#edf5eb}.recipe-hero .eyebrow{color:#f5d69b}
.recipe-hero-art{width:300px;height:250px;position:relative;display:grid;place-items:center;flex-shrink:0}.recipe-hero-art span{font-size:150px;filter:drop-shadow(0 18px 18px #102b1b66);animation:recipeFloat 4s ease-in-out infinite}.recipe-hero-art i,.recipe-hero-art b,.recipe-hero-art em{position:absolute;font-style:normal;font-size:42px;animation:recipeFloat 5s ease-in-out infinite}.recipe-hero-art i{top:12px;left:18px}.recipe-hero-art b{right:0;top:30px}.recipe-hero-art em{bottom:10px;left:50px}
@keyframes recipeFloat{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-12px) rotate(4deg)}}
.recipe-feature-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:22px 0 42px}.recipe-feature-strip>div{padding:18px;border:1px solid #e4e9df;border-radius:16px;background:#fff;display:grid;gap:4px;font-size:1.2rem}.recipe-feature-strip small{font-size:.85rem;color:#738071;margin-left:30px}
.recipe-pack-section,.recipe-library{margin:42px 0}.recipe-pack-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}.recipe-pack-card{border:1px solid #e4e9df;border-radius:18px;padding:18px;background:#fff;display:flex;flex-direction:column;align-items:flex-start;gap:9px;transition:transform .2s,box-shadow .2s}.recipe-pack-card:hover,.recipe-card:hover{transform:translateY(-5px);box-shadow:0 14px 34px #173c2515}.recipe-pack-emoji{font-size:36px;background:#f2f6ed;border-radius:14px;width:58px;height:58px;display:grid;place-items:center}.recipe-pack-card h3{font-size:1rem;margin:2px 0}.recipe-pack-card p{font-size:.86rem;color:#667363;line-height:1.5;flex:1}.recipe-pack-card .primary-button{font-size:.78rem;padding:10px 12px;width:100%}
.recipe-tools{display:flex;gap:12px;margin:18px 0 22px}.recipe-tools input{flex:1;min-width:0}.recipe-tools input,.recipe-tools select,.assistant-input-row input{border:1px solid #dce4d9;border-radius:12px;padding:13px 15px;background:#fff;font:inherit}
.recipe-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.recipe-card{border:1px solid #e4e9df;border-radius:20px;overflow:hidden;background:#fff;transition:transform .2s,box-shadow .2s}.recipe-card-art{height:155px;display:grid;place-items:center;position:relative;background:radial-gradient(circle at 50% 45%,#fff7df,#e6f0df 70%,#d7e8d1)}.recipe-card-art span{font-size:82px;filter:drop-shadow(0 8px 8px #5c653522);transition:transform .25s}.recipe-card:hover .recipe-card-art span{transform:scale(1.12) rotate(-5deg)}.recipe-card-art small{position:absolute;top:12px;left:12px;background:#ffffffd9;border-radius:99px;padding:6px 10px;font-size:.72rem}.recipe-card-body{padding:16px}.recipe-meta{display:flex;justify-content:space-between;color:#6d7b6c;font-size:.76rem}.recipe-card h3{margin:10px 0 6px;font-size:1.12rem}.recipe-card p{color:#6b7769;font-size:.87rem;line-height:1.5;min-height:52px}.try-button{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;border-radius:12px;padding:12px 14px;background:#1c5638;color:white;font-weight:800;letter-spacing:.08em;cursor:pointer}.try-button span{font-size:1.2rem}.recipe-modal-backdrop{position:fixed;inset:0;background:#102317a8;z-index:1200;display:grid;place-items:center;padding:20px;animation:fadeIn .2s ease}.recipe-detail-modal{width:min(980px,100%);max-height:90vh;overflow:auto;border-radius:22px;background:#fff;position:relative;box-shadow:0 24px 80px #0004;animation:modalUp .25s ease}.recipe-detail-banner{display:flex;align-items:center;gap:22px;padding:30px;background:linear-gradient(120deg,#edf5e8,#fff5df)}.recipe-detail-banner>span{font-size:86px}.recipe-detail-banner h2{font-size:2rem;margin:6px 0}.recipe-detail-banner p{color:#62715f;margin:0}.recipe-detail-content{display:grid;grid-template-columns:1fr 1.2fr;gap:30px;padding:28px}.recipe-detail-content h3{margin:0 0 16px}.recipe-ingredient{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #edf0eb;font-size:.92rem}.recipe-ingredient b{color:#526b50}.recipe-add-all{width:100%;margin-top:18px}.recipe-steps{padding-left:22px}.recipe-steps li{padding:0 0 16px 5px;color:#1d5638}.recipe-steps li span{display:block;color:#526052;line-height:1.55;margin-top:4px}.recipe-detail-modal .modal-close{position:sticky;top:12px;float:right;margin:12px 12px -50px 0;z-index:2}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes modalUp{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}
.assistant-page{max-width:900px}.assistant-hero{text-align:center;padding:34px 20px 26px;background:radial-gradient(ellipse at 50% 20%,#e9f5e6,transparent 65%)}.assistant-orb{width:112px;height:112px;border-radius:36px;background:linear-gradient(145deg,#1c593a,#80b66d);margin:0 auto 20px;display:grid;place-items:center;position:relative;box-shadow:0 16px 36px #1c593a35;animation:assistantBob 3.2s ease-in-out infinite}.assistant-orb span{font-size:58px}.assistant-orb i,.assistant-orb b{position:absolute;color:#fff;font-style:normal}.assistant-orb i{right:-8px;top:4px;font-size:26px}.assistant-orb b{left:-10px;bottom:2px;font-size:20px}@keyframes assistantBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.assistant-hero h1{font-size:clamp(2.4rem,5vw,3.7rem);color:#1c5638;margin:8px 0}.assistant-hero p{max-width:640px;margin:0 auto;color:#667363;line-height:1.65}.assistant-capabilities{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:20px 0}.assistant-capabilities span{padding:8px 12px;border-radius:99px;background:#f0f5ec;color:#36583d;font-size:.85rem}
.assistant-chat{border:1px solid #e1e9dd;border-radius:22px;overflow:hidden;background:#fff;box-shadow:0 14px 40px #1b3d2510}.assistant-chat-head{display:flex;align-items:center;gap:12px;padding:16px 20px;background:#174b32;color:#fff}.assistant-avatar{width:42px;height:42px;border-radius:14px;background:#ffffff20;display:grid;place-items:center;font-size:25px}.assistant-chat-head small{display:block;color:#cfe1d0;font-size:.78rem;margin-top:3px}.assistant-chat-head small i{display:inline-block;width:7px;height:7px;border-radius:50%;background:#8ce0a0;margin-right:6px}.assistant-messages{padding:22px;min-height:260px;max-height:420px;overflow:auto;background:linear-gradient(#fbfdf9,#fff)}.assistant-message{display:flex;align-items:flex-start;gap:9px;margin:0 0 16px;max-width:86%}.assistant-message>span{font-size:22px}.assistant-message p{margin:0;padding:12px 15px;border-radius:4px 16px 16px;background:#eff5eb;color:#344b36;line-height:1.55}.assistant-message.user{margin-left:auto;justify-content:flex-end}.assistant-message.user p{background:#1e5a3a;color:#fff;border-radius:16px 4px 16px 16px}.assistant-suggestions{display:flex;gap:8px;flex-wrap:wrap;padding:0 18px 16px}.assistant-suggestions button{border:1px solid #d9e5d4;background:#fff;border-radius:99px;padding:8px 12px;color:#416144;cursor:pointer;font-size:.8rem}.assistant-input-row{display:flex;gap:10px;padding:16px;border-top:1px solid #edf0eb}.assistant-input-row input{flex:1;min-width:0}.assistant-note{text-align:center;color:#899286;font-size:.76rem;padding:0 20px 16px}
@media(max-width:900px){.recipe-pack-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.recipe-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.recipe-hero{padding:32px}.recipe-hero-art{width:200px}.recipe-hero-art span{font-size:115px}}
@media(max-width:600px){.recipe-page,.assistant-page{padding:18px 14px 50px}.recipe-hero{padding:28px 22px;min-height:0}.recipe-hero-art{display:none}.recipe-feature-strip{grid-template-columns:1fr;gap:8px;margin-bottom:28px}.recipe-pack-grid{grid-template-columns:1fr 1fr;gap:9px}.recipe-pack-card{padding:12px}.recipe-pack-card .primary-button{font-size:.7rem}.recipe-grid{grid-template-columns:1fr 1fr;gap:10px}.recipe-card-art{height:115px}.recipe-card-art span{font-size:60px}.recipe-card-body{padding:11px}.recipe-card h3{font-size:.96rem}.recipe-card p{font-size:.78rem;min-height:62px}.recipe-meta{font-size:.67rem}.recipe-tools{flex-direction:column}.recipe-detail-content{grid-template-columns:1fr;padding:20px}.recipe-detail-banner{padding:24px 18px;gap:12px}.recipe-detail-banner>span{font-size:58px}.recipe-detail-banner h2{font-size:1.45rem}.assistant-input-row{padding:10px}.assistant-suggestions{padding:0 10px 12px}.assistant-message{max-width:96%}}

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
          <button onClick={() => setView("recipes")}>📖 Recipe Book</button>
          <button onClick={() => setView("assistant")}>✨ Ask Dukandar</button>
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


      {view === "recipes" && <main className="recipe-page">
        <section className="recipe-hero">
          <div><span className="eyebrow">BALAJI HOME NEEDS · KITCHEN COMPANION</span><h1>Recipe Book</h1><p>Discover something delicious, learn step by step, and add the ingredients to your grocery request in one tap.</p><button className="primary-button" onClick={() => document.getElementById("recipe-library")?.scrollIntoView({behavior:"smooth"})}>Explore recipes ↓</button></div>
          <div className="recipe-hero-art" aria-hidden="true"><span>🍲</span><i>🥕</i><b>🥬</b><em>🌶️</em></div>
        </section>
        <section className="recipe-feature-strip"><div>🍽️ <b>Everyday recipes</b><small>Breakfast to dinner</small></div><div>⏱️ <b>Cooking time</b><small>Quick ideas and family meals</small></div><div>🛒 <b>Shop ingredients</b><small>Send the list to your cart</small></div></section>
        <section className="recipe-pack-section"><div className="section-heading"><div><span className="eyebrow">CURATED FOR YOUR KITCHEN</span><h2>Recommended food packages</h2></div></div><div className="recipe-pack-grid">{recipePackages.map(pack => <article className="recipe-pack-card" key={pack.id}><div className="recipe-pack-emoji">{pack.emoji}</div><h3>{pack.title}</h3><p>{pack.description}</p><button className="primary-button" onClick={() => addPackageToCart(pack)}>＋ Add package ingredients</button></article>)}</div></section>
        <section id="recipe-library" className="recipe-library"><div className="section-heading"><div><span className="eyebrow">FIND YOUR NEXT FAVOURITE</span><h2>Explore the recipe collection</h2></div><span>{recipeBook.length} recipes</span></div>
          <div className="recipe-tools"><input value={recipeSearch} onChange={e=>setRecipeSearch(e.target.value)} placeholder="Search dishes or ingredients..." /><select value={recipeCategory} onChange={e=>setRecipeCategory(e.target.value)}><option>All</option>{["Breakfast","Lunch & Dinner","Snacks","Sweets"].map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="recipe-grid">{recipeBook.filter(r=>(recipeCategory==="All"||r.category===recipeCategory)&&(`${r.title} ${r.ingredients.map(i=>i.name).join(" ")}`).toLowerCase().includes(recipeSearch.toLowerCase())).map(recipe=><article className="recipe-card" key={recipe.id}><div className="recipe-card-art"><span>{recipe.emoji}</span><small>{recipe.category}</small></div><div className="recipe-card-body"><div className="recipe-meta"><span>⏱ {recipe.time}</span><span>{recipe.difficulty}</span></div><h3>{recipe.title}</h3><p>{recipe.description}</p><button className="try-button" onClick={()=>setActiveRecipe(recipe)}>TRY ME <span>→</span></button></div></article>)}</div>
          {!recipeBook.filter(r=>(recipeCategory==="All"||r.category===recipeCategory)&&(`${r.title} ${r.ingredients.map(i=>i.name).join(" ")}`).toLowerCase().includes(recipeSearch.toLowerCase())).length&&<p className="empty">No recipes match that search. Try another dish or ingredient.</p>}
        </section>
        {activeRecipe && <div className="recipe-modal-backdrop" role="dialog" aria-modal="true" onClick={()=>setActiveRecipe(null)}><article className="recipe-detail-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setActiveRecipe(null)}>✕</button><div className="recipe-detail-banner"><span>{activeRecipe.emoji}</span><div><small>{activeRecipe.category} · {activeRecipe.time}</small><h2>{activeRecipe.title}</h2><p>{activeRecipe.description}</p></div></div><div className="recipe-detail-content"><div><h3>Ingredients · Serves {activeRecipe.servings}</h3>{activeRecipe.ingredients.map(item=><div className="recipe-ingredient" key={item.name}><span>{item.name}</span><b>{item.quantity} {item.unit}</b></div>)}<button className="primary-button recipe-add-all" onClick={()=>addRecipeToCart(activeRecipe)}>＋ Add all ingredients to cart</button></div><div><h3>Let's cook</h3><ol className="recipe-steps">{activeRecipe.steps.map((step,i)=><li key={i}><b>Step {i+1}</b><span>{step}</span></li>)}</ol><button className="back-button" onClick={()=>{setActiveRecipe(null);setView("assistant");setAssistantInput(`Help me cook ${activeRecipe.title}`);}}>Ask Dukandar about this recipe ↗</button></div></div></article></div>}
      </main>}

      {view === "assistant" && <main className="assistant-page">
        <section className="assistant-hero"><div className="assistant-orb"><span>🧑‍🍳</span><i>✦</i><b>✧</b></div><span className="eyebrow">YOUR FRIENDLY KITCHEN & GROCERY GUIDE</span><h1>Ask Dukandar</h1><p>Tell me what you want to cook, what you need from the store, or which recipe you would like to try.</p><div className="assistant-capabilities"><span>🍲 Recipe ideas</span><span>🛍️ Product finder</span><span>🥕 Ingredient help</span></div></section>
        <section className="assistant-chat"><div className="assistant-chat-head"><div className="assistant-avatar">🧑‍🍳</div><div><b>Ask Dukandar</b><small><i></i> Ready to help</small></div></div><div className="assistant-messages">{assistantMessages.map((message,index)=><div key={index} className={`assistant-message ${message.role}`}>{message.role==="assistant"&&<span>🧑‍🍳</span>}<p>{message.text}</p></div>)}</div><div className="assistant-suggestions">{["Suggest breakfast recipes","What do I need for biryani?","Find rice in the store","Show me quick snacks"].map(q=><button key={q} onClick={()=>setAssistantInput(q)}>{q}</button>)}</div><form className="assistant-input-row" onSubmit={sendAssistantMessage}><input value={assistantInput} onChange={e=>setAssistantInput(e.target.value)} placeholder="Ask Dukandar anything..." /><button className="primary-button" type="submit">Send ↑</button></form><p className="assistant-note">Ask Dukandar currently uses the store catalogue and curated recipe knowledge. Live AI-generated answers require a secure server-side AI connection.</p></section>
      </main>}

      {view === "admin" && <main className="admin-page">
        {!admin ? <form className="login-card" onSubmit={login}><div className="login-icon">🔐</div><h2>Store Admin</h2><p>Sign in using your authorised admin email and password.</p><input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="Admin email" required /><input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Admin password" autoComplete="current-password" required /><button className="primary-button">Login</button>{authMessage && <p className="delivery-note">{authMessage}</p>}<button type="button" className="back-button" onClick={() => setView("shop")}>← Back to store</button></form> :
          <>
            <div className="admin-heading"><div><span className="eyebrow">STORE MANAGEMENT</span><h1>Admin Dashboard</h1><p>Review requests, enter prices and send estimates on WhatsApp.</p></div><button className="back-button" onClick={() => { supabaseReady && supabase.auth.signOut(); setAdmin(false); setView("shop"); }}>← Store</button></div>
            <div className="stats-grid"><div><small>Total requests</small><h2>{orders.length}</h2></div><div><small>New requests</small><h2>{orders.filter(o => o.status === "Order Received").length}</h2></div><div><small>Awaiting confirmation</small><h2>{orders.filter(o => o.status === "Estimate Sent").length}</h2></div><div><small>Confirmed orders</small><h2>{orders.filter(o => ["Customer Confirmed","Preparing","Out for Delivery","Delivered"].includes(o.status)).length}</h2></div></div>
            <section className="panel analytics-panel">
              <div className="section-heading"><div><span className="eyebrow">BUSINESS OVERVIEW</span><h2>Retail performance</h2></div><button className="primary-button" type="button" onClick={exportSalesCsv}>Download sales CSV</button></div>
              <p className="delivery-note">Sales figures include confirmed, preparing, out-for-delivery and delivered orders only. Pending estimates and cancelled orders are excluded.</p>
              <div className="stats-grid"><div><small>Confirmed sales value</small><h2>{money(confirmedValue)}</h2></div><div><small>Confirmed orders</small><h2>{salesOrders.length}</h2></div><div><small>Unique customers</small><h2>{uniqueCustomers}</h2></div><div><small>Average order value</small><h2>{money(salesOrders.length ? confirmedValue / salesOrders.length : 0)}</h2></div></div>
              <div className="section-heading"><h2>Top requested products</h2><span>By confirmed quantity</span></div>
              {productSales.length ? <div className="sales-bars">{productSales.map(item => <div className="sales-bar-row" key={item.name}><div><b>{item.name}</b><span>{item.qty} units · {money(item.value)}</span></div><div className="sales-bar-track"><i style={{width: `${Math.max(4, item.qty / productSales[0].qty * 100)}%`}} /></div></div>)}</div> : <p className="empty">Confirmed sales data will appear here after customers confirm orders and item prices are entered.</p>}
            </section>
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
