import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleMenuFilter',
  pure: true,
})
export class RoleMenuFilterPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
