Blockly.defineBlocksWithJsonArray([{
    type: "controls_repeat_ext",
    message0: "%{BKY_CONTROLS_REPEAT_TITLE}",
    args0: [{
        type: "input_value",
        name: "TIMES",
        check: "Number"
    }],
    message1: "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
    args1: [{
        type: "input_statement",
        name: "DO"
    }],
    previousStatement: null,
    nextStatement: null,
    colour: Colour.Loops,
    tooltip: "%{BKY_CONTROLS_REPEAT_TOOLTIP}",
    helpUrl: "%{BKY_CONTROLS_REPEAT_HELPURL}"
}, {
    type: "controls_repeat",
    message0: "%{BKY_CONTROLS_REPEAT_TITLE}",
    args0: [{
        type: "field_number",
        name: "TIMES",
        value: 10,
        min: 0,
        precision: 1
    }],
    message1: "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
    args1: [{
        type: "input_statement",
        name: "DO"
    }],
    previousStatement: null,
    nextStatement: null,
    colour: Colour.Loops,
    tooltip: "%{BKY_CONTROLS_REPEAT_TOOLTIP}",
    helpUrl: "%{BKY_CONTROLS_REPEAT_HELPURL}"
}, {
    type: "controls_whileUntil",
    message0: "%1 %2",
    args0: [{
        type: "field_dropdown",
        name: "MODE",
        options: [
            ["%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_WHILE}", "WHILE"],
            ["%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_UNTIL}", "UNTIL"]
        ]
    }, {
        type: "input_value",
        name: "BOOL",
        check: "Boolean"
    }],
    message1: "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
    args1: [{
        type: "input_statement",
        name: "DO"
    }],
    previousStatement: null,
    nextStatement: null,
    colour: Colour.Loops,
    helpUrl: "%{BKY_CONTROLS_WHILEUNTIL_HELPURL}",
    extensions: ["controls_whileUntil_tooltip"]
}, {
    type: "controls_for",
    message0: "%{BKY_CONTROLS_FOR_TITLE}",
    args0: [{
        type: "field_variable",
        name: "VAR",
        variable: null
    }, {
        type: "input_value",
        name: "FROM",
        check: "Number",
        align: "RIGHT"
    }, {
        type: "input_value",
        name: "TO",
        check: "Number",
        align: "RIGHT"
    }, {
        type: "input_value",
        name: "BY",
        check: "Number",
        align: "RIGHT"
    }],
    message1: "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
    args1: [{
        type: "input_statement",
        name: "DO"
    }],
    inputsInline: !0,
    previousStatement: null,
    nextStatement: null,
    colour: Colour.Loops,
    helpUrl: "%{BKY_CONTROLS_FOR_HELPURL}",
    extensions: ["contextMenu_newGetVariableBlock", "controls_for_tooltip"]
}, {
    type: "controls_forEach",
    message0: "%{BKY_CONTROLS_FOREACH_TITLE}",
    args0: [{
        type: "field_variable",
        name: "VAR",
        variable: null
    }, {
        type: "input_value",
        name: "LIST",
        check: "Array"
    }],
    message1: "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
    args1: [{
        type: "input_statement",
        name: "DO"
    }],
    previousStatement: null,
    nextStatement: null,
    colour: Colour.Loops,
    helpUrl: "%{BKY_CONTROLS_FOREACH_HELPURL}",
    extensions: ["contextMenu_newGetVariableBlock", "controls_forEach_tooltip"]
}, {
    type: "controls_flow_statements",
    message0: "%1",
    args0: [{
        type: "field_dropdown",
        name: "FLOW",
        options: [
            ["%{BKY_CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK}", "BREAK"],
            ["%{BKY_CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE}", "CONTINUE"]
        ]
    }],
    previousStatement: null,
    colour: Colour.Loops,
    helpUrl: "%{BKY_CONTROLS_FLOW_STATEMENTS_HELPURL}",
    extensions: ["controls_flow_tooltip", "controls_flow_in_loop_check"]
}]);