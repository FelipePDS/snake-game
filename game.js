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
            head: {
                position: {
                    x: 585,
                    y: 485
                },
                
                length: 1
            },

            tail: {
                trail: [],

                length: 0,

                collapse: true
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
            },

            commands: {
                renderPlayer: (player) => {
                    game.global.context.fillStyle = player.styles.color
                    game.global.context.fillRect(player.head.position.x, player.head.position.y, player.styles.width, player.styles.height)
                },

                clearPlayer: (player) => {
                    game.global.context.clearRect(player.head.position.x, player.head.position.y, player.styles.width, player.styles.height)
                },

                movePlayer: (player) => {
                    window.addEventListener('keydown', (event) => {
                        const keyName = event.key
                
                        if (keyName === game.commands.moveUp) {
                            player.commands.clearPlayer(player)
                            player.head.position.y -= player.styles.height
                            player.commands.renderPlayer(player)
                        }

                        if (keyName === game.commands.moveRight) {
                            player.commands.clearPlayer(player)
                            player.head.position.x += player.styles.height
                            player.commands.renderPlayer(player)
                        }

                        if (keyName === game.commands.moveDown) {
                            player.commands.clearPlayer(player)
                            player.head.position.y += player.styles.height
                            player.commands.renderPlayer(player)
                        }

                        if (keyName === game.commands.moveLeft) {
                            player.commands.clearPlayer(player)
                            player.head.position.x -= player.styles.height
                            player.commands.renderPlayer(player)
                        }
                    })
                }
            }
        },


        food: {
            position: {
                x: 100,
                y: 100
            },

            styles: {
                color: `${themes.modes[localStorage.Theme].colorFood}`,
                width: 0,
                height: 0
            },

            generated: true
        }
    },


    commands: {
        moveUp: 'ArrowUp',
        moveRight: 'ArrowRight',
        moveDown: 'ArrowDown',
        moveLeft: 'ArrowLeft',

        pause: 'Esc'
    }
}

// ======================== // ======================== //

game.global.box.width = 1200
game.global.box.height = 990

game.entities.player.commands.renderPlayer(game.entities.player)
game.entities.player.commands.movePlayer(game.entities.player)
