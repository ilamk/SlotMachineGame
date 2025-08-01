import { _decorator, Component, Node, Button } from 'cc';
import { SlotMachine } from './SlotMachine';
const { ccclass, property } = _decorator;

@ccclass('SpinButton')
export class SpinButton extends Component {
    @property(SlotMachine)
    slotMachine: SlotMachine = null;

    start() {
        this.node.getComponent(Button).node.on('click', this.onClick, this);
    }

    onClick() {
        this.slotMachine.spin();
    }
}