import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useHomeStore = defineStore('homeStore', () => {
    const weatherType = ref<string>('sunny')
    const activeMenuItem = ref<string>('/')

    const temperature = ref<string>('25°C')

    const location = ref<string | {
        city: string,
        province: string
    }>('未知')


    return {
        weatherType,
        activeMenuItem,
        temperature,
        location,
    }
})
