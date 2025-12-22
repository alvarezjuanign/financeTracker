import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Toaster, toast } from "sonner";
import { TablePaidServices } from "./components/TablePaidServices";
import { getUrgency, urgencyStyles } from "./lib/dateUtils";
import { LoginForm } from "./components/LoginForm";
import { ServiceForm } from "./components/ServiceForm";

export function App() {
  const [services, setServices] = useState([]);
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    if (!user) return;
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      toast.error("Error al obtener los servicios.");
    } else {
      setServices(data);
    }
    setLoading(false);
  };

  const markAsPaid = async (service) => {
    const { error } = await supabase
      .from("services")
      .update({ is_paid: true })
      .eq("id", service.id);


    if (service.is_recurring) {
      const nextDueDate = new Date(service.due_date);
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);

      const { error } = await supabase.from("services").insert({
        name: service.name,
        due_date: nextDueDate.toISOString().split("T")[0],
        amount: service.amount,
        notificationDays: service.notificationDays,
        is_recurring: service.is_recurring,
        is_paid: false,
        user_id: service.user_id,
      });

      if (error) {
        toast.error("Error al insertar el servicio recurrente.");
        return;
      }
    }

    if (error) {
      toast.error("Error al actualizar el servicio.");
      return;
    }

    await fetchServices();
  };

  const deleteService = async (service) => {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", service.id);

    if (error) {
      toast.error("Error al eliminar el servicio.");
      return;
    }

    await fetchServices();
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, []);

  useEffect(() => {
    fetchServices();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const paidServices = services.filter((service) => service.is_paid);
  const pendingServices = services
    .filter((service) => !service.is_paid)
    .map((service) => {
      return {
        ...service,
        urgency: getUrgency(service.due_date),
      };
    });

  const handleLogin = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Error al iniciar sesión.");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    setUser(userData.user);
    toast.success("Inicio de sesión exitoso.");
  };

  const addService = async (service) => {
    const { data } = await supabase.auth.getUser();

    if (!service.name || !service.due_date) {
      toast.error("Por favor completa los campos obligatorios.");
      return;
    }

    if (!data?.user) {
      toast.error("Usuario no autenticado.");
      return;
    }

    const { error } = await supabase.from("services").insert({
      ...service,
      is_paid: false,
      user_id: data.user.id,
    });

    if (error) {
      toast.error("Error al agregar el servicio.");
      return;
    }

    toast.success("Servicio agregado correctamente.");

    await fetchServices();
  };


  return (
    <main className="max-w-3xl mx-auto p-4">
      {
        !user && !loading ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <>
            <button
              onClick={() => setUser(null)}
              className="mb-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
            <ServiceForm onAddService={addService} />
            <section>
              <div className="flex gap-4 border-b border-border mb-4">
                <button
                  onClick={() => setTab("pending")}
                  className={`pb-2 text-sm font-medium ${tab === "pending" ? "border-b-2 border-blue-500" : ""
                    }`}
                >
                  Pendientes ({pendingServices.length})
                </button>

                <button
                  onClick={() => setTab("paid")}
                  className={`pb-2 text-sm font-medium ${tab === "paid" ? "border-b-2 border-blue-500" : ""
                    }`}
                >
                  Pagados ({paidServices.length})
                </button>
              </div>
              {tab === "pending" ? (
                <>
                  <h2 className="text-xl font-bold mb-4 mt-8">
                    Servicios Pendientes
                  </h2>

                  <ul className="space-y-4">
                    {pendingServices.length > 0 ? (
                      pendingServices.map((service) => (
                        <li
                          key={service.id}
                          className={`rounded-lg border p-4 transition-colors ${urgencyStyles[service.urgency].card}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-medium leading-none">
                                {service.name}
                              </h3>
                              <p className="text-sm">
                                Vence: {formatDate(service.due_date)}
                              </p>
                            </div>

                            <span
                              className={`rounded-md px-2 py-0.5 text-xs font-medium ${urgencyStyles[service.urgency].badge}`}
                            >
                              {service.urgency === "high"
                                ? "Urgente"
                                : service.urgency === "medium"
                                  ? "Próximo"
                                  : "En fecha"}
                            </span>
                          </div>

                          <p className="text-sm mb-3">
                            Monto:{" "}
                            <span className="font-medium">$ {service.amount}</span>
                          </p>

                          <div className="flex gap-2">
                            <button
                              onClick={() => markAsPaid(service)}
                              className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                            >
                              Marcar como pagado
                            </button>

                            <button
                              onClick={() => deleteService(service)}
                              className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No hay servicios pendientes.
                      </p>
                    )}
                  </ul>
                </>
              ) : (
                <TablePaidServices paidServices={paidServices} deleteService={deleteService} formatDate={formatDate} />
              )}
            </section>
          </>)
      }
      <Toaster position="top-right" richColors />
    </main>
  );
}
