module.exports = {
    content: ["./gui/**/*.{html,js}"],
    darkMode: 'class',
    theme: {
        colors: {
            'backgroundColor': '#FFFFFF',
            'backgroundColorDark': '#2F2F2F',
            'inputBackgroundColor': '#F1F3F4',
            'inputBackgroundColorDark': '#232323',
            'iconColor': '#808487',
            'iconColorDark': '#C8CACB',
            'disabledButton': '#C8CACB',
            'disabledButtonDark': '#808487',
            'textColor': '#2F2F2F',
            'textColorDark': '#FAFAFA',
            'w1': '#FF7629',
            'white': '#FFFFFF',
            'activeTabColor': '#2F2F2F',
            'inactiveTabColor': '#C4C4C4',
            'activeTabColorDark': '#FAFAFA',
            'inactiveTabColorDark': '#C8CACB',
            'addTabDarkHover': '#0C0C0C'
        },
        extend: {
            width: {
                'switcher': '54px',
                '5.5': '25px',
                '100px': '100px',
                '150px': '150px'
            },
            height: {
              '5.5': '25px'
            },
            fontSize: {
              'xss': '9px'
            },
            spacing: {
              '5px': '5px',
              '6px': '6px',
              '7px': '7px',
              '9px': '9px',
              '10px': '10px',
              '13px': '13px',
              '25px': '25px',
              '26px': '26px',
              '30px': '30px',
              '220px': '220px',
              '300px': '300px'
            },
            minWidth: {
              '150px': '150px',
            },
            backgroundImage: {
              'closeButton': "url('../src/Styles/closeButton.svg')"
            }
        },
    },
    plugins: [],
}
