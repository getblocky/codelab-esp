goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////


Blockly.Blocks['potentiometer-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField('read potentiometer')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('potentiometer') ) , 'PORT' )
			;
		this.module = 'potentiometer' ;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Input' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['potentiometer-get'] = function(block) {
	var port = block.getFieldValue('PORT');
	var mode = block.getFieldValue('MODE');
	if (port == 'None') return '';
	var object = port ;
	AddToSection('import' , 'from Blocky.Potentiometer  import *\n');
	AddToSection('declare' , object + " = Potentiometer (port='" + port +"')\n");
	
	var code = object + '.' + 'value()'  ;
	return [code, Blockly.Python.ORDER_NONE];
};
