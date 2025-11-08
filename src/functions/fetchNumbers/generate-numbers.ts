import { min, random } from "lodash"
import { History, Record } from "./types"

const generateNumbers = (history: History): Record => {
    // check how many non-matches there have been in a row
    let nonMatches = 0
    for (let i = history.length - 1; i >= 0; i--) {
        const [a, b] = history[i]
        if (a !== b) {
            nonMatches++
        } else {
            break
        }
    }

    // if there have been 5 non-matches in a row, increase the odds of a match
    if (nonMatches >= 5) {
        const modifier = min([(nonMatches - 4) * 10, 99])

        const subtractFromEnd = random(0, modifier)
        const addToStart = modifier - subtractFromEnd

        const numA = random(1 + addToStart, 100 - subtractFromEnd)
        const numB = random(1 + addToStart, 100 - subtractFromEnd)

        return [numA, numB]
    }

    const numA = random(1, 100)
    const numB = random(1, 100)

    return [numA, numB]
}

export default generateNumbers;