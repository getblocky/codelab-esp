goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////
Blockly.Blocks['rtc-sync']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
			.appendField('Sync time with RTC modules')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('RTC') ) , 'PORT' ) 
			;
		
		this.category  = 'Timer' ;
		this.role = 'Set';
		this.module = 'RTC';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
	}
	
};


Blockly.Python['rtc-sync'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_NONE);
	if (port == 'None') return '';
	var code = '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.RTC import * ' + getLibraryVersion('RTC') + '\n');
	AddToSection('declare' , object + " = RTC(port='" + port +"')\n");
	code = object + '.' + 'turn(' + state + ')' + '\n' ; 
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};