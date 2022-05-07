import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { map, mergeMap, } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { StocksService } from 'src/app/services/stocks.service';
import { StockLookup, StockQuote, Stocks } from 'src/models/stock.model';

@Component({
  selector: 'app-stock-search',
  templateUrl: './stock-search.component.html',
  styleUrls: ['./stock-search.component.scss']
})
export class StockSearchComponent implements OnInit {
  stockSymbol: FormControl;
  stockQuoteData: Stocks[] = [];
  stockNamelDetails: StockLookup[] = [];
  constructor(private fb: FormBuilder, private stockService: StocksService) { }

  ngOnInit(): void {
    this.stockSymbol = this.fb.control(null);
    if (localStorage.getItem("stocks") !== null) {
      const stocks = JSON.parse(localStorage.getItem("stocks"));
      this.stockQuoteData = stocks;
    }

    if (localStorage.getItem('stocksymbol') !== null) {
      this.stockSymbol.setValue(localStorage.getItem('stocksymbol').replace(/^"(.*)"$/, '$1'));
    }
  }

  searchQuote() {
    localStorage.clear();
    this.stockQuoteData = [];
    this.stockNamelDetails = [];
    const qSymbol = this.stockSymbol.value.split(',');
    localStorage.setItem('stocksymbol', JSON.stringify(this.stockSymbol.value.toUpperCase()));
    if (qSymbol) {
      qSymbol.forEach(searchKeySymbol => {
        const symbol = searchKeySymbol.toUpperCase().trim();
        this.stockService.getSearch$(symbol).pipe(
          map(stocks => {
            const stockName = stocks['result'].filter(element => {
              return element.symbol === symbol;
            });

            return stockName;
          }),
          mergeMap(stockName => {
            return this.stockService.getQuote$(stockName[0].symbol).pipe(
              map(quoteInfo => {
                return { symbol: stockName[0], stockQuote: quoteInfo }
              })
            );
          })
        ).subscribe((result: Stocks) => {
          this.stockQuoteData.push(result)
          localStorage.setItem('stocks', JSON.stringify(this.stockQuoteData));
        });
      });

    }
  }

  onRemoveQuote(value) {
    let fieldValue = [];


    this.stockQuoteData.splice(value);

    this.stockQuoteData.forEach(value => {
      fieldValue.push(value.symbol.symbol);
    });

    this.stockSymbol.setValue(fieldValue.join(','));
    localStorage.setItem('stocksymbol', JSON.stringify(this.stockSymbol.value.toUpperCase()));
    localStorage.setItem('stocks', JSON.stringify(this.stockQuoteData));
  }

}
