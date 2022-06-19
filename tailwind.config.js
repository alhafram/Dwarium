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
            
            'greenFilderBorder': '#80B773',
            'greenFilderBg': '#C9F3BF',

            'blueFilderBorder': '#738EB7',
            'blueFilderBg': '#BFDAF3',

            'purpleFilterBorder': '#9973B7',
            'purpleFilterBg': '#D6BFF3',

            'redFilterBorder': '#B77373',
            'redFilterBg': '#F3BFBF',
            'red': '#FF0000'
        },
        extend: {
            fontSize: {
                'xss': '10px'
            },
            spacing: {
                '5px': '5px',
                '25px': '25px',
                '70px': '70px',
                'inherit': 'inherit'
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
            borderRadius: {
                '30px': '30px'
            },
            backgroundImage: { }
        },
    },
    plugins: [],
}
