const game = {
    global: {
        box: document.querySelector('#box'),
        context: this.box.getContext('2d')
    },

    status: {
        buttonStatusGame: document.querySelector('#statusGame'),
        pause: true,
        gameOver: false
    },

    entities: {
        box: {
            limitX: 40,
            limitY: 33
        },
        
        player: {
            position: {
                x: 585,
                y: 485
            },

            velocity: {
                x: 0,
                y: 0
            },

            styles: {
                color: `${themes.modes[localStorage.Theme].colorSnake}`,
                width: 30,
                height: 30
            },

            ponctuation: {
                content: document.querySelector('.ponctuation'),
                value: 1
            }
        },

        food: {
            position: {
                x: 0,
                y: 0
            },

            styles: {
                color: `${themes.modes[localStorage.Theme].colorFood}`,
                width: 0,
                height: 0
            }
        }
    }
}

// ======================== // ======================== //

game.global.box.width = 1200
game.global.box.height = 990

const player = game.entities.player
game.global.context.fillStyle = player.styles.color
game.global.context.fillRect(player.position.x, player.position.y, player.styles.width, player.styles.height)