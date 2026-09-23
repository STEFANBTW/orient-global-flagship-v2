import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface Props {
 onNavigate: (page: any) => void;
}

const Register: React.FC<Props> = ({ onNavigate }) => {
 const { register } = useAuth();
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [pass, setPass] = useState('');
 const [loading, setLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 await register({ email, pass, name });
 setLoading(false);
 onNavigate('Dashboard');
 };

 return (
 <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans transition-colors duration-300">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="bg-surface border border-border rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
 >
 <div className="p-8">
 <h2 className="text-2xl font-bold mb-2 text-center text-foreground">Create Account</h2>
 <p className="text-muted-foreground text-center mb-6 text-sm">Join Orient Suite for exclusive wholesale pricing.</p>

 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Full Name</label>
 <input 
 type="text" 
 required
 className="w-full rounded-lg border-border bg-background text-foreground focus:ring-primary focus:border-primary"
 placeholder="John Doe"
 value={name}
 onChange={e => setName(e.target.value)}
 />
 </div>
 <div>
 <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Email Address</label>
 <input 
 type="email" 
 required
 className="w-full rounded-lg border-border bg-background text-foreground focus:ring-primary focus:border-primary"
 placeholder="you@company.com"
 value={email}
 onChange={e => setEmail(e.target.value)}
 />
 </div>
 <div>
 <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Password</label>
 <input 
 type="password" 
 required
 className="w-full rounded-lg border-border bg-background text-foreground focus:ring-primary focus:border-primary"
 placeholder="••••••••"
 value={pass}
 onChange={e => setPass(e.target.value)}
 />
 </div>
 <button 
 type="submit" 
 disabled={loading}
 className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70"
 >
 {loading ? 'Creating...' : 'Register'} <span className="material-icons text-sm">person_add</span>
 </button>
 </form>
 
 <div className="mt-6 text-center text-sm text-muted-foreground">
 Already have an account? <button onClick={() => onNavigate('Login')} className="text-primary font-bold hover:underline">Sign In</button>
 </div>
 </div>
 </motion.div>
 </div>
 );
};
export default Register;
