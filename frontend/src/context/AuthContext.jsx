import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const demoUsers = [
  {
    name: "Admin User",
    email: "admin@college.com",
    password: "admin123",
    role: "Admin",
  },
  {
    name: "Faculty User",
    email: "faculty@college.com",
    password: "faculty123",
    role: "Faculty",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("collegeUser");

      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("collegeUser");
      return null;
    }
  });

const login = async (
  email,
  password,
  selectedRole
) => {

  // =========================
  // STUDENT LOGIN
  // =========================

  if (selectedRole === "Student") {

    try {

      const response = await fetch(
        "http://localhost:5083/api/students/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {

        return {
          success: false,
          message: "Invalid email or password.",
        };

      }

      const student = await response.json();

      const loggedInUser = {
        name: student.name,
        email: student.email,
        role: "Student",
        studentId: student.id,
      };

      setUser(loggedInUser);

      localStorage.setItem(
        "collegeUser",
        JSON.stringify(loggedInUser)
      );

      return {
        success: true,
      };

    } catch (error) {

      console.error(
        "Student login failed:",
        error
      );

      return {
        success: false,
        message:
          "Unable to connect to the server.",
      };

    }

  }

  // =========================
  // ADMIN / FACULTY LOGIN
  // =========================

  const foundUser = demoUsers.find(
    (item) =>
      item.email === email &&
      item.password === password &&
      item.role === selectedRole
  );

  if (!foundUser) {

    return {
      success: false,
      message:
        "Invalid credentials for the selected role.",
    };

  }

  const loggedInUser = {
    name: foundUser.name,
    email: foundUser.email,
    role: foundUser.role,
    studentId: null,
  };

  setUser(loggedInUser);

  localStorage.setItem(
    "collegeUser",
    JSON.stringify(loggedInUser)
  );

  return {
    success: true,
  };

};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("collegeUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}