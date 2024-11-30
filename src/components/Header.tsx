import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ruler, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserDropdown } from './UserDropdown';

const adminSettingsItems = [
  { name: 'Preset Values', href: '/preset-values' },
  { name: 'Quote Template', href: '/quote-template' },
  { name: 'Order Status Template', href: '/order-status-template' },
  { name: 'Receipt Template', href: '/receipt-template' },
];

const salesNavigation = [
  { name: 'Generate Quote', href: '/generate-quote' },
  { name: 'Quotes', href: '/quotes' },
  { name: 'Orders', href: '/orders' },
];

const adminNavigation = [
  ...salesNavigation,
  { name: 'Catalog', href: '/catalog' },
  { name: 'Settings', href: '/preset-values' },
];

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const settingsButtonRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsButtonRef.current && !settingsButtonRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Ruler className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">CabinetQuote</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:space-x-6">
            {(user?.role === 'admin' ? adminNavigation : user?.role === 'sales' ? salesNavigation : []).map((item) => 
              item.name === 'Settings' ? (
                <div key={item.name} className="relative" ref={settingsButtonRef}>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`${
                      adminSettingsItems.some(subItem => location.pathname === subItem.href)
                        ? 'text-indigo-600'
                        : 'text-gray-500 hover:text-gray-900'
                    } inline-flex items-center px-1 pt-1 text-sm font-medium`}
                  >
                    {item.name}
                  </button>
                  {showSettings && (
                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                      {adminSettingsItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className={`${
                            location.pathname === subItem.href
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700'
                          } block px-4 py-2 text-sm hover:bg-gray-50`}
                          onClick={() => setShowSettings(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-900'
                  } inline-flex items-center px-1 pt-1 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4">
            {user ? (
              <UserDropdown user={user} onLogout={logout} />
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Log in
              </Link>
            )}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
        </div>
        
        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="space-y-1 pb-3 pt-2"> 
              {(user?.role === 'admin' ? adminNavigation : user?.role === 'sales' ? salesNavigation : []).map((item) => 
                item.name === 'Settings' ? (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {item.name}
                    </button>
                    {showSettings && (
                      <div className="pl-4">
                        {adminSettingsItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`${
                              location.pathname === subItem.href
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-gray-600'
                            } block px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-gray-900`}
                            onClick={() => {
                              setShowSettings(false);
                              setIsOpen(false);
                            }}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600'
                    } block px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-gray-900`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}