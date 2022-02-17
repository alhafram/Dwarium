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

            'textGrey': '#7D7D7D',   // Rename
            'textGreyDark': '#EAEAEA',   // Rename
            'strokeGrey': '#E5E5E5', // Rename
            'strokeGreyDark': '#6C6C6C', // Rename
            'foodBackground': '#F7F7F7',
            'foodBackgroundDark': '#454545',

            'allFooBorderDark': '#3F3F3F',

            'w1': '#FF7629',
            'orange': '#FCC458',

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
