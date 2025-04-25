import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Home, Package, Users, LogOut } from "lucide-react";
import { Logout } from "@/actions/logout";
import Form from "next/form";
import Image from "next/image";
import { useSession } from "next-auth/react";
import AdminSidebar from "./sidebars/admin-sidebar";
import FarmerSidebar from "./sidebars/farmer-sidebar";
import BankSidebar from "./sidebars/bank-sidebar";
import CustomerSidebar from "./sidebars/customer-sidebar";


export default function Sidebar() {
  const { data: session, status } = useSession();
  const router = useRouter(); 
  const userRole = session?.user?.role;
  
  if (process.env.NODE_ENV !== "production") {
    console.log("Session status:", status);
    console.log("Session data:", session);
    console.log("User role:", userRole);
  }
  
  useEffect(() => {
    if (!session && status !== "loading") {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [session, status, router]);
  
  if (status === "loading") {
    return (
      <div className="h-screen w-64 bg-white p-4 shadow-md">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-2 border-gray-300 border-t-blue-500 mx-auto"></div>
            <p>Loading sidebar...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!session || !session.user) {
    return (
      <div className="h-screen w-64 bg-white p-4 shadow-md">
        <div className="flex h-full flex-col items-center justify-center">
          <p className="mb-2 text-red-500">Sesi tidak ditemukan</p>
          <p className="text-sm text-gray-500">Mengalihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  switch (userRole) {
    case "ADMIN":
      return <AdminSidebar />;
    case "FARMER":
      return <FarmerSidebar />;
    case "BANK":
      return <BankSidebar />;
    case "CUSTOMER":
      return <CustomerSidebar />;
    default:
      console.log(`Tidak ada role yang cocok ditemukan: ${userRole}`);
      return (
        <div className="h-screen w-64 bg-white p-4 shadow-md">
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-gray-500">
              Role tidak dikenali: {userRole || "tidak ada"}.<br/>
              Silakan hubungi administrator.
            </p>
          </div>
        </div>
      );
  }
}