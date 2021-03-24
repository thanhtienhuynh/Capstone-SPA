import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'toArray'})
export class ToArrayPipe implements PipeTransform {
  transform(value) : any {
    let res = [];
    for (let i = 0; i < value; i++) {
        res.push(i);
      }
      return res;
  }
}