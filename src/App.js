  /**
   * Copyright Schrodinger, LLC
   */

  "use strict";

  import FakeObjectDataListStore from './helpers/FakeObjectDataListStore';
  import { DateCell, LinkCell, TextCell } from './helpers/cells';
  import { EditableCell } from './helpers/EditableCell';
  import { Table, Column, Cell } from './maintable/FixedDataTableRoot';
  import React from 'react';
  import { Button } from 'semantic-ui-react';

  // wrapper over a DataList that allows you to specify custom index mapping
  class DataListWrapper {
    constructor(indexMap, data) {
      this._indexMap = indexMap;
      this._data = data;
    }

    getSize() {
      return this._indexMap.length;
    }

    getObjectAt(index) {
      return this._data.getObjectAt(
        this._indexMap[index]
      );
    }
    setObjectAt(index, column, value) {
        //this._data.setObjectAt(this._indexMap[index], column, value);
    }
  }

  class App extends React.Component {
    constructor(props) {
      super(props);

      const dataList = new FakeObjectDataListStore(1000000);
      const fixedRowsCount = 3;
      const topIndexMap = [];
      const bottomIndexMap = [];
      const middleIndexMap = [];

      let i = 0;
      while (i < fixedRowsCount) {
        topIndexMap.push(++i);
      }
      while (i < dataList.size - fixedRowsCount) {
        middleIndexMap.push(++i);
      }
      while (i < dataList.size) {
        bottomIndexMap.push(++i);
      }

      this.state = {
        headerDataList: new DataListWrapper([], dataList),
        topDataList: new DataListWrapper(topIndexMap, dataList),
        middleDataList: new DataListWrapper(middleIndexMap, dataList),
        bottomDataList: new DataListWrapper(bottomIndexMap, dataList),
        scrollLeft: 0,
      };
    }

    render() {
      const {
        topDataList,
        bottomDataList,
        scrollLeft,
      } = this.state;

      const headerHeight = 40;
      const addRowHeight = 35;
      const footerHeight = 40;
      const topTableHeight = topDataList.getSize() * 40  + headerHeight + addRowHeight + footerHeight;
      const bottomTableHeight = bottomDataList.getSize() * 40 + headerHeight + addRowHeight + footerHeight + 15;
      return (
        <div>
          {this.renderTable('group1', topDataList, {
            height: topTableHeight,
            showScrollbarY: false,
            showScrollbarX: false,
            headerHeight,
            addRowHeight,
            footerHeight,
            scrollLeft,
          })}
          {this.renderTable('group3', bottomDataList, {
            height: bottomTableHeight,
            showScrollbarY: false,
            headerHeight,
            addRowHeight,
            footerHeight,
            onHorizontalScroll: this.onHorizontalScroll,
            scrollLeft,
          })}
        </div>
      );
    }

    renderTable(group, dataList, additionalProps={}) {
      const addColumnStyle = {
        boxShadow: 'none',
      };

      const divStyle = {
        height: '100px',
      };

      return (
        <div>
        <Table
          ref={this.handleRef}
          rowHeight={40}
          rowsCount={dataList.getSize()}
          width={800}
          {...this.props}
          {...additionalProps}
        >
          <Column
            columnKey="id"
            header={<EditableCell value={group} />}
            cell={<TextCell data={dataList} />}
            footer={<Cell>summary<br/><br/></Cell>}
            fixed={true}
            width={100}
          />
          <Column
            columnKey="firstName"
            header={<Cell>First Name</Cell>}
            cell={<LinkCell data={dataList} />}
            width={100}
          />
          <Column
            columnKey="lastName"
            header={<Cell>Last Name</Cell>}
            cell={<EditableCell data={dataList}/>}
            width={100}
          />
          <Column
            columnKey="city"
            header={<Cell>City</Cell>}
            cell={<TextCell data={dataList} />}
            width={250}
          />
          <Column
            columnKey="street"
            header={<Cell>Street</Cell>}
            cell={<TextCell data={dataList} />}
            width={250}
          />
          <Column
            columnKey="zipCode"
            header={<Cell>Zip Code</Cell>}
            cell={<TextCell data={dataList} />}
            width={100}
          />
          <Column
            columnKey="email"
            header={<Cell>Email</Cell>}
            cell={<LinkCell data={dataList} />}
            width={400}
          />
          <Column
            columnKey="date"
            header={<Cell>DOB</Cell>}
            cell={<DateCell data={dataList} />}
            width={200}
          />
          <Column
            columnKey="catchPhrase"
            header={<Cell>Catch Phrase</Cell>}
            cell={<TextCell data={dataList} />}
            width={200}
          />
          <Column
            columnKey="companyName"
            header={<Cell>Company Name</Cell>}
            cell={<TextCell data={dataList} />}
            width={200}
          />
          <Column
            columnKey="words"
            header={<Cell>Words</Cell>}
            cell={<TextCell data={dataList} />}
            width={200}
          />
          <Column
            columnKey="addnew"
            header={<Button basic circular icon='plus circle' style={addColumnStyle} />}
            width={40}
          />
        </Table>
        <div style={divStyle} />
        </div>
      );
    }

    onHorizontalScroll = (scrollLeft) => {
      this.setState({ scrollLeft });
      return false;
    }
  }

  export default App;