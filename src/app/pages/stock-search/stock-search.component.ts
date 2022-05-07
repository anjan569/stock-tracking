import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { map, mergeMap,  } from 'rxjs/operators';
import { forkJoin  } from 'rxjs';
import { StocksService } from 'src/app/services/stocks.service';
import { StockLookup, StockQuote, Stocks } from 'src/models/stock.model';

@Component({
  selector: 'app-stock-search',
  templateUrl: './stock-search.component.html',
  styleUrls: ['./stock-search.component.scss']
})
export class StockSearchComponent implements OnInit {
  stockSymbol: FormControl;
  stockQuoteData: Stocks[] =[];
  stockNamelDetails: StockLookup[] = [];
  constructor(private fb: FormBuilder, private stockService: StocksService) { }

  ngOnInit(): void {
    this.stockSymbol = this.fb.control(null);
    if (localStorage.getItem("stocks") !== null) {
     const stocks = JSON.parse(localStorage.getItem("stocks"));
     
    }
  }

  searchQuote() {
    localStorage.clear();
    this.stockQuoteData = [];
    this.stockNamelDetails = [];
    const qSymbol = this.stockSymbol.value.split(',');
    localStorage.setItem('stocksymbol', JSON.stringify(this.stockSymbol.value.toUpperCase()));
    if(qSymbol) {
      qSymbol.forEach(searchKeySymbol => {
        const symbol = searchKeySymbol.toUpperCase().trim();
        this.stockService.getSearch$(symbol).pipe(
          map(stocks => {
           const stockName =  stocks['result'].filter(element => {
              return element.symbol === symbol;
            });
           
            return stockName;
          }),
          mergeMap(stockName => {
            return this.stockService.getQuote$(stockName[0].symbol).pipe(
              map(quoteInfo => {
                return {symbol: stockName[0], stockQuote: quoteInfo}
              })
            );
          })
        ).subscribe((result: Stocks)=> {
          this.stockQuoteData.push(result)
          // console.log(this.stockQuoteData);
        });
      });
      localStorage.setItem('stocks', JSON.stringify(this.stockQuoteData));
    }
    
    // const quoteUrl= this.stockService.getQuote$(qSymbol);
    // const searchUrl = this.stockService.getSearch$(qSymbol);
    // forkJoin([quoteUrl,searchUrl]).subscribe(response => {
    //   if(response) {
    //     if(Array.isArray(response[0])) {
    //       this.stockQuoteData =response[0];
    //     } else {
    //       this.stockQuoteData.push(response[0] as StockQuote);
    //     }
        
      
    //     localStorage.setItem('stocks', JSON.stringify(this.stockQuoteData));
    //     localStorage.setItem('stocksymbol', JSON.stringify(this.stockSymbolDetails[0]));
        

    //   }      
    // })
    
  }

  onRemoveQuote(value) {
    console.log(value);
    this.stockQuoteData.splice(value);
    localStorage.setItem('stocks', JSON.stringify(this.stockQuoteData));
  }

}
