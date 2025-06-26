import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import { Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) return null;
  return user ? children : <Navigate to="/admin-login" />;
}
