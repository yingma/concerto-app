/**
 * Data store the close to persistent data layer
 * Column array [{ColumnKey, Name, Width, Type}]
 * Rows Data {(RowKey, ColumnKey) -> Data }]
 * Group array [GroupKey, Group Name, [Rows]]
 * @providesModule FixedDataTableBufferedRows
 * @typechecks
 */

'use strict';

import { ColumnType } from './MainTableType';

class MainTableDataStore {

    // rows is array, rowkey -> {key value hashmap}
    // columnkey

    constructor() {
        this._size = 0;
        this._columns= [];
        this._rowData = {};
        this._groups = [];
    }
    
    createFakeObjectData() {
        // create columns
        this._columns.push({columnKey: '1', name:'Column 1', width: 100, type: ColumnType.EDITBOX});
        this._columns.push({columnKey: '2', name:'Column 2', width: 200, type: ColumnType.EDITBOX});
        this._columns.push({columnKey: '3', name:'Column 3', width: 200, type: ColumnType.EDITBOX});
        this._columns.push({columnKey: '4', name:'Column 4', width: 200, type: ColumnType.LABEL});
        this._columns.push({columnKey: '5', name:'Column 5', width: 200, type: ColumnType.EDITBOX});
        this._columns.push({columnKey: '6', name:'Column 6', width: 200, type: ColumnType.EDITBOX});

        // create groups 
        this._groups.push({groupKey: '1', name: 'group 1', rows:['1', '2', '3', '4']});
        this._groups.push({groupKey: '2', name: 'group 2', rows:['5', '6', '7', '8']});
        this._groups.push({groupKey: '3', name: 'group 3', rows:['9', '10']});

        // create row data
        this._rowData['1'] = {'1': 'row 1, column 1','2': 'row 1, column 1', '3': 'row 1, column 3', '4': 'row 1, column 4',
        '5': 'row 1, column 5', '6': 'row 1, column 6'};

        this._rowData['2'] = {'1': 'row 2, column 1','2': 'row 2, column 1', '3': 'row 2, column 3', '4': 'row 2, column 4',
        '5': 'row 2, column 5', '6': 'row 2, column 6'};
        
        this._rowData['3'] = {'1': 'row 3, column 1','2': 'row 3, column 1', '3': 'row 3, column 3', '4': 'row 3, column 4',
        '5': 'row 3, column 5', '6': 'row 3, column 6'};  

        this._rowData['4'] = {'1': 'row 4, column 1','2': 'row 4, column 1', '3': 'row 4, column 3', '4': 'row 4, column 4',
        '5': 'row 4, column 5', '6': 'row 4, column 6'}; 

        this._rowData['5'] = {'1': 'row 5, column 1','2': 'row 5, column 1', '3': 'row 5, column 3', '4': 'row 5, column 4',
        '5': 'row 5, column 5', '6': 'row 5, column 6'}; 

        this._rowData['6'] = {'1': 'row 6, column 1','2': 'row 6, column 1', '3': 'row 6, column 3', '4': 'row 6, column 4',
        '5': 'row 6, column 5', '6': 'row 6, column 6'}; 

        this._rowData['7'] = {'1': 'row 7, column 1','2': 'row 7, column 1', '3': 'row 7, column 3', '4': 'row 7, column 4',
        '5': 'row 7, column 5', '6': 'row 7, column 6'};

        this._rowData['8'] = {'1': 'row 8, column 1','2': 'row 8, column 1', '3': 'row 8, column 3', '4': 'row 8, column 4',
        '5': 'row 8, column 5', '6': 'row 8, column 6'};

        this._rowData['9'] = {'1': 'row 9, column 1','2': 'row 9, column 1', '3': 'row 9, column 3', '4': 'row 9, column 4',
        '5': 'row 9, column 5', '6': 'row 9, column 6'};

        this._rowData['10'] = {'1': 'row 10, column 1','2': 'row 10, column 1', '3': 'row 10, column 3', '4': 'row 10, column 4',
        '5': 'row 10, column 5', '6': 'row 10, column 6'};

        this._size = 10;
    }

    getObjectAt(rowKey) {
        return this._rowData[rowKey];
    }

    getGroups() {
        return this._groups;
    }

    getColumns() {
        return this._columns;
    }

}


export default MainTableDataStore;