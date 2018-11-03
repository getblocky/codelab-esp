goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////
Blockly.Blocks['rfid-set']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
			.appendField('RFID')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('rfid') ) , 'PORT' ) 
			.appendField('fly')
			;
		
		this.category  = 'Input' ;
		this.role = 'Set';
		this.module = 'rfid';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
	}
	
};

Blockly.Python['rfid-set'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var code = '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.RFID import * ' + getLibraryVersion('RFID') + '\n');
	AddToSection('declare' , object + " = RFID(port='" + port +"')\n");
	code = object + '.' + 'set()' + '\n' ; 
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};

Blockly.Blocks['rfid-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField('get')
			.appendField('RFID')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('rfid') ) , 'PORT' )
			.appendField("'s state")
			;
		this.module = 'rfid' ;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Input' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['rfid-get'] = function(block) {
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var object = port ;
	AddToSection('import' , 'from Blocky.RFID import * ' + getLibraryVersion('RFID') + '\n');
	AddToSection('declare' , object + " = RFID(port='" + port +"')\n");
	
	var code = object + '.value()' ;
	return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['rfid-event'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField("when")
			.appendField('RFID')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('rfid') ) , 'PORT' )
			.appendField('detect card')
			.appendField(new Blockly.FieldTextInput('        ') , 'ID')
			;
			
		this.appendStatementInput('CODE');
		this.category  = 'Input' ;
		this.module = 'rfid';
		this.role = 'Event';
		this.setColour(Colour[this.category]);
	}
};

Blockly.Python['rfid-event'] = function(block) {
	var name = block.module ;
	var type = 'all';
	var code = Blockly.Python.statementToCode(block, 'CODE');
	var port = block.getFieldValue('PORT') ;
	var id = block.getFieldValue('ID') ; 
	if (id!= '        ') type = id ; 
	if (!code.length||port == 'None') return '';
	var object = port ; 
	//if (name == 'None'||!code.length) return ;
	var function_name = 'Event_' + port + '_' + type   ;
	AddToSection('import' , 'from Blocky.RFID import * ' + getLibraryVersion('RFID') + '\n');
	AddToSection('declare' ,object + " = RFID(port='" + port +"')\n");
	AddToSection('event' , object  + ".event(type='" + type + "',function="+function_name+")\n");

	AddToSection('function', async_cancellable+'async def '+function_name+'():\n' +Blockly.Python.INDENT+GlobalVariable+ code + '\n');
};
