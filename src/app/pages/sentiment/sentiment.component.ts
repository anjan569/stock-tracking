import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StocksService } from 'src/app/services/stocks.service';
import { StockDetails, StockLookup, Stocks, StockSentiment } from 'src/models/stock.model';

@Component({
  selector: 'app-sentiment',
  templateUrl: './sentiment.component.html',
  styleUrls: ['./sentiment.component.scss']
})
export class SentimentComponent implements OnInit {
  stockSymbol: StockLookup;
  stockInsideSentiment: StockDetails[];
  stockQuoteData: Stocks[] = [];
  constructor(private router: Router, private stockService: StocksService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    let params: any = this.activatedRoute.snapshot.params;

    if (localStorage.getItem('stocks') !== null) {
      const stockQuoteData = JSON.parse(localStorage.getItem("stocks"));
      stockQuoteData.forEach(element => {
        const qLookup = element.symbol;
        if (params.id === qLookup.symbol) {
          this.stockSymbol = qLookup;
        }
      });
    }
    if (localStorage.getItem('InsiderSentiment') !== null) {
      this.stockInsideSentiment = JSON.parse(localStorage.getItem('InsiderSentiment'));
    } else {
      this.getInsiderSentimentData(params.id);
    }
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }


  getInsiderSentimentData(symbol) {
    var toDate = new Date();
    const pastData = new Date().setMonth(toDate.getMonth() - 3);
    const oldDate = new Date(pastData).toDateString();
    this.stockService.getInsiderSentiment$(symbol, this.formatDate(oldDate), this.formatDate(toDate)).subscribe((response: StockSentiment) => {
      console.log(response);
      if (response) {
        this.stockInsideSentiment = response.data;
        localStorage.setItem('InsiderSentiment', JSON.stringify(this.stockInsideSentiment));
      }
    });


  }



  goToQuote() {
    this.router.navigate([/'Home'/]);
  }

}
