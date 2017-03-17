import { Component, Input, OnInit, ElementRef, Output, EventEmitter,ContentChild,TemplateRef,ViewContainerRef,ViewChild} from '@angular/core';

@Component({
    selector: 'wf-data-cell',
    template: '<template #container></template>'


})
export class WFDataCell {
    @Input() name : string;
    @Input() value : string;
    @Input() template : TemplateRef<Object>;
    @ViewChild('container', { read: ViewContainerRef }) _vcr;
    @Input() row : any;
    @Input() col : string; 
    private context : any;
      ngAfterViewInit() {
       this.context={
           name:this.name,
           value:this.value,
           row:this.row,
           col:this.col    
       };
        this._vcr.createEmbeddedView(this.template,this.context);
          
  }
  }
