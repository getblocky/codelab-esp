goog.require('Blockly');
goog.require('Blockly.Blocks');


Blockly.Blocks['led_pwm_output'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldNumber( 0 , 0 , 4095) , 'VAL' )
			;
		this.module = 'led' ;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Control' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['led_pwm_output'] = function(block) {
	var fade = block.getFieldValue('VAL');
	if (port == 'None') return '';
	return [fade, Blockly.Python.ORDER_ATOMIC ];
};

////////////////////////////////////////////////////////////////////////////////////
Blockly.Blocks['led-set']=
{
	init : function()
	{
		this.appendValueInput('MAIN')
			.appendField('LED')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('led') ) , 'PORT' ) 
			.appendField('turn')
			;
		
		this.category  = 'Control' ;
		this.role = 'Set';
		this.module = 'led';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
	}
	
};

Blockly.Blocks['led-fade']=
{
	init : function()
	{
		this.appendValueInput('MAIN')
			.appendField('LED')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('led') ) , 'PORT' ) 
			.appendField('fade (0-4095)')
			;
		
		this.category  = 'Control' ;
		this.role = 'Set';
		this.module = 'led';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
	}
	
};

Blockly.Python['led-fade'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_NONE);
	if (port == 'None') return '';
	var code = '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.LED import * ' + getLibraryVersion('LED') + '\n');
	AddToSection('declare' , object + " = LED(port='" + port +"')\n");
	code = object + '.' + 'fade(' + state + ')' + '\n' ; 
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};


Blockly.Python['led-set'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_NONE);
	if (port == 'None') return '';
	var code = '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.LED import * ' + getLibraryVersion('LED') + '\n');
	AddToSection('declare' , object + " = LED(port='" + port +"')\n");
	code = object + '.' + 'turn(' + state + ')' + '\n' ; 
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};



Blockly.Blocks['led-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField('get current state of LED')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('led') ) , 'PORT' )
			;
		this.module = 'led' ;
		this.setOutput(true , null );
		this.category  = 'Input' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['led-get'] = function(block) {
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var object = port ;
	AddToSection('import' , 'from Blocky.LED import * ' + getLibraryVersion('LED') + '\n');
	AddToSection('declare' , object + " = LED(port='" + port +"')\n");
	
	var code = object + '.value()' ;
	return [code, Blockly.Python.ORDER_ATOMIC ];
};




Blockly.Blocks['state_output'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldDropdown( [['ON',"'on'"],['OFF',"'off'"],['FLIP',"'flip'"]] ) , 'STATE' )
			;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Control' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		this.setMovable(false);
	}
};

Blockly.Python['state_output'] = function(block) {
	var code = block.getFieldValue('STATE') ; 
	return [code, Blockly.Python.ORDER_ATOMIC ];
};
