import { TrashIcon } from "../icons/iconsTable";
import { formatDate } from "../lib/dateUtils";

export function TablePaidServices({ paidServices = [], deleteService }) {
  if (paidServices.length === 0) {
    return (
      <p className="p-4 text-gray-500">No hay servicios pagados registrados.</p>
    );
  }

  const groupedServices = paidServices.reduce((acc, service) => {
    if (!acc[service.name]) {
      acc[service.name] = [];
    }
    acc[service.name].push(service);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(groupedServices).map(([serviceName, history]) => (
        <section key={serviceName} className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-primary capitalize">
            {serviceName}
          </h3>

          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-gray-400/20 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    Fecha de Pago
                  </th>
                  <th className="px-4 py-3 text-right font-medium">Monto</th>
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b transition-colors hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-3">{formatDate(item.due_date)}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      $ {item.amount}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="p-2 rounded-md hover:bg-red-500/10 text-red-600 transition-colors"
                        onClick={() => deleteService(item)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
