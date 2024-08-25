// export type SudokuMode = 'easy' | 'normal' | 'hard' | 'expert'

export enum SudokuMode {
    easy,
    normal,
    hard,
    expert
}

export const getModeName = (value: number) => {
    switch (value) {
        case SudokuMode.easy: return 'easy'
        case SudokuMode.normal: return 'normal'
        case SudokuMode.hard: return 'hard'
        case SudokuMode.expert: return 'expert'
        default: return 'easy'
    }
}

