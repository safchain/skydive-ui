declare var d3: any;

class SKEvent {
  source: any;

  constructor(source: any) {
    this.source = source;
  }
}

// something drawable
class SKComponent {

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
  private svgRect: any;

  constructor(name: string, clazz: string) {
    this.name = name;
    this.clazz = clazz;

    var gDom =  document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svgG = d3.select(gDom).attr("class", this.clazz);

    // create the bouding box
    this.svgRect = this.svgG.append("rect");
  }

  render() {
    return this.svgG.node();
  }

  addUpdatedListenner(listener: (SKEvent) => void) {
    this.onUpdatedListeners.push(listener);
  }

  notifyUpdated(event: SKEvent) {
    for (let listener of this.onUpdatedListeners) {
      listener(event);
    }
  }

  setPos(x: number, y: number, event?: SKEvent) {
    this.x = x;
    this.y = y;
    this.svgG.attr("transform", (d) => { return "translate(" + this.x + "," + this.y + ")"; })

    if (!event) {
      event = new SKEvent(this);
    }

    this.notifyUpdated(event);
  }

  setSize(width, height, event?: SKEvent) {
    this.width = width;
    this.height = height;
    this.svgRect.attr("width", this.width).attr("height", this.height);

    if (!event) {
      event = new SKEvent(this);
    }

    this.notifyUpdated(event);
  }

  // called when the view is invalidate, meaning needs to redraw
  invalidate(event?: SKEvent) {
  }
}

class SKInterface extends SKComponent {

  constructor(name: string, clazz: string) {
    super(name, clazz);

    this.name = name;
    this.clazz = clazz;

    this.setSize(20, 20);
  }
}

class SKLink {

  protected name: string;
  protected clazz: string;

  private component1: SKComponent;
  private component2: SKComponent;

  // relation
  container: SKContainer;

  private lineGenerator: any = d3.line().curve(d3.curveCardinal);

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

  localPos(component: SKComponent): Array<number> {
    var x = component.x, y = component.y, container = component.container;

    while (container && this.container !== container) {
      x += container.x;
      y += container.y;

      container = container.container;
    }

    return [x, y];
  }

  invalidate(event?: SKEvent) {
    var points = [
      this.localPos(this.component1),
      this.localPos(this.component2)
    ];

    var pathData = this.lineGenerator(points);
    this.svgPath.attr('d', pathData);
  }

  render() {
    return this.svgG.node();
  }
}

class SKContainer extends SKComponent {

  protected components: Array<SKComponent> = new Array();
  protected links: Array<SKLink> = new Array();

  // d3 model
  protected componentD3Data: any;
  protected linkD3Data: any;

  // svg
  protected svgComponent: any;
  private svgLink: any;

  constructor(name: string, clazz: string) {
    super(name, clazz);

    this.svgComponent = this.svgG.append("g");
    this.svgLink = this.svgG.append("g");

    this.componentD3Data = this.svgComponent.selectAll(".component");
    this.linkD3Data = this.svgLink.selectAll(".link");
  }

  addComponent(component: SKComponent) {
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

  addLink(link: SKLink) {
    this.links.push(link);
    link.container = this;

    this.linkD3Data = this.linkD3Data.data(this.links);
    this.linkD3Data.exit().remove();

    var enter = this.linkD3Data.enter().append((d) => { return d.render(); });
    this.linkD3Data = enter.merge(this.linkD3Data);

    // need to be implemented by a real container
    this.invalidate();
  }
}

enum SKFlowLayoutOrientation {
  Horizontal = 0,
  Vertical = 1,
}

class SKFlowLayout extends SKContainer {

  orientation: SKFlowLayoutOrientation
  padding: number;
  margin: number;

  constructor(name: string, clazz: string, orientation: SKFlowLayoutOrientation, padding: number, margin: number) {
    super(name, clazz);

    this.orientation = orientation;
    this.padding = padding || 0;
    this.margin = margin || 0;
  }

  invalidate(event: SKEvent) {
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
