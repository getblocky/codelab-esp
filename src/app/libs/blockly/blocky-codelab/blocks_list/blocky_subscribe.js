'use strict';

goog.provide('Blockly.Blocks.colour');
goog.require('Blockly.Blocks');
goog.require('Blockly.constants');
goog.require('Blockly.Python');
goog.require('Blockly.Variables');

Blockly.Python.addReservedWords('machine');
Blockly.Python.addReservedWords('blocky');




Blockly.Blocks['blocky_subscribe'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("When received a message from topic")
        .appendField(new Blockly.FieldTextInput(), "TOPIC");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Python['blocky_subscribe'] = function(block) {
	Blockly.Python.definitions_['import_message'] = 'from Blocky.Message import *';
  var text_topic = block.getFieldValue('TOPIC');
  var statements_name = Blockly.Python.statementToCode(block, 'NAME');
  
  // TODO: Assemble Python into code variable.
  var code = "\ndef ActionForTopic_" + text_topic.toUpperCase() + "():\n"
  code += statements_name;
  code += "\tpass\n";
  code += "WhenReceivedTopic(topic = '" + text_topic + "', action = ActionForTopic_" + text_topic.toUpperCase() + ")\n\n"
  return code;
};
