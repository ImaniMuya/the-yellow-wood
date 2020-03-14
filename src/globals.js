export const SIZE = 1000;
export const getEl = x => document.getElementById(x);
export const canvas = getEl("canvas");

export const towers = [];
export const enemies = [];
export const hitBoxes = []; 
export const bulletSpeed = 5;
export const windStorms = [];
export const bulletRadius = 5;
export const enemySpeed = 2;
export const resourceLifeSpan = 4000;
export const resourceRadius = 15;
export const resources = [];

export const windType = {
  state: 0,
  DIVERGING: 0,
  CONVERGING: 1
};
export const LINEWIDTH = 4
export const towerCost = 30;
export const upgradeCost = 10;
export const towerDamage = 5;
export const powerCost = 30;