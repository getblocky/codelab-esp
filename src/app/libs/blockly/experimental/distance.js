goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////


Blockly.Blocks['distance-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField('get')
			.appendField("Distance")
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('distance') ) , 'PORT' )
			;
		this.module = 'distance' ;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Sensor' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['distance-get'] = function(block) {
	var port = block.getFieldValue('PORT');
	var mode = block.getFieldValue('MODE');
	if (port == 'None') return '';
	var object = port ;
	AddToSection('import' , 'from Blocky.Distance import *\n');
	AddToSection('declare' , object + " = Distance(port='" + port +"')\n");
	
	var code = object + '.' + 'value()'  ;
	return [code, Blockly.Python.ORDER_NONE];
};
