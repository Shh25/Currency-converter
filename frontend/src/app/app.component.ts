import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  
  constructor(
    private apiService: ApiService,
    public snackBar: MatSnackBar) {
  }
  ngOnInit() {
    this.getCurrencies()
    this.getLogs()
  }
  currencies = [];
  conversionLogs = [];
  conversionLog = {
    fromCurrency: 'USD',
    toCurrency: 'INR',
    amount: 0.0
  }
  conversionResult = null
  limit = 10
  getCurrencies() {
    return this.apiService.getCurrencies()
    .subscribe(res => {
      this.currencies = res
      return res
    })
  }
  getLogs() {
    let queryparams = { limit: this.limit }
    return this.apiService.getConversionLogs(queryparams)
    .subscribe(res => {
      this.conversionLogs = res
      return res
    })
  }
  
  postLog() {
    console.log('data: ', this.conversionLog);    
    this.apiService.postConversionLog(this.conversionLog)
    .subscribe((conversion) => {
      this.conversionResult = JSON.parse(JSON.stringify(conversion)).body
      console.log('Upload results: ', conversion);
      if(conversion.errorCode) {
        this.openSnackBar(conversion.message, 'FAILURE')
      } else {
        this.openSnackBar('Successfully Converted', 'SUCCESS')
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1500,
    });
  }
}
