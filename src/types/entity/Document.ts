export interface Document {
    text: string
    metadata: Metadata
    score: number
}

interface Metadata {
    id: string
    distance: number
    page: number
    bookId: number
    url: string
    name: string
    bbox: string
}