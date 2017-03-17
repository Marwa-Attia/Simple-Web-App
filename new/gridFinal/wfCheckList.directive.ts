import {
    Component, Input, OnChanges, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter
}
from '@angular/core';
@Component({
    selector: 'wf-checklist',
    template: '<input type="checkbox"  value ="{{rowObj}}"  [disabled]="disable"  name="{{id}}"  #{{id}}="ngModel" id="{{id}}" [(ngModel)]="checked" (change)="changeAction()" >'
})
export class WFCheckList implements OnChanges {
       @Input('id') id: string;
       @Input('rowObj') rowObj: any;
       @Input('disable') disable: boolean;
       @Input('list') list: any[];
       @Input('checked') checked: boolean;
       @Output('clickHandler') clickHandler = new EventEmitter();
       constructor() {
         console.log('ng2Comp Created'); 
      }
    ngOnChanges() {
    }
    changeAction():void{
       if(this.list){
           let found=this.list.indexOf(this.rowObj);
           if(found==-1 && this.checked){
             this.list.push(this.rowObj);
           }else if(found!=-1 && !this.checked) {
              this.list.splice(found,1);
           }
           console.log('list '+this.list); 
       }
        if(this.clickHandler){
        this.clickHandler.emit();
        }
    }
}
