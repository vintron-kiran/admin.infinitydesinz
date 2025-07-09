import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
  exp: number;
  [key: string]: any;
};

export function useAuthGuard() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        localStorage.removeItem('authToken');
        router.replace('/login');
        return;
      }

      setIsReady(true);
    } catch (err) {
      console.error('Token parsing failed', err);
      localStorage.removeItem('authToken');
      router.replace('/login');
    }
  }, [router]);

  return isReady;
}
