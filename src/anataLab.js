goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldString');
goog.require('Blockly');

/*
    Checked block

    colour_picker

*/
// ===========================================================

var Toolbox_Input = '#d65cd6';
var Toolbox_Sensor = "#d65cd6";
var Toolbox_Control = "#f55d3e";
var Toolbox_Output = '#f55d3e';
var Toolbox_Display = '#4c97ff';
var Toolbox_Network = '#e3008c';
var Toolbox_Timer = '#107c10';
var Toolbox_Loops = '#40bf4a';
var Toolbox_Logic = '#4cbfe6';
var Toolbox_Variables = '#ff6680';
var Toolbox_Math = '#9966ff';
var Toolbox_Text = '#ffab19';
var Toolbox_List = '#8a1c7c';
var Toolbox_Function = '#005a9e';
var Toolbox_Blynk = '#22bd89';
var Toolbox_Advanced = '#00272b';
var Toolbox_Warning = '#000000';

var supported_modules = ['BUTTON', 'CLAP', 'POTENTIOMETER', 'WEATHER',
    'LIGHT', 'MOTION', 'DISTANCE', 'MOISTURE', 'REMOTE', 'INFRARED'
];
var SUPPORTED_MODULES = [];
for (var i = 0; i < supported_modules.length; i++) {
    SUPPORTED_MODULES.push([supported_modules[i], supported_modules[i]]);
}
var supported_widgets = ['BUTTON', 'GAUGE', 'SLIDER', 'LED'];
var SUPPORTED_WIDGETS = [];
for (var i = 0; i < supported_widgets.length; i++) {
    SUPPORTED_WIDGETS.push([supported_widgets[i], supported_widgets[i]]);
}
//TAG=PORTSERVICE console.log('Supported modules', SUPPORTED_MODULES);

var available_ports = ['PORT1', 'PORT2', 'PORT3', 'PORT4'];
var AVAILABLE_PORTS = [];
for (var i = 0; i < available_ports.length; i++) {
    AVAILABLE_PORTS.push([available_ports[i], available_ports[i]]);
}
//TAG=PORTSERVICE console.log('Available port', AVAILABLE_PORTS);

// =   =   =   ==      =   =   =   =   =   =   =   =   =   =   


var port = {};
var workspace = null;
for (var i = 0; i < available_ports.length; i++) {
    port[available_ports[i]] = null;
}

variable = [];

builtin = {
    "BUTTON": ["A", "B", "C"],
    "AUDIO": ["BUILTIN"]
}


var portAssign = {};

// every time a declare block is modified, 
//all related block will change its "PORT" list or be disable
function portService() {
    //TAG=PORTSERVICE console.info('__port_serive__');
    var listBlock = workspace.getAllBlocks();

    portAssign = {}
    for (var i = 0; i < SUPPORTED_MODULES.length; i++) {
        portAssign[SUPPORTED_MODULES[i][0]] = [];
        if (SUPPORTED_MODULES[i][0] in builtin) {
            // portAssign[SUPPORTED_MODULES[i]].push(...builtin[SUPPORTED_MODULES[i]])
            for (var u = 0; u < builtin[SUPPORTED_MODULES[i][0]].length; u++) {
                portAssign[SUPPORTED_MODULES[i][0]].push(builtin[SUPPORTED_MODULES[i][0]][u])
            }
        }

        for (let [key, value] of Object.entries(port)) {
            if (value == SUPPORTED_MODULES[i][0]) {
                portAssign[SUPPORTED_MODULES[i][0]].push(key)
            }
        }
        portAssign[SUPPORTED_MODULES[i][0]] = portAssign[SUPPORTED_MODULES[i][0]] || [];


    }

    //TAG=PORTSERVICE console.info('portAssign', portAssign, port);

    for (var index = 0; index < listBlock.length; index++) {
        var block = listBlock[index];
        if (block.blockClass == null) continue; // this is not related block

        // build the dropdown
        var dropdown = [];
        for (var t = 0; t < portAssign[block.blockClass].length; t++) {
            var __port__ = portAssign[block.blockClass][t]
                //TAG=PORTSERVICE console.log(__port__);
            dropdown.push([__port__, __port__])
        }
        //TAG=PORTSERVICE console.info("dropdown", dropdown);
        var currentPort = block.getFieldValue('PORT');

        // case : if the current port is no longer belonged
        if (portAssign[block.blockClass].indexOf(currentPort) == -1) {

            block.setDisabled(true);
            block.getField('PORT').setValue("NO PORT");


        } else {
            block.setDisabled(false);
        }

        // else    
        Blockly.Events.disable();
        var pos = block.getInput("MAIN").fieldRow.indexOf(block.getField('PORT'));
        if (pos > 0) {

            block.getInput("MAIN").removeField('PORT');
            block.getInput("MAIN").insertFieldAt(pos, new Blockly.FieldDropdown(dropdown), 'PORT');


            block.getField('PORT').setValue(currentPort);
            Blockly.Events.enable();

        }
    }


}

function checkForRootBlock(block, change) {
    if (change.type == 'ui') return;
    var root = block.getRootBlock();
    if (block.rootBlock.indexOf(root.type) && root != block) {
        Blockly.Events.disable();
        block.setDisabled(true);
        block.setWarningText("This block must be placed inside ON START block");
        Blockly.Events.enable();
    } else {
        Blockly.Events.disable();
        if (root != block) { block.setDisabled(false); }

        block.setWarningText();
        Blockly.Events.enable();
    }
}


// ===  =   =   =   =   =       =   =   ==  =       ====    =   =   =   =       

Blockly.Blocks['pxt_test'] = {
    init: function() {
        this.setColour('#112233', '#223344', '#000000');
        this.appendValueInput('DUMMY')
            .appendField(new Blockly.FieldTextInput('My Strinc'), 'STR')
            .appendField(new Blockly.FieldString('My Strinasdac'), 'TR')
            .appendField(new Blockly.FieldNumberDropdown(1000, [
                ['100ms', 1000],
                ['200ms', 10]
            ]), 'NUM')
            .appendField(new Blockly.FieldTextDropdown('1000', [
                ['100ms', '1000'],
                ['200ms', '10']
            ]), 'NUMe');
        this.setOutput(false);
    },
    mutationToDom: function() {

    },
    domToMutation: function() {

    },
    storeCostoreConnections_: function() {

    },
    restoreConnections_: function() {},
    addItem_: function() {}


}

Blockly.Blocks['pxt-onStart'] = {
    init: function() {


        this.setColour(Toolbox_Loops);
        //this.setOutput(true,'Number')
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);

        this.appendDummyInput('MAIN')
            .appendField('on start')

        ;
        this.appendStatementInput('CODE');

        // set the global workspace , because this block always exist :))
        workspace = this.workspace;

        //patch , to push builtin into portAssign;
        this.setOnChange(
            function(change) {
                // port service relevant event
                // capture when the block is decalre block or the field of change is block
                // three case
                // 
                if (change.type == "ui") return;
                if ((change.type == "change" && change.element == "field" && (change.name == "MODULE" || change.name == "PORT")) || change.type == "move" || change.type == "create" || change.type == "delete") {
                    var block = workspace.getBlockById(change.blockId);
                    if (block == null) return;
                    if (block.type == 'pxt-declarePort') {
                        portService();
                    } else {
                        if (block.blockClass) {
                            if (change.name == "PORT") {
                                Blockly.Events.disable();
                                portService();
                                Blockly.Events.enable();
                            }
                        }
                    }
                    Blockly.Events.disableOrphans(change);
                }

                updateListWidget();
            }
        );
        portService();
        updateListWidget();


    }
};



Blockly.Python['pxt-onStart'] = function(block) {

    var branch = Blockly.Python.statementToCode(block, 'CODE');
    branch = Blockly.Python.addLoopTrap(branch, block.id) || Blockly.Python.PASS;

    // Note : the following code will be tricky
    // To quickly partitioning code into part , we need to declare partition first
    Blockly.Python.definitions_['import'] = "";
    Blockly.Python.definitions_['variable'] = "";
    Blockly.Python.definitions_['declare'] = '';
    Blockly.Python.definitions_['function'] = "";
    Blockly.Python.definitions_['event'] = "";
    Blockly.Python.definitions_['once'] = branch;
    Blockly.Python.definitions_['async'] = '';

    variable = ''; // __helper__
    allVariables = block.workspace.getAllVariables();
    if (allVariables.length) {
        variable = 'global ';
        for (var i = 0; i < allVariables.length; i++) {
            variable += allVariables[i].name;
            variable += ','
                // Blockly.Python.definitions_['variable'] += allVariables[i].name  + " = None\n";
        }
        // variable = variable.slice(0,-1);
        variable = Blockly.Python.INDENT + variable + '\n';
    }

    //TAG=PORTSERVICE console.info('[VARIABLE]', variable);




    return '';

}


Blockly.Blocks['pxt-portDeclare'] = {
    init: function() {

        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.appendDummyInput('MAIN')
            .appendField('connect')
            .appendField(new Blockly.FieldDropdown(SUPPORTED_MODULES), 'MODULE')
            .appendField('to port')
            .appendField(new Blockly.FieldDropdown(AVAILABLE_PORTS), 'PORT');

        this.setColour('#111111');
        this.setOnChange(
            function(change) {
                if (change.blockId != this.id || this.isInFlyout) return;


                // //TAG=PORTSERVICE console.warn(change);
                portService(); // __helper__
                // set the warning text and disable block when not in the right position
                if (change.type == 'move') {
                    if (this.getRootBlock().type == 'pxt-onStart') {
                        // block enabled but the port is taken
                        if (port[this.getFieldValue('PORT')] != null) {
                            this.setDisabled(true);
                            this.setWarningText(this.getFieldValue('PORT'), 'is used by module', port[this.getFieldValue('PORT')])
                            console.info(this.getFieldValue('PORT'), 'is used by', port[this.getFieldValue('PORT')]);
                        } else {
                            this.setDisabled(false);
                            this.setWarningText();
                            //TAG=PORTSERVICE console.info(this.getFieldValue('PORT'), 'is assigned to ', this.getFieldValue('MODULE'));

                            port[this.getFieldValue('PORT')] = this.getFieldValue('MODULE');

                        }


                    }
                    // block is not inside another root , which mean it is the root
                    else if (this.getRootBlock() == this) {
                        this.setWarningText();

                        port[this.getFieldValue('PORT')] = null;
                        //TAG=PORTSERVICE console.info(this.getFieldValue('MODULE'), 'is no longer used port', this.getFieldValue('PORT'));
                    } else if (this.getRootBlock() != this) {
                        this.setDisabled(true);
                        this.setWarningText('This block should be inside "on start" block!');

                        port[this.getFieldValue('PORT')] = null;
                        //TAG=PORTSERVICE console.info(this.getFieldValue('MODULE'), 'is no longer used port', this.getFieldValue('PORT'));
                    }
                }

                if (change.type == 'change' && change.element == 'field' && (!this.disabled)) {
                    if (change.name == "PORT") {
                        port[change.oldValue] = null;
                        port[change.newValue] = this.getFieldValue('MODULE')
                    }
                    if (change.name == "MODULE") {
                        port[this.getFieldValue('PORT')] = change.newValue;
                    }

                }
                // update the register
                portService();


            }
        );

    }
};

Blockly.Python['pxt-portDeclare'] = function(block) {
    var port = block.getFieldValue('PORT');
    var module = block.getFieldValue('MODULE');

    var code = module + ' = ' + module[0] + module.slice(1).toLowerCase();
    AddToSection('declare', code);
    //TAG=PORTSERVICE console.info('[DECLARE]', code);
};

function getListPort(obj) {
    var listPort = portAssign[obj.blockClass] || [];

    var dropdown = [];
    for (var i = 0; i < listPort.length; i++) {
        dropdown.push([listPort[i], listPort[i]])
    }
    if (dropdown.length == 0) {
        dropdown = [
            ["NO PORT", "NO PORT"]
        ];


    }
    //TAG=PORTSERVICE console.log('ths' , dropdown);
    return dropdown;
}




Blockly.Blocks['pxt-coroutine-scheduler'] = {
    init: function() {

        this.setColour(Toolbox_Timer);
        //this.setOutput(true,'Number')
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);

        this.appendDummyInput('MAIN')
            .appendField('every')
            .appendField(new Blockly.FieldNumberDropdown(1000, [
                ['200 ms', '200'],
                ['500 ms', '500'],
                ['1 second', '1000'],
                ['5 seconds', '5000'],
                ['1 minutes', '60000']
            ]), 'TIME')
            .appendField('ms');
        this.appendStatementInput('CODE');


    }
};

Blockly.Python['pxt-coroutine-scheduler'] = function(block) {


}

Blockly.Blocks['pxt-coroutine-numberdropdown'] = {
    init: function() {
        this.setOutput(true, "Number");
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setColour('#ffffff');
        this.appendDummyInput('MAIN')
            .appendField(new Blockly.FieldNumberDropdown(1000, [
                ['200 ms', '200'],
                ['500 ms', '500'],
                ['1 second', '1000'],
                ['5 seconds', '5000'],
                ['1 minutes', '60000']
            ]), 'TIME');
    }
};

Blockly.Blocks['pxt-coroutine-wait'] = {
    init: function() {
        this.setColour(Toolbox_Timer);
        //this.setOutput(true,'Number')
        // this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('TIME')
            .setCheck('Number')

        .appendField('wait');
        this.appendDummyInput('TEMP').appendField('ms');

        // this.appendStatementInput('CODE');

    }
};

Blockly.Python['pxt-coroutine-wait'] = function(block) {

}

Blockly.Blocks['pxt-blynk-setProjectColour'] = {
    init: function() {
        this.blockType = 'event'; // patch , workaround , no duplicate block
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(Toolbox_Blynk);
        this.appendDummyInput('MAIN')
            .appendField('set project colour');
        this.appendValueInput('COLOUR'); // disable editing this field
        // .appendField(new Blockly.FieldColour(Toolbox_Blynk), 'color');
        this.setOnChange(
            function(change) {

                // do not change the value input
                // workaround, field inside statement block are buggy.

                // Reference : block that only live in "on start" and can't replace shadow block
                if (true) {
                    if (change.type == Blockly.Events.EndBlockDrag) return;
                    if (change.type == 'ui' || change.type == 'create' || change.type == 'delete') return;
                    // TODO : better filter here

                    if (this.isInFlyout) return;
                    var rootBlock = this.getRootBlock();
                    if (rootBlock == this) return;
                    var shouldBeDisabled = false;
                    var warningText = null;
                    if (this.getInput('COLOUR').connection.targetConnection.sourceBlock_.type != 'colour_picker') {
                        shouldBeDisabled = true;
                        warningText = "Please don't replace the colour picker";
                    }

                    if (rootBlock.type != 'pxt-onStart') {
                        shouldBeDisabled = true;
                        warningText = "This block must be inside ON START block";
                    }

                    Blockly.Events.disable();
                    this.setDisabled(shouldBeDisabled);
                    this.setWarningText(warningText);
                    Blockly.Events.enable();
                }


            }
        );

    }
};
Blockly.Python['pxt-blynk-setProjectColour'] = function(block) {

};

function getAllWidgetName(source) {
    var takenName = [];
    for (let [key, value] of Object.entries(widgetDictionary)) {
        console.warn(key, value);
        if (key == source.getFieldValue('WIDGET')) {
            continue;
        }
        if (value != ['NOT CREATED']) {
            takenName.push(...value);
        }
    }

    return takenName;

}
Blockly.Blocks['pxt-blynk-widgetDeclare'] = {
    init: function() {
        this.setColour(Toolbox_Blynk);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.rootBlock = ['pxt-onStart'];
        this.appendValueInput('NAME')
            .appendField('create a')
            .appendField(new Blockly.FieldDropdown(SUPPORTED_WIDGETS), 'WIDGET')
        this.appendValueInput('WIDGETNAME');

        this.setOnChange(
            function(change) {
                checkForRootBlock(this, change);
                if (this.isInFlyout) return;
                if (change.type == 'create' && change.blockId == this.id) {
                    // console.log('changge', change, this);
                    var child = this.getInput('WIDGETNAME').connection.targetConnection.sourceBlock_;
                    // console.log('target', child);
                    child.setMovable(false);
                    // child.setFieldValue("My New Button", 'TEXT');
                }


                if (getAllWidgetName(this).indexOf(this.getFieldValue('WIDGETNAME'))) {
                    Blockly.Events.disable();
                    this.setDisabled(true);
                    this.setWarningText('Widget name ', this.getFieldValue('WIDGETNAME'), 'is used');
                    Blockly.Events.enable();
                } else {
                    Blockly.Events.disable();
                    this.setDisabled(false);
                    this.setWarningText();
                    Blockly.Events.enable();
                }
                updateListWidget();




                // // Reference ; pxt-portDeclare
                // if (change.type == 'move') {
                //     if (this.getRootBlock().type == 'pxt-onStart') {
                //         // block enabled but the port is taken
                //         updateListWidget();
                //         var takenName = getAllWidgetName();




                //     }
                //     // block is not inside another root , which mean it is the root
                //     else if (this.getRootBlock() == this) {
                //         Blockly.Events.disable();
                //         this.setWarningText();
                //         Blockly.Events.enable();
                //         updateListWidget();
                //         // port[this.getFieldValue('PORT')] = null;
                //         //TAG=PORTSERVICE console.info(this.getFieldValue('MODULE'), 'is no longer used port', this.getFieldValue('PORT'));
                //     } else if (this.getRootBlock() != this) {
                //         Blockly.Events.disable();
                //         this.setDisabled(true);
                //         this.setWarningText('This block should be inside "on start" block!');
                //         Blockly.Events.enable();
                //         updateListWidget();
                //         //TAG=PORTSERVICE console.info(this.getFieldValue('MODULE'), 'is no longer used port', this.getFieldValue('PORT'));
                //     }
                // update the register
                // portService();

            }
        );
    }
};
Blockly.Python['pxt-blynk-widgetDeclare'] = function(block) {

};


var widgetDictionary = {};

function getListWidget(widgetType) {
    var d = widgetDictionary[widgetType];
    var r = [];
    for (var index = 0; index < d.length; index++) {
        r.push([d[index], d[index]]);
    }
    console.log('widget', widgetType, r, SUPPORTED_WIDGETS, widgetDictionary);
    return r;
}

function updateListWidget() {
    var listBlock = workspace.getAllBlocks();
    var listDeclared = [];
    // clear the dictionary 
    for (var index = 0; index < SUPPORTED_WIDGETS.length; index++) {
        widgetDictionary[SUPPORTED_WIDGETS[index][0]] = [];
    }

    // rebuilt the dictionary
    for (var index = 0; index < listBlock.length; index++) {
        var block = listBlock[index];
        console.info('consider', block);
        if (block.type == 'pxt-blynk-widgetDeclare' && !block.disabled) {
            var widgetname = Blockly.Python.valueToCode(block, 'WIDGETNAME', Blockly.Python.ORDER_ATOMIC);
            var widgettype = block.getFieldValue('WIDGET');
            widgetDictionary[widgettype].push(widgetname);
            console.log('add', widgettype, widgetname);
        }
    }

    // path the dictionary for empty dropdown problem;
    for (var index = 0; index < SUPPORTED_WIDGETS.length; index++) {
        if (widgetDictionary[SUPPORTED_WIDGETS[index][0]].length == 0) {
            widgetDictionary[SUPPORTED_WIDGETS[index][0]] = ['NOT CREATED'];
        }
    }
}

Blockly.Blocks['pxt-blynk-onButtonEvent'] = {
    init: function() {
        this.blockType = 'event';
        this.setColour(Toolbox_Blynk);
        this.appendDummyInput('MAIN')
            .appendField('when')
            .appendField(new Blockly.FieldDropdown(getListWidget('BUTTON')), 'WIDGET')
            .appendField('turn')
            .appendField(new Blockly.FieldDropdown([
                ['ON', 'ON'],
                ["OFF", "OFF"]
            ]), 'STATE');
        this.appendStatementInput('CODE');
        this.setOnChange(
            function(change) {
                if (this.isInFlyout && getListWidget('BUTTON')[0][0] == 'NOT CREATED') {
                    Blockly.Events.disable();
                    this.setDisabled(true);
                    Blockly.Events.enable();
                    return;
                }
            }
        );
    }
}
Blockly.Python['pxt-blynk-onButtonEvent'] = function(block) {

};