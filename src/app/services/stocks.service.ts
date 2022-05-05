import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StocksService {
 
  apiKey = "bu4f8kn48v6uehqi3cqg";
  constructor( private http:HttpClient) { }

  getQuote$(symbol: string) {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.apiKey}`;
    return this.http.get(url);
  }

  getSearch$(symbol: string) {
    const url =`https://finnhub.io/api/v1/search?q=${symbol}&token=${this.apiKey}`;
    return this.http.get(url);
  }
  getInsiderSentiment$(symbol: string, fDate, tDate) {
    const url =`https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${symbol}&from=${fDate}&to=${tDate}&token=${this.apiKey}`;
    return this.http.get(url);
  }
}
