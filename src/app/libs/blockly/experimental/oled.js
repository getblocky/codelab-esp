goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////

Blockly.Blocks['display_text']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
			.appendField('"')
			.appendField(new Blockly.FieldTextInput(""), 'TEXT')
			.appendField('"')
			;
		
		this.category  = 'Display' ;
		this.setColour(Colour[this.category]);
		this.setOutput(true , null);
	}
} ;

Blockly.Python['display_text'] = function(block) {
	var text = block.getFieldValue('TEXT');
	var code = '"' + text + '"';
	return [code, Blockly.Python.ORDER_ATOMIC ];
};


Blockly.Blocks['oled-display']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
			.appendField('OLED')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('oled') ) , 'PORT' ) 
			.appendField('display on')
			.appendField(new Blockly.FieldDropdown( [["LINE1","1"],["LINE2","2"] ] ) , 'LINE' )
			.appendField('  ')
			;
		this.appendValueInput('LEFT')
			;
		this.appendDummyInput('DUMMY1')
			.appendField(':')
			;
		this.appendValueInput('RIGHT')
			;
		this.appendDummyInput('DUMMY2');
		this.category  = 'Display' ;
		this.role = 'Set';
		this.module = 'oled';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
	}
	
};

Blockly.Python['oled-display'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	var line = block.getFieldValue('LINE');
	var left = Blockly.Python.valueToCode(block, 'LEFT', Blockly.Python.ORDER_NONE);
	var right = Blockly.Python.valueToCode(block, 'RIGHT', Blockly.Python.ORDER_NONE);
	if(right==='"VALUE"') right = '""';
	
	if (port == 'None') return '';
	var code = '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.OLED import *\n');
	AddToSection('declare' , object + " = OLED(port='" + port +"')\n");
	code = object + '.' + 'display(line=' + line + ',left=' + left + ',right=' + right + ')' + '\n' ; 
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};


Blockly.Blocks['oled-clear']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
			.appendField('OLED')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('oled') ) , 'PORT' ) 
			.appendField('clear')
			.appendField(new Blockly.FieldDropdown([ ["LINE 1","1"],["LINE 2","2"],["ALL","None"] ]) , 'LINE')
			;
		
		this.category  = 'Display' ;
		this.role = 'Set';
		this.module = 'oled';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
	}
	
};

Blockly.Python['oled-clear'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	var state = block.getFieldValue('LINE');
	if (port == 'None') return '';
	var code = '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.OLED import *\n');
	AddToSection('declare' , object + " = OLED(port='" + port +"')\n");
	code = object + '.' + 'clear(' + state + ')' + '\n' ; 
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};


Blockly.Blocks['oled-backlight']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
			.appendField('OLED')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('oled') ) , 'PORT' ) 
			.appendField('turn backlight')
			.appendField(new Blockly.FieldDropdown([ ["ON","on"],["OFF","off"],["ALL","None"] ]) , 'LINE')
			;
		
		this.category  = 'Display' ;
		this.role = 'Set';
		this.module = 'oled';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
	}
	
};

Blockly.Python['oled-backlight'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	var state = block.getFieldValue('LINE');
	if (port == 'None') return '';
	var code = '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.OLED import *\n');
	AddToSection('declare' , object + " = OLED(port='" + port +"')\n");
	code = object + '.' + 'backlight("' + state + '")' + '\n' ; 
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};