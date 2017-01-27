import { Component, Input, OnChanges, ContentChildren, QueryList, AfterContentInit} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {ColumnComponent} from './column.component';
import {WFGridPager} from './component/lib/wfGridPager.directive';
@Component({
    selector: 'wf-grid',
    template:   '<div class = "wf-grid-table">' +
                    '<table *ngIf="enablePaging">' +
                        '<tr>' +
                            '<th *ngFor="let col of colDef">{{col.header}}</th>' +
                        '</tr>' +
                        '<tr *ngFor="let rec of dataset  | slice:pager.pageStart:pager.pageEnd+1">' +
                            '<td *ngFor="let col of colDef">{{rec[col.value]}}</td>' +
                        '</tr>' +
                    '</table>' +
                    '<table *ngIf="!enablePaging">' +
                        '<tr>' +
                            '<th *ngFor="let col of colDef">{{col.header}}</th>' +
                        '</tr>' +
                        '<tr *ngFor="let rec of dataset">' +
                            '<td *ngFor="let col of colDef">{{rec[col.value]}}</td>' +
                        '</tr>' +
                    '</table>' +
                '</div>'+
                 '<div *ngIf="enablePaging"><wf-grid-paging [list]=dataset></wf-grid-paging></div>'

})
export class WFGrid implements OnInit {
    colDef: ColumnComponent[] = [];
    pager: WFGridPager
    @Input() dataset: any;
   @Input() enablePaging: boolean=false; 
    //@Input() options: GridOptions={ enablePaging: false };
    addColumn(column: ColumnComponent) {
        this.colDef.push(column);
    }
    initPager(p: WFGridPager) {
         console.log("Grid initPager"); 
        this.pager = p;
    }
    ngOnInit(options:GridOptions) {
         console.log("Grid ngOnInit"); 
        this.options=options;
    }
}

export class GridOptions{
    enablePaging: boolean=false; 
}
