goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldString');
goog.require('Blockly');

/*
    Checked block

    colour_picker

*/

Blockly.Blocks['pxt_test'] = {
    init : function(){
      this.setColour('#112233' , '#223344' , '#000000');
        this.appendValueInput('DUMMY')
            .appendField(new Blockly.FieldTextInput('My Strinc'),'STR')
            .appendField(new Blockly.FieldString('My Strinasdac'),'TR')
            .appendField(new Blockly.FieldNumberDropdown(1000 , [['100ms',1000],['200ms',10]]) , 'NUM')
            .appendField(new Blockly.FieldTextDropdown('1000' , [['100ms','1000'],['200ms','10']]) , 'NUMe')
        ;
      this.setOutput(false);
    }
}


Blockly.Blocks['text_getSubstring'] = {
    /**
     * Block for getting substring.
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(Blockly.Msg.TEXTS_HUE);
        this.appendValueInput('STRING')
            .setCheck('String')
            .appendField(Blockly.Msg.TEXT_GET_SUBSTRING_INPUT_IN_TEXT);
        this.appendDummyInput('AT1');
        this.appendDummyInput('AT2');
        if (Blockly.Msg.TEXT_GET_SUBSTRING_TAIL) {
            this.appendDummyInput('TAIL')
                .appendField(Blockly.Msg.TEXT_GET_SUBSTRING_TAIL);
        }
        this.setInputsInline(true);
        this.setOutput(true, 'String');
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.updateAt_(1, true);
        this.updateAt_(2, true);
        this.setTooltip(Blockly.Msg.TEXT_GET_SUBSTRING_TOOLTIP);
    },
    /**
     * Create XML to represent whether there are 'AT' inputs.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var container = document.createElement('mutation');
        var isAt1 = this.getInput('AT1').type == Blockly.INPUT_VALUE;
        container.setAttribute('at1', isAt1);
        var isAt2 = this.getInput('AT2').type == Blockly.INPUT_VALUE;
        container.setAttribute('at2', isAt2);
        return container;
    },
    /**
     * Parse XML to restore the 'AT' inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        var isAt1 = (xmlElement.getAttribute('at1') == 'true');
        var isAt2 = (xmlElement.getAttribute('at2') == 'true');
        this.updateAt_(1, isAt1);
        this.updateAt_(2, isAt2);
    },
    /**
     * Create or delete an input for a numeric index.
     * This block has two such inputs, independant of each other.
     * @param {number} n Specify first or second input (1 or 2).
     * @param {boolean} isAt True if the input should exist.
     * @private
     * @this Blockly.Block
     */
    updateAt_: function (n, isAt) {
        // Create or delete an input for the numeric index.
        // Destroy old 'AT' and 'ORDINAL' inputs.
        this.removeInput('AT' + n);
        this.removeInput('ORDINAL' + n, true);
        // Create either a value 'AT' input or a dummy input.
        if (isAt) {
            this.appendValueInput('AT' + n).setCheck('Number');
            if (Blockly.Msg.ORDINAL_NUMBER_SUFFIX) {
                this.appendDummyInput('ORDINAL' + n)
                    .appendField(Blockly.Msg.ORDINAL_NUMBER_SUFFIX);
            }
        } else {
            this.appendDummyInput('AT' + n);
        }
        // Move tail, if present, to end of block.
        if (n == 2 && Blockly.Msg.TEXT_GET_SUBSTRING_TAIL) {
            this.removeInput('TAIL', true);
            this.appendDummyInput('TAIL')
                .appendField(Blockly.Msg.TEXT_GET_SUBSTRING_TAIL);
        }
        var menu = new Blockly.FieldDropdown(this['WHERE_OPTIONS_' + n],
            function (value) {
                var newAt = (value == 'FROM_START') || (value == 'FROM_END');
                // The 'isAt' variable is available due to this function being a
                // closure.
                if (newAt != isAt) {
                    var block = this.sourceBlock_;
                    block.updateAt_(n, newAt);
                    // This menu has been destroyed and replaced.
                    // Update the replacement.
                    block.setFieldValue(value, 'WHERE' + n);
                    return null;
                }
                return undefined;
            });

        this.getInput('AT' + n)
            .appendField(menu, 'WHERE' + n);
        if (n == 1) {
            this.moveInputBefore('AT1', 'AT2');
            if (this.getInput('ORDINAL1')) {
                this.moveInputBefore('ORDINAL1', 'AT2');
            }
        }
    }
};