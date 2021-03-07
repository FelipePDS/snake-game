// DECLARE VALUES
const game = {
    global: {
        box: document.querySelector('#box'),
        context: this.box.getContext('2d')
    }
}

game.global.box.width = 1200
game.global.box.height = 1000

// game.global.context.fillStyle = 'red'
// game.global.context.fillRect(10, 10, 30, 30)