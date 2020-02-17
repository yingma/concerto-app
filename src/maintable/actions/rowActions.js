/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * @providesModule columnActions
 */

'use strict';

import {
  ROW_REORDER_START,
  ROW_REORDER_END,
  ROW_REORDER_MOVE,
} from './ActionTypes';

/**
 * Initiates row reordering
 *
 * @param {{scrollStart: number, rowId: number, newRowId: number with: x: number, y:number}} reorderData
 */
export const startRowReorder = (reorderData) => ({
  type: ROW_REORDER_START,
  reorderData,
});

/**
 * Stops row reordering
 */
export const stopRowReorder = () => ({
  type: ROW_REORDER_END,
});

/**
 * Stops row reordering
 *
 * @param {{number} deltaX, {number} deltaY}
 */
export const moveRowReorder = (reorderData) => ({
  type: ROW_REORDER_MOVE,
  reorderData
});


