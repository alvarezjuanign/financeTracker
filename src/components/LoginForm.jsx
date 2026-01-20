import { useState } from "react";
import LogoFin from "/icons/FinTrackerLogo.svg";

export const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onLogin({ email, password });
    setEmail("");
    setPassword("");
  }

  return (
    <main className="h-screen flex flex-col justify-center">
      <img src={LogoFin} alt="Finance Tracker Logo" className="mx-auto mb-4 h-32" />
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-5 p-6 border border-gray-200 rounded-lg shadow-2xl">
        <h4 className="text-center text-2xl font-semibold mb-6">Bienvenido</h4>
        <label htmlFor="email" className="mb-2 block">Email</label>
        <input
          className="mb-4 w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@example.com"
          id="email"
          name="email"
        />
        <label htmlFor="password" className="mb-2 block">Contraseña</label>
        <input
          className="mb-4 w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 rounded-lg transition-colors bg-blue-500 hover:bg-blue-600 text-white font-medium hover:cursor-pointer"
        >
          Iniciar Sesión
        </button>
        <hr className="my-6" />
        <button className="w-full px-4 py-2 rounded-lg transition-colors bg-gray-500 hover:bg-gray-600 text-white font-medium hover:cursor-pointer">
          Iniciar Sesión como Invitado
        </button>
      </form>
    </main>
  );
};