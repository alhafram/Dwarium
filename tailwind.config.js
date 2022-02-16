// eslint-disable-next-line no-undef
module.exports = {
    content: ['./gui/**/*.{html,js}', './src/**/*.ts'],
    darkMode: 'class',
    theme: {
        colors: {
            'transparent': 'transparent',
            'white': '#FFFFFF',
            'dark': '#2F2F2F',
            'lightDark': '#626262',

            'lightBlack': '#232323',

            'grey': '#808487',
            'lightGrey': '#F1F3F4',
            'secondaryLightGrey': '#FAFAFA',
            'mediumGrey': '#C8CACB',
            'secondaryMediumGrey': '#C4C4C4',

            'w1': '#FF7629',
            'orange': '#FCC458',

            'dividerColor': '#D5D4D8',
            'dividerColorDark': '#696969',
            
        },
        extend: {
            fontSize: {
                'xss': '9px'
            },
            spacing: {
                '5px': '5px',
                '25px': '25px'
            },
            fontFamily: {
                montserrat: ['Montserrat']
            },
            backgroundImage: { }
        },
    },
    plugins: [],
}
