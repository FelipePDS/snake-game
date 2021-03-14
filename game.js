const game = {
    global: {
        box: document.querySelector('#box'),
        context: this.box.getContext('2d')
    },


    status: {
        run: false,

        buttonStatusGame: document.querySelector('#statusGame'),
        paused: false,
        gamePausedContainer: document.querySelector('.game-paused-container'),
        pause: (status) => {
            if (status.paused) {
                status.paused = false
                status.buttonStatusGame.setAttribute('class', 'fa fa-pause')
                status.gamePausedContainer.style.display = 'none'
            } else {
                status.paused = true
                status.buttonStatusGame.setAttribute('class', 'fa fa-play')
                status.gamePausedContainer.style.display = 'flex'
            }
        },

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
                    x: 600,
                    y: 600
                },
                
                length: 1,

                direction: ''
            },

            tail: {
                trail: [{
                    position: {
                        x: Number,
                        y: Number
                    }
                }],

                collapse: true
            },

            speedLevel: 10,

            styles: {
                color: `${themes.modes[localStorage.Theme].colorSnake}`,
                width: 30,
                height: 30
            },

            events: {
                renderPlayer: (player) => {
                    game.global.context.fillStyle = player.styles.color
                    game.global.context.fillRect(player.head.position.x, player.head.position.y, player.styles.width, player.styles.height)

                    for (let i in player.tail.trail) {
                        game.global.context.fillRect(player.tail.trail[i].position.x, player.tail.trail[i].position.y, player.styles.width, player.styles.height)
                    }
                },

                clearPlayer: (player) => {
                    game.global.context.clearRect(player.head.position.x, player.head.position.y, player.styles.width, player.styles.height)

                    for (let i in player.tail.trail) {
                        game.global.context.clearRect(player.tail.trail[i].position.x, player.tail.trail[i].position.y, player.styles.width, player.styles.height)
                    }
                },

                crawl: (player) => {
                    function setPositionHead(axisChanged, axisIncreases) {
                        axisIncreases ? player.head.position[axisChanged] += player.styles.height : player.head.position[axisChanged] -= player.styles.height
                    }

                    function setPositionTail(axisChanged, headAxis, axisIncreases) {
                        for (let i = player.tail.trail.length - 1; i >= 0; i--) {
                            if (i > 0) {
                                player.tail.trail[i].position.x = player.tail.trail[i-1].position.x
                                player.tail.trail[i].position.y = player.tail.trail[i-1].position.y
                            } else {
                                player.tail.trail[0].position[headAxis] = player.head.position[headAxis]
                                if (axisIncreases) {
                                    player.tail.trail[0].position[axisChanged] = player.head.position[axisChanged] + player.styles.height + 1
                                } else {
                                    player.tail.trail[0].position[axisChanged] = player.head.position[axisChanged] - player.styles.height - 1
                                }
                            }
                        }
                    }

                    setInterval(() => {

                        if (game.status.paused) { return null }

                        if (player.head.direction === 'up') {
                            player.events.clearPlayer(player)

                            setPositionHead('y', false)

                            setPositionTail('y', 'x', true)

                            player.events.renderPlayer(player)
                        }

                        if (player.head.direction === 'right') {
                            player.events.clearPlayer(player)

                            setPositionHead('x', true)

                            setPositionTail('x', 'y', false)

                            player.events.renderPlayer(player)
                        }

                        if (player.head.direction === 'down') {
                            player.events.clearPlayer(player)

                            setPositionHead('y', true)

                            setPositionTail('y', 'x', false)

                            player.events.renderPlayer(player)
                        }

                        if (player.head.direction === 'left') {
                            player.events.clearPlayer(player)

                            setPositionHead('x', false)

                            setPositionTail('x', 'y', true)

                            player.events.renderPlayer(player)
                        }

                    }, player.speedLevel * 10);
                },

                movePlayer: (player) => {
                    window.addEventListener('keydown', (event) => {
                        if (game.status.paused) { return null }

                        const keyName = event.key
                
                        if (keyName === game.commands.moveUp && player.head.direction !== 'down') { player.head.direction = 'up' }

                        if (keyName === game.commands.moveRight && player.head.direction !== 'left') { player.head.direction = 'right' }

                        if (keyName === game.commands.moveDown && player.head.direction !== 'up') { player.head.direction = 'down' }

                        if (keyName === game.commands.moveLeft && player.head.direction !== 'right') { player.head.direction = 'left' }
                    })
                },
                
                eat: (player, food) => {
                    setInterval(() => {

                        if (player.head.position.x === food.position.x && player.head.position.y === food.position.y) {
                            food.generated = false

                            let lastTailPosition = player.tail.trail.length - 1
                            player.tail.trail.push({
                                position: {
                                    x: player.tail.trail[lastTailPosition].position.x,
                                    y: player.tail.trail[lastTailPosition].position.y
                                }
                            })

                            player.ponctuation.show()
                        }

                    }, player.speedLevel * 10);
                }
            },

            ponctuation: {
                content: document.querySelector('.ponctuation'),
                value: () => {
                    return game.entities.player.tail.trail.length
                },

                show: () => {
                    game.entities.player.ponctuation.content.innerHTML = `${game.entities.player.ponctuation.value()}pts`
                },

                record: 0
            }
        },


        food: {
            position: {
                x: 90,
                y: 90
            },

            styles: {
                color: `${themes.modes[localStorage.Theme].colorFood}`,
                width: 30,
                height: 30
            },

            generated: true,

            events: {
                renderFood: (food) => {
                    game.global.context.fillStyle = food.styles.color
                    game.global.context.fillRect(food.position.x, food.position.y, food.styles.width, food.styles.height)
                },

                generateFood: (food) => {
                    setInterval(() => {
                        if (food.generated) { return null }

                        let generatePositionX = Math.floor(Math.random() * game.global.box.width)
                        food.position.x = generatePositionX - (generatePositionX % game.entities.player.styles.width)

                        let generatePositionY = Math.floor(Math.random() * game.global.box.height)
                        food.position.y = generatePositionY - (generatePositionY % game.entities.player.styles.height)

                        food.events.renderFood(food)

                        food.generated = true
                    }, 100);
                }
            }
        }
    },


    commands: {
        moveUp: 'ArrowUp',
        moveRight: 'ArrowRight',
        moveDown: 'ArrowDown',
        moveLeft: 'ArrowLeft',

        pause: 'Escape'
    }
}

// ======================== // ======================== //

game.global.box.width = 1200
game.global.box.height = 990


const player = game.entities.player
player.events.renderPlayer(player)
player.events.movePlayer(player)
player.events.crawl(player)
player.events.eat(player, game.entities.food)


const food = game.entities.food
food.events.renderFood(food)
food.events.generateFood(food)


const status = game.status
status.buttonStatusGame.addEventListener('click', () => {
    status.pause(status)
})
window.addEventListener('keyup', (event) => {
    if (event.key === game.commands.pause) { status.pause(status) }
})
