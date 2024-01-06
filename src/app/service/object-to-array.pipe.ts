import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectToArray',
})
export class ObjectToArrayPipe implements PipeTransform {
  transform = (objects: any = []) => {
    console.log(objects);
    return Object.values(objects);
  };
}
