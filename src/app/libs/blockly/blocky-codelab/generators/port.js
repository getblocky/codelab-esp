Blockly.Python['port_name'] = function(block) {
  var dropdown_port_list = block.getFieldValue('port_list');
  // TODO: Assemble JavaScript into code variable.
  var code = dropdown_port_list + ')\n' ;
  // TODO: Change ORDER_NONE to the correct strength.
  return code;
};


