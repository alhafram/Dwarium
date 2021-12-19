const SetStyleHelper = {
    magmarSchools: ['Огонь', 'Земля', 'Тень'],
    humanSchools: ['Воздух', 'Свет', 'Вода'],
    getStyleId(name) {
        if(name == 'Огонь') {
            return 8
        }
        if(name == 'Воздух') {
            return 1
        }
        if(name == 'Земля') {
            return 16
        }
        if(name == 'Вода') {
            return 2
        }
        if(name == 'Тень') {
            return 32
        }
        if(name == 'Свет') {
            return 4
        }
    },
    getSchool(style, currentSchool) {
        if(SetStyleHelper.magmarSchools.includes(currentSchool)) {
            if(style == 'Костолом') {
                return 'Огонь'
            }
            if(style == 'Тяжеловес') {
                return 'Земля'
            }
            if(style == 'Ловкач') {
                return 'Тень'
            }
        }
        if(SetStyleHelper.humanSchools.includes(currentSchool)) {
            if(style == 'Костолом') {
                return 'Воздух'
            }
            if(style == 'Тяжеловес') {
                return 'Вода'
            }
            if(style == 'Ловкач') {
                return 'Свет'
            }
        }
        return null
    },
    getMagicIcon(magic) {
        if(magic == 'Огонь') {
            return 'Fire'
        }
        if(magic == 'Земля') {
            return 'Earth'
        }
        if(magic == 'Тень') {
            return 'Dark'
        }
        if(magic == 'Воздух') {
            return 'Wind'
        }
        if(magic == 'Вода') {
            return 'Water'
        }
        if(magic == 'Свет') {
            return 'Light'
        }
        return "Default"
    }
}