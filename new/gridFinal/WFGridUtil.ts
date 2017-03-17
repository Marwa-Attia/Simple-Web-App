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
    enableEdit: boolean= false;
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
}

export class SortInfo {
    fields: string[];
    directions: string[];
}
