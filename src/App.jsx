import { useEffect, useMemo, useState } from "react";
import "./App.css";
import "./RecipeBookDukandar.css";
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

function getQuantityOptions(product) {
  const unit = String(product.unit || "").toLowerCase();
  const category = String(product.category || "").toLowerCase();
  if (/ml|litre|liter|\b1 l\b|\b2 l\b/.test(unit) || category.includes("oils") || /oil|cleaner|handwash|shampoo|milk|drink|water/.test(product.name || "")) {
    return ["50 ml", "100 ml", "250 ml", "500 ml", "750 ml", "1 L", "2 L", "5 L"];
  }
  if (/piece|pack|bottle|set|dozen|bunch/.test(unit)) {
    const base = unit.includes("dozen") ? ["1 Dozen", "2 Dozen", "3 Dozen"]
      : unit.includes("bunch") ? ["1 Bunch", "2 Bunches", "3 Bunches"]
      : unit.includes("set") ? ["1 Set", "2 Sets", "3 Sets"]
      : unit.includes("bottle") ? ["1 Bottle", "2 Bottles", "3 Bottles", "6 Bottles"]
      : unit.includes("piece") ? ["1 Piece", "2 Pieces", "3 Pieces", "6 Pieces", "12 Pieces"]
      : ["1 Pack", "2 Packs", "3 Packs", "6 Packs", "12 Packs"];
    return base;
  }
  return ["50 g", "100 g", "250 g", "500 g", "750 g", "1 kg", "2 kg", "5 kg", "10 kg"];
}

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
  {id:"veg-biryani",name:"Vegetable Biryani",cuisine:"Indian",category:"Indian favourites",time:"45 min",difficulty:"Medium",servings:4,emoji:"🍲",description:"Fragrant basmati rice layered with vegetables, herbs and warming spices.",ingredients:[["Basmati Rice","2 cups","1 kg"],["Onion","2 medium","1 kg"],["Tomatoes","2 medium","1 kg"],["Carrot","1 cup","1 kg"],["Green Chilli","2 pieces","250 g"],["Curd","½ cup","500 g"],["Coriander Leaves","1 bunch","Bunch"],["Garam Masala","2 tsp","100 g"]],steps:["Wash and soak the basmati rice for 20 minutes.","Slice onions and chop the vegetables.","Cook onions, tomatoes, vegetables and spices until fragrant.","Add curd, herbs, rice and water.","Cover and cook until the rice is tender. Rest before serving."]},
  {id:"idli",name:"Soft Idli",cuisine:"Indian",category:"Breakfast",time:"25 min + fermentation",difficulty:"Easy",servings:4,emoji:"🥥",description:"Soft steamed rice cakes served with chutney or sambar.",ingredients:[["Urad Dal","1 cup","500 g"],["Sona Masoori Rice","3 cups","1 kg"],["Iodised Salt","1 tsp","1 kg"]],steps:["Soak rice and urad dal separately for 4–6 hours.","Grind to a smooth batter and mix with salt.","Ferment overnight in a warm place.","Pour into greased idli moulds and steam for 10–12 minutes."]},
  {id:"andhra-sambar",name:"Andhra Sambar",cuisine:"Indian",category:"Indian favourites",time:"35 min",difficulty:"Easy",servings:4,emoji:"🥣",description:"Tangy lentils simmered with vegetables and aromatic spices.",ingredients:[["Toor Dal","1 cup","1 kg"],["Tomatoes","2 pieces","1 kg"],["Onion","1 medium","1 kg"],["Carrot","1 piece","1 kg"],["Sambar Powder","2 tbsp","100 g"],["Turmeric Powder","½ tsp","100 g"],["Mustard Seeds","1 tsp","100 g"]],steps:["Pressure-cook dal with turmeric until soft.","Cook chopped vegetables and onion until tender.","Add sambar powder and simmer.","Stir in mashed dal and finish with a mustard-seed tempering."]},
  {id:"masala-dosa",name:"Masala Dosa",cuisine:"Indian",category:"Breakfast",time:"30 min + batter",difficulty:"Medium",servings:4,emoji:"🥞",description:"Crisp golden dosa with a comforting potato filling.",ingredients:[["Sona Masoori Rice","3 cups","1 kg"],["Urad Dal","1 cup","500 g"],["Potato","4 medium","1 kg"],["Onion","1 medium","1 kg"],["Mustard Seeds","1 tsp","100 g"],["Sunflower Oil","2 tbsp","1 L"]],steps:["Prepare and ferment rice-and-dal batter.","Boil and mash potatoes; sauté with onion and mustard seeds.","Spread batter thinly on a hot pan.","Cook until crisp, add potato masala and fold."]},
  {id:"poha",name:"Vegetable Poha",cuisine:"Indian",category:"Breakfast",time:"20 min",difficulty:"Easy",servings:2,emoji:"🍋",description:"A quick, light breakfast with flattened rice, peanuts and vegetables.",ingredients:[["Poha","2 cups","500 g"],["Onion","1 piece","1 kg"],["Peanuts","¼ cup","250 g"],["Green Chilli","1 piece","250 g"],["Turmeric Powder","½ tsp","100 g"]],steps:["Rinse poha briefly and drain.","Sauté onion, chilli and peanuts.","Add turmeric and poha; toss gently until warm.","Finish with lemon and coriander if available."]},
  {id:"chole",name:"Punjabi Chole",cuisine:"Indian",category:"Indian favourites",time:"50 min",difficulty:"Medium",servings:4,emoji:"🫘",description:"Chickpeas in a rich, tangy North Indian masala.",ingredients:[["Kabuli Chana","1 cup","500 g"],["Onion","2 medium","1 kg"],["Tomatoes","2 medium","1 kg"],["Garam Masala","1 tsp","100 g"],["Coriander Powder","1 tbsp","200 g"]],steps:["Soak chickpeas overnight and pressure-cook until tender.","Cook onion and tomato with spices.","Add chickpeas and some cooking water.","Simmer until thick and serve hot."]},
  {id:"paneer-butter",name:"Paneer Butter Masala",cuisine:"Indian",category:"Indian favourites",time:"35 min",difficulty:"Medium",servings:4,emoji:"🧀",description:"Paneer cubes in a creamy tomato and butter gravy.",ingredients:[["Paneer","250 g","200 g"],["Tomatoes","4 medium","1 kg"],["Onion","1 medium","1 kg"],["Butter","2 tbsp","Pack"],["Garam Masala","1 tsp","100 g"]],steps:["Cook tomatoes and onion until soft, then blend.","Simmer the sauce with butter and spices.","Add paneer cubes and a little water or cream.","Cook gently for 5 minutes and serve."]},
  {id:"lemon-rice",name:"Lemon Rice",cuisine:"Indian",category:"Quick meals",time:"20 min",difficulty:"Easy",servings:3,emoji:"🍋",description:"Bright lemon rice with peanuts and a fragrant tempering.",ingredients:[["Sona Masoori Rice","2 cups","1 kg"],["Peanuts","2 tbsp","250 g"],["Turmeric Powder","½ tsp","100 g"],["Mustard Seeds","1 tsp","100 g"]],steps:["Cook rice and let it cool slightly.","Temper mustard seeds and peanuts in oil.","Add turmeric and cooked rice.","Switch off the heat and mix in lemon juice and salt."]},
  {id:"rajma",name:"Rajma Masala",cuisine:"Indian",category:"Indian favourites",time:"55 min",difficulty:"Medium",servings:4,emoji:"🍛",description:"Kidney beans simmered in a homestyle tomato gravy.",ingredients:[["Rajma","1 cup","500 g"],["Onion","2 medium","1 kg"],["Tomatoes","3 medium","1 kg"],["Garam Masala","1 tsp","100 g"]],steps:["Soak rajma overnight and pressure-cook until soft.","Prepare onion-tomato masala.","Add rajma and cooking liquid.","Simmer until creamy and serve with rice."]},
  {id:"pasta",name:"Creamy Tomato Pasta",cuisine:"Italian",category:"World kitchen",time:"25 min",difficulty:"Easy",servings:2,emoji:"🍝",description:"Comforting pasta tossed in a creamy tomato sauce.",ingredients:[["Pasta","200 g","Pack"],["Tomatoes","3 medium","1 kg"],["Fresh Milk","½ cup","500 ml"],["Butter","1 tbsp","Pack"]],steps:["Boil pasta until just tender and reserve some pasta water.","Cook chopped tomatoes in butter until soft.","Add milk and simmer gently.","Toss pasta through the sauce and serve."]},
  {id:"fried-rice",name:"Vegetable Fried Rice",cuisine:"Chinese",category:"World kitchen",time:"20 min",difficulty:"Easy",servings:3,emoji:"🥡",description:"Quick wok-style rice with crunchy vegetables.",ingredients:[["Basmati Rice","2 cups","1 kg"],["Carrot","½ cup","1 kg"],["Onion","1 medium","1 kg"],["Green Chilli","1 piece","250 g"]],steps:["Cook rice and cool completely.","Stir-fry chopped vegetables on high heat.","Add rice and season to taste.","Toss well and serve hot."]},
  {id:"pancakes",name:"Fluffy Pancakes",cuisine:"American",category:"World kitchen",time:"20 min",difficulty:"Easy",servings:3,emoji:"🥞",description:"Soft breakfast pancakes with a golden outside.",ingredients:[["Wheat Atta","1 cup","1 kg"],["Fresh Milk","¾ cup","500 ml"],["Sugar","2 tbsp","1 kg"],["Butter","2 tbsp","Pack"]],steps:["Mix flour, sugar and milk into a smooth batter.","Rest for 5 minutes.","Pour small portions onto a lightly buttered pan.","Flip when bubbles appear and cook until golden."]},
  {id:"mexican-beans",name:"Mexican-Style Bean Bowl",cuisine:"Mexican",category:"World kitchen",time:"25 min",difficulty:"Easy",servings:2,emoji:"🌮",description:"A colourful bowl with spiced beans, rice and fresh toppings.",ingredients:[["Rajma","1 cup","500 g"],["Basmati Rice","1 cup","1 kg"],["Tomatoes","2 medium","1 kg"],["Onion","1 medium","1 kg"]],steps:["Cook rice and keep warm.","Cook beans until tender.","Sauté onion and tomatoes with spices, then add beans.","Serve beans over rice with fresh toppings."]},
  {id:"greek-salad",name:"Greek-Style Salad",cuisine:"Mediterranean",category:"World kitchen",time:"15 min",difficulty:"Easy",servings:2,emoji:"🥗",description:"A fresh crunchy salad with tomato, onion and a simple dressing.",ingredients:[["Tomatoes","2 medium","1 kg"],["Onion","½ medium","1 kg"],["Cucumber","1 medium","1 kg"],["Olive Oil","1 tbsp","Bottle"]],steps:["Chop tomatoes, cucumber and onion.","Whisk olive oil with lemon, salt and pepper.","Toss gently and serve chilled."]},
  {id:"thai-curry",name:"Thai-Inspired Coconut Curry",cuisine:"Thai",category:"World kitchen",time:"30 min",difficulty:"Medium",servings:3,emoji:"🥥",description:"A fragrant coconut curry with vegetables and a gentle chilli warmth.",ingredients:[["Coconut Milk","1 can","Pack"],["Carrot","1 cup","1 kg"],["Onion","1 medium","1 kg"],["Green Chilli","1 piece","250 g"],["Rice","2 cups","1 kg"]],steps:["Cook rice separately.","Sauté onion and vegetables.","Add coconut milk and curry seasoning.","Simmer until vegetables are tender and serve with rice."]},
  {id:"chocolate-cookies",name:"Chocolate Chip Cookies",cuisine:"American",category:"Desserts",time:"30 min",difficulty:"Easy",servings:12,emoji:"🍪",description:"Simple home-baked cookies with crisp edges and soft centres.",ingredients:[["Wheat Atta","1½ cups","1 kg"],["Sugar","½ cup","1 kg"],["Butter","½ cup","Pack"],["Milk Chocolate","½ cup","Pack"]],steps:["Cream butter and sugar.","Mix in flour and chopped chocolate.","Shape into small balls and flatten slightly.","Bake at 180°C until the edges turn golden."]}

  ,{id:"gujarati-khichdi",name:"Gujarati Khichdi",cuisine:"Indian",category:"Indian favourites",time:"30 min",difficulty:"Easy",servings:3,emoji:"🍚",description:"A gentle one-pot rice and lentil comfort meal.",ingredients:[["Sona Masoori Rice","1 cup","1 kg"],["Moong Dal","½ cup","1 kg"],["Turmeric Powder","½ tsp","100 g"],["Cow Ghee","1 tbsp","500 ml"]],steps:["Rinse rice and dal together.","Pressure-cook with water, turmeric and salt until soft.","Finish with a spoon of ghee and serve warm."]}
  ,{id:"maharashtrian-misal",name:"Maharashtrian Misal",cuisine:"Indian",category:"Indian favourites",time:"40 min",difficulty:"Medium",servings:4,emoji:"🥘",description:"A spicy sprouted-bean curry served with crunchy toppings.",ingredients:[["Moong Dal","1 cup sprouts","1 kg"],["Onion","2 medium","1 kg"],["Tomatoes","2 medium","1 kg"],["Garam Masala","2 tsp","100 g"]],steps:["Cook sprouted beans until tender.","Prepare a spicy onion and tomato masala.","Simmer beans in the masala and serve with crunchy toppings."]}
  ,{id:"bengali-aloo-dum",name:"Bengali Aloo Dum",cuisine:"Indian",category:"Indian favourites",time:"35 min",difficulty:"Medium",servings:4,emoji:"🥔",description:"Baby potatoes simmered in a fragrant Bengali-style gravy.",ingredients:[["Potato","500 g","1 kg"],["Tomatoes","2 medium","1 kg"],["Garam Masala","1 tsp","100 g"],["Mustard Seeds","½ tsp","100 g"]],steps:["Boil potatoes until just tender.","Prepare tomato gravy with spices.","Add potatoes and simmer until coated and flavourful."]}
  ,{id:"kashmiri-pulao",name:"Kashmiri Pulao",cuisine:"Indian",category:"Indian favourites",time:"35 min",difficulty:"Medium",servings:4,emoji:"🍛",description:"A fragrant rice dish with nuts, fruit and gentle spices.",ingredients:[["Basmati Rice","2 cups","1 kg"],["Cashew Nuts","¼ cup","250 g"],["Raisins","2 tbsp","250 g"],["Cow Ghee","2 tbsp","500 ml"]],steps:["Rinse and soak rice.","Toast nuts and raisins in ghee and set aside.","Cook rice with whole spices until fluffy.","Top with toasted nuts and raisins."]}
  ,{id:"rajasthani-dal-baati",name:"Rajasthani Dal Baati",cuisine:"Indian",category:"Indian favourites",time:"60 min",difficulty:"Medium",servings:4,emoji:"🫓",description:"Baked wheat baati served with hearty lentils and ghee.",ingredients:[["Wheat Atta","2 cups","1 kg"],["Toor Dal","½ cup","1 kg"],["Moong Dal","½ cup","1 kg"],["Cow Ghee","3 tbsp","500 ml"]],steps:["Knead a firm dough and shape into balls.","Bake until golden and cooked through.","Cook mixed dals with spices until creamy.","Crack baati, drizzle with ghee and serve with dal."]}
  ,{id:"kerala-avial",name:"Kerala Avial",cuisine:"Indian",category:"Indian favourites",time:"35 min",difficulty:"Easy",servings:4,emoji:"🥥",description:"Mixed vegetables in a coconut and yoghurt sauce.",ingredients:[["Carrot","1 cup","1 kg"],["Curd","½ cup","500 g"],["Coconut Oil","1 tbsp","500 ml"],["Green Chilli","2 pieces","250 g"]],steps:["Cut vegetables into even batons.","Cook with a little water until just tender.","Mix coconut paste and yoghurt through gently.","Finish with coconut oil and curry leaves."]}
  ,{id:"hyderabadi-haleem",name:"Hyderabadi Haleem",cuisine:"Indian",category:"Indian favourites",time:"90 min",difficulty:"Advanced",servings:4,emoji:"🍲",description:"A slow-cooked, richly spiced grain and lentil preparation.",ingredients:[["Wheat Atta","¼ cup","1 kg"],["Toor Dal","¼ cup","1 kg"],["Moong Dal","¼ cup","1 kg"],["Garam Masala","2 tsp","100 g"],["Onion","2 medium","1 kg"]],steps:["Cook grains and lentils until very soft.","Cook the chosen protein separately with spices, if using.","Combine and mash or blend to a thick consistency.","Simmer slowly and garnish with browned onions."]}
  ,{id:"mumbai-pav-bhaji",name:"Mumbai Pav Bhaji",cuisine:"Indian",category:"Indian favourites",time:"40 min",difficulty:"Easy",servings:4,emoji:"🍞",description:"Mashed spiced vegetables served with buttery toasted pav.",ingredients:[["Potato","3 medium","1 kg"],["Tomatoes","3 medium","1 kg"],["Onion","2 medium","1 kg"],["Butter","2 tbsp","Pack"],["Bread","8 pieces","Pack"]],steps:["Boil potatoes and vegetables until soft.","Cook onion and tomato with pav bhaji masala.","Mash vegetables into the masala and simmer.","Toast bread with butter and serve alongside."]}
  ,{id:"japanese-vegetable-ramen",name:"Japanese Vegetable Ramen",cuisine:"Japanese",category:"World kitchen",time:"30 min",difficulty:"Easy",servings:2,emoji:"🍜",description:"A warming noodle bowl with vegetables and savoury broth.",ingredients:[["Noodles","2 portions","Pack"],["Carrot","1 piece","1 kg"],["Onion","½ piece","1 kg"],["Mushrooms","1 cup","Pack"]],steps:["Prepare noodles according to the packet.","Simmer vegetables in a seasoned broth.","Add noodles to bowls and pour over hot broth.","Finish with spring onion or sesame if available."]}
  ,{id:"korean-veg-bibimbap",name:"Korean Vegetable Bibimbap",cuisine:"Korean",category:"World kitchen",time:"35 min",difficulty:"Medium",servings:2,emoji:"🍚",description:"Rice bowls topped with colourful vegetables and a spicy-sweet sauce.",ingredients:[["Basmati Rice","1 cup","1 kg"],["Carrot","1 piece","1 kg"],["Cucumber","½ piece","1 kg"],["Green Chilli","1 piece","250 g"]],steps:["Cook rice and keep warm.","Slice and quickly sauté or arrange vegetables.","Place vegetables over rice.","Serve with a chilli, soy and sesame-style dressing."]}
  ,{id:"french-ratatouille",name:"French Ratatouille",cuisine:"French",category:"World kitchen",time:"45 min",difficulty:"Medium",servings:4,emoji:"🍆",description:"A colourful slow-simmered vegetable dish with herbs.",ingredients:[["Tomatoes","3 medium","1 kg"],["Onion","1 medium","1 kg"],["Carrot","1 piece","1 kg"],["Olive Oil","2 tbsp","Bottle"]],steps:["Slice vegetables evenly.","Soften onion in olive oil.","Add vegetables and herbs.","Cover and simmer until tender but not mushy."]}
  ,{id:"spanish-vegetable-paella",name:"Spanish Vegetable Paella",cuisine:"Spanish",category:"World kitchen",time:"40 min",difficulty:"Medium",servings:4,emoji:"🥘",description:"A colourful one-pan rice dish with vegetables and paprika.",ingredients:[["Basmati Rice","1½ cups","1 kg"],["Tomatoes","2 medium","1 kg"],["Green Peas","½ cup","Pack"],["Onion","1 medium","1 kg"]],steps:["Sauté onion and vegetables in a wide pan.","Stir in rice and paprika.","Add warm stock and simmer without stirring much.","Rest briefly before serving."]}
  ,{id:"turkish-lentil-soup",name:"Turkish Red Lentil Soup",cuisine:"Turkish",category:"World kitchen",time:"30 min",difficulty:"Easy",servings:4,emoji:"🥣",description:"A smooth, comforting red lentil soup with lemon.",ingredients:[["Masoor Dal","1 cup","1 kg"],["Onion","1 medium","1 kg"],["Carrot","1 piece","1 kg"],["Turmeric Powder","½ tsp","100 g"]],steps:["Rinse lentils.","Cook onion, carrot and lentils with water until soft.","Blend until smooth.","Season and serve with lemon."]}
  ,{id:"middle-eastern-falafel",name:"Middle Eastern Falafel",cuisine:"Middle Eastern",category:"World kitchen",time:"40 min + soaking",difficulty:"Medium",servings:4,emoji:"🧆",description:"Crisp chickpea patties with herbs and warm spices.",ingredients:[["Kabuli Chana","1 cup","500 g"],["Onion","½ medium","1 kg"],["Coriander Leaves","1 bunch","Bunch"],["Cumin Seeds","1 tsp","100 g"]],steps:["Soak chickpeas overnight and drain well.","Pulse with onion, herbs and spices to a coarse mixture.","Shape into small patties.","Fry or bake until crisp and cooked through."]}
  ,{id:"indonesian-nasi-goreng",name:"Indonesian Nasi Goreng",cuisine:"Indonesian",category:"World kitchen",time:"20 min",difficulty:"Easy",servings:2,emoji:"🍳",description:"A quick fried rice with a sweet-savoury seasoning.",ingredients:[["Basmati Rice","2 cups cooked","1 kg"],["Onion","1 medium","1 kg"],["Carrot","½ cup","1 kg"],["Green Chilli","1 piece","250 g"]],steps:["Use cooled cooked rice.","Sauté onion and vegetables.","Add rice and a sweet-savoury sauce.","Toss over high heat and serve hot."]}
  ,{id:"british-vegetable-pie",name:"British Vegetable Pie",cuisine:"British",category:"World kitchen",time:"55 min",difficulty:"Medium",servings:4,emoji:"🥧",description:"A cosy vegetable filling under a golden pastry crust.",ingredients:[["Potato","2 medium","1 kg"],["Carrot","1 piece","1 kg"],["Onion","1 medium","1 kg"],["Fresh Milk","½ cup","500 ml"],["Butter","2 tbsp","Pack"]],steps:["Cook diced vegetables until just tender.","Make a light creamy sauce with butter and milk.","Fill a baking dish and cover with pastry.","Bake until the top is golden."]}
  ,{id:"ethiopian-lentil-stew",name:"Ethiopian Misir Wot",cuisine:"Ethiopian",category:"World kitchen",time:"40 min",difficulty:"Medium",servings:4,emoji:"🍛",description:"A warming red lentil stew with fragrant spices.",ingredients:[["Masoor Dal","1 cup","1 kg"],["Onion","2 medium","1 kg"],["Tomatoes","2 medium","1 kg"],["Red Chilli Powder","1 tsp","200 g"]],steps:["Cook onions slowly until soft.","Add tomatoes and spices.","Stir in rinsed lentils and water.","Simmer until thick and tender."]}
  ,{id:"carrot-halwa",name:"Gajar Ka Halwa",cuisine:"Indian",category:"Desserts",time:"50 min",difficulty:"Medium",servings:4,emoji:"🥕",description:"A classic Indian carrot pudding finished with nuts.",ingredients:[["Carrot","500 g","1 kg"],["Fresh Milk","500 ml","500 ml"],["Sugar","½ cup","1 kg"],["Cow Ghee","2 tbsp","500 ml"],["Cashew Nuts","2 tbsp","250 g"]],steps:["Grate carrots.","Cook with milk until most liquid evaporates.","Add sugar and ghee and cook until glossy.","Garnish with toasted cashews."]}
  ,{id:"mango-lassi",name:"Mango Lassi",cuisine:"Indian",category:"Desserts",time:"10 min",difficulty:"Easy",servings:2,emoji:"🥭",description:"A chilled yoghurt and mango drink.",ingredients:[["Mango","1 cup pulp","1 kg"],["Curd","1 cup","500 g"],["Sugar","1 tbsp","1 kg"]],steps:["Add mango pulp, curd and sugar to a blender.","Blend until smooth and creamy.","Chill and serve."]}
  ,{id:"italian-margherita-pizza",name:"Margherita Pizza",cuisine:"Italian",category:"World kitchen",time:"35 min",difficulty:"Medium",servings:2,emoji:"🍕",description:"A simple tomato, cheese and basil pizza favourite.",ingredients:[["Wheat Atta","1½ cups","1 kg"],["Tomatoes","2 medium","1 kg"],["Paneer","100 g","200 g"]],steps:["Prepare or use a ready pizza base.","Spread tomato sauce over the base.","Add cheese and basil.","Bake in a hot oven until the crust is crisp."]}
  ,{id:"thai-pad-thai",name:"Thai Vegetable Pad Thai",cuisine:"Thai",category:"World kitchen",time:"25 min",difficulty:"Medium",servings:2,emoji:"🍜",description:"Stir-fried noodles with vegetables and a tangy sauce.",ingredients:[["Noodles","2 portions","Pack"],["Peanuts","2 tbsp","250 g"],["Carrot","1 piece","1 kg"],["Onion","½ piece","1 kg"]],steps:["Soak or cook noodles as directed.","Stir-fry vegetables in a hot pan.","Add noodles and a tangy sweet-sour sauce.","Top with crushed peanuts."]}

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
  const [addressResolving, setAddressResolving] = useState(false);
  const [deliveryDistanceKm, setDeliveryDistanceKm] = useState(null);
  const [deliveryBlocked, setDeliveryBlocked] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [customerUser, setCustomerUser] = useState(null);
  const [customerProfile, setCustomerProfile] = useState({ full_name: "", phone: "", address: "" });
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerAuthMode, setCustomerAuthMode] = useState("login");
  const [customerAuthForm, setCustomerAuthForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [customerAuthBusy, setCustomerAuthBusy] = useState(false);
  const [customItem, setCustomItem] = useState("");
  const [customQty, setCustomQty] = useState("1");
  const [customUnit, setCustomUnit] = useState("500 g");
  const [customRecipeNeed, setCustomRecipeNeed] = useState("");
  const [customItems, setCustomItems] = useState([]);
  const [cartRecipeNeeds, setCartRecipeNeeds] = useState({});
  const [cartPurchaseUnits, setCartPurchaseUnits] = useState({});
  const [productManualUnits, setProductManualUnits] = useState({});
  const [adminEmail, setAdminEmail] = useState(ADMIN_EMAIL);
  const [adminPassword, setAdminPassword] = useState("");
  const [admin, setAdmin] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [orderFilter, setOrderFilter] = useState("All");
  const [adminTab, setAdminTab] = useState("overview");
  const [adminProductSearch, setAdminProductSearch] = useState("");
  const [dukandarQuestion, setDukandarQuestion] = useState("");
  const [dukandarReply, setDukandarReply] = useState("Hello! I am Dukandar. Ask me about groceries, recipes or ingredients.");
  const [dukandarOpen, setDukandarOpen] = useState(false);
  const [pendingDukandarRecipe, setPendingDukandarRecipe] = useState(null);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [recipeSearch, setRecipeSearch] = useState("");
  const [recipeCategory, setRecipeCategory] = useState("All");
  const [recipeImportText, setRecipeImportText] = useState("");
  const [chatMessages, setChatMessages] = useState([{role:"assistant",text:"Hello! I'm Dukandar, your Balaji Home Needs shopping assistant. Ask me about groceries, recipes or ingredients."}]);

  useEffect(() => {
    if (view !== "shop" || admin) return;
    if (sessionStorage.getItem("balaji_dukandar_welcomed")) return;
    const timer = setTimeout(() => { setDukandarOpen(true); sessionStorage.setItem("balaji_dukandar_welcomed", "1"); }, 1400);
    return () => clearTimeout(timer);
  }, [view, admin]);

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
      const user = data?.session?.user || null;
      const allowed = user?.email?.toLowerCase() === ADMIN_EMAIL;
      setCustomerUser(user && !allowed ? user : null);
      if (allowed) { setAdmin(true); setView("admin"); }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      const allowed = user?.email?.toLowerCase() === ADMIN_EMAIL;
      setAdmin(!!allowed);
      setCustomerUser(user && !allowed ? user : null);
      if (allowed) setView("admin");
      else if (!session) { setAdmin(false); setCustomerOrders([]); }
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!supabaseReady || !customerUser?.id || admin) return;
    let alive = true;
    (async () => {
      const { data: profile, error: profileError } = await supabase.from("customer_profiles")
        .select("full_name,phone,address").eq("id", customerUser.id).maybeSingle();
      if (!alive) return;
      let savedProfile = profile;
      if (!savedProfile) {
        savedProfile = {
          full_name: customerUser.user_metadata?.full_name || "",
          phone: customerUser.user_metadata?.phone || "",
          address: ""
        };
        const { error: createError } = await supabase.from("customer_profiles").upsert({
          id: customerUser.id, ...savedProfile, updated_at: new Date().toISOString()
        });
        if (createError) showNotice("Profile setup needs the Customer Login SQL migration: " + createError.message);
      }
      setCustomerProfile(savedProfile);
      setCustomer(old => ({
        ...old,
        name: savedProfile.full_name || old.name,
        phone: savedProfile.phone || old.phone,
        address: savedProfile.address || old.address
      }));
      const { data: rows, error: ordersError } = await supabase.from("orders")
        .select("payload,status,created_at").eq("customer_id", customerUser.id)
        .order("created_at", { ascending: false });
      if (!alive) return;
      if (ordersError) {
        setCustomerOrders([]);
        if (!ordersError.message?.toLowerCase().includes("customer_id")) showNotice("Could not load order history: " + ordersError.message);
      } else {
        setCustomerOrders((rows || []).map(row => ({ ...row.payload, status: row.status || row.payload?.status })));
      }
      if (profileError && !profileError.message?.toLowerCase().includes("customer_profiles")) showNotice("Could not load customer profile: " + profileError.message);
    })();
    return () => { alive = false; };
  }, [customerUser?.id, admin]);

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
    if (!navigator.geolocation) {
      setLocationMessage("This browser does not support location sharing. Please use a device with GPS to verify delivery eligibility.");
      return;
    }

    setLocationMessage("Finding your precise location… Keep Location turned on and wait a few seconds.");
    let bestPosition = null;
    let watchId = null;
    let finished = false;

    const finish = (position, timedOut = false) => {
      if (finished) return;
      finished = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      clearTimeout(finishTimer);

      if (!position || position.coords.accuracy > 500) {
        setDeliveryLocation(null);
        setDeliveryDistanceKm(null);
        setDeliveryBlocked(false);
        const accuracy = position ? Math.round(position.coords.accuracy) : null;
        setLocationMessage(accuracy
          ? `Your location accuracy is approximately ±${accuracy} m, which is too low for a reliable 3 km delivery check. Turn on Precise Location, enable Wi-Fi, move near a window or outdoors, and try again.`
          : "Could not get your location. Turn on Location and try again outdoors or near a window.");
        return;
      }

      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: Math.round(position.coords.accuracy)
      };
      const distance = distanceInKm(STORE_LOCATION, location);
      setDeliveryLocation(location);
      setDeliveryDistanceKm(distance);
      const outside = distance > DELIVERY_RADIUS_KM;
      setDeliveryBlocked(outside);
      setLocationMessage(outside
        ? `Your location is approximately ${distance.toFixed(2)} km from our store, outside our 3 km delivery area. GPS accuracy: ±${location.accuracy} m.`
        : `Location checked: approximately ${distance.toFixed(2)} km from our store (GPS accuracy ±${location.accuracy} m). ${timedOut ? "Using the best location found." : "Your location is within our delivery area."} Finding your address…`);

      // Convert captured GPS coordinates into a readable address for the address field.
      // If the customer has already typed an address while lookup is running, keep their text.
      setAddressResolving(true);
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(location.latitude)}&lon=${encodeURIComponent(location.longitude)}&zoom=18&addressdetails=1`, {
        headers: { "Accept-Language": "en" }
      })
        .then(response => response.ok ? response.json() : Promise.reject(new Error("Address lookup unavailable")))
        .then(result => {
          const resolvedAddress = result?.display_name;
          if (resolvedAddress) {
            setCustomer(previous => previous.address.trim() ? previous : { ...previous, address: resolvedAddress });
            setLocationMessage(outside
              ? `Address found and added. Your location is approximately ${distance.toFixed(2)} km from our store, outside our 3 km delivery area.`
              : `Your address was added automatically. Location is approximately ${distance.toFixed(2)} km from our store (GPS accuracy ±${location.accuracy} m).`);
          } else {
            setLocationMessage("Location captured. Please enter your full address manually for delivery.");
          }
        })
        .catch(() => setLocationMessage("Location captured, but the street address could not be found automatically. Please enter your full address manually."))
        .finally(() => setAddressResolving(false));
    };

    const finishTimer = setTimeout(() => finish(bestPosition, true), 25000);
    try {
      watchId = navigator.geolocation.watchPosition(
        position => {
          if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) {
            bestPosition = position;
          }
          const accuracy = Math.round(position.coords.accuracy);
          setLocationMessage(`Improving GPS accuracy… Current accuracy ±${accuracy} m. Please keep this screen open.`);
          if (accuracy <= 100) finish(position, false);
        },
        error => {
          if (bestPosition) finish(bestPosition, true);
          else {
            if (finished) return;
            finished = true;
            clearTimeout(finishTimer);
            setDeliveryLocation(null);
            setDeliveryDistanceKm(null);
            setDeliveryBlocked(false);
            setLocationMessage(error.code === 1
              ? "Location permission was denied. Allow precise location access in your browser settings and try again."
              : "Could not get your location. Turn on Location, enable Wi-Fi, and try again near a window or outdoors.");
          }
        },
        { enableHighAccuracy: true, timeout: 60000, maximumAge: 0 }
      );
    } catch (error) {
      finish(null, true);
    }
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
    if (amount > 0 && !cartPurchaseUnits[id]) {
      const product = products.find(item => item.id === id);
      if (product) setCartPurchaseUnits(old => ({ ...old, [id]: product.unit || getQuantityOptions(product)[0] }));
    }
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
    showNotice("Recipe ingredients added. The store will confirm pack sizes and availability.");
    setActiveRecipe(null);
    setCheckout(true);
  }
  function importRecipeIngredients() {
    const lines = recipeImportText.split(/\n|,/).map(x => x.trim()).filter(Boolean);
    if (!lines.length) { showNotice("Paste the recipe ingredients first."); return; }
    let added = 0;
    lines.forEach(line => {
      const clean = line.replace(/^[-•*\d.)\s]+/, "").trim();
      if (!clean) return;
      const product = products.find(p => !p.paused && (clean.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(clean.toLowerCase())));
      if (product) {
        setCart(old => ({...old,[product.id]:Math.max(1,Number(old[product.id]||0))}));
        setCartRecipeNeeds(old => ({...old,[product.id]:clean})); added++;
      } else {
        const name = clean.replace(/^([\d./½¼¾]+\s*(cups?|tbsp|tsp|g|kg|ml|litres?|pieces?|medium|large)\s+)/i, "").replace(/\s*[-–:].*$/, "").trim();
        if (name) { setCustomItems(old => [...old,{name,quantity:1,purchaseUnit:"To be confirmed",recipeNeed:clean,quotedPrice:""}]); added++; }
      }
    });
    setRecipeImportText("");
    showNotice(`${added} ingredient requests added. Review them in your cart.`);
    setCheckout(true);
  }
  function askDukandar(e) {
    e.preventDefault();
    const question = dukandarQuestion.trim();
    if (!question) return;
    const q = question.toLowerCase().replace(/[’']/g, "'");
    const addIntent = /\b(add|put|include|send)\b/.test(q) && /\b(cart|basket|shopping list|order)\b/.test(q);
    const yesIntent = /^(yes|yeah|yep|sure|okay|ok|please|do it|add it|add them|yes please)[.! ]*$/i.test(question);
    const noIntent = /^(no|not now|later|no thanks)[.! ]*$/i.test(question);
    let answer = "";

    const findRecipe = (text) => {
      const clean = text.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
      return recipeBook.find(r => {
        const name = r.name.toLowerCase();
        return clean.includes(name) || name.split(/\s+/).filter(w => w.length > 3).every(w => clean.includes(w));
      });
    };

    // A customer can confirm adding the recipe after Dukandar has shown its ingredients.
    if (yesIntent && pendingDukandarRecipe) {
      const recipe = pendingDukandarRecipe;
      addRecipeToCart(recipe);
      setPendingDukandarRecipe(null);
      answer = `Of course! I've added the ingredients for ${recipe.name} to your cart. You can review the list and send your request when you're ready.`;
    } else if (noIntent && pendingDukandarRecipe) {
      setPendingDukandarRecipe(null);
      answer = "No problem! Your cart has not been changed. Would you like another recipe or help finding a grocery item?";
    } else {
      const recipe = findRecipe(q);
      const recipeIntent = /\b(recipe|cook|make|prepare|ingredients|breakfast|lunch|dinner|snack|dessert|meal|dish)\b/.test(q);

      if (recipe && recipeIntent) {
        const ingredientText = recipe.ingredients.map(([name, need]) => `${name} (${need})`).join(", ");
        if (addIntent || /\b(add|put)\s+(the\s+)?(ingredients|everything)\b/.test(q)) {
          addRecipeToCart(recipe);
          answer = `Done! I've added the ingredients for ${recipe.name} to your cart. You can review the items before checkout.`;
        } else {
          setPendingDukandarRecipe(recipe);
          answer = `Absolutely! 😊 Here's what you'll need for ${recipe.name}: ${ingredientText}. Would you like me to add these ingredients to your cart? Just say “Yes, add them”.`;
        }
      } else if (recipeIntent) {
        const suggestions = recipeBook.filter(r => /breakfast|lunch|dinner|snack|dessert/i.test(r.category || "") || /quick|world|indian/i.test(r.category || "")).slice(0, 4);
        answer = `I'd love to help you cook! Tell me the dish name, or choose one of these ideas: ${suggestions.map(r => r.name).join(", ")}. I can show the ingredients and add them to your cart when you say so.`;
      } else if (addIntent) {
        const match = question.match(/\badd\s+(.+?)\s+to\s+(?:my\s+)?(?:cart|basket|shopping list|order)\b/i);
        let requested = match?.[1]?.replace(/^(please\s+)?(the\s+)?/i, "").trim() || question;
        requested = requested.replace(/\b(please|for me|now)\b/gi, "").trim();
        const quantityMatch = requested.match(/^(\d+(?:\.\d+)?)\s+(.+)$/);
        const quantity = quantityMatch ? Math.max(1, Number(quantityMatch[1])) : 1;
        const itemName = (quantityMatch ? quantityMatch[2] : requested).trim();
        const found = products.find(p => !p.paused && (p.name.toLowerCase() === itemName.toLowerCase() || itemName.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(itemName.toLowerCase())));
        if (found) {
          setCart(old => ({ ...old, [found.id]: Math.max(quantity, Number(old[found.id] || 0)) }));
          answer = `Added ${quantity} ${found.name} to your cart. Would you like anything else?`;
        } else if (itemName) {
          setCustomItems(old => [...old, { name: itemName, quantity, purchaseUnit: "To be confirmed", quotedPrice: "" }]);
          answer = `I've added “${itemName}” as a special item request in your cart. It's not in our current catalogue, so our shop team will confirm availability and price. Would you like to add anything else?`;
        } else {
          answer = "Sure! Which item would you like me to add?";
        }
      } else {
        const found = products.filter(p => !p.paused && q.includes(p.name.toLowerCase()));
        if (found.length) {
          answer = `I found ${found.map(p => p.name).join(", ")} in our store. Would you like me to add ${found.length === 1 ? "it" : "them"} to your cart?`;
        } else {
          answer = "I'm happy to help! You can ask me for a recipe, ask about a grocery item, or say “Add [item name] to my cart”. If an item isn't in our catalogue, I can still add it as a request for our shop team to confirm.";
        }
      }
    }

    setChatMessages(old => [...old, { role: "user", text: question }, { role: "assistant", text: answer }]);
    setDukandarReply(answer);
    setDukandarQuestion("");
  }

  function addCustomItem(e) {
    e.preventDefault();
    if (customItem.trim()) {
      setCustomItems(old => [...old, {
        name: customItem.trim(),
        quantity: Math.max(1, Number(customQty) || 1),
        purchaseUnit: "To be confirmed"
      }]);
      setCustomItem(""); setCustomQty("1");
      showNotice("Item and shopping quantity added to cart.");
    }
  }
  async function submitCustomerAuth(e) {
    e.preventDefault();
    if (!supabaseReady) { showNotice("Customer accounts require your existing Supabase connection. Configure it first."); return; }
    const email = customerAuthForm.email.trim().toLowerCase();
    const password = customerAuthForm.password;
    if (password.length < 8) { showNotice("Please use a password with at least 8 characters."); return; }
    if (customerAuthMode === "signup") {
      if (!customerAuthForm.name.trim() || !/^[6-9]\d{9}$/.test(customerAuthForm.phone)) {
        showNotice("Enter your name and a valid 10-digit Indian mobile number."); return;
      }
    }
    setCustomerAuthBusy(true);
    try {
      if (customerAuthMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: customerAuthForm.name.trim(), phone: customerAuthForm.phone } }
        });
        if (error) throw error;
        if (data.session && data.user) {
          const profile = { id: data.user.id, full_name: customerAuthForm.name.trim(), phone: customerAuthForm.phone, address: "", updated_at: new Date().toISOString() };
          const { error: profileError } = await supabase.from("customer_profiles").upsert(profile);
          if (profileError) throw profileError;
          setCustomerProfile({ full_name: profile.full_name, phone: profile.phone, address: "" });
          setCustomer({ name: profile.full_name, phone: profile.phone, address: "" });
          setView("account");
          showNotice("Your customer account has been created.");
        } else {
          setCustomerAuthMode("login");
          showNotice("Account created. Check your email, verify your address, then log in.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setCustomerAuthForm({ name: "", phone: "", email: "", password: "" });
        setView("account");
        showNotice("Welcome back to Balaji Home Needs!");
      }
    } catch (error) {
      showNotice("Account error: " + (error.message || "Please try again."));
    } finally { setCustomerAuthBusy(false); }
  }

  async function saveCustomerProfile(e) {
    e.preventDefault();
    if (!customerUser?.id) return;
    if (!customerProfile.full_name.trim() || !/^[6-9]\d{9}$/.test(customerProfile.phone)) {
      showNotice("Enter your name and a valid 10-digit mobile number."); return;
    }
    const profile = {
      id: customerUser.id,
      full_name: customerProfile.full_name.trim(),
      phone: customerProfile.phone,
      address: customerProfile.address.trim(),
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from("customer_profiles").upsert(profile);
    if (error) { showNotice("Could not save profile: " + error.message); return; }
    setCustomer({ name: profile.full_name, phone: profile.phone, address: profile.address });
    showNotice("Your details and delivery address have been saved.");
  }

  async function customerLogout() {
    if (supabaseReady) await supabase.auth.signOut();
    setCustomerUser(null);
    setCustomerOrders([]);
    setView("shop");
    showNotice("You have been logged out.");
  }

  function submitOrder(e) {
    e.preventDefault();
    if (!customer.name.trim() || !/^[6-9]\d{9}$/.test(customer.phone) || !customer.address.trim()) {
      showNotice("Please enter a valid name, 10-digit mobile number and address."); return;
    }
    if (!count && !customCount) { showNotice("Please add at least one item."); return; }
    if (deliveryLocation) {
      const verifiedDistance = distanceInKm(STORE_LOCATION, deliveryLocation);
      setDeliveryDistanceKm(verifiedDistance);
      if (verifiedDistance > DELIVERY_RADIUS_KM) { setDeliveryBlocked(true); showNotice("Sorry, your address is outside our 3 km delivery area."); return; }
      if (deliveryLocation.accuracy > 500) { showNotice("GPS accuracy is still too low. Please update your location outdoors or near a window, or continue with your manually entered address."); return; }
    } else {
      // Permit checkout with a manually entered address; delivery distance will be verified by the store.
      setLocationMessage("You are continuing without GPS. Please provide a complete address; delivery availability will be checked manually.");
    }
    const order = {
      id: "BH" + Date.now().toString().slice(-8),
      customer: { ...customer },
      customer_id: customerUser?.id || null,
      items: cartItems.map(p => ({ ...p, quantity: cart[p.id], purchaseUnit: cartPurchaseUnits[p.id] || p.unit || "item", recipeNeed: cartRecipeNeeds[p.id] || "", quotedPrice: "" })),
      customItems: customItems.map(item => ({ ...item, quotedPrice: "" })),
      deliveryLocation,
      deliveryVerification: deliveryLocation ? "GPS location shared" : "Manual address only — delivery distance not verified",
      total: null, status: "Order Received", date: new Date().toLocaleString("en-IN")
    };
    if (supabaseReady) {
      supabase.from("orders").insert({ id: order.id, payload: order, customer_id: customerUser?.id || null, status: order.status, is_deleted: false })
        .then(({ error }) => { if (error) showNotice("Order save failed. Please try again: " + error.message); });
    }
    setOrders(old => [order, ...old]);
    if (customerUser) setCustomerOrders(old => [order, ...old]);
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
.dukandar-floating-button span { width:44px; height:44px; display:grid; place-items:center; border-radius:50%; background:#f5e3c5; overflow:hidden; }
.dukandar-floating-button span img { width:100%; height:100%; object-fit:cover; object-position:50% 24%; }
.dukandar-popup-backdrop { position:fixed; inset:0; z-index:100; background:#15201666; display:flex; align-items:flex-end; justify-content:flex-end; padding:22px; }
.dukandar-popup { width:min(410px,100%); max-height:min(620px,90vh); overflow:hidden; border-radius:20px; background:#fff; box-shadow:0 18px 60px #0004; }
.dukandar-popup-head { display:flex; align-items:center; gap:12px; padding:15px 17px; background:#244b2c; color:#fff; }
.dukandar-popup-avatar { width:52px; height:52px; display:grid; place-items:center; border-radius:50%; background:#f5e3c5; overflow:hidden; flex:0 0 auto; }
.dukandar-popup-avatar img { width:100%; height:100%; object-fit:cover; object-position:50% 22%; }
.dukandar-popup-head small { display:block; margin-top:3px; color:#e0eddf; }
.dukandar-popup-head button { margin-left:auto; border:0; background:transparent; color:#fff; font-size:20px; cursor:pointer; }
.dukandar-popup-body { padding:16px; }
.dukandar-chat-bubble,.dukandar-chat-reply { padding:12px 14px; border-radius:14px; background:#f1f6ed; color:#344a34; line-height:1.5; margin-bottom:10px; }
.dukandar-chat-reply { background:#fff7e8; }
.dukandar-popup-form { display:flex; gap:8px; margin-top:14px; }
.dukandar-popup-form input { min-width:0; flex:1; padding:12px; border:1px solid #d3ddcf; border-radius:10px; font:inherit; }
.dukandar-popup-links { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
.dukandar-popup-links button { border:1px solid #d5e1d1; background:#fff; color:#315438; border-radius:9px; padding:9px 11px; cursor:pointer; }

.recipe-hero-banner{display:grid;grid-template-columns:1.2fr .8fr;align-items:center;gap:20px;padding:38px;border-radius:26px;background:linear-gradient(120deg,#e9f5e8,#fff5df 58%,#f8e9d8);overflow:hidden;position:relative;margin-bottom:24px;min-height:220px}.recipe-hero-banner h1{font-size:clamp(2.2rem,4vw,3.4rem);margin:8px 0;color:#1e432d}.recipe-hero-banner p{max-width:650px;color:#566b59;line-height:1.65}.recipe-hero-cta,.hello-kitchen-link{display:inline-flex;gap:12px;align-items:center;background:#16834b;color:white;border:0;border-radius:12px;padding:12px 18px;text-decoration:none;font-weight:800;cursor:pointer}.recipe-hero-art{display:flex;align-items:center;justify-content:center;gap:12px;transform:rotate(-7deg)}.recipe-hero-art span{display:grid;place-items:center;width:94px;height:94px;border-radius:26px;background:#ffffffbd;box-shadow:0 12px 35px #355d3420;font-size:48px;animation:recipeFloat 3.4s ease-in-out infinite}.recipe-hero-art span:nth-child(2){animation-delay:.35s;transform:translateY(18px)}.recipe-hero-art span:nth-child(3){animation-delay:.7s}.recipe-hero-art span:nth-child(4){animation-delay:1s;transform:translateY(16px)}@keyframes recipeFloat{0%,100%{translate:0 0}50%{translate:0 -12px}}.hello-kitchen-feature{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:26px;border-radius:22px;background:linear-gradient(115deg,#f0f8e9,#fff7e7);border:1px solid #dcebd5;margin:24px 0 34px;box-shadow:0 12px 35px #315a2810}.hello-kitchen-copy h2{margin:8px 0;color:#23452f}.hello-kitchen-copy p{line-height:1.6;color:#5b6c5a}.hello-kitchen-import{display:flex;flex-direction:column;gap:10px;background:#ffffffd9;padding:18px;border-radius:16px}.hello-kitchen-import label{font-weight:800;color:#23452f}.hello-kitchen-import textarea{width:100%;box-sizing:border-box;border:1px solid #d6e2d1;border-radius:12px;padding:13px;font:inherit;resize:vertical}.hello-kitchen-import small{color:#6a7866;line-height:1.4}.recipe-tools{display:grid;gap:14px;margin:18px 0 22px}.recipe-tools>input{width:100%;box-sizing:border-box;padding:14px 16px;border:1px solid #d6e2d1;border-radius:13px;font:inherit}.recipe-filters{display:flex;gap:9px;flex-wrap:wrap}.recipe-filters button{border:1px solid #d9e5d4;background:#fff;color:#45614a;padding:9px 14px;border-radius:999px;cursor:pointer}.recipe-filters button.active{background:#1b8049;color:#fff;border-color:#1b8049}.recipe-showcase-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:18px}.recipe-showcase-card{border:1px solid #e2e9dd;border-radius:19px;overflow:hidden;background:white;box-shadow:0 7px 22px #1c42200a;animation:recipeReveal .45s both;animation-delay:var(--recipe-delay);transition:transform .22s,box-shadow .22s}.recipe-showcase-card:hover{transform:translateY(-5px);box-shadow:0 16px 35px #1c42201a}@keyframes recipeReveal{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.recipe-card-visual{height:138px;display:grid;place-items:center;position:relative;background:radial-gradient(circle at 50% 45%,#fff 0,#f8f5e9 50%,#eaf3e4 100%)}.recipe-dish-emoji{font-size:74px;filter:drop-shadow(0 8px 6px #0002);transition:transform .25s}.recipe-showcase-card:hover .recipe-dish-emoji{transform:scale(1.12) rotate(-4deg)}.recipe-cuisine-tag{position:absolute;left:13px;top:12px;background:#ffffffdb;color:#315b39;padding:6px 10px;border-radius:999px;font-size:12px;font-weight:800}.recipe-card-sparkle{position:absolute;right:17px;top:14px;color:#d59d31}.recipe-showcase-content{padding:16px}.recipe-meta-line{display:flex;gap:10px;flex-wrap:wrap;color:#71806c;font-size:11px}.recipe-showcase-content h3{margin:10px 0 6px;color:#203e2d}.recipe-showcase-content p{min-height:44px;color:#687568;font-size:13px;line-height:1.5}.try-me-button{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;border-radius:11px;background:#16834b;color:white;padding:12px 15px;font-weight:900;letter-spacing:.04em;cursor:pointer;box-shadow:0 6px 15px #16834b24}.try-me-button:hover,.recipe-hero-cta:hover{background:#116d3d}.recipe-detail-modal{width:min(650px,100%);max-height:88vh;overflow:auto;background:white;border-radius:22px;padding:25px;position:relative}.recipe-detail-top{display:flex;gap:18px;align-items:center;padding:12px 0 20px}.recipe-detail-top>span{font-size:64px}.recipe-detail-top h2{margin:5px 0}.recipe-detail-top p{color:#647264}.recipe-ingredient-list,.recipe-steps-list{padding-left:22px;line-height:1.8;color:#526252}.recipe-ingredient-list li{padding:4px 0}.recipe-ingredient-list li b{margin-left:12px;color:#23452f}.recipe-add-cart{width:100%;margin-top:12px}.dukandar-popup-backdrop{background:transparent;pointer-events:none;align-items:flex-end}.dukandar-popup{pointer-events:auto;margin:0 0 82px 0;animation:dukandarPop .22s ease-out}.dukandar-popup-body{max-height:440px;overflow:auto}.dukandar-chat-history{display:grid;gap:9px;max-height:290px;overflow:auto}.dukandar-floating-button{animation:dukandarPulse 2.8s ease-in-out infinite}.dukandar-floating-button span img,.dukandar-popup-avatar img{object-fit:contain;object-position:center}@keyframes dukandarPulse{0%,100%{box-shadow:0 8px 28px #18351f45}50%{box-shadow:0 8px 34px #16834b75}}@keyframes dukandarPop{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}

@media(max-width:650px) { .recipe-hero-banner,.hello-kitchen-feature{grid-template-columns:1fr;padding:20px}.recipe-hero-art span{width:66px;height:66px;font-size:36px}.recipe-detail-top{align-items:flex-start}.header-actions { flex-wrap:wrap; } .dukandar-popup-backdrop { padding:0; } .dukandar-popup { width:100%; border-radius:20px 20px 0 0; } .recipe-page { padding:14px; } }
.dukandar-floating-button{bottom:94px;right:22px;}
@media(max-width:650px){.dukandar-floating-button{bottom:88px;right:12px;}.floating-cart{bottom:12px;}}
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
          <button type="button" className="account-button" onClick={() => { setView(customerUser ? "account" : "account-auth"); setCustomerAuthMode("login"); }}>{customerUser ? "👤 My Account" : "👤 Login / Sign up"}</button>
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
        <section className="custom-section" id="custom-request"><div><span className="eyebrow">NEED SOMETHING ELSE?</span><h2>Can’t find an item? Request it here</h2><p>Just enter the item name and quantity. We’ll confirm the pack size and availability.</p></div>
          <form onSubmit={addCustomItem} className="custom-request-form" style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 130px auto",gap:10,width:"100%",alignItems:"center"}}>
            <input value={customItem} onChange={e => setCustomItem(e.target.value)} placeholder="Enter item name..." aria-label="Item name" required />
            <input aria-label="Quantity" type="number" min="1" step="1" value={customQty} onChange={e => setCustomQty(e.target.value)} placeholder="Qty" required />
            <button className="primary-button">Add request</button>
          </form>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading"><div><span className="eyebrow">ADD WHAT YOU NEED</span><h2>{category === "All" ? "Browse all products" : category}</h2></div><span>{filteredProducts.length} items</span></div>
          <div className="product-grid">{filteredProducts.map(p => { const quantityOptions = getQuantityOptions(p); const selectedUnit = (productManualUnits[p.id] || "").trim() ? (p.unit || quantityOptions[0]) : (cartPurchaseUnits[p.id] || p.unit || quantityOptions[0]); return <article className="product-card" key={p.id}>
            <div className="product-picture"><img src={productPhotoUrl(p)} alt={`Real photo of ${p.name}`} loading="lazy" onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.classList.add("photo-unavailable"); }} /><span className="photo-unavailable-label">Photo unavailable</span></div><div className="product-info"><small>{p.category}</small><h3>{p.name}</h3><p>{p.unit}</p>
              <div className="product-quantity-options"><label>Choose quantity<select aria-label={`Choose quantity for ${p.name}`} value={selectedUnit} onChange={e => { setProductManualUnits(old => ({...old,[p.id]:""})); setCartPurchaseUnits(old => ({...old,[p.id]:e.target.value})); }}>{Array.from(new Set([p.unit, ...quantityOptions].filter(Boolean))).map(option => <option key={option} value={option}>{option}</option>)}</select></label><label>Or enter manually<input aria-label={`Enter custom quantity for ${p.name}`} type="text" inputMode="text" placeholder="e.g. 150 g" value={productManualUnits[p.id] || ""} onChange={e => { const value = e.target.value; setProductManualUnits(old => ({...old,[p.id]:value})); if (value.trim()) setCartPurchaseUnits(old => ({...old,[p.id]:value.trim()})); else setCartPurchaseUnits(old => ({...old,[p.id]:p.unit || quantityOptions[0]})); }} /></label></div>
              <div className="product-bottom"><b>Add to cart</b>{cart[p.id] ? <div className="quantity"><button onClick={() => changeQty(p.id, -1)}>−</button><b>{cart[p.id]}</b><button onClick={() => changeQty(p.id, 1)}>+</button></div> : <button className="add-button" onClick={() => changeQty(p.id, 1)}>＋ Add</button>}</div>
            </div></article>})}</div>
          {!filteredProducts.length && <p className="empty">No products found. Try another search or request it below.</p>}
        </section>
        {customItems.length > 0 && <p className="custom-added">Requested: {customItems.map(item => `${item.name}: buying ${item.quantity} × ${item.purchaseUnit}${item.recipeNeed ? ` (recipe needs ${item.recipeNeed})` : ""}`).join(", ")} <button onClick={() => setCustomItems([])}>Clear</button></p>}
      </main>}


      {view === "recipes" && <main className="recipe-page">
        <section className="recipe-hero-banner"><div><span className="eyebrow">A WORLD OF FLAVOURS</span><h1>Recipe Book</h1><p>Discover Indian favourites and dishes from around the world. Pick a recipe, explore the ingredients and add everything to your Balaji Home Needs cart.</p><button className="recipe-hero-cta" onClick={()=>document.getElementById("recipe-collection")?.scrollIntoView({behavior:"smooth"})}>Explore recipes <span>↓</span></button></div><div className="recipe-hero-art" aria-hidden="true"><span>🍛</span><span>🥗</span><span>🍝</span><span>🥞</span></div></section>
        <section className="hello-kitchen-feature"><div className="hello-kitchen-copy"><span className="eyebrow">YOUR RECIPE DISCOVERY CORNER</span><h2>Found something delicious on Hello Kitchen?</h2><p>Open Hello Kitchen, choose any recipe, copy its ingredient list and paste it below. Dukandar will match ingredients with our store catalogue and add the requests to your cart.</p><a href="https://www.hellokitchen.in/" target="_blank" rel="noopener noreferrer" className="hello-kitchen-link">Explore Hello Kitchen ↗</a></div><div className="hello-kitchen-import"><label htmlFor="recipe-import">Paste recipe ingredients</label><textarea id="recipe-import" rows="4" value={recipeImportText} onChange={e=>setRecipeImportText(e.target.value)} placeholder={`Example:\n2 cups basmati rice\n1 onion\n2 tomatoes\n1 tsp garam masala`} /><button className="primary-button" type="button" onClick={importRecipeIngredients}>Match ingredients & add to cart</button><small>Items not found in the catalogue are added as requests for the shopkeeper to confirm.</small></div></section>
        <section id="recipe-collection" className="recipe-collection"><div className="section-heading"><div><span className="eyebrow">FIND YOUR NEXT FAVOURITE</span><h2>Explore recipes</h2><p>From everyday Indian meals to international favourites and desserts.</p></div><span>{recipeBook.length} recipes</span></div>
          <div className="recipe-tools"><input value={recipeSearch} onChange={e=>setRecipeSearch(e.target.value)} placeholder="Search recipes or cuisines..." aria-label="Search recipes"/><div className="recipe-filters">{["All","Breakfast","Indian favourites","Quick meals","World kitchen","Desserts"].map(cat=><button key={cat} className={recipeCategory===cat?"active":""} onClick={()=>setRecipeCategory(cat)}>{cat}</button>)}</div></div>
          <div className="recipe-showcase-grid">{recipeBook.filter(r=>(recipeCategory==="All"||r.category===recipeCategory)&&`${r.name} ${r.cuisine} ${r.description}`.toLowerCase().includes(recipeSearch.toLowerCase())).map((recipe,index)=><article className="recipe-showcase-card" key={recipe.id} style={{"--recipe-delay":`${index%6*70}ms`}}><div className="recipe-card-visual"><span className="recipe-dish-emoji">{recipe.emoji}</span><span className="recipe-cuisine-tag">{recipe.cuisine}</span><span className="recipe-card-sparkle">✦</span></div><div className="recipe-showcase-content"><div className="recipe-meta-line"><span>⏱ {recipe.time}</span><span>{recipe.difficulty}</span><span>Serves {recipe.servings}</span></div><h3>{recipe.name}</h3><p>{recipe.description}</p><button className="try-me-button" onClick={()=>setActiveRecipe(recipe)}>TRY ME <span>→</span></button></div></article>)}</div>
          {!recipeBook.filter(r=>(recipeCategory==="All"||r.category===recipeCategory)&&`${r.name} ${r.cuisine} ${r.description}`.toLowerCase().includes(recipeSearch.toLowerCase())).length&&<p className="empty">No recipes found. Try another dish or cuisine.</p>}
        </section>
        <button className="back-button" type="button" onClick={()=>setView("shop")}>← Back to Shop</button>
      </main>}
      {activeRecipe && <div className="modal-backdrop recipe-detail-backdrop" onClick={()=>setActiveRecipe(null)}><section className="recipe-detail-modal" role="dialog" aria-modal="true" aria-label={`${activeRecipe.name} recipe`} onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setActiveRecipe(null)}>✕</button><div className="recipe-detail-top"><span>{activeRecipe.emoji}</span><div><span className="eyebrow">{activeRecipe.cuisine} · {activeRecipe.time}</span><h2>{activeRecipe.name}</h2><p>{activeRecipe.description}</p></div></div><h3>Ingredients</h3><ul className="recipe-ingredient-list">{activeRecipe.ingredients.map((item,i)=><li key={i}><span>{item[0]}</span><b>{item[1]}</b></li>)}</ul><h3>How to make it</h3><ol className="recipe-steps-list">{activeRecipe.steps.map((step,i)=><li key={i}>{step}</li>)}</ol><button className="primary-button recipe-add-cart" onClick={()=>addRecipeToCart(activeRecipe)}>Add all ingredients to cart</button></section></div>}

      {view === "account-auth" && <main className="admin-page">
        <form className="login-card customer-login-card" onSubmit={submitCustomerAuth}>
          <div className="login-icon">👤</div><span className="eyebrow">BALAJI HOME NEEDS CUSTOMER ACCOUNT</span>
          <h2>{customerAuthMode === "signup" ? "Create your account" : "Customer login"}</h2>
          <p>{customerAuthMode === "signup" ? "Save your details and view your previous grocery requests." : "Log in to access your saved address and order history."}</p>
          {customerAuthMode === "signup" && <><input value={customerAuthForm.name} onChange={e => setCustomerAuthForm({ ...customerAuthForm, name: e.target.value })} placeholder="Full name" autoComplete="name" required /><input value={customerAuthForm.phone} onChange={e => setCustomerAuthForm({ ...customerAuthForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="10-digit mobile number" inputMode="numeric" autoComplete="tel" required /></>}
          <input type="email" value={customerAuthForm.email} onChange={e => setCustomerAuthForm({ ...customerAuthForm, email: e.target.value })} placeholder="Email address" autoComplete="email" required />
          <input type="password" value={customerAuthForm.password} onChange={e => setCustomerAuthForm({ ...customerAuthForm, password: e.target.value })} placeholder="Password (minimum 8 characters)" autoComplete={customerAuthMode === "signup" ? "new-password" : "current-password"} minLength={8} required />
          <button className="primary-button" disabled={customerAuthBusy}>{customerAuthBusy ? "Please wait…" : customerAuthMode === "signup" ? "Create free account" : "Login"}</button>
          <button type="button" className="back-button" onClick={() => setCustomerAuthMode(customerAuthMode === "signup" ? "login" : "signup")}>{customerAuthMode === "signup" ? "Already registered? Login" : "New customer? Create an account"}</button>
          <button type="button" className="back-button" onClick={() => setView("shop")}>Continue as guest · Back to store</button>
          <small className="delivery-note">Free email and password login. Email verification may be required. Guest checkout is always available.</small>
        </form>
      </main>}

      {view === "account" && <main className="admin-page">
        <div className="admin-heading"><div><span className="eyebrow">CUSTOMER ACCOUNT</span><h1>My Account</h1><p>{customerUser?.email}</p></div><div className="account-actions"><button className="back-button" onClick={() => setView("shop")}>← Continue shopping</button><button className="delete-order-button" onClick={customerLogout}>Logout</button></div></div>
        <section className="panel customer-profile-panel"><h2>My details & delivery address</h2><form className="customer-form" onSubmit={saveCustomerProfile}><input value={customerProfile.full_name} onChange={e => setCustomerProfile({ ...customerProfile, full_name: e.target.value })} placeholder="Full name" required /><input value={customerProfile.phone} onChange={e => setCustomerProfile({ ...customerProfile, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="10-digit mobile number" inputMode="numeric" required /><textarea value={customerProfile.address} onChange={e => setCustomerProfile({ ...customerProfile, address: e.target.value })} placeholder="Saved delivery address" /><button className="primary-button">Save my details</button></form></section>
        <section className="panel"><div className="section-heading"><h2>My previous orders</h2><span>{customerOrders.length} orders</span></div>{customerOrders.length ? customerOrders.map(order => <div className="order-card" key={order.id}><div className="order-top"><b>{order.id}</b><span>{order.date || "—"}</span><strong>{order.status || "Order Received"}</strong></div><p>{order.customer?.address || "Address not saved"}</p><div className="order-lines">{(order.items || []).map(item => <div key={item.id}>{item.name} × {item.quantity} {item.purchaseUnit || item.unit || ""}</div>)}{(order.customItems || []).map((item, index) => <div key={`${item.name}-${index}`}>Other: {item.name} — {item.quantity || 1} × {item.purchaseUnit || "item"}</div>)}</div></div>) : <p className="empty">No orders yet. Orders placed while logged in will appear here.</p>}</section>
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
                {o.deliveryLocation ? <p className="admin-location">📍 Customer GPS: {o.deliveryLocation.latitude.toFixed(6)}, {o.deliveryLocation.longitude.toFixed(6)} · Accuracy ±{o.deliveryLocation.accuracy} m · <a href={`https://www.google.com/maps?q=${o.deliveryLocation.latitude},${o.deliveryLocation.longitude}`} target="_blank" rel="noreferrer">Open delivery location in Google Maps ↗</a></p> : <p className="delivery-note" style={{background:"#fff7e6",padding:10,borderRadius:8}}>⚠️ Customer did not share GPS. Verify the manually entered address and 3 km delivery eligibility before confirming.</p>}
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
          <form className="customer-form" onSubmit={submitOrder}><h3>Your details</h3>{!customerUser && <p className="delivery-note">Guest checkout is available. <button type="button" className="inline-link" onClick={() => { setCheckout(false); setView("account-auth"); }}>Create a free account</button> to save your details and view order history.</p>}<input required placeholder="Your full name" value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/><input required type="tel" maxLength="10" placeholder="10-digit WhatsApp mobile number" value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value.replace(/\D/g,"")})}/><textarea required placeholder="Full delivery address (house/flat, street, area, landmark, PIN code)" value={customer.address} onChange={e=>setCustomer({...customer,address:e.target.value})}/>
            <div className="location-picker"><div><b>Share delivery location (recommended)</b><p>Capture your map location to automatically fill your address and help us confirm delivery accurately.</p></div><button type="button" className="location-button" onClick={captureLocation}>📍 {deliveryLocation ? "Update location" : "Use my current location"}</button>
              {!deliveryLocation && <div style={{marginTop:10,padding:12,borderRadius:9,background:"#fff7e6",border:"1px solid #f2d49b",color:"#79520b"}}><b>⚠️ Please update your location for accurate delivery.</b><p style={{margin:"5px 0 0",fontSize:13}}>You can still place your order without GPS. If you skip location, enter your complete address manually. Delivery distance and availability will need to be checked by our store, so delivery may be less accurate or take longer to confirm.</p></div>}
              {locationMessage && <small style={{display:"block",marginTop:8,color:deliveryBlocked?"#b42318":undefined}}>{addressResolving ? "Finding and filling your address… " : ""}{locationMessage}</small>}
              {deliveryLocation && <div className="location-confirmed">✓ GPS location checked · {deliveryDistanceKm?.toFixed(2)} km from store · ±{deliveryLocation.accuracy} m accuracy · <a href={`https://www.google.com/maps?q=${deliveryLocation.latitude},${deliveryLocation.longitude}`} target="_blank" rel="noreferrer">Preview on map</a> <button type="button" onClick={()=>{setDeliveryLocation(null);setDeliveryDistanceKm(null);setDeliveryBlocked(false);setLocationMessage("GPS location removed. You can continue using your manually entered address.");}}>Remove</button></div>}
              <small style={{display:"block",marginTop:6}}>Delivery is currently available within 3 km of Balaji Home Needs. Orders without GPS can still be submitted, but the store must verify the address manually.</small>
            </div>
            <button className="primary-button" type="submit" disabled={deliveryBlocked || (deliveryLocation && deliveryDistanceKm > DELIVERY_RADIUS_KM)} style={{opacity:(deliveryBlocked || (deliveryLocation && deliveryDistanceKm > DELIVERY_RADIUS_KM))?0.55:1,cursor:(deliveryBlocked || (deliveryLocation && deliveryDistanceKm > DELIVERY_RADIUS_KM))?"not-allowed":"pointer"}}>Send order for estimate</button></form>
        </>}
      </div></div>}
      {deliveryBlocked && <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="checkout-modal" style={{maxWidth:480,textAlign:"center",padding:28}}><div style={{fontSize:46,marginBottom:10}}>💚</div><span className="eyebrow">BALAJI HOME NEEDS</span><h2>We're working hard to reach you!</h2><p>Thank you for choosing Balaji Home Needs. We currently deliver within 3 km of our store. Your location is approximately <b>{deliveryDistanceKm?.toFixed(2)} km</b> away, so delivery is not available there just yet.</p><p>We're working hard to expand our delivery service and hope to serve you soon!</p><button type="button" className="primary-button" style={{width:"100%"}} onClick={()=>{setDeliveryBlocked(false);setCheckout(false);}}>Okay, thank you</button></div></div>}
      {submittedOrderId && <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="checkout-modal" style={{maxWidth:480,textAlign:"center"}}><div className="login-icon">✓</div><span className="eyebrow">REQUEST RECEIVED</span><h2>Thank you!</h2><p>Your order request has been submitted successfully. The store will check availability and send your estimate on WhatsApp.</p><div style={{padding:18,background:"#f4f7f1",borderRadius:12,margin:"18px 0"}}><small>YOUR ORDER ID</small><h2 style={{letterSpacing:2}}>{submittedOrderId}</h2><button type="button" className="back-button" onClick={() => { navigator.clipboard?.writeText(submittedOrderId); showNotice("Order ID copied."); }}>Copy Order ID</button></div><p><b>Please save your Order ID for future reference.</b></p><button className="primary-button" type="button" onClick={() => setSubmittedOrderId("")}>Close</button></div></div>}

      {dukandarOpen && <div className="dukandar-popup-backdrop" onClick={() => setDukandarOpen(false)}>
        <section className="dukandar-popup" role="dialog" aria-modal="true" aria-label="Ask Dukandar assistant" onClick={e => e.stopPropagation()}>
          <div className="dukandar-popup-head"><div className="dukandar-popup-avatar"><img src="/dukandar-mascot.png" alt="Dukandar assistant" /></div><div><b>Ask Dukandar</b><small>Your friendly store assistant</small></div><button type="button" aria-label="Close Ask Dukandar" onClick={() => setDukandarOpen(false)}>✕</button></div>
          <div className="dukandar-popup-body"><div className="dukandar-chat-history">{chatMessages.map((message,index)=><div key={index} className={message.role==="user"?"dukandar-chat-reply":"dukandar-chat-bubble"}>{message.text}</div>)}</div>
            <form onSubmit={askDukandar} className="dukandar-popup-form"><input autoFocus value={dukandarQuestion} onChange={e=>setDukandarQuestion(e.target.value)} placeholder="Ask for a recipe or say: Add rice to my cart..."/><button className="primary-button" type="submit">Send</button></form>
            <div className="dukandar-popup-links"><button type="button" onClick={()=>{setDukandarQuestion("Suggest a recipe for dinner");}}>🍽️ Suggest a recipe</button><button type="button" onClick={()=>{setDukandarOpen(false);setView("recipes");}}>📖 Open Recipe Book</button><button type="button" onClick={()=>{setDukandarOpen(false);setView("shop");}}>🛒 Browse groceries</button></div>
          </div>
        </section>
      </div>}
      {!dukandarOpen && <button type="button" className="dukandar-floating-button" onClick={()=>setDukandarOpen(true)}><span><img src="/dukandar-mascot.png" alt="" /></span> Ask Dukandar</button>}
      <footer><b>BALAJI HOME NEEDS</b><p>Everyday essentials, delivered with care.</p><small>© {new Date().getFullYear()} Balaji Home Needs. All rights reserved.</small></footer>
      {count + customCount > 0 && view === "shop" && <button className="floating-cart" onClick={()=>setCheckout(true)}>🛒 View Cart · {totalCartCount} items</button>}
      {notice && <div className="toast">{notice}</div>}
    </div>
    </>
  );
}
