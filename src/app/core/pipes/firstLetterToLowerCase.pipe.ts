import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetterToLowerCase'
})
export class FirstLetterToLowerCasePipe implements PipeTransform {

transform(value:string): string {
  let first = value.substr(0,1).toLowerCase();
  return first + value.substr(1);
}
}
