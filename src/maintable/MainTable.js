// main table holder
// map => rowid => {rowkey, groupkey}
// rowid => [header, row, addrow, footer]

"use strict";

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { Table, Cell, Column } from './FixedDataTableRoot';
import { ColumnType,  RowType } from './MainTableType';
import { TextCell } from '../helpers/cells';
import { EditableCell } from '../helpers/EditableCell';


class DataListWrapper {
    constrcutor(indexMap, data) {
        this._indexMap = indexMap;
        this._data = data;
    }
    getSize() {
        return this._indexMap.length;
    }
    getObjectAt(index) {
        return this._data.getObjectAt(this._indexMap[index]);
    }
}

class MainTable extends React.Component {

    static propTypes = {
        dataset: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this._dataset = props.dataset;
        this._defaultSortIndexes = [];

        let groups = []; //{groupkey, startIndex} // group -> name, key, rows[rowkey]
        let rows = []; //{type, rowkey, groupKey}

        this.getRowHeight = this.getRowHeight.bind(this);
        this.getRowType = this.getRowType.bind(this);
        this.getRowKey = this.getRowKey.bind(this);
        this.getObjectAt = this.getObjectAt.bind(this);
        this.onRowReorderEndCallback = this.onColumnReorderEndCallback.bind(this);
        this.onColumnResizeEndCallback = this.onColumnResizeEndCallback.bind(this);

        var index = 0;
        for(let i = 0; i < this._dataset.getGroups().length; i ++) {
            let group = this._dataset.getGroups()[i];
            rows.push({rowType:RowType.HEADER, groupKey:group.groupKey, rowKey:''});
            this._defaultSortIndexes.push(index);
            let startIndex = index;
            index ++;
            for (let j = 0; j < group.rows.length; j ++) {
                rows.push({rowType:RowType.ROW, groupKey:group.groupKey, rowKey:group.rows[j]});
                this._defaultSortIndexes.push(index);
                index ++;
            }
            rows.push({rowType:RowType.ADDROW, groupKey:group.groupKey, rowKey:''});
            this._defaultSortIndexes.push(index);
            index ++;
            rows.push({rowType:RowType.FOOTER, groupKey:group.groupKey, rowKey:''});
            this._defaultSortIndexes.push(index);
            groups.push({rowType:group.key, startIndex:startIndex, endIndex:index});
            index ++;
        }

        this.state = {
            sortedRowList: rows,
            groups: groups,
            columns: this._dataset.getColumns(),
        };
    }

    getObjectAt(index) {
        if (index > this.state.sortedRowList.length - 1 && index < 0 ) {
            return null;
        }
        let rowkey = this.state.sortedRowList[index].rowKey;
        return rowkey ? this._dataset.getObjectAt(rowkey) : null;
    }

    getRowType(index) {
        if (index === undefined || index > this.state.sortedRowList.length - 1 || index < 0 ) {
            return null;
        }
        return this.state.sortedRowList[index].rowType;
    }

    getRowKey(index) {
        if (index > this.state.sortedRowList.length - 1 && index < 0 ) {
            return null;
        }
        return this.state.sortedRowList[index].rowKey;
    }

    getColumnWidth(columnKey) {
        let columns = this.state.columns;
        for (let index = 0; index < columns.length; index++) {
            const column = columns[index];
            if (column.columnKey === columnKey) {
                return column.width;
            }
        }
        return 80;
    }

    setColumnWidth(columnKey, width) {
        let columns = this.state.columns;
        for (let index = 0; index < columns.length; index++) {
            const column = columns[index];
            if (column.columnKey === columnKey) {
                column.width = width;
            }
        }
        this.setState({columns: columns})
    }

    getRowHeight(index) {
        let rowtype = this.getRowType(index);
        if (rowtype) {
            switch (rowtype) {
                case RowType.ADDROW: 
                    return 35;
                case RowType.HEADER:
                    return 40;
                case RowType.FOOTER:
                    return 140;
                case RowType.ROW:
                    return 40;
            }
        }
        return 40;
    }

    onColumnReorderEndCallback(event) {
        const {rowKey, oldRowIndex, newRowIndex} = event;
        let rows = this.state.sortedRowList;
        if (oldRowIndex !== newRowIndex) {            
            // move row
            let oldRow = rows[oldRowIndex];
            let newRow = rows[newRowIndex];

            if (oldRow.groupKey != newRow.groupKey) {
                //move group
            }

            if ( newRowIndex < oldRowIndex ) { // move backward
                let oldrow = rows[oldRowIndex];
                for (let row = oldRowIndex; row > newRowIndex; -- row ) {
                    rows[row] = rows[row-1]; 
                }
                rows[newRowIndex] = oldrow;
            } else {   // move forward
                let oldrow = rows[oldRowIndex];
                for (let row = oldRowIndex; row < newRowIndex; ++ row ) {
                    rows[row] = rows[row+1]; 
                }
                rows[newRowIndex] = oldrow;
            }
            this.setState({sortedRowList: rows});
        }

    }

    getColumnTemplate(columnKey) {
        let columns = this.state.columns;
        let rowTemplates = {};
        for (let i  = 0; i < columns.length; i ++) {
            let column = columns[i];
            if (columnKey === column.columnKey) {
                rowTemplates.width = column.width;
                if (column.type === ColumnType.LABEL) {
                    rowTemplates.columnKey = columnKey;
                    rowTemplates.header = <Cell>{column.name}</Cell>;
                    rowTemplates.cell = <TextCell data={this}/>;
                    rowTemplates.footer = <Cell>summary</Cell>;
                    rowTemplates.width = this.getColumnWidth(columnKey);
                    rowTemplates.minWidth = 70;
                    rowTemplates.isResizable = true;
                    return rowTemplates;   
                }
                if (column.type === ColumnType.EDITBOX) {
                    rowTemplates.columnKey = columnKey;
                    rowTemplates.header = <Cell>{column.name}</Cell>;
                    rowTemplates.cell = <EditableCell data={this}/>;
                    rowTemplates.footer = <Cell>summary</Cell>;
                    rowTemplates.width = this.getColumnWidth(columnKey);
                    rowTemplates.minWidth = 70;
                    rowTemplates.isResizable = true;
                    return rowTemplates;  
                }
            }
        }
        return null;
    }


    handleRef = component => {
        this.setState({ref: component});
    };

    onColumnResizeEndCallback(newColumnWidth, columnKey) {
        this.setColumnWidth(columnKey, newColumnWidth);
    }

    render() {
        const addColumnStyle = {
            boxShadow: 'none',
        };

        const fixedColumn = this.state.columns.length > 0 ? this.state.columns[0] : []; 
        const scrollColumns = this.state.columns.slice(1); 
        
        return (
            <Table
                ref={this.handleRef}
                headerHeight={40}
                rowHeight={40}
                isColumnResizing={false}
                addRowHeight={35}
                footerHeight={40}
                rowsCount={this.state.sortedRowList.length}
                rowHeightGetter={this.getRowHeight}
                rowTypeGetter={this.getRowType}
                rowKeyGetter={this.getRowKey}
                onColumnResizeEndCallback={this.onColumnResizeEndCallback}
                height={400}
                width={800}
                {...this.props}>
                {fixedColumn && <Column {...this.getColumnTemplate(fixedColumn.columnKey)} fixed={true} />}
                {scrollColumns.map(column => (
                    <Column {...this.getColumnTemplate(column.columnKey)} fixed={false} />
                ))}              
                <Column
                    columnKey="addnew"
                    header={<Button basic circular icon='plus circle' style={addColumnStyle} />}
                    width={40}
                />
            </Table>        
        );
    }
}

export default MainTable;