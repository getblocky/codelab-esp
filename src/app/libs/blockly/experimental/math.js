Blockly.defineBlocksWithJsonArray([{
    type: "math_number",
    message0: "%1",
    args0: [{
        type: "field_number",
        name: "NUM",
        value: 0
    }],
    output: "Number",
    colour: Colour.Math,
    helpUrl: "%{BKY_MATH_NUMBER_HELPURL}",
    tooltip: "%{BKY_MATH_NUMBER_TOOLTIP}",
    extensions: ["parent_tooltip_when_inline"]
}, {
    type: "math_arithmetic",
    message0: "%1 %2 %3",
    args0: [{
        type: "input_value",
        name: "A",
        check: "Number"
    }, {
        type: "field_dropdown",
        name: "OP",
        options: [
            ["%{BKY_MATH_ADDITION_SYMBOL}", "ADD"],
            ["%{BKY_MATH_SUBTRACTION_SYMBOL}", "MINUS"],
            ["%{BKY_MATH_MULTIPLICATION_SYMBOL}",
                "MULTIPLY"
            ],
            ["%{BKY_MATH_DIVISION_SYMBOL}", "DIVIDE"],
            ["%{BKY_MATH_POWER_SYMBOL}", "POWER"]
        ]
    }, {
        type: "input_value",
        name: "B",
        check: "Number"
    }],
    inputsInline: !0,
    output: "Number",
    colour: Colour.Math,
    helpUrl: "%{BKY_MATH_ARITHMETIC_HELPURL}",
    extensions: ["math_op_tooltip"]
}, {
    type: "math_single",
    message0: "%1 %2",
    args0: [{
        type: "field_dropdown",
        name: "OP",
        options: [
            ["%{BKY_MATH_SINGLE_OP_ROOT}", "ROOT"],
            ["%{BKY_MATH_SINGLE_OP_ABSOLUTE}", "ABS"],
            ["-", "NEG"],
            ["ln", "LN"],
            ["log10", "LOG10"],
            ["e^", "EXP"],
            ["10^", "POW10"]
        ]
    }, {
        type: "input_value",
        name: "NUM",
        check: "Number"
    }],
    output: "Number",
    colour: Colour.Math,
    helpUrl: "%{BKY_MATH_SINGLE_HELPURL}",
    extensions: ["math_op_tooltip"]
}, {
    type: "math_trig",
    message0: "%1 %2",
    args0: [{
        type: "field_dropdown",
        name: "OP",
        options: [
            ["%{BKY_MATH_TRIG_SIN}", "SIN"],
            ["%{BKY_MATH_TRIG_COS}", "COS"],
            ["%{BKY_MATH_TRIG_TAN}", "TAN"],
            ["%{BKY_MATH_TRIG_ASIN}", "ASIN"],
            ["%{BKY_MATH_TRIG_ACOS}", "ACOS"],
            ["%{BKY_MATH_TRIG_ATAN}", "ATAN"]
        ]
    }, {
        type: "input_value",
        name: "NUM",
        check: "Number"
    }],
    output: "Number",
    colour: Colour.Math,
    helpUrl: "%{BKY_MATH_TRIG_HELPURL}",
    extensions: ["math_op_tooltip"]
}, {
    type: "math_constant",
    message0: "%1",
    args0: [{
        type: "field_dropdown",
        name: "CONSTANT",
        options: [
            ["\u03c0", "PI"],
            ["e", "E"],
            ["\u03c6", "GOLDEN_RATIO"],
            ["sqrt(2)", "SQRT2"],
            ["sqrt(\u00bd)", "SQRT1_2"],
            ["\u221e", "INFINITY"]
        ]
    }],
    output: "Number",
    colour: Colour.Math,
    tooltip: "%{BKY_MATH_CONSTANT_TOOLTIP}",
    helpUrl: "%{BKY_MATH_CONSTANT_HELPURL}"
}, {
    type: "math_number_property",
    message0: "%1 %2",
    args0: [{
        type: "input_value",
        name: "NUMBER_TO_CHECK",
        check: "Number"
    }, {
        type: "field_dropdown",
        name: "PROPERTY",
        options: [
            ["%{BKY_MATH_IS_EVEN}", "EVEN"],
            ["%{BKY_MATH_IS_ODD}", "ODD"],
            ["%{BKY_MATH_IS_PRIME}", "PRIME"],
            ["%{BKY_MATH_IS_WHOLE}", "WHOLE"],
            ["%{BKY_MATH_IS_POSITIVE}", "POSITIVE"],
            ["%{BKY_MATH_IS_NEGATIVE}", "NEGATIVE"],
            ["%{BKY_MATH_IS_DIVISIBLE_BY}", "DIVISIBLE_BY"]
        ]
    }],
    inputsInline: !0,
    output: "Boolean",
    colour: Colour.Math,
    tooltip: "%{BKY_MATH_IS_TOOLTIP}",
    mutator: "math_is_divisibleby_mutator"
}, {
    type: "math_change",
    message0: "%{BKY_MATH_CHANGE_TITLE}",
    args0: [{
        type: "field_variable",
        name: "VAR",
        variable: "%{BKY_MATH_CHANGE_TITLE_ITEM}"
    }, {
        type: "input_value",
        name: "DELTA",
        check: "Number"
    }],
    previousStatement: null,
    nextStatement: null,
    colour: "%{BKY_VARIABLES_HUE}",
    helpUrl: "%{BKY_MATH_CHANGE_HELPURL}",
    extensions: ["math_change_tooltip"]
}, {
    type: "math_round",
    message0: "%1 %2",
    args0: [{
        type: "field_dropdown",
        name: "OP",
        options: [
            ["%{BKY_MATH_ROUND_OPERATOR_ROUND}", "ROUND"],
            ["%{BKY_MATH_ROUND_OPERATOR_ROUNDUP}", "ROUNDUP"],
            ["%{BKY_MATH_ROUND_OPERATOR_ROUNDDOWN}", "ROUNDDOWN"]
        ]
    }, {
        type: "input_value",
        name: "NUM",
        check: "Number"
    }],
    output: "Number",
    colour: Colour.Math,
    helpUrl: "%{BKY_MATH_ROUND_HELPURL}",
    tooltip: "%{BKY_MATH_ROUND_TOOLTIP}"
}, {
    type: "math_on_list",
    message0: "%1 %2",
    args0: [{
        type: "field_dropdown",
        name: "OP",
        options: [
            ["%{BKY_MATH_ONLIST_OPERATOR_SUM}", "SUM"],
            ["%{BKY_MATH_ONLIST_OPERATOR_MIN}", "MIN"],
            ["%{BKY_MATH_ONLIST_OPERATOR_MAX}", "MAX"],
            ["%{BKY_MATH_ONLIST_OPERATOR_AVERAGE}", "AVERAGE"],
            ["%{BKY_MATH_ONLIST_OPERATOR_MEDIAN}", "MEDIAN"],
            ["%{BKY_MATH_ONLIST_OPERATOR_MODE}", "MODE"],
            ["%{BKY_MATH_ONLIST_OPERATOR_STD_DEV}",
                "STD_DEV"
            ],
            ["%{BKY_MATH_ONLIST_OPERATOR_RANDOM}", "RANDOM"]
        ]
    }, {
        type: "input_value",
        name: "LIST",
        check: "Array"
    }],
    output: "Number",
    colour: Colour.Math,
    helpUrl: "%{BKY_MATH_ONLIST_HELPURL}",
    mutator: "math_modes_of_list_mutator",
    extensions: ["math_op_tooltip"]
}, {
    type: "math_modulo",
    message0: "%{BKY_MATH_MODULO_TITLE}",
    args0: [{
        type: "input_value",
        name: "DIVIDEND",
        check: "Number"
    }, {
        type: "input_value",
        name: "DIVISOR",
        check: "Number"
    }],
    inputsInline: !0,
    output: "Number",
    colour: Colour.Math,
    tooltip: "%{BKY_MATH_MODULO_TOOLTIP}",
    helpUrl: "%{BKY_MATH_MODULO_HELPURL}"
}, {
    type: "math_constrain",
    message0: "%{BKY_MATH_CONSTRAIN_TITLE}",
    args0: [{
        type: "input_value",
        name: "VALUE",
        check: "Number"
    }, {
        type: "input_value",
        name: "LOW",
        check: "Number"
    }, {
        type: "input_value",
        name: "HIGH",
        check: "Number"
    }],
    inputsInline: !0,
    output: "Number",
    colour: Colour.Math,
    tooltip: "%{BKY_MATH_CONSTRAIN_TOOLTIP}",
    helpUrl: "%{BKY_MATH_CONSTRAIN_HELPURL}"
}, {
    type: "math_random_int",
    message0: "%{BKY_MATH_RANDOM_INT_TITLE}",
    args0: [{
        type: "input_value",
        name: "FROM",
        check: "Number"
    }, {
        type: "input_value",
        name: "TO",
        check: "Number"
    }],
    inputsInline: !0,
    output: "Number",
    colour: Colour.Math,
    tooltip: "%{BKY_MATH_RANDOM_INT_TOOLTIP}",
    helpUrl: "%{BKY_MATH_RANDOM_INT_HELPURL}"
}, {
    type: "math_random_float",
    message0: "%{BKY_MATH_RANDOM_FLOAT_TITLE_RANDOM}",
    output: "Number",
    colour: Colour.Math,
    tooltip: "%{BKY_MATH_RANDOM_FLOAT_TOOLTIP}",
    helpUrl: "%{BKY_MATH_RANDOM_FLOAT_HELPURL}"
}]);



Blockly.Blocks['math_convert'] = {
	init: function() {
		this.appendValueInput('MAIN')
			.appendField('convert')
			;
		this.appendDummyInput()
			.appendField('to')
			.appendField(new Blockly.FieldDropdown( [['number','int'] , ['string' , 'str'],['float','float']] ), 'MODE' )
			;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Math' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['math_convert'] = function(block) {
	var mode = block.getFieldValue('MODE');
	var obj = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_NONE);
	var code = mode + '(' + obj + ')';
	return [code, Blockly.Python.ORDER_NONE];
};
