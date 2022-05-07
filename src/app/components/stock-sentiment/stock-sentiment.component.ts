import { Component, OnInit, Input } from '@angular/core';
import { StockDetails, StockLookup } from 'src/models/stock.model';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-sentiment.component.html',
  styleUrls: ['./stock-sentiment.component.scss']
})
export class StockSentimentComponent implements OnInit {
  @Input() stockDetails: StockDetails;
  stockSymbol: StockLookup;
  stockChanged: boolean;
  constructor() { }

  ngOnInit(): void {
    console.log(this.stockDetails);
    if(localStorage.getItem('stocks') !== null) {
      const stocks = JSON.parse(localStorage.getItem('stocks'));
      this.stockSymbol = stocks.symbol;
    }
    if(this.stockDetails) {
       this.stockChanged = this.stockDetails.change > 0;
    }

  }

  getMonthByID(monthId) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthId+1];
  }

}
