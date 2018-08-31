'use strict';

goog.provide('Blockly.Blocks.colour');
goog.require('Blockly.Blocks');
goog.require('Blockly.constants');
goog.require('Blockly.Python');
goog.require('Blockly.Variables');

Blockly.Python.addReservedWords('machine');
Blockly.Python.addReservedWords('blocky');





Blockly.Blocks['blocky_remote_receive'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("When received IR Command ")
        .appendField(new Blockly.FieldTextInput("TurnOn"), "CMD")
        .appendField(new Blockly.FieldDropdown([["port1","PORT1"], ["port2","PORT2"], ["port3","PORT3"]]), "PORT");
		
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setColour(84);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Python['blocky_remote_receive'] = function(block) {
	
	var text_cmd = block.getFieldValue('CMD').replace(":","h");
	var statements_name = Blockly.Python.statementToCode(block, 'NAME');
	var port_name = block.getFieldValue("PORT");
	// TODO: Assemble Python into code variable.
	
	
	/////////////// FUNCTION DEFINITION ///////////////////////
	var function_name = port_name.toUpperCase() +"_ActionWhenReceive" ;
	var definition_import = 'def ' + function_name +"():\n";
	if (statements_name) {
		definition_import+=statements_name;
	}
	else{
		definition_import += '\tpass\n';
	}
	
	if (Blockly.Python.definitions_['function_section'].includes(function_name) == false )
	{
		Blockly.Python.definitions_['function_section'] += definition_import ;
	}
	///////////// LIBRARY DEFINITION //////////////////////////
	var library_name = 'from Blockly.Remote import *' ;
	if (Blockly.Python.definitions_['import_section'].includes(library_name)==false)
	{
		Blockly.Python.definitions_['import_section'] += library_name ;
	}
	////////////// DECLARE PORT USING //////////////////////
	var port_string = port_name + " = Remote(" + port_name.toUpperCase() + ")\n";
	if (Blockly.Python.definitions_['declare_section'].includes(port_string)==false)
	{
		Blockly.Python.definitions_['declare_section'] += port_string ;
	} 
	
	///////////////// EVENT DECLARE ////////////////////
	var event_string = port_name + ".WhenReceived(command = '"+text_cmd+"',action = " + function_name + ")\n";
	if (Blockly.Python.definitions_['event_section'].includes(event_string)==false)
	{
		Blockly.Python.definitions_['event_section'] += event_string ;
	}
	
	
	return "";
	};
var port_use_state = {PORT1:'unused',PORT2:'unused',PORT3:'unused',PORT4:'unused',PORT5:'unused',PORT6:'unused',PORT7:'unused',PORT8:'servo'};
console.warn(port_use_state[1]);
function GetFreePort(){
	var options = [];
	if (port_use_state.PORT1 == 'unused' || port_use_state.PORT1 == 'remote'){options.push(['port1','PORT1']);}
	if (port_use_state.PORT2 == 'unused' || port_use_state.PORT2 == 'remote'){options.push(['port2','PORT2']);}
	if (port_use_state.PORT3 == 'unused' || port_use_state.PORT3 == 'remote'){options.push(['port3','PORT3']);}
	if (port_use_state.PORT4 == 'unused' || port_use_state.PORT4 == 'remote'){options.push(['port4','PORT4']);}
	if (port_use_state.PORT5 == 'unused' || port_use_state.PORT5 == 'remote'){options.push(['port5','PORT5']);}
	if (port_use_state.PORT6 == 'unused' || port_use_state.PORT6 == 'remote'){options.push(['port6','PORT6']);}
	if (port_use_state.PORT7 == 'unused' || port_use_state.PORT7 == 'remote'){options.push(['port7','PORT7']);}
	if (port_use_state.PORT8 == 'unused' || port_use_state.PORT8 == 'remote'){options.push(['port8','PORT8']);}
	
	
	return options ;

}
Blockly.Blocks['blocky_remote_learn'] = {
	
	init: function() {
		this.previousPort = "";
		this.appendDummyInput()
			.appendField(new Blockly.FieldDropdown(GetFreePort()), "PORT")
			.appendField(". Learn IR signals as")
			.appendField(new Blockly.FieldTextInput("TurnOn"), "CMD");
		this.previousPort = this.getFieldValue('PORT');
		port_use_state[this.previousPort] = 'remote';
		
		console.log('PREVIOUS',this.getFieldValue('PORT'));
		console.log('PORTLIST',port_use_state);
		
		this.setOnChange(function(changeEvent) {
			console.log('CHANGED',this.getFieldValue('PORT'));
			port_use_state[this.previousPort] = 'unused';
			port_use_state[this.getFieldValue('PORT')] = 'remote';
			this.previousPort = this.getFieldValue('PORT');
			console.log('PORTLIST',port_use_state);
		});
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(230);
		this.setTooltip("");
		this.setHelpUrl("");
	},
	
    onchange: function(a, b) {
        //Blockly.Names.equals(a, this.getFieldValue("NAME")) && this.setFieldValue(b, "NAME");
		listportused += this.getFieldValue('PORT');
		console.log(listportused);
		
    }
};

Blockly.Python['blocky_remote_learn'] = function(block) {
	Blockly.Python.definitions_['import_remote'] = 'from Blocky.Remote import *';
  var dropdown_port = block.getFieldValue('PORT');
  var text_cmd = block.getFieldValue('CMD');
  // TODO: Assemble Python into code variable.
  var code = dropdown_port.toLowerCase() + ".learn('"+text_cmd+"')\n";
  return code;
};

