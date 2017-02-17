import { Component, Input, OnInit, ElementRef, Output, EventEmitter} from '@angular/core';

import {Column, GridOptions, Page, PagingOtions, SortInfo} from './WFGridUtil';
@Component({
    moduleId: module.id,
    selector: 'wf-data-cell',
    template: '<div *componentOutlet="template; context: self; selector:selector "></div>'


})
export class WFDataCell implements OnInit{
    @Input() value: string;
    @Input() template: string;
    selector= 'template-component';
    self = this;

   
   ngOnInit() {
    this.self = this;
  }
   
}

