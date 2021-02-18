const themes = {
    mode : {
        light: {
            colorBackground: '#f4f4f8',
            colorBox: '#ffffff',
            colorBorderBox: '#2c2c3a1c',
            colorSnake: '#3cfd93',
            colorFood: '#f36565',
            colorButton: '#51b0fd'
        },
    
        dark: {
            colorBackground: '#262633',
            colorBox: '#2d2d3d',
            colorBorderBox: '#2c2c3a4d',
            colorSnake: '#3cfd93',
            colorFood: '#f36565',
            colorButton: '#51b0fd'
        }
    },

    buttons: {
        containerSetTheme: document.querySelector('.container-set-theme'),
        buttonSetTheme: document.querySelector('.button-set-theme')
    }
}

function setTheme(newTheme) {
    const theme = themes.mode[newTheme]

    Object.keys(theme).map((key) => {
        document.querySelector('html').style.setProperty(`--${key}`, theme[key])
    })
}

themes.buttons.containerSetTheme.addEventListener('click', () => {
    localStorage.setItem('Theme', themes.buttons.buttonSetTheme.checked ? 'dark' : 'light')
    setTheme(localStorage.Theme)
})

setTheme(localStorage.Theme)
localStorage.Theme === 'dark' ? themes.buttons.buttonSetTheme.checked = true : themes.buttons.buttonSetTheme.checked = false