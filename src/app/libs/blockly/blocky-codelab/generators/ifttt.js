goog.provide('Blockly.Python.buttons');
goog.require('Blockly.Python');

// Any imports need to be reserved words
Blockly.Python.addReservedWords('blocky');
Blockly.Python.addReservedWords('machine');


Blockly.Python['ifttt_setup'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  // TODO: Assemble Python into code variable.
  Blockly.Python.definitions_['import_ifttt'] = 'from Blocky.IFTTT import *';
  var code = "IFTTT.SetKey('"+text_name+"')\n";
  return code;
};