import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchInvitation } from '@/services/api';

const InvitationContext = createContext(null);

/**
 * InvitationProvider component
 * Provides the invitation UID, guest info, and config data throughout the app
 *
 * URL Formats:
 * 1. Public Mode: /{uid}?to=Guest Name
 *    - Guest name langsung di URL, mudah diubah
 *    - Untuk paket Basic
 *
 * 2. Private Mode: /{uid}?g=XK7M2P
 *    - Kode unik per tamu, divalidasi server
 *    - Untuk paket Premium
 *
 * @example
 * <InvitationProvider>
 *   <App />
 * </InvitationProvider>
 */
export function InvitationProvider({ children }) {
  const location = useLocation();

  // Extract UID from URL path
  const invitationUid = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      return pathSegments[0];
    }
    return null;
  }, [location.pathname]);

  // Extract guest info from query params
  const guestInfo = useMemo(() => {
    const urlParams = new URLSearchParams(location.search);

    // Mode Public: ?to=Guest Name (langsung, tidak di-encode)
    const guestName = urlParams.get('to');
    if (guestName) {
      return {
        mode: 'public',
        name: guestName,
        code: null
      };
    }

    // Mode Private: ?g=XK7M2P (kode unik)
    const guestCode = urlParams.get('g');
    if (guestCode) {
      return {
        mode: 'private',
        name: null, // Will be fetched from server
        code: guestCode
      };
    }

    // No guest info
    return {
      mode: 'public',
      name: null,
      code: null
    };
  }, [location.search]);

  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!invitationUid) {
      setIsLoading(false);
      return;
    }

    const loadConfig = async () => {
      try {
        setIsLoading(true);
        const response = await fetchInvitation(invitationUid);
        if (response.success) {
          setConfig(response.data);
        } else {
          setError('Failed to load invitation');
        }
      } catch (err) {
        console.error('Error loading invitation config:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, [invitationUid]);

  return (
    <InvitationContext.Provider value={{ uid: invitationUid, config, isLoading, error, guest: guestInfo }}>
      {children}
    </InvitationContext.Provider>
  );
}

/**
 * Custom hook to access the invitation UID
 *
 * @returns {object} Object containing the invitation UID
 * @throws {Error} If used outside of InvitationProvider
 *
 * @example
 * const { uid } = useInvitation();
 */
export function useInvitation() {
  const context = useContext(InvitationContext);

  if (context === null) {
    throw new Error('useInvitation must be used within InvitationProvider');
  }

  return context;
}
