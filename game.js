const game = {
    global: {
        box: document.querySelector('#box'),
        context: this.box.getContext('2d'),

        audios: {
            playerUpdate: new Audio('assets/audios/player-update.mp3'),
            gameOver: new Audio('assets/audios/game-over.mp3'),
            gameOverContinue: new Audio('assets/audios/game-over-continue.wav')
        }
    },

    status: {
        run: false,

        buttonStatusGame: document.querySelector('#statusGame'),
        paused: false,
        gamePausedContainer: document.querySelector('.game-paused-container'),
        pause: (status) => {
            if (!game.status.run) { return null }

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
                    x: 520,
                    y: 520
                },

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
                width: 40,
                height: 40
            },

            events: {
                renderPlayer: (player) => {
                    game.global.context.fillStyle = player.styles.color
                    game.global.context.fillRect(player.head.position.x, player.head.position.y, player.styles.width, player.styles.height)
                    game.global.context.strokeStyle = `${themes.modes[localStorage.Theme].colorBox}`
                    game.global.context.strokeRect(player.head.position.x, player.head.position.y, player.styles.width, player.styles.height)

                    let greenColorVariance = 253
                    for (let i in player.tail.trail) {
                        if (greenColorVariance > 135) { greenColorVariance -= 4 }
                        game.global.context.fillStyle = `rgb(60, ${greenColorVariance}, 147)`
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
                        if (!game.status.run) { return null }
                        if (game.status.paused) { return null }

                        const keyName = event.key
                
                        if (game.commands.moveUp.indexOf(keyName) > -1 && player.head.direction !== 'down') { player.head.direction = 'up' }

                        if (game.commands.moveRight.indexOf(keyName) > -1 && player.head.direction !== 'left') { player.head.direction = 'right' }

                        if (game.commands.moveDown.indexOf(keyName) > -1 && player.head.direction !== 'up') { player.head.direction = 'down' }

                        if (game.commands.moveLeft.indexOf(keyName) > -1 && player.head.direction !== 'right') { player.head.direction = 'left' }
                    })
                },

                crawl: (player) => {
                    function setPositionHead(axisChanged, axisIncreases) {
                        if (axisIncreases) {
                            player.head.position[axisChanged] += player.styles.width
                        } else {
                            player.head.position[axisChanged] -= player.styles.width
                        }
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

                    function playerInBoxLimit(direction) {
                        if (game.entities.box.collision === false) {
                            if (player.head.position.y === 0 - player.styles.height && direction === 'up') { player.head.position.y = game.global.box.height - player.styles.height }

                            if (player.head.position.x === game.global.box.width && direction === 'right') { player.head.position.x = 0 }

                            if (player.head.position.y === game.global.box.height && direction === 'down') { player.head.position.y = 0 }

                            if (player.head.position.x === 0 - player.styles.width && direction === 'left') { player.head.position.x = game.global.box.width - player.styles.width }
                        }
                    }

                    setInterval(() => {
                        if (!game.status.run) { return null }
                        if (game.status.paused) { return null }

                        if (player.head.direction === 'up') {
                            player.events.clearPlayer(player)

                            setPositionHead('y', false)
                            setPositionTail('y', 'x', true)
                            playerInBoxLimit('up')

                            player.events.renderPlayer(player)
                        }

                        if (player.head.direction === 'right') {
                            player.events.clearPlayer(player)

                            setPositionHead('x', true)
                            setPositionTail('x', 'y', false)
                            playerInBoxLimit('right')

                            player.events.renderPlayer(player)
                        }

                        if (player.head.direction === 'down') {
                            player.events.clearPlayer(player)

                            setPositionHead('y', true)
                            setPositionTail('y', 'x', false)
                            playerInBoxLimit('down')

                            player.events.renderPlayer(player)
                        }

                        if (player.head.direction === 'left') {
                            player.events.clearPlayer(player)

                            setPositionHead('x', false)
                            setPositionTail('x', 'y', true)
                            playerInBoxLimit('left')

                            player.events.renderPlayer(player)
                        }
                    }, game.entities.player.speedLevel * 10);
                },
                
                eat: (player, food) => {
                    setInterval(() => {
                        if (!game.status.run) { return null }

                        if (player.head.position.x === food.position.x && player.head.position.y === food.position.y) {
                            food.generated = false

                            player.tail.trail.push({
                                position: {
                                    x: player.tail.trail[player.tail.trail.length - 1].position.x,
                                    y: player.tail.trail[player.tail.trail.length - 1].position.y
                                }
                            })

                            game.global.audios.playerUpdate.play()

                            player.ponctuation.show()
                        }
                    }, game.entities.player.speedLevel * 10);
                }
            },

            ponctuation: {
                content: document.querySelector('.ponctuation'),

                value: () => { return game.entities.player.tail.trail.length },

                show: () => {
                    if (game.entities.player.ponctuation.value() < 10) {
                        game.entities.player.ponctuation.content.innerHTML = `00${game.entities.player.ponctuation.value()}pts`
                    } else if (game.entities.player.ponctuation.value() < 100) {
                        game.entities.player.ponctuation.content.innerHTML = `0${game.entities.player.ponctuation.value()}pts`
                    } else {
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
                        function checkPositionFood() {
                            game.entities.player.tail.trail.forEach(trail => {
                                if (food.position.x === trail.position.x && food.position.y === trail.position.y) {
                                    food.generated = false
                                }
                            })
                            if (food.position.x === game.entities.player.head.position.x && food.position.y === game.entities.player.head.position.y) {
                                food.generated = false
                            }
                        }

                        if (!game.status.run) { return null }

                        checkPositionFood()

                        if (food.generated) { return null }                        

                        food.generated = true

                        let generatePositionX = Math.floor(Math.random() * game.global.box.width)
                        food.position.x = generatePositionX - (generatePositionX % game.entities.player.styles.width)
                        let generatePositionY = Math.floor(Math.random() * game.global.box.height)
                        food.position.y = generatePositionY - (generatePositionY % game.entities.player.styles.height)

                        checkPositionFood()
                        
                        if (food.generated) { food.events.renderFood(food) }
                    })
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
        container: {
            customizeButton: document.querySelector('.customize-button'),
            commandsButton: document.querySelector('.commands-button'),

            customizeSettingsContainer: document.querySelector('.customize-settings-container'),
            commandsSettingsContainer: document.querySelector('.commands-settings-container'),

            switchContainer: (settings) => {
                function setSettingsContainerActived(buttonActived, buttonDesactived, containerActived, containerDesactived) {
                    buttonDesactived.addEventListener('click', () => {
                        buttonDesactived.setAttribute('id', 'actived')
                        buttonActived.setAttribute('id', 'desactived')
    
                        containerDesactived.style.display = 'flex'
                        containerActived.style.display = 'none'
                    })
                }

                setSettingsContainerActived(settings.container.commandsButton, settings.container.customizeButton, settings.container.commandsSettingsContainer, settings.container.customizeSettingsContainer)

                setSettingsContainerActived(settings.container.customizeButton, settings.container.commandsButton, settings.container.customizeSettingsContainer, settings.container.commandsSettingsContainer)
            }
        },

        difficulty: {
            this: 'normal',

            buttons: {
                setDifficultyButton: document.querySelector('#select-difficulty')
            },

            setDifficulty: (settings) => {     
                function defineDifficulty() {
                    if (settings.difficulty.this === 'easy') {
                        game.entities.player.speedLevel = 10
                        settings.appliedsSettings.setContainerAppliedsSettings(game.settings.appliedsSettings.popUps.showDifficulty, '#3cfd93', 'Easy')
                    } else if (settings.difficulty.this === 'normal') {
                        game.entities.player.speedLevel = 7.5
                        settings.appliedsSettings.setContainerAppliedsSettings(game.settings.appliedsSettings.popUps.showDifficulty, '#ffeb33', 'Normal')
                    } else if (settings.difficulty.this === 'hard') {
                        game.entities.player.speedLevel = 6.5
                        settings.appliedsSettings.setContainerAppliedsSettings(game.settings.appliedsSettings.popUps.showDifficulty, '#f36565', 'Hard')
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
            this: '',

            buttons: {
                setGameModeContainer: document.querySelectorAll('.container-set-game-mode'),
                optionWallsDontCollide: document.querySelector('#walls-dont-collide'),
                optionWallsCollide: document.querySelector('#walls-collide')
            },

            setGameMode: (settings) => {
                function defineGameMode() {
                    if (settings.gameMode.buttons.optionWallsDontCollide.checked) {
                        game.entities.box.collision = false
                        settings.gameMode.this = 'walls-dont-collide'
                        settings.appliedsSettings.setContainerAppliedsSettings(game.settings.appliedsSettings.popUps.showGameMode, '#f36565', 'Walls dont collide')
                    } else if (settings.gameMode.buttons.optionWallsCollide.checked) {
                        game.entities.box.collision = true
                        settings.gameMode.this = 'walls-collide'
                        settings.appliedsSettings.setContainerAppliedsSettings(game.settings.appliedsSettings.popUps.showGameMode, '#3cfd93', 'Walls collide')
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

        appliedsSettings: {
            popUps: {
                showAppliedsSettingsContainer: document.querySelector('.show-applieds-settings-container'),
                showDifficulty: document.querySelector('.show-difficulty'),
                showGameMode: document.querySelector('.show-game-mode')
            },

            setContainerAppliedsSettings: (container, color, text) => {
                container.style.color = color
                container.style.borderColor = color
                container.innerHTML = text
            },

            showAppliedsSettings: () => {
                game.settings.appliedsSettings.popUps.showAppliedsSettingsContainer.style.display = 'flex'
            }
        },

        getSettings: (settings) => {
            settings.container.switchContainer(settings)
            settings.difficulty.setDifficulty(settings)
            settings.gameMode.setGameMode(settings)
        }
    },

    events: {
        start: () => {
            document.querySelector('.settings-container').style.display = 'none'
            document.querySelector('.game-start-container').style.display = 'flex'
            game.settings.appliedsSettings.showAppliedsSettings()
            const starting = setInterval(() => {
                if (game.entities.player.head.direction !== '') {
                    document.querySelector('.game-start-container').style.display = 'none'
                    clearInterval(starting)
                }
            }, 100);

            game.status.run = true
        },
    
        gameOver: () => {
            function verifyGameOver(playerX, playerY, object, collisionObject, entityPositionX, entityPositionY, entity2PositionX, entity2PositionY) {
                if (collisionObject) {
                    if ((playerX === entityPositionX && playerY === entityPositionY && object === 'tail') || ((playerX === entityPositionX || playerX === entity2PositionX || playerY === entityPositionY || playerY === entity2PositionY) && object === 'walls')) {
                        game.status.gameOver = true
                        game.status.run = false

                        game.global.audios.gameOver.play()
                        setTimeout(() => {
                            game.global.audios.gameOverContinue.play()
                        }, game.global.audios.gameOver.duration);

                        document.querySelector('.game-over-container').style.display = 'flex'
                    }
                }
            }

            const checkingGameOver = setInterval(() => {
                for (let i in game.entities.player.tail.trail) {
                    verifyGameOver(game.entities.player.head.position.x, game.entities.player.head.position.y, 'tail', game.entities.player.tail.collision, game.entities.player.tail.trail[i].position.x, game.entities.player.tail.trail[i].position.y)
                }
                verifyGameOver(game.entities.player.head.position.x, game.entities.player.head.position.y, 'walls', game.entities.box.collision, 0 - game.entities.player.styles.height, 0 - game.entities.player.styles.width, game.global.box.width, game.global.box.height)

                if (game.status.gameOver) {
                    clearInterval(checkingGameOver)
                    window.addEventListener('keydown', (event) => {
                        if (event.key === ' ') { location.reload() }
                    })
                }
            }, game.entities.player.speedLevel * 10);
        }
    }
}

// ======================== // ======================== //

const global = game.global
global.box.width = 720
global.box.height = 720


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