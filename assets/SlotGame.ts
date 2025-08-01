import { _decorator, Component, Node, Sprite, SpriteFrame, Vec3, Button, AnimationClip, Animation } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('SlotGame')
export class SlotGame extends Component {
    @property({ type: Node })
    private reels: Node[] = []; // 5 個 Reel 節點
    @property({ type: SpriteFrame })
    private symbols: SpriteFrame[] = []; // 12 個符號
    @property({ type: Button })
    private spinButton: Button = null; // 旋轉按鈕
    @property({ type: Node })
    private freeGamePanel: Node = null; // Free Game 面板

    private isSpinning: boolean = false;
    private isFreeGame: boolean = false;
    private reelRows: number = 3; // 默認 5x3
    private symbolSize: number = 128; // 符號尺寸 128x128
    private reelSymbols: Sprite[][] = [[], [], [], [], []]; // 每個 Reel 的符號

    start() {
        this.initReels();
        this.spinButton.node.on('click', this.onSpin, this);
    }

    // 初始化 Reel
    private initReels() {
        for (let i = 0; i < 5; i++) {
            this.reels[i].removeAllChildren(); // 清空 Reel
            for (let j = 0; j < this.reelRows; j++) {
                let symbolNode = new Node(`Symbol_${i}_${j}`);
                let sprite = symbolNode.addComponent(Sprite);
                sprite.spriteFrame = this.symbols[Math.floor(Math.random() * this.symbols.length)];
                symbolNode.setPosition(new Vec3(0, j * this.symbolSize - (this.reelRows - 1) * this.symbolSize / 2));
                this.reels[i].addChild(symbolNode);
                this.reelSymbols[i][j] = sprite;
            }
        }
    }

    // 旋轉 Reel
    private async onSpin() {
        if (this.isSpinning) return;
        this.isSpinning = true;
        this.spinButton.interactable = false;

        // 模擬旋轉動畫
        for (let i = 0; i < 5; i++) {
            let reel = this.reels[i];
            let anim = reel.getComponent(Animation) || reel.addComponent(Animation);
            let clip = AnimationClip.createWithSpriteFrames(this.symbols, 10);
            clip.name = 'spin';
            clip.wrapMode = AnimationClip.WrapMode.Loop;
            anim.addClip(clip);
            anim.play('spin');
        }

        // 等待動畫結束
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 停止動畫並更新符號
        for (let i = 0; i < 5; i++) {
            this.reels[i].getComponent(Animation).stop();
            this.updateReel(i);
        }

        // 檢查是否觸發 Free Game
        if (this.checkFreeGame()) {
            this.startFreeGame();
        }

        this.isSpinning = false;
        this.spinButton.interactable = true;
    }

    // 更新單個 Reel 符號
    private updateReel(reelIndex: number) {
        for (let j = 0; j < this.reelRows; j++) {
            this.reelSymbols[reelIndex][j].spriteFrame = this.symbols[Math.floor(Math.random() * this.symbols.length)];
        }
    }

    // 檢查 Free Game 條件（3 個以上 Scatter）
    private checkFreeGame(): boolean {
        let scatterCount = 0;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < this.reelRows; j++) {
                if (this.reelSymbols[i][j].spriteFrame.name.includes('symbol_2')) { // 假設 symbol_2 係 Scatter
                    scatterCount++;
                }
            }
        }
        return scatterCount >= 3;
    }

    // 啟動 Free Game（擴展至 5x6）
    private startFreeGame() {
        this.isFreeGame = true;
        this.reelRows = 6; // 擴展到 5x6
        this.freeGamePanel.active = true;
        this.initReels();

        // 自動執行 10 次 Free Game 旋轉
        this.schedule(this.freeGameSpin, 3, 9);
    }

    // Free Game 旋轉
    private freeGameSpin() {
        this.onSpin();
        // 可加入獎勵計算邏輯
    }

    // 結束 Free Game
    private endFreeGame() {
        this.isFreeGame = false;
        this.reelRows = 3; // 恢復 5x3
        this.freeGamePanel.active = false;
        this.initReels();
    }
}