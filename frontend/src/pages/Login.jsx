import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
const { login } = useAuth();

const [selectedRole, setSelectedRole] = useState("Admin");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const roles = [
{
name: "Admin",
icon: "🛡️",
},
{
name: "Faculty",
icon: "👨‍🏫",
},
{
name: "Student",
icon: "🎓",
},
];

const handleLogin = async (event) => {
event.preventDefault();

setError("");

const result = await login(
  email,
  password,
  selectedRole
);

if (!result.success) {
  setError(result.message);
}

};

const selectRole = (role) => {
setSelectedRole(role);
setEmail("");
setPassword("");
setError("");
};

return ( <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">

  <div className="w-full max-w-md">

    {/* Header */}

    <div className="mb-6 text-center">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-3xl shadow-lg">
        🎓
      </div>

      <h1 className="mt-4 text-3xl font-bold text-slate-900">
        College Portal
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Sign in to access your dashboard
      </p>

    </div>

    {/* Login Card */}

    <div className="rounded-3xl bg-white p-7 shadow-xl">

      {/* Role Switcher */}

      <div className="mb-7 grid grid-cols-3 rounded-xl bg-slate-100 p-1">

        {roles.map((role) => (

          <button
            key={role.name}
            type="button"
            onClick={() => selectRole(role.name)}
            className={`rounded-lg px-2 py-3 text-sm font-semibold transition ${
              selectedRole === role.name
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >

            <div className="mb-1 text-lg">
              {role.icon}
            </div>

            {role.name}

          </button>

        ))}

      </div>

      {/* Form */}

      <form
        onSubmit={handleLogin}
        className="space-y-5"
      >

        {/* Email */}

        <div>

          <label className="text-sm font-semibold text-slate-700">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Enter your email"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            required
          />

        </div>

        {/* Password */}

        <div>

          <label className="text-sm font-semibold text-slate-700">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Enter your password"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            required
          />

        </div>

        {/* Error */}

        {error && (

          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>

        )}

        {/* Login Button */}

        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.98]"
        >
          Login as {selectedRole}
        </button>

      </form>

    </div>

  </div>

</div>

);
}

export default Login;
