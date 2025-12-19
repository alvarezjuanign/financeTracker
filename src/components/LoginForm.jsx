import { useState } from "react";

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
    <>
      <h4 className="text-center text-2xl font-semibold mt-20">Iniciar Sesión</h4>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-md">
        <input
          className="mb-4 w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="mb-4 w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 rounded-lg transition-colors bg-blue-500 hover:bg-blue-600 text-white font-medium"
        >
          Login
        </button>
      </form>
    </>
  );
};