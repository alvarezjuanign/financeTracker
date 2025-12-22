import { TrashIcon } from "../icons/iconsTable"
import { formatDate } from "../lib/dateUtils"

export function TablePaidServices({ paidServices, deleteService }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4 mt-8">Servicios Pagados</h2>
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-gray-400/40 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium">
                Servicio
              </th>
              <th className="px-4 py-3 text-left font-medium">
                Vencimiento
              </th>
              <th className="px-4 py-3 text-right font-medium">Monto</th>
              <th className="px-4 py-3 text-right font-medium">
                Acciones
              </th>
            </tr>
          </thead>
          {paidServices.map((service) => (
            <tbody key={service.id}>
              <tr className="border-b transition-colors">
                <td className="px-4 py-3 font-medium">{service.name}</td>

                <td className="px-4 py-3">
                  {formatDate(service.due_date)}
                </td>

                <td className="px-4 py-3 text-right font-medium">
                  $ {service.amount}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      className="p-2 rounded-md hover:bg-red-500/10 text-red-600 transition-colors hover:cursor-pointer"
                      title="Eliminar"
                      onClick={() => deleteService(service)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </>
  )
}