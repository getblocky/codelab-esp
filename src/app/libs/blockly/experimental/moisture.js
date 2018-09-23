goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////


Blockly.Blocks['moisture-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField('get')
			.appendField("Water Sensor's value")
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('moisture') ) , 'PORT' )
			;
		this.module = 'moisture' ;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Sensor' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['moisture-get'] = function(block) {
	var port = block.getFieldValue('PORT');
	var mode = block.getFieldValue('MODE');
	if (port == 'None') return '';
	var object = port ;
	AddToSection('import' , 'from Blocky.Moisture import *\n');
	AddToSection('declare' , object + " = Moisture(port='" + port +"')\n");
	
	var code = object + '.' + 'value()'  ;
	return [code, Blockly.Python.ORDER_NONE];
};

