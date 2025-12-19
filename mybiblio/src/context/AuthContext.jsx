import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Emails admin = contiennent @admin
const isAdminEmail = (email) => email?.includes('@admin');

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const signup = (email, password, name) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
      return { error: 'Cet email est déjà utilisé' };
    }

    const newUser = {
      id: Date.now(),
      email,
      password,
      name,
      role: isAdminEmail(email) ? 'admin' : 'etudiant'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem('currentUser', JSON.stringify(safeUser));
    setUser(safeUser);
    
    return { success: true };
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    
    if (!found) {
      return { error: 'Email ou mot de passe incorrect' };
    }

    const { password: _, ...safeUser } = found;
    localStorage.setItem('currentUser', JSON.stringify(safeUser));
    setUser(safeUser);
    
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setReservedZoneId(null);
    setAlerts([]);
  };

  const value = {
    user,
    isAdmin: user?.role === 'admin',
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}