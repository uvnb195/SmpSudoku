export interface StackProps {
    key: string,
    value: number
}

export class LogStack {
    private values: Array<StackProps>

    constructor(values: StackProps[] = []) {
        this.values = values
    }

    set = (key: string, value: number) => {
        const list = this.values.map(({ key }) => key)
        if (list.includes(key)) {
            const index = list.indexOf(key)
            const newStack = [...this.values.slice(0, index), ...this.values.slice(index + 1)]
            this.values = [...newStack, { key, value }]
        } else {
            this.values = [...this.values, { key, value }]
        }
    }

    get = (key: string) => {
        const list = this.values.map(({ key }) => key)
        if (list.includes(key)) {
            const index = list.indexOf(key)
            return {
                index: index,
                value: this.values[index].value
            }
        }
        return null
    }

    getAll = () => {
        return this.values
    }

    remove = (key: string) => {
        const check = this.get(key)
        if (check !== null) {
            this.values = [
                ...this.values.slice(0, check.index),
                ...this.values.slice(check.index + 1)]
        }
    }

    getIndexFromKey = (key: string) => {
        return {
            row: Number(key[0]),
            col: Number(key[1])
        }
    }

    pop = () => {
        const length = this.length()
        const value = this.values[length - 1]
        this.values = [...this.values.slice(0, length - 1)]
        return value
    }

    length = () => {
        return this.values.length
    }
}