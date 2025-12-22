import { urgencyStyles, formatDate } from "../lib/dateUtils";

export const ServiceCard = ({ pendingServices, markAsPaid, deleteService }) => {
  return (
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
  );
}