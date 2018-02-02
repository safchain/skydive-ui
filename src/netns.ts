import { SKEvent } from "./event.ts";
import { SKComponent } from "./component.ts";
import { SKInterface } from "./interface.ts";
import {
  SKFlowLayout,
  SKFlowLayoutOrientation } from "./layout.ts";

export class SKNetworkNamespaceLayout extends SKFlowLayout {

  protected layer1: SKFlowLayout = new SKFlowLayout("layer1", "sk-intf-layer1", SKFlowLayoutOrientation.Horizontal, 20, 20);
  protected layer2: SKFlowLayout = new SKFlowLayout("layer2", "sk-intf-layer2", SKFlowLayoutOrientation.Horizontal, 20, 20);
  protected layer3: SKFlowLayout = new SKFlowLayout("layer3", "sk-intf-layer3", SKFlowLayoutOrientation.Horizontal, 20, 20);
  protected layer4: SKFlowLayout = new SKFlowLayout("layer4", "sk-intf-layer4", SKFlowLayoutOrientation.Vertical, 20, 20);

  constructor(name: string, clazz: string) {
    super(name, clazz, SKFlowLayoutOrientation.Vertical, 20, 20);

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
