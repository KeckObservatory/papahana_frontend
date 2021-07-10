
import {Layout} from 'react-grid-layout'

export type CompactType = 'horizontal' | 'vertical'
  /**
 * Get layout items sorted from top left to right and down.
 *
 * @return {Array} Array of layout objects.
 * @return {Array}        Layout, sorted static items first.
 */
export function sortLayoutItems(
    layout: Array<Layout>,
    compactType: CompactType
  ): Array<Layout> {
    if (compactType === "horizontal") return sortLayoutItemsByColRow(layout);
    if (compactType === "vertical") return sortLayoutItemsByRowCol(layout);
    else return layout;
  }
  
  /**
   * Sort layout items by row ascending and column ascending.
   *
   * Does not modify Layout.
   */
  export function sortLayoutItemsByRowCol(layout: Array<Layout>): Array<Layout> {
    // Slice to clone array as sort modifies
    return layout.slice(0).sort(function (a, b) {
      if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
        return 1;
      } else if (a.y === b.y && a.x === b.x) {
        // Without this, we can get different sort results in IE vs. Chrome/FF
        return 0;
      }
      return -1;
    });
  }
  
  /**
   * Sort layout items by column ascending then row ascending.
   *
   * Does not modify Layout.
   */
  export function sortLayoutItemsByColRow(layout: Array<Layout>): Array<Layout> {
    return layout.slice(0).sort(function (a, b) {
      if (a.x > b.x || (a.x === b.x && a.y > b.y)) {
        return 1;
      }
      return -1;
    });
  }

export function collides(l1: Layout, l2: Layout): boolean {
    if (l1.i === l2.i) return false; // same element
    if (l1.x + l1.w <= l2.x) return false; // l1 is left of l2
    if (l1.x >= l2.x + l2.w) return false; // l1 is right of l2
    if (l1.y + l1.h <= l2.y) return false; // l1 is above l2
    if (l1.y >= l2.y + l2.h) return false; // l1 is below l2
    return true; // boxes overlap
  }

  export function getLayoutItem(layout: Array<Layout>, id: string): Layout {
      let item = {} as Layout
    for (let i = 0, len = layout.length; i < len; i++) {
      if (layout[i].i === id) item= layout[i];
    }
    return item
  }

  
/**
 * Before moving item down, it will check if the movement will cause collisions and move those items down before.
 */
export function resolveCollision( layout: Layout[], item: Layout, newDim: number, moveToCoord: number, axis: "x" | "y"): Layout[] {
  const heightWidth = { x: "w", y: "h" };
  const sizeProp = heightWidth[axis] as "w" | "h";
  let newLayout = [...layout]
  item[sizeProp] = newDim;
  const itemIndex = layout
    .map( (layoutItem: Layout) => {
      return layoutItem.i;
    })
    .indexOf(item.i);

  // Go through each item we collide with.
  for (let i = itemIndex + 1; i < layout.length; i++) {
    const otherItem = layout[i];
    // Ignore static items
    if (otherItem.static) continue;

    // Optimization: we can break early if we know we're past this el
    // We can do this b/c it's a sorted layout
    if (otherItem.y > item.y + item.h) break;

    if (collides(item, otherItem)) {
        newLayout = resolveCollision(
        newLayout,
        otherItem,
        otherItem[axis],
        moveToCoord + item[sizeProp],
        axis
      );
    }
  }

  item[axis] = moveToCoord;
  newLayout[itemIndex] = item
  return newLayout
}
  