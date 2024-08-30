import { LogStack, StackProps } from "@/constants/LogStack";
import { SudokuMode } from "@/constants/SudokuMode";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface PuzzleState {
    rootPuzzle: number[][],
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
    mode: SudokuMode,
    hintRemaining: number,
    backLogs: StackProps[]
}

const resetIndex = {
    x: -1,
    y: -1,
}

const resetArray = Array(9).fill(0).map(_ => Array(9).fill(0))
const resetHints = Array(9).fill(0).map(_ => Array(9).fill(0).map(_ => Array(9).fill(false)))

const initialState: PuzzleState = {
    rootPuzzle: resetArray,
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
    valueSelected: undefined,
    mode: SudokuMode.easy,
    hintRemaining: 0,
    backLogs: []
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
                root: number[][],
                puzzle: number[][],
                note: boolean,
                mode: SudokuMode,
                hintRemaining: number
            }>) => {
                state.hintRemaining = action.payload.hintRemaining
                state.rootPuzzle = action.payload.root
                state.based = action.payload.puzzle
                state.solved = action.payload.puzzle
                state.note = action.payload.note
                state.mode = action.payload.mode
            },
        createHints:
            (state, action: PayloadAction<boolean[][][]>) => {
                state.hints = action.payload
            },
        createSolved:
            (state, action: PayloadAction<{
                list: number[][],
                backLogs: StackProps[]
            }>) => {
                state.solved = action.payload.list
                state.backLogs = action.payload.backLogs
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

                    // backlogs stack
                    const backLogs = new LogStack(state.backLogs)
                    backLogs.set(`${row}${col}`, value)
                    state.backLogs = backLogs.getAll()
                }
                state.position = {
                    ...state.position,
                    ...resetIndex
                }
            },
        deleteNumber: (state) => {
            const { row, col } = state.position
            if (state.note) {
                state.hints[row][col] = Array(9).fill(false)
            } else {
                state.solved[row][col] = 0
                const backLogs = new LogStack(state.backLogs)
                backLogs.remove(`${row}${col}`)
                state.backLogs = backLogs.getAll()
            }
        },
        undo: (state) => {
            if (state.backLogs.length > 0) {
                const backLogs = new LogStack(state.backLogs)
                const lastItem = backLogs.pop()
                const { row, col } = backLogs.getIndexFromKey(lastItem.key)

                state.backLogs = backLogs.getAll()
                state.position = {
                    row: row,
                    col: col,
                    x: 0,
                    y: 0
                }
                state.valueSelected = undefined
                state.solved[row][col] = 0
            }
        },
        changeMode:
            (state, action: PayloadAction<SudokuMode>) => {
                state.mode = action.payload
                // reset puzzle
                state.rootPuzzle = resetArray
                state.based = resetArray
                state.solved = resetArray
                state.hints = resetHints
                state.position = {
                    ...resetIndex,
                    col: -1,
                    row: -1,
                }
                state.valueSelected = undefined
                state.backLogs = []
            },
        decrementHintRemaining: (state) => {
            state.hintRemaining = state.hintRemaining - 1
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
    deleteNumber,
    changeMode,
    decrementHintRemaining,
    undo
} = puzzleSlice.actions

export default puzzleSlice.reducer