const box = document.querySelector('#box')
const context = box.getContext('2d')

context.fillStyle = `${themes.modes[localStorage.Theme].colorSnake}`
context.fillRect(50, 10, 5, 5)
context.fillRect(50, 16, 5, 5)
context.fillRect(50, 22, 5, 5)
context.fillRect(50, 28, 5, 5)
context.fillRect(50, 34, 5, 5)

context.fillStyle = `${themes.modes[localStorage.Theme].colorFood}`
context.fillRect(230, 100, 5, 5)
context.fillRect(51.5, 8, 2, 3)