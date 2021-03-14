const themes = {
    modes : {
        light: {
            colorBackground: '#f4f4f8',
            colorBox: '#ffffff',
            colorBorderBox: '#2c2c3a1c',
            colorSnake: '#3cfd93',
            colorFood: '#f36565',
            colorButtonPrimary: '#3cfd93',
            colorButtonSecondary: '#f36565',
            colorMessage: '#ffeb33'
        },
    
        dark: {
            colorBackground: '#262633',
            colorBox: '#2d2d3d',
            colorBorderBox: '#2c2c3a4d',
            colorSnake: '#3cfd93',
            colorFood: '#f36565',
            colorButtonPrimary: '#25c080',
            colorButtonSecondary: '#e05b5b',
            colorMessage: '#ffd700'
        }
    },

    buttons: {
        containerSetTheme: document.querySelector('.container-set-theme'),
        buttonSetTheme: document.querySelector('.button-set-theme')
    }
}

function setTheme(newTheme) {
    const theme = themes.modes[newTheme]

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