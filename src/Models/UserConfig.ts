import { FoodSettings } from "./FoodSettings"

export type UserConfig = {
    id: number
    hpFood: FoodSettings | null
    mpFood: FoodSettings | null
}