goog.require('Blockly.Blocks');
goog.require('Blockly.constants');
goog.require('Blockly.Python');
goog.require('Blockly.Variables');
goog.require('Blockly.Workspace');
goog.require('Blockly.Generator');
goog.require('Blockly.BlockSvg');

var PortList = ['PORT1', 'PORT2', 'PORT3', 'PORT4', 'PORT5', 'PORT6', 'PORT7', 'PORT8'];
var PORT_ASSIGN = [];
var previous_change = null;
var GlobalVariable = '';
/*
	Add some lazy function :))
*/
Array.prototype.clone = function () {
	return this.slice(0);
}
Array.prototype.contains = function (obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}
var isEqual = function (value, other) {

	// Get the value type
	var type = Object.prototype.toString.call(value);

	// If the two objects are not the same type, return false
	if (type !== Object.prototype.toString.call(other)) return false;

	// If items are not an object or array, return false
	if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

	// Compare the length of the length of the two items
	var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
	var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
	if (valueLen !== otherLen) return false;

	// Compare two items
	var compare = function (item1, item2) {

		// Get the object type
		var itemType = Object.prototype.toString.call(item1);

		// If an object or array, compare recursively
		if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
			if (!isEqual(item1, item2)) return false;
		}

		// Otherwise, do a simple comparison
		else {

			// If the two items are not the same type, return false
			if (itemType !== Object.prototype.toString.call(item2)) return false;

			// Else if it's a function, convert to a string and compare
			// Otherwise, just compare
			if (itemType === '[object Function]') {
				if (item1.toString() !== item2.toString()) return false;
			} else {
				if (item1 !== item2) return false;
			}

		}
	};

	// Compare properties
	if (type === '[object Array]') {
		for (var i = 0; i < valueLen; i++) {
			if (compare(value[i], other[i]) === false) return false;
		}
	} else {
		for (var key in value) {
			if (value.hasOwnProperty(key)) {
				if (compare(value[key], other[key]) === false) return false;
			}
		}
	}
	// If nothing failed, return true
	return true;

};


/*
	Interfere the way we generate code
	1 :: Code is divided into section at birth
	2 :: Code maintain its part orderly
*/


function AddToSection(section, code) {
	if (Blockly.Python.definitions_[section].indexOf(code) == -1) {
		Blockly.Python.definitions_[section] += code;
	}

}

Blockly.Generator.prototype.workspaceToCode = function (workspace) {
	if (!workspace) {
		// Backwards compatibility from before there could be multiple workspaces.
		console.warn('No workspace specified in workspaceToCode call.  Guessing.');
		workspace = Blockly.getMainWorkspace(); // Blockly.getMainWorkspace();
	}
	var code = [];

	this.init(workspace);
	var blocks = workspace.getTopBlocks(true);
	//:: Swap the top block , the top block must always be the MainRunOnce
	if (!blocks.length) return;
	if (blocks[0].type != 'MainRunOnce') {

		var temp = null;
		for (var i = 0; i < blocks.length; i++) {
			if (blocks[i].type == 'MainRunOnce') {
				temp = blocks[i];
				blocks.splice(i, 1);
				blocks.unshift(temp);
				break;
			}
		}
	}
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;;
	for (var x = 0, block; block = blocks[x]; x++) {
		var line = this.blockToCode(block);
		if (goog.isArray(line)) {
			// Value blocks return tuples of code and operator order.
			// Top-level blocks don't care about operator order.
			line = line[0];
		}
		if (line) {
			if (block.outputConnection) {
				// This block is a naked value.  Ask the language's code generator if
				// it wants to append a semicolon, or something.
				line = this.scrubNakedValue(line);
			}
			code.push(line);
		}
	}
	code = code.join('\n'); // Blank line between each section.
	code = this.finish(code);
	// Final scrubbing of whitespace.
	// Remember that uPython only play with /n
	code = code.replace(/^\s+\n/, '');
	code = code.replace(/\n\s+$/, '\n');
	code = code.replace(/[ \t]+\n/g, '\n');
	return code;
};
/*
	Scan through all block and return a list of
	not used port + port that is own by that module type
*/
function PORT(module, condition = null) {
	var port = PortList.clone();
	var blocks = GlobalWorkspace.getAllBlocks();
	var list = [];

	for (var i = 0; i < PortList.length; i++) {
		if (PORT_ASSIGN[PortList[i]] == module) {
			list.push([port[i], port[i]]);
		}
	}
	for (var i = 0; i < PortList.length; i++) {
		if (PORT_ASSIGN[PortList[i]] == null) {
			list.push([port[i], port[i]]);
		}
	}

	if (list.length)
		return list;
	else
		return ['None', 'None'];
}


/*
	Need a better name for this shit .
	This function will :
		1 :: Update Port List of all blocks
		2 :: When newly created block , it port value reference
			Create a referecnce for PORT() , that's all
		3 :: Highlight block that share that port
*/

function updatePort() {
	var list = {};
	for (var i = 0; i < PortList.length; i++) {
		list[PortList[i]] = null;
	}
	var blocks = GlobalWorkspace.getAllBlocks();
	for (var i = 0; i < blocks.length; i++) {
		var block = blocks[i];
		if (!block.isInFlyout && !block.disabled && block.module != null) {
			var port = block.getFieldValue('PORT');
			if (port == null) continue;
			if (list[port] == null || list[port] == block.module) {
				list[port] = block.module;
			} else {
				block.setDisabled(true);
			}
		}
	}
	PORT_ASSIGN = list;
}
var prev_change = null;

function HandlerGlobal(change) {
	/*
		Loop Trap :

	*/
	if (isEqual(change, prev_change)) return
	prev_change = change;

	Blockly.Events.disable();

	updatePort();
	list = PORT_ASSIGN;
	// Now we get a list of which module use which block
	var blocks = GlobalWorkspace.getAllBlocks();
	/*
		Section 1 : update port list
	*/
	for (var i = 0; i < blocks.length; i++) {
		var block = blocks[i];
		if (block.module == null) continue;
		var dropdown = [];
		for (var t = 0; t < PortList.length; t++) {
			if (list[PortList[t]] == block.module) {
				dropdown.push([PortList[t], PortList[t]]);
			}
		}
		for (var t = 0; t < PortList.length; t++) {
			if (list[PortList[t]] == null) {
				dropdown.push([PortList[t], PortList[t]]);
			}
		}
		//Blockly.Events.disable() ;
		var cur = block.getFieldValue('PORT');
		var pos = block.getInput('MAIN').fieldRow.indexOf(block.getField('PORT'));
		if (pos > 0) {
			block.getInput('MAIN').removeField('PORT');
			block.getInput('MAIN').insertFieldAt(pos, new Blockly.FieldDropdown(dropdown), 'PORT');

			Blockly.Events.disable();
			if (true) {
				block.getField('PORT').setValue(cur);

			}
			Blockly.Events.enable();
		}
		//Blockly.Events.enable() ;
	}

	/*
		Section 3 : Hightlight relevant block
		Disabled due to laggy performances
	*/
	/*
	if (change != previous_change)
	{
		previous_change = change ;
		// Somehow , there are duplocation call ! Damn it
		if (change.type == 'ui' && change.element == 'click')
		{
			// unselect all block
			for (var i = 0 ; i < blocks.length ; i++) blocks[i].removeSelect() ;
			var block = GlobalWorkspace.getBlockById(change.blockId) ;
			if (block!=null&&block.module)
			{
				var port = block.getFieldValue('PORT') ;
				for (var u = 0 ; u < blocks.length ; u++)
				{
					var temp = blocks[u] ;
					if (temp==block||!temp.module) continue ;
					if (temp.getFieldValue('PORT') == port )
					{
						temp.addSelect() ;
					}
				}
			}
			block.addSelect() ; // select what user have select !
		}
	}
	*/

	/*
		Section 4 :
		No event block has the same property , because event function only allow 1 function to pass through
		For example , 2 'button_when_pres_1_time' block , only one will be consider .
		We dont want this , block that duplicate will be disabled
	*/
	for (var i = 0; i < blocks.length; i++) {
		var block = blocks[i];
		if (block.role != 'Event') continue;
		var fieldRow = block.getInput('MAIN').fieldRow;
		var list_input = [];
		for (var u = 0; u < fieldRow.length; u++) {
			list_input.push(fieldRow[u].text_);
		}
		if (block.role == 'Event') {
			if (!block.disabled) {

				for (var u = 0; u < blocks.length; u++) {
					var temp = blocks[u];
					if (temp == block || temp.module != block.module || temp.role != 'Event' || temp.disabled) continue;
					var temp_fieldRow = temp.getInput('MAIN').fieldRow;
					var temp_list_input = [];
					for (var x = 0; x < temp_fieldRow.length; x++) {
						temp_list_input.push(temp_fieldRow[x].text_);
					}
					Blockly.Events.disable();
					if (isEqual(temp_list_input, list_input)) {
						temp.setDisabled(true);
					} else {
						temp.setDisabled(false);
					}
					Blockly.Events.enable();
				}
			}
			if (block.disabled) {
				var enable = true;
				for (var u = 0; u < blocks.length; u++) {
					var temp = blocks[u];
					if (temp == block || temp.module != block.module || temp.role != 'Event' || temp.disabled) continue;
					var temp_fieldRow = temp.getInput('MAIN').fieldRow;
					var temp_list_input = [];
					for (var x = 0; x < temp_fieldRow.length; x++) {
						temp_list_input.push(temp_fieldRow[x].text_);
					}
					if (isEqual(temp_list_input, list_input)) {
						enable = false;
						break;
					}
				}
				Blockly.Events.disable();
				if (enable) block.setDisabled(false);
				Blockly.Events.enable();
			}
		}
	}

	Blockly.Events.enable();

}














/*
	Get the current version of all the module's library.
	Currently this is pulling from github , this is bad , but good for lazy people.
*/
var supported_module = ['RadioReceiver', 'InfraredRemote', 'Servo', 'Core', 'Button', 'Buzzer', 'Digits', 'LCD', 'LED', 'Light', 'Moisture', 'Motion', 'Motor', 'Music', 'Potentiometer', 'Relay', 'RGB', 'Smoke', 'Sound', 'Stepper', 'Weather', 'MPR121'];
var module_version = {};
for (var i = 0; i < supported_module.length; i++) {
	update_module_version(supported_module[i]);
}

function update_module_version(module) {
	const Http = new XMLHttpRequest();
	const url = 'https://raw.githubusercontent.com/getblocky/dot_firmware/master/src/' + module + '.py';
	module_version[module] = '';
	Http.open("GET", url);
	Http.send();
	Http.onreadystatechange = (e) => {
		var version = Http.responseText.split('\n')[0];
		if (version.startsWith('#version')) {
			module_version[module] = version;
			console.log(module, version);
		} else {
			module_version[module] = '';
		}
	}
}

function getLibraryVersion(module) {
	if (module_version[module] != undefined)
		return module_version[module];
	return '';
}

if (typeof (String.prototype.trim) === "undefined") {
	String.prototype.trim = function () {
		return String(this).replace(/^\s+|\s+$/g, '');
	};
}


function sendCommand(string) {
	if (command.currentDevice == null) {
		console.log("User has'nt logged in yet");
		return;
	}
	if (command.currentDevice.id == null) {
		console.warn("User hasn't logged in");
		return;
	}
	command.initBlynk(command.currentDevice.id, command.currentDevice.token);
	var message = [];
	message[0] = string;
	command.scriptService.sendCommand(command.currentDevice.token, message);
	command.echoDeviceLog.push(message);
}