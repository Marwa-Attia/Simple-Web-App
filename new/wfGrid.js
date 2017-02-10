/**
 *  Main grid directive
 */

/**
 //USAGE

 tableGridOptions = {
  	data : 'tabledata',
  	title : 'Search User Results',


	//enables editing
	enableEdit : true,

	//enables paging
	enablePaging : true,
	//enables repeated paging links at bottom of grid
	enablePagingBottom : true,

	//paging options
	paging : {
                startIndex : 1,
                currentPage : 1,
                totalPages : 1,
                totalRecords : 0,
                rowsPerPage : 25,
                endIndex : 25
    	};,

	//enables sorting - only server side currently
	enableSorting : true,
	enableDefaultSortButton : true, initial state  sorting

	//enables grouping
	enableGrouping : true,

 	//if not provided and grouping is enabled then data array should be of structure [{groupBy:'groupingfield, dataList : []'}]
	groupInfo : {
		// group column header name
		displayName : 'Group',

		//groupBy field (default - 'groupBy')
		field :'subId',

		//results field (default - 'dataList')
		data : 'results'
	},

	sortInfo : {fields:['firstname'],directions:['asc']},
	// only applicable if enableDefaultSortButton is true.  Establishes the baseline/default sort configuration used
	// to determine if the the button should be enabled or not
	defaultSortInfo : {fields:['firstname'],directions:['asc']},

	//use server side sorting (default - false)
	useExternalSorting : true,

	// not implemented yet
	useExternalPaging : true,

	//To enable/ disable the expand collapse feature on a grid use below.
	enableTableExpandCollapse: true

	columnDefs : [
			{
				//field in the row
				field : 'firstname',

				/column header name
				displayName : 'First Name'

				//populate column with the template specified
				// record can be accessed  using variable 'row' and column field can be accessed by 'COL_FIELD'
				//here 'row.firstname' or 'COL_FIELD' represents same
				cellTemplate : '<a>row.firstname<a>',

				// enables innerCell (a nested cell that will float in zIndex across adjacent cells
				// simulating COLSPAN type behaviors without requiring the containing cell to do so - allows for
				// expanded details as used in the fulfillment pipeline page for contact and loan details
                innerCellTemplate: '<span>Bar((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))))))))))))))))</span>
			},
			{
				field : 'lastname',
				displayName : 'Last Name'
			},
			{
				field : 'sub',
				displayName : 'Sub ID',

				// makes field non editable (default - editable)
				editable : false
			}, {
				field : 'dept',
				displayName : 'Department'
			} ]
  };
 **/
'use strict';

angular.module('wf.framework') // By not including the dependencies this will not replace the existing wf.framework
    .factory('wfGridService', ['$rootScope', '$injector', '$q', function($rootScope, $injector, $q) {
        function collectionHas(a, b) { //helper function (see below)
            for(var i = 0, len = a.length; i < len; i ++) {
                if(a[i] == b) return true;
            }
            return false;
        }

        function findParentBySelector(elm, selector) {
            if (collectionHas(elm, selector)) {
                // short circuit if already there
                return elm;
            }
            var all = document.querySelectorAll(selector);
            var cur = elm.parentNode;
            while(cur && !collectionHas(all, cur)) { //keep going up until you find a match
                cur = cur.parentNode; //go up
            }
            return cur; //will return null if not found
        }

        function getSortInfo($scope) {
            if (!$scope.options.sortInfo) {
                $scope.options.sortInfo = {};
                $scope.options.sortInfo.fields = [];
                $scope.options.sortInfo.directions = [];
                return $scope.options.sortInfo;
            } else {
                return $scope.options.sortInfo;
            }
        }

        function defaultSortDisabled($scope) {
            return $scope.options.initialSortOrder;
        }

        function defaultSort($scope) {
            if ($scope.options.enableDefaultSortButton && $scope.options.sortInfo && !defaultSortDisabled($scope)) {
                $scope.changeSortColumn($scope.options.defaultSortInfo.fields[0]);

                if (!($scope.options.useExternalSorting == undefined || $scope.options.useExternalSorting == true)) {
                    $scope.sortInternally($scope.options.sortInfo.fields[0]);
                } else {
                    $scope.loader();
                }
                $scope.options.initialSortOrder = true;
                if ($scope.options.enablePaging) {
                    $scope.resetCurrentPage();
                }
            }
        }

        function isDefaultSortInEffect($scope) {
            if (! $scope.options.enableDefaultSortButton || ! $scope.options.sortInfo ||
                angular.equals($scope.options.defaultSortInfo, getSortInfo($scope)) ||
                // for purposes of this comparison, we will equate null and undefined
                (($scope.options.defaultSortInfo.fields[0] === null || $scope.options.defaultSortInfo.fields[0] === undefined) &&
                 ($scope.options.sortInfo.fields[0] === null || $scope.options.sortInfo.fields[0] === undefined))) {
                return true;
            }
            return false;
        }

        function isSortable(colDef) {
            if (colDef.sortable == undefined || colDef.sortable == true) {
                if (colDef.field) {
                    colDef.sortable = true;
                    return true;
                }
            }
            return false;
        };

        function updateGridRows($scope, $log) {
            $scope.rows = [];

            if ($scope.options.enableGrouping) {
                if (typeof($scope.$eval($scope.options.data)) !== 'undefined') {
                    $scope.rows = $scope.$eval($scope.options.data);
                }
            } else {
                //Added by Sudipta
                $scope.options.data = $scope.options.data.replace('ROW_INDEX', $scope.rowIndex);
                $scope.rows.push($scope.$eval($scope.options.data));
                //$scope.rows.push($scope.$eval($scope.options.data+" | orderBy:'firstname'"));
            }

            if (typeof($scope.$eval($scope.options.data)) === 'undefined' || ($scope.$eval($scope.options.data) && $scope.$eval($scope.options.data).length === 0)) {
                // create an empty row to enable '-'
                if ($scope.options.enableGrouping) {
                    $scope.rows[0] = {};
                } else {
                    $scope.rows[0] = [{}];
                }
            }

            if ($scope.options.enableSorting && !($scope.options.useExternalSorting == undefined || $scope.options.useExternalSorting == true)) {

                if ($scope.options.enablePaging) {
                    $log.warn("Paging is enabled with internal sorting... Sort result might vary in different pages")
                }

                var sortInfo = $scope.options.sortInfo;

                if (sortInfo) {
                    var fields = sortInfo.fields;
                    var orders = sortInfo.directions;

                    angular.forEach(fields, function(field, key) {
                        $scope.sortRowsInternally(field, orders[key]);
                    });
                }
            }
        };

        function applyColumnSecurity(namespace, columnDefs) {
            var securityService;
            try {
                securityService = $injector.get('securityService');
            } catch (err) {
                return;
            }
            angular.forEach(columnDefs, function(colDef) {
                var id = colDef.columnId || colDef.id;
                if (id) {
                    var permission = securityService.getElementPermission(namespace, id);
                    if (permission === 'DENY' || permission.action === 'DENY') {
                        colDef.hide = true;
                    }
                    if($rootScope.securityHelperEnabled) {
                        var securityRule = null;
                        if (permission && angular.isObject(permission)) {
                            securityRule = permission.condition;
                        }
                        if (!$rootScope.securityInfo[namespace]){
                            $rootScope.securityInfo[namespace] = [];
                        }
                        $rootScope.securityInfo[namespace].push({
                            elementId: id,
                            permission: permission,
                            inheritedNamespace: true,
                            childElements: [],
                            appliedSecurityRule : securityRule !== null ? securityRule : null
                        });

                    }
                }
            });
        };

        function getBlockElements(nodes) {
            var startNode = nodes[0],
                endNode = nodes[nodes.length - 1];
            if (startNode === endNode) {
                return $(startNode);
            }

            var element = startNode;
            var elements = [element];

            do {
                element = element.nextSibling;
                if (!element) break;
                elements.push(element);
            } while (element !== endNode);

            return $(elements);
        };
        // Allow for the the resetting of the saved scroll value.
        function resetScrollValue(id) {
            if (id) {
                this.scrollValues[id] = null;
            }
            else if (id === undefined) {
                this.scrollValues = {};
            }
        }

        //Allows the fn function to run after post digest cycle
        function runPostDigest(fn) {
            var cancelFn, defer = $q.defer();
            defer.promise.$$cancelFn = function ngAnimateMaybeCancel() {
                cancelFn && cancelFn();
            };

            $rootScope.$$postDigest(function ngAnimatePostDigest() {
                cancelFn = fn(function ngAnimateNotifyComplete() {
                    defer.resolve();
                });
            });

            return defer.promise;
        }
		
		function getExpandState(gridId) {
			if (this.expandStates[gridId])
				return this.expandStates[gridId];
			return false;
		}
		
		function setExpandState(gridId, state) {
			this.expandStates[gridId] = state;			
		}
		
		function resetExpandState() {
			this.expandStates = [];
		}

        return {
            collectionHas: collectionHas,
            findParentBySelector: findParentBySelector,
            getSortInfo: getSortInfo,
            defaultSortDisabled: defaultSortDisabled,
            defaultSort: defaultSort,
            isDefaultSortInEffect: isDefaultSortInEffect,
            isSortable: isSortable,
            updateGridRows: updateGridRows,
            applyColumnSecurity: applyColumnSecurity,
            resetScrollValue: resetScrollValue,
            scrollValues: {},
			expandStates: [],
            getBlockElements : getBlockElements,
            runPostDigest : runPostDigest,
			getExpandState: getExpandState,
			setExpandState: setExpandState,
			resetExpandState: resetExpandState
        }
    }])
    .directive('wfGrid', ['$compile', '$log', '$sce', 'wfGridService', function($compile, $log, $sce, wfGridService) {
        return {
            restrict: 'E',
            scope: true,

            controller: function($scope) {
        var dataListeners = [];
                this.registerDataListener = function(listener) {
        	dataListeners.push(listener);
        };

                this.notifyDataListeners = function(dataPath) {
            angular.forEach(dataListeners, function(listener) {
                listener(dataPath);
            });
                };
            },

            compile: function() {
                return {
                    pre: function($scope, $element, $attrs, gridCtrl) {

                        $scope.options = $scope.$eval($attrs.detail);
                        if($attrs.id){
                            $scope.options.widgetId = $attrs.id;
                        }
                        if ($scope.options.columnDefsString != null) {
                            $scope.options.columnDefs = $scope.$parent.$eval($scope.options.columnDefsString);
                            //console.log("columnDefs: " + $scope.options.columnDefs)
                            wfGridService.applyColumnSecurity($scope.namespace, $scope.options.columnDefs);
                        }

                        if ($attrs.style) {
							$scope.style = "width:100%; " + $attrs.style;
						} else {
							$scope.style = "width:100%;";
						}
                        if ($attrs.height) {
                            $scope.innerStyle = {'max-height': $attrs.height, 'overflow': 'auto','width' : '100%'};
                        }else{
                            $scope.innerStyle = {'overflow': 'auto','width' : '100%'};
                        }
                        //Remove the id in wf-gris so that the id is present only in the html table element
                        $element.removeAttr("id");
                        /*if ($scope.options.title != null) {
                         $scope.options.title = $sce.trustAsHtml($scope.options.title);
                         }*/
						 
						//Code for expand/collapse grid 
						if ($scope.options.enableTableExpandCollapse) {
							$scope.tableBodyExpanded = false;
							if ($scope.options.widgetId) {
								$scope.tableBodyExpanded = wfGridService.getExpandState($scope.options.widgetId);
								
							}
							$scope.expandCollapse = function() {
								$scope.tableBodyExpanded = !$scope.tableBodyExpanded;
								if ($scope.options.widgetId) {
									wfGridService.setExpandState($scope.options.widgetId, $scope.tableBodyExpanded);
								}
							}
						}
						
                        $scope.loader = function() {
                            var loaderFn = $attrs.loader;
                            if (loaderFn.indexOf("(") != -1) {
                                loaderFn = loaderFn.substring(0, loaderFn.indexOf("("));
                            }
                            $scope.$eval(loaderFn + "(options.sortInfo, options.paging)");
                        };

                        $scope.sortRowsInternally = function(field, order) {

                            var reverse = false;

                            if (!order) {
                                order = 'asc';
                            }

                            if (order == 'desc') {
                                reverse = true;
                            }

                            if (!$scope.options.enableGrouping) {
                                $scope.rows = []
                                $scope.rows.push($scope.$eval($scope.options.data + " | orderBy:'" + field + "':" + reverse));
                            } else {
                                $log.warn('sorting based on grouping is not implement yet')
                            }
                        };

                        $scope.defaultSortDisabled = function() {
                            return wfGridService.defaultSortDisabled($scope);
                        }

                        $scope.defaultSort = function() {
                            wfGridService.defaultSort($scope);
                        }

                        var updateGridRows = wfGridService.updateGridRows;

                        updateGridRows($scope, $log);

                        var unwatchData = $scope.$watchCollection($scope.options.data, function(newVal) {
                            if (newVal) {
                            	updateGridRows($scope, $log);
                                gridCtrl.notifyDataListeners($scope.options.data);
                            }

                        });

                        var unwatchColumnDefsString = function(){};
                        if ($scope.options.columnDefsString != null) {
                        	unwatchColumnDefsString = $scope.$watch($scope.options.columnDefsString, function (newVal, oldVal) {
                                //console.log("coldef updated");
                                if (newVal) {
                                    if ($scope.options.columnDefsString != null) {
                                        $scope.options.columnDefs = newVal;
//                                        console.log("columnDefs: " + $scope.options.columnDefs)
                                        wfGridService.applyColumnSecurity($scope.namespace, $scope.options.columnDefs);
                                    }
                                    updateGridRows($scope, $log);
                                }

                            }, true);
                        }

                        $element.on("$destroy", function(){
                        	unwatchData();
                        	unwatchColumnDefsString();
                        });
                    }
                }
            },

            templateUrl: 'template/wfGrid.html'
        };
    }])

/**
 * Grid definition for Scrollable Grid with fixed headers
 *
 * Currently does not support columnDefsString
 */
    .directive('wfScrollableGrid', ['$compile', '$log', '$sce', '$window', '$timeout', 'wfGridService', function ($compile, $log, $sce, $window, $timeout, wfGridService) {
        return {
            restrict: 'E',
            scope: true,
            compile: function () {
                return {
                    pre: function ($scope, $element, $attrs) {

                        $scope.isScrollableGrid = true;
                        $scope.options = $scope.$eval($attrs.detail);
                        if($attrs.id){
                            $scope.options.widgetId = $attrs.id;
                        }
                        if($attrs.optimizeHeaders == "true"){
                        	$scope.updateHeaderMinWidths = true;
                        }else{
                        	$scope.updateHeaderMinWidths = false;
                        }

                        if ($scope.options.columnDefsString != null) {
                            $scope.options.columnDefs = $scope.$parent.$eval($scope.options.columnDefsString);
                            wfGridService.applyColumnSecurity($scope.namespace, $scope.options.columnDefs);
                        }

                        if ($attrs.style) {
							$scope.style = "width:100%; " + $attrs.style;
						} else {
							$scope.style = "width:100%;";
						}
                        if ($attrs.scrollableHeight) {
                            $scope.innerStyle = {'max-height': ($attrs.scrollableHeight?$attrs.scrollableHeight:'500px'), 'overflow': 'auto','width':'100%'};
                        } else {
                            $scope.innerStyle = {'max-height': '300px','overflow': 'auto','width':'100%'};
                        }
                        // The default behavior is to restore scroll position upon returning to the page.
                        var scrollTimer;
                        if (typeof $scope.options.restoreScroll === 'undefined' || $scope.options.restoreScroll) {
                            // Get wf-table-body scroll position as we are leaving the page
                            $scope.$on("$stateChangeStart", function () {
                                var id = $scope.options.widgetId;
                                if (id) {
                                    wfGridService.scrollValues[id] = $scope.getScrollPos();
//                                    console.log("restoreScroll: stateChangeStart event: " + wfGridService.scrollValues[id] + " id: " + id);
                                }
                            });

                            // Load wf-table-body scroll position after everything has rendered
                            scrollTimer = $timeout(function () {
                                var id = $scope.options.widgetId;
                                if (id) {
                                    var scrollY = wfGridService.scrollValues[id] ? wfGridService.scrollValues[id] : 0;
                                    if (scrollY > 0) {
//                                        console.log("restoreScroll: Setting Scroll to: " + scrollY);
                                        $scope.setScrollPos(scrollY);
                                        $scope.scrollPos(scrollY);
                                    }
                                }
                            }, 0);
                        }

                        // Cleanup the scrollTimer
                        $element.on("$destroy", function () {
                            if (scrollTimer) {
                                $timeout.cancel(scrollTimer);
                            }
                        });
                        $scope.loader = function () {
                            var loaderFn = $attrs.loader;
                            if (loaderFn.indexOf("(") != -1) {
                                loaderFn = loaderFn.substring(0, loaderFn.indexOf("("));
                            }
                            $scope.$eval(loaderFn + "(options.sortInfo, options.paging)");
                        };

                        $scope.sortRowsInternally = function (field, order) {

                            var reverse = false;

                            if (!order) {
                                order = 'asc';
                            }

                            if (order == 'desc') {
                                reverse = true;
                            }

                            if (!$scope.options.enableGrouping) {
                                $scope.rows = []
                                $scope.rows.push($scope.$eval($scope.options.data + " | orderBy:'" + field + "':" + reverse));
                            } else {
                                $log.warn('sorting based on grouping is not implement yet')
                            }
                            $scope.fixHeaderWidths();
                        };

                        $scope.defaultSortDisabled = function() {
                            return wfGridService.defaultSortDisabled($scope);
                        }

                        $scope.defaultSort = function() {
                            wfGridService.defaultSort($scope);
                        }

                        var isFixHeadersInProgress = false;
                        var isFixHeadersWatchTimeoutInProgress = false;
                        $scope.fixHeaderWidths = function(){
                            if(!isFixHeadersInProgress){
                                var fixHeaders = $timeout(function(){
                                    if($element.find(".wf-table").is(":visible")) {
                                        if(isFixHeadersInProgress){
                                            fixHeaderWidths();
                                            $timeout.cancel(fixHeaders);
                                            isFixHeadersInProgress = false;
                                        }
                                    }else{
                                        var fixAfterVisible = undefined;
                                        var renderedWatch = $scope.$watch(
                                            function() {
                                                if(!isFixHeadersWatchTimeoutInProgress){
                                                    isFixHeadersWatchTimeoutInProgress = true;
                                                    if(fixAfterVisible){
                                                        $timeout.cancel(fixAfterVisible);
                                                    }
                                                    fixAfterVisible = $timeout(function(){
                                                        if($element.find(".wf-table").is(":visible") && isFixHeadersInProgress){
                                                            fixHeaderWidths();
                                                            $timeout.cancel(fixHeaders);
                                                            $timeout.cancel(fixAfterVisible);
                                                            isFixHeadersInProgress = false;
                                                        }
                                                        isFixHeadersWatchTimeoutInProgress = false;
                                                    },0,false);
                                                }

                                                return $element.find(".wf-table").is(":visible");
                                            },
                                            function(isVisible){
                                                if(isVisible){
                                                    renderedWatch();
                                                }
                                            }, true);

                                    }
                                },0,false);
                                isFixHeadersInProgress = true;
                            }
                        }

                        var updateGridRows = wfGridService.updateGridRows;

                        updateGridRows($scope, $log);

                        var unwatchData = $scope.$watchCollection($scope.options.data, function (newVal) {
                            if (newVal) {
                                updateGridRows($scope, $log);
                                $scope.fixHeaderWidths();
                            }

                        });

                        var unwatchColumnDefsString = function(){};
                        if ($scope.options.columnDefsString != null) {
                        	unwatchColumnDefsString =  $scope.$watch($scope.options.columnDefsString, function (newVal, oldVal) {
                                if (newVal) {
                                    if ($scope.options.columnDefsString != null) {
                                        $scope.options.columnDefs = newVal;
                                        wfGridService.applyColumnSecurity($scope.namespace, $scope.options.columnDefs);
                                    }
                                }
                            }, true);
                        }

                        var unwatchColumnDefsLength = $scope.$watch('options.columnDefs.length', function(newVal){
                            if(newVal) {
                                $scope.fixHeaderWidths();
                            }
                        });

                        $element.on('$destroy', function(){
                        	unwatchColumnDefsLength();
                        	unwatchColumnDefsString();
                        	unwatchData();
                        });

                        function fixHeaderWidths() {

                        	var wfTableHeaderGroup = $element.find('.wf-table .table-column-header-group .wf-grid-column-header-group');
                            var wfRows = $element.find('.wf-table .wf-table-body');

                            if($(wfRows).get(0).scrollHeight > $(wfRows).get(0).clientHeight){
                            	wfTableHeaderGroup.css({'margin-right': '12px'});
                            } else{
                                wfTableHeaderGroup.css({'margin-right': '0px'});
                            }


                            var rows = $element.find('.wf-table .wf-table-body tr:first td');
                            var columns = $element.find(" .wf-table .table-column-header th");

                            if($scope.updateHeaderMinWidths){
                            	rows.each(function(index, el){
                            		var width = $(el).outerWidth();
                            		var columnOuterWidth = $(columns[index]).outerWidth();
                            		$(columns[index]).css('max-width','');
                            		$(columns[index]).css('min-width','');

                                	if(width && width < columnOuterWidth){
                                        $(columns[index]).css('width',width);
                                        var outerWidth = $(columns[index]).outerWidth();
                                        if( outerWidth && (outerWidth <= $scope.options.columnDefs[index].$minwidth))
                                        {
                                            $(el).css('min-width',outerWidth);
                                            $(el).css('max-width',outerWidth);
                                        }else{
                                            $(el).css('min-width',$scope.options.columnDefs[index].$minwidth);
                                            $(el).css('max-width',$scope.options.columnDefs[index].$minwidth);
                                        }
                                        $(columns[index]).css('width','');
                                    }else if(width && width > columnOuterWidth){
                                    	//$(el).css('min-width',width);
                                        $(el).css('max-width',width);
                                    }
                                });
                            }

                            columns.each(function(index,el){
                                el = $(el);
                                el.css('min-width', '');
                                el.css('max-width', '');
                                if(rows[index]){
                                    var width = 0;
                                    var minWidth = 0;
                                    var padding = $(rows[index]).outerWidth() - $(rows[index]).width();
                                    var width = $(rows[index]).width() + padding ;
                                    if(width){
                                        el.css('min-width', width);
                                        el.css('max-width', width);
                                    }
                                }
                            });
                        }
                    }
                }
            },

            templateUrl: 'template/wfScrollableGrid.html'
        };
    }])

/**
 * Directive to include pagination in the grid
 */

    .directive('wfGridPaging', ['wfGridService', function(wfGridService) {
        return {
            restrict: 'E',
            scope: true,
            compile: function() {
                return {
                    pre: function($scope, $element, $attrs) {
                        $scope.pageSizes = [10, 25, 50, 75, 100];   // , 'All' (has been removed)
                        $scope.paginationSize = 4;

                        if (! $scope.options.paging) {
                            $scope.options.paging = {}; //default to empty if not present
                        }
                        if ($scope.options.paging.rowsPerPage) {
                            $scope.options.paging.selectedPageSize = $scope.options.paging.rowsPerPage;
                        } else {
                            $scope.options.paging.rowsPerPage = $scope.options.paging.selectedPageSize = 25;    // default value - 25
                        }

                        $scope.showFirstOrPreviousPageLink = false;

                        $scope.showLastOrNextPageLink = false;

                        var determineStartEndIndex = function() {
                            $scope.options.paging.startIndex = (($scope.options.paging.currentPage * $scope.options.paging.rowsPerPage) - $scope.options.paging.rowsPerPage) + 1;
                            var endIndex = ($scope.options.paging.currentPage * $scope.options.paging.rowsPerPage);
                            if (endIndex > $scope.options.paging.totalRecords) {
                                endIndex = $scope.options.paging.totalRecords
                            }
                            if($scope.options.paging.startIndex < 1 && $scope.options.paging.totalPages > 0 ){
                                $scope.options.paging.startIndex = 1;
                                endIndex = $scope.options.paging.rowsPerPage
                            }

                            if($scope.options.paging.totalPages == 0 ){
                                $scope.options.paging.startIndex = 0;
                                endIndex = 0;
                            }
                            $scope.options.paging.endIndex = endIndex;
                        }

                        var calculatePaging = function() {

                            var totalRecords = $scope.options.paging.totalRecords;
                            $scope.options.paging.totalPages = (totalRecords != undefined || totalRecords === 0) ? Math.ceil(totalRecords / $scope.options.paging.rowsPerPage) : 1;
                            determineStartEndIndex();

                            $scope.pages = [];
                            for (var page_index = 0; page_index < $scope.options.paging.totalPages; page_index++) {
                                if (page_index == 0) {
                                    $scope.pages.push({number: page_index + 1, active: true});
                                } else {
                                    $scope.pages.push({number: page_index + 1});
                                }
                            }
                            $scope.previousDisabled = true;
                            $scope.nextDisabled = false;

                        }

                        var updateLinkEnableStatus = function() {
                            if ($scope.options.paging.currentPage > 1) {
                                $scope.showFirstOrPreviousPageLink = true;
                                $scope.previousDisabled = false;
                            } else {
                                $scope.showFirstOrPreviousPageLink = false;
                                $scope.previousDisabled = true;
                            }
                            if ($scope.options.paging.currentPage == $scope.options.paging.totalPages ||
                                $scope.options.paging.totalPages === 0) {
                                $scope.showLastOrNextPageLink = false;
                                $scope.nextDisabled = true;
                            } else {
                                $scope.showLastOrNextPageLink = true;
                                $scope.nextDisabled = false;
                            }
                        }

                        var unwatchPaging = $scope.$watch('options.paging', function(newValue, oldValue) {
                            if (newValue)
                                calculatePaging();
                        });

                        var unwatchCurrentPage = $scope.$watch('options.paging.currentPage', function(newValue, oldValue) {
                            if (newValue !== oldValue) {
                                if (newValue === 1) {
                                    $scope.$parent.resetCurrentPage();
                                }
                            }
                        });

                        $scope.loadData = function() {
                            //$scope.options.paging.totalRecords = 0;
                            //calculatePaging();
                            $scope.loader();
                        }

                        var unwatchTotalRecords = $scope.$watch('options.paging.totalRecords', function(newValue, oldValue) {
                            if (newValue  || newValue === 0) {
                                $scope.options.paging.currentPage = 1;
                                $scope.options.paging.startIndex = 1;
                                $scope.options.paging.oldPage = $scope.options.paging.currentPage;
                                calculatePaging();

                                updateLinkEnableStatus();
                            }
                        });

                        var unwatchRowsPerPage = $scope.$watch('options.paging.rowsPerPage', function(newValue, oldValue) {
                            if (newValue) {
                                calculatePaging();

                                updateLinkEnableStatus();
                            }
                        });

                        $element.on('$destroy', function(){
                        	unwatchRowsPerPage();
                        	unwatchTotalRecords();
                        	unwatchCurrentPage();
                        	unwatchPaging();
                        });

                        $scope.getFirstPage = function() {
                            $scope.options.paging.currentPage = 1;
                            $scope.options.paging.startIndex = 1;
                            $scope.options.paging.oldPage = $scope.options.paging.currentPage;
                            $scope.loadData();
                        }

                        $scope.getPreviousPage = function() {
                            //$scope.options.paging.currentPage = $scope.options.paging.currentPage - 1;
                            //$scope.loadData();
                            var pageNumber =  $scope.options.paging.currentPage - 1;
                            if (pageNumber < 1 || pageNumber > $scope.options.paging.totalPages) {
                                return;
                            }
                            $scope.selectPage(pageNumber);

                        }

                        $scope.getNextPage = function() {
                            //$scope.options.paging.currentPage = $scope.options.paging.currentPage + 1;
                            //$scope.loadData();
                            var pageNumber =  $scope.options.paging.currentPage + 1;
                            if (pageNumber < 1 || pageNumber > $scope.options.paging.totalPages) {
                                return;
                            }
                            $scope.selectPage(pageNumber);

                        }

                        $scope.getLastPage = function() {
                            $scope.options.paging.currentPage = $scope.options.paging.totalPages;
                            $scope.options.paging.oldPage = $scope.options.paging.currentPage;
                            $scope.loadData();
                        }

                        $scope.perPageListBoxChange = function() {
                            if ($scope.options.paging.selectedPageSize === 'All') {
                                $scope.options.paging.rowsPerPage = $scope.options.paging.totalRecords;
                            } else {
                                $scope.options.paging.rowsPerPage = $scope.options.paging.selectedPageSize;
                            }
                            $scope.options.paging.currentPage = 1;
                            $scope.options.paging.startIndex = 1;
                            $scope.options.paging.oldPage = $scope.options.paging.currentPage;
                            $scope.loadData();
                        }

                        $scope.selectPage = function(pageNumber) {
                            pageNumber = Number(pageNumber).valueOf();
                            if (pageNumber == NaN) {
                                console.log('selectPage called with a non-numeric pageNumber');
                                return false;
                            }
                            if ($scope.options.paging.oldPage && (pageNumber === $scope.options.paging.oldPage)) {
                                // no need to reload existing page
                                return false;
                            }

                            $scope.options.paging.currentPage = pageNumber;
                            $scope.options.paging.oldPage = $scope.options.paging.currentPage;
                            determineStartEndIndex();

                            if (pageNumber < 1 || pageNumber > $scope.options.paging.totalPages) {
                                return;
                            }

                            var containingGrid = wfGridService.findParentBySelector($element[0], '.wf-grid-table');
                            var pagers = containingGrid.getElementsByClassName('pagination-top-container');

                            if (pagers) {
                                for (var i = 0; i < pagers.length; i++) {
                                    var pager = pagers[i];
                                    angular.element(pager).scope().adjustPageLinks(pageNumber, angular.element(pager).scope().pages);
                                }
                            }

                            $scope.loadData();
                        }

                        $scope.adjustPageLinks = function(pageNumber, pages) {
                            if(pages[(pageNumber-1)] !== null && pages[(pageNumber-1)] !== undefined){ // prevents errors on page links when going from page > 1 to blank information
                                var index_Incrementor ;//used to find number of positions to be shifted for identifying the current page position
                                //show paginationSize (4) pages at any point in time if total number of pages are more than paginationSize    (used to be 10)
                                $scope.paginationSize = 4;
                                if($scope.options.paging.totalPages < $scope.paginationSize){
                                    //show actual number of pages if total pages are less than 10
                                    $scope.paginationSize = $scope.options.paging.totalPages;
                                }
                                var tempPaginationSize; // Used to prevent pages[-1] from ever being called
                                if($scope.paginationSize <= 0){
                                    tempPaginationSize = 0;
                                    $scope.paginationSize = 0;
                                } else {

                                    tempPaginationSize = $scope.paginationSize-1;
                                }
                                //midPagination is used to find position of the current page
                                var midPagination = ~~($scope.paginationSize/2);

                                if (pages[0] && pageNumber < pages[midPagination].number) {
                                    if (pages[0].number <= 1) {
                                        index_Incrementor = 0;
                                    } else {
                                        index_Incrementor = -(pages[midPagination].number - pageNumber);
                                    }
                                }

                                if(pages[0] && pageNumber >= pages[midPagination].number) {
                                    if(pages[tempPaginationSize].number >= $scope.options.paging.totalPages
                                        && (pages[tempPaginationSize].number - pageNumber < midPagination)){
                                        index_Incrementor = 0;
                                    }else {
                                        index_Incrementor = pageNumber - pages[midPagination].number;
                                    }
                                }

                                if(pages[0] && index_Incrementor != 0) {
                                    for(var i=0; i< $scope.paginationSize;i++){
                                        pages[i].number = pages[i].number + index_Incrementor;
                                        if(pages[0].number < 1
                                            || pages[i].number < 1){
                                            for(var j=0;j<$scope.paginationSize;j++){
                                                pages[j].number = j + 1;
                                            }
                                            break;
                                        }

                                        if(pages[($scope.paginationSize-1)].number > $scope.options.paging.totalPages
                                            || pages[i].number > $scope.options.paging.totalPages){
                                            for(var j=0;j<$scope.paginationSize;j++){
                                                pages[j].number = $scope.options.paging.totalPages - ($scope.paginationSize-1) + j;
                                            }
                                            break;
                                        }
                                    }
                                }
                                for (var page_index = 0; page_index < $scope.paginationSize; page_index++) {
                                    if (pages[page_index].number == pageNumber) {
                                        pages[page_index].active = true;
                                    } else {
                                        pages[page_index].active = false;
                                    }
                                }

                                if (pageNumber == 1) {
                                    $scope.previousDisabled = true;
                                } else {
                                    $scope.previousDisabled = false;
                                }
                                if (pageNumber == $scope.options.paging.totalPages) {
                                    $scope.nextDisabled = true;
                                } else {
                                    $scope.nextDisabled = false;
                                }
                            }
                        }

                        $scope.setPage = function(pageNumber) {
                            if ($scope.options.paging.currentPage < 1 || $scope.options.paging.currentPage > $scope.options.paging.totalPages) {
                                return;
                            }
                            // pageNumber === $scope.options.paging.currentPage as set by ng-model
                            $scope.selectPage($scope.options.paging.currentPage);
                        }

                        //used to resetting current page
                        //used in sorting
                        $scope.$parent.resetCurrentPage = function() {
                            $scope.options.paging.currentPage = 1;
                            $scope.options.paging.startIndex = 1;
                            $scope.options.paging.oldPage = $scope.options.paging.currentPage;
                            calculatePaging();

                            var containingGrid = wfGridService.findParentBySelector($element[0], '.wf-grid-table');
                            var pagers = containingGrid.getElementsByClassName('pagination-top-container');
                            if (pagers) {
                                for (var i = 0; i < pagers.length; i++) {
                                    var pager = pagers[i];
                                    angular.element(pager).scope().adjustPageLinks($scope.options.paging.currentPage, $scope.pages);
                                }
                            }
                        };

                    }
                };
            },

            replace: true,
            templateUrl: 'template/wfGridPaging.html'
        }
    }])

    .directive('wfGridColumnHeaderGroup', function ($compile, $log) {

        return {
            restrict: 'C',
            compile: function ($scope) {
                return {
                    pre: function ($scope, $element, $attrs, ctrl) {

                        $scope.scrollHeader = function (scrollLeft, addMargin) {
                            $element.scrollLeft(scrollLeft);
                            if (addMargin) {
                                $element.css({'margin-right': '12px'});
                            } else{
                                $element.css({'margin-right': '0px'});
                            }
                        };

                        var unwatchDataLength = $scope.$watch($scope.options.data + '.length', function (newVal, oldVal) {
                            if (!newVal)
                                $element.css('overflow', 'auto');
                            else
                                $element.css('overflow', 'hidden');

                        });

                        $element.on('$destroy',function(){
                        	unwatchDataLength();
                        });
                    }
                };
            }
        }
    })

    .directive('wfGridHeaderRow', ['$compile', '$log', 'wfGridService', function($compile, $log, wfGridService) {
        return {
            restrict: 'C',

            compile: function($scope, $element, $attrs) {
                return {
                    pre: function($scope, $element, $attrs) {

                        if ($scope.options.enableDefaultSortButton && ! $scope.options.defaultSortInfo) {
                            // If no defaultSortInfo is specified, then default to no fields and no direction
                            $scope.options.defaultSortInfo = {};
                            $scope.options.defaultSortInfo.fields = [];
                            $scope.options.defaultSortInfo.directions = [];
                        }
                        if (wfGridService.isDefaultSortInEffect($scope)) {
                            $scope.options.initialSortOrder = true;
                        } else {
                            $scope.options.initialSortOrder = false;
                        }

                        $scope.getSortClass = function(field) {

                            if ($scope.options.enableSorting) {

                                var sortInfo = wfGridService.getSortInfo($scope);

                                var fields = sortInfo.fields;
                                var orders = sortInfo.directions;
                                var sortClass = '';
                                angular.forEach($scope.options.columnDefs, function(colDef) {
                                    if (colDef.field == field && wfGridService.isSortable(colDef)) {
                                        sortClass = 'icon-sort';
                                    }
                                });



                                if (fields.indexOf(field) != -1) {
                                    var order = orders[fields.indexOf(field)];

                                    if (order == 'asc')
                                        sortClass = 'icon-sort-up';
                                    else if (order == 'desc')
                                        sortClass = 'icon-sort-down';
                                }
                                return sortClass;
                            }

                        };

                        //function will change sort column
                        $scope.changeSortColumn = function(field) {

                            if ($scope.options.enableSorting) {
                                var sortInfo = wfGridService.getSortInfo($scope);

                                var fields = sortInfo.fields;

                                var orders = sortInfo.directions;

                                var sortOrder = '';

                                if (fields.indexOf(field) != -1) {
                                    sortOrder = orders[fields.indexOf(field)];
                                }

                                if (sortOrder == 'asc') {
                                    sortOrder = 'desc';
                                } else {
                                    sortOrder = 'asc';
                                }

                                // single field sorting
                                if (!($scope.options.enableMultipleSorting)) {
                                    $scope.options.sortInfo = {};
                                    if (field) {
                                        $scope.options.sortInfo.fields = [field];
                                        $scope.options.sortInfo.directions = [sortOrder];
                                    } else {
                                        // if the field specified is null, then we do not want to introduce nulls into the
                                        // options.sortInfo.
                                        // (this is probably coming from a return to default sort request where the
                                        // default is configured to be { fields : [], directions: [] } as in Fulfillment pipeline)
                                        $scope.options.sortInfo.fields = [];
                                        $scope.options.sortInfo.directions = [];
                                    }

                                } else {
                                    //to-do multiple sorting
                                }
                                if (wfGridService.isDefaultSortInEffect($scope)) {
                                    $scope.options.initialSortOrder = true;
                                } else {
                                    $scope.options.initialSortOrder = false;
                                }
                                if($scope.options.enablePaging && ($scope.options.useExternalSorting == undefined
                                    || $scope.options.useExternalSorting == true)) {
                                    $scope.resetCurrentPage();
                                }
                            }
                        };

                        $scope.sortInternally = function(sortField) {

                            if ($scope.options.enableSorting) {
                                var sortInfo = wfGridService.getSortInfo($scope);

                                if (sortInfo) {
                                    var fields = sortInfo.fields;
                                    var orders = sortInfo.directions;

                                    if (fields.indexOf(sortField) != -1) {
                                        var order = orders[fields.indexOf(sortField)];
                                        $scope.sortRowsInternally(sortField, order);
                                    }
                                }
                            }
                        };
                    }
                };
            }
        };
    }])

    .directive('wfGridHeaderCol', ['$compile', '$log', 'wfGridService', function($compile, $log, wfGridService) {

        var DISPLAY_NAME = /DISPLAY_NAME/g;
        var SORT_IMG_TEMPLATE = /SORT_IMG_TEMPLATE/g;
        var SORT_CLASS = /SORT_CLASS/g;
        var CHECKBOX_HANDLER = /CHECKBOX_HANDLER/g;
        var CHECKBOX_DISABLED = /CHECKBOX_DISABLED/g;
        var CHECKBOX_TAG = /CHECKBOX_TAG/g;
        var CHECKBOX_ID_TAG = /CHECKBOX_ID_TAG/g;
		var COL_HEADER_EXPAND_COLLAPSE = /COL_HEADER_EXPAND_COLLAPSE/g;

        var colHeaderTag = '<div class="column-header" ng-class="{sortable : options.enableSorting}">COL_HEADER_EXPAND_COLLAPSE<div class="title">{{DISPLAY_NAME}}CHECKBOX_TAG</div>SORT_IMG_TEMPLATE</div>';
        var colHeaderHtmlTag = '<div class="column-header" ng-class="{sortable : options.enableSorting}">COL_HEADER_EXPAND_COLLAPSE<div class="title" wf-bind-html-unsafe="DISPLAY_NAME"></div>SORT_IMG_TEMPLATE</div>';
        var sotImageTag = '<div ng-click="sortColumn();" class="sort"><i ng-class="SORT_CLASS" class="icon-large default"></i></div>';
        var checkboxTag = '<div><input type="checkbox" CHECKBOX_ID_TAG ng-change="selectDeselectAll()" ng-model="checked"CHECKBOX_DISABLED/></div>';
        var sortAscClass = '';
        var sortDescClass = '';

        return {
            restrict: 'C',
            require: '?^wfGrid',
            compile: function($scope) {
                return {
                    pre: function($scope, $element, $attrs, wfGridCtrl) {

                        var colDef = $scope.colDef;
                        var colheader = '';
                        if(colDef.displayNameHtml){
                            colheader = colHeaderHtmlTag.replace(DISPLAY_NAME, 'colDef.displayNameHtml');
							if(colDef.headerMain) {
                                colheader = colheader.replace(COL_HEADER_EXPAND_COLLAPSE,'<span style="padding-right:3px;">'+
                                    '<a href=""  style="text-decoration:none; color:#ffffff;" ng-click="expandCollapseHeader()" >' +
                                    '<span ng-hide="tableHeaderExpanded" class="icon-large default icon-expand"></span>' +
                                    '<span ng-show="tableHeaderExpanded" class="icon-large default icon-collapse"></span>' +
                                    '</a>' +
                                    '</span>' );
                            } else {
                                colheader = colheader.replace(COL_HEADER_EXPAND_COLLAPSE, '');
                            }
                        } else {
                            colheader = colHeaderTag.replace(DISPLAY_NAME, 'colDef.displayName');
							if(colDef.headerMain) {
                                colheader = colheader.replace(COL_HEADER_EXPAND_COLLAPSE, '<span style="padding-right:3px;">'+
                                    '<a href=""  style="text-decoration:none; color:#ffffff;" ng-click="expandCollapseHeader()" >' +
                                    '<span ng-hide="tableHeaderExpanded" class="icon-large default icon-expand"></span>' +
                                    '<span ng-show="tableHeaderExpanded" class="icon-large default icon-collapse"></span>' +
                                    '</a>' +
                                    '</span>' );
                            }else {
                                colheader = colheader.replace(COL_HEADER_EXPAND_COLLAPSE, '');
                            }
                        }
                        var sortImg = '';
                        if ($scope.colDef.width != null) {
                            $scope.colDef.columnStyle = {width: $scope.colDef.width};
                        }
                        if ($scope.options.enableSorting) {

                            if (wfGridService.isSortable(colDef)) {
                                $scope.sortClass = $scope.getSortClass(colDef.field);
                                sortImg = sotImageTag.replace(SORT_CLASS, 'sortClass');
                            }
                        }
                        if (colDef.showCheckbox) {
                            //checkboxTag = checkboxTag.replace(CHECKBOX_HANDLER, colDef.checkboxHandler);
                            var checkboxDisabledFn = (colDef.checkboxDisabledFn ? ' ng-disabled="colDef.checkboxDisabledFn()"'  : '');
                            checkboxTag = checkboxTag.replace(CHECKBOX_DISABLED,checkboxDisabledFn);
                        	colheader = colheader.replace(CHECKBOX_TAG,checkboxTag);
                            if ($scope.options.widgetId) {
                                colheader = colheader.replace(CHECKBOX_ID_TAG, 'id = "' + $scope.options.widgetId + '-checkbox"');
                            } else {
                                colheader = colheader.replace(CHECKBOX_ID_TAG, '');
                            }
                            colheader = colheader.replace(SORT_IMG_TEMPLATE,'');
                        } else {
                            colheader = colheader.replace(SORT_IMG_TEMPLATE,sortImg);
                            colheader = colheader.replace(CHECKBOX_TAG,'');
                        }

                        $element.append($compile(colheader)($scope));

                        if (colDef.title) {
                            $element.find('.title').attr('title', colDef.title);
                        } else {
                            $element.find('.title').attr('title', colDef.displayName);
                        }
                        $scope.sortColumn = function($event) {

                            if ($scope.options.enableSorting) {
                                if (wfGridService.isSortable(colDef)) {
                                    $scope.changeSortColumn(colDef.field);

                                    if (!($scope.options.useExternalSorting == undefined || $scope.options.useExternalSorting == true)) {
                                        $scope.sortInternally(colDef.field)
                                    } else {
                                        $scope.loader();
                                    }
                                }
                            }
                        };

                        var unwatchSortInfo = $scope.$watch('options.sortInfo', function() {
                            $scope.sortClass = $scope.getSortClass(colDef.field);
                            if (wfGridService.isDefaultSortInEffect($scope)) {
                                $scope.options.initialSortOrder = true;
                            } else {
                                $scope.options.initialSortOrder = false;
                            }
                        });

                        $scope.selectDeselectAll = function() {
                            $scope.$eval($scope.colDef.checkboxHandler + '(' +$scope.checked + ')');
                        };

                        // register the callback to be invoked upon changes in data
                        if (wfGridCtrl && colDef.showCheckbox) {
                            wfGridCtrl.registerDataListener(function(dataPath) {
                                // if the data has changed, we will reset to false
                                if ($scope.checked) {
                                    $scope.checked = false;
                                    // also need to reset checkboxhandler for next time
                                    $scope.$eval($scope.colDef.checkboxHandler + '(' +$scope.checked + ')');
                                }
                            });
                        }

                        $scope.$lastColumn = $scope.$last;

                        $element.on('$destroy', function(){
                        	unwatchSortInfo();
                        });
                    },

                    post: function ($scope, $element, $attrs) {
                       if($scope.isScrollableGrid){
                    	   $scope.initializingColumnHeader = true;
                           var initialMinWidth = true;
                           $scope.colDef.$linkElement = undefined;
                           var unwatchTableVisibility = $scope.$watch(
                               function(){
                                   return {width : $element.outerWidth(),visible:$element.is(':visible')};
                               },function(newVal, oldVal){
                                   if(newVal && newVal.visible && newVal.width){
                                       if( !initialMinWidth && newVal.width < $scope.colDef.$minwidth ){
                                           $scope.colDef.$minwidth =  newVal.width;
                                       }else if(initialMinWidth){
                                           $scope.colDef.$minwidth = newVal.width
                                           initialMinWidth = false;
                                       }
                                   }
                                   if(newVal && newVal.visible && $scope.$last){
                                      // $scope.fixHeaderWidths();
                                   }
                               }, true
                           );

                           $scope.isVisible = function(){
                               return $element.is(':visible');
                           }

                           var unwatchVisibility = $scope.$watch('isVisible()',function(newVal, oldVal){
                                   if(newVal && $scope.$lastColumn && $scope.isScrollableGrid){
                                       $scope.fixHeaderWidths();
                                   }
                           });

                           $element.on('$destroy', function(){
                        	   unwatchVisibility();
                        	   unwatchTableVisibility();
                           });

                           $scope.colDef.$minwidth = $element.outerWidth();
                       }
                  }
                }
            }
        }
    }])

    .directive('wfGridRows', function($compile, $log) {
        var GROUP_BY = 'groupBy';
        var RESULTS = 'dataList';
        return {
            restrict: 'C',
            compile: function($scope, $element, $attrs) {
                return {
                    pre: function($scope, $element, $attrs) {

                        $scope.datarows = undefined;

                        if ($scope.options.enableGrouping) {
                            $scope.groupingIndex = $scope.$index;
                            var groupByField = GROUP_BY;

                            if ($scope.options.groupInfo) {

                                groupByField = $scope.options.groupInfo.field || GROUP_BY;
                                $scope.groupBy = $scope.$eval('groupRow.' + ($scope.options.groupInfo.field || GROUP_BY));

                                $scope.datarows = $scope.$eval('groupRow.' + ($scope.options.groupInfo.data || RESULTS))

                            } else {
                                $scope.groupBy = $scope.$eval('groupRow.' + GROUP_BY);
                                $scope.datarows = $scope.$eval('groupRow.' + RESULTS);
                            }

                            if (!$scope.datarows && angular.equals(($scope.$eval('rows'))[0], {})) {
                                // Enable no data '-' indication
                                var results = $scope.options.groupInfo.data || RESULTS;
                                $scope.groupRow = {};
                                $scope.groupRow[results] = [];
                                $scope.groupRow[results].push([{}]);

                                var groupBy = $scope.options.groupInfo.field || GROUP_BY;
                                $scope.groupRow[groupBy] = '-';
                            } else if (!$scope.datarows) {
                                $log.error("Grouping is invalid : please check the data structure of the your grouping rows");
                            }

                            $scope.$watch('groupRow.' + groupByField, function(newVal){
                                $scope.groupBy = $scope.$eval('groupRow.' + ($scope.options.groupInfo.field || GROUP_BY));
                            });

                        } else {
                            if ($scope.groupRow && !angular.isArray($scope.groupRow)) {
                                $log.error("Rows are invalid in the grid");
                            }
                            $scope.datarows = $scope.groupRow;
                        }
                    }
                };
            }
        };
    })

    .directive('wfGridDataRow', function($compile, $log) {
        return {
            restrict: 'C',

            compile: function($scope, $element, $attrs) {
                return {
                    pre: function($scope, $element, $attrs) {
                        $scope.$watch('$index', function(newVal) {
                            if( newVal || newVal === 0 ){
                                $scope.rowIndex = $scope.$index;
                                $scope.$lastRow = $scope.$last;
                            }
                        });

                        $scope.scrollToRow = function () {
                            $scope.resetScrollPos();
                            $scope.setScrollPos($element.offset().top);
                            $scope.scroll();
                        }
                    }
                };
            }
        };
    })


    .directive('wfTableBody', function ($compile, $log) {
        return {
            restrict: 'C',

            compile: function ($scope, $element, $attrs) {
                return {
                    pre: function ($scope, $element, $attrs) {
                        var currentScroll = 0;
                        var scrollPos = 0;
                        $scope.setScrollPos = function (pos) {
                            scrollPos = pos;
                        }
                        $scope.getScrollPos = function () {
                            return $element.get(0).scrollTop;
                        }
                        $scope.resetScrollPos = function () {
                            $element.scrollTop(0);
                        }
                        $scope.scrollPos = function(pos) {
                            $element.scrollTop(scrollPos);
                        }
                        $scope.scroll = function (elem) {
                            $element.scrollTop(scrollPos - $element.offset().top);
                        }
                        if($scope.isScrollableGrid){
                            $element.bind('scroll', function (event) {
                                if (currentScroll != event.currentTarget.scrollLeft) {
                                    currentScroll = event.currentTarget.scrollLeft;
                                    $scope.scrollHeader(currentScroll, $element.get(0).scrollHeight > $element.get(0).clientHeight);
                                }
                            });
                        }
                        $scope.isVericalScroll = function(){
                            return ( $element.get(0).scrollHeight > $element.get(0).clientHeight );
                        }
                    }
                };
            }
        };
    })

/**
 * Directive to create column in the grid with various options
 */
    .directive('wfGridDataCol', ['$compile', 'wfGridService', function($compile, wfGridService) {

        var COL_FIELD = /COL_FIELD/g;

        var DISPLAY_CELL_TEMPLATE = /DISPLAY_CELL_TEMPLATE/g;

        var EDIT_CELL_TEMPLATE = /EDIT_CELL_TEMPLATE/g;

        var INNER_CELL_TEMPLATE = /INNER_CELL_TEMPLATE/g;

        var linkTag = '<a href="RECORD_URL" >RECORD_VALUE</a>';

        var inputTag = '<input  ng-model="COL_FIELD" />'; // ng-input="COL_VALUE"

        // we surround the INNER_CELL_TEMPLATE with a div to ensure the display: block semantics required by the cell height adjustment logic
        var elementTag = '<div ng-if="col" class="cell" style="width: 100%"> ' + '<span ng-hide="inEditMode && col.editable">' + 'DISPLAY_CELL_TEMPLATE' + '</span>' + '<span ng-if="col.editable" ng-show="inEditMode">' + 'EDIT_CELL_TEMPLATE' + '</span> ' + '<div wf-if="col.innerCellTemplate"><div wf-if="col.innerCellTemplate" class="innerCellContainer" onmouseover="if (! angular.element(event.target ? event.target : event.srcElement).scope()[\'cellSeedWidth\']) angular.element(event.target ? event.target : event.srcElement).scope().seedWidth(event);" onclick="angular.element(event.target ? event.target : event.srcElement).scope().adjustHeights(event);"><div wf-if="col.innerCellTemplate">' + 'INNER_CELL_TEMPLATE' + '</div></div wf-if="col.innerCellTemplate"></div wf-if="col.innerCellTemplate">' + '</div>'

        var isEditable = function(colDef) {
            if (colDef.editable == undefined || colDef.editable == true) {
                colDef.editable = true;
                return true;
            }
            return false;
        };

        return {

            restrict: 'C',

            compile: function() {
                return {
                    pre: function(scope, element, attrs) {

                        var record = scope.row;

                        var columnDef = scope.col;

                        var cellValue = undefined;
                        if (scope.col.width != null) {
                            scope.col.columnStyle = {width: scope.col.width};
                        }

                        if (record[columnDef.field] === true || record[columnDef.field] === false) {

                            if (columnDef.inverse === true) {
                                cellValue = '<span ng-bind="row.' + columnDef.field + '|wfBoolean:true"></span>';
                            } else {
                                cellValue = '<span ng-bind="row.' + columnDef.field + '|wfBoolean:false"></span>';
                            }
                        }

                        if (!columnDef.field) {
                            if (columnDef.defaultVal)
                                cellValue = columnDef.defaultVal;
                            else
                                cellValue = "N/A";
                        } else {

                            if (!cellValue)
                                cellValue = '<span>{{row.' + columnDef.field + '}}</span>';
                        }

                        if (columnDef.url) {
                            var paramsUrl;

                            if (columnDef.url.params) {

                                paramsUrl = '?'

                                angular.forEach(columnDef.url.params, function(param, index) {

                                    if (index > 0)
                                        paramsUrl = paramsUrl + '&';

                                    paramsUrl = paramsUrl + param.name + '={{row.' + param.field + '}}';

                                });

                            } else {
                                paramsUrl = '?' + columnDef.field + '={{row.' + columnDef.field + '}}';
                            }

                            if (columnDef.url.img) {
                                cellValue = columnDef.url.img;
                            }

                            if (!columnDef.url.path) {
                                columnDef.url.path = '';
                                paramsUrl = '';
                            }

                            var link = linkTag.replace('RECORD_URL', columnDef.url.path + paramsUrl);

                            if (typeof(scope.$eval('row.' + columnDef.field)) === 'undefined') {
                                // format 'no data' presentation
                                link = link.replace('RECORD_VALUE', '<span>-</span>');
                            } else {
                                link = link.replace('RECORD_VALUE', cellValue);
                            }

                            var template = elementTag;

                            template = template.replace(DISPLAY_CELL_TEMPLATE, link);

                            if (scope.options.enableEdit && isEditable(columnDef)) {

                                if (columnDef.cellEditTemplate) {
                                    var cellEditTemplate = columnDef.cellEditTemplate;
                                    cellEditTemplate = cellEditTemplate.replace(COL_FIELD, 'row.' + columnDef.field);
                                    template = template.replace(EDIT_CELL_TEMPLATE, cellEditTemplate);

                                } else {
                                    var input = inputTag.replace(COL_FIELD, 'row.' + columnDef.field);
                                    template = template.replace(EDIT_CELL_TEMPLATE, input);
                                }

                            } else {
                                template = template.replace(EDIT_CELL_TEMPLATE, '');
                            }

                            element.append($compile(template)(scope));

                        } else if (columnDef.cellTemplate) {

                            // format 'no data' presentation, if appropriate

                            var template = (!columnDef.field || typeof(scope.$eval('row.' + columnDef.field)) === 'undefined') &&
                                angular.equals(scope.$eval('row'), {}) ? '<span>-</span>' : elementTag;

                            var cellTemplate = columnDef.cellTemplate;

                            cellTemplate = cellTemplate.replace(COL_FIELD, 'row.' + columnDef.field);

                            template = template.replace(DISPLAY_CELL_TEMPLATE, cellTemplate);

                            if (scope.options.enableEdit && isEditable(columnDef)) {

                                if (columnDef.cellEditTemplate) {
                                    var cellEditTemplate = columnDef.cellEditTemplate;
                                    cellEditTemplate = cellEditTemplate.replace(COL_FIELD, 'row.' + columnDef.field);
                                    template = template.replace(EDIT_CELL_TEMPLATE, cellEditTemplate);

                                } else {
                                    template = template.replace(EDIT_CELL_TEMPLATE, cellTemplate);
                                }

                            } else {
                                template = template.replace(EDIT_CELL_TEMPLATE, '');
                            }

                            if (columnDef.innerCellTemplate) {
                                var innerCellTemplate = columnDef.innerCellTemplate;
                                innerCellTemplate = innerCellTemplate.replace(COL_FIELD, 'row.' + columnDef.field);
                                template = template.replace(INNER_CELL_TEMPLATE, innerCellTemplate);
                            }

                            var elem = element.append($compile(template)(scope));

                            elem.scope().seedWidth = function(event) {
                                var target = event.target ? event.target : event.srcElement;
                                if (! angular.element(target).scope()['cellSeedWidth']) {
                                    var container = target.className.match(/innerCellContainer/) ? target : wfGridService.findParentBySelector(target, ".innerCellContainer");

                                    var cell = wfGridService.findParentBySelector(container, "td");
                                    angular.element(target).scope()['cellSeedWidth'] = cell.offsetWidth;
                                }
                            }

                            elem.scope().adjustHeights = function(event) {
                                var target = event.target ? event.target : event.srcElement;
                                var container = target.className.match(/innerCellContainer/) ? target : wfGridService.findParentBySelector(target, ".innerCellContainer");

                                // We want to adjust cell height to match the height of the z-indexed content div
                                var cell = wfGridService.findParentBySelector(container, "td");
                                var cellDiv = cell.getElementsByTagName('div')[0];
                                var defaultDelta = cellDiv.offsetHeight - container.scrollHeight;
                                var presentHeight = cell.style.height && (typeof(cell.style.height) != 'string' || ! cell.style.height.match(/auto/)) ? Number(cell.style.height.replace(/\D+/g, '')).valueOf() : (cell.offsetHeight - cellDiv.scrollHeight > defaultDelta ? cell.offsetHeight - (cell.offsetHeight - cellDiv.offsetHeight - defaultDelta) : cell.offsetHeight);
                                var newHeight = presentHeight;
                                //console.log('Present height: [' + cell.style.height + '] [' + cell.offsetHeight + '] compared to ' + presentHeight + ' + ' + container.scrollHeight + ' [' + container.heightControlData + '] ' + defaultDelta);

                                var prezIndexContainerScrollHeight = container.scrollHeight;    // need to save this as applying style will change it, and it may be needed below
                                var ngContainer = angular.element(container);
                                if (ngContainer.css('position') !== 'absolute') {
                                    var ngCell = angular.element(cell);
                                    ngContainer.css({'position': 'absolute', 'z-index': '42'});
                                    //console.log('      Added style ' + container.scrollHeight);

                                    // preserve initial width
//                                    var padding = ngCell.css('padding') ? Number(ngCell.css('padding').replace(/\D+/g, '')).valueOf() : 0;
//                                    var newWidth = container.scrollWidth > cell.offsetWidth ?
//                                        cell.offsetWidth - (container.scrollWidth - cell.offsetWidth) + (padding * 2) :                 // A
//                                        (target.offsetWidth < container.scrollWidth ?
//                                            target.offsetWidth + (2 * (cell.offsetWidth - container.scrollWidth)) + (padding * 2) :     // B
//                                            target.offsetWidth - (cell.offsetWidth - container.scrollWidth) + (padding / 2));           // C
//                                    if (newWidth < container.scrollWidth && target.offsetWidth < container.scrollWidth) {               // only with B
//                                        console.log('\tPadding adjust: ' + newWidth);
//                                        newWidth -= (3 * (padding / 2));
//                                    }
//                                    if (target.offsetWidth < (cell.offsetWidth - container.scrollWidth) && target.offsetWidth < container.scrollWidth) {               // only with B
//                                        console.log('\tIcon adjust: ' + newWidth);
//                                        newWidth = angular.element(target).scope()['cellSeedWidth'];
//                                    }
//                                    if (newWidth < (target.offsetWidth + padding) && target.offsetWidth < container.scrollWidth) {      // only with B
//                                        console.log('\ttarget.offsetWidth fix ' + newWidth);
//                                        newWidth = target.offsetWidth + padding;
//                                    }
//                                    if (((newWidth > container.scrollWidth && newWidth < cell.offsetWidth) || newWidth > cell.offsetWidth ) && target.offsetWidth < container.scrollWidth) {      // only with B
//                                        console.log('\tmidrange fix ' + newWidth);
//                                        newWidth = container.scrollWidth - (cell.offsetWidth - container.scrollWidth) + (padding / 2);
//                                    }
//                                    console.log('Set width to ' + newWidth + ' scrollWidth: ' + container.scrollWidth + ' offsetWidth: ' + cell.offsetWidth + ' padding: ' + padding + ' target.offsetWidth: ' + target.offsetWidth + ' cell.width: ' + cell.style.width );
                                    var newWidth = angular.element(target).scope()['cellSeedWidth'];
                                    ngCell.css({'min-width': newWidth, 'max-width': newWidth});
                                }

                                // store presentHeight for later use
                                if (!container.heightControlData) {
                                    container.heightControlData = presentHeight + ':' + container.scrollHeight;
                                    //console.log('.......... Init to ' + container.heightControlData);
                                }

                                var cellHeight = Number(container.heightControlData.split(':')[0]).valueOf();
                                var innerCellHeight = Number(container.heightControlData.split(':')[1]).valueOf();
                                if (cell.offsetHeight !== (cell.offsetHeight + (container.scrollHeight - innerCellHeight))) {
                                    //console.log('   container.scrollHeight: ' + container.scrollHeight + ' innerCellHeight: ' + innerCellHeight + ' presentHeight: ' + presentHeight + ' cellHeight: ' + cellHeight + ' cell.offsetHeight: ' + cell.offsetHeight + ' ' + (container.scrollHeight > innerCellHeight ? 'true ' + (container.scrollHeight - innerCellHeight) : 'false'));
                                    newHeight += (container.scrollHeight - innerCellHeight);

                                    // need to update stored value as it appears to have changed
                                    container.heightControlData = cellHeight + ':' + container.scrollHeight;
                                    //console.log('.......... Updated to ' + container.heightControlData);
                                } else if (cell.offsetHeight < presentHeight) {
                                    // this case is only used to account for the adjustment following initial application
                                    // of the z-index style above
                                    //console.log('   init container.scrollHeight: ' + container.scrollHeight + ' innerCellHeight: ' + innerCellHeight + ' presentHeight: ' + presentHeight + ' cellHeight: ' + cellHeight + ' cell.offsetHeight: ' + cell.offsetHeight + ' ' + (container.scrollHeight > innerCellHeight ? 'true ' + (container.scrollHeight - innerCellHeight) : 'false'));
                                    newHeight -= (prezIndexContainerScrollHeight - innerCellHeight);
                                    // no update to container.heightControlData required
                                } else {
                                    //console.log('cell.offsetHeight ' + cell.offsetHeight + ' === ' + (cell.offsetHeight + (container.scrollHeight - innerCellHeight)));
                                    //console.log('   container.scrollHeight: ' + container.scrollHeight + ' innerCellHeight: ' + innerCellHeight + ' presentHeight: ' + presentHeight + ' cellHeight: ' + cellHeight + ' cell.offsetHeight: ' + cell.offsetHeight + ' ' + (container.scrollHeight > innerCellHeight ? 'true ' + (container.scrollHeight - innerCellHeight) : 'false'));
                                    newHeight = cell.offsetHeight > presentHeight ? presentHeight : cell.offsetHeight;
                                    // no update to container.heightControlData required
                                }

                                //if (typeof(newHeight) != 'string' && cell.offsetHeight != newHeight) {
                                //    console.log("Going to: " + newHeight + (typeof(newHeight) != 'string' || ! newHeight.match(/auto/) ? 'px' : ''));
                                //}
                                cell.style.height = newHeight + (typeof(newHeight) != 'string' || ! newHeight.match(/auto/) ? 'px' : '');
                            }
                        } else {

                            // format 'no data' presentation, if appropriate
                            var template = (!columnDef.field || typeof(scope.$eval('row.' + columnDef.field)) === 'undefined') &&
                                angular.equals(scope.$eval('row'), {}) ? '<span>-</span>' : elementTag;

                            template = template.replace(DISPLAY_CELL_TEMPLATE, cellValue);

                            var input = inputTag.replace(COL_FIELD, 'row.' + columnDef.field);

                            if (scope.options.enableEdit && isEditable(columnDef)) {

                                if (columnDef.cellEditTemplate) {
                                    var cellEditTemplate = columnDef.cellEditTemplate;
                                    cellEditTemplate = cellEditTemplate.replace(COL_FIELD, 'row.' + columnDef.field);
                                    template = template.replace(EDIT_CELL_TEMPLATE, cellEditTemplate);

                                } else {
                                    template = template.replace(EDIT_CELL_TEMPLATE, input);
                                }

                            } else {
                                template = template.replace(EDIT_CELL_TEMPLATE, '');
                            }
                            element.append($compile(template)(scope));
                        }

                        if (scope.$last && scope.isScrollableGrid ) {
                            if (scope.options && scope.options.scrollToRow === (scope.rowIndex + 1)) {
                                wfGridService.runPostDigest(function(done){
                                    scope.scrollToRow();
                                    done();
                                });
                            }
                        }
                    }
                }
            }
        };
    }])

/**
 * Directive to include inline edit for the rows in the grid.
 */
    .directive('wfGridRowEdit', function($compile) {

        var editLink = '<a href ng-hide="inEditMode">Edit</a>';
        var cancelLink = '<a href ng-show="inEditMode">Cancel</a>';
        var saveLink = '<a href ng-show="inEditMode" style="margin-right: 2px;">Save</a>'

        return {
            restrict: 'C',
            replace: true,
            compile: function() {

                return {
                    pre: function($scope, $element) {
                        var tempRow = {};

                        $scope.inEditMode = false;

                        var editElement = angular.element(editLink);

                        editElement.bind('click', function() {
                            $scope.inEditMode = true;
                            angular.copy($scope.row, tempRow);
                            $scope.$apply();

                        });

                        var cancelElement = angular.element(cancelLink);

                        cancelElement.bind('click', function() {
                            $scope.inEditMode = false;
                            angular.copy(tempRow, $scope.row);
                            tempRow = {};
                            $scope.$apply();

                        });

                        var saveElement = angular.element(saveLink);

                        saveElement.bind('click', function() {
                            $scope.inEditMode = false;
                            tempRow = {};
                            $scope.$apply();

                        });

                        $element.append($compile(editElement)($scope));
                        $element.append($compile(saveElement)($scope));
                        $element.append($compile(cancelElement)($scope));

                    }
                }
            }
        }
    })
//This directive is same as wfGrid directive but uses a different template file
//Angular doesn't support an easy way to dynamically provide the templateurl.
    .directive('wfGridWithGroup', ['$compile', '$log', 'wfGridService', function($compile, $log, wfGridService) {
        return {
            restrict: 'E',
            scope: true,
            compile: function() {
                return {
                    pre: function($scope, $element, $attrs) {

                        $scope.options = angular.copy($scope.$eval($attrs.detail));
                        if ($scope.options.columnDefsString != null) {
                            $scope.options.columnDefs = $scope.$parent.$eval($scope.options.columnDefsString);
                            //console.log("columnDefs: " + $scope.options.columnDefs)
                            wfGridService.applyColumnSecurity($scope.namespace, $scope.options.columnDefs);
                        }

                        if($attrs.id){
                            $scope.options.widgetId = $attrs.id;
                        }
                        //Remove the id in wf-gris so that the id is present only in the html table element
                        $element.removeAttr("id");

                        $scope.style = $attrs.style;

						//Code for expand/collapse grid 
						if ($scope.options.enableTableExpandCollapse) {
							$scope.tableBodyExpanded = false;
							if ($scope.options.widgetId) {
								$scope.tableBodyExpanded = wfGridService.getExpandState($scope.options.widgetId);
								
							}
							$scope.expandCollapse = function() {
								$scope.tableBodyExpanded = !$scope.tableBodyExpanded;
								if ($scope.options.widgetId) {
									wfGridService.setExpandState($scope.options.widgetId, $scope.tableBodyExpanded);
								}
							}
						}
						
						//Code for expand/collapse header option
                        if ($scope.options.enableHeaderExpandCollapse) {
                            $scope.tableHeaderExpanded = false;
                            if ($scope.options.widgetId) {
                                $scope.tableHeaderExpanded = wfGridService.getExpandState($scope.options.widgetId);

                            }
                            $scope.expandCollapseHeader = function() {
                                $scope.tableHeaderExpanded = !$scope.tableHeaderExpanded;
                                if ($scope.options.widgetId) {
                                    wfGridService.setExpandState($scope.options.widgetId, $scope.tableHeaderExpanded);
                                }
                            }
                        }
						
                        $scope.loader = function() {
                            $scope.$eval($attrs.loader);
                        };

                        $scope.sortRowsInternally = function(field, order) {

                            var reverse = false;

                            if (!order) {
                                order = 'asc';
                            }

                            if (order == 'desc') {
                                reverse = true;
                            }

                            if (!$scope.options.enableGrouping) {
                                $scope.rows = []
                                $scope.rows.push($scope.$eval($scope.options.data + " | orderBy:'" + field + "':" + reverse));
                            } else {
                                $log.warn('sorting based on grouping is not implement yet')
                            }
                        };

                        $scope.defaultSortDisabled = function() {
                            return wfGridService.defaultSortDisabled($scope);
                        }

                        $scope.defaultSort = function() {
                            wfGridService.defaultSort($scope);
                        }

                        var updateGridRows = wfGridService.updateGridRows;

                        updateGridRows($scope, $log);

                        var unwatchData = $scope.$watchCollection($scope.options.data, function(newVal) {
                            if (newVal) {
                                updateGridRows($scope, $log);
                            }
                        });

                        var unwatchColumnDefsString = function(){};
                        if ($scope.options.columnDefsString != null) {
                        	unwatchColumnDefsString = $scope.$watch($scope.options.columnDefsString, function(newVal, oldVal) {
                                //console.log("coldef updated");
                                if (newVal) {
                                    if ($scope.options.columnDefsString != null) {
                                        $scope.options.columnDefs = newVal;
//                                        console.log("columnDefs: " + $scope.options.columnDefs)
                                        wfGridService.applyColumnSecurity($scope.namespace, $scope.options.columnDefs);
                                    }
                                    updateGridRows($scope, $log);
                                }

                            }, true);
                        }

                        $element.on("$destroy", function(){
                        	unwatchData();
                        	unwatchColumnDefsString();
                        });
                    }
                }
            },

            templateUrl: 'template/wfGridWithGroup.html'
        };
    }])
    .directive('wfChecklist', function() {
        return {
            restrict: 'E',
            replace: 'true',			
            scope: {
                list: '=',
                rowObj: '=',
                checked: '=',
                clickHandler: '&',
                id: '@',
                hide: '@',
                disable: '@'
            },
            template: '<input type="checkbox" id="{{id}}" value ="rowObj" ng-checked="checked" fd="{{hide}}" ng-disabled="{{disable}}">',
            link: function(scope, elem, attrs) {
                if (scope.list == undefined)
                    scope.list = [];
                var handler = function(setup) {
                    var checked = elem.prop('checked');
                    var index = scope.list.indexOf(scope.rowObj);

                    if (checked && index == -1) {
                        if (setup) elem.prop('checked', false);
                        else scope.list.push(scope.rowObj);
                    } else if (!checked && index != -1) {
                        if (setup) elem.prop('checked', true);
                        else scope.list.splice(index, 1);
                    }
                };

                var setupHandler = handler.bind(null, true);
                var changeHandler = handler.bind(null, false);

                elem.on('change', function() {
                    scope.$apply(changeHandler);
					if (attrs.clickHandler) {
						scope.$apply(scope.clickHandler());
					}
                });
                var unwatchList = scope.$watch('list', setupHandler, true);

                elem.on('$destroy', function(){
                	$(this).off();
                	unwatchList();
                });
            }
        };
    }).directive('wfBindHtmlUnsafe', function ($compile, $animate, wfGridService) {
        return function (scope, element, attr) {
            element.addClass('ng-binding').data('$binding', attr.wfBindHtmlUnsafe);
            scope.$watch(attr.wfBindHtmlUnsafe, function bindHtmlUnsafeWatchAction(value) {
                element.html(value || '');
                $compile(element.contents())(scope);
            });
            scope.$on('$destroy', function(){
                $animate.leave(wfGridService.getBlockElements(element));
             });
        };
    }).directive('wfRepeat', ['$parse', '$animate', function($parse, $animate) {
        var NG_REMOVED = '$$NG_REMOVED';
        var ngRepeatMinErr = Error('ngRepeat');
        var uid               = ['0', '0', '0'];
        function nextUid() {
            var index = uid.length;
            var digit;

            while(index) {
                index--;
                digit = uid[index].charCodeAt(0);
                if (digit == 57 /*'9'*/) {
                    uid[index] = 'A';
                    return uid.join('');
                }
                if (digit == 90  /*'Z'*/) {
                    uid[index] = '0';
                } else {
                    uid[index] = String.fromCharCode(digit + 1);
                    return uid.join('');
                }
            }
            uid.unshift('0');
            return uid.join('');
        };
        function hashKey(obj) {
            var objType = typeof obj,
                key;

            if (objType == 'object' && obj !== null) {
                if (typeof (key = obj.$$hashKey) == 'function') {
                    // must invoke on object to keep the right this
                    key = obj.$$hashKey();
                } else if (key === undefined) {
                    key = obj.$$hashKey = nextUid();
                }
            } else {
                key = obj;
            }

            return objType + ':' + key;
        };
        function getBlockElements(nodes) {
            var startNode = nodes[0],
                endNode = nodes[nodes.length - 1];
            if (startNode === endNode) {
                return $(startNode);
            }

            var element = startNode;
            var elements = [element];

            do {
                element = element.nextSibling;
                if (!element) break;
                elements.push(element);
            } while (element !== endNode);

            return $(elements);
        };
        function forEach(obj, iterator, context) {
            var key;
            if (obj) {
                if (angular.isFunction(obj)){
                    for (key in obj) {
                        // Need to check if hasOwnProperty exists,
                        // as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
                        if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
                            iterator.call(context, obj[key], key);
                        }
                    }
                } else if (obj.forEach && obj.forEach !== forEach) {
                    obj.forEach(iterator, context);
                } else if (angular.isArray(obj)) {
                    for (key = 0; key < obj.length; key++)
                        iterator.call(context, obj[key], key);
                } else {
                    for (key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            iterator.call(context, obj[key], key);
                        }
                    }
                }
            }
            return obj;
        };
        return {
            transclude: 'element',
            priority: 1000,
            terminal: true,
            $$tlb: true,
            link: function($scope, $element, $attr, ctrl, $transclude){
                var expression = $attr.wfRepeat;
                var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),
                    trackByExp, trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn,
                    lhs, rhs, valueIdentifier, keyIdentifier,
                    hashFnLocals = {$id: hashKey};

                if (!match) {
                    throw ngRepeatMinErr('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",
                        expression);
                }

                lhs = match[1];
                rhs = match[2];
                trackByExp = match[3];

                if (trackByExp) {
                    trackByExpGetter = $parse(trackByExp);
                    trackByIdExpFn = function(key, value, index) {
                        // assign key, value, and $index to the locals so that they can be used in hash functions
                        if (keyIdentifier) hashFnLocals[keyIdentifier] = key;
                        hashFnLocals[valueIdentifier] = value;
                        hashFnLocals.$index = index;
                        return trackByExpGetter($scope, hashFnLocals);
                    };
                } else {
                    trackByIdArrayFn = function(key, value) {
                        return hashKey(value);
                    };
                    trackByIdObjFn = function(key) {
                        return key;
                    };
                }

                match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);
                if (!match) {
                    throw ngRepeatMinErr('iidexp', "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.",
                        lhs);
                }
                valueIdentifier = match[3] || match[1];
                keyIdentifier = match[2];

                // Store a list of elements from previous run. This is a hash where key is the item from the
                // iterator, and the value is objects with following properties.
                //   - scope: bound scope
                //   - element: previous element.
                //   - index: position
                var lastBlockMap = {};

                $scope.$on('$destroy', function(){
                	for (var key in lastBlockMap) {
                        // lastBlockMap is our own object so we don't need to use special hasOwnPropertyFn
                        if (lastBlockMap.hasOwnProperty(key)) {
                            var block = lastBlockMap[key];
                            var elementsToRemove = getBlockElements(block.clone);
                            $animate.leave(elementsToRemove);
                            forEach(elementsToRemove, function(element) { element[NG_REMOVED] = true; });
                            block.scope.$destroy();
                            block.scope = {};
                            block.clone = {};
                        }
                    }
                });

                //watch props
                $scope.$watchCollection(rhs, function ngRepeatAction(collection){
                    var index, length,
                        previousNode = $element[0],     // current position of the node
                        nextNode,
                    // Same as lastBlockMap but it has the current state. It will become the
                    // lastBlockMap on the next iteration.
                        nextBlockMap = {},
                        arrayLength,
                        childScope,
                        key, value, // key/value of iteration
                        trackById,
                        trackByIdFn,
                        collectionKeys,
                        block,       // last object information {scope, element, id}
                        nextBlockOrder = [],
                        elementsToRemove;

                    if (angular.isArray(collection)) {
                        collectionKeys = collection;
                        trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
                    } else {
                        trackByIdFn = trackByIdExpFn || trackByIdObjFn;
                        // if object, extract keys, sort them and use to determine order of iteration over obj props
                        collectionKeys = [];
                        for (key in collection) {
                            if (collection.hasOwnProperty(key) && key.charAt(0) != '$') {
                                collectionKeys.push(key);
                            }
                        }
                        collectionKeys.sort();
                    }

                    arrayLength = collectionKeys.length;

                    // locate existing items
                    length = nextBlockOrder.length = collectionKeys.length;
                    for(index = 0; index < length; index++) {
                        key = (collection === collectionKeys) ? index : collectionKeys[index];
                        value = collection[key];
                        trackById = trackByIdFn(key, value, index);
                        //assertNotHasOwnProperty(trackById, '`track by` id');
                        if(lastBlockMap.hasOwnProperty(trackById)) {
                            block = lastBlockMap[trackById];
                            delete lastBlockMap[trackById];
                            nextBlockMap[trackById] = block;
                            nextBlockOrder[index] = block;
                        } else if (nextBlockMap.hasOwnProperty(trackById)) {
                            // restore lastBlockMap
                            forEach(nextBlockOrder, function(block) {
                                if (block && block.scope) lastBlockMap[block.id] = block;
                            });
                            // This is a duplicate and we need to throw an error
                            throw ngRepeatMinErr('dupes',
                                "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}",
                                expression, trackById, toJson(value));
                        } else {
                            // new never before seen block
                            nextBlockOrder[index] = { id: trackById };
                            nextBlockMap[trackById] = false;
                        }
                    }

                    // remove existing items
                    for (key in lastBlockMap) {
                        // lastBlockMap is our own object so we don't need to use special hasOwnPropertyFn
                        if (lastBlockMap.hasOwnProperty(key)) {
                            block = lastBlockMap[key];
                            elementsToRemove = getBlockElements(block.clone);
                            $animate.leave(elementsToRemove);
                            forEach(elementsToRemove, function(element) { element[NG_REMOVED] = true; });
                            block.scope.$destroy();
                            block.scope = {};
                            block.clone = {};
                        }
                    }

                    // we are not using forEach for perf reasons (trying to avoid #call)
                    for (index = 0, length = collectionKeys.length; index < length; index++) {
                        key = (collection === collectionKeys) ? index : collectionKeys[index];
                        value = collection[key];
                        block = nextBlockOrder[index];
                        if (nextBlockOrder[index - 1]) previousNode = getBlockEnd(nextBlockOrder[index - 1]);

                        if (block.scope) {
                            // if we have already seen this object, then we need to reuse the
                             // associated scope/element
                             childScope = block.scope;

                             nextNode = previousNode;
                             do {
                             nextNode = nextNode.nextSibling;
                             } while(nextNode && nextNode[NG_REMOVED]);

                             if (getBlockStart(block) != nextNode) {
                             // existing item which got moved
                             $animate.move(getBlockElements(block.clone), null, $(previousNode));
                             }
                             previousNode = getBlockEnd(block);
                            /*elementsToRemove = getBlockElements(block.clone);
                            $animate.leave(elementsToRemove);
                            forEach(elementsToRemove, function(element) { element[NG_REMOVED] = true; });
                            block.scope.$destroy();*/
                        } else {
                            // new item which we don't know about
                            childScope = $scope.$new();
                        }

                        childScope[valueIdentifier] = value;
                        if (keyIdentifier) childScope[keyIdentifier] = key;
                        childScope.$index = index;
                        childScope.$first = (index === 0);
                        childScope.$last = (index === (arrayLength - 1));
                        childScope.$middle = !(childScope.$first || childScope.$last);
                        // jshint bitwise: false
                        childScope.$odd = !(childScope.$even = (index&1) === 0);
                        // jshint bitwise: true

                        if (!block.scope) {
                            $transclude(childScope, function(clone) {
                                //clone[clone.length++] = document.createComment(' end ngRepeat: ' + expression + ' ');
                                $animate.enter(clone, null, $(previousNode));
                                previousNode = clone;
                                block.scope = childScope;

                                // Note: We only need the first/last node of the cloned nodes.
                                // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                                // by a directive with templateUrl when its template arrives.
                                block.clone = clone;
                                nextBlockMap[block.id] = block;
                            });
                        }
                    }

                    lastBlockMap = nextBlockMap;
                });
            }
        };

        function getBlockStart(block) {
            return block.clone[0];
        }

        function getBlockEnd(block) {
            return block.clone[block.clone.length - 1];
        }
    }])
    .run(["$templateCache", function($templateCache) {
        $templateCache.put("template/wfGrid.html",
            '<table ng-attr-style="{{style}}"><tr><td>' +
            '<div class = "wf-grid-table">' +
              '<div wf-if="options.enablePaging">' +
                '<wf-grid-paging></wf-grid-paging>' +
              '</div>' +
              '<a ng-if="options.enableDefaultSortButton && options.sortInfo" ng-disabled="defaultSortDisabled()" style="position: relative; top: -35px; margin-right: 2px;" class="pull-right" ng-click="defaultSort();" >Apply Default Sort</a>' +
              '<div ng-attr-style="{{style}}" class="wf-table">' +
                '<div class="table-header" ng-hide="options.hideHeader">' +
                    '<span wf-if="options.enableTableExpandCollapse">'+
                        '<a href=""  style="text-decoration:none; color:#ffffff;" ng-click="expandCollapse()" >' +
                            '<span ng-hide="tableBodyExpanded" class="icon-large default icon-expand"></span>' +
                            '<span ng-show="tableBodyExpanded" class="icon-large default icon-collapse"></span>' +
                        '</a>' +
                        '<span class="title" wf-bind-html-unsafe="options.title"></span>' +
                    '</span>'+
                    '<span  wf-if="!options.enableTableExpandCollapse" class="title" wf-bind-html-unsafe="options.title"></span>'+
                '</div>' +
                '<div class="wf-table-body" ng-style="innerStyle" ng-show="(tableBodyExpanded == null || tableBodyExpanded) && !options.hideGrid">' +
                  '<div>' +
                    '<table ng-class="options.gridStyle || \'wf-table-content table table-bordered table-hover table-condensed table-striped\'" id="{{options.widgetId}}">' +
                      '<thead ng-hide="options.hideColumnHeader">' +
                        '<tr class="wf-grid-header-group-row" wf-if="options.enableGrouping && options.groupInfo.displayName">' +
                          '<td wf-if="options.enableGrouping" class="wf-grid-header-group-col" >{{options.groupInfo.displayName}}</td>' +
                          '<td wf-repeat="colDef in options.columnDefs" wf-if="(!$last)||($last && options.enableEdit)" ></td>' +
                        '</tr>' +
                        '<tr class="wf-grid-header-row table-column-header">' +
                          '<th class="wf-grid-header-col" ng-hide="colDef.hide" ng-style="colDef.columnStyle" wf-repeat="colDef in options.columnDefs"></th>' +
                          '<td class="wf-grid-header-edit-Col" wf-if="options.enableEdit" ng-show="options.enableEdit"></td>' +
                        '</tr>' +
                      '</thead>' +
                      '<tbody class="wf-grid-rows" wf-repeat="groupRow in rows">' +
                        '<tr class="wf-grid-data-group-row" wf-if="options.enableGrouping" >' +
                          '<td class="wf-grid-data-group-col"  colspan="{{options.columnDefs.length}}">' +
                             '<a href="" style="text-decoration:none; color:black;" ng-init="isexpanded = true" ng-click="isexpanded = !isexpanded " >' +
                               '<span ng-hide="isexpanded" class="icon-large default icon-expand"></span>' +
                               '<span ng-show="isexpanded" class="icon-large default icon-collapse"></span>' +
                              '{{groupBy}}' +
                             '</a>' +
                             '<span wf-bind-html-unsafe="options.groupInfo.moreInfoCellTemplate"></span>' +
                          '</td>' +
                        '</tr>' +
                        '<tr class="wf-grid-data-row" ng-form name="rowForm{{$index}}" exclude-page-changed wf-repeat="row in datarows" ng-show="(isexpanded == null || isexpanded)" ng-class="options.rowClassFunction(row, rowIndex)">' +
                          '<td ng-hide="col.hide" ng-style="col.columnStyle" class="wf-grid-data-col" ng-class="(isexpanded && options.enableGrouping) && \'grouped\' || col.colClassFunction(row, rowIndex)|| col.columnClass || \'\' " wf-repeat="col in options.columnDefs">' +
                          '</td>' +
                          '<td class="wf-grid-row-edit wf-grid-data-edit-col" wf-if="options.enableEdit" ng-show="options.enableEdit"></td>' +
                        '</tr>' +
                        '<tr class="grid-combined-credit-summary-spacer-bottom" ng-show="options.enableSummary" wf-repeat="footer in options.footer">' +
                            '<td wf-repeat="f in footer" ng-class="f.columnClass"  ng-attr-style="{{f.columnStyle}}" colspan="{{f.colspan}}">{{f.text}}</td>' +
                        '</tr>' +
                      '</tbody>' +
                    '</table>' +
                  '</div>' +
                '</div>' +
                '<div class="table-footer" ng-show="(tableBodyExpanded == null || tableBodyExpanded) && options.showFooter">' +
                '</div> ' +
              '</div>' +
              '<div wf-if="options.enablePagingBottom">' +
                  '<wf-grid-paging></wf-grid-paging>' +
              '</div>' +
            '</div>' +
            '</td></tr></table>');

        $templateCache.put("template/wfScrollableGrid.html",
            '<table ng-attr-style="{{style}}"><tr><td>' +
                '<div class = "wf-grid-table">' +
                    '<div wf-if="options.enablePaging">' +
                        '<wf-grid-paging></wf-grid-paging>' +
                    '</div>' +
                    '<button ng-if="options.enableDefaultSortButton && options.sortInfo" ng-disabled="defaultSortDisabled()" style="position: relative; top: -35px; margin-right: 2px;" class="btn btn-primary pull-right" ng-click="defaultSort();" >Apply Default Sort</button>' +
                    '<div ng-attr-style="{{style}}" class="wf-table">' +
                        '<div class="table-header" ng-hide="options.hideHeader">' +
                            '<span class="title" wf-bind-html-unsafe="options.title"></span>' +
                        '</div>' +
                        '<div class="table-column-header-group" >' +
                            '<div class="wf-grid-column-header-group">' +
                                '<table style="width:100%">' +
                                    '<thead ng-hide="options.hideColumnHeader" >' +
                                    '<tr class="wf-grid-header-group-row" wf-if="options.enableGrouping">' +
                                        '<th wf-if="options.enableGrouping" class="wf-grid-header-group-col" >{{options.groupInfo.displayName}}</th>' +
                                        '<th wf-repeat="colDef in options.columnDefs" wf-if="(!$last)||($last && options.enableEdit)" ></th>' +
                                    '</tr>' +
                                    '<tr class="wf-grid-header-row table-column-header">' +
                                        '<th class="wf-grid-header-col table-column-header-cell" ng-hide="colDef.hide" ng-style="colDef.columnStyle" wf-repeat="colDef in options.columnDefs"></th>' +
                                        '<th class="wf-grid-header-edit-Col table-column-header-cell" wf-if="options.enableEdit" ng-show="options.enableEdit"></th>' +
                                    '</tr>' +
                                    '</thead>' +
                                '</table>' +
                            '</div>' +
                        '</div>' +
                       '<div class="wf-table-body" ng-style="innerStyle">' +
                            '<div>' +
                                '<table ng-class="options.gridStyle || \'wf-table-content table table-bordered table-hover table-condensed table-striped\'" id="{{options.widgetId}}">' +
                                    '<tbody class="wf-grid-rows" wf-repeat="groupRow in rows">' +
                                    '<tr class="wf-grid-data-group-row" wf-if="options.enableGrouping" >' +
                                        '<td class="wf-grid-data-group-col" >' +
                                            '<a href="" style="text-decoration:none; color:black" ng-init="isexpanded = $first ; " ng-click="isexpanded = !isexpanded " >' +
                                                '<span ng-hide="isexpanded" class="icon-large default icon-expand"></span>' +
                                                '<span ng-show="isexpanded" class="icon-large default icon-collapse"></span>' +
                                                '{{groupBy}}' +
                                            '</a>' +
                                        '</td>' +
                                        '<td style="border-left:1px inset gray;" wf-repeat="col in options.columnDefs" wf-if="(!$last)||($last && options.enableEdit)" >' +
                                        '</td>' +
                                    '</tr>' +
                                    '<tr class="wf-grid-data-row" wf-repeat="row in datarows" ng-show="(isexpanded == null || isexpanded)" ng-class="options.rowClassFunction(row, rowIndex)">' +
                                        '<td ng-hide="col.hide" ng-style="col.columnStyle" class="wf-grid-data-col" ng-class="(isexpanded && options.enableGrouping) && \'grouped\' || col.colClassFunction(row, rowIndex)|| col.columnClass || \'\' " wf-repeat="col in options.columnDefs">' +
                                        '</td>' +
                                        '<td class="wf-grid-row-edit wf-grid-data-edit-col" wf-if="options.enableEdit" ng-show="options.enableEdit"></td>' +
                                    '</tr>' +
                                    '<tr wf-scroll-footer class="grid-combined-credit-summary-spacer-bottom" ng-show="options.enableSummary" wf-repeat="footer in options.footer">' +
                                        '<td  wf-repeat="f in footer" ng-class="f.columnClass"  ng-style="f.columnStyle" colspan="{{f.colspan}}">{{f.text}}</td>' +
                                    '</tr>' +
                                    '</tbody>' +
                                '</table>' +
                            '</div>' +
                        '</div> ' +
                        '<div class="table-footer" ng-show="options.showFooter">' +
                        '</div>' +
                    '</div>' +
                    '<div wf-if="options.enablePagingBottom">' +
                        '<wf-grid-paging></wf-grid-paging>' +
                    '</div>' +
                '</div>' +
            '</td></tr></table>');


        $templateCache.put("template/wfGridPaging.html",
            '<div class="pagination-top-container">' +
                '<div class="pagination-display">Displaying <strong class="ng-binding">{{options.paging.startIndex}} to {{options.paging.endIndex}} of {{options.paging.totalRecords}}</strong></div>' +
                '<div class="pagination-small pagination" direction-links="true" boundary-links="false" total-items="totalItems" page="currentPage" previous-text="‹ Previous" next-text="Next ›">' +
                    '<ul>' +
                        '<li>' +
                            '<select ng-model="options.paging.selectedPageSize" ng-options="value for value in pageSizes" ng-change="perPageListBoxChange();"/>' +
                        '</li>' +
                        '<li ng-class="{active: page.active, disabled: previousDisabled}" ng-show="options.paging.showBoundaryLinks">' +
                            '<a href="" ng-click="selectPage(1)">&lsaquo;&lsaquo;First</a>' +
                        '</li>' +
                        '<li ng-class="{active: page.active, disabled: previousDisabled}">' +
                            '<a href="" ng-click="getPreviousPage()">&lsaquo; Previous</a>' +
                        '</li>' +
                        '<li ng-repeat="page in pages | limitTo: paginationSize" ng-class="{active: page.active, disabled: page.disabled}">' +
                            '<a href="" ng-click="selectPage(page.number);">{{page.number}}</a>' +
                        '</li>' +
                        '<li ng-class="{active: page.active, disabled: nextDisabled}">' +
                            '<a href="" ng-click="getNextPage()">Next &rsaquo;</a>' +
                        '</li>' +
                        '<li ng-class="{active: page.active, disabled: nextDisabled}" ng-show="options.paging.showBoundaryLinks">' +
                            '<a href="" ng-click="selectPage(pages.length)">Last&rsaquo;&rsaquo;</a>' +
                        '</li>' +
                    '</ul>' +
                '</div>' +
                '<div class="go-to-page"><span>Go to Page:</span>' +
                    '<form ng-submit="paginationForm.$valid && setPage(options.paging.currentPage)" name="paginationForm">' +
                        '<input type="text" class="form-control page-input" wf-max-number="{{options.paging.totalPages}}"  ng-model="options.paging.currentPage">' +
                    '</form>' +
                '</div>' +
            '</div>');


        $templateCache.put("template/wfGridWithGroup.html",
                '<div class = "wf-grid-table">' +
                  '<div wf-if="options.enablePaging">' +
                    '<wf-grid-paging></wf-grid-paging>' +
                  '</div>' +
                  '<button ng-if="options.enableDefaultSortButton && options.sortInfo" ng-disabled="defaultSortDisabled()" style="position: relative; top: -35px; margin-right: 2px;" class="btn btn-primary pull-right" ng-click="defaultSort();" >Apply Default Sort</button>' +
                    '<div ng-attr-style="{{style}}" class="wf-table">' +
                    '<div ng-class="options.headerStyle || \'table-header\'" ng-hide="options.hideHeader">' +
                        '<span wf-if="options.enableTableExpandCollapse">'+
                            '<a href=""  style="text-decoration:none; color:#ffffff;" ng-click="expandCollapse()" >' +
                                '<span ng-hide="tableBodyExpanded" class="icon-large default icon-expand"></span>' +
                                '<span ng-show="tableBodyExpanded" class="icon-large default icon-collapse"></span>' +
                            '</a>' +
                            '<span class="title" wf-bind-html-unsafe="options.title"></span>' +
                        '</span>'+
                        '<span wf-if="!options.enableTableExpandCollapse" class="title">{{options.title}}</span>' +
                    '</div>' +
                    '<div class="wf-table-body" ng-show="(tableBodyExpanded == null || tableBodyExpanded)">' +
                      '<div>' +
                        '<table class="wf-table-content table table-bordered table-hover table-condensed table-striped" id="{{options.widgetId}}">' +
                          '<thead ng-hide="options.hideColumnHeader">' +
                            '<tr class="wf-grid-header-row table-column-header">' +
                              '<th class="wf-grid-header-col" wf-repeat="colDef in options.columnDefs" ng-style="colDef.columnStyle"></th>' +
                              '<td class="wf-grid-header-edit-Col" wf-if="options.enableEdit" ng-show="options.enableEdit"></td>' +
                            '</tr>' +
                          '</thead>' +
                          '<tbody class="wf-grid-rows" wf-repeat="groupRow in rows" ng-show="(tableHeaderExpanded == null || tableHeaderExpanded)">' +
                            '<tr ng-init="groupIndex=$index" class="wf-grid-data-group-row" wf-if="options.enableGrouping && !groupRow.hideGroup">' +
                              '<td class="wf-grid-data-group-col" colspan="{{options.columnDefs.length}}">' +
                                  '{{groupBy}}' +
                              '</td>' +
                            '</tr>' +
							'<!-- Group header -->' +
                            '<tr style="background-color: #ffffff;" class="wf-grid-data-group-row" wf-if="options.enableGrouping" wf-repeat="header in groupRow.headers">' +
                              '<td class="wf-grid-data-group-col" wf-repeat="headercol in header" colSpan="{{headercol.colspan || 1}}" ng-class="headercol.class">' +
                                '<div wf-bind-html-unsafe="headercol.data"></div>' +
                              '</td>' +
                            '</tr>' +
                            '<tr class="wf-grid-data-row" wf-repeat="row in datarows">' +
                              '<td class="wf-grid-data-col" ng-style="col.columnStyle" rowspan = "{{col.rowSpan|| 1}}" ng-if="(col.rowSpan && (rowIndex%col.rowSpan)==0) || !col.rowSpan" ng-class="(options.enableGrouping) && \'grouped\' || \'\'" wf-repeat="col in options.columnDefs">   ' +
                              '</td>' +
                              '<td class="wf-grid-row-edit wf-grid-data-edit-col" wf-if="options.enableEdit" ng-show="options.enableEdit"></td>' +
                            '</tr>' +
                            '<!-- Group footer -->' +
                            '<tr style="background-color: #ffffff;" class="wf-grid-data-group-row" wf-if="options.enableGrouping" wf-repeat="footer in groupRow.footers">' +
                              '<td class="wf-grid-data-group-col" wf-repeat="footercol in footer" colSpan="{{footercol.colspan || 1}}">' +
                                '<div ng-class="footercol.class">{{footercol.data}}</div>' +
                              '</td>' +
                            '</tr>' +
                          '</tbody>' +
                        '</table>' +
                      '</div>' +
                    '</div>' +
                    '<div ng-class="options.footerStyle || \'wf-table-footer\'" ng-show="(tableBodyExpanded == null || tableBodyExpanded) && options.showFooter">' +
                    '</div> ' +
                  '</div>' +
                  '<div wf-if="options.enablePaging">' +
                      '<wf-grid-paging></wf-grid-paging>' +
                  '</div>' +
                '</div>');


    }])
;
