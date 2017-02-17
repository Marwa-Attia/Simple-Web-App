import { Component, Input,OnInit,ElementRef,Output,EventEmitter} from '@angular/core';
import {ColumnComponent} from './column.component';
import {WFGridPager} from './wfGridPager.directive';
import {Column,GridOptions,Page,PagingOtions,SortInfo} from './WFGridUtil';
@Component({
    selector: 'wf-grid',
    templateUrl:'./app/component/lib/wfGrid.directive.Template.html'
})
export class WFGrid implements OnInit {
    pager: WFGridPager;
    @Input() detail: GridOptions;
    @Output('loader') loader = new EventEmitter();
    tableBodyExpanded: boolean=true;
    orderByField: string = '';
    orderByDirection = '+';
    sortIcon='';// TODO needs tweeking so that it varies on each column
    initPager(p: WFGridPager) {
        console.log("Grid initPager");
        p.loader = this.loader;
        p.useExternalPaging = this.detail.useExternalPaging;
        this.pager = p;
    }
   
    ngOnInit() {
        console.log(this.detail);
    }
    sort(sortCol: string): void {
        if (sortCol == this.orderByField.substring(1, this.orderByField.length)) {
            this.reverse(this.orderByDirection);
        }else{
            this.sortIcon='-down';
        }
        this.orderByField = this.orderByDirection + sortCol;
    }
    sortColumn(sortCol: string): void {
        this.sort(sortCol);
        if (this.detail.useExternalSorting == true) {
            this.setSortInfo(sortCol);
            this.loader.emit();
        }
    }
    reverse(direction: string): void {
        if (direction == '-') {
            direction = '+';
            this.sortIcon='-down';
        } else if (direction == '+') {
            direction = '-';
            this.sortIcon='-up';
        }
        this.orderByDirection = direction;
    }
     setSortInfo(field:string) {
        let dir: string = '';
        if (this.orderByDirection == '-') {
            dir = 'desc';
        } else {
            dir = 'asc';
        }
        this.detail.sortInfo = { fields: [field], directions: [dir] }
    }
    expandCollapse(){
        if(this.tableBodyExpanded==true){
            this.tableBodyExpanded=false;
        }else{
           this.tableBodyExpanded=true; 
        }
    }
}

