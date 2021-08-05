import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { ConfigurationService } from 'src/app/admin/services/configuration/configuration.service';
import { LabelValue, PagingConfiguration } from 'src/app/admin/view-models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-config-main',
  templateUrl: './config-main.component.html',
  styleUrls: ['./config-main.component.scss']
})
export class ConfigMainComponent implements OnInit {

  pagingForm: FormGroup;
  firstPage: number;

  isLoadingRank: boolean = false;
  highestQuantity: number;
  isUpdatePaging: boolean = true;
  isUpdateApp: boolean = true;
  isLoadingUpdatePaging: boolean = false;
  isLoadingUpdateApp: boolean = false;

  testMonths: number;
  crawlTimeType: number;
  crawlTimeStart: number;
  crawlTimeMinStart: number;
  crawlTimeStartFrom: number;
  crawlTimeMinStartFrom: number;

  updateRankTimeType: number;
  updateRankTimeStart: number;
  updateRankMinStart: number;
  updateRankTimeStartFrom: number;
  updateRankMinStartFrom: number;

  expireArticleTimeType: number;
  expireArticleTimeStart: number
  expireArticleMinStart: number;
  expireArticleTimeStartFrom: number
  expireArticleMinStartFrom: number;

  listOfTwelve: LabelValue[] = [
  ]

  listOfTwentyfour: LabelValue[] = [
  ]

  listOfMinute: LabelValue[] = [
  ]

  getMinute(): void {
    this.listOfMinute = [];
    for (let i = 0; i <= 59; i++) {
      const obj = {label: i < 10 ? `0${i}` : `${i}`, value: i} as LabelValue
      this.listOfMinute.push(obj)
    }
  }

  getListOfTwentyfour(): void {
    this.listOfTwentyfour = [];
    for (let i = 0; i < 24; i++) {
      const obj = {label: i < 10 ? `0${i}` : `${i}`, value: i} as LabelValue
      this.listOfTwentyfour.push(obj)
    }
  }

  getListOfTwelve(): void {
    this.listOfTwelve = [];
    for (let i = 1; i <= 12; i++) {
      const obj = {label: i < 10 ? `0${i}` : `${i}`, value: i} as LabelValue
      this.listOfTwelve.push(obj)
    }
  }

  constructor(
    private _configService: ConfigurationService,
    private _fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.getConfigApp();
    this.getMinute();
    this.getListOfTwelve();
    this.getListOfTwentyfour();
  }

  updateRank(): void {
    this.isLoadingRank = true;
    this._configService.updateRank({} as any).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          this.isLoadingRank = false;
          this.isUpdateApp = true
          Swal.fire('Thành công', 'Cập nhật bảng xếp hạng thành công', 'success');
        } else {
          this.isLoadingRank = false;
          Swal.fire('Lỗi', `${rs.errors[0]}`, 'error');
        }
      })
    ).subscribe();
  }

  editPagingConfig(): void {
    this.isUpdatePaging = false;
  }

  editAppConfig(): void {
    this.isUpdateApp = false;
  }

  cancelEditAppConfig(): void {
    this.isUpdateApp = true;
    this.getConfigApp();
  }

  updateConfigPaging(): void {
    this.isLoadingUpdatePaging = true;
    const newValue = {
      'firstPage': this.firstPage as number,
      'highestQuantity': this.highestQuantity
    }
    this._configService.updateConfigPaging(newValue).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          Swal.fire('Thành công', 'Thay đổi thông số thành công', 'success');
          this.isUpdatePaging = true;
          this.isLoadingUpdatePaging = false;
        } else {
          Swal.fire('Lỗi', `${rs.errors[0]}`, 'error');
          this.isLoadingUpdatePaging = false;
        }
      })
    ).subscribe();
  }

  updateAppConfig(): void {
    this.isLoadingUpdateApp = true;
    const newValue = {
      'crawlTime': {
        'start': this.crawlTimeType === 1 ? this.crawlTimeStart : this.crawlTimeStartFrom,
        'minStart': this.crawlTimeType === 1 ? this.crawlTimeMinStart : this.crawlTimeMinStartFrom,
        'type': this.crawlTimeType
      },
      'updateRankTime': {
        'start': this.updateRankTimeType === 1 ? this.updateRankTimeStart : this.updateRankTimeStartFrom,
        'minStart': this.updateRankTimeType === 1 ? this.updateRankMinStart : this.updateRankMinStartFrom,
        'type': this.updateRankTimeType
      },
      'expireArticleTime': {
        'start': this.expireArticleTimeType === 1 ? this.expireArticleTimeStart : this.expireArticleTimeStartFrom,
        'minStart': this.expireArticleTimeType === 1 ? this.expireArticleMinStart : this.expireArticleTimeStartFrom,
        'type': this.expireArticleTimeType
      },
      'testMonths': this.testMonths
    }
    this._configService.updateConfigApp(newValue).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          Swal.fire('Thành công', 'Thay đổi thông số thành công', 'success');
          this.isUpdateApp = true;
          this.getConfigApp();
          this.isLoadingUpdateApp = false;
        } else {
          Swal.fire('Lỗi', `${rs.errors[0]}`, 'error');
          this.isLoadingUpdateApp = false;
        }
      })
    ).subscribe();
  }

  getConfigPaging(): void {
    this._configService.getConfigPaging().pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            this.firstPage = rs.data.firstPage,
            this.highestQuantity = rs.data.highestQuantity
          }
        }
      })
    ).subscribe()
  }
  getConfigApp(): void {
    this._configService.getConfigApp().pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            this.crawlTimeType = rs.data.crawlTime.type;
            this.crawlTimeStart = rs.data.crawlTime.start;
            this.crawlTimeStartFrom = rs.data.crawlTime.start;
            this.crawlTimeMinStart = rs.data.crawlTime.minStart;
            this.crawlTimeMinStartFrom = rs.data.crawlTime.minStart;
            this.updateRankTimeType = rs.data.updateRankTime.type;
            this.updateRankTimeStart = rs.data.updateRankTime.start;
            this.updateRankTimeStartFrom = rs.data.updateRankTime.start;
            this.updateRankMinStart = rs.data.updateRankTime.minStart;
            this.updateRankMinStartFrom = rs.data.updateRankTime.minStart;
            this.expireArticleTimeType = rs.data.expireArticleTime.type;
            this.expireArticleTimeStart = rs.data.expireArticleTime.start;
            this.expireArticleTimeStartFrom = rs.data.expireArticleTime.start;
            this.expireArticleMinStart = rs.data.expireArticleTime.minStart;
            this.expireArticleMinStartFrom = rs.data.expireArticleTime.minStart;
            this.testMonths = rs.data.testMonths;
          }
        }
      })
    ).subscribe()
  }


}
