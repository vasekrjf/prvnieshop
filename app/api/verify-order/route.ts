import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import emailjs from "@emailjs/nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export async function POST(req: Request) {
  console.log("---------- START: Funkce verify-order spuštěna ----------");

  try {
    const { sessionId } = await req.json();
    console.log("1. Session ID přijato:", sessionId);

    if (!sessionId) return NextResponse.json({ error: "Chybí Session ID" }, { status: 400 });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      console.log("CHYBA: Není zaplaceno");
      return NextResponse.json({ error: "Není zaplaceno" }, { status: 400 });
    }

    const orderRef = doc(db, "orders", sessionId);
    const orderSnap = await getDoc(orderRef);

    if (orderSnap.exists()) {
      console.log("INFO: Objednávka už existuje, končím.");
      return NextResponse.json({ message: "Objednávka již existuje", orderId: sessionId });
    }

    const customerEmail = session.customer_details?.email;
    console.log("2. Email zákazníka:", customerEmail);

    // Uložení do DB
    await setDoc(orderRef, {
      createdAt: new Date().toISOString(),
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: "czk",
      customerName: session.customer_details?.name || "Zákazník",
      customerEmail: customerEmail || "",
      items: session.metadata?.order_items || "Neuvedeno",
      status: "new",
      fulfillmentStatus: "RECEIVED",
      stripeSessionId: sessionId
    });
    console.log("3. Uloženo do Firebase OK");

    // --- DIAGNOSTIKA EMAILJS ---
    if (customerEmail) {
      console.log("4. Pokus o odeslání e-mailu...");
      
      // Kontrola klíčů (Vypíšeme jen jestli existují, ne jejich obsah)
      console.log("   -> Klíče kontrola:", {
        Service: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? "OK" : "CHYBÍ",
        Template: process.env.EMAILJS_ORDER_TEMPLATE_ID ? "OK" : "CHYBÍ",
        Public: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? "OK" : "CHYBÍ",
        Private: process.env.EMAILJS_PRIVATE_KEY ? "OK" : "CHYBÍ"
      });

      try {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.EMAILJS_ORDER_TEMPLATE_ID!,
          {
            customer_name: session.customer_details?.name || "Zákazník",
            customer_email: customerEmail,
            order_id: sessionId.slice(-5).toUpperCase(),
            amount: `${session.amount_total ? session.amount_total / 100 : 0} Kč`,
            items: session.metadata?.order_items || "Neuvedeno",
            date: new Date().toLocaleDateString("cs-CZ"),
          },
          {
            publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
            privateKey: process.env.EMAILJS_PRIVATE_KEY!,
          }
        );
        console.log("5. SUCCESS: EmailJS odesláno!");
      } catch (err) {
        console.error("6. ERROR EmailJS selhal:", err);
      }
    } else {
        console.log("CHYBA: Email neodeslán - chybí email zákazníka ve Stripe datech");
    }

    return NextResponse.json({ success: true, orderId: sessionId });

  } catch (error: any) {
    console.error("KRITICKÁ CHYBA SERVERU:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}