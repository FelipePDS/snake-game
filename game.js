const game = {
    global: {
        box: document.querySelector('#box'),
        context: this.box.getContext('2d')
    },


    status: {
        buttonStatusGame: document.querySelector('#statusGame'),
        paused: true,
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
                    x: 570,
                    y: 480
                },
                
                length: 1,

                direction: ''
            },

            tail: {
                trail: [],

                length: 0,

                collapse: true
            },

            speedLevel: 10,

            styles: {
                color: `${themes.modes[localStorage.Theme].colorSnake}`,
                width: 30,
                height: 30
            },

            commands: {
                renderPlayer: (player) => {
                    game.global.context.fillStyle = player.styles.color
                    game.global.context.fillRect(player.head.position.x, player.head.position.y, player.styles.width, player.styles.height)
                },

                clearPlayer: (player) => {
                    game.global.context.clearRect(player.head.position.x, player.head.position.y, player.styles.width, player.styles.height)
                },

                crawl: (player) => {
                    setInterval(() => {

                        if (player.head.direction === 'up') {
                            player.commands.clearPlayer(player)
                            player.head.position.y -= player.styles.height
                            player.commands.renderPlayer(player)
                        }

                        if (player.head.direction === 'right') {
                            player.commands.clearPlayer(player)
                            player.head.position.x += player.styles.height
                            player.commands.renderPlayer(player)
                        }

                        if (player.head.direction === 'down') {
                            player.commands.clearPlayer(player)
                            player.head.position.y += player.styles.height
                            player.commands.renderPlayer(player)
                        }

                        if (player.head.direction === 'left') {
                            player.commands.clearPlayer(player)
                            player.head.position.x -= player.styles.height
                            player.commands.renderPlayer(player)
                        }

                    }, player.speedLevel * 10);
                },

                movePlayer: (player) => {
                    window.addEventListener('keydown', (event) => {
                        const keyName = event.key
                
                        if (keyName === game.commands.moveUp && player.head.direction !== 'down') { player.head.direction = 'up' }

                        if (keyName === game.commands.moveRight && player.head.direction !== 'left') { player.head.direction = 'right' }

                        if (keyName === game.commands.moveDown && player.head.direction !== 'up') { player.head.direction = 'down' }

                        if (keyName === game.commands.moveLeft && player.head.direction !== 'right') { player.head.direction = 'left' }
                    })
                }
            },

            ponctuation: {
                content: document.querySelector('.ponctuation'),
                value: 1
            }
        },


        food: {
            position: {
                x: 100,
                y: 100
            },

            styles: {
                color: `${themes.modes[localStorage.Theme].colorFood}`,
                width: 30,
                height: 30
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

const player = game.entities.player
player.commands.renderPlayer(player)
player.commands.crawl(player)
player.commands.movePlayer(player)
