import { SKEvent } from "./event.ts";
import { SKComponent } from "./component.ts";

declare var d3: any;

export class SKLink {

  protected name: string;
  protected clazz: string;

  private component1: SKComponent;
  private component2: SKComponent;

  // relation
  container: SKContainer;

  private lineGenerator: any = d3.line().curve(d3.curveBasis);

  // svg
  protected svgG: any;
  protected svgPath: any;

  constructor(name: string, clazz: string, component1: SKComponent, component2: SKComponent) {
    this.name = name;
    this.clazz = clazz;

    this.component1 = component1;
    component1.addUpdatedListenner(this.invalidate.bind(this));

    this.component2 = component2;
    component2.addUpdatedListenner(this.invalidate.bind(this));

    var gDom =  document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svgG = d3.select(gDom).attr("class", this.clazz);

    // create the path
    this.svgPath = this.svgG.append("path");

    this.invalidate()
  }

  endpoint(component: SKComponent, x1: number, y1: number, side: string): Array<number> {
    if (side === "top") {
      return [x1, y1 - component.height / 2];
    }
    if (side === "bottom") {
      return [x1, y1 + component.height / 2];
    }
    if (side === "left") {
      return  [x1 - component.width / 2, y1];
    }
    if (side === "right") {
      return [x1 + component.width / 2, y1];
    }
  }

  anchorSide(component: SKComponent, x1: number, y1: number, x2: number, y2: number): string {
    var w = component.width, h = component.height;
    var slope = (y1 - y2) / (x1 - x2);
    var hsw = slope * w / 2;
    var hsh = (h / 2) / slope;
    var hh = h / 2;
    var hw = w / 2;

    if (-hh <= hsw && hsw <= hh) {
      if (x1 < x2) {
        return "right";
      }
      return "left";
    }

    if (y1 > y2) {
      return "top";
    }
    return "bottom";
  }

  localPos(component: SKComponent): Array<number> {
    var x = component.x, y = component.y, container = component.container;

    while (container && this.container !== container) {
      x += container.x;
      y += container.y;

      container = container.container;
    }

    return [x, y];
  }

  controlPoint(x, y, dx, dy, side: string): Array<number> {
    if (side === "top") {
      return [x, y - dy];
    }
    if (side === "bottom") {
      return [x, y + dy];
    }
    if (side === "left") {
      return  [x - dx, y];
    }
    if (side === "right") {
      return [x + dx, y];
    }
  }

  interpolate(x1: number, y1: number, s1: string, x2: number, y2: number, s2: string): Array<Array<number>> {
    var points = [[x1, y1]];

    // 4 for now but could be a parameter of link.
    var dx = Math.floor((x2 - x1) / 4);
    var dy = Math.floor((y2 - y1) / 4);

    var c1 = this.controlPoint(x1, y1, dx, dy, s1);
    points.push(c1);

    var c2 = this.controlPoint(x2, y2, dx, dy, s2);
    points.push(c2);

    points.push([x2, y2]);

    return points;
  }

  invalidate(event?: SKEvent): void {
    var c1 = this.component1, c2 = this.component2;
    var p1 = this.localPos(c1);
    var p2 = this.localPos(c2);

    var s1 = this.anchorSide(c1,
      p1[0] + c1.width / 2, p1[1] + c1.height / 2,
      p2[0] + c2.width / 2, p2[1] + c2.height / 2);
    var s2 = this.anchorSide(c2,
      p2[0] + c2.width / 2, p2[1] + c2.height / 2,
      p1[0] + c1.width / 2, p1[1] + c1.height / 2);

    var e1 = this.endpoint(c1, p1[0] + c1.width / 2, p1[1] + c1.height / 2, s1);
    var e2 = this.endpoint(c2, p2[0] + c2.width / 2, p2[1] + c2.height / 2, s2);

    var points = this.interpolate(e1[0], e1[1], s1, e2[0], e2[1], s2);

    var pathData = this.lineGenerator(points);
    this.svgPath.attr('d', pathData);
  }

  render(): void {
    return this.svgG.node();
  }
}

export abstract class SKContainer extends SKComponent {

  protected components: Array<SKComponent> = new Array();
  protected links: Array<SKLink> = new Array();

  // d3 model
  protected componentD3Data: any;
  protected linkD3Data: any;

  // svg
  private svgRect: any;
  protected svgComponent: any;
  private svgLink: any;

  constructor(name: string, clazz: string) {
    super(name, clazz);

    // create the bouding box
    this.svgRect = this.svgG
      .append("rect")
      .attr('rx', 5)
      .attr('ry', 5);
    this.svgComponent = this.svgG.append("g");
    this.svgLink = this.svgG.append("g");

    this.componentD3Data = this.svgComponent.selectAll(".component");
    this.linkD3Data = this.svgLink.selectAll(".link");
  }

  addComponent(component: SKComponent): void {
    this.components.push(component);
    component.container = this;

    component.addUpdatedListenner(this.invalidate.bind(this));

    this.componentD3Data = this.componentD3Data.data(this.components);
    this.componentD3Data.exit().remove();

    var enter = this.componentD3Data.enter().append((d) => { return d.render(); });
    this.componentD3Data = enter.merge(this.componentD3Data);

    // need to be implemented by a real container
    this.invalidate();
  }

  addLink(link: SKLink): void {
    this.links.push(link);
    link.container = this;

    this.linkD3Data = this.linkD3Data.data(this.links);
    this.linkD3Data.exit().remove();

    var enter = this.linkD3Data.enter().append((d) => { return d.render(); });
    this.linkD3Data = enter.merge(this.linkD3Data);

    // need to be implemented by a real container
    this.invalidate();
  }

  setSize(width: number, height: number, event?: SKEvent): void {
    super.setSize(width, height);
    this.svgRect.attr("width", this.width).attr("height", this.height);
  }

  abstract invalidate(event?: SKEvent): void;
}

export enum SKFlowLayoutOrientation {
  Horizontal = 0,
  Vertical = 1,
}

export class SKFlowLayout extends SKContainer {

  orientation: SKFlowLayoutOrientation
  padding: number;
  margin: number;

  constructor(name: string, clazz: string, orientation: SKFlowLayoutOrientation, padding: number, margin: number) {
    super(name, clazz);

    this.orientation = orientation;
    this.padding = padding || 0;
    this.margin = margin || 0;
  }

  invalidate(event: SKEvent): void {
    var x = this.margin, y = this.margin, width = 0, height = 0;

    // do not react on event that originate from myself
    if (event && event.source === this) {
      return;
    }

    var event = new SKEvent(this);

    this.componentD3Data.each((d, i) => {
      d.setPos(x, y, event);
      if (this.orientation === SKFlowLayoutOrientation.Horizontal) {
        x += d.width + this.padding;

        if (height < d.height) height = d.height;
        width += d.width + this.padding;
      } else {
        y += d.height + this.padding;

        if (width < d.width) width = d.width;
        height += d.height + this.padding;
      }
    });

    if (this.orientation === SKFlowLayoutOrientation.Horizontal) {
      width -= this.padding;
    } else {
      height -= this.padding;
    }

    this.setSize(width + this.margin * 2, height + this.margin * 2, event);

    for (let link of this.links) {
      link.invalidate();
    }
  }
}
