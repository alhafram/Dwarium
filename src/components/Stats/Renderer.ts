import { Elements } from './Elements'
import '../Common/Utils'
import { StatsWindowState } from './StatsWindowState'
import { dispatch } from './preload'
import { StatsWindowActions } from './Actions'

export async function render(initialState: StatsWindowState) {
    Elements.datePickerInput().value = initialState.selectedDate
    for(const dropDiv of Array.from(Elements.selectedDayDropDiv().children)) {
        Elements.selectedDayDropDiv().removeChild(dropDiv)
    }
    if(!initialState.selectedDateDrop) {
        Elements.moneySpan().textContent = '0'
        return
    }
    let money = initialState.selectedDateDrop.money as number
    money = parseInt(money.toString()) / 100
    Elements.moneySpan().textContent = money.toString()

    const dropItems = initialState.selectedDateDrop.dropItems as any[]

    for(let i = 0; i < dropItems.length; i++) {
        const req = await fetch('http://w2.dwar.ru/artifact_info.php?artikul_id=' + dropItems[i].id)
        const text = await req.text()
        const img = text
            .toDocument()
            .querySelector(
                'body > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > div.bg-l > div > div > div > div > div > div > div > table:nth-child(1) > tbody > tr:nth-child(2) > td.tbl-usi_bg > table > tbody > tr:nth-child(1) > td:nth-child(1) > table'
            )
            ?.getAttribute('background')
        const url = 'http://w2.dwar.ru/' + img
        const count = dropItems[i].num
        let counterElement = ''
        if(count) {
            counterElement =
                parseInt(count) > 1
                    ? `<p class=" h-5 w-12 border text-secondaryLightDark dark:text-secondaryLight font-extrabold font-montserrat text-xs leading-normal bg-white dark:bg-dark mt-auto ml-auto mr-auto rounded-full border-lightMediumGrey dark:border-secondaryDark text-center">${count}</p>`
                    : ''
        }
        const html = `
        <div class="h-20 w-20 flex flex-col bg-no-repeat rounded-3xl bg-cover" style="background-image: url(${url})">
            ${counterElement}
        </div>
        `
        const parser = new DOMParser()
        const element = parser.parseFromString(html, 'text/html')
        const itemDiv = element.body.firstElementChild as HTMLDivElement

        Elements.selectedDayDropDiv().appendChild(itemDiv)
    }
}

export function setupView() {
    Elements.datePickerInput().onchange = function() {
        dispatch(StatsWindowActions.CHANGE_DATE, Elements.datePickerInput().value)
    }
}
