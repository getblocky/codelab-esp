'use strict';

goog.provide('Blockly.Blocks.colour');
goog.require('Blockly.Blocks');
goog.require('Blockly.constants');
goog.require('Blockly.Python');
goog.require('Blockly.Variables');

Blockly.Python.addReservedWords('machine');
Blockly.Python.addReservedWords('blocky');




Blockly.Blocks['blocky_alarm_routine'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("At ")
        .appendField(new Blockly.FieldTextInput("6:00"), "TIME")
        .appendField(new Blockly.FieldDropdown([["am","AM"], ["pm","PM"]]), "AMPM")
        .appendField(new Blockly.FieldDropdown([["everyday","EVERYDAY"], ["Monday","MON"], ["Tuesday","TUE"], ["Wednesday","WED"], ["Thurstday","THU"], ["Friday","FRI"], ["Saturday","SAT"], ["Sunday","SUN"]]), "DATE");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Python['blocky_alarm_routine'] = function(block) {
	
	var text_time = block.getFieldValue('TIME').replace(":","h");
	var dropdown_name = block.getFieldValue('AMPM');
	var dropdown_date = block.getFieldValue('DATE');
	var statements_name = Blockly.Python.statementToCode(block, 'NAME');
	// TODO: Assemble Python into code variable.
	/////////////// FUNCTION DEFINITION ///////////////////////
	var function_name = 'def ALARM_'+text_time+dropdown_name+"_"+dropdown_date+"():\n";
	var definition_import = function_name ;
	if (statements_name) {
		definition_import+=statements_name;
	}
	else{
		definition_import += '\tpass\n';
	}
	
	if (typeof Blockly.Python.definitions_['function_section'] === 'undefined')
		{
			Blockly.Python.definitions_['function_section'] = "";
		}
	if (Blockly.Python.definitions_['function_section'].includes(function_name) == false )
	{
		Blockly.Python.definitions_['function_section'] += definition_import
	}
	
	///////////////LIBRARY DEFINITION///////////////////////////
	var library_import = 'from Blocky.Scheduler import *\n';
	
	if (Blockly.Python.definitions_['import_section'].includes(library_import) == false )
	{
		Blockly.Python.definitions_['import_section'] += library_import
	}
	
	var code = "" ;
	code += "AddAlarm(time = '"+text_time+"',date = '"+dropdown_date+"',action=ALARM_"+text_time+dropdown_name+"_"+dropdown_date + ")\n";
	
	Blockly.Python.definitions_['event_section'] += code ;
	return "";
	};

	
Blockly.Blocks['blocky_alarm_exact'] = {
	
  init: function() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	if (dd<10){
		dd = '0'+dd;
	}
	if (mm<10){
		mm = '0'+mm;
	}
	today = mm + '/' + dd + '/' + yyyy;
    this.appendDummyInput()
        .appendField("At ")
        .appendField(new Blockly.FieldTextInput("6:00"), "TIME")
		.appendField(new Blockly.FieldDropdown([["am","AM"], ["pm","PM"]]), "AMPM")
		.appendField("on the date")
		.appendField(new Blockly.FieldDate(today),"DATE")
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.Python['blocky_alarm_exact'] = function(block) {
	var text_time = block.getFieldValue('TIME').replace(":","h");
	var dropdown_name = block.getFieldValue('AMPM');
	var dropdown_date = block.getFieldValue('DATE').replace("/","_");
	dropdown_date = dropdown_date.replace("/","_");
	var statements_name = Blockly.Python.statementToCode(block, 'NAME');
	// TODO: Assemble Python into code variable.
	/////////////// FUNCTION DEFINITION ///////////////////////
	var function_name = 'def ALARM_'+text_time+dropdown_name+"_"+dropdown_date+"():\n";
	var definition_import = function_name ;
	if (statements_name) {
		definition_import+=statements_name;
	}
	else{
		definition_import += '\tpass\n';
	}
	
	if (Blockly.Python.definitions_['function_section'].includes(function_name) == false )
	{
		Blockly.Python.definitions_['function_section'] += definition_import
	}
	
	///////////////LIBRARY DEFINITION///////////////////////////
	var library_import = 'from Blocky.Scheduler import *\n';

	if (typeof Blockly.Python.definitions_['import_section'] === 'undefined')
		{
			Blockly.Python.definitions_['import_section'] = "";
		}
	if (Blockly.Python.definitions_['import_section'].includes(library_import) == false )
	{
		Blockly.Python.definitions_['import_section'] += library_import
	}
	
	var code = "" ;
	code += "AddAlarm(time = '"+text_time+"',date = '"+dropdown_date+"',action=ALARM_"+text_time+dropdown_name+"_"+dropdown_date + ")\n";
	Blockly.Python.definitions_['event_section'] += code ;
	return "";
	};

// Block for calling a timer , PERIODIC or ONE_SHOT
Blockly.Python['blocky_routine_mode'] = function(block) {
	var text_time = block.getFieldValue('TIME').replace(":","h");
	var dropdown_name = block.getFieldValue('AMPM');
	var dropdown_date = block.getFieldValue('DATE').replace("/","_");
	dropdown_date = dropdown_date.replace("/","_");
	var statements_name = Blockly.Python.statementToCode(block, 'NAME');
	// TODO: Assemble Python into code variable.
	/////////////// FUNCTION DEFINITION ///////////////////////
	var function_name = 'def ALARM_'+text_time+dropdown_name+"_"+dropdown_date+"():\n";
	var definition_import = function_name ;
	if (statements_name) {
		definition_import+=statements_name;
	}
	else{
		definition_import += '\tpass\n';
	}
	
	if (Blockly.Python.definitions_['function_section'].includes(function_name) == false )
	{
		Blockly.Python.definitions_['function_section'] += definition_import
	}
	
	///////////////LIBRARY DEFINITION///////////////////////////
	var library_import = 'from Blocky.Scheduler import *\n';

	if (typeof Blockly.Python.definitions_['import_section'] === 'undefined')
		{
			Blockly.Python.definitions_['import_section'] = "";
		}
	if (Blockly.Python.definitions_['import_section'].includes(library_import) == false )
	{
		Blockly.Python.definitions_['import_section'] += library_import
	}
	
	var code = "" ;
	code += "AddAlarm(time = '"+text_time+"',date = '"+dropdown_date+"',action=ALARM_"+text_time+dropdown_name+"_"+dropdown_date + ")\n";
	Blockly.Python.definitions_['event_section'] += code ;
	return "";
	};