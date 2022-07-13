import DropService from '../../services/DropService'
import { StatsWindowActions } from './Actions'
import { StatsWindowState } from './StatsWindowState'

export default function reduce(state: StatsWindowState, action: StatsWindowActions, data?: unknown): StatsWindowState {
    switch (action) {
        case StatsWindowActions.LOAD_SETTINGS: {
            const dropInfo = DropService.loadDropInfo()
            const currentDate = new Date()
            let month = (currentDate.getMonth() + 1).toString()
            if(parseInt(month) < 10) {
                month = '0' + month
            }
            let day = currentDate.getDate().toString()
            if(parseInt(day) < 10) {
                day = '0' + day
            }
            const formattedDate = currentDate.getFullYear() + '-' + month + '-' + day
            return {
                ...state,
                dropInfo,
                selectedDate: formattedDate,
                selectedDateDrop: dropInfo[currentDate.toDateString()]
            }
        }
        case StatsWindowActions.CHANGE_DATE: {
            if(!data) {
                return state
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const selectedDate = new Date(data).toDateString()
            return {
                ...state,
                selectedDate: data as string,
                selectedDateDrop: state.dropInfo[selectedDate]
            }
        }
    }
}
