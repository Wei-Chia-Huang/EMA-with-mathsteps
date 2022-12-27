const mathsteps = require('mathsteps');
const print = require('mathsteps/lib/util/print');

const Template = require('./ChooseTemplate.js');

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
    var CommandText = Template.formatChange(step);

    StepsText += isEquationFlag
        ? step.newEquation.ascii() + '\n'
        : print.ascii(step.newNode) + '\n';

    return CommandText;
}

function steps(input) {
    const isEquationFlag = isEquation(input);
    const steps = isEquationFlag
        ? mathsteps.solveEquation(input)
        : mathsteps.simplifyExpression(input);

    var CommandText = [];
    var StepsText = isEquationFlag
        ? steps[0].oldEquation.ascii() + '\n'
        : print.ascii(steps[0].oldNode) + '\n';

    steps.forEach(step => {
        CommandText.push(renderStep(step, isEquationFlag));
    });

    CommandText.push(['ans', [Number(print.ascii(steps[steps.length - 1].newNode))]]);

    return CommandText;
}

module.exports.init = function(input) {
    console.log(input.toString());
    console.log(steps(input.toString()));
};