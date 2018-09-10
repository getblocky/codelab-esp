

/**
 * Find all user-created variablesof a given type.
 * @param {Blockly.Block=} opt_block Optional root block.
 * @return {!Array.<string>} Array of variable names.
 */
goog.provide('Blockly.Variables.allVariablesOfType');
Blockly.Variables.allVariablesOfType = function(type) {
  var blocks;

  blocks = Blockly.mainWorkspace.getAllBlocks();

  var variableHash = Object.create(null);
  // Iterate through every block and add each variable to the hash.
  for (var x = 0; x < blocks.length; x++) {
    var func = blocks[x].getVars;
    if (func) {
      var blockVariables = func.call(blocks[x]);
      for (var y = 0; y < blockVariables.length; y++) {

        var varName = blockVariables[y].name;
        var vartype = blockVariables[y].vartype;
        // Variable name may be null if the block is only half-built.
        if (varName) {
          // variableHash[varName.toLowerCase()] = varName;
          if (!goog.isArray(variableHash[vartype])) {
            variableHash[vartype] = [];
          }
          if (variableHash[vartype].indexOf(varName) == -1) {
            variableHash[vartype].push(varName);
          }
        }
      }
    }
  }

  return variableHash[type] || [];
};

/**
 * Find all blocks in workspace of the given type.  No particular order.
 * @return {!Array.<!Blockly.Block>} Array of blocks.
 */
Blockly.Workspace.prototype.getAllBlocksOfType = function(prototypeName) {
  var foundblocks = [];

  var blocks = this.getTopBlocks(false);

  for (var x = 0; x < blocks.length; x++) {
    // iterate over the top blocks and add any that match
    if (blocks[x].type == prototypeName) {
      foundblocks.push(blocks[x])
    }
    // for each top block, iterate over its children looking for matches
    for (var i = 0; i < blocks[x].length; i++) {
      if (blocks[x][i].type == prototypeName) {
        foundblocks.push(blocks[x][i])
      }
    }
    // blocks.push.apply(blocks, blocks[x].getChildren());
  }
  return foundblocks;
};
/**
 * Keeps track of how many of each type of block exist
 */
Blockly.blockHash = {};

function onchgupdatecountsfunc(event) {
// 	
	var blocks = Blockly.mainWorkspace.getAllBlocks();
	Blockly.blockHash = {};
	for (var i = 0; i < blocks.length; i++) {
		if (typeof Blockly.blockHash[blocks[i].type] === "undefined") {
			Blockly.blockHash[blocks[i].type] = 1;
		} else {
			Blockly.blockHash[blocks[i].type] ++;
		}
	}
}
$(document).on("blocklyLoaded", function() {
	
	Blockly.bindEvent_(Blockly.mainWorkspace.getCanvas(), 'blocklyWorkspaceChange', null, onchgupdatecountsfunc);
});



/**
 * Filter the blocks on the flyout to disable the ones that are above the
 * capacity limit and, the ones which depend on another block
 * @private
 */
Blockly.Flyout.prototype.filterForCapacity_ = function() {
  var remainingCapacity = this.targetWorkspace_.remainingCapacity();
  var blocks = this.workspace_.getTopBlocks(false); //Blocks in this flyout menu (workspace_ is the flyout)
  // 
  for (var i = 0, block; block = blocks[i]; i++) {
    // 
    // 
    var allBlocks = block.getDescendants(); // blocks which are containted (value blocks or statement blocks)

    var disabled = allBlocks.length > remainingCapacity;

    // if the block depends on another block, at least one of those other blocks must exist
    if (block.dependsOn && !disabled) {
      // && (typeof Blockly.blockHash[block.dependsOn] === "undefined" || Blockly.blockHash[block.dependsOn] < 1)
      for (var j = 0; j < block.dependsOn.length; j++) {
        disabled = (typeof Blockly.blockHash[block.dependsOn[j]] === "undefined" || Blockly.blockHash[block.dependsOn[j]] < 1)
        if (disabled)
          break;
      }
    }

// @todo
//     if (block.maxAvailable !== null) {
//       
//       var blocksoftype = this.targetWorkspace_.getAllBlocksOfType(block.type);
//     }


    block.setDisabled(disabled);
  }
};

Blockly.Block.prototype.setDependsOn = function (who) {
	if (!$.isArray(who))
		who = [who];
	this.dependsOn = who;
}

// @override
/**
 * Construct the blocks required by the flyout for the variable category.
 * @param {!Array.<!Blockly.Block>} blocks List of blocks to show.
 * @param {!Array.<number>} gaps List of widths between blocks.
 * @param {number} margin Standard margin width for calculating gaps.
 * @param {!Blockly.Workspace} workspace The flyout's workspace.
 */
Blockly.Variables.flyoutCategory = function(blocks, gaps, margin, workspace) {
  var variableList = Blockly.Variables.allVariablesOfType('int');
  // variableList = variableList.concat(Blockly.Variables.allVariablesOfType('double'));

  function a(type) {
    // In addition to the user's variables, we also want to display the default
    // variable name at the top.  We also don't want this duplicated if the
    // user has created a variable of the same name.
    // variableList.unshift(null);
    var defaultVariable = undefined;
    for (var i = 0; i < variableList.length; i++) {
      if (variableList[i] === defaultVariable) {
        continue;
      }
      var getBlock = Blockly.Blocks['variables_get'+'_'+type] ?
          Blockly.Block.obtain(workspace, 'variables_get'+'_'+type) : null;
      getBlock && getBlock.initSvg();
      var setBlock = Blockly.Blocks['variables_set'+'_'+type] ?
          Blockly.Block.obtain(workspace, 'variables_set'+'_'+type) : null;
      setBlock && setBlock.initSvg();
      if (variableList[i] === null) {
        defaultVariable = (getBlock || setBlock).getVars()[0];
      } else {
        getBlock && getBlock.setFieldValue(variableList[i], 'NAME');
        setBlock && setBlock.setFieldValue(variableList[i], 'NAME');
      }
      setBlock && blocks.push(setBlock);
      getBlock && blocks.push(getBlock);
      if (getBlock && setBlock) {
        gaps.push(margin, margin * 3);
      } else {
        gaps.push(margin * 2);
      }
    }
  }

  var declareBlock_int = Blockly.Blocks['variables_declare_int'] ?
    Blockly.Block.obtain(workspace, 'variables_declare_int') : null;
    declareBlock_int && declareBlock_int.initSvg();
  declareBlock_int && blocks.push(declareBlock_int);

  gaps.push(margin, margin * 3);
  variableList.sort(goog.string.caseInsensitiveCompare);
  a('int');

  variableList = Blockly.Variables.allVariablesOfType('double');

  var declareBlock_double = Blockly.Blocks['variables_declare_double'] ?
    Blockly.Block.obtain(workspace, 'variables_declare_double') : null;
    declareBlock_double && declareBlock_double.initSvg();
  declareBlock_double && blocks.push(declareBlock_double);

  gaps.push(margin, margin * 3);
  variableList.sort(goog.string.caseInsensitiveCompare);
  a('double');

  variableList = Blockly.Variables.allVariablesOfType('Boolean');

  var declareBlock_boolean = Blockly.Blocks['variables_declare_boolean'] ?
    Blockly.Block.obtain(workspace, 'variables_declare_boolean') : null;
    declareBlock_boolean && declareBlock_boolean.initSvg();
  declareBlock_boolean && blocks.push(declareBlock_boolean);

  // gaps.push(margin, margin * 3);
  variableList.sort(goog.string.caseInsensitiveCompare);
  a('boolean');
//   
// var type = 'int';
//   var defaultVariable = undefined;
//   for (var i = 0; i < variableList.length; i++) {
//     if (variableList[i] === defaultVariable) {
//       continue;
//     }
//     var getBlock = Blockly.Blocks['variables_get'+'_'+type] ?
//         Blockly.Block.obtain(workspace, 'variables_get'+'_'+type) : null;
//     getBlock && getBlock.initSvg();
//     var setBlock = Blockly.Blocks['variables_set'+'_'+type] ?
//         Blockly.Block.obtain(workspace, 'variables_set'+'_'+type) : null;
//     setBlock && setBlock.initSvg();
//     if (variableList[i] === null) {
//       defaultVariable = (getBlock || setBlock).getVars()[0];
//     } else {
//       getBlock && getBlock.setFieldValue(variableList[i], 'NAME');
//       setBlock && setBlock.setFieldValue(variableList[i], 'NAME');
//     }
//     setBlock && blocks.push(setBlock);
//     getBlock && blocks.push(getBlock);
//     if (getBlock && setBlock) {
//       gaps.push(margin, margin * 3);
//     } else {
//       gaps.push(margin * 2);
//     }
//   }


  // var declareBlock_double = Blockly.Blocks['variables_declare_double'] ?
  //   Blockly.Block.obtain(workspace, 'variables_declare_double') : null;
  //   declareBlock_double && declareBlock_double.initSvg();
  // declareBlock_double && blocks.push(declareBlock_double);

  // gaps.push(margin *2);

  // variableList.sort(goog.string.caseInsensitiveCompare);
  
};




























