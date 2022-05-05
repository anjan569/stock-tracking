import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SentimentComponent } from './pages/sentiment/sentiment.component';
import { StockSearchComponent } from './pages/stock-search/stock-search.component';


const routes: Routes = [
  { path: '', component: StockSearchComponent },
  { path: 'sentiment/:id', component: SentimentComponent },
  { path: '**', component: StockSearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
