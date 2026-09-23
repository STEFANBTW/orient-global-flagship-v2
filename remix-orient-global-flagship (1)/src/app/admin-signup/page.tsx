'use client';

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRoles } from "@/context/role-context";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ShieldCheck, ArrowLeft, ArrowRight, User, Phone, Mail, Calendar, Building } from "lucide-react";
import { motion } from "framer-motion";
import { DIVISIONS } from "@/app/lib/mock-data";
import { getAllUsers, saveUser, setActiveAdminUser } from "@/services/userService";

export default function AdminSignupPage({ onCancel }: { onCancel?: () => void }) {
  const { setCurrentUser } = useRoles();
  const navigate = useNavigate();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [role, setRole] = useState<"boss" | "hod" | "staff">("staff");
  const [department, setDepartment] = useState("bakery");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !surname.trim() || !phone.trim() || !email.trim() || !dob.trim() || !role || !department) {
      setErrorMsg("All fields are mandatory for admin registration.");
      return;
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const allUsers = getAllUsers();
    const existing = allUsers.find(u => u.phone.replace(/\s+/g, '') === cleanPhone);

    if (existing) {
      setErrorMsg("This phone number is already registered. Please login instead.");
      return;
    }

    setIsSigningUp(true);

    try {
      const newAdminId = `usr_admin_${Date.now()}`;
      const fullName = `${name.trim()} ${surname.trim()}`;
      const initials = `${name.trim()[0] || ''}${surname.trim()[0] || ''}`.toUpperCase() || 'AD';

      const newAdmin = {
        id: newAdminId,
        name: fullName,
        surname: surname.trim(),
        phone: phone.trim(),
        email: email.trim(),
        dob: dob.trim(),
        role: role,
        division: department,
        avatar: initials,
        createdAt: new Date().toISOString()
      };

      await saveUser(newAdmin);
      setActiveAdminUser(newAdmin);
      sessionStorage.setItem('orient_dashboard_mode', 'admin');

      if (setCurrentUser) {
        setCurrentUser({
          id: newAdmin.id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          division: newAdmin.division as any,
          avatar: newAdmin.avatar
        });
      }

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 300);
    } catch (err) {
      setErrorMsg("Registration failed. Please check all details and try again.");
      setIsSigningUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-x-hidden font-sans">
      {onCancel && (
        <button 
          onClick={onCancel}
          className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </button>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg relative z-10 my-auto"
      >
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground uppercase italic">Admin Registration</h1>
        </div>

        <Card className="border-none shadow-xl bg-card/90 backdrop-blur-md">
          <CardContent className="p-6 sm:p-8 space-y-5">
            {errorMsg && (
              <div className="p-3 text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAdminSignup} className="space-y-4">
              {/* Name & Surname */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s'-]/g, ''))}
                    className="w-full h-11 px-3 rounded-xl border-none bg-[#1a1a1a] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    placeholder="First Name"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                    Surname <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={surname}
                    onChange={(e) => setSurname(e.target.value.replace(/[^a-zA-Z\s'-]/g, ''))}
                    className="w-full h-11 px-3 rounded-xl border-none bg-[#1a1a1a] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    placeholder="Surname"
                    required
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\s-]/g, ''))}
                      className="w-full h-11 pl-10 pr-3 rounded-xl border-none bg-[#1a1a1a] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium font-mono"
                      placeholder="+234 800 000 0000"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 rounded-xl border-none bg-[#1a1a1a] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                      placeholder="admin@orientglobal.ng"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* DOB */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Date of Birth (DOB) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground pointer-events-none" />
                  <input 
                    type="date" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border-none bg-[#1a1a1a] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium cursor-pointer"
                    required
                  />
                </div>
              </div>

              {/* Role & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-xl border-none bg-[#1a1a1a] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold cursor-pointer"
                    required
                  >
                    <option value="boss" className="bg-[#1a1a1a] text-foreground py-2 font-semibold">Boss (Tier 01)</option>
                    <option value="hod" className="bg-[#1a1a1a] text-foreground py-2 font-semibold">HOD (Tier 02)</option>
                    <option value="staff" className="bg-[#1a1a1a] text-foreground py-2 font-semibold">Staff (Tier 03)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border-none bg-[#1a1a1a] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold cursor-pointer"
                    required
                  >
                    <option value="global" className="bg-[#1a1a1a] text-foreground py-2 font-semibold">Global (All Divisions)</option>
                    {DIVISIONS.map((d) => (
                      <option key={d.id} value={d.id} className="bg-[#1a1a1a] text-foreground py-2 font-semibold">{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSigningUp}
                className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 border-none"
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Registering...
                  </>
                ) : (
                  <span>Enroll Admin Account</span>
                )}
              </button>
            </form>

            <div className="text-center text-xs font-medium text-muted-foreground pt-3 border-t border-[#1a1a1a]">
              Already enrolled?{' '}
              <Link to="/admin-login" className="text-primary hover:underline font-bold">
                Admin Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
