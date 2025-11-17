

// "use client";

// import { useState } from "react";
// import { Music } from "lucide-react";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { ButtonPrimary } from "../components/ButtonPrimary";
// import { SEO } from "../components/SEO";
// import { useAuth } from "../hooks/useAuth";
// import { toast } from "sonner@2.0.3";

// // Support both Next.js and React Router
// const isNextJs =
//   typeof window === "undefined" || !!(window as any).__NEXT_DATA__;
// let Link: any;
// let useRouter: any;
// let useNavigate: any;

// if (isNextJs) {
//   try {
//     const nextRouter = require("next/navigation");
//     const nextLink = require("next/link");
//     Link = nextLink.default;
//     useRouter = nextRouter.useRouter;
//   } catch {}
// }

// if (!Link) {
//   try {
//     const reactRouter = require("react-router-dom");
//     Link = reactRouter.Link;
//     useNavigate = reactRouter.useNavigate;
//   } catch {
//     Link = ({ to, href, children, ...props }: any) => (
//       <a href={to || href} {...props}>
//         {children}
//       </a>
//     );
//   }
// }

// export default function Login() {
//   const router = useRouter ? useRouter() : null;
//   const navigate = useNavigate ? useNavigate() : null;
//   const { login } = useAuth();

//   // Default demo credentials pre-filled
//   const DEMO_EMAIL = "demo@cageriot.com";
//   const DEMO_PASSWORD = "demo123";

//   const [email, setEmail] = useState(DEMO_EMAIL);
//   const [password, setPassword] = useState(DEMO_PASSWORD);
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await login({ email, password });
//       toast.success("Login successful!");

//       // Navigate using either Next.js or React Router
//       if (router) {
//         router.push("/dashboard");
//       } else if (navigate) {
//         navigate("/dashboard");
//       } else {
//         window.location.href = "/dashboard";
//       }
//     } catch (error: any) {
//       toast.error(error?.message || "Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const useDemo = () => {
//     setEmail(DEMO_EMAIL);
//     setPassword(DEMO_PASSWORD);
//     toast.success("Demo credentials loaded");
//   };

//   const clearDemo = () => {
//     setEmail("");
//     setPassword("");
//   };

//   return (
//     <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
//       <SEO
//         title="Login"
//         description="Login to Cage Riot - Music Rights Management Dashboard"
//         keywords="login, music rights, dashboard, cage riot"
//       />
//       {/* Blurred spotlight effect */}
//       <div className="absolute inset-0 flex items-center justify-center">
//         <div className="h-96 w-96 rounded-full bg-[#ff0050]/20 blur-[120px]" />
//       </div>
//       {/* Login box */}
//       <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-800 bg-black/50 p-6 md:p-8 backdrop-blur-xl">
//         {/* Logo */}
//         <div className="mb-8 flex flex-col items-center">
//           <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff0050]">
//             <Music className="h-8 w-8 text-white" />
//           </div>
//           <h1 className="text-2xl text-white">CAGE RIOT</h1>
//           <p className="text-sm text-gray-500">Music Rights Management</p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleLogin} className="space-y-6">
//           <div>
//             <Label htmlFor="email" className="text-gray-300">
//               Email
//             </Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="mt-2 bg-gray-900 border-gray-800 text-white placeholder-gray-500"
//               required
//               disabled={loading}
//             />
//           </div>

//           <div>
//             <Label htmlFor="password" className="text-gray-300">
//               Password
//             </Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="mt-2 bg-gray-900 border-gray-800 text-white placeholder-gray-500"
//               required
//               disabled={loading}
//             />
//           </div>

//           <div className="flex items-center justify-between gap-2">
//             <ButtonPrimary
//               type="submit"
//               className="flex-1 justify-center"
//               disabled={loading}
//             >
//               {loading ? "Logging in..." : "Login"}
//             </ButtonPrimary>

//             {/* Small demo controls */}
//             {/* <div className="flex flex-col items-end gap-2">
// <button
// type="button"
// onClick={useDemo}
// className="text-xs text-gray-300 hover:text-[#ff0050] underline"
// disabled={loading}
// >
// Use demo
// </button>
// <button
// type="button"
// onClick={clearDemo}
// className="text-xs text-gray-500 hover:text-gray-300"
// disabled={loading}
// >
// Clear
// </button>
// </div> */}
//           </div>
//         </form>

//         <div className="mt-6 text-center">
//           <Link
//             to="/forgot-password"
//             href="/forgot-password"
//             className="text-sm text-gray-400 hover:text-[#ff0050]"
//           >
//             Forgot password?
//           </Link>
//         </div>

//         <div className="mt-4 text-center">
//           <p className="text-sm text-gray-400">
//             Don't have an account?{" "}
//             <Link
//               to="/register"
//               href="/register"
//               className="text-[#ff0050] hover:underline"
//             >
//               Sign up
//             </Link>
//           </p>
//         </div>

//         {/* Demo credentials (visible) */}
//         <div className="mt-6 rounded-lg bg-gray-900/50 p-4 text-center">
//           <p className="mb-2 text-xs text-gray-400">Demo credentials:</p>
//           <p className="text-xs text-gray-500">
//             Email: {DEMO_EMAIL}
//             <br />
//             Password: {DEMO_PASSWORD}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { Music } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ButtonPrimary } from "../components/ButtonPrimary";
import { SEO } from "../components/SEO";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner@2.0.3";
import myVideo from "../../src/assets/video.mp4";
export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("demo@cageriot.com");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success("Login successful!");
      window.location.href = "/dashboard";
    } catch (error: any) {
      toast.error(error?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-black text-white">
      <SEO
        title="Cage Riot Partner Login"
        description="Empowering the next generation of independent artists."
      />

      {/* RIGHT SIDE — Login Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6 md:px-12 bg-black">
        {/* LEFT SIDE — Video Section (Desktop only) */}
        <div className="hidden lg:flex md:w-full items-center justify-center p-6">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl w-full h-[90vh] max-w-2xl">
            {/* <video
              src="../../src/assets/video.mp4"
              autoPlay
              loop
              playsInline
              preload="auto"
              className=" inset-0 w-full object-cover rounded-3xl rounded-lg"
              style={{height:"620px"}}
            /> */}

            <video
              src={myVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="inset-0 w-full object-cover rounded-3xl rounded-lg"
              style={{ height: "620px" }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 rounded-3xl"></div>
          </div>
        </div>
        <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-800 bg-black/50 p-6 md:p-8 backdrop-blur-xl">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff0050]">
              <Music className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl text-white">CAGE RIOT</h1>
            <p className="text-sm text-gray-500">Music Rights Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 bg-gray-900 border-gray-800 text-white placeholder-gray-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 bg-gray-900 border-gray-800 text-white placeholder-gray-500"
                required
              />
            </div>

            <ButtonPrimary
              type="submit"
              disabled={loading}
              className="w-full justify-center bg-[#ff0050] hover:bg-[#ff3366]"
            >
              {loading ? "Logging in..." : "Submit"}
            </ButtonPrimary>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/forgot-password"
              className="text-sm text-gray-400 hover:text-[#ff0050]"
            >
              Forgot password?
            </a>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <a href="/register" className="text-[#ff0050] hover:underline">
                Sign up
              </a>
            </p>
          </div>

          <div className="mt-6 rounded-lg bg-gray-900/50 p-4 text-center">
            <p className="mb-2 text-xs text-gray-400">Demo credentials:</p>
            <p className="text-xs text-gray-500">
              Email: demo@cageriot.com
              <br />
              Password: demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
