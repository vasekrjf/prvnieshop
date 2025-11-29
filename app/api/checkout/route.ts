import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Košík je prázdný" }, { status: 400 });
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "czk",
        product_data: {
          name: item.name,
          images: item.img ? [item.img] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // --- ZMĚNA ZDE ---
    // Vytvoříme zjednodušený seznam pro uložení do metadat (Stripe má limit na délku metadat)
    const cartMetadata = items.map((item: any) => `${item.quantity}x ${item.name} (${item.id})`).join(", ");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      billing_address_collection: "required",
      shipping_address_collection: undefined,
      
      // Tady si uložíme data o objednávce "do kapsy" té transakce
      metadata: {
        order_items: cartMetadata, // Uložíme si seznam věcí
        // Můžeš sem přidat i ID uživatele, pokud bys měl přihlašování
      },

      custom_text: {
        submit: { message: "Zaplatit a vyzvednout" },
      },
      // Do URL přidáme {CHECKOUT_SESSION_ID}, abychom ji mohli na Success stránce přečíst
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Chyba Stripe:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}