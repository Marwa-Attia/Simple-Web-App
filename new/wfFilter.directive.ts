import { Directive, Input, OnChanges, SimpleChanges ,forwardRef} from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export const WF_FILTER_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => WFFilterDirective),
  multi: true
};
export function filterValidator(nameRe: RegExp): ValidatorFn {
 return (control: AbstractControl): {[key: string]: any} => {
    const name = control.value;
    const no = nameRe.test(name);
    return no ? {'wfFilter': {name}} : null;
  };
}
@Directive({
  selector: 'wfFilter[wfFilter][formControlName],[wfFilter][formControl],[wfFilter][ngModel]',
  providers: [WF_FILTER_VALIDATOR],
  host: {'[attr.wfFilter]': 'wfFilter ? wfFilter : null'}
})
export class WFFilterDirective implements Validator,
    OnChanges {
  private _validator: ValidatorFn;
  private _onChange: () => void;

  @Input() wfFilter: string /*|RegExp*/;

  ngOnChanges(changes: SimpleChanges): void {
    if ('wfFilter' in changes) {
      this._createValidator();
      if (this._onChange) this._onChange();
    }
  }

  validate(c: AbstractControl): {[key: string]: any} { return this._validator(c); }

  registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }

  private _createValidator(): void { this._validator = Validators.pattern(this.wfFilter); }
}





/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
