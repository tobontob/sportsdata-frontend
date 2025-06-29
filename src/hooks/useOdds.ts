import { useEffect, useState } from 'react';
import { OddsApiResponse } from '@/types/odds';

export function useOdds(matchId: string | number) {
  const [odds, setOdds] = useState<OddsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) return;
    setLoading(true);
    setError(null);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/matches/${matchId}/odds`)
      .then(res => res.json())
      .then(data => {
        setOdds(data);
        setLoading(false);
      })
      .catch(err => {
        setError('배당률 정보를 불러오지 못했습니다.');
        setLoading(false);
      });
  }, [matchId]);

  return { odds, loading, error };
} 