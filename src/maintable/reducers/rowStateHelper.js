/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule columnStateHelper
 */

'use strict';

function reorderRow(state, reorderData) {
  let { left, top, rowIndex, height, rowKey, scrollLeft, scrollTop } = reorderData;
  return Object.assign({}, state, {
    isRowReordering: true,
    rowReorderingData: {
      cancelReorder: false,
      dragDistanceX: 0,
      dragDistanceY: 0, 
      left: left,
      top: top,
      oldScrollLeft: scrollLeft,
      oldScrollTop: scrollTop,
      oldRowIndex: rowIndex,
      rowKey: rowKey,
      height: height,
    }
  });
}

function reorderRowMove(state, reorderData) {

  let { deltaX, deltaY, newRowIndex } = reorderData;
  let { firstRowIndex, endRowIndex} = state;
  
  // NOTE (jordan) Need to clone this object when use pureRendering
  const reorderingData = Object.assign({}, state.rowReorderingData, {
    dragDistanceX: deltaX,
    dragDistanceY: deltaY,
    newRowIndex: newRowIndex,
  });

//   const rows = []; // state.rows
//   let i = 0;
//   for (let rowIdx = firstRowIndex; rowIdx < endRowIndex; rowIdx++) {
//     rows[i] = rowIdx;
//     i ++;
//   }

  return Object.assign({}, state, {
    rowReorderingData: reorderingData,
    // rows: rows,
  });
}

export default {
  reorderRow,
  reorderRowMove,
};
