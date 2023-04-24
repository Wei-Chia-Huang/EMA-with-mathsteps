const mathsteps = require('mathsteps');
const print = require('mathsteps/lib/util/print');

const Template = require('./RuleTable.js');

// 判斷問題是否為方程式
function isEquation(mathInput) {
    const comparators = ['<=', '>=', '=', '<', '>'];
    let isEquation = false;

    comparators.forEach(comparator => {
        if (mathInput.includes(comparator))
            isEquation = true;
    });

    return isEquation;
}

// 取得陣列維度
function getDepth(arr) {
    var list = [];
    var num = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] instanceof Array) {
            for (let j = 0; j < arr[i].length; j++) {
                list.push(arr[i][j]);
            }
        }
    }

    if (list.length) {
        num = 1;
        num += getDepth(list);
    }

    return num;
}

// 生成步驟
function renderStep(step, isEquationFlag) {
    var StepsText = "";
    var CommandText = Template.formatChange(step);

    StepsText += isEquationFlag
        ? step.newEquation.ascii() + '\n'
        : print.ascii(step.newNode) + '\n';

    return CommandText;
}

// 生成子步驟
function renderSubstep(steps, isEquationFlag) {
    var CommandText = [];

    steps.forEach(step => {
        const substeps = step.substeps;
        if (substeps.length === 0) {
            var command = Template.formatChange(step);
        }
        else {
            var command = renderSubstep(substeps, isEquationFlag);
        }

        var commandDepth = getDepth(command);

        if (commandDepth === 1) {
            CommandText.push(command);
        }
        else if (commandDepth === 2){
            for (let i = 0; i < command.length; i++) {
                CommandText.push(command[i]);
            }
        }
    });

    return CommandText;
}

// 取得所有步驟
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
        const substeps = step.substeps;
        console.log(substeps.length);
        if (substeps.length === 0) {
            var command = renderStep(step, isEquationFlag);
        }
        else {
            var command = renderSubstep(substeps, isEquationFlag );
            // var command = ["test", [123]];
        }
        
        var commandDepth = getDepth(command);

        if (commandDepth === 1) {
            CommandText.push(command);
        }
        else if (commandDepth === 2){
            for (let i = 0; i < command.length; i++) {
                CommandText.push(command[i]);
            }
        }
        // CommandText.push(renderStep(step, isEquationFlag));
    });

    CommandText.push(['ans', [Number(print.ascii(steps[steps.length - 1].newNode))]]);

    return CommandText;
}

module.exports.init = function(input) {
    console.log(input.toString());
    console.log(steps(input.toString()));
};