import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
 user: any;
 login: (credentials: any) => void;
 register: (data: any) => void;
 logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 const [user, setUser] = useState<any>(null);

 const login = (credentials: any) => setUser({ name: 'Demo User', ...credentials });
 const register = (data: any) => setUser({ name: data.name || 'Demo User', ...data });
 const logout = () => setUser(null);

 return (
 <AuthContext.Provider value={{ user, login, register, logout }}>
 {children}
 </AuthContext.Provider>
 );
};

export const useAuth = () => {
 const context = useContext(AuthContext);
 if (!context) throw new Error('useAuth must be used within an AuthProvider');
 return context;
};
