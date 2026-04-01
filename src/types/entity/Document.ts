export interface Document {
    text: string
    metadata: Metadata
}

interface Metadata {
    distance: number
    page: number
    bookId: number
    url: string
    name: string
}