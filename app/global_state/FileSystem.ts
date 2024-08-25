import { SudokuMode } from '@/constants/SudokuMode'
import * as FileSystem from 'expo-file-system'
import Sudoku from '../core'


const BASED_URI = `${FileSystem.documentDirectory}puzzle.json`
const SOLVED_URI = `${FileSystem.documentDirectory}solved.json`
const HINTS_URI = `${FileSystem.documentDirectory}hints.json`

export const loadHints = async () => {
    try {
        const fileInfo = FileSystem.getInfoAsync(HINTS_URI)
        if ((await fileInfo).exists) {
            const fileContents = await FileSystem
                .readAsStringAsync(HINTS_URI)
                .then(v => JSON.parse(v))
            return {
                success: true,
                data: fileContents,
                msg: 'file existed'
            }

        } else {
            return {
                success: true,
                data: [],
                msg: 'file doesn\'t exitsted'
            }
        }
    } catch (error) {
        return { success: false, msg: 'error to read hints data' }
    }
}

export const loadSolved = async () => {
    try {

        const fileInfo = await FileSystem.getInfoAsync(SOLVED_URI)

        // check puzzle exist
        if (fileInfo.exists) {
            // await FileSystem.deleteAsync(USER_SOLVED_URI)

            const fileContents = await FileSystem.readAsStringAsync(SOLVED_URI).then(value => JSON.parse(value))

            return {
                success: true,
                data: fileContents,
                msg: 'file existed'
            }
        }
        else {
            // if not existed return
            return {
                success: true,
                data: [],
                msg: 'file doesn\'t exitsted'
            }
        }
    } catch (error) {
        return { success: false, msg: 'error to read puzzle data' }
    }
}

export const loadBased = async (mode: SudokuMode = SudokuMode.easy) => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(BASED_URI)

        // check puzzle exist
        if (fileInfo.exists) {

            const fileContents = await FileSystem.readAsStringAsync(BASED_URI).then(value => JSON.parse(value))

            return {
                success: true,
                data: { ...fileContents },
                msg: 'file existed'
            }
        }
        else {

            // if not exist, create new and add to file
            const sudoku = new Sudoku(mode = mode)
            sudoku.fillValues()
            const newData = {
                puzzle: sudoku.mat,
                note: false,
                mode: mode
            }

            await FileSystem.writeAsStringAsync(BASED_URI,
                JSON.stringify(newData))
            return {
                success: true,
                data: newData,
                msg: 'file doesn\'t exitsted, create new'
            }
        }
    } catch (error) {
        return {
            success: false,
            msg: 'error to load based puzzle'
        }
    }
}

export const updateNoteStatus = async (basePuzzle: number[][], newStatus: boolean, mode: SudokuMode) => {
    try {
        const newData = {
            puzzle: basePuzzle,
            note: newStatus,
            mode: mode
        }
        await FileSystem.writeAsStringAsync(BASED_URI, JSON.stringify(newData))
        return { success: true, msg: 'update note status successfully' }
    } catch (error) {
        return { success: false, msg: 'update note status fail' }
    }
}

export const guessNumber = async (
    num: number,
    position: { row: number, col: number },
    note: boolean) => {
    const { row, col } = position
    const URI = note ? HINTS_URI : SOLVED_URI
    let data = []
    let msg = ''
    try {
        const fileInfo = await FileSystem.getInfoAsync(URI)

        if (fileInfo.exists) {
            const fileContents = await FileSystem.readAsStringAsync(URI).then(data => JSON.parse(data))
            data = fileContents
            if (note)
                data[row][col][num - 1] = true
            else
                data[row][col] = num
            msg = 'add number successfully'
        } else {
            data = note ? Array(9).fill(0).map(_ => Array(9).fill(0).map(_ => Array(9).fill(false)))
                : Array(9).fill(0).map(_ => Array(9).fill(0))
            if (note)
                data[row][col][num - 1] = true
            else
                data[row][col] = num
            msg = `file does\'t exist, create new successfully (${note ? 'hints' : 'solved'})`
        }
        await FileSystem.writeAsStringAsync(URI, JSON.stringify(data))

        return { success: true, msg: msg, data: data }
    } catch (error) {
        return { success: false, msg: `error to add number number (${note ? 'hints' : 'solved'})` }
    }
}

export const resetFile = async () => {
    const basedInfo = await FileSystem.getInfoAsync(BASED_URI)
    const solvedInfo = await FileSystem.getInfoAsync(SOLVED_URI)
    const hintsInfo = await FileSystem.getInfoAsync(HINTS_URI)

    if (basedInfo.exists)
        await FileSystem.deleteAsync(BASED_URI)
    if (solvedInfo.exists)
        await FileSystem.deleteAsync(SOLVED_URI)
    if (hintsInfo.exists)
        await FileSystem.deleteAsync(HINTS_URI)
}