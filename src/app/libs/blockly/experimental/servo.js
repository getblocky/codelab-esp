goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////
Blockly.Blocks['servo-set']=
{
	init : function()
	{
		this.appendValueInput('MAIN')
			.appendField('Servo')
			.appendField(new Blockly.FieldDropdown( PORT('servo') ) , 'PORT' ) 
			.appendField('turn to angle (0-180)')			
			;
		
		this.category  = 'Output' ;
		this.role = 'Set';
		this.module = 'servo';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
		
	}
	
};

Blockly.Python['servo-set'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	//var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_NONE); //angle
	var state = block.childBlocks_[0].inputList[0].fieldRow[0].text_; //angle
	if (port == 'None') return '';
	var code = '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.Servo import * ' + getLibraryVersion('Servo') + '\n');
	AddToSection('declare' , object + " = Servo(port='" + port +"')\n");
	code = object + '.' + 'angle(' + state + ')' + '\n' ; 
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};





Blockly.Blocks['servo_state'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldDropdown( [['ON',"'on'"],['OFF',"'off'"]] ) , 'STATE' )
			;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Output' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['servo_state'] = function(block) {
	var code = block.getFieldValue('STATE') ; 
	return [code, Blockly.Python.ORDER_ATOMIC ];
};
