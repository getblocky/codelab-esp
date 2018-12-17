goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////


Blockly.Blocks['light-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField('read light')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('light') ) , 'PORT' )
			;
		this.module = 'light' ;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Sensor' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['light-get'] = function(block) {
	var port = block.getFieldValue('PORT');
	var mode = block.getFieldValue('MODE');
	if (port == 'None') return '';
	var object = port ;
	AddToSection('import' , 'from Blocky.Light import * ' + getLibraryVersion('Light') + '\n');
	AddToSection('declare' , object + " = Light(port='" + port +"')\n");
	
	var code = object + '.' + 'value()'  ;
	return [code, Blockly.Python.ORDER_NONE];
};
