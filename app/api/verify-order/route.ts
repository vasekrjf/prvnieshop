import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/firebase"; // Ujisti se, že cesta k firebase configu sedí (např. ../../firebase)
import { doc, setDoc, getDoc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Chybí Session ID" }, { status: 400 });
    }

    // 1. Získáme info o platbě přímo ze Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 2. Ověříme, zda je zaplaceno
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Není zaplaceno" }, { status: 400 });
    }

    // 3. Zkontrolujeme, jestli už objednávku nemáme v databázi (aby se nevytvořila 2x při obnovení stránky)
    const orderRef = doc(db, "orders", sessionId); // Použijeme ID session jako ID dokumentu
    const orderSnap = await getDoc(orderRef);

    if (orderSnap.exists()) {
      return NextResponse.json({ message: "Objednávka již existuje", orderId: sessionId });
    }

    // 4. Uložíme do Firebase
    // Zákazníka bereme z "customer_details", které vyplnil na Stripe
    await setDoc(orderRef, {
      createdAt: new Date().toISOString(),
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: "czk",
      customerName: session.customer_details?.name || "Neznámý",
      customerEmail: session.customer_details?.email || "Bez emailu",
      items: session.metadata?.order_items || "Neuvedeno", // Načteme to, co jsme si uložili v kroku 1
      status: "new", // Stav pro tvůj Admin Panel (new -> completed)
      stripeSessionId: sessionId
    });

    return NextResponse.json({ success: true, orderId: sessionId });

  } catch (error: any) {
    console.error("Chyba při ukládání:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}