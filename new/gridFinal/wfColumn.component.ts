import { Component, Input, OnInit, ElementRef, Output, EventEmitter,ContentChild,TemplateRef} from '@angular/core';

@Component({
    selector: 'column',
    template: '<div></div>'


})
export class ColumnComponent {
   @ContentChild('cellTemplate') cellTemplate: any;
   @ContentChild('cellEditTemplate') cellEditTemplate:  any;
   @Input() value:string;
   @Input() header:string;
   @Input() sortable: boolean;
   sortIcon:string='';
   @Input() showCheckbox: boolean= false;
   @Input() isChecked : boolean= false;
   @Input() isGroupByField: boolean= false;
   @Input() isEditable: boolean =false;

}

