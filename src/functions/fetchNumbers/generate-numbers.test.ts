import generateNumbers from './generate-numbers';
import { History, Record } from './types';

describe('generateNumbers', () => {
    it('should generate two random numbers between 1 and 5', () => {
        const history: History = [];
        const [numA, numB]: Record = generateNumbers(history);
        expect(numA).toBeGreaterThanOrEqual(1);
        expect(numA).toBeLessThanOrEqual(5);
        expect(numB).toBeGreaterThanOrEqual(1);
        expect(numB).toBeLessThanOrEqual(5);
    });
    it('should guarantee a match after 8 non-matches', () => {
        const history: History = [
            [1, 2],
            [3, 4],
            [5, 1],
            [2, 3],
            [4, 5],
            [1, 2],
            [3, 4],
            [5, 1],
        ];
        const [numA, numB]: Record = generateNumbers(history);
        expect(numA).toBe(numB);
    });
});