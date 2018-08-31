'use strict';

goog.provide('Blockly.Blocks.colour');
goog.require('Blockly.Blocks');
goog.require('Blockly.constants');
goog.require('Blockly.Python');
goog.require('Blockly.Variables');

Blockly.Python.addReservedWords('machine');
Blockly.Python.addReservedWords('blocky');




Blockly.Blocks['blocky_runonce'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("run once")
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Python['blocky_runonce'] = function(block) {
  var statements_name = Blockly.Python.statementToCode(block, 'NAME');
  
	var code = statements_name.slice(2) ;
	code += "\n";
	Blockly.Python.definitions_['run_once'] = code;
  return '';
};

Blockly.Blocks['blocky_runforever'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("run forever")
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Python['blocky_runforever'] = function(block) {
	Blockly.Python.definitions_['import_section'] = ""
	Blockly.Python.definitions_['declare_section'] = ""
	Blockly.Python.definitions_['function_section'] = ""
	Blockly.Python.definitions_['event_section'] = ""
	
  var statements_name = Blockly.Python.statementToCode(block, 'NAME');
	var code = "while True : # run forever\n";
	code += statements_name;
	code += "\tpass\n";
  return code;
};
