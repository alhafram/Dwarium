import { Elements } from './Elements'
import '../Common/Utils'
import { StatsWindowState } from './StatsWindowState'
import { dispatch } from './preload'
import { StatsWindowActions } from './Actions'

function showFightInfo(url: string) {
    window.open(url, '', 'width=990,height=700,location=yes,menubar=yes,resizable=yes,scrollbars=yes,status=yes,toolbar=yes')
    return false
}

export async function render(initialState: StatsWindowState) {
    Elements.datePickerInput().value = initialState.selectedDate
    Elements.fightsCountSpan().textContent = '0'
    Array.from(Elements.selectedDayDropDiv().children).forEach((child) => {
        Elements.selectedDayDropDiv().removeChild(child)
    })
    Array.from(Elements.selectedDayFightsDiv().children).forEach((child) => {
        Elements.selectedDayFightsDiv().removeChild(child)
    })
    if(!initialState.selectedDateMoney) {
        Elements.moneySpan().textContent = '0'
        return
    }
    let money = initialState.selectedDateMoney as number
    money = parseInt(money.toString()) / 100
    Elements.moneySpan().textContent = money.toString()

    await Promise.all([renderItems(initialState), renderFights(initialState)])
}

async function renderItems(initialState: StatsWindowState) {
    const dropItems = initialState.selectedDateItems as any[]

    for(let i = 0; i < dropItems.length; i++) {
        const response = await fetch('http://w2.dwar.ru/artifact_info.php?artikul_id=' + dropItems[i].id)
        const text = await response.text()
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

async function renderFights(initialState: StatsWindowState) {
    for(let i = 0; i < initialState.selectedDayFightIds.length; i++) {
        const id = initialState.selectedDayFightIds[i]
        const fightUrl = `https://w2.dwar.ru/fight_info.php?fight_id=${id}`
        const response = await fetch(fightUrl)
        const text = await response.text()
        const doc = text.toDocument()

        const startDate =
            doc.querySelector(
                'body > table > tbody > tr:nth-child(2) > td > div > div.bg-l > div > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr > td:nth-child(1) > b'
            )?.textContent ?? 'Worng date'
        const title =
            doc.querySelector(
                'body > table > tbody > tr:nth-child(2) > td > div > div.bg-l > div > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr > td:nth-child(2) > b'
            )?.textContent ?? 'Wrong name'
        const duration =
            doc.querySelector(
                'body > table > tbody > tr:nth-child(2) > td > div > div.bg-l > div > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr > td:nth-child(5) > b'
            )?.textContent ?? 'Wrong duration'
        const formattedDate = startDate.split(' ').splice(-1, 1)[0]

        const strignElement = `<p class="text-secondaryLightDark dark:text-secondaryLight">${formattedDate} <a id='${id}' href='#'>${title}</a> ${duration}</p>`
        const parser = new DOMParser()
        const document = parser.parseFromString(strignElement, 'text/html')
        const fightInfoLink = document.getElementById(id) as HTMLLinkElement
        fightInfoLink.onclick = function() {
            showFightInfo(fightUrl)
        }
        const htmlElement = document.body.firstElementChild as HTMLElement
        Elements.selectedDayFightsDiv().appendChild(htmlElement)
    }
    Elements.fightsCountSpan().textContent = initialState.selectedDayFightIds.length.toString()
}

export function setupView() {
    Elements.datePickerInput().onchange = function() {
        dispatch(StatsWindowActions.CHANGE_DATE, Elements.datePickerInput().value)
    }
}
