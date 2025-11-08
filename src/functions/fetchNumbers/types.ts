export interface FetchNumbersEvent {
    queryStringParameters: {
        "session-id": string
    },
    httpMethod: string
}

export type Record = [number, number]

export type History = Record[]