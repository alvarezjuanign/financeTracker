import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { initializeApp, cert } from "npm:firebase-admin/app";
import { getMessaging } from "npm:firebase-admin/messaging";

// Crear cliente de Supabase con Service Role Key
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Inicializar Firebase
const firebaseApp = initializeApp({
  credential: cert(JSON.parse(Deno.env.get("FIREBASE_SERVICE_ACCOUNT")!)),
});

const messaging = getMessaging(firebaseApp);

serve(async () => {
  const today = new Date().toISOString().split("T")[0];

  // 1️⃣ Traer servicios impagos
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("id, name, due_date, notification_days, user_id")
    .eq("is_paid", false);

  if (servicesError) return new Response("DB error", { status: 500 });
  if (!services?.length) return new Response("No services", { status: 200 });

  // 2️⃣ Obtener todos los user_ids
  const userIds = Array.from(new Set(services.map(s => s.user_id)));

  // 3️⃣ Traer todos los tokens de los usuarios
  const { data: tokensData, error: tokensError } = await supabase
    .from("fcm_tokens")
    .select("user_id, token")
    .in("user_id", userIds);

  if (tokensError) return new Response("DB error", { status: 500 });

  // 4️⃣ Crear mapa user_id -> tokens
  const tokensMap = tokensData?.reduce((acc, t) => {
    acc[t.user_id] = acc[t.user_id] || [];
    acc[t.user_id].push(t.token);
    return acc;
  }, {} as Record<string, string[]>) ?? {};

  // 5️⃣ Recorrer servicios y enviar notificaciones
  for (const service of services) {
    const notifyDate = new Date(service.due_date);
    notifyDate.setDate(notifyDate.getDate() - service.notification_days);

    if (notifyDate.toISOString().startsWith(today)) {
      const userTokens = tokensMap[service.user_id];
      if (userTokens?.length) {
        // Firebase permite máximo 500 tokens por sendMulticast
        for (let i = 0; i < userTokens.length; i += 500) {
          const chunk = userTokens.slice(i, i + 500);
          await messaging.sendMulticast({
            tokens: chunk,
            notification: {
              title: "Factura próxima a vencer",
              body: `${service.name} vence el ${service.due_date}`,
            },
          });
        }
      }
    }
  }

  return new Response("OK");
});
