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
var user_devices = [] ; 
var user_current_device  ; 


function blynk_list_devices(){
	var list = [[ "APP" , "APP"] ]
	for (var x = 0 ; x < user_devices.length ; x ++)
	{
		//if (user_devices[x].name == user_current_device.name) continue ; 
		list.push ( [user_devices[x].name , user_devices[x].token] ) ; 
	}
	return list ; 
}


Blockly.Blocks['blynk_event_vr'] = {
  init: function() {
	var GeneratedList = [];
	for (var i = 0 ; i < 21 ; i ++){GeneratedList.push(["V"+String(i) , String(i)]);}
    this.appendDummyInput("MAIN")
        .appendField("when receive data from")
		
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
  var device = block.getFieldValue('DEVICE');
  var code = Blockly.Python.statementToCode(block, 'CODE');
  // TODO: Assemble Python into code variable.
  if (code.length){

  
  // function code 
  var function_name = 'blynk_' + channel ;
 
  
  //AddToSection('once' ,"blynk.listen(channel=" + topic + ",function=" + function_name + ')\n' );
  //AddToSection('function' , async_cancellable+'async def '+function_name +"(topic,message):\n" + code );
	AddToSection('function',async_cancellable + 'async def '+ function_name + "():\n"+GlobalVariable+Blockly.Python.INDENT + "message = core.blynk.message\n" + code);
	AddToSection('event',"core.blynk.add_virtual_pin(pin=" + String(channel) + ",write=" + function_name + ")\n" );
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
		.appendField("to")
		.appendField(new Blockly.FieldDropdown(blynk_list_devices()) , "DEVICE")
		;
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
  var device = this.getFieldValue('DEVICE');
  var data = Blockly.Python.valueToCode(block, 'DATA', Blockly.Python.ORDER_NONE);
  if (!data.length)data = 'None' ;
  // TODO: Assemble Python into code variable.
  
  
  var code = "await core.blynk.virtual_write(" ;
  
  if (device != "APP") code += "device='" + device + "'," ;
  
  code += "pin=" + String(topic) + ",val=" + String(data) + ")\n";
  return code;
};



Blockly.Blocks['blynk_log'] = {
  init: function() {
	var GeneratedList = [];
	for (var i = 0 ; i < 20 ; i ++){GeneratedList.push(["V"+String(i) , String(i)]);}
	this.appendValueInput("DATA")
        .appendField("log")
		;
	this.appendDummyInput('NAME');

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlynkColor);
	this.setTooltip("");
	this.setHelpUrl("");
  }
};
Blockly.Python['blynk_log'] = function(block) {
  var data = Blockly.Python.valueToCode(block, 'DATA', Blockly.Python.ORDER_NONE);
  if (!data.length)data = 'None' ;
  // TODO: Assemble Python into code variable.
  
  
  var code = "await core.blynk.log(" +  String(data) + ")\n";
  return code;
};
Blockly.Blocks['blynk_notify'] = {
  init: function() {
	this.appendValueInput("DATA")
        .appendField("notify")
		;
	this.appendDummyInput('NAME');

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlynkColor);
	this.setTooltip("");
	this.setHelpUrl("");
	
  }
};
Blockly.Python['blynk_notify'] = function(block) {
  var data = Blockly.Python.valueToCode(block, 'DATA', Blockly.Python.ORDER_NONE);
  if (!data.length)data = 'None' ;
  // TODO: Assemble Python into code variable.
  
  
  var code = "await core.blynk.notify(" +  String(data) + ")\n";
  return code;
};
Blockly.Blocks['blynk_email'] = {
  init: function() {
	this.appendValueInput("MAIL")
        .appendField("email to")
		;
	this.appendValueInput("SUBJECT")
        .appendField("subject")
		;
	this.appendValueInput("CONTENT")
        .appendField("content")
		;
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlynkColor);
	this.setTooltip("");
	this.setHelpUrl("");
	this.inputsInline = false ;
  }
};
Blockly.Python['blynk_email'] = function(block) {
  var content = Blockly.Python.valueToCode(block, 'CONTENT', Blockly.Python.ORDER_NONE);
  var subject = Blockly.Python.valueToCode(block, 'SUBJECT', Blockly.Python.ORDER_NONE);
  var mail = Blockly.Python.valueToCode(block, 'MAIL', Blockly.Python.ORDER_NONE);
  if (!content.length) return '' ;
  // TODO: Assemble Python into code variable.
  
  
  var code = "await core.blynk.email(email=" +  String(mail) +',subject='+String(subject)+',content=' +String(content) +")\n";
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
		this.setOnChange(
			function (event)
			{
				if (this.isInFlyout||!this.getRootBlock()) return ;
				if (event.type=='create'||event.type=='change'||event.type=='move')
				{
					if (this.getRootBlock().type.indexOf('blynk_event')==-1)
					{
						this.setDisabled(true);
						this.setWarningText('This block should be inside a blynk event block')
					}
					else 
					{
						this.setDisabled(false);
						this.setWarningText();
					}
				}
				
			}
		);
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
	var code = "message[" + String(parseInt(block.getFieldValue('ITER'))-1) + ']'; // 1 based
	return [code, Blockly.Python.ORDER_ATOMIC ];
};

Blockly.Blocks['network_text']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
			.appendField('"')
			.appendField(new Blockly.FieldTextInput(""), 'TEXT')
			.appendField('"')
			;
		
		this.category  = 'Network' ;
		this.setColour(Colour[this.category]);
		this.setOutput(true , null);
	}
} ;

Blockly.Python['network_text'] = function(block) {
	var text = block.getFieldValue('TEXT');
	var code = '"' + text + '"';
	return [code, Blockly.Python.ORDER_ATOMIC ];
};