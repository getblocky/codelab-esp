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

var Toolbox_Advanced = '#00272b';
var Toolbox_Warning = '#000000';

var supported_modules = ['BUTTON', 'BUZZER'];
var SUPPORTED_MODULES = [];
for (var i = 0; i < supported_modules.length; i++) {
    SUPPORTED_MODULES.push([supported_modules[i], supported_modules[i]]);
}
console.log('Supported modules', SUPPORTED_MODULES);

var available_ports = ['PORT1', 'PORT2', 'PORT3', 'PORT4'];
var AVAILABLE_PORTS = [];
for (var i = 0; i < available_ports.length; i++) {
    AVAILABLE_PORTS.push([available_ports[i], available_ports[i]]);
}
console.log('Available port', AVAILABLE_PORTS);

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
    console.info('__port_serive__');
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

    console.info('portAssign', portAssign, port);

    for (var index = 0; index < listBlock.length; index++) {
        var block = listBlock[index];
        if (block.blockClass == null) continue; // this is not related block

        // build the dropdown
        var dropdown = [];
        for (var t = 0; t < portAssign[block.blockClass].length; t++) {
            var __port__ = portAssign[block.blockClass][t]
            console.log(__port__);
            dropdown.push([__port__, __port__])
        }
        console.info("dropdown", dropdown);
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




// ===  =   =   =   =   =       =   =   ==  =       ====    =   =   =   =       

Blockly.Blocks['pxt_test'] = {
    init: function () {
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
    mutationToDom: function () {

    },
    domToMutation: function () {

    },
    storeCostoreConnections_: function () {

    },
    restoreConnections_: function () {},
    addItem_: function () {}


}

Blockly.Blocks['pxt-onStart'] = {
    init: function () {


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
            function (change) {
                // port service relevant event
                // capture when the block is decalre block or the field of change is block
                // three case
                // 
                if (change.type == "ui") return;
                if ( (change.type == "change"&&change.element == "field"&&(change.name == "MODULE" || change.name == "PORT")) || change.type == "move" || change.type == "create" || change.type == "delete") {
                    var block = workspace.getBlockById(change.blockId);
                    if (block == null) return ;
                    if (block.type == 'pxt-declarePort' ) {
                        portService();
                    }
                    else{
                        if (block.blockClass){
                            if (change.name == "PORT"){
                                Blockly.Events.disable();
                                portService();
                                Blockly.Events.enable();
                            }
                        }
                    }
                }
                

            }
        );
        portService();



    }
};



Blockly.Python['pxt-onStart'] = function (block) {

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

    console.info('[VARIABLE]', variable);




    return '';

}


Blockly.Blocks['pxt-portDeclare'] = {
    init: function () {

        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.appendDummyInput('MAIN')
            .appendField('connect')
            .appendField(new Blockly.FieldDropdown(SUPPORTED_MODULES), 'MODULE')
            .appendField('to port')
            .appendField(new Blockly.FieldDropdown(AVAILABLE_PORTS), 'PORT');

        this.setColour(Toolbox_Control);
        this.setOnChange(
            function (change) {
                if (change.blockId != this.id || this.isInFlyout) return;


                // console.warn(change);
                portService(); // __helper__
                // set the warning text and disable block when not in the right position
                if (change.type == 'move') {
                    if (this.getRootBlock().type == 'pxt-onStart') {
                        // block enabled but the port is taken
                        if (port[this.getFieldValue('PORT')] != null) {
                            this.setDisabled(true);
                            this.setWarningText(this.getFieldValue('PORT'), 'is used by module', port[this.getFieldValue('PORT')])
                            onsole.info(this.getFieldValue('PORT'), 'is used by', port[this.getFieldValue('PORT')]);
                        } else {
                            this.setDisabled(false);
                            this.setWarningText();
                            console.info(this.getFieldValue('PORT'), 'is assigned to ', this.getFieldValue('MODULE'));

                            port[this.getFieldValue('PORT')] = this.getFieldValue('MODULE');

                        }


                    }
                    // block is not inside another root , which mean it is the root
                    else if (this.getRootBlock() == this) {
                        this.setWarningText();

                        port[this.getFieldValue('PORT')] = null;
                        console.info(this.getFieldValue('MODULE'), 'is no longer used port', this.getFieldValue('PORT'));
                    } else if (this.getRootBlock() != this) {
                        this.setDisabled(true);
                        this.setWarningText('This block should be inside "on start" block!');

                        port[this.getFieldValue('PORT')] = null;
                        console.info(this.getFieldValue('MODULE'), 'is no longer used port', this.getFieldValue('PORT'));
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

Blockly.Python['pxt-portDeclare'] = function (block) {
    var port = block.getFieldValue('PORT');
    var module = block.getFieldValue('MODULE');

    var code = module + ' = ' + module[0] + module.slice(1).toLowerCase();
    AddToSection('declare', code);
    console.info('[DECLARE]', code);
};

function getListPort(obj){
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
    console.log('ths' , dropdown);
    return dropdown;
}
// Start of button Block 
Blockly.Blocks['pxt-button-onClick'] = {
    init: function () {
        this.blockType = 'event';
        this.blockClass = 'BUTTON';

        this.setColour(Toolbox_Control);
        //this.setOutput(true,'Number')
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);

        this.appendDummyInput('MAIN')
            .appendField('when press button')
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
            .appendField(new Blockly.FieldDropdown(
                [
                    ['1 times', '1'],
                    ['2 times', '2'],
                    ['3 times', '3'],
                    ['4 times', '4']
                ]
            ), 'TIMES');
        this.appendStatementInput('CODE');
        // this.setOnChange(
        //     function (change) {
        //         if (change.blockId != this.id) return;
        //         // if (this.isInFlyout && getListPort(this).length == 0) {
        //         //     this.setDisabled(true);
        //         // }
        //     }
        // )

    }
};

Blockly.Python['pxt-button-onClick'] = function (block) {
    var port = block.getFieldValue('PORT');
    var times = block.getFieldValue('TIMES')

    var branch = Blockly.Python.statementToCode(block, 'CODE');
    branch = Blockly.Python.addLoopTrap(branch, block.id) || Blockly.Python.PASS;


    var code = port + times;
    return code;

}


Blockly.Blocks['pxt-button-isPressed'] = {
    init: function () {
        this.blockType = 'get';
        this.blockClass = 'BUTTON';


        this.setColour(Toolbox_Control);
        //this.setOutput(true,'Number')
        this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL);
        this.setOutput('Boolean')
        this.appendDummyInput('MAIN')
            .appendField(new Blockly.FieldDropdown([
                ['button PORT1', 'PORT1'],
                ['button PORT2', 'PORT2'],
                ['button PORT3', 'PORT3'],
                ['button PORT4', 'PORT4'],
            ]), 'PORT')
            .appendField('is pressed');


    }
};


// CATEGORY : INPUT.SOUND
Blockly.Blocks['pxt-clap-onClap'] = {
    init: function () {
        this.blockType = 'event';
        this.blockClass = 'CLAP';


        this.setColour(Toolbox_Control);
        //this.setOutput(true,'Number')
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);

        this.appendDummyInput('MAIN')
            .appendField('on')
            .appendField(new Blockly.FieldDropdown([
                ['button PORT1', 'PORT1'],
                ['button PORT2', 'PORT2'],
                ['button PORT3', 'PORT3'],
                ['button PORT4', 'PORT4'],
            ]), 'PORT')
            .appendField('clap')
            .appendField(new Blockly.FieldDropdown(
                [
                    ['1 times', '1'],
                    ['2 times', '2'],
                    ['3 times', '3'],
                    ['4 times', '4']
                ]
            ), 'TIMES');
        this.appendStatementInput('CODE');


    }
};

Blockly.Python['pxt-clap-onClap'] = function (block) {
    var port = block.getFieldValue('PORT');
    var times = block.getFieldValue('TIMES')

    var branch = Blockly.Python.statementToCode(block, 'CODE');
    branch = Blockly.Python.addLoopTrap(branch, block.id) || Blockly.Python.PASS;


    var code = port + times;
    return code;

}