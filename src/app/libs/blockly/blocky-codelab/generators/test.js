goog.require('Blockly.Variables');
Blockly.Python.addReservedWords('blocky');
Blockly.Python.addReservedWords('machine');

Blockly.Blocks.declare_relay = {
    init: function() {
        this.setHelpUrl("http://www.example.com/");
        this.setTooltip("");
        this.setColour(120);
        this.appendDummyInput().appendField("Declare Relay");
        this.appendDummyInput().appendField("on port").appendField(new Blockly.FieldTextInput("1",EasyJ.Checker.RELAY_PORT), "NAME");
        this.setInputsInline(!0);
        this.setPreviousStatement(!0, "declare");
        this.setNextStatement(!0, "declare")
    },

};
Blockly.Python.declare_relay = function(a) {
    var b = a.getFieldValue("DIRS")
      , c = a.getFieldValue("PORT");
    a = Blockly.Python.variableDB_.getName(a.getFieldValue("NAME"), Blockly.Variables.NAME_TYPE);
    Blockly.Python.definitions_['import_servo'] = 'from Blockly.Servo import *';
    
    return c.toLowerCase() + ' = Servo ( ' + c + ')\n';
}
;
Blockly.Blocks.set_relay = {
    init: function() {
        this.setHelpUrl("http://www.example.com/");
        this.setTooltip("");
        this.setColour(120);
        //this.appendDummyInput().appendField("Set value").appendField(new Blockly.TypedFieldVariable("Relay1","Relay"), "NAME");
        this.appendDummyInput().appendField("to").appendField(new Blockly.FieldDropdown([["Off", "kOff"], ["Forward", "kForward"], ["Reverse", "kReverse"]]), "DIRECTION");
        this.setInputsInline(!0);
        this.setPreviousStatement(!0, "statement");
        this.setNextStatement(!0, "statement");
        //this.setDependsOn("declare_relay") why not available
    },
    onchange: function(a) {
        this.workspace && !this.isInFlyout && this.setWarningText(EasyJ.Checker.PickWarning(this, [EasyJ.Checker.EnsureVariablesExist, EasyJ.Checker.EnsureNotOrphaned]))
    },
    renameVar: function(a, b) {
        Blockly.Names.equals(a, this.getFieldValue("NAME")) && this.setFieldValue(b, "NAME")
    }
};
Blockly.Python.set_relay = function(a) {
    var b = Blockly.Python.variableDB_.getName(a.getFieldValue("NAME"), Blockly.Variables.NAME_TYPE);
    a = Blockly.Python.valueToCode(a, "VALUE", Blockly.Python.ORDER_ATOMIC);
    return b + ".set(Relay.Value." + a + ")"
}