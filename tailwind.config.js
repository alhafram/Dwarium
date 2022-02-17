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
            'secondaryLightDark': '#7D7D7D',
            'secondaryDark': '#6C6C6C',

            'lightBlack': '#232323',
            'secondaryBlack': '#454545',

            'grey': '#808487',
            'lightGrey': '#F1F3F4',
            'secondaryLightGrey': '#FAFAFA',
            'lightMediumGrey': '#E5E5E5',
            'mediumGrey': '#C8CACB',
            'secondaryMediumGrey': '#C4C4C4',

            'light': '#F7F7F7',
            'secondaryLight': '#EAEAEA',

            'w1': '#FF7629',
            'orange': '#FCC458',
            'allFooBorderDark': '#3F3F3F',

            'dividerColor': '#D5D4D8',
            'dividerColorDark': '#696969',
            
        },
        extend: {
            fontSize: {
                'xss': '10px'
            },
            spacing: {
                '5px': '5px',
                '25px': '25px'
            },
            fontFamily: {
                montserrat: ['Montserrat']
            },
            lineHeight: {
                '0': '0'
            },
            gridTemplateColumns: {
                'auto-fit': 'repeat(auto-fill, minmax(80px, 1fr))'
            },
            backgroundImage: { }
        },
    },
    plugins: [],
}
