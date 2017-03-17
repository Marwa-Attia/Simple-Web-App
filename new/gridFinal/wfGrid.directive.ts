import { Component, Input, OnInit,  Output, EventEmitter, ContentChild,ContentChildren, QueryList, AfterContentInit
} from '@angular/core';
import {WFGridPager} from './wfGridPager.directive';
import {GridOptions, Page, PagingOtions, SortInfo} from './WFGridUtil';
import {OrderByService} from './orderBy.service';
import {GroupByService} from './groupBy.service';
import {ColumnComponent} from './wfColumn.component';
import{GroupColumnComponent} from './wfGroupByColumn.component';
@Component({
    selector: 'wf-grid',
    templateUrl: 'angular_io/app/directives/wfGrid.directive.Template.html'
})
export class WFGrid implements OnInit {
    @ContentChildren(ColumnComponent) colDef: QueryList<ColumnComponent>; 
    @ContentChild(GroupColumnComponent) groupInfo: GroupColumnComponent;   
    pager: WFGridPager;
    dataRecords: any[];
    @Input() detail: GridOptions;
    @Output('loader') loader = new EventEmitter();
    @Output('updater') updater = new EventEmitter();   
    selectAll: boolean=false;
    tableBodyExpanded: boolean = true;
    orderByField: string = '';
    orderByDirection = '+';
    initPager(p: WFGridPager) {
        p.loader = this.loader;
        p.useExternalPaging = this.detail.useExternalPaging;
        this.pager = p;

    }
  ngAfterContentInit() {
        if (this.detail.enableGrouping) {
            if (this.detail.enablePaging && !this.detail.useExternalPaging) {
                this.detail.data = OrderByService._sort(this.detail.data, ['+' + this.groupInfo.value]);
                let sortedPage = this.detail.data.slice(this.detail.paging.startIndex - 1, this.detail.paging.endIndex);
                this.dataRecords = GroupByService.groupBy(sortedPage, this.groupInfo.value);
            } else {
                this.dataRecords = GroupByService.groupBy(this.detail.data, this.groupInfo.value);
            }
        } else {
            if (this.detail.enablePaging && !this.detail.useExternalPaging) {
                this.dataRecords = this.detail.data.slice(this.detail.paging.startIndex - 1, this.detail.paging.endIndex);
            }
        }
    }
    ngOnInit() {
       
    }

    sort(sortCol: ColumnComponent): void {
        if (sortCol.value == this.orderByField.substring(1, this.orderByField.length)) {
            this.reverse(this.orderByDirection, sortCol);
        } else {
            sortCol.sortIcon = '-down';
        }
        this.orderByField = this.orderByDirection + sortCol.value;
    }
    sortColumn(sortCol: ColumnComponent): void {
        this.sort(sortCol);
        if (this.detail.useExternalSorting == true) {
            this.setSortInfo(sortCol.value);
            this.loader.emit();
        } else {
            if (this.detail.enablePaging && !this.detail.useExternalPaging) {
                let sortedData: any[] = OrderByService._sort(this.detail.data, [this.orderByField]);
                this.dataRecords = sortedData.slice(this.pager.pageStart - 1, this.pager.pageEnd);
            } else {
                this.dataRecords = OrderByService._sort(this.detail.data, [this.orderByField]);
            }
        }
    }
    reverse(direction: string, sortCol: ColumnComponent): void {
        if (direction == '-') {
            direction = '+';
            sortCol.sortIcon = '-down';
        } else if (direction == '+') {
            direction = '-';
            sortCol.sortIcon = '-up';
        }
        this.orderByDirection = direction;
    }
    setSortInfo(field: string) {
        let dir: string = '';
        if (this.orderByDirection == '-') {
            dir = 'desc';
        } else {
            dir = 'asc';
        }
        this.detail.sortInfo = { fields: [field], directions: [dir] };
    }
    expandCollapse() {
        if (this.tableBodyExpanded == true) {
            this.tableBodyExpanded = false;
        } else {
            this.tableBodyExpanded = true;
        }
    }
    groupingHandler() {
        let sortedPage = this.detail.data.slice(this.pager.pageStart - 1, this.pager.pageEnd);
        this.dataRecords = GroupByService.groupBy(sortedPage, this.groupInfo.value);
    }
    selectDeselectAll() {
        for (let row of this.dataRecords) {
            if (this.detail.enableGrouping) {
                let recs: any[] = row.value;
                for (let r of recs) {
                    if (this.selectAll) {
                        r.selected = true;
                    } else {
                        r.selected = false;
                    }
                }
            } else {
                if (this.selectAll) {
                    row.selected = true;
                } else {
                    row.selected = false;
                }
            }
        }
    }

    
    enableEditing(row: any){
      row.inEditMode=true;
    }
    saveEdit(row: any,dataRow:any){
        if(this.updater){
            this.updater.emit(dataRow);
        }
        row.inEditMode=false;
    }
     cancelEdit(row: any){
        row.inEditMode=false;
    }    
    
}

