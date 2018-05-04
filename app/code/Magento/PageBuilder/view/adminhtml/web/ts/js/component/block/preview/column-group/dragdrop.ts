/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import Column from "../../../../content-type/column/preview";
import ColumnGroup from "../../column-group";
import {getAcceptedColumnWidth, getColumnWidth, getSmallestColumnWidth} from "./resizing";

/**
 * Calculate the drop positions of a column group
 *
 * @param {ColumnGroup} group
 * @returns {any[]}
 */
export function calculateDropPositions(group: ColumnGroup): DropPosition[] {
    const dropPositions: any[] = [];
    group.children().forEach((column: Column, index: number) => {
        const left = column.element.position().left;
        const width = column.element.outerWidth(true);
        const canShrink = getAcceptedColumnWidth(getColumnWidth(column).toString()) > getSmallestColumnWidth();
        dropPositions.push(
            {
                affectedColumn: column,
                canShrink,
                insertIndex: index,
                left,
                placement: "left",
                right: left + (width / 2),
            },
            {
                affectedColumn: column,
                canShrink,
                insertIndex: index + 1,
                left: left + (width / 2),
                placement: "right",
                right: left + width,
            },
        );
    });
    return dropPositions;
}

export interface DropPosition {
    left: number;
    right: number;
    insertIndex: number;
    placement: string;
    affectedColumn: Column;
    canShrink: boolean;
}
