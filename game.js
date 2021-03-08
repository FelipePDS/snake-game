const game = {
    global: {
        box: document.querySelector('#box'),
        context: this.box.getContext('2d')
    },

    status: {
        buttonStatusGame: document.querySelector('#statusGame'),
        pause: true
    },

    entities: {
        player: {
            position: () => {
                return game.global.context
            },

            ponctuation: {
                content: document.querySelector('.ponctuation'),
                value: 1
            }
        },

        food: () => {
            return game.global.context
        }
    }
}

// ======================== // ======================== //

game.global.box.width = 1200
game.global.box.height = 1000