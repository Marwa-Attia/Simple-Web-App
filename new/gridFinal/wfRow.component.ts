import { Directive,Input } from '@angular/core';

@Directive({
    selector: '[wf-data-row]'
})
export class WFRow {
    @Input() inEditMode : boolean; 
    @Input() selected : boolean;

  }
