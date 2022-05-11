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
  stockSymbolFC: FormControl;
  stockQuoteData: Stocks[] = [];
  constructor(private fb: FormBuilder, private stockService: StocksService) { }

  ngOnInit(): void {
    this.stockSymbolFC = this.fb.control(null);
    if (this.stockService.getStocks()) {
      this.stockQuoteData = this.stockService.getStocks();
    }

    if (this.stockService.getSymbols() !== null) {
      const storedSymbols = this.stockService.getSymbols();
      // this.stockSymbolFC.setValue(storedSymbols.join(', '));
    }
  }

  isExistingSymbolInStore(newSymbols) {
    const symbols = this.stockService.getSymbols();

    return symbols.includes(newSymbols);


  }

  searchQuote() {
    const qSymbol = this.stockSymbolFC.value.toUpperCase().trim();
    if(!this.isExistingSymbolInStore(qSymbol)) {
      const qSybl = qSymbol.toUpperCase().trim();
      this.stockService.addSymbols(qSybl);
      this.getStock(qSybl);
    }
    // const querySymbols = this.isExistingSymbolInStore(qSymbol);
    // if (querySymbols && querySymbols.length > 0) {
    //   querySymbols.forEach(element => {
    //     const qSybl =element.toUpperCase().trim();
    //     this.stockService.addSymbols(qSybl);
    //     this.getStock(qSybl);
    //   });
    // }
  }

  getStock(symbol) {
    this.stockService.getSearch$(symbol).pipe(
      map(stocks => {
        const stockName = stocks['result'].filter(element => {
          return element.symbol === symbol;
        });

        return stockName;
      }),
      mergeMap(stockName => {
        return this.stockService.getQuote$(stockName[0]?.symbol).pipe(
          map(quoteInfo => {
            return { symbol: stockName[0], stockQuote: quoteInfo }
          })
        );
      })
    ).subscribe((result: Stocks) => {
      this.stockQuoteData.push(result);
      this.stockSymbolFC.setValue(null);
      localStorage.setItem('stocks', JSON.stringify(this.stockQuoteData));
    });
  }

  onRemoveQuote(currentStock) {
    let fieldValue = [];

    const stockIndex = this.stockQuoteData.indexOf(currentStock);

    this.stockQuoteData.splice(stockIndex, 1)

    localStorage.setItem('stocks', JSON.stringify(this.stockQuoteData));
  }

}
