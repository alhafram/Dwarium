import { ShopLoaderWindowActions } from './Actions'
import reduce from './Reducer'
import setupMode from '../../Services/DarkModeHandler'
import { render } from './Renderer'

export type EnergyItem = {
    id: string
    title: string
    color: string
    energy: number
}

export type ShopLoaderState = {
    energyItems: EnergyItem[]
}

let initialState: ShopLoaderState = {
    energyItems: []
}

export default async function dispatch(action: ShopLoaderWindowActions, data?: any) {
    initialState = await reduce(initialState, action, data)
    render(initialState)
}

document.addEventListener('DOMContentLoaded', async() => {
    setupMode()
    dispatch(ShopLoaderWindowActions.LOAD_CONTENT)
})
