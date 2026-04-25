"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/context/ToastContext";

export default function Navbar() {
  const {
    cart,
    wishlist,
    total,
    cartCount,
    removeFromCart,
    updateQty,
    moveToCart,
    removeFromWishlist,
    isCartOpen,
    isWishOpen,
    isCheckoutOpen,
    openCart,
    closeCart,
    openWish,
    closeWish,
    openCheckout,
    closeCheckout,
    clearCart,
  } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [activeId, setActiveId] = useState("author");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const ratio = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
      setProgress(ratio * 100);
      setShrink(window.scrollY > 60);

      const ids = ["author", "books", "consultation", "testimonials", "contact"];
      let current = "author";
      ids.forEach((id) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= 90) current = id;
      });
      setActiveId(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vis");
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".rr").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      isCartOpen || isWishOpen || isCheckoutOpen || mobileOpen ? "hidden" : "";
  }, [isCartOpen, isWishOpen, isCheckoutOpen, mobileOpen]);

  const checkoutRows = useMemo(
    () =>
      cart.map((item: any) => ({
        id: item.id,
        label: `${item.name} x ${item.qty}`,
        price: item.price * item.qty,
      })),
    [cart]
  );

  const placeOrder = () => {
    closeCheckout();
    router.push("/checkout");
  };

  return (
    <>
      <div id="prog" style={{ width: `${progress}%` }} />

      <div className={`mnav ${mobileOpen ? "open" : ""}`} id="mnav">
        {[
          ["#author", "About"],
          ["#books", "Books & Guides"],
          ["#consultation", "Consultation"],
          ["#testimonials", "Testimonials"],
          ["#contact", "Contact"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="nk" onClick={() => setMobileOpen(false)}>
            {label}
          </Link>
        ))}
      </div>

      <nav id="nav" className={shrink ? "sh" : ""}>
        <Link href="#author" className="nl">
          <div className="nl-logo">
            <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
          </div>
          <div className="nl-text">
            <span className="nl-m">Bookshelf</span>
            <span className="nl-s">By Naresh Kumar</span>
          </div>
        </Link>

        <div className="nc">
          {[
            ["#author", "About"],
            ["#books", "Books & Guides"],
            ["#consultation", "Consultation"],
            ["#testimonials", "Testimonials"],
            ["#contact", "Contact"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className={`nk ${activeId === href.slice(1) ? "act" : ""}`}>
              {label}
            </Link>
          ))}
        </div>

        <div className="nr">
          <button className="ni" onClick={openWish} title="Favourites">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
            {wishlist.length > 0 && <div className="ni-badge">{wishlist.length}</div>}
          </button>
          <button className="ni" onClick={openCart} title="Cart">
            <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
            {cartCount > 0 && <div className="ni-badge">{cartCount}</div>}
          </button>
          <Link href="/track-order" className="nk" style={{ fontSize:12 }}>Track Order</Link>
          <Link href="#consultation" className="nb">Book a Session</Link>
          <button className="ham" id="ham" onClick={() => setMobileOpen((v) => !v)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div id="cart-overlay" className={isCartOpen ? "open" : ""} onClick={closeCart} />
      <div id="cart-drawer" className={isCartOpen ? "open" : ""} style={{ display:"flex", flexDirection:"column" }}>

        {/* ── HEADER ── */}
        <div style={{ padding:"22px 24px 16px", borderBottom:"1px solid #e5d9c5", display:"flex", justifyContent:"space-between", alignItems:"flex-start", background:"#fdfaf3" }}>
          <div>
            <div style={{ fontSize:22, fontWeight:700, color:"#2E1E0F", letterSpacing:"-0.02em", fontFamily:"Georgia, serif", fontStyle:"italic" }}>Your Cart</div>
            <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#9A7230", marginTop:3 }}>
              {cartCount} {cartCount === 1 ? "title" : "titles"} selected
            </div>
          </div>
          <button onClick={closeCart} style={{ background:"none", border:"1px solid #e5d9c5", borderRadius:8, width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#2E1E0F" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* ── ITEMS ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
          {cart.length === 0 ? (
            <div style={{ padding:"56px 0", textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:12, opacity:0.2 }}>❧</div>
              <p style={{ color:"#9A7230", fontSize:14 }}>Your cart is empty</p>
            </div>
          ) : cart.map((item: any) => (
            <div key={item.id} style={{ padding:"14px 24px", borderBottom:"1px solid #f0e7da", display:"flex", gap:14, alignItems:"center", transition:"background 0.15s" }}
              onMouseEnter={e=>(e.currentTarget.style.background="#fdf5e8")}
              onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
            >
              {/* Book Cover with real image */}
              <div style={{ width:56, height:70, borderRadius:8, overflow:"hidden", flexShrink:0, background:"#2E1E0F", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"2px 3px 8px rgba(0,0,0,0.18)" }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={(e)=>{ (e.target as HTMLImageElement).style.display="none"; }} />
                ) : (
                  <span style={{ color:"#9A7230", fontSize:22 }}>{item.icon ?? "❧"}</span>
                )}
              </div>

              {/* Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:14, color:"#2E1E0F", lineHeight:1.3, marginBottom:10, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {item.name}
                </div>
                {/* Qty Controls */}
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <button onClick={()=>updateQty(item.id,item.qty-1)} style={{ width:26, height:26, borderRadius:"50%", border:"1.5px solid #d8cab5", background:"white", cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", color:"#2E1E0F", fontWeight:700, lineHeight:1 }}>−</button>
                  <span style={{ fontWeight:700, fontSize:14, minWidth:18, textAlign:"center", color:"#2E1E0F" }}>{item.qty}</span>
                  <button onClick={()=>updateQty(item.id,item.qty+1)} style={{ width:26, height:26, borderRadius:"50%", border:"1.5px solid #d8cab5", background:"white", cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", color:"#2E1E0F", fontWeight:700, lineHeight:1 }}>+</button>
                </div>
              </div>

              {/* Price + Remove */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, flexShrink:0 }}>
                <span style={{ fontWeight:700, fontSize:15, color:"#2E1E0F" }}>₹ {(item.price * item.qty).toLocaleString("en-IN")}</span>
                <button onClick={()=>removeFromCart(item.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#ccc", fontSize:11, fontWeight:600, letterSpacing:"0.05em", display:"flex", alignItems:"center", gap:3 }}
                  onMouseEnter={e=>((e.target as HTMLButtonElement).style.color="#dc2626")}
                  onMouseLeave={e=>((e.target as HTMLButtonElement).style.color="#ccc")}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── FOOTER ── */}
        {cart.length > 0 && (
          <div style={{ padding:"20px 24px", borderTop:"1px solid #e5d9c5", background:"#fdfaf3" }}>
            {/* Free delivery */}
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:13, color:"#888" }}>Delivery</span>
              <span style={{ fontSize:13, color:"#16a34a", fontWeight:600 }}>FREE</span>
            </div>
            {/* Subtotal */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <span style={{ fontSize:13, color:"#666" }}>Subtotal</span>
              <span style={{ fontSize:24, fontWeight:800, color:"#2E1E0F", fontFamily:"Georgia, serif" }}>₹ {total.toLocaleString("en-IN")}</span>
            </div>
            {/* Checkout button */}
            <button
              onClick={()=>{ closeCart(); router.push("/checkout"); }}
              style={{ width:"100%", background:"#2E1E0F", color:"white", border:"none", padding:"15px", borderRadius:10, fontSize:13, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer", transition:"background 0.2s" }}
              onMouseEnter={e=>((e.target as HTMLButtonElement).style.background="#5A3820")}
              onMouseLeave={e=>((e.target as HTMLButtonElement).style.background="#2E1E0F")}
            >
              Proceed to Checkout →
            </button>
            <button onClick={closeCart} style={{ width:"100%", background:"none", border:"none", color:"#9A7230", fontSize:12, cursor:"pointer", marginTop:10, textDecoration:"underline" }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
      <div id="wish-overlay" className={isWishOpen ? "open" : ""} onClick={closeWish} />
      <div id="wish-drawer" className={isWishOpen ? "open" : ""}>
        <div className="cd-head"><div><div className="cd-title">Favourites</div><div className="cd-sub">Saved for later</div></div><button className="cd-close" onClick={closeWish}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button></div>
        <div id="wish-list">{wishlist.length === 0 ? <div className="cd-empty"><p>No saved items yet</p></div> : wishlist.map((item: any) => <div className="wi-row" key={item.id}><div className="wi-info"><div className="wi-name">{item.name}</div><div className="wi-price">₹ {item.price.toLocaleString("en-IN")}</div></div><button className="wi-add" onClick={() => moveToCart(item.id)}>Add to Cart</button><button className="wi-del" onClick={() => removeFromWishlist(item.id)}>x</button></div>)}</div>
      </div>

      <div id="chk-overlay" className={isCheckoutOpen ? "open" : ""} onClick={(e) => e.currentTarget === e.target && closeCheckout()}>
        <div className="chk-modal">
          <button className="chk-close" onClick={closeCheckout}>x</button>
          <div className="chk-title">Checkout</div><div className="chk-sub">Complete your order</div>
          <div id="chk-order-summary">{checkoutRows.map((row: { id: string; label: string; price: number }) => <div className="chk-row" key={row.id}><span className="chk-lbl">{row.label}</span><span className="chk-val">₹ {row.price.toLocaleString("en-IN")}</span></div>)}<div className="chk-row"><span className="chk-lbl">Order Total</span><span className="chk-val chk-total">₹ {total.toLocaleString("en-IN")}</span></div></div>
          <button className="chk-pay" onClick={placeOrder}>Place Order &amp; Pay</button>
        </div>
      </div>
    </>
  );
}