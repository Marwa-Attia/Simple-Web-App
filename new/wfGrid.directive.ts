import { Component, Input,OnInit,ElementRef,Output,EventEmitter} from '@angular/core';
import {ColumnComponent} from './column.component';
import {WFGridPager} from './wfGridPager.directive';
@Component({
    selector: 'wf-grid',
    template:   '<div class = "wf-grid-table">' +
                    '<div *ngIf="detail.enablePaging">'+
                        '<wf-grid-paging [pagerInfo]=detail.paging ></wf-grid-paging>'+
                    '</div>'+
                    '<div class="wf-table-body">' +
                        '<table class="wf-table-content table table-bordered table-hover table-condensed table-striped" *ngIf="(detail.enablePaging && !detail.useExternalPaging && detail.enableSorting && !detail.useExternalSorting)">' +
                            '<tr class="wf-grid-header-group-row">' +
                                '<th class="wf-grid-header-col" *ngFor="let col of colDef"><div *ngIf="col.sortable" (click)="sortColumn(col.value);" class="sort"><i [class]="SORT_CLASS" class="icon-large default">^</i></div>{{col.header}}</th>' +
                            '</tr>' +
                            '<tbody class="wf-grid-rows">' +
                                '<tr class="wf-grid-data-group-row" *ngFor="let rec of detail.data | orderBy: [orderByField] | slice:pager.pageStart-1 :pager.pageEnd ">' +
                                    '<td class="wf-grid-data-col" *ngFor="let col of colDef"><label id="{{rec[col.value]}}">{{rec[col.value]}}</label> </td>' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>' +
                        '<table class="wf-table-content table table-bordered table-hover table-condensed table-striped" *ngIf="((!detail.enablePaging && !detail.enableSorting)||(!detail.enablePaging  && detail.enableSorting  && detail.useExternalSorting )||(!detail.enableSorting && detail.enablePaging && detail.useExternalPaging)||(detail.enablePaging && detail.useExternalPaging && detail.enableSorting && detail.useExternalSorting))">' +
                            '<tr class="wf-grid-header-group-row">' +
                                '<th class="wf-grid-header-col" *ngFor="let col of colDef"><div *ngIf="col.sortable && detail.enableSorting" (click)="sortColumn(col.value);" class="sort"><i [class]="SORT_CLASS" class="icon-large default">^</i></div>{{col.header}}</th>' +
                            '</tr>' +
                            '<tbody class="wf-grid-rows">' +
                                '<tr class="wf-grid-data-group-row" *ngFor="let rec of detail.data">' +
                                    '<td class="wf-grid-data-col" *ngFor="let col of colDef">{{rec[col.value]}}</td>' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>' +
                         '<table class="wf-table-content table table-bordered table-hover table-condensed table-striped" *ngIf="(detail.enablePaging && !detail.useExternalPaging && !(detail.enableSorting && !detail.useExternalSorting) )">' +
                            '<tr class="wf-grid-header-group-row">' +
                                '<th class="wf-grid-header-col" *ngFor="let col of colDef">{{col.header}}</th>' +
                            '</tr>' +
                            '<tbody class="wf-grid-rows">' +
                                '<tr class="wf-grid-data-group-row" *ngFor="let rec of detail.data |  slice:pager.pageStart-1 :pager.pageEnd ">' +
                                    '<td class="wf-grid-data-col" *ngFor="let col of colDef"><label id="{{rec[col.value]}}">{{rec[col.value]}}</label> </td>' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>' +
                        '<table class="wf-table-content table table-bordered table-hover table-condensed table-striped" *ngIf="(detail.enableSorting && !detail.useExternalSorting  && !(detail.enablePaging && !detail.useExternalPaging))">' +
                            '<tr class="wf-grid-header-group-row">' +
                                '<th class="wf-grid-header-col" *ngFor="let col of colDef"><div *ngIf="col.sortable" (click)="sortColumn(col.value);" class="sort"><i [class]="SORT_CLASS" class="icon-large default">^</i></div>{{col.header}}</th>' +
                            '</tr>' +
                            '<tbody class="wf-grid-rows">' +
                                '<tr class="wf-grid-data-group-row" *ngFor="let rec of detail.data | orderBy: [orderByField]">' +
                                    '<td class="wf-grid-data-col" *ngFor="let col of colDef"><label id="{{rec[col.value]}}">{{rec[col.value]}}</label> </td>' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>' +
                    '</div>'+
                '</div>'
                 

})
export class WFGrid implements OnInit {
    //colDef: ColumnComponent[] = [];
    @Input() colDef: Column[] = [];
    pager: WFGridPager
    @Input() detail: any;
    @Output('loader') loader = new EventEmitter();
    orderByField: string = '-id'
    orderByDirection = '-'
    initPager(p: WFGridPager) {
        console.log("Grid initPager");
        p.loader = this.loader;
        p.useExternalPaging = this.detail.useExternalPaging;
        this.pager = p;
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
    ngOnInit() {
        console.log(this.detail);
    }
    sort(sortCol: string): void {
        if (sortCol == this.orderByField.substring(1, this.orderByField.length)) {
            this.reverse(this.orderByDirection);
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
        } else if (direction == '+') {
            direction = '-';
        }
        this.orderByDirection = direction;
    }
}

export class GridOptions {
    enablePaging: boolean = false;
}


export class Column {
    value: string;
    header: string;
    enableSorting: boolean;
    //@ViewChild('cellTemplate') cellTemplate:ElementRef ;
    cellTemplate: ElementRef;
    constructor(table: WFGrid) {
        //table.addColumn(this)
    }



}
