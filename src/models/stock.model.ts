
export interface Stocks {
   symbol: StockLookup;
   stockQuote: StockQuote
}

export interface StockQuote {
    c: number;
    h: number;
    l: number;
    o: number;
    pc: number;
    t: number;
    d?: number;
    dp?:number;

  }

  export interface StockSentiment {
    data: StockDetails[];
    symbol: string;
  }
  
  export interface StockDetails {
    symbol: string;
    year: number;
    month: number;
    change: number;
    mspr: number;
  }

  export interface StockLookup {
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
  }