// Start of button Block 
Blockly.Blocks['pxt-button-onClick'] = {
    init: function() {
        this.blockType = 'event';
        this.blockClass = 'BUTTON';

        this.setColour(Toolbox_Control);
        //this.setOutput(true,'Number')

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

Blockly.Python['pxt-button-onClick'] = function(block) {
    var port = block.getFieldValue('PORT');
    var times = block.getFieldValue('TIMES')

    var branch = Blockly.Python.statementToCode(block, 'CODE');
    branch = Blockly.Python.addLoopTrap(branch, block.id) || Blockly.Python.PASS;


    var code = port + times;
    return code;

}


Blockly.Blocks['pxt-button-isPressed'] = {
    init: function() {
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
    init: function() {
        this.blockType = 'event';
        this.blockClass = 'CLAP';


        this.setColour(Toolbox_Control);
        //this.setOutput(true,'Number')
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);

        this.appendDummyInput('MAIN')
            .appendField('on')
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT')
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

Blockly.Python['pxt-clap-onClap'] = function(block) {
    var port = block.getFieldValue('PORT');
    var times = block.getFieldValue('TIMES')

    var branch = Blockly.Python.statementToCode(block, 'CODE');
    branch = Blockly.Python.addLoopTrap(branch, block.id) || Blockly.Python.PASS;


    var code = port + times;
    return code;

}

Blockly.Blocks['pxt-potentiometer-get'] = {
    init: function() {
        this.blockType = 'get';
        this.blockClass = 'POTENTIOMETER';
        this.appendDummyInput('MAIN')
            .appendField('read potentiometer')
            .appendField(new Blockly.FieldDropdown(getListPort(this)), 'PORT');
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setOutput(true, 'Number');
        this.setColour(Toolbox_Input);
        this.setOnChange(
            function(change) {
                if (this.isInFlyout && this.getFieldValue('PORT') == "NO PORT") {
                    Blockly.Events.disable();
                    this.setDisabled(true);
                    Blockly.Events.enable();
                }
            }
        );
    }
};
Blockly.Python['pxt-potentiometer-get'] = function(block) {

};