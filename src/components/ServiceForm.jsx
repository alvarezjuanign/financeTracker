import { useState } from "react"
import { supabase } from '../lib/supabase'
import { toast, Toaster } from 'sonner'
import { fetchServices } from '../App'

export function ServiceForm() {
  const [name, setName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [amount, setAmount] = useState('')
  const [notificationDays, setNotificationDays] = useState('3')
  const [isRecurring, setIsRecurring] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!name || !dueDate) {
      toast.error('Por favor, completa todos los campos obligatorios.')
      return
    }

    const newService = {
      name: name,
      dueDate: dueDate,
      amount: parseFloat(amount),
      notificationDays: parseInt(notificationDays),
      isRecurring: isRecurring,
      isPaid: false,
    }

    const { error } = await supabase.from('services').insert({
      name: newService.name,
      dueDate: newService.dueDate,
      amount: newService.amount,
      notificationDays: newService.notificationDays,
      isRecurring: newService.isRecurring,
      isPaid: newService.isPaid,
    })

    if (error) {
      toast.error('Error al agregar el servicio.')
      return
    } else {
      toast.success('Servicio agregado correctamente.')
    }

    await fetchServices()

    setName('')
    setDueDate('')
    setAmount('')
    setNotificationDays('3')
    setIsRecurring(false)
  }

  return (
    <form
      onSubmit={onSubmit}
      className='rounded-lg p-6 border border-border mb-8'
    >
      <h2 className='text-xl font-bold text-foreground mb-4'>
        Agregar Nuevo Servicio
      </h2>

      <div className='grid gap-4 md:grid-cols-2'>
        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            Nombre del Servicio
          </label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Agua, Luz, Internet...'
            className='w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            Fecha de Vencimiento
          </label>
          <input
            type='date'
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className='w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            Monto a Pagar
          </label>
          <input
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder='0.00'
            step='0.01'
            min='0'
            className='w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>
            Notificar (días antes)
          </label>
          <select
            value={notificationDays}
            onChange={(e) => setNotificationDays(e.target.value)}
            className='w-full px-4 py-2 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary'
          >
            <option value='1'>1 día antes</option>
            <option value='2'>2 días antes</option>
            <option value='3'>3 días antes</option>
            <option value='5'>5 días antes</option>
            <option value='7'>1 semana antes</option>
          </select>
        </div>
      </div>

      <div className='flex items-center gap-3 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200'>
        <input
          type='checkbox'
          id='isRecurring'
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className='w-4 h-4 cursor-pointer'
        />
        <label
          htmlFor='isRecurring'
          className='text-sm font-medium cursor-pointer'
        >
          Servicio mensual
        </label>
      </div>

      <button
        type='submit'
        className='w-full mt-4 bg-blue-500 hover:bg-blue-600/90 text-white px-4 py-2 rounded-lg font-semibold transition-colors hover:cursor-pointer'
      >
        Agregar Servicio
      </button>
    </form>
  )
}

