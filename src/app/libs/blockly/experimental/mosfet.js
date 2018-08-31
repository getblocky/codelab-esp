goog.require('Blockly');
goog.require('Blockly.Blocks');

Blockly.Blocks['mosfet-declare'] =
{
	init:function(){
		this.appendDummyInput('MAIN')
			.appendField('Set a Mosfet')
			.appendField('on port')
			.appendField(new Blockly.FieldDropdown(GeneratePortList()),'PORT')
			.appendField('as')
			.appendField(new Blockly.FieldTextInput(GenerateName('mosfet')),'NAME');
			//.appendField(this.id);
		
		this.setColour(Colour.Output);
		
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		this.user_enabled = false;
		
		this.self_disabled = true;
		this.self_enabled = true ;
		this.Colour = Colour.Output ;
		this.PortPosition = 2 ;
		


	},
};


Blockly.Python['mosfet-declare'] = function(block) {
	var name = block.getFieldValue('NAME');
	var port1 = block.getFieldValue('PORT');
	if (name=='None') return '';
	AddToSection('import' , 'from Blocky.Mosfet import *\n');
	AddToSection('declare' , name + " = Mosfet(port='" + port1 + "')\n");
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return '';
};

Blockly.Blocks['mosfet-event'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldDropdown(GenerateListName('mosfet')), "NAME")
			.appendField("when")
			.appendField(new Blockly.FieldDropdown([['pressed','pressed'],['held','held']]),'MODE')
			.appendField(new Blockly.FieldNumber(1) , 'TIME')
			.appendField(new Blockly.FieldLabel('time'),'UNIT');
		this.appendValueInput('temp').setVisible(false);
		this.appendStatementInput('CODE');
		this.appendDummyInput();
		this.setColour(230);
		this.setTooltip("");
		this.setHelpUrl("");
		this.Colour = Colour.Output ;
		this.setColour(Colour.Output);
		this.self_disabled = true;
		this.self_enabled = true ;
	}
};

Blockly.Python['mosfet-event'] = function(block) {
	var code = Blockly.Python.statementToCode(block, 'CODE');
	
	var name = block.getFieldValue('NAME');
	var mode = block.getFieldValue('MODE');
	var time = block.getFieldValue('TIME');
	
	if (name == 'None'||!code.length) return ;
	var function_name = GenerateName('MosfetEvent',true,block.id);
	AddToSection('import' , 'from Blocky.Mosfet import *\n');
	
	AddToSection('once' , name + ".event(mode='" + mode + "',time=" + time + ",function="+function_name+")\n");

	AddToSection('function','def '+function_name+'():\n' + code + '\n');
};



Blockly.Blocks['mosfet-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldDropdown(GenerateListName('mosfet')), "NAME")
			.appendField(new Blockly.FieldLabel("get current step count "));

		this.setOutput(true , null );
		this.setColour(230);
		this.setTooltip("");
		this.setHelpUrl("");
		this.Colour = Colour.Output;
		this.setColour(Colour.Output);
		this.self_disabled = true;
		this.self_enabled = true ;
	}
};

Blockly.Python['mosfet-get'] = function(block) {
	var name = block.getFieldValue('NAME');
	if (name=='None') return '';
	AddToSection('import' , 'from Blocky.Mosfet import *\n');
	
	var code = name + '.value()' ;
	return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['mosfet-set'] =
{
	init:function(){
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldTextInput(GenerateName('mosfet')),'NAME')
			.appendField('turn')
			.appendField(new Blockly.FieldDropdown([['on','1'],['off','0']]),'STATE');
			//.appendField(this.id);
		
		this.setColour(Colour.Output);
		this.Colour = Colour.Output ;
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		this.user_enabled = false;
		this.self_disabled = true;
		this.self_enabled = true ;

	},
};


Blockly.Python['mosfet-set'] = function(block) {
	var name = block.getFieldValue('NAME');
	var state = block.getFieldValue('STATE');
	if (name=='None') return '';
	AddToSection('import' , 'from Blocky.Mosfet import *\n');
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = name + ".value("+state+")\n";
	return code;
};
