import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Toaster, toast } from "sonner";
import { TablePaidServices } from "./components/TablePaidServices";
import { getUrgency } from "./lib/dateUtils";
import { ServiceCard } from "./components/ServiceCard";
import { LoginForm } from "./components/LoginForm";
import { ServiceForm } from "./components/ServiceForm";
import { useServices } from "./hooks/useServices";

export function App() {
  const { services, addService, fetchServices, markAsPaid, deleteService } = useServices();
  const [tab, setTab] = useState("pending");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    fetchServices();
  }, [user]);

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

  return (
    <main className="max-w-3xl mx-auto p-4">
      {
        !user && authLoading ? (
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
                  <ServiceCard pendingServices={pendingServices} markAsPaid={markAsPaid} deleteService={deleteService} />
                </>
              ) : (
                <TablePaidServices paidServices={paidServices} deleteService={deleteService} />
              )}
            </section>
          </>)
      }
      <Toaster position="top-right" richColors />
    </main>
  );
}
