import { shorthands } from '@griffel/core';

export const supportedShorthandsKeys = Object.keys(shorthands);

// keys of griffel type GriffelStylesUnsupportedCSSProperties, i don't know how to get it as import :/
export const allShorthandsKeys = [
  /** @deprecated */
  'all',
  /** @deprecated Use corresponding longhand properties such as `animationName` and `animationDuration` instead. */
  'animation',
  /** @deprecated Use corresponding longhand properties such as `backgroundImage` and `backgroundSize` instead. */
  'background',
  /** @deprecated Use corresponding longhand properties `backgroundPositionX` and `backgroundPositionY` instead. */
  'backgroundPosition',
  /** @deprecated Use `shorthands.border()` instead. */
  'border',
  /** @deprecated Use corresponding longhand properties such as `borderBlockStartColor` and `borderBlockEndStyle` instead. */
  'borderBlock',
  /** @deprecated Use corresponding longhand properties such as `borderBlockEndColor` and `borderBlockEndStyle` instead. */
  'borderBlockEnd',
  /** @deprecated Use corresponding longhand properties such as `borderBlockStartColor` and `borderBlockStartStyle` instead. */
  'borderBlockStart',
  /** @deprecated Use `shorthands.borderBottom()` instead. */
  'borderBottom',
  /** @deprecated Use `shorthands.borderColor()` instead. */
  'borderColor',
  /** @deprecated Use corresponding longhand properties such as `borderImageSource` and `borderImageWidth` instead. */
  'borderImage',
  /** @deprecated Use corresponding longhand properties such as `borderInlineStartColor` and `borderInlineEndStyle` instead. */
  'borderInline',
  /** @deprecated Use corresponding longhand properties such as `borderInlineEndColor` and `borderInlineEndStyle` instead. */
  'borderInlineEnd',
  /** @deprecated Use corresponding longhand properties such as `borderInlineStartColor` and `borderInlineStartStyle` instead. */
  'borderInlineStart',
  /** @deprecated Use `shorthands.borderLeft()` instead. */
  'borderLeft',
  /** @deprecated Use `shorthands.borderRadius()` instead. */
  'borderRadius',
  /** @deprecated Use `shorthands.borderRight()` instead. */
  'borderRight',
  /** @deprecated Use `shorthands.borderStyle()` instead. */
  'borderStyle',
  /** @deprecated Use `shorthands.borderTop()` instead. */
  'borderTop',
  /** @deprecated Use `shorthands.borderWidth()` instead. */
  'borderWidth',
  /** @deprecated Use corresponding longhand properties `columnCount` and `columnWidth` instead. */
  'columns',
  /** @deprecated Use corresponding longhand properties such as `columnRuleWidth` and `columnRuleColor` instead. */
  'columnRule',
  /** @deprecated Use `shorthands.flex()` instead. */
  'flex',
  /** @deprecated Use corresponding longhand properties `flexWrap` and `flexDirection` instead. */
  'flexFlow',
  /** @deprecated Use corresponding longhand properties such as `fontFamily` and `fontSize` instead. */
  'font',
  /** @deprecated Use `shorthands.gap()` instead. */
  'gap',
  /** @deprecated Use corresponding longhand properties such as `gridTemplateColumns` and `gridAutoRows` instead. */
  'grid',
  /** @deprecated Use `shorthands.gridArea()` instead. */
  'gridArea',
  /** @deprecated Use corresponding longhand properties `gridColumnStart` and `gridColumnEnd` instead. */
  'gridColumn',
  /** @deprecated Use corresponding longhand properties `gridRowStart` and `gridRowEnd` instead. */
  'gridRow',
  /** @deprecated Use corresponding longhand properties such as `gridTemplateColumns` and `gridTemplateRows` instead. */
  'gridTemplate',
  /** @deprecated */
  'lineClamp',
  /** @deprecated Use corresponding longhand properties such as `listStyleType` instead. */
  'listStyle',
  /** @deprecated Use `shorthands.margin()` instead. */
  'margin',
  /** @deprecated Use corresponding longhand properties such as `maskImage` and `maskSize` instead. */
  'mask',
  /** @deprecated Use corresponding longhand properties such as `maskBorderSource` and `maskBorderWidth` instead. */
  'maskBorder',
  /** @deprecated */
  'motion',
  /** @deprecated Use corresponding longhand properties such as `offsetPath` and `offsetDistance` instead. */
  'offset',
  /** @deprecated Use corresponding longhand properties such as `outlineColor` and `outlineWidth` instead. */
  'outline',
  /** @deprecated Use `shorthands.overflow()` instead. */
  'overflow',
  /** @deprecated Use corresponding longhand properties `overscrollBehaviorX` and `overscrollBehaviorY` instead. */
  'overscrollBehavior',
  /** @deprecated Use `shorthands.padding()` instead. */
  'padding',
  /** @deprecated Use corresponding longhand properties `alignItems` and `justifyItems` instead. */
  'placeItems',
  /** @deprecated Use corresponding longhand properties `alignSelf` and `justifySelf` instead. */
  'placeSelf',
  /** @deprecated Use corresponding longhand properties such as `textDecorationColor` and `textDecorationLine` instead. */
  'textDecoration',
  /** @deprecated Use corresponding longhand properties `textEmphasisColor` and `textEmphasisStyle` instead. */
  'textEmphasis',
  /** @deprecated Use `shorthands.transition()` instead. */
  'transition',
];
