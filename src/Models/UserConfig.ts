import { FoodSettings } from "./FoodSettings"
import { DressingSet } from "./DressingSet"

export type UserConfig = {
    id: number
    hpFood: FoodSettings | null
    mpFood: FoodSettings | null
    sets: DressingSet[]
}