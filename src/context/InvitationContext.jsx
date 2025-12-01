import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchInvitation } from '@/services/api';

const InvitationContext = createContext(null);

/**
 * InvitationProvider component
 * Provides the invitation UID and config data throughout the app
 *
 * The UID can be obtained from:
 * 1. URL path: /couple-name-2025
 * 2. URL query parameter: ?uid=couple-name-2025 (legacy support)
 * 3. Environment variable: VITE_INVITATION_UID
 *
 * The config is fetched from the API based on the UID
 *
 * @example
 * <InvitationProvider>
 *   <App />
 * </InvitationProvider>
 */
export function InvitationProvider({ children }) {
  const location = useLocation();

  const invitationUid = useMemo(() => {
    // 1. Try to get UID from URL path (e.g., /rifqi-dina-2025)
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      // First segment is the UID
      return pathSegments[0];
    }

    // 2. Try to get UID from URL query parameter (legacy support)
    const urlParams = new URLSearchParams(location.search);
    const uidFromUrl = urlParams.get('uid');

    if (uidFromUrl) {
      return uidFromUrl;
    }

    // 3. Fallback to environment variable
    const uidFromEnv = import.meta.env.VITE_INVITATION_UID;

    if (uidFromEnv) {
      return uidFromEnv;
    }

    // If no UID is provided, log a warning
    console.warn('No invitation UID found. Please provide /your-uid in the URL or set VITE_INVITATION_UID in .env');
    return null;
  }, [location.pathname, location.search]);

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
    <InvitationContext.Provider value={{ uid: invitationUid, config, isLoading, error }}>
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
