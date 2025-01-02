import React from 'react';
import { LogOut } from 'lucide-react';
import { useFirebase } from '../../contexts/FirebaseContext';

export function Header() {
  const { loggedInUser, signingOut } = useFirebase();

  return (
    <header className="glass-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Welcome, {loggedInUser}</h1>
        <button
          onClick={signingOut}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </header>
  );
}