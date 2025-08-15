const BaseModel = require('./BaseModel');

class CharacterAnalysis extends BaseModel {
    constructor() {
        super('character_analysis');
    }

    // Special feature: Calculate character percentage with nested loops and mathematics
    calculateCharacterPercentage(input1, input2) {
        // Convert to uppercase for case-insensitive comparison
        const str1 = input1.toUpperCase();
        const str2 = input2.toUpperCase();
        
        // Get unique characters from input1
        const uniqueChars1 = [...new Set(str1.split(''))];
        const matchingChars = [];
        let matchCount = 0;

        // Nested loops to check each character
        for (let i = 0; i < uniqueChars1.length; i++) {
            const char1 = uniqueChars1[i];
            
            // Nested if conditions
            if (char1 !== ' ') { // Skip spaces
                for (let j = 0; j < str2.length; j++) {
                    const char2 = str2[j];
                    
                    if (char1 === char2) {
                        if (!matchingChars.includes(char1)) {
                            matchingChars.push(char1);
                            matchCount++;
                        }
                        break; // Found match, no need to continue inner loop
                    }
                }
            }
        }

        // Mathematics calculation
        const totalUniqueChars = uniqueChars1.filter(char => char !== ' ').length;
        const percentage = totalUniqueChars > 0 ? (matchCount / totalUniqueChars) * 100 : 0;

        return {
            input1,
            input2,
            matchingChars,
            matchCount,
            totalUniqueChars,
            percentage: Math.round(percentage * 100) / 100 // Round to 2 decimal places
        };
    }

    async saveAnalysis(input1, input2) {
        try {
            const result = this.calculateCharacterPercentage(input1, input2);
            
            const analysisData = {
                input1: result.input1,
                input2: result.input2,
                percentage: result.percentage,
                matching_chars: result.matchingChars.join(', ')
            };

            const id = await this.create(analysisData);
            return { id, ...result };
        } catch (error) {
            console.error('Save analysis error:', error);
            throw error;
        }
    }
}

module.exports = CharacterAnalysis;