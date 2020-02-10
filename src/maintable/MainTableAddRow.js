'use strict';

import PropTypes from 'prop-types';
import React from 'react';
import { Input } from 'semantic-ui-react';

import cx from './vendor_upstream/stubs/cx';
import { sumPropWidths } from './helper/widthHelper';
import Scrollbar from './Scrollbar';
import FixedDataTableTranslateDOMPosition from './FixedDataTableTranslateDOMPosition';

import './css/layout/fixedDataTableRowLayout.css';
import './css/style/fixedDataTableRow.css';
import './css/style/fixedDataTable.css';


/**
 * Component that renders the row for <FixedDataTable />.
 * This component should not be used directly by developer. Instead,
 * only <FixedDataTable /> should use the component internally.
 */


class MainTableAddRow extends React.Component {

  static propTypes = {

    className: PropTypes.string,
    /**
     * Array of data for the fixed columns.
     */
    fixedColumns: PropTypes.array.isRequired,

    /**
     * Height of the row.
     */
    height: PropTypes.number.isRequired,

    /**
     * The vertical position where the row should render itself
     */
    offsetTop: PropTypes.number.isRequired,

    /**
     * Height of fixedDataTableCellGroupLayout/cellGroupWrapper.
     */
    cellGroupWrapperHeight: PropTypes.number,

    /**
     * Array of data for the scrollable columns.
     */
    scrollableColumns: PropTypes.array.isRequired,

    /**
     * Array of <FixedDataTableColumn /> for the fixed columns positioned at end of the table.
     */
    fixedRightColumns: PropTypes.array.isRequired,

    /**
     * The distance between the left edge of the table and the leftmost portion
     * of the row currently visible in the table.
     */
    scrollLeft: PropTypes.number.isRequired,

    /**
     * Width of the row.
     */
    width: PropTypes.number.isRequired,

    /**
     * End edit callback
     */
    onNewRowAdd: PropTypes.func,

    /**
     * The value of the aria-rowindex attribute.
     */
    ariaRowIndex: PropTypes.number,

    /**
     * Whether the grid should be in RTL mode
     */
    isRTL: PropTypes.bool,

    /**
     * DOM attributes to be applied to the row.
     */
    attributes: PropTypes.object,
  };

  componentWillMount() {
    this._initialRender = true;
  }

  componentDidMount() {
    this._initialRender = false;
  }

  render() /*object*/ {
    const className = cx({
      'fixedDataTableRowLayout/main': true
    });

    const fixedColumnsWidth = sumPropWidths(this.props.fixedColumns);
    var scrollableColumnsWidth = sumPropWidths(this.props.scrollableColumns);
    const fixedRightColumnsWidth = sumPropWidths(this.props.fixedRightColumns);

    const len = this.props.scrollableColumns.length;

    if (len > 0 
      && !this.props.scrollableColumns[len - 1].template) {
        scrollableColumnsWidth = scrollableColumnsWidth - this.props.scrollableColumns[len - 1].props.width;
    }

    const width = fixedColumnsWidth + scrollableColumnsWidth + fixedRightColumnsWidth - this.props.scrollLeft;
    var inputStyle = {
      width: width,
      height: this.props.height,
      borderRadius: '0px',
    }

    var style = {
      height: this.props.height,
      zIndex: (this.props.zIndex ? this.props.zIndex : 0),
      display: (this.props.visible ? 'block' : 'none'),
    };
    FixedDataTableTranslateDOMPosition(style, 0, this.props.offsetTop, this._initialRender, this.props.isRTL);

    const { offsetTop, zIndex, visible, ...rowProps } = this.props;

    var scrollbarOffset = this.props.showScrollbarY ? Scrollbar.SIZE : 0;
    
    let scrollbarSpacer = null;
    if (this.props.showScrollbarY) {
      var spacerStyles = {
        width: scrollbarOffset,
        height: this.props.height,
        // Since the box-sizing = border-box the border on the table is included in the width
        // so we need to account for the left and right border
        left: this.props.width - scrollbarOffset - 2,
      };
      scrollbarSpacer =
        <div 
          style={spacerStyles} 
          className={cx('public/fixedDataTable/scrollbarSpacer')}
        />;
    }

    return <div style={style} className={className} >
            <Input style={inputStyle} action='Add' placeholder='+ Add' />
            {scrollbarSpacer}
           </div>;
  }
}

export default MainTableAddRow;