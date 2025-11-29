import { NextResponse } from "next/server";
import Stripe from "stripe";

// Inicializace Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Košík je prázdný" }, { status: 400 });
    }

    // 1. Převedeme položky z košíku na formát pro Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "czk",
        product_data: {
          name: item.name,
          images: item.img ? [item.img] : [], // Pokud máš obrázky
        },
        unit_amount: Math.round(item.price * 100), // Cena v haléřích
      },
      quantity: item.quantity,
    }));

    // 2. Vytvoříme metadata (seznam zboží jako text pro uložení do DB)
    const cartMetadata = items
      .map((item: any) => `${item.quantity}x ${item.name}`)
      .join(", ");

    // 3. Vytvoříme Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      
      // Nutné pro osobní odběr (chceme fakturační údaje, ne doručovací)
      billing_address_collection: "required",
      shipping_address_collection: undefined,

      // Uložíme si seznam zboží "do kapsy" transakce
      metadata: {
        order_items: cartMetadata.substring(0, 500), // Ořízneme, kdyby to bylo moc dlouhé
      },

      custom_text: {
        submit: { message: "Zaplatit a vyzvednout" },
      },

      // Přesměrování
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Chyba Stripe:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}