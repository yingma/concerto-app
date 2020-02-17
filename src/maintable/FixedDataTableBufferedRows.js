/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableBufferedRows
 * @typechecks
 */
import FixedDataTableRow from './FixedDataTableRow';
import PropTypes from 'prop-types';
import React from 'react';
import cx from './vendor_upstream/stubs/cx';
import emptyFunction from './vendor_upstream/core/emptyFunction';
import joinClasses from './vendor_upstream/core/joinClasses';
import inRange from 'lodash/inRange';
import MainTableAddRow from './MainTableAddRow';
import { RowType } from './MainTableType';
//import FixedDataTableTranslateDOMPosition from './FixedDataTableTranslateDOMPosition';

import './css/layout/fixedDataTableLayout.css';
import './css/style/fixedDataTable.css';


class FixedDataTableBufferedRows extends React.Component {
  static propTypes = {
    ariaRowIndexOffset: PropTypes.number,
    ariaGroupHeaderIndex: PropTypes.number,
    ariaHeaderIndex: PropTypes.number,
    ariaFooterIndex: PropTypes.number,
    isScrolling: PropTypes.bool,
    firstViewportRowIndex: PropTypes.number.isRequired,
    endViewportRowIndex: PropTypes.number.isRequired,
    fixedColumns: PropTypes.object.isRequired,
    fixedRightColumns: PropTypes.object.isRequired,
    height: PropTypes.number.isRequired,
    onRowClick: PropTypes.func,
    onRowContextMenu: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    onRowMouseDown: PropTypes.func,
    onRowMouseUp: PropTypes.func,
    onRowMouseEnter: PropTypes.func,
    onRowMouseLeave: PropTypes.func,
    onRowTouchStart: PropTypes.func,
    onRowTouchEnd: PropTypes.func,
    onRowTouchMove: PropTypes.func,
    rowClassNameGetter: PropTypes.func,
    rowExpanded: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
    ]),
    rowOffsets: PropTypes.object.isRequired,
    rowKeyGetter: PropTypes.func,
    rowSettings: PropTypes.shape({
      rowAttributesGetter: PropTypes.func,
      rowHeightGetter: PropTypes.func,
      rowsCount: PropTypes.number.isRequired,
      subRowHeightGetter: PropTypes.func,
    }),
    rowsToRender: PropTypes.array.isRequired,
    scrollLeft: PropTypes.number.isRequired,
    scrollTop: PropTypes.number.isRequired,
    scrollableColumns: PropTypes.object.isRequired,
    showLastRowBorder: PropTypes.bool,
    showScrollbarY: PropTypes.bool,
    width: PropTypes.number.isRequired,
    isRTL: PropTypes.bool,
  }

  componentWillMount() {
    this._staticRowArray = [];
    this._initialRender = true;
  }

  componentDidMount() {
    this._initialRender = false;
  }

  shouldComponentUpdate() /*boolean*/ {
    // Don't add PureRenderMixin to this component please.
    return true;
  }

  componentWillUnmount() {
    this._staticRowArray.length = 0;
  }

  render() /*object*/ {
    let { scrollTop, isScrolling, rowsToRender } = this.props;
    let baseOffsetTop =  - scrollTop;
    rowsToRender = rowsToRender || [];

    if (isScrolling) {
      // allow static array to grow while scrolling
      this._staticRowArray.length = Math.max(this._staticRowArray.length, rowsToRender.length);
    } else {
      // when scrolling is done, static array can shrink to fit the buffer
      this._staticRowArray.length = rowsToRender.length;
    }

    // render each row from the buffer into the static row array
    for (let i = 0; i < this._staticRowArray.length; i++) {
      let rowIndex = rowsToRender[i];
      // if the row doesn't exist in the buffer set, then take the previous one
      if (rowIndex === undefined) {
        rowIndex = this._staticRowArray[i] && this._staticRowArray[i].props.index;
      }

      this._staticRowArray[i] = this.renderRow({
        rowIndex,
        key: i,
        baseOffsetTop
      });
    }

  

    return <div>{this._staticRowArray}</div>;
  }

  /**
   * type header, footer, row 
   */

  /**
   * @param {number} rowIndex
   * @param {number} key
   * @param {number} baseOffsetTop
   * @return {!Object}
   */
  renderRow({ rowIndex, key, baseOffsetTop }) /*object*/ {

    const props = this.props;

    const {
      ariaHeaderIndex,
      ariaFooterIndex,
      ariaAddRowIndex,
      //componentHeight,
      elementHeights,
      isRowReordering,
      rowReorderingData,
      columnReorderingData,
      //columnResizingData,
      isColumnReordering,
      //isColumnResizing,
      onColumnReorder,
      onColumnReorderMove,
      onColumnReorderEnd,
      onColumnResize,
      //onColumnResizeEnd,
      touchScrollEnabled,
      fixedColumns,
      fixedRightColumns,
      scrollableColumns,
      scrollEnabledY,
    } = props;

    const { footerHeight,  headerHeight, addRowHeight } = elementHeights;

    const rowClassNameGetter = props.rowClassNameGetter || emptyFunction;
    const fake = rowIndex === undefined;
    let rowProps = {};

    // row data
    const type = props.rowSettings.rowTypeGetter(rowIndex); // header or footer or addrow or row or header group
    
    if (!type) {
      return;
    }
    // if row exists, then calculate row specific props
    if (!fake) {
      rowProps.height = props.rowSettings.rowHeightGetter(rowIndex);
      rowProps.subRowHeight = props.rowSettings.subRowHeightGetter(rowIndex);
      rowProps.offsetTop = Math.round(baseOffsetTop + props.rowOffsets[rowIndex]);
      rowProps.rowKey = props.rowKeyGetter ? props.rowKeyGetter(rowIndex) : key;
      rowProps.attributes = props.rowSettings.rowAttributesGetter && props.rowSettings.rowAttributesGetter(rowIndex);

      const hasBottomBorder = (type === RowType.FOOTER);
      rowProps.className = joinClasses(
        rowClassNameGetter(rowIndex),
        cx('public/fixedDataTable/bodyRow'),
        cx({
          'fixedDataTableLayout/hasBottomBorder': hasBottomBorder,
          'public/fixedDataTable/hasBottomBorder': hasBottomBorder,
        })
      );
    }

    const visible = inRange(rowIndex, props.firstViewportRowIndex, props.endViewportRowIndex) 
                    || (isRowReordering && rowReorderingData.rowKey === rowProps.rowKey);


    let row;
    if (rowProps.height > 0) {
      switch(type) {
          case RowType.HEADER:
            row = 
              <FixedDataTableRow
                key={key}
                index={rowIndex}
                ariaRowIndex={ariaHeaderIndex}
                isHeaderOrFooter={true}
                isScrolling={props.isScrolling}
                isRowReordering={props.isRowReordering}
                rowReorderingData={props.rowReorderingData}
                className={joinClasses(
                  cx('fixedDataTableLayout/header'),
                  cx('public/fixedDataTable/header'),
                )}
                width={props.width}
                height={headerHeight}
                offsetTop={rowProps.offsetTop}
                scrollLeft={Math.round(props.scrollLeft)}
                visible={visible}
                fixedColumns={fixedColumns.header}
                fixedRightColumns={fixedRightColumns.header}
                scrollableColumns={scrollableColumns.header}
                touchEnabled={touchScrollEnabled}
                onColumnResize={onColumnResize}
                onColumnReorder={onColumnReorder}
                onColumnReorderMove={onColumnReorderMove}
                onColumnReorderEnd={onColumnReorderEnd}
                isColumnReordering={!!isColumnReordering}
                columnReorderingData={columnReorderingData}
                showScrollbarY={scrollEnabledY}
                container={props.container}
                isRTL={props.isRTL}>
                </FixedDataTableRow>
            break;
          case RowType.ADDROW:
            row = 
              <MainTableAddRow
                key={key}
                index={rowIndex}
                zIndex={1}
                ariaRowIndex={ariaAddRowIndex}
                isScrolling={props.isScrolling}
                isRowReordering={props.isRowReordering}
                rowReorderingData={props.rowReorderingData}
                height={addRowHeight}
                width={props.width}
                offsetTop={rowProps.offsetTop}
                scrollLeft={Math.round(props.scrollLeft)}
                fixedColumns={fixedColumns.cell}
                fixedRightColumns={fixedRightColumns.cell}
                scrollableColumns={scrollableColumns.cell}
                showScrollbarY={scrollEnabledY}
                isRTL={props.isRTL}
                container={props.container}
                visible={visible} 
              />;
          break;
        
          case RowType.FOOTER:
            row =
              <FixedDataTableRow
                key={key}
                index={rowIndex}
                zIndex={0}
                ariaRowIndex={ariaFooterIndex}
                isHeaderOrFooter={true}
                isScrolling={props.isScrolling}
                isRowReordering={props.isRowReordering}
                rowReorderingData={props.rowReorderingData}
                className={joinClasses(
                  cx('fixedDataTableLayout/footer'),
                  cx('public/fixedDataTable/footer'),
                )}
                width={props.width}
                height={footerHeight}
                offsetTop={rowProps.offsetTop}
                visible={visible}
                fixedColumns={fixedColumns.footer}
                fixedRightColumns={fixedRightColumns.footer}
                scrollableColumns={scrollableColumns.footer}
                scrollLeft={Math.round(props.scrollLeft)}
                showScrollbarY={scrollEnabledY}
                container={props.container}
                isRTL={props.isRTL}
              />;
          break;

        default:
          row = 
            <FixedDataTableRow
                index={rowIndex}
                key={key}
                isHeaderOrFooter={false}
                zIndex={2}
                ariaRowIndex={rowIndex + props.ariaRowIndexOffset}
                isScrolling={props.isScrolling}
                width={props.width}
                rowExpanded={props.rowExpanded}
                scrollLeft={Math.round(props.scrollLeft)}
                scrollTop={Math.round(props.scrollTop)}
                fixedColumns={props.fixedColumns.cell}
                fixedRightColumns={props.fixedRightColumns.cell}
                scrollableColumns={props.scrollableColumns.cell}
                onClick={props.onRowClick}
                isRowReordering={props.isRowReordering}
                rowReorderingData={props.rowReorderingData}
                onContextMenu={props.onRowContextMenu}
                onDoubleClick={props.onRowDoubleClick}
                onMouseDown={props.onRowMouseDown}
                onMouseUp={props.onRowMouseUp}
                onMouseEnter={props.onRowMouseEnter}
                onMouseLeave={props.onRowMouseLeave}
                onTouchStart={props.onRowTouchStart}
                onTouchEnd={props.onRowTouchEnd}
                onTouchMove={props.onRowTouchMove}
                showScrollbarY={props.showScrollbarY}
                isRTL={props.isRTL}
                visible={visible}
                fake={fake}
                container={props.container}
                {...rowProps} 
              />
        }
    }

    return (
        row
    );
  }
}
export default FixedDataTableBufferedRows;
