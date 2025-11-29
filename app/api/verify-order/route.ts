import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/firebase"; // Ujisti se, že cesta k firebase.js je správná
import { doc, setDoc, getDoc } from "firebase/firestore";
// Používáme nodejs verzi EmailJS (serverovou)
import emailjs from "@emailjs/nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Chybí Session ID" }, { status: 400 });
    }

    // --- 1. OVĚŘENÍ PLATBY U STRIPE ---
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Není zaplaceno" }, { status: 400 });
    }

    // --- 2. KONTROLA DUPLICITY V DATABÁZI ---
    const orderRef = doc(db, "orders", sessionId);
    const orderSnap = await getDoc(orderRef);

    if (orderSnap.exists()) {
      return NextResponse.json({ message: "Objednávka již existuje", orderId: sessionId });
    }

    // Příprava dat
    const customerName = session.customer_details?.name || "Zákazník";
    const customerEmail = session.customer_details?.email || "";
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    const itemsText = session.metadata?.order_items || "Položky neuvedeny";
    const orderDate = new Date().toLocaleDateString("cs-CZ");

    // --- 3. ULOŽENÍ DO FIREBASE ---
    await setDoc(orderRef, {
      createdAt: new Date().toISOString(),
      amount: amount,
      currency: "czk",
      customerName: customerName,
      customerEmail: customerEmail,
      items: itemsText,
      status: "new",
      fulfillmentStatus: "RECEIVED",
      stripeSessionId: sessionId
    });

    // --- 4. ODESLÁNÍ E-MAILU PŘES EMAILJS ---
    if (customerEmail) {
      try {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!, // Service ID (Gmail)
          process.env.EMAILJS_ORDER_TEMPLATE_ID!,      // Template ID (Faktura)
          {
            // Proměnné do šablony {{...}}
            customer_name: customerName,
            customer_email: customerEmail,
            order_id: sessionId.slice(-5).toUpperCase(),
            amount: `${amount} Kč`,
            items: itemsText,
            date: orderDate,
          },
          {
            // Autorizace
            publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
            privateKey: process.env.EMAILJS_PRIVATE_KEY!, // Musí být v .env a na Netlify!
          }
        );
        console.log("EmailJS odesláno úspěšně");
      } catch (emailError) {
        console.error("Chyba při odesílání emailu:", emailError);
        // Pokračujeme dál, i když se email nepovede (objednávka je důležitější)
      }
    }

    return NextResponse.json({ success: true, orderId: sessionId });

  } catch (error: any) {
    console.error("Chyba serveru:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}