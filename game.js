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
            if (game.status.run === false) { return null }

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
            collision: Boolean,

            events: {
                renderBox: () => {
                    game.global.context.fillStyle = `${themes.modes[localStorage.Theme].colorBox}`
                    game.global.context.fillRect(0, 0, game.global.box.width, game.global.box.height)
                    game.entities.player.events.renderPlayer(game.entities.player)
                    game.entities.food.events.renderFood(game.entities.food)
                }
            }
        },


        
        player: {
            head: {
                position: {
                    x: 680,
                    y: 680
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

                collision: true
            },

            speedLevel: Number,

            styles: {
                color: `${themes.modes[localStorage.Theme].colorSnake}`,
                colorHead: `${themes.modes[localStorage.Theme].colorHead}`,
                width: 40,
                height: 40
            },

            events: {
                renderPlayer: (player) => {
                    game.global.context.fillStyle = player.styles.colorHead
                    game.global.context.fillRect(player.head.position.x, player.head.position.y, player.styles.width, player.styles.height)
                    game.global.context.strokeStyle = `${themes.modes[localStorage.Theme].colorBox}`
                    game.global.context.strokeRect(player.head.position.x, player.head.position.y, player.styles.width, player.styles.height)

                    for (let i in player.tail.trail) {
                        game.global.context.fillRect(player.tail.trail[i].position.x, player.tail.trail[i].position.y, player.styles.width, player.styles.height)
                        game.global.context.strokeRect(player.tail.trail[i].position.x, player.tail.trail[i].position.y, player.styles.width, player.styles.height)
                    }
                },

                clearPlayer: (player) => {
                    game.global.context.clearRect(player.head.position.x, player.head.position.y, player.styles.width, player.styles.height)

                    for (let i in player.tail.trail) {
                        game.global.context.clearRect(player.tail.trail[i].position.x, player.tail.trail[i].position.y, player.styles.width, player.styles.height)
                    }
                },

                movePlayer: (player) => {
                    window.addEventListener('keydown', (event) => {
                        if (game.status.run === false) { return null }
                        if (game.status.paused) { return null }

                        const keyName = event.key
                
                        if (game.commands.moveUp.indexOf(keyName) > -1 && player.head.direction !== 'down') { player.head.direction = 'up' }

                        if (game.commands.moveRight.indexOf(keyName) > -1 && player.head.direction !== 'left') { player.head.direction = 'right' }

                        if (game.commands.moveDown.indexOf(keyName) > -1 && player.head.direction !== 'up') { player.head.direction = 'down' }

                        if (game.commands.moveLeft.indexOf(keyName) > -1 && player.head.direction !== 'right') { player.head.direction = 'left' }
                    })
                },

                crawl: (player) => {
                    if (game.status.run === false) { return null }

                    function setPositionHead(axisChanged, axisIncreases) {
                        axisIncreases ? player.head.position[axisChanged] += player.styles.width : player.head.position[axisChanged] -= player.styles.width
                    }

                    function setPositionTail(axisChanged, headAxis, axisIncreases) {
                        for (let i = player.tail.trail.length - 1; i >= 0; i--) {
                            if (i > 0) {
                                player.tail.trail[i].position.x = player.tail.trail[i-1].position.x
                                player.tail.trail[i].position.y = player.tail.trail[i-1].position.y
                            } else {
                                player.tail.trail[0].position[headAxis] = player.head.position[headAxis]
                                if (axisIncreases) {
                                    player.tail.trail[0].position[axisChanged] = player.head.position[axisChanged] + player.styles.height
                                } else {
                                    player.tail.trail[0].position[axisChanged] = player.head.position[axisChanged] - player.styles.height
                                }
                            }
                        }
                    }

                    function verifyLimitBox(direction) {
                        if (game.entities.box.collision === false) {
                            if (game.entities.player.head.position.y === 0 - game.entities.player.styles.height && direction === 'up') { game.entities.player.head.position.y = game.global.box.height - game.entities.player.styles.height }

                            if (game.entities.player.head.position.x === game.global.box.width && direction === 'right') { game.entities.player.head.position.x = 0 }

                            if (game.entities.player.head.position.y === game.global.box.height && direction === 'down') { game.entities.player.head.position.y = 0 }

                            if (game.entities.player.head.position.x === 0 - game.entities.player.styles.width && direction === 'left') { game.entities.player.head.position.x = game.global.box.width - game.entities.player.styles.width }
                        }
                    }

                    setInterval(() => {
                        if (game.status.run === false) { return null }
                        if (game.status.paused) { return null }

                        if (player.head.direction === 'up') {
                            player.events.clearPlayer(player)

                            setPositionHead('y', false)
                            setPositionTail('y', 'x', true)
                            verifyLimitBox('up')

                            player.events.renderPlayer(player)
                        }

                        if (player.head.direction === 'right') {
                            player.events.clearPlayer(player)

                            setPositionHead('x', true)
                            setPositionTail('x', 'y', false)
                            verifyLimitBox('right')

                            player.events.renderPlayer(player)
                        }

                        if (player.head.direction === 'down') {
                            player.events.clearPlayer(player)

                            setPositionHead('y', true)
                            setPositionTail('y', 'x', false)
                            verifyLimitBox('down')

                            player.events.renderPlayer(player)
                        }

                        if (player.head.direction === 'left') {
                            player.events.clearPlayer(player)

                            setPositionHead('x', false)
                            setPositionTail('x', 'y', true)
                            verifyLimitBox('left')

                            player.events.renderPlayer(player)
                        }
                    }, game.entities.player.speedLevel * 10);
                },
                
                eat: (player, food) => {
                    function increaseTail() {
                        let lastTailPosition = player.tail.trail.length - 1
                        player.tail.trail.push({
                            position: {
                                x: player.tail.trail[lastTailPosition].position.x,
                                y: player.tail.trail[lastTailPosition].position.y
                            }
                        })
                    }

                    setInterval(() => {
                        if (game.status.run === false) { return null }

                        if (player.head.position.x === food.position.x && player.head.position.y === food.position.y) {
                            food.generated = false
                            increaseTail()
                            player.ponctuation.show()
                        }
                    }, game.entities.player.speedLevel * 10);
                }
            },

            ponctuation: {
                content: document.querySelector('.ponctuation'),

                value: () => {
                    return game.entities.player.tail.trail.length
                },

                show: () => {
                    if (game.entities.player.ponctuation.value() < 10) {
                        game.entities.player.ponctuation.content.innerHTML = `00${game.entities.player.ponctuation.value()}pts`
                    } 
                    
                    else if (game.entities.player.ponctuation.value() < 100) {
                        game.entities.player.ponctuation.content.innerHTML = `0${game.entities.player.ponctuation.value()}pts`
                    }

                    else if (game.entities.player.ponctuation.value() >= 100) {
                        game.entities.player.ponctuation.content.innerHTML = `${game.entities.player.ponctuation.value()}pts`
                    }
                },

                record: 0
            }
        },



        food: {
            position: {
                x: 80,
                y: 80
            },

            styles: {
                color: `${themes.modes[localStorage.Theme].colorFood}`,
                width: 40,
                height: 40
            },

            generated: true,

            events: {
                renderFood: (food) => {
                    game.global.context.fillStyle = food.styles.color
                    game.global.context.fillRect(food.position.x, food.position.y, food.styles.width, food.styles.height)
                },

                generateFood: (food) => {
                    setInterval(() => {
                        if (game.status.run === false) { return null }

                        if (food.generated) { return null }

                        function newPosition() {
                            let generatePositionX = Math.floor(Math.random() * game.global.box.width)
                            food.position.x = generatePositionX - (generatePositionX % game.entities.player.styles.width)

                            let generatePositionY = Math.floor(Math.random() * game.global.box.height)
                            food.position.y = generatePositionY - (generatePositionY % game.entities.player.styles.height)
                        }

                        newPosition()

                        for (let i in game.entities.player.tail.trail) {
                            if (food.position.x === game.entities.player.tail.trail[i].position.x && food.position.y === game.entities.player.tail.trail[i].position.y || food.position.x === game.entities.player.head.position.x && food.position.y === game.entities.player.head.position.y) {
                                newPosition()
                                i = 0
                            }
                        }
                        
                        food.events.renderFood(food)

                        food.generated = true
                    }, game.entities.player.speedLevel * 10);
                }
            }
        }
    },

    

    commands: {
        moveUp: ['ArrowUp', 'w'],
        moveRight: ['ArrowRight', 'd'],
        moveDown: ['ArrowDown', 's'],
        moveLeft: ['ArrowLeft', 'a'],

        pause: 'Escape'
    },



    settings: {
        difficulty: {
            this: 'normal',

            buttons: {
                setDifficultyButton: document.querySelector('#select-difficulty')
            },

            setDifficulty: (settings) => {     
                function defineDifficulty() {
                    if (settings.difficulty.this === 'easy') {
                        game.entities.player.speedLevel = 10
                    } else if (settings.difficulty.this === 'normal') {
                        game.entities.player.speedLevel = 7
                    } else if (settings.difficulty.this === 'hard') {
                        game.entities.player.speedLevel = 4
                    }
                }
                              
                defineDifficulty()
                settings.difficulty.buttons.setDifficultyButton.addEventListener('change', (event) => {
                    settings.difficulty.this = event.target.value
                    defineDifficulty()
                })
            }
        },

        gameMode: {
            buttons: {
                setGameModeContainer: document.querySelectorAll('.container-set-game-mode'),
                optionWallsDontCollide: document.querySelector('#walls-dont-collide'),
                optionWallsCollide: document.querySelector('#walls-collide')
            },

            setGameMode: (settings) => {
                function defineGameMode() {
                    if (settings.gameMode.buttons.optionWallsDontCollide.checked) {
                        game.entities.box.collision = false
                    } else if (settings.gameMode.buttons.optionWallsCollide.checked) {
                        game.entities.box.collision = true
                    }
                }

                defineGameMode()
                settings.gameMode.buttons.setGameModeContainer.forEach((option) => {
                    option.addEventListener('click', () => {
                        defineGameMode()
                    })
                })
            }
        },

        getSettings: (settings) => {
            settings.difficulty.setDifficulty(settings)
            settings.gameMode.setGameMode(settings)
        }
    },

    events: {
        start: () => {
            document.querySelector('.settings-container').style.display = 'none'
            document.querySelector('.menu-top').style.display = 'flex'
            document.querySelector('.game-start-container').style.display = 'flex'
            setInterval(() => {
                if (game.entities.player.head.direction !== '') {
                    document.querySelector('.game-start-container').style.display = 'none'
                    clearInterval()
                }
            }, 100);

            game.status.run = true
        },
    
        gameOver: () => {
            function runGameOver() {
                game.status.gameOver = true
                game.status.run = false

                document.querySelector('.game-over-container').style.display = 'flex'

                window.addEventListener('keydown', (event) => {
                    if (event.keyCode === 32) {
                        location.reload()
                    }
                })
                clearInterval()
            }

            function verifyGameOver(playerX, playerY, object, collisionObject, entityPositionX, entityPositionY, entity2PositionX, entity2PositionY) {
                if (collisionObject) {
                    if (playerX === entityPositionX && playerY === entityPositionY && object === 'tail') {
                        runGameOver()
                    }

                    if ((playerX === entityPositionX || playerX === entity2PositionX || playerY === entityPositionY || playerY === entity2PositionY) && object === 'walls') {
                        runGameOver()
                    }
                }
            }

            setInterval(() => {
                for (let i in game.entities.player.tail.trail) {
                    verifyGameOver(game.entities.player.head.position.x, game.entities.player.head.position.y, 'tail', game.entities.player.tail.collision, game.entities.player.tail.trail[i].position.x, game.entities.player.tail.trail[i].position.y)
                }
                verifyGameOver(game.entities.player.head.position.x, game.entities.player.head.position.y, 'walls', game.entities.box.collision, 0 - game.entities.player.styles.height, 0 - game.entities.player.styles.width, game.global.box.width, game.global.box.height)
            }, game.entities.player.speedLevel * 10);
        }
    }
}

// ======================== // ======================== //

const global = game.global
global.box.width = 840
global.box.height = 840


const settings = game.settings
settings.getSettings(settings)


document.querySelector('.button-start-game').addEventListener('click', () => {
    const events = game.events
    events.start()


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


    events.gameOver()  
})