'use strict';

goog.provide('Blockly.Blocks.colour');
goog.require('Blockly.Blocks');
goog.require('Blockly.constants');
goog.require('Blockly.Python');
goog.require('Blockly.Variables');
goog.require('Blockly.Workspace');
goog.require('Blockly.Input');

Blockly.Python.addReservedWords('machine');
Blockly.Python.addReservedWords('blocky');

//var BlynkColor = '#23c890';
var BlynkColor = Colour.Network;


Blockly.Blocks['blynk_event_vr'] = {
  init: function() {
	var GeneratedList = [];
	for (var i = 0 ; i < 21 ; i ++){GeneratedList.push(["V"+String(i) , String(i)]);}
    this.appendDummyInput("MAIN")
        .appendField("when receive data from channel \n")
		.appendField(new Blockly.FieldDropdown(GeneratedList) , "CHANNEL")
		;
    this.appendStatementInput("CODE")
        .setCheck(null)
		;
    this.appendDummyInput();
    this.setColour(BlynkColor);
	this.setTooltip("");
	this.setHelpUrl("");
	this.role = 'Event';
	this.module = 'network';

  }
};

Blockly.Python['blynk_event_vr'] = function(block) {
  var channel = block.getFieldValue('CHANNEL');
  var code = Blockly.Python.statementToCode(block, 'CODE');
  // TODO: Assemble Python into code variable.
  if (code.length){

  
  // function code 
  var function_name = 'blynk_' + channel ;
 
  
  //AddToSection('once' ,"blynk.listen(channel=" + topic + ",function=" + function_name + ')\n' );
  //AddToSection('function' , async_cancellable+'async def '+function_name +"(topic,message):\n" + code );
	AddToSection('function',async_cancellable + 'async def '+ function_name + "(message):\n" + code);
	AddToSection('once',"core.blynk.add_virtual_pin(pin=" + String(channel) + ",write=" + function_name + ")\n" );
  }
  return '';
};




Blockly.Blocks['blynk_write_vw'] = {
  init: function() {
	var GeneratedList = [];
	for (var i = 0 ; i < 20 ; i ++){GeneratedList.push(["V"+String(i) , String(i)]);}
	this.appendValueInput("DATA")
        .appendField("write to channel")
        .appendField(new Blockly.FieldDropdown(GeneratedList), "VP")
		.appendField("=");
	this.appendDummyInput('NAME');

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlynkColor);
	this.setTooltip("");
	this.setHelpUrl("");
	
  }
};
Blockly.Python['blynk_write_vw'] = function(block) {
  var topic = this.getFieldValue('VP');
  var data = Blockly.Python.valueToCode(block, 'DATA', Blockly.Python.ORDER_NONE);
  if (!data.length)data = 'None' ;
  // TODO: Assemble Python into code variable.
  
  
  var code = "core.blynk.virtual_write(pin=" + String(topic) + ",val=" + String(data) + ")\n";
  return code;
};





/*
	Blynk Bridge Support 
	To use Blynk , you must create a target token .
	Since Blynk will be intergrated , no tokenn is needed , instead use controller name as dropdown
*/

var LIST_DEVICE = []; 

Blockly.Blocks['blynk_event_bridge'] = {
  init: function() {
	var GeneratedList = [];
	for (var i = 1 ; i < 21 ; i ++){GeneratedList.push(["V"+String(i) , String(i)]);}
    this.appendDummyInput("MAIN")
		.appendField(new Blockly.FieldImage("https://avatars1.githubusercontent.com/u/11541426?s=400&v=4", 20, 20, "*"))
        .appendField("when receive data from channel ")
		.appendField(new Blockly.FieldDropdown(GeneratedList) , "CHANNEL")
		.appendField("of")
		.appendField(new Blockly.FieldDropdown(LIST_DEVICE) , "BRIDGE")
		;
    this.appendStatementInput("CODE")
        .setCheck(null)
		;
    this.appendDummyInput();
    this.setColour(BlynkColor);
	this.setTooltip("");
	this.setHelpUrl("");
	this.role = 'Event';
	this.module = 'network';

  }
};

Blockly.Python['blynk_event_bridge'] = function(block) {
  var topic = block.getFieldValue('CHANNEL');
  var code = Blockly.Python.statementToCode(block, 'CODE');
  // TODO: Assemble Python into code variable.
  if (code.length){

  
  // function code 
  var function_name = 'blynk_' + topic ;
 
  
  AddToSection('once' ,"blynk.listen(channel=" + topic + ",function=" + function_name + ')\n' );
  AddToSection('function' , async_cancellable+'async def '+function_name +"(topic,message):\n" + code );
  }
  return '';
};

Blockly.Blocks['blynk_message']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
			.appendField('message')
			;
		
		this.setColour(BlynkColor);
		this.setOutput(true , null);
	}
} ;

Blockly.Python['blynk_message'] = function(block) {
	var code = "message";
	return [code, Blockly.Python.ORDER_ATOMIC ];
};





Blockly.Blocks['blynk_message_iter']=
{
	
	init : function()
	{
		var list = [] ; 
		for (var i = 1 ; i < 6 ; i ++)
		{
			list.push([String(i),String(i)]) ; 
		}
		this.appendDummyInput('MAIN')
			.appendField('item')
			.appendField(new Blockly.FieldDropdown(list) , "ITER")
			.appendField("of")
			.appendField('message')
			;
		
		this.setColour(BlynkColor);
		this.setOutput(true , null);
	}
} ;

Blockly.Python['blynk_message_iter'] = function(block) {
	var code = "message[" + block.getFieldValue("ITER") + "-1]"; // 1 based
	return [code, Blockly.Python.ORDER_ATOMIC ];
};