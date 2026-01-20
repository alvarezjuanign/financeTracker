import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Toaster, toast } from "sonner";
import { TablePaidServices } from "./components/TablePaidServices";
import { getUrgency } from "./lib/dateUtils";
import { ServiceCard } from "./components/ServiceCard";
import { LoginForm } from "./components/LoginForm";
import { ServiceForm } from "./components/ServiceForm";
import { useServices } from "./hooks/useServices";
import FinLogo from "../public/icons/FinTrackerLogo.svg";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Link,
  Outlet,
} from "react-router";

export function App() {
  const [user, setUser] = useState(null);
  const { services, addService, fetchServices, markAsPaid, deleteService } =
    useServices(user);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error al cerrar sesión.");
      return;
    }
    setUser(null);
    toast.success("Sesión cerrada exitosamente.");
  };

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

  const router = createBrowserRouter([
    {
      path: "/",
      element: user ? (
        <DashboardLayout user={user} onLogout={handleLogout} />
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        {
          index: true,
          element: (
            <>
              <ServiceForm onAddService={addService} />
              <h2 className="text-xl font-bold mb-4 mt-8">
                Servicios Pendientes
              </h2>
              <ServiceCard
                pendingServices={pendingServices}
                markAsPaid={markAsPaid}
                deleteService={deleteService}
              />
            </>
          ),
        },
        {
          path: "pagados",
          element: (
            <>
              <h2 className="text-xl font-bold mb-4 mt-8">
                Historial de Pagos
              </h2>
              <TablePaidServices
                paidServices={paidServices}
                deleteService={deleteService}
              />
            </>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: !user ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <Navigate to="/" />
      ),
    },
  ]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando sesión...</p>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto">
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </main>
  );
}

function DashboardLayout({ onLogout }) {
  return (
    <article className="p-4">
      <div className="flex justify-between items-center mb-8">
        <img src={FinLogo} alt="Logo" className="h-10" />
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <nav className="flex gap-4 mb-6 border-b">
        <Link to="/" className="pb-2 hover:text-blue-500">
          Pendientes
        </Link>
        <Link to="/pagados" className="pb-2 hover:text-blue-500">
          Ver Pagados
        </Link>
      </nav>

      <Outlet />
    </article>
  );
}
