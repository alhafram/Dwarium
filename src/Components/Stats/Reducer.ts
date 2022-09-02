import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import DropService from '../../Services/DropService'
import { StatsWindowActions } from './Actions'
import { StatsWindowState } from './StatsWindowState'

export default async function reduce(state: StatsWindowState, action: StatsWindowActions, data?: unknown): Promise<StatsWindowState> {
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
            const baseUrl = await ipcRenderer.invoke(Channel.GET_MAIN_URL)
            return {
                ...state,
                dropInfo,
                selectedDate: formattedDate,
                selectedDateMoney: dropInfo[currentDate.toDateString()]?.money ?? 0,
                selectedDateItems: dropInfo[currentDate.toDateString()]?.dropItems ?? [],
                selectedDayFightIds: dropInfo[currentDate.toDateString()]?.fightIds ?? [],
                baseUrl: baseUrl
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
                selectedDateMoney: state.dropInfo[selectedDate]?.money ?? 0,
                selectedDateItems: state.dropInfo[selectedDate]?.dropItems ?? [],
                selectedDayFightIds: state.dropInfo[selectedDate]?.fightIds ?? []
            }
        }
    }
}
