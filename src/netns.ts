import { SKEvent } from "./event.ts";
import { SKComponent } from "./component.ts";
import { SKInterface } from "./interface.ts";
import {
  SKFlowLayout,
  SKFlowLayoutOrientation,
  SKMargin,
  SKPadding} from "./layout.ts";

declare var d3: any;

export class title extends SKComponent {

  protected img: string;

  // svg obj
  private svgText: any;

  constructor(name: string, clazz: string = "sk-netns-title") {
    super(name, clazz);

    this.name = name;
    this.clazz = clazz;

    this.svgText = this.svgG
      .append("text")
      .attr('text-anchor', 'middle')
      .attr('visibility', 'hidden')
      .text(this.name);

    // fake height because of padding
    this.height = 8;
  }

  containerUpdated(): void {
    this.width = this.container.width;

    this.svgText
      .attr('visibility', 'visible')
      .attr('x', this.container.width / 2);
  }
}

export class SKNetworkNamespaceLayout extends SKFlowLayout {

  private layerMargin: SKMargin = {left: 20, right: 20, top: 20, bottom: 20};
  private layerPadding: SKPadding = {x: 20, y: 20};

  protected layer1: SKFlowLayout = new SKFlowLayout(
    "layer1", "sk-netns-intf-layer1", SKFlowLayoutOrientation.Horizontal, this.layerMargin, this.layerPadding);
  protected layer2: SKFlowLayout = new SKFlowLayout(
    "layer2", "sk-netns-intf-layer2", SKFlowLayoutOrientation.Horizontal, this.layerMargin, this.layerPadding);
  protected layer3: SKFlowLayout = new SKFlowLayout(
    "layer3", "sk-netns-intf-layer3", SKFlowLayoutOrientation.Horizontal, this.layerMargin, this.layerPadding);
  protected layer4: SKFlowLayout = new SKFlowLayout(
    "layer4", "sk-netns-intf-layer4", SKFlowLayoutOrientation.Vertical, this.layerMargin, this.layerPadding);

  constructor(name: string, clazz: string) {
    super(name, clazz, SKFlowLayoutOrientation.Vertical, {top: 20}, {});

    super.addComponent(new title(this.name));
    super.addComponent(this.layer1);
    super.addComponent(this.layer2);
    super.addComponent(this.layer3);
    super.addComponent(this.layer4);
  }

  addComponent(component: SKComponent): void {
    if (component instanceof SKInterface) {
      this.layer1.addComponent(component);
    }
    if (component instanceof SKNetworkNamespaceLayout) {
      this.layer4.addComponent(component);
    }
  }
}
