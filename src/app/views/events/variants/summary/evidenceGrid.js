(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceGrid', evidenceGrid)
    .controller('EvidenceGridController', EvidenceGridController);

  // @ngInject
  function evidenceGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        evidence: '=',
        variant: '='
      },
      templateUrl: 'app/views/events/variants/summary/evidenceGrid.tpl.html',
      controller: 'EvidenceGridController'
    };
    return directive;
  }

  // @ngInject
  function EvidenceGridController($scope, $stateParams, $state, $log, uiGridConstants, _) {
    /*jshint camelcase: false */
    var ctrl = $scope.ctrl = {};
    var statusFilters = ['accepted', 'submitted'];

    ctrl.showGridKey = false;

    ctrl.keyPopover = {
      templateUrl: 'app/views/events/variants/summary/evidenceGridPopoverKey.tpl.html',
      title: 'Evidence Grid Column Key'
    };

    ctrl.tooltipPopupDelay = 500;

    ctrl.evidenceLevels = {
      'A': 'A - Validated',
      'B': 'B - Clinical',
      'C': 'C - Preclinical',
      'D': 'D - Case Study',
      'E': 'E - Inferential'
    };

    ctrl.rowsToShow = 5;

    ctrl.evidenceGridOptions = {
      minRowsToShow: ctrl.rowsToShow - 1,

      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableVerticalScrollbar: uiGridConstants.scrollbars.ALWAYS,
      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      modifierKeysToMultiSelect: false,
      noUnselect: true,

      // grid menu
      enableGridMenu: true,
      gridMenuShowHideColumns: false,
      gridMenuCustomItems: [
        {
          title: 'Show Accepted',
          active: function() {
            return _.contains(statusFilters, 'accepted');
          },
          action: function($event) {
            filterByStatus('accepted', this.grid, $event);
          }
        },
        {
          title: 'Show Submitted',
          active: function() {
            return _.contains(statusFilters, 'submitted');
          },
          action: function($event) {
            filterByStatus('submitted', this.grid, $event);
          }
        },
        {
          title: 'Show Rejected',
          active: function() {
            return _.contains(statusFilters, 'rejected');
          },
          action: function($event) {
            filterByStatus('rejected', this.grid, $event);
          }
        }
      ],
      columnDefs: [
        {
          name: 'status',
          displayName: 'ST',
          type: 'string',
          visible: false,
          filter: {
            noTerm: true,
            condition: function(searchTerm, cellValue) {
              return _.contains(statusFilters, cellValue);
            }
          }
        },
        { name: 'id',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          displayName: 'EID',
          headerTooltip: 'Evidence ID',
          type: 'number',
          enableFiltering: false,
          allowCellFocus: false,
          minWidth: 50,
          width: '6%',
          cellTemplate: 'app/views/events/variants/summary/evidenceGridIdCell.tpl.html'
        },
        { name: 'description',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          displayName: 'DESC',
          headerTooltip: 'Description',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/summary/evidenceGridEvidenceCell.tpl.html'
        },
        { name: 'disease',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          displayName: 'DIS',
          headerTooltip: 'Disease',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/summary/evidenceGridDiseaseCell.tpl.html'
        },
        { name: 'drugs',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          displayName: 'DRUG',
          headerTooltip: 'Drug',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/summary/evidenceGridDrugCell.tpl.html'
        },
        //{ name: 'drug_interaction_type',
        //  displayName: 'DI',
        //  type: 'string',
        //  allowCellFocus: false,
        //  enableFiltering: false,
        //  width: '7%,
        //  filter: {
        //    condition: uiGridConstants.filter.CONTAINS
        //  },
        //  cellTemplate: 'app/views/events/variants/summary/evidenceGridDrugInteractionTypeCell.tpl.html'
        //},
        { name: 'evidence_level',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          displayName: 'EL',
          headerTooltip: 'Evidence Level',
          type: 'string',
          allowCellFocus: false,
          filter: {
            type: uiGridConstants.filter.SELECT,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              { value: null, label: '--' },
              { value: 'A', label: 'A - Validated'},
              { value: 'B', label: 'B - Clinical'},
              { value: 'C', label: 'C - Preclinical'},
              { value: 'D', label: 'D - Case Study'},
              { value: 'E', label: 'E - Inferential'}]
          },
          sort: { direction: uiGridConstants.ASC },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/variants/summary/evidenceGridLevelCell.tpl.html'
        },
        { name: 'evidence_type',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          displayName: 'ET',
          headerTooltip: 'Evidence Type',
          type: 'string',
          allowCellFocus: false,
          //enableFiltering: false,
          filter: {
            type: uiGridConstants.filter.SELECT,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              {
                value: null,
                label: '--'
              },
              {
                value: 'Predictive',
                label: 'Predictive'
              },
              {
                value: 'Diagnostic',
                label: 'Diagnostic'
              },
              {
                value: 'Prognostic',
                label: 'Prognostic'
              }
            ]
          },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/variants/summary/evidenceGridTypeCell.tpl.html'
        },
        { name: 'evidence_direction',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          displayName: 'ED',
          headerTooltip: 'Evidence Direction',
          type: 'string',
          allowCellFocus: false,
          filter: {
            type: uiGridConstants.filter.SELECT,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              { value: null, label: '--' },
              { value: 'Supports', label: 'Supports' },
              { value: 'Does not Support', label: 'Does not Support' }
            ]
          },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/variants/summary/evidenceDirectionCell.tpl.html'
        },
        { name: 'clinical_significance',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          displayName: 'CS',
          headerTooltip: 'Clinical Significance',
          type: 'string',
          allowCellFocus: false,
          filter: {
            type: uiGridConstants.filter.SELECT,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              { value: null, label: '--' },
              { value: 'Sensitivity', label: 'Sensitivity' },
              { value: 'Resistance or Non-Response', label: 'Resistance or Non-Response' },
              { value: 'Better Outcome', label: 'Better Outcome' },
              { value: 'Poor Outcome', label: 'Poor Outcome' },
              { value: 'Positive', label: 'Positive' },
              { value: 'Negative', label: 'Negative' },
            ]

          },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/variants/summary/evidenceGridClinicalSignificanceCell.tpl.html'
        },
        { name: 'variant_origin',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          displayName: 'VO',
          headerTooltip: 'Variant Origin',
          type: 'string',
          allowCellFocus: false,
          filter: {
            type: uiGridConstants.filter.SELECT,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              { value: null, label: '--' },
              { value: 'Somatic', label: 'Somatic'},
              { value: 'Germline', label: 'Germline' }
            ]
          },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/variants/summary/evidenceGridVariantOriginCell.tpl.html'
        },
        { name: 'rating',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          displayName: 'TR',
          headerTooltip: 'Trust Rating',
          type: 'number',
          allowCellFocus: false,
          filter: {
            type: uiGridConstants.filter.SELECT,
            condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              { value: null, label: '--' },
              { value: '5', label: '5 stars'},
              { value: '4', label: '4 stars'},
              { value: '3', label: '3 stars'},
              { value: '2', label: '2 stars'},
              { value: '1', label: '1 stars'},
            ]
          },
          sort: { direction: uiGridConstants.DESC },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/variants/summary/evidenceGridRatingCell.tpl.html'
          //cellTemplate: '<div>{{row.entity[col.field]}}</div>'
        }
      ]
    };

    function filterByStatus(status, grid, $event) {
      if(_.contains(statusFilters, status)) {
        _.pull(statusFilters, status);
      } else {
        statusFilters.push(status);
      }
      grid.refresh();
    }

    ctrl.evidenceGridOptions.onRegisterApi = function(gridApi){
      var evidence = $scope.evidence;
      ctrl.gridApi = gridApi;
      ctrl.evidenceGridOptions.minRowsToShow = evidence.length + 1;
      var suppressGo = false;

      // convert drug array into comma delimited list
      evidence = _.map(evidence, function(item){
        if (_.isArray(item.drugs)) {
          item.drugs = _.chain(item.drugs).pluck('name').value().join(', ');
          return item;
        } else {
          return item;
        }
      });
      ctrl.evidenceGridOptions.data = evidence;

      // if we're loading an evidence view, highlight the correct row in the table
      if(_.has($stateParams, 'evidenceId')) {
        var rowEntity = _.find(evidence, function(item) {
          return item.id === +$stateParams.evidenceId;
        });

        gridApi.core.on.rowsRendered($scope, function() {
          suppressGo = true;
          gridApi.selection.selectRow(rowEntity);
          gridApi.grid.scrollTo(rowEntity);
          suppressGo = false;
        });
      }

      gridApi.selection.on.rowSelectionChanged($scope, function(row){
        var params = _.merge($stateParams, { evidenceId: row.entity.id });

        if(!suppressGo) {
          $state.go('events.genes.summary.variants.summary.evidence.summary', params)
        }
      });
    };
  }

})();
