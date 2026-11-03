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

// Real photographic category images (not AI-generated illustrations).
// Admins can replace these with their own product-photo URLs when adding products.
const categoryPhotos = {
  "Rice & Atta": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700&auto=format&fit=crop&q=85",
  "Dals & Pulses": "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=700&auto=format&fit=crop&q=85",
  "Oils & Ghee": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=700&auto=format&fit=crop&q=85",
  "Spices & Masalas": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=700&auto=format&fit=crop&q=85",
  "Fruits": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=700&auto=format&fit=crop&q=85",
  "Vegetables": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=85",
  "Bakery": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&auto=format&fit=crop&q=85",
  "Dairy": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=700&auto=format&fit=crop&q=85",
  "Snacks": "https://images.unsplash.com/photo-1621939514649-280e2aa2f2f?w=700&auto=format&fit=crop&q=85",
  "default": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&auto=format&fit=crop&q=85"
};
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
