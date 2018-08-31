'use strict'

goog.provide('Blockly.Python.buttons');
goog.require('Blockly.Python');

// Any imports need to be reserved words
Blockly.Python.addReservedWords('blocky');
Blockly.Python.addReservedWords('machine');


Blockly.Blocks['NeoPixelSet'] = {
	init: function() {
	this.appendDummyInput()
        .appendField("Set a RGB Strip")
		.appendField("with")
		.appendField(new Blockly.FieldNumber(10), "NUMB")
        .appendField("leds on port")
		.appendField(new Blockly.FieldDropdown(DefaultPort), "PORT")
		.appendField('with name')
		.appendField(new Blockly.FieldTextInput('rgb') , "NAME");
    this.setColour(Colour.Output);
	this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
	this.setTooltip("");
	this.setHelpUrl("");
	this.ToolboxCoordinate = new goog.math.Coordinate ({x: 16, y: 73})
	this.blockInWorkspace = false;
	},
};

Blockly.Python['NeoPixelSet'] = function(block) {
	var numb = block.getFieldValue('NUMB');
	var name = block.getFieldValue('NAME');
	var port = block.getFieldValue('PORT');
	
	AddToSection('import' , 'from RGB import *\n'); // do not use NeoPixel class because of port define 
	var code = name + " = RGB(port='" + port + "',amount=" + numb + ")\n"
	
	return code;
};

Blockly.Blocks['NeoPixelSetColorSingle'] = {
	init: function() {
	this.appendValueInput('COLOR')
        .appendField("Set color of led number")
		.appendField(new Blockly.FieldNumber(1), "TARG")
		.appendField('of')
		.appendField(new Blockly.FieldTextInput('rgb') , 'NAME')
		.appendField('to color');
	this.appendDummyInput();
		
		
    this.setColour(Colour.Output);
	this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
	this.setTooltip("");
	this.setHelpUrl("");
	this.ToolboxCoordinate = new goog.math.Coordinate ({x: 16, y: 73})
	this.blockInWorkspace = false;
	},
};

Blockly.Python['NeoPixelSetColorSingle'] = function(block) {
	var targ = block.getFieldValue('TARG');
	var name = block.getFieldValue('NAME');
	var color = block.getFieldValue('COLOR');

	
	AddToSection('import' , 'from RGB import *\n'); // do not use NeoPixel class because of port define 
	var code = name + ".setColor(target=" + targ + ",colour=" + color + ")\n"
	
	return code;
};

Blockly.Blocks['NeoPixelSetColorMulti'] = {
	init: function() {
	this.appendValueInput('COLOR')
        .appendField("Set color of led from")
		.appendField(new Blockly.FieldNumber(1), "TARG1")
		.appendField('to')
		.appendField(new Blockly.FieldNumber(10), "TARG2")
		.appendField('of')
		.appendField(new Blockly.FieldTextInput('rgb') , 'NAME')
		.appendField('to color');
	this.appendDummyInput();
		
		
    this.setColour(Colour.Output);
	this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
	this.setTooltip("");
	this.setHelpUrl("");
	this.ToolboxCoordinate = new goog.math.Coordinate ({x: 16, y: 73});
	this.blockInWorkspace = false;
	},
};


Blockly.Python['NeoPixelSetColorMulti'] = function(block) {
	var targ1 = block.getFieldValue('TARG1');
	var targ2 = block.getFieldValue('TARG2');
	var name = block.getFieldValue('NAME');
	var color = block.getFieldValue('COLOR');

	
	AddToSection('import' , 'from RGB import *\n'); // do not use NeoPixel class because of port define 
	var code = name + ".setColor(target=[x for x in range(" + targ1 + "," + targ2 + ")]" + ",colour=" + color + ")\n"
	
	return code;
};

Blockly.Blocks['NeoPixelSetColorAll'] = {
	init: function() {
	this.appendValueInput('COLOR')
        .appendField("Set color of all led of")
		.appendField(new Blockly.FieldTextInput('rgb') , 'NAME')
		.appendField('to color');
	this.appendDummyInput();
		
		
    this.setColour(Colour.Output);
	this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
	this.setTooltip("");
	this.setHelpUrl("");
	this.ToolboxCoordinate = new goog.math.Coordinate ({x: 16, y: 73});
	this.blockInWorkspace = false;
	},
};

Blockly.Python['NeoPixelSetColorAll'] = function(block) {
	var name = block.getFieldValue('NAME');
	var color = block.getFieldValue('COLOR');

	
	AddToSection('import' , 'from RGB import *\n'); // do not use NeoPixel class because of port define 
	var code = name + ".setColor(colour=" + color + ")\n"
	
	return code;
};


