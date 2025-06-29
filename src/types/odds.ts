export interface Odd {
  bookmaker: string;
  bets: Array<{
    label: string;
    values: Array<{
      value: string;
      odd: string;
    }>;
  }>;
}

export interface OddsApiResponse {
  response: Array<{
    league: {
      id: number;
      name: string;
      country: string;
      logo: string;
      flag: string;
      season: number;
    };
    fixture: {
      id: number;
      date: string;
      teams: {
        home: { id: number; name: string; logo: string };
        away: { id: number; name: string; logo: string };
      };
    };
    bookmakers: Array<Odd>;
  }>;
} 