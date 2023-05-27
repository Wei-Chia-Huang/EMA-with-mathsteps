const ChangeTypes = require('mathsteps/lib/ChangeTypes.js');
const NodeType = require('./NodeType.js');

const Template = {
    templateFormatFunctionMap: {}
};

const OP_TO_STRING = {
    '+': 'Combine',
    '-': 'Combine',
    '*': 'Multiply',
    '/': 'Divide'
};

const COMPARATOR_TO_STRING = {
    '=': 'equal to',
    '>': 'greater than',
    '>=': 'greater than or equal to',
    '<': 'less than',
    '<=': 'less than or equal to',
};

// Given a step, will return the template for the change
// from the oldNode, newNode, and changeType
Template.formatChange = function(step) {
    if (!(step.changeType in Template.templateFormatFunctionMap)) {
        // TODO: add tests that will alert us when a new change type doesn't
        // have a template yet
        console.error(step.changeType + ' does not have a template!');
        return step.changeType;
    }
    
    // const substeps = step.substeps;
    // if (substeps.length !== 0) {
    //     console.log(substeps[1]);
    // }

    const templateFormatFunctionMap = Template.templateFormatFunctionMap[step.changeType];
    let templateDescription = templateFormatFunctionMap(step);
    if (!templateDescription) {
        return Template.ChangeText[step.changeType];
    }
    
    return templateDescription;
};

function getChangeNodes(node) {
    return node.filter(node => node.changeGroup);
}

function getOldChangeNodes(step) {
    if (step.oldNode) {
        return getChangeNodes(step.oldNode);
    }
    else if (step.oldEquation) {
        const leftChangeNodeStrings = getChangeNodes(step.oldEquation.leftNode);
        const rightChangeNodeStrings = getChangeNodes(step.oldEquation.rightNode);
        return [...leftChangeNodeStrings, ...rightChangeNodeStrings];
    }
    return null;
}

function getNewChangeNodes(step) {
    if (step.newNode) {
        return getChangeNodes(step.newNode);
    }
    else if (step.newEquation) {
        const leftChangeNodeStrings = getChangeNodes(step.newEquation.leftNode);
        const rightChangeNodeStrings = getChangeNodes(step.newEquation.rightNode);
        return [...leftChangeNodeStrings, ...rightChangeNodeStrings];
    }
    return null;
}

function nodesToString(nodes, duplicates=false) {
    // get rid of changeGroup so we can find duplicates
    nodes.forEach(node => { node.changeGroup = undefined; });

    let strings = nodes.map(node => node.toTex());
    if (!duplicates) {
        strings = [...new Set(strings)];
    }

    if (strings.length === 0) {
        return '';
    }
    else if (strings.length === 1) {
        return strings[0];
    }
    else {
        return strings.slice();
    }
}

function combineTemplate(values, solveType) {
    let commandText = [];
    
    switch (solveType) {
        case 'sequence': {
            let ans = values[0];

            for (let i = 1; i < values.length; i++) {
                if (values[i] < 0) {
                    commandText.push(["sub", [ans, Math.abs(values[i])]]);
                }
                else {
                    commandText.push(["add", [ans, values[i]]]);
                }
                ans = ans + values[i];
            }
            break;
        }
        case 'pos - neg': {
            let haveNegative = false;
            let positiveValsArr = [];
            let negativeValsArr = [];

            values.forEach(value => {
                if (value < 0) {
                    haveNegative = true;
                    negativeValsArr.push(Math.abs(value));
                }
                else {
                    positiveValsArr.push(value);
                }
            });

            let positiveSum = 0;
            positiveValsArr.forEach(positiveVal => {
                positiveSum = positiveSum + positiveVal;
            });

            let negativeSum = 0;
            negativeValsArr.forEach(negativeVal => {
                negativeSum = negativeSum + negativeVal;
            });
        
            if (haveNegative) {
                if (values.length === 2) {
                    commandText.push(["sub", values]);
                }
                else if (values.length === 3) {
                    if (positiveValsArr.length === 1){
                        commandText.push(["add", negativeValsArr]);
                        commandText.push(["sub", [positiveValsArr, negativeSum]]);
                    }
                    else {
                        commandText.push(["add", positiveValsArr]);
                        commandText.push(["sub", [positiveSum, negativeValsArr]]);
                    }
                }
                else {
                    commandText.push(["add", positiveValsArr]);
                    commandText.push(["add", negativeValsArr]);
                    commandText.push(["sub", [positiveSum, negativeSum]]);
                }
            }
            else {
                commandText.push(["add", values]);
            }
            break;
        }
        default: {
            commandText = "Dose not have solveType: " + solveType;
            break;
        }
    }

    return commandText;
}

function multiplyTemplate(values) {
    let commandText = [];
    let ans = values[0];

    for (let i = 1; i < values.length; i++) {
        commandText.push(["mul", [ans, values[i]]]);
        ans = ans * values[i];
    }

    return commandText;
}

Template.templateFormatFunctionMap[ChangeTypes.CANCEL_GCD] = function(step) {
    const oldNodes = getOldChangeNodes(step);
    const newNodes = getNewChangeNodes(step);
    // if (oldNodes.length !== 1 || newNodes.length !== 1) {
    //     return null;
    // }

    const before = nodesToString(oldNodes);
    const after = nodesToString(newNodes);

    return ["div", [before, after]];    
}

// e.g. 1 + 2 * 5 + 3 -> 4 + 2 * 5
Template.templateFormatFunctionMap[ChangeTypes.COLLECT_AND_COMBINE_LIKE_TERMS] = function(step) {
    const oldNodes = getOldChangeNodes(step);
    const newNodes = getNewChangeNodes(step);
    if (oldNodes.length !== 1 || newNodes.length !== 1) {
        return null;
    }

    const opNode = oldNodes[0];
    if (!NodeType.isOperator(opNode) || '+-*/^'.indexOf(opNode.op) === -1) {
        return null;
    }

    const before = nodesToString(opNode.args, true);
    let combineValsArr = [];
    
    before.forEach(value => {
        if (!isNaN(value))
            combineValsArr.push(Number(value));
    });

    return combineTemplate(combineValsArr, 'sequence');
}

Template.templateFormatFunctionMap[ChangeTypes.FIND_GCD] = function(step) {
    const oldNodes = getOldChangeNodes(step);
    const newNodes = getNewChangeNodes(step);
    // if (oldNodes.length !== 1 || newNodes.length !== 1) {
    //     return null;
    // }

    const before = nodesToString(oldNodes);
    const after = nodesToString(newNodes);

    return ["div", [before, after]];
}

// e.g. (2 * 3)(x * x) -> 6(x*x)
Template.templateFormatFunctionMap[ChangeTypes.MULTIPLY_COEFFICIENTS] = function(step) {
    const oldNodes = getOldChangeNodes(step);
    const newNodes = getNewChangeNodes(step);
    if (oldNodes.length !== 1 || newNodes.length !== 1) {
        return null;
    }

    const opNode = oldNodes[0];
    if (!NodeType.isOperator(opNode) || '+-*/^'.indexOf(opNode.op) === -1) {
        return null;
    }

    const before = nodesToString(opNode.args, true);
    const after = newNodes[0].toTex();

    var values = before.map(function(value) {
        return Number(value);
    });

    switch (OP_TO_STRING[opNode.op]) {
        case 'Combine': 
            return combineTemplate(values, 'sequence');
        case 'Multiply': 
            return multiplyTemplate(values);
        case 'Divide': 
            return ["div", values];
        default: 
            return null;
    }
};

// e.g. 1/2 * 2/3 -> 2/6
Template.templateFormatFunctionMap[ChangeTypes.MULTIPLY_FRACTIONS] = function(step) {
    const oldNodes = getOldChangeNodes(step);
    const newNodes = getNewChangeNodes(step);
    if (oldNodes.length !== 1 || newNodes.length !== 1) {
        return null;
    }

    const opNode = oldNodes[0];
    if (!NodeType.isOperator(opNode) || opNode.op !== '*') {
        return null;
    }

    const before = nodesToString(opNode.args, true);
    const after = newNodes[0].toTex();
    var values = before.map(function(value) {
        return Number(value);
    });

    return ["mul", values];
};

// e.g. 2 + 2 -> 4 or 2 * 2 -> 4
Template.templateFormatFunctionMap[ChangeTypes.SIMPLIFY_ARITHMETIC] = function(step) {
    const oldNodes = getOldChangeNodes(step);
    const newNodes = getNewChangeNodes(step);
    if (oldNodes.length !== 1 || newNodes.length !== 1) {
        return null;
    }

    const opNode = oldNodes[0];
    if (!NodeType.isOperator(opNode) || '+-*/^'.indexOf(opNode.op) === -1) {
        return null;
    }

    const before = nodesToString(opNode.args, true);
    const after = newNodes[0].toTex();
    var values = before.map(function(value) {
        return Number(value);
    });
    
    switch (OP_TO_STRING[opNode.op]) {
        case 'Combine': 
            return combineTemplate(values, 'sequence');
        case 'Multiply': 
            return multiplyTemplate(values);
        case 'Divide': 
            return ["div", values];
        default: 
            return null;
    }
};

// e.g. 2/6 -> 1/3
Template.templateFormatFunctionMap[ChangeTypes.SIMPLIFY_FRACTION] = function(step) {
    const oldNodes = getOldChangeNodes(step);
    const newNodes = getNewChangeNodes(step);
    if (oldNodes.length !== 1 || newNodes.length !== 1) {
        return null;
    }

    const before = nodesToString(oldNodes);
    const after = nodesToString(newNodes);
    var values = before.map(function(value) {
        return Number(value);
    });

    if (!isNaN(Number(after))){
        return ["div", values];
    }
    else{
        return [step.changeType];
    }
};

Template.ChangeText = {
    ABSOLUTE_VALUE: 'Take the absolute value',
    ADD_COEFFICIENT_OF_ONE: 'Rewrite term to have a coefficient of 1',
    ADD_EXPONENT_OF_ONE: 'Rewrite term to have an exponent of 1',
    ADD_FRACTIONS: 'Add the fractions together',
    ADD_NUMERATORS: 'Add the terms in the numerator',
    ADD_POLYNOMIAL_TERMS: 'Add the polynomial terms together',
    ADD_TO_BOTH_SIDES: 'Add the term to both sides',
    BREAK_UP_FRACTION: 'Break up the fraction',
    CANCEL_EXPONENT: 'Cancel the exponent',
    CANCEL_EXPONENT_AND_ROOT: 'Cancel the exponent and the root',
    CANCEL_MINUSES: 'Cancel the negatives in the numerator and denominator',
    CANCEL_ROOT: 'Cancel the root',
    CANCEL_TERMS: 'Cancel like terms in the numerator and denominator',
    COLLECT_AND_COMBINE_LIKE_TERMS: 'Collect and combine like terms',
    COLLECT_EXPONENTS: 'Collect the exponents',
    COLLECT_LIKE_TERMS: 'Identify the like terms and group them together',
    COMBINE_NUMERATORS: 'Combine the numerators with a shared denominator',
    COMMON_DENOMINATOR: 'Multiply the terms so they share a common denominator',
    COMBINE_UNDER_ROOT: 'Combine terms with the same root',
    CONVERT_INTEGER_TO_FRACTION: 'Change the number to a fraction with the same denominator',
    CONVERT_MULTIPLICATION_TO_EXPONENT: 'Change repeatedly multiplying a term to an exponent',
    DISTRIBUTE: 'Distribute into the parentheses',
    DISTRIBUTE_NEGATIVE_ONE: 'Distribute -1 into the parentheses',
    DISTRIBUTE_NTH_ROOT: 'Distribute the root into each term',
    DIVIDE_FRACTION_FOR_ADDITION: 'Divide any fractions to convert it to decimal form',
    DIVIDE_FROM_BOTH_SIDES: 'Divide the term from both sides',
    DIVISION_BY_NEGATIVE_ONE: 'Rewrite any term divided by -1 as the negative of the term',
    DIVISION_BY_ONE: 'Rewrite any term divided by 1 as just the term',
    EVALUATE_DISTRIBUTED_NTH_ROOT: 'Take the root of all the terms',
    FACTOR_INTO_PRIMES: 'Factor the number into its prime factors',
    GROUP_COEFFICIENTS: 'Group the coefficients together',
    GROUP_TERMS_BY_ROOT: 'Group repeating factors',
    MULTIPLY_BOTH_SIDES_BY_INVERSE_FRACTION: 'Multiply both sides by the inverse of the fraction',
    MULTIPLY_BOTH_SIDES_BY_NEGATIVE_ONE: 'Multiply both sides by -1',
    MULTIPLY_BY_INVERSE: 'Rewrite division as multiplication by the inverse',
    MULTIPLY_BY_ZERO: 'Rewrite any term multiplied by 0 as 0',
    MULTIPLY_COEFFICIENTS: 'Multiply the coefficients together',
    MULTIPLY_DENOMINATORS: 'Multiply the terms in the denominators',
    MULTIPLY_FRACTIONS: 'Multiply the fractions together',
    MULTIPLY_NUMERATORS: 'Multiply the terms in the numerators',
    MULTIPLY_POLYNOMIAL_TERMS: 'Multiply the polynomial terms together',
    MULTIPLY_TO_BOTH_SIDES: 'Multiply the term to both sides',
    NTH_ROOT_VALUE: 'Take the root of the number',
    NO_CHANGE: 'No change',
    REARRANGE_COEFF: 'Move the coefficient to the front of the term',
    REDUCE_ZERO_NUMERATOR: 'Rewrite zero divided by anything as zero',
    REMOVE_EXPONENT_BY_ONE: 'Rewrite any term to the power of 1 as itself',
    REDUCE_EXPONENT_BY_ZERO: 'Rewrite any term to the power of 0 as 1',
    REMOVE_ADDING_ZERO: 'Remove zero when adding',
    REMOVE_MULTIPLYING_BY_NEGATIVE_ONE: 'Rewrite any term multiplied by -1 as the negative of the term',
    REMOVE_MULTIPLYING_BY_ONE: 'Rewrite any term multiplied 1 as just the term',
    RESOLVE_DOUBLE_MINUS: 'Change subtracting a negative to addition',
    SIMPLIFY_ARITHMETIC: 'Evaluate the arithmetic',
    SIMPLIFY_DIVISION: 'Rewrite the chain of division',
    SIMPLIFY_FRACTION: 'Simplify by dividing the top and bottom by the greatest common denominator',
    SIMPLIFY_LEFT_SIDE: 'Simplify the left hand side',
    SIMPLIFY_RIGHT_SIDE: 'Simplify the right hand side',
    SIMPLIFY_SIGNS: 'Move the negative sign to the numerator',
    SIMPLIFY_TERMS: 'Simplify after distributing',
    STATEMENT_IS_FALSE: 'The statement is False',
    STATEMENT_IS_TRUE: 'The statement is True',
    SUBTRACT_FROM_BOTH_SIDES: 'Subtract the term from both sides',
    SWAP_SIDES: 'Swap sides',
    UNARY_MINUS_TO_NEGATIVE_ONE: 'Rewrite minus as a coefficient of -1',
};

module.exports = Template;