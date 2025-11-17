
import { isDemoMode, config } from '../lib/config';
import { Badge } from './ui/badge';

export function ApiStatus() {
  const isDemo = isDemoMode();

  // Only show in development (safe for Vite or CRA)
  const isProd =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD) ||
    process.env.NODE_ENV === 'production';

  if (isProd) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
     
    </div>
  );
}
