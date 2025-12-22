import { useState } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

export function useServices(user) {
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
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

  return { services, fetchServices, markAsPaid, deleteService };
}