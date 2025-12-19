function minMirrorPairDistance(nums: number[]): number {
    const valueToIndices = new Map<number, number[]>();
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        if (!valueToIndices.has(num)) {
            valueToIndices.set(num, []);
        }
        valueToIndices.get(num)!.push(i);
    }

    const findFirstGreater = (arr: number[], target: number): number => {
        let left = 0;
        let right = arr.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid] > target) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left < arr.length ? arr[left] : -1;
    };

    let min: number = Infinity;

    for (let i = 0; i < nums.length; i++) {
        const reverseNum = reverse(nums[i]);
        const indices = valueToIndices.get(reverseNum);
        
        if (indices && indices.length > 0) {
            const j = findFirstGreater(indices, i);
            if (j !== -1) {
                const distance = j - i;
                min = Math.min(distance, min);
                
                if (min === 1) {
                    return 1;
                }
            }
        }
    }
    
    return min === Infinity ? -1 : min;
}

function reverse(num: number): number {
    let reversed = 0;
    let n = num;
    while (n > 0) {
        reversed = reversed * 10 + (n % 10);
        n = Math.floor(n / 10);
    }
    return reversed;
}
