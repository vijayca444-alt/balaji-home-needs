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
          <div className="hero-image"><div className="fresh-badge">FRESH<br />DAILY</div><div className="produce">🥬 🍅 🥒 🥕<br />🫑 🥑 🥦 🍆<br />🥔 🧅 🧄 🌽</div><div className="image-caption">Good things <small>for every home.</small></div></div>
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
            <div className="product-picture">{p.imageUrl || categoryPhotos[p.category] || categoryPhotos.default ? <img src={p.imageUrl || categoryPhotos[p.category] || categoryPhotos.default} alt={p.name} loading="lazy" onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "grid"; }} /> : null}<span className="product-emoji-fallback" style={{display: p.imageUrl || categoryPhotos[p.category] || categoryPhotos.default ? "none" : "grid"}}>{p.emoji}</span></div><div className="product-info"><small>{p.category}</small><h3>{p.name}</h3><p>{p.unit}</p>
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
  );
}
