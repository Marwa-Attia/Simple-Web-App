import { Component, Input,ContentChild,TemplateRef} from '@angular/core';

@Component({
    selector: 'group-column',
    template: '<div></div>'


})
export class GroupColumnComponent {
   @ContentChild(TemplateRef) cellTemplate: any;
   @Input() value:string;
   @Input() header:string;
   @Input() showCheckbox: boolean= false;
   @Input() isChecked : boolean= false;
}

