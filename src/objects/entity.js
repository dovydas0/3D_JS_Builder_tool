import * as THREE from 'three';

/**
 * Represents an Entity.
 */
export class Entity {
  constructor(
    x = 0,
    y = 0,
    width = 1,
    depth = 1,
    height = 1,
    radius = 1,
    segmentsRound = 1,
    segmentsWidth = 1,
    segmentsDepth = 1,
    segmentsHeight = 1,
    color = 0xff0000
  ) {
    this.x = x,
    this.y = y,
    this.width = width;
    this.depth = depth;
    this.height = height;
    this.radius = radius;
    this.segmentsRound = segmentsRound;
    this.segmentsWidth = segmentsWidth;
    this.segmentsDepth = segmentsDepth;
    this.segmentsHeight = segmentsHeight;
    this.color = color;
  }
}