/**
 * New typescript file
 */
export class Page {
    id: number;
    active: boolean;
}
export class PagingOtions {
    startIndex: number;
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    rowsPerPage: number;
    endIndex: number;
    oldPage: number;
    selectedPageSize: number;
}

export class GridOptions {
    title: string='';
    hideHeader: boolean=false;
    hideGrid: boolean= false;
    enableSummary:  boolean = false;
    colDef: Column[] = [];
    enableEdit: boolean= false;//TODO enables editing
    enablePaging: boolean= false; 
    useExternalPaging: boolean= false;
    enablePagingBottom: boolean= false;
    enableSorting: boolean = false;
    useExternalSorting: boolean = false;
    sortInfo: SortInfo;
    enableTableExpandCollapse: boolean = false;
    enableDefaultSortButton: boolean= false;//TODO
    defaultSortInfo: SortInfo;//TODO
    gridStyle: string;//TODO
    data: any[]=[];
    paging: PagingOtions;
    enableGrouping: boolean = false;
    groupInfo: GroupInfo;
}


export class Column {
    value: string;
    header: string;
    sortable: boolean;
    cellTemplate: string='<span>{{value}}</span>';
}

export class SortInfo {
    fields: string[];
    directions: string[];
}
//if not provided and grouping is enabled then data array should be of structure [{groupBy:'groupingfield, dataList : []'}]
export class GroupInfo{
    // group column header name
        displayName : string;

        //groupBy field (default - 'groupBy')
        field : string;

        //results field (default - 'dataList')
        data : string;
       cellTemplate: string='<span>{{value}}</span>';
}
