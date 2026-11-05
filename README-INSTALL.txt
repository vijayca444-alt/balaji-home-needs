BALAJI HOME NEEDS - FRIENDLIER ASK DUKANDAR CHAT UPDATE

1. Back up your current src/App.jsx.
2. Replace src/App.jsx with the App.jsx in this package.
3. Keep your existing src/RecipeBookDukandar.css (or use the included file if this is the same latest design package).
4. IMPORTANT: Keep your existing public/dukandar-avatar.png unchanged. This package does not replace the character image.
5. Run npm run dev and test the assistant popup.

NEW CHAT BEHAVIOUR
- Ask for a recipe by name (example: "How do I make Lemon Rice?"). Dukandar shows the recipe ingredients and asks whether to add them.
- Reply "Yes, add them" to add the recipe ingredients to the cart.
- Say "Add rice to my cart" to add a catalogue item directly.
- Say "Add 2 avocados to my cart" to add a quantity.
- If the item is not in the catalogue, it is still added as a custom item request for the shop team to confirm availability and price.
- Asking about an item does not add it until the customer confirms.

NOTE
This is a friendly catalogue/recipe-aware assistant workflow using the recipes and products currently in the website. It is not a live generative AI connection. A real AI service requires a secure backend/API integration.
