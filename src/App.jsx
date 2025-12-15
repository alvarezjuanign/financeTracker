import { useState } from "react";
import { createClient } from '@supabase/supabase-js'
import { useEffect } from "react";
const supabaseUrl = 'https://alvswqerdgtecikravxz.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export function App() {
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState('');
  const [notificationDays, setNotificationDays] = useState('3');
  const [isRecurring, setIsRecurring] = useState(false);
  const [services, setServices] = useState([]);
  const [isPaid, setIsPaid] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newService = {
      name: name,
      dueDate: dueDate,
      amount: parseFloat(amount),
      notificationDays: parseInt(notificationDays),
      isRecurring: isRecurring,
      isPaid: isPaid
    };

    const { error } = await supabase
      .from('services')
      .insert({
        name: newService.name,
        dueDate: newService.dueDate,
        amount: newService.amount,
        notificationDays: newService.notificationDays,
        isRecurring: newService.isRecurring,
        isPaid: newService.isPaid
      });

    if (error) {
      console.error('Error inserting service:', error);
      return;
    }

    await fetchServices();

    setName('');
    setDueDate('');
    setAmount('');
    setNotificationDays('3');
    setIsRecurring(false);
    setIsPaid(false);
  };

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('dueDate', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
    } else {
      console.log('Fetched services:', data);
      setServices(data);
    }
  }

  const handlePayment = async (serviceId) => {
    const { data, error } = await supabase
      .from('services')
      .update({ isPaid: true })
      .eq('id', serviceId)
    fetchServices();
  }

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-border mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Agregar Nuevo Servicio</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Nombre del Servicio</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Agua, Luz, Internet"
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Fecha de Vencimiento</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Monto a Pagar</label>
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
            <label className="block text-sm font-medium text-foreground mb-2">Notificar (días antes)</label>
            <select
              value={notificationDays}
              onChange={(e) => setNotificationDays(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="1">1 día antes</option>
              <option value="2">2 días antes</option>
              <option value="3">3 días antes</option>
              <option value="5">5 días antes</option>
              <option value="7">1 semana antes</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <input
            type="checkbox"
            id="isRecurring"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4 text-primary cursor-pointer"
          />
          <label htmlFor="isRecurring" className="text-sm font-medium text-foreground cursor-pointer">
            Servicio mensual
          </label>
        </div>

        <button type="submit" className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
          Agregar Servicio
        </button>
      </form>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">Servicios Registrados</h2>
        {services.length === 0 ? (<p>No hay servicios registrados.</p>)
          : (<ul className="space-y-4">
            {services.filter(service => !service.isPaid).map((service) => (
              <div key={service.id}>
                <li >{service.name}</li>
                <li>{service.dueDate}</li>
                <li>{service.amount}</li>
                <button onClick={() => handlePayment(service.id)}>Marcar como pagado</button>
              </div>
            ))
            }
          </ul>
          )
        }
      </section >
    </>
  );
};