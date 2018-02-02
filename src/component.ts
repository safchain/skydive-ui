import { SKEvent } from "./event.ts";
import { SKContainer } from "./layout.ts";

declare var d3: any;

export class SKComponent {

  protected name: string;
  protected clazz: string;

  width: number = 0;
  height: number = 0;
  x: number = 0;
  y: number = 0;

  // relation
  container: SKContainer;

  // events
  protected onUpdatedListeners: Array<{(event: SKEvent): void}> = new Array();

  // svg
  protected svgG: any;

  constructor(name: string, clazz: string) {
    this.name = name;
    this.clazz = clazz;

    var gDom =  document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svgG = d3.select(gDom).attr("class", this.clazz);
  }

  render(): void {
    return this.svgG.node();
  }

  addUpdatedListenner(listener: (SKEvent) => void): void {
    this.onUpdatedListeners.push(listener);
  }

  protected notifyUpdated(event: SKEvent): void {
    for (let listener of this.onUpdatedListeners) {
      listener(event);
    }
  }

  // called by container when updated
  containerUpdated(): void {}

  setPos(x: number, y: number, event?: SKEvent): void {
    this.x = x;
    this.y = y;
    this.svgG.attr("transform", (d) => { return "translate(" + this.x + "," + this.y + ")"; })

    if (!event) {
      event = new SKEvent(this);
    }

    this.notifyUpdated(event);
  }

  setSize(width: number, height: number, event?: SKEvent): void {
    this.width = width;
    this.height = height;

    if (!event) {
      event = new SKEvent(this);
    }

    this.notifyUpdated(event);
  }
}
