import { useAuth } from "../context/AuthContext";
import { UserCircle } from "lucide-react";

function Profile() {
  const { user } = useAuth();

  const isFaculty = user?.role === "Faculty";

  return (
    <div className="w-full p-8">

      {/* Heading */}
      <div>
        <p className="text-sm font-semibold text-indigo-600">
          {isFaculty ? "FACULTY PORTAL" : "ADMIN PORTAL"}
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-2 text-slate-500">
          View your account information.
        </p>
      </div>

      {/* Profile Header */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <UserCircle
              size={40}
              strokeWidth={1.8}
            />
          </div>

          {/* User Details */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {user?.name || user?.username || "User"}
            </h2>

            <p className="mt-1 text-slate-500">
              {user?.email || "No email available"}
            </p>

            <span className="mt-3 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              {user?.role || "User"}
            </span>
          </div>

        </div>

      </div>

      {/* Account Information */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold text-slate-900">
          Account Information
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Full Name */}
          <div>
            <p className="text-sm text-slate-500">
              Full Name
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {user?.name || user?.username || "Not available"}
            </p>
          </div>

          {/* Email */}
          <div>
            <p className="text-sm text-slate-500">
              Email
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {user?.email || "Not available"}
            </p>
          </div>

          {/* Role */}
          <div>
            <p className="text-sm text-slate-500">
              Role
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {user?.role || "Not available"}
            </p>
          </div>

          {/* Account Type */}
          <div>
            <p className="text-sm text-slate-500">
              Account Type
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {isFaculty ? "Faculty Member" : "Administrator"}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;
