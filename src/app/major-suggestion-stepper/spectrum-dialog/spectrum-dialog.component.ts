import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from "./../../_store/app.reducer";
import * as AuthActions from '../../authentication/store/auth.actions';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';

@Component({
  selector: 'app-spectrum-dialog',
  templateUrl: './spectrum-dialog.component.html',
  styleUrls: ['./spectrum-dialog.component.scss']
})
export class SpectrumDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SpectrumDialogComponent>, private store: Store<fromApp.AppState>, 
    @Inject(MAT_DIALOG_DATA) public data: {name: string, score: number}) { }

  subscription: Subscription;
  spectrum: any[] = [];

  chartOption: EChartsOption = {
    title: {
      text: 'Phổ điểm thi thử khối ' + this.data.name,
      subtext: 'Kết quả tính toán dựa trên dữ liệu của hệ thống'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {    
            type: 'shadow'       
        },
        formatter: function (params) {
          var tar = params[0];
          return tar.seriesName + tar.name + ' : ' + tar.value + ' học sinh';
        }
    },
    xAxis: {
      type: 'category',
      data: ['≤1', '≤2', '≤3', '≤4', '≤5', '≤6', '≤7', '≤8', '≤9', '≤10', '≤11', '≤12', '≤13', '≤14', '≤15', '≤16',
            '≤17', '≤18', '≤19', '≤20', '≤21', '≤22', '≤23', '≤24', '≤25', '≤26', '≤27', '≤28', '≤29', '≤30'],
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: this.spectrum,
        name: 'Điểm ',
        type: 'bar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                  {offset: 0, color: '#83bff6'},
                  {offset: 0.5, color: '#188df0'},
                  {offset: 1, color: '#188df0'}
              ]
          )
        },
        emphasis: {
            itemStyle: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#2378f7'},
                        {offset: 0.7, color: '#2378f7'},
                        {offset: 1, color: '#83bff6'}
                    ]
                )
            }
        },
        barWidth: '50%',
      },
    ],
    
  };

  ngOnInit() {
    this.subscription = this.store.select('stepper').subscribe((stepperState) => {
      if (this.spectrum != stepperState.spectrum) {
        this.spectrum = stepperState.spectrum;
        if (this.spectrum && this.spectrum.length > 0) {
          let data = this.spectrum.slice().map((v, i) => {
            if ((i + 1) == Math.ceil(this.data.score)) {
              return {
                value: v,
                itemStyle: {
                    color: '#a90000'
                }
              };
            }
            return v;
          });
          this.chartOption.series[0].data = data;
        }
      }
    });
  }

  // ngAfterViewInit() {
  //   if (this.spectrum && this.spectrum.length >= 0) {
  //     this.chartOption.series[0].data = this.spectrum;
  //     console.log(this.chartOption);
  //   }
  // }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


}
