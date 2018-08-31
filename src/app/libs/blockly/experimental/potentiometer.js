goog.require('Blockly');
goog.require('Blockly.Blocks');

Blockly.Blocks['potentionmeter-declare'] =
{
	init:function(){
		this.appendDummyInput('MAIN')
			.appendField('Set a Potentionmeter ')
			.appendField('on port')
			.appendField(new Blockly.FieldDropdown(GeneratePortList(true)),'PORT')
			.appendField('as')
			.appendField(new Blockly.FieldTextInput(GenerateName('potentionmeter')),'NAME')
			.appendField('with sensitive level')
			.appendField(new Blockly.FieldDropdown([['0','0'],['1','1'],['2','2'],['3','3']]),'TYPE');
			//.appendField(this.id);
			
		this.setColour(Colour.Input);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		this.self_disabled = true;
		this.self_enabled = true ;
		this.Colour = Colour.Input ;
		this.PortPosition = 2 ;

	},
};


Blockly.Python['potentionmeter-declare'] = function(block) {
	var name = block.getFieldValue('NAME');
	var port = block.getFieldValue('PORT');
	var type = block.getFieldValue('TYPE');


	AddToSection('import' , 'from Blocky.Potentionmeter import *\n');
	AddToSection('declare' , name + " = Potentionmeter(port='" + port +"',sensitive='" + type + "')\n");
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return '';
};


Blockly.Blocks['potentionmeter-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldDropdown(GenerateListName('potentionmeter')), "NAME")
			.appendField("get current value");
			

		this.setOutput(true , null );
		this.setColour(230);
		this.setTooltip("");
		this.setHelpUrl("");
		this.setColour(Colour.Input);
		this.self_disabled = false ;
		this.self_enabled = false ;
		this.self_disabled = true;
		this.self_enabled = true ;
		this.Colour = Colour.Input ;
	}
};

Blockly.Python['potentionmeter-get'] = function(block) {
	var name = block.getFieldValue('NAME');
	var mode = block.getFieldValue('MODE');

	AddToSection('import' , 'from Blocky.Potentionmeter import *\n');
	
	var code = name + '.read()' ;
	return [code, Blockly.Python.ORDER_NONE];
};

