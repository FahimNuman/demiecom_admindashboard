import { useState } from "react";
import loginImg from "../assets/Login.png";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onsubmitHanlder = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backend_url}/api/user/admin`, {
        email,
        password,
      });

      console.log("login response", response.data);
      // console.log("login response", response.data);

      if (response.data.status == "success") {
        setToken(response.data.token); // Set the token to indicate successful login

        const base64Url = response.data.token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedToken = JSON.parse(atob(base64));

        console.log("decodedToken", decodedToken);

        Cookies.set("token", response?.data?.token);
        Cookies.set("adminInfo", JSON.stringify(decodedToken));
        Cookies.set(
          "expireIn",
          decodedToken.exp + Math.floor(Date.now() / 1000)
        );

        toast.success("Login successful!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "An error occurred during login.");
    }
  };

  return (
    <section className="absolute top-0 left-0 h-full w-full z-50 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="flex h-full w-full">
        {/* Form Section */}
        <div className="flex w-full sm:w-1/2 items-center justify-center">
          <form
            onSubmit={onsubmitHanlder}
            className="flex flex-col items-center w-[90%] sm:max-w-md m-auto gap-y-6 text-gray-800"
          >
            <div className="w-full mb-4">
              <h3 className="text-2xl font-bold">Login</h3>
            </div>
            <div className="w-full">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email"
                required
                className="w-full px-4 py-2 ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 rounded bg-white mt-1 shadow-sm"
              />
            </div>

            <div className="w-full">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
                className="w-full px-4 py-2 ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 rounded bg-white mt-1 shadow-sm"
              />
            </div>

            <button type="submit" className="btn-dark w-full mt-5 !py-[9px]">
              Login
            </button>
          </form>
        </div>

        {/* Image Section */}
        <div className="w-1/2 hidden sm:block">
          <img
            src="{loginImg}"
            alt="Login Illustration"
            className="object-cover h-full w-full rounded-l-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Login;
