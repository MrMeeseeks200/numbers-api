import generateNumbers from './generate-numbers';
import { History, Record } from './types';

describe('generateNumbers', () => {
    it('should generate two random numbers between 1 and 100', () => {
        const history: History = [];
        const [numA, numB]: Record = generateNumbers(history);
        expect(numA).toBeGreaterThanOrEqual(1);
        expect(numA).toBeLessThanOrEqual(100);
        expect(numB).toBeGreaterThanOrEqual(1);
        expect(numB).toBeLessThanOrEqual(100);
    });
    it('should guarantee a match after 14 non-matches', () => {
        const history: History = [
            [10, 20],
            [15, 25],
            [30, 40],
            [50, 60],
            [70, 80],
            [85, 95],
            [12, 22],
            [33, 44],
            [55, 66],
            [77, 88],
            [11, 21],
            [13, 23],
            [14, 24],
            [16, 26]
        ];
        const [numA, numB]: Record = generateNumbers(history);
        expect(numA).toBe(numB);
    });
});