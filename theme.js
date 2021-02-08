const themes = {
    light: {
        colorBackground: '#f7f7fc',
        colorBox: '#ffffff',
        colorBorderBox: '#2c2c3a4d',
        colorSnake: '#14f77a',
        colorFood: '#ee3d3d',
        colorButton: '#21212b80'
    },

    dark: {
        colorBackground: '#262633',
        colorBox: '#2d2d3d',
        colorBorderBox: '#2c2c3a4d',
        colorSnake: '#14f77a',
        colorFood: '#ee3d3d',
        colorButton: '#494964'
    }
}

const containerSetTheme = document.querySelector('.container-set-theme')
const buttonSetTheme = document.querySelector('.button-set-theme')

function setTheme(newTheme) {
    const theme = themes[newTheme]

    Object.keys(theme).map((key) => {
        document.querySelector('html').style.setProperty(`--${key}`, theme[key])
    })
}

containerSetTheme.addEventListener('click', () => {
    localStorage.setItem('Theme', buttonSetTheme.checked ? 'dark' : 'light')
    setTheme(localStorage.Theme)
})

setTheme(localStorage.Theme)
localStorage.Theme === 'dark' ? buttonSetTheme.checked = true : buttonSetTheme.checked = false