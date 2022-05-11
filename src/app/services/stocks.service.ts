import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stocks } from 'src/models/stock.model';


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

  public getStocks() {
     return JSON.parse(localStorage.getItem('stocks'));
  }


  public getSymbols(): string[] {
    const store = localStorage.getItem("stockSymbols");
    let symbols: string[] = [];
    if (store) {
      symbols = store.split(",");
    }
    return symbols;
  }

  
  public addSymbols(symbol: string): void {
    const stockSymbols = this.getSymbols();
    if (stockSymbols.indexOf(symbol) > -1) {
      return;
    }
    stockSymbols.push(symbol.trim());
    localStorage.setItem("stockSymbols", stockSymbols.join(","));

  }

  removeSymbols() {
    localStorage.removeItem('stockSymbols');
  }

  
}
