export enum ISqrtRoundMode { Floor, Nearest, Ceiling }

export const Exts = {
    ISqrtRoundMode: {Floor: ISqrtRoundMode.Floor, Nearest: ISqrtRoundMode.Nearest, Ceiling: ISqrtRoundMode.Ceiling},
    ISqrt: (number: number, round: ISqrtRoundMode = ISqrtRoundMode.Floor): number => {
        return Math.sqrt(number);
        // var divisor = 1U << 30;
        // var root = 0U;
        // var remainder = number;
        //
        // // Find the highest term in the divisor
        // while (divisor > number)
        //     divisor >>= 2;
        //
        // // Evaluate the root, two bits at a time
        // while (divisor != 0)
        // {
        //     if (root + divisor <= remainder)
        //     {
        //         remainder -= root + divisor;
        //         root += 2 * divisor;
        //     }
        //
        //     root >>= 1;
        //     divisor >>= 2;
        // }
        //
        // // Adjust for other rounding modes
        // if (round == ISqrtRoundMode.Nearest && remainder > root)
        //     root += 1;
        // else if (round == ISqrtRoundMode.Ceiling && root * root < number)
        //     root += 1;
        //
        // return root;
    },
};