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
            limitY: 33,
            collapse: false
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
    },

    commands: {
        moveUp: 'ArrowUp',
        moveDown: 'ArrowDown',
        moveRight: 'ArrowRight',
        moveLeft: 'ArrowLeft',

        pause: 'Esc'
    }
}

// ======================== // ======================== //

game.global.box.width = 1200
game.global.box.height = 990
