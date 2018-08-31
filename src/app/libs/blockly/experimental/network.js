'use strict';

goog.provide('Blockly.Blocks.colour');
goog.require('Blockly.Blocks');
goog.require('Blockly.constants');
goog.require('Blockly.Python');
goog.require('Blockly.Variables');
goog.require('Blockly.Workspace');

Blockly.Python.addReservedWords('machine');
Blockly.Python.addReservedWords('blocky');




Blockly.Blocks['network-event'] = {
  init: function() {
    this.appendDummyInput("MAIN")
        .appendField("when receive topic ")
        .appendField(new Blockly.FieldTextInput('HelloBlocky'), "TOPIC")
		.appendField('save message to')
		.appendField(new Blockly.FieldVariable(GenerateName('message')) , 'VAR');
    this.appendStatementInput("CODE")
        .setCheck(null);
    this.appendDummyInput();
    this.setColour(Colour.Network);
	this.setTooltip("");
	this.setHelpUrl("");
	this.role = 'Event';
	this.module = 'network';
  }
};

Blockly.Python['network-event'] = function(block) {
  var topic = block.getFieldValue('TOPIC');
  var variable =  block.getField('VAR').text_ ;
  var code = Blockly.Python.statementToCode(block, 'CODE');
  // TODO: Assemble Python into code variable.
  if (code.length){

  
  // function code 
  var function_name = 'network_' + topic ;
 
  
  AddToSection('once' ,"network.subscribe('" + topic + "'," + function_name + ')\n' );
  AddToSection('function' , async_cancellable+'async def '+function_name +"(topic,message):\n" + code );
  }
  return '';
};



Blockly.Blocks['network_send'] = {
  init: function() {
	this.appendValueInput("DATA")
        .appendField("send to topic")
        .appendField(new Blockly.FieldTextInput('HelloBlocky'), "TOPIC")
		.appendField("=");
	this.appendDummyInput('NAME');

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(Colour.Network);
	this.setTooltip("");
	this.setHelpUrl("");
	
  }
};
Blockly.Python['network_send'] = function(block) {
  var topic = this.getFieldValue('TOPIC');
  var data = Blockly.Python.valueToCode(block, 'DATA', Blockly.Python.ORDER_NONE);
  if (!data.length)data = 'None' ;
  // TODO: Assemble Python into code variable.
  
  
  var code = "await network.send(topic='" + topic + "',data=str(" + String(data) + "))\n";
  return code;
};



Blockly.Blocks['network_log'] = {
  init: function() {
    this.appendValueInput("LOG")
        .setCheck(null)
        .appendField("send log");
    this.appendDummyInput();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(Colour.Network);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.Python['network_log'] = function(block) {
  var log = Blockly.Python.valueToCode(block, 'LOG', Blockly.Python.ORDER_NONE);
  // TODO: Assemble Python into code variable.
  var code = "await network.log(" + String(log) + ")\n";
  return code;
};

