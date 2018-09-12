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

var BlynkColor = '#23c890';

Blockly.Blocks['blynk_declare_server'] = {
	init : function(){
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldImage("https://avatars1.githubusercontent.com/u/11541426?s=400&v=4", 20, 20, "*"))
			.appendField('Set Blynk server Address')
			.appendField(new Blocky.FieldDropdown([["blynk.getblocky.com","BLOCKY"],["blynk-cloud.com","BLYNK"]]),'SERVER')
			;
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(Colour.Network);
		this.setTooltip("");
		this.setHelpUrl("");
	}
	
	
}


Blockly.Blocks['blynk_event_vr'] = {
  init: function() {
	var GeneratedList = [];
	for (var i = 1 ; i < 21 ; i ++){GeneratedList.push(["V"+String(i) , String(i)]);}
    this.appendDummyInput("MAIN")
		.appendField(new Blockly.FieldImage("https://raw.githubusercontent.com/riftbit/docker-blynk/master/logo.png", 50, 50, "*"))
        .appendField("when receive data from channel \n")
		.appendField(new Blockly.FieldDropdown(GeneratedList) , "CHANNEL")
		;
    this.appendStatementInput("CODE")
        .setCheck(null)
		;
    this.appendDummyInput();
    this.setColour("#000000");
	this.setTooltip("");
	this.setHelpUrl("");
	this.role = 'Event';
	this.module = 'network';

  }
};

Blockly.Python['blynk_event_vr'] = function(block) {
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


Blockly.Blocks['blynk_logo'] = {
	init:function(){
		this.appendValueInput("MAIN").appendField(new Blockly.FieldImage("http://www.free-icons-download.net/images/cloud-logo-icon-22859.png", 50, 50, "*"));
		;
		this.setColour(BlynkColor);
		
		
		
	}
	
}
Blockly.Blocks['blynk_declare_server'] = {
  init: function() {
	var GeneratedList = [];
	for (var i = 0 ; i < 20 ; i ++){GeneratedList.push(["V"+String(i) , String(i)]);}
	var data = this.appendDummyInput("DATA")
		.appendField("                  ")
		.appendField(new Blockly.FieldImage("https://avatars1.githubusercontent.com/u/11541426?s=400&v=4", 50, 50, "*"))
        ;
	data.setAlign (Blockly.Input.ALIGN_CENTRE)
	this.appendDummyInput("TEMP")
		.appendField("SERVER:")
		.appendField(new Blockly.FieldDropdown([["blynk.getblocky.com","BLOCKY"],["blynk-cloud.com" , "BLYNK"]]), "SERVER")
        ;
	this.appendDummyInput("")
		.appendField("TOKEN:")
		.appendField(new Blockly.FieldTextInput("My Token") , "TOKEN")
		;
	
	this.inputsInline = false ;
    this.setColour(BlynkColor);
	this.setTooltip("");
	this.setHelpUrl("");
	
  }
};
Blockly.Python['blynk_declare_server'] = function(block) {
  var topic = this.getFieldValue('TOPIC');
  var data = Blockly.Python.valueToCode(block, 'DATA', Blockly.Python.ORDER_NONE);
  if (!data.length)data = 'None' ;
  // TODO: Assemble Python into code variable.
  
  
  var code = "await network.send(topic='" + topic + "',data=str(" + String(data) + "))\n";
  return code;
};


Blockly.Blocks['blynk_write_vw'] = {
  init: function() {
	var GeneratedList = [];
	for (var i = 0 ; i < 20 ; i ++){GeneratedList.push(["V"+String(i) , String(i)]);}
	this.appendValueInput("DATA")
		.appendField(new Blockly.FieldImage("https://avatars1.githubusercontent.com/u/11541426?s=400&v=4", 20, 20, "*"))
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
  var topic = this.getFieldValue('TOPIC');
  var data = Blockly.Python.valueToCode(block, 'DATA', Blockly.Python.ORDER_NONE);
  if (!data.length)data = 'None' ;
  // TODO: Assemble Python into code variable.
  
  
  var code = "await network.send(topic='" + topic + "',data=str(" + String(data) + "))\n";
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

