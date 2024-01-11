export default class Door {
  id: string;
  hash: number;
  coords: number[];
  maxDist: number;
  isLocked: boolean;
  showPrompt: boolean;

  constructor(
    id: string,
    hash: number,
    coords: number[],
    maxDist: number,
    isLocked: boolean,
    showPrompt: boolean
  ) {
    this.id = id;
    this.hash = hash;
    this.coords = coords;
    this.maxDist = maxDist;
    this.isLocked = isLocked;
    this.showPrompt = showPrompt;
  }
}
