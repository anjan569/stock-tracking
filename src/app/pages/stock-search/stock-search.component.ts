import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { StocksService } from 'src/app/services/stocks.service';
import { StockQuote } from './../../../models/stock.model';

@Component({
  selector: 'app-stock-search',
  templateUrl: './stock-search.component.html',
  styleUrls: ['./stock-search.component.scss']
})
export class StockSearchComponent implements OnInit {
  stockSymbol: FormControl;
  stockQuoteData: Object;
  stockSymbolDetails: Object;
  constructor(private fb: FormBuilder, private stockService: StocksService) { }

  ngOnInit(): void {
    this.stockSymbol = this.fb.control(null);
    if (localStorage.getItem("stocks") !== null) {
      this.stockQuoteData = JSON.parse(localStorage.getItem("stocks"));
    }
  }

  searchQuote() {
    localStorage.clear();
    this.stockQuoteData = null;
    this.stockSymbolDetails = null;
    const qSymbol = this.stockSymbol.value.toUpperCase();
    
    const quoteUrl= this.stockService.getQuote$(qSymbol);
    const searchUrl = this.stockService.getSearch$(qSymbol);
    forkJoin([quoteUrl,searchUrl]).subscribe(response => {
      if(response) {
        this.stockQuoteData = response[0];
        this.stockSymbolDetails =  response[1]['result'].filter(element => {
            return element.symbol === qSymbol
        });
        localStorage.setItem('stocks', JSON.stringify(this.stockQuoteData));
        localStorage.setItem('stocksymbol', JSON.stringify(this.stockSymbolDetails[0]));
        

      }      
    })
    
  }

  onRemoveQuote(value) {
    console.log(value);
    localStorage.clear();
    this.stockQuoteData = null;
    this.stockSymbolDetails = null;
  }

}
