import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { StocksService } from './../../services/stocks.service';
import { StockLookup, StockQuote, Stocks } from './../../../models/stock.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-stock-quote',
  templateUrl: './stock-quote.component.html',
  styleUrls: ['./stock-quote.component.scss']
})
export class StockQuoteComponent implements OnChanges, OnInit {
  stockQuoteData: StockQuote;
  @Input() stocks: Stocks;
  @Input() currentIndex: number;
  @Output() onRemoveEvent = new EventEmitter<number>();
  stockSymbol: StockLookup;
  stockChanged: boolean;
  constructor(private stockServie: StocksService, private router: Router) { }

  ngOnInit(): void {
    console.log(this.stocks);
    if(this.stocks) {
      this.stockQuoteData = this.stocks.stockQuote;
      this.stockSymbol = this.stocks.symbol;
    }
    if(this.stockQuoteData) {
      this.stockChanged = this.stockQuoteData.d > 0;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (localStorage.getItem("stocksymbol") !== null) {
      this.stockSymbol = JSON.parse(localStorage.getItem('stocksymbol'));   
      console.log(this.stockSymbol);
      
    }
  }
  onRemove() {
    this.onRemoveEvent.emit(this.currentIndex);
  }

  gotoSentiment() {
    const path = `/sentiment/${this.stockSymbol['displaySymbol']}`;
    this.router.navigate([path]);
  }

}
