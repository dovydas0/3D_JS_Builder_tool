import * as THREE from 'three';

/**
 * Represents an Entity.
 */
export class Entity {
  constructor(
    width = 1,
    depth = 1,
    height = 1,
    radius = 1,
    radiusTop = 1,
    radiusBottom = 1,
    segmentsRound = 1,
    segmentsWidth = 1,
    segmentsDepth = 1,
    segmentsHeight = 1,
    color = 0xff0000
  ) {
    this.width = width;
    this.depth = depth;
    this.height = height;
    this.radius = radius;
    this.radiusTop = radiusTop;
    this.radiusBottom = radiusBottom;
    this.segmentsRound = segmentsRound;
    this.segmentsWidth = segmentsWidth;
    this.segmentsDepth = segmentsDepth;
    this.segmentsHeight = segmentsHeight;
    this.color = color;
  }
}