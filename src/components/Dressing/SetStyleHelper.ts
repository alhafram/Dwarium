export const SetStyleHelper = {
    magmarSchools: ['Огонь', 'Земля', 'Тень'],
    humanSchools: ['Воздух', 'Свет', 'Вода'],
    getStyleId(name: string | null): number {
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
        return 0
    },
    getSchool(style: string | null, currentSchool: string | null): string | null {
        if(!style || !currentSchool) {
            return null
        }
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
    getMagicIcon(magic: string | null): string {
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
        return 'Default'
    }
}