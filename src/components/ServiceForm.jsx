import { useState } from "react";

export const ServiceForm = ({ onAddService }) => {
  const [name, setName] = useState("");
  const [due_date, setDueDate] = useState("");
  const [amount, setAmount] = useState("");
  const [notification_days, setNotificationDays] = useState("3");
  const [is_recurring, setIsRecurring] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onAddService({
      name,
      due_date,
      amount: parseFloat(amount),
      notification_days: parseInt(notification_days),
      is_recurring,
    });

    setName("");
    setDueDate("");
    setAmount("");
    setNotificationDays("3");
    setIsRecurring(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg p-6 border border-border mb-8"
    >
      <h2 className="text-xl font-bold text-foreground mb-4">
        Agregar Nuevo Servicio
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nombre del Servicio
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Agua, Luz, Internet..."
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Fecha de Vencimiento
          </label>
          <input
            type="date"
            value={due_date}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Monto a Pagar
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Notificar (días antes)
          </label>
          <select
            value={notification_days}
            onChange={(e) => setNotificationDays(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="1">1 día antes</option>
            <option value="2">2 días antes</option>
            <option value="3">3 días antes</option>
            <option value="5">5 días antes</option>
            <option value="7">1 semana antes</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <input
          type="checkbox"
          id="is_recurring"
          checked={is_recurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="w-4 h-4 cursor-pointer"
        />
        <label
          htmlFor="is_recurring"
          className="text-sm font-medium cursor-pointer"
        >
          Servicio mensual
        </label>
      </div>

      <button
        type="submit"
        className="w-full mt-4 bg-blue-500 hover:bg-blue-600/90 text-white px-4 py-2 rounded-lg font-semibold transition-colors hover:cursor-pointer"
      >
        Agregar Servicio
      </button>
    </form>
  )
}

