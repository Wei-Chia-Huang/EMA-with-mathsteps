const mathsteps = require('mathsteps');
const print = require('mathsteps/lib/util/print');

function isEquation(mathInput) {
    const comparators = ['<=', '>=', '=', '<', '>'];
    let isEquation = false;

    comparators.forEach(comparator => {
        if (mathInput.includes(comparator))
            isEquation = true;
    });

    return isEquation;
}

function renderStep(step, isEquationFlag) {
    var StepsText = "";

    StepsText += isEquationFlag
        ? step.newEquation.ascii() + '\n'
        : print.ascii(step.newNode) + '\n';

    return StepsText;
}

function steps(input) {
    const isEquationFlag = isEquation(input);
    const steps = isEquationFlag
        ? mathsteps.solveEquation(input)
        : mathsteps.simplifyExpression(input);

    let StepsText = isEquationFlag
        ? steps[0].oldEquation.ascii() + '\n'
        : print.ascii(steps[0].oldNode) + '\n';

    steps.forEach(step => {
        StepsText += renderStep(step, isEquationFlag);
    });

    return StepsText;
}

module.exports.init = function(input) {
    console.log(input.toString());
    console.log(steps(input.toString()));
};