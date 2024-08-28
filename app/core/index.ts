import { SudokuMode } from "@/constants/SudokuMode";

export default class Sudoku {
    N: number = 9  //number of row/col
    K: number;  //total of disable number
    SRN: number; //a box
    rootMat: number[][] = Array(this.N).fill(0).map(_ => Array(this.N).fill(0)) //root puzzle before remove digits
    mat: number[][];//matrix
    mode: SudokuMode; //difficult

    constructor(mode = SudokuMode.easy) {
        const SRNd = Math.sqrt(this.N);
        this.SRN = Math.floor(SRNd)
        this.mat = Array(this.N).fill(0).map(_ => Array(this.N).fill(0))
        this.mode = mode
        switch (mode) {
            case SudokuMode.easy:
                this.K = 20 + Math.floor(Math.random() * 6)
                break
            case SudokuMode.normal:
                this.K = 25 + Math.floor(Math.random() * 6)
                break
            case SudokuMode.hard:
                this.K = 30 + Math.floor(Math.random() * 6)
                break
            case SudokuMode.expert:
                this.K = 35 + Math.floor(Math.random() * 6)
        }
        this.fillValues()
    }

    fillValues() {
        this.fillDiagonal()
        this.fillRemaining(0, this.SRN)
        this.removeKDigits()
    }

    fillDiagonal() {
        for (let i = 0; i < this.N; i += this.SRN) {
            this.fillBox(i, i);
        }
    }

    unUsedInBox(rowStart: number, colStart: number, num: number): boolean {
        for (let i = 0; i < this.SRN; i++) {
            for (let j = 0; j < this.SRN; j++) {
                if (this.mat[rowStart + i][colStart + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    fillBox(row: number, col: number) {
        let num;
        for (let i = 0; i < this.SRN; i++) {
            for (let j = 0; j < this.SRN; j++) {
                do {
                    num = this.randomGenerator(this.N);
                } while (!this.unUsedInBox(row, col, num));
                this.mat[row + i][col + j] = num;
            }
        }
    }

    randomGenerator(num: number) {
        return Math.floor(Math.random() * num + 1);
    }

    checkIfSafe(i: number, j: number, num: number): boolean {
        return this.unUsedInRow(i, num) && this.unUsedInCol(j, num) && this.unUsedInBox(i - (i % this.SRN), j - (j % this.SRN), num);
    }

    unUsedInRow(i: number, num: number): boolean {
        for (let j = 0; j < this.N; j++) {
            if (this.mat[i][j] === num) {
                return false;
            }
        }
        return true;
    }

    unUsedInCol(j: number, num: number): boolean {
        for (let i = 0; i < this.N; i++) {
            if (this.mat[i][j] === num) {
                return false;
            }
        }
        return true;
    }

    fillRemaining(i: number, j: number): boolean {
        if (i === this.N - 1 && j === this.N)
            return true
        if (j === this.N) {
            i++;
            j = 0;
        }
        if (this.mat[i][j] !== 0) return this.fillRemaining(i, j + 1);
        for (let num = 1; num <= this.N; num++) {
            if (this.checkIfSafe(i, j, num)) {
                this.mat[i][j] = num;
                if (this.fillRemaining(i, j + 1)) return true;
                this.mat[i][j] = 0;
            }
        }
        return false;
    }

    printSudoku() {
        for (let i = 0; i < this.N; i++) {
            console.log(this.mat[i].join("\n"));
        }
    }

    removeKDigits() {
        this.rootMat = JSON.parse(JSON.stringify(this.mat))
        let count = this.K;
        while (count !== 0) {
            let i = Math.floor(Math.random() * this.N);
            let j = Math.floor(Math.random() * this.N);
            if (this.mat[i][j] !== 0) {
                count--;
                this.mat[i][j] = 0;
            }
        }
    }
}