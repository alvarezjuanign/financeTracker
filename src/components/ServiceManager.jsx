import { supabase } from './lib/supabase'
import { toast } from 'sonner'

export const fetchServices = async () => {
  const { data, error } = await supabase.from('services').select('*')

  for (let service of data) {
    if ((new Date().getFullYear() - new Date(service.dueDate).getFullYear()) > 1) {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id)

      if (error) {
        toast.error('Error al eliminar el servicio antiguo.')
      }
    }
  }

  if (error) {
    toast.error('Error al obtener los servicios.')
  } else {
    setServices(data)
  }
}

export const onPayment = async (service) => {
  const { error } = await supabase
    .from('services')
    .update({ isPaid: true })
    .eq('id', service.id)

  if (service.isRecurring) {
    const nextDueDate = new Date(service.dueDate)
    nextDueDate.setMonth(nextDueDate.getMonth() + 1)

    const { error } = await supabase.from('services').insert({
      name: service.name,
      dueDate: nextDueDate.toISOString().split('T')[0],
      amount: service.amount,
      notificationDays: service.notificationDays,
      isRecurring: service.isRecurring,
      isPaid: false,
    })

    if (error) {
      toast.error('Error al insertar el servicio recurrente.')
      return
    }
  }

  if (error) {
    toast.error('Error al actualizar el servicio.')
    return
  }

  await fetchServices()
}

export const onUnpayment = async (service) => {
  const { error } = await supabase
    .from('services')
    .update({ isPaid: false })
    .eq('id', service.id)

  if (error) {
    toast.error('Error al actualizar el servicio.')
    return
  }

  await fetchServices()
}

export const onDelete = async (service) => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', service.id)

  if (error) {
    toast.error('Error al eliminar el servicio.')
    return
  }

  await fetchServices()
}