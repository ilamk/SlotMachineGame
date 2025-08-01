import { _decorator, Component, Node, Sprite, Label, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SlotMachine')
export class SlotMachine extends Component {
    @property([Sprite])
    reels: Sprite[] = []; // 5個軸，每個軸3個Sprite
    @property(Label)
    coinLabel: Label = null; // 幣數顯示
    @property([SpriteFrame])
    symbolFrames: SpriteFrame[] = []; // 12個符號圖片

    private symbols = [
        'symbol1', 'symbol2', 'symbol3', 'symbol4', 'symbol5',
        'symbol6', 'symbol7', 'symbol8', 'symbol9', 'symbol10',
        'symbol11', 'symbol12'
    ]; // 12個符號
    private currentSymbols: string[][] = [[], [], [], [], []]; // 5軸，每軸3符號
    private playerCoins: number = 1000; // 初始幣數

    start() {
        this.updateCoinDisplay();
    }

    spin() {
        // 生成5軸隨機結果
        for (let i = 0; i < 5; i++) {
            this.currentSymbols[i] = [];
            for (let j = 0; j < 3; j++) {
                const randomIndex = Math.floor(Math.random() * this.symbols.length);
                this.currentSymbols[i][j] = this.symbols[randomIndex];
            }
        }
        this.updateReels();
        this.checkWin();
    }

    updateReels() {
        // 更新軸嘅Sprite
        this.reels.forEach((reel, reelIndex) => {
            reel.getComponentsInChildren(Sprite).forEach((symbol, symbolIndex) => {
                const symbolName = this.currentSymbols[reelIndex][symbolIndex];
                const frameIndex = this.symbols.indexOf(symbolName);
                if (frameIndex >= 0 && this.symbolFrames[frameIndex]) {
                    symbol.spriteFrame = this.symbolFrames[frameIndex];
                }
            });
        });
        console.log('當前結果:', this.currentSymbols);
    }

    checkWin() {
        // 檢查第一行5個相同符號
        const firstRow = this.currentSymbols.map(col => col[0]);
        if (firstRow.every(symbol => symbol === firstRow[0])) {
            this.playerCoins += 100;
            console.log('贏得100幣！');
            this.updateCoinDisplay();
        }
    }

    updateCoinDisplay() {
        this.coinLabel.string = `Coins: ${this.playerCoins}`;
    }
}