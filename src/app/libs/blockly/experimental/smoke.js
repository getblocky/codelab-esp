goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////


Blockly.Blocks['smoke-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField('get')
			.appendField("Smoke's value")
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('smoke') ) , 'PORT' )
			;
		this.module = 'smoke' ;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Input' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['smoke-get'] = function(block) {
	var port = block.getFieldValue('PORT');
	var mode = block.getFieldValue('MODE');
	if (port == 'None') return '';
	var object = port ;
	AddToSection('import' , 'from Blocky.Smoke import *\n');
	AddToSection('declare' , object + " = Smoke(port='" + port +"')\n");
	
	var code = object + '.' + 'value()'  ;
	return [code, Blockly.Python.ORDER_NONE];
};
