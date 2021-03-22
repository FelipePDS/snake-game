const themes = {
    modes : {
        light: {
            colorBackground: '#f4f4f8',
            colorBox: '#ffffff',
            colorBorderBox: '#2c2c3a1c',
            colorBorderBoxSecondary: '#2f2f41',
            colorSnake: '#3cfd93',
            colorHead: '#3cfd93',
            colorFood: '#f36565',
            colorButtonPrimary: '#3cfd93',
            colorButtonSecondary: '#f36565',
            colorButtonTertiary: '#3cfd93',
            colorButtonTertiaryDarker: '#27d374',
            colorMessage: '#ffeb33',
            colorSettingsBox: '#252533',
            colorScreenMask: '#00000054',
            colorTextPrimary: '#ffffff',
            colorTextSecondary: '#a1a3a8',
            colorTitle: '#c7c7d3',
            colorItemActived: '#ffeb33',
            colorItemDesactived: '#c7c7d3',
            colorInputBackground: '#30303f',
            colorScrollBar: '#2f2f3f',
            colorBackgroundPopUp: '#ffffff'
        },
    
        dark: {
            colorBackground: '#262633',
            colorBox: '#2d2d3d',
            colorBorderBox: '#2c2c3a4d',
            colorBorderBoxSecondary: '#2f2f41',
            colorSnake: '#3cfd93',
            colorHead: '#3cfd93',
            colorFood: '#f36565',
            colorButtonPrimary: '#25c080',
            colorButtonSecondary: '#e05b5b',
            colorButtonTertiary: '#3cfd93',
            colorButtonTertiaryDarker: '#27d374',
            colorMessage: '#ffd700',
            colorSettingsBox: '#252533',
            colorScreenMask: '#00000054',
            colorTextPrimary: '#ffffff',
            colorTextSecondary: '#a1a3a8',
            colorTitle: '#c7c7d3',
            colorItemActived: '#ffeb33',
            colorItemDesactived: '#c7c7d3',
            colorInputBackground: '#30303f',
            colorScrollBar: '#2f2f3f',
            colorBackgroundPopUp: '#252533'
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

    game.entities.box.events.renderBox()
})

if (localStorage.Theme === undefined) localStorage.setItem('Theme', 'dark')
setTheme(localStorage.Theme)
localStorage.Theme === 'dark' ? themes.buttons.buttonSetTheme.checked = true : themes.buttons.buttonSetTheme.checked = false