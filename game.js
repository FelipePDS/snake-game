const box = document.querySelector('#box')
const context = box.getContext('2d')

context.fillStyle = `${themes.mode[localStorage.Theme].colorSnake}`
context.fillRect(50, 10, 5, 5)