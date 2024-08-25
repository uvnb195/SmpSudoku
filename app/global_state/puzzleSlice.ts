import { SudokuMode } from "@/constants/SudokuMode";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface PuzzleState {
    based: number[][]
    solved: number[][],
    hints: boolean[][][],
    note: boolean,
    showModal: boolean,
    position: {
        x: number,
        y: number,
        row: number,
        col: number,
    },
    valueSelected?: number,
    showError?: boolean,
    mode: SudokuMode
}

const resetIndex = {
    x: -1,
    y: -1,
}

const resetArray = Array(9).fill(0).map(_ => Array(9).fill(0))
const resetHints = Array(9).fill(0).map(_ => Array(9).fill(0).map(_ => Array(9).fill(false)))

const initialState: PuzzleState = {
    based: resetArray,
    solved: resetArray,
    hints: resetHints,
    note: false,
    showModal: false,
    position: {
        ...resetIndex,
        row: -1,
        col: -1
    },
    showError: false,
    mode: SudokuMode.easy
}

interface NumberType {
    index: { i: number, j: number },
    value: number
}

const puzzleSlice = createSlice({
    name: 'puzzle',
    initialState,
    reducers: {
        createBased:
            (state, action: PayloadAction<{
                puzzle: number[][],
                note: boolean,
                mode: SudokuMode
            }>) => {
                state.based = action.payload.puzzle
                state.note = action.payload.note
                state.mode = action.payload.mode
            },
        createHints:
            (state, action: PayloadAction<boolean[][][]>) => {
                state.hints = action.payload
            },
        createSolved:
            (state, action: PayloadAction<number[][]>) => {
                state.solved = action.payload
            },
        setEnableNote:
            (state, action: PayloadAction<boolean>) => {
                state.note = action.payload
            },
        updatePosition:
            (state, action: PayloadAction<{
                position: {
                    x: number,
                    y: number,
                    row: number,
                    col: number,
                    valueSelected?: number
                }
            }>) => {
                state.position = action.payload.position
                state.valueSelected = action.payload.position.valueSelected || undefined
            },
        addNumber:
            (state, action: PayloadAction<number>) => {
                const { row, col } = state.position
                const value = action.payload

                if (state.note) {
                    // check note enable, if true add to hints list
                    const oldValue =
                        state.hints[row][col][value - 1]

                    state.hints[row][col][value - 1] = !oldValue
                    state.valueSelected = undefined
                } else {
                    state.solved[row][col]
                        = value
                    state.valueSelected = value
                }
                state.position = {
                    ...state.position,
                    ...resetIndex
                }
            },
        setShowError:
            (state, action: PayloadAction<boolean>) => {
                state.showError = action.payload
            },
        deleteNumber: (state) => {
            const { row, col } = state.position
            if (state.note) {
                state.hints[row][col] = Array(9).fill(false)
            } else {
                state.solved[row][col] = 0
            }
        },
        changeMode:
            (state, action: PayloadAction<SudokuMode>) => {
                state.mode = action.payload
                // reset puzzle
                state.based = resetArray
                state.solved = resetArray
                state.hints = resetHints
                state.position = {
                    ...resetIndex,
                    col: -1,
                    row: -1,
                }
                state.valueSelected = undefined
            }
    }
})

export const {
    createBased,
    createSolved,
    addNumber,
    setEnableNote,
    updatePosition,
    createHints,
    setShowError,
    deleteNumber,
    changeMode
} = puzzleSlice.actions

export default puzzleSlice.reducer