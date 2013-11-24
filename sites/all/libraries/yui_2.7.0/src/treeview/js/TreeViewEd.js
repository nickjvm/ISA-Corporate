(function () {
    var Dom = YAHOO.util.Dom,
        Lang = YAHOO.lang, 
        Event = YAHOO.util.Event,
        TV = YAHOO.widget.TreeView,
        TVproto = TV.prototype;

    /**
     * An object to store information used for in-line editing
     * for all Nodes of all TreeViews. It contains:
     * <ul>
    * <li>active {boolean}, whether there is an active cell editor </li>
    * <li>whoHasIt {YAHOO.widget.TreeView} TreeView instance that is currently using the editor</li>
    * <li>nodeType {string} value of static Node._type property, allows reuse of input element if node is of the same type.</li>
    * <li>editorPanel {HTMLelement (&lt;div&gt;)} element holding the in-line editor</li>
    * <li>inputContainer {HTMLelement (&lt;div&gt;)} element which will hold the type-specific input element(s) to be filled by the fillEditorContainer method</li>
    * <li>buttonsContainer {HTMLelement (&lt;div&gt;)} element which holds the &lt;button&gt; elements for Ok/Cancel.  If you don't want any of the buttons, hide it via CSS styles, don't destroy it</li>
    * <li>node {YAHOO.widget.Node} reference to the Node being edited</li>
    * <li>saveOnEnter {boolean}, whether the Enter key should be accepted as a Save command (Esc. is always taken as Cancel), disable for multi-line input elements </li>
    * </ul>
    *  Editors are free to use this object to store additional data.
     * @property editorData
     * @static
     * @for YAHOO.widget.TreeView
     */
    TV.editorData = {
        active:false,
        whoHasIt:null, // which TreeView has it
        nodeType:null,
        editorPanel:null,
        inputContainer:null,
        buttonsContainer:null,
        node:null, // which Node is being edited
        saveOnEnter:true
        // Each node type is free to add its own properties to this as it sees fit.
    };
    
    /**
    * Validator function for edited data, called from the TreeView instance scope, 
    * receives the arguments (newValue, oldValue, nodeInstance) 
    * and returns either the validated (or type-converted) value or undefined. 
    * An undefined return will prevent the editor from closing
    * @property validator
    * @default null
     * @for YAHOO.widget.TreeView
     */
    TVproto.validator = null;
    
    /**
    * Entry point of the editing plug-in.  
    * TreeView will call this method if it exists when a node label is clicked
    * @method _nodeEditing
    * @param node {YAHOO.widget.Node} the node to be edited
    * @return {Boolean} true to indicate that the node is editable and prevent any further bubbling of the click.
     * @for YAHOO.widget.TreeView
     * @private
    */
    
    
    TVproto._nodeEditing = function (node) {
        if (node.fillEditorContainer && node.editable) {
            var ed, topLeft, buttons, button, editorData = TV.editorData;
            editorData.active = true;
            editorData.whoHasIt = this;
            if (!editorData.nodeType) {
                editorData.editorPanel = ed = document.body.appendChild(document.createElement('div'));
                Dom.addClass(ed,'ygtv-label-editor');

                buttons = editorData.buttonsContainer = ed.appendChild(document.createElement('div'));
                Dom.addClass(buttons,'ygtv-button-container');
                button = buttons.appendChild(document.createElement('button'));
                Dom.addClass(button,'ygtvok');
                button.innerHTML = ' ';
                button = buttons.appendChild(document.createElement('button'));
                Dom.addClass(button,'ygtvcancel');
                button.innerHTML = ' ';
                Event.on(buttons, 'click', function (ev) {
                    this.logger.log('click on editor');
                    var target = Event.getTarget(ev);
                    var node = TV.editorData.node;
                    if (Dom.hasClass(target,'ygtvok')) {
                        node.logger.log('ygtvok');
                        Event.stopEvent(ev);
                        this._closeEditor(true);
                    }
                    if (Dom.hasClass(target,'ygtvcancel')) {
                        node.logger.log('ygtvcancel');
                        Event.stopEvent(ev);
                        this._closeEditor(false);
                    }
                }, this, true);

                editorData.inputContainer = ed.appendChild(document.createElement('div'));
                Dom.addClass(editorData.inputContainer,'ygtv-input');
                
                Event.on(ed,'keydown',function (ev) {
                    var editorData = TV.editorData,
                        KEY = YAHOO.util.KeyListener.KEY;
                    switch (ev.keyCode) {
                        case KEY.ENTER:
                            this.logger.log('ENTER');
                            Event.stopEvent(ev);
                            if (editorData.saveOnEnter) { 
                                this._closeEditor(true);
                            }
                            break;
                        case KEY.ESCAPE:
                            this.logger.log('ESC');
                            Event.stopEvent(ev);
                            this._closeEditor(false);
                            break;
                    }
                },this,true);


                
            } else {
                ed = editorData.editorPanel;
            }
            editorData.node = node;
            if (editorData.nodeType) {
                Dom.removeClass(ed,'ygtv-edit-' + editorData.nodeType);
            }
            Dom.addClass(ed,' ygtv-edit-' + node._type);
            topLeft = Dom.getXY(node.getContentEl());
            Dom.setStyle(ed,'left',topLeft[0] + 'px');
            Dom.setStyle(ed,'top',topLeft[1] + 'px');
            Dom.setStyle(ed,'display','block');
            ed.focus();
            node.fillEditorContainer(editorData);

            return true;  // If inline editor available, don't do anything else.
        }
    };
    
    /**
    * Method to be associated with an event (clickEvent, dblClickEvent or enterKeyPressed) to pop up the contents editor
    *  It calls the corresponding node editNode method.
    * @method onEventEditNode
    * @param oArgs {object} Object passed as arguments to TreeView event listeners
     * @for YAHOO.widget.TreeView
    */

    TVproto.onEventEditNode = function (oArgs) {
        if (oArgs instanceof YAHOO.widget.Node) {
            oArgs.editNode();
        } else if (oArgs.node instanceof YAHOO.widget.Node) {
            oArgs.node.editNode();
        }
    };
    
    /**
    * Method to be called when the inline editing is finished and the editor is to be closed
    * @method _closeEditor
    * @param save {Boolean} true if the edited value is to be saved, false if discarded
    * @private
     * @for YAHOO.widget.TreeView
    */
    
    TVproto._closeEditor = function (save) {
        var ed = TV.editorData, 
            node = ed.node,
            close = true;
        if (save) { 
            close = ed.node.saveEditorValue(ed) !== false; 
        }
        if (close) {
            Dom.setStyle(ed.editorPanel,'display','none');  
            ed.active = false;
            node.focus();
        }
    };
    
    /**
    *  Entry point for TreeView's destroy method to destroy whatever the editing plug-in has created
    * @method _destroyEditor
    * @private
     * @for YAHOO.widget.TreeView
    */
    TVproto._destroyEditor = function() {
        var ed = TV.editorData;
        if (ed && ed.nodeType && (!ed.active || ed.whoHasIt === this)) {
            Event.removeListener(ed.editorPanel,'keydown');
            Event.removeListener(ed.buttonContainer,'click');
            ed.node.destroyEditorContents(ed);
            document.body.removeChild(ed.editorPanel);
            ed.nodeType = ed.editorPanel = ed.inputContainer = ed.buttonsContainer = ed.whoHasIt = ed.node = null;
            ed.active = false;
        }
    };
    
    var Nproto = YAHOO.widget.Node.prototype;
    
    /**
    * Signals if the label is editable.  (Ignored on TextNodes with href set.)
    * @property editable
    * @type boolean
         * @for YAHOO.widget.Node
    */
    Nproto.editable = false;
    
    /**
    * pops up the contents editor, if there is one and the node is declared editable
    * @method editNode
     * @for YAHOO.widget.Node
    */
    
    Nproto.editNode = function () {
        this.tree._nodeEditing(this);
    };
    
    


    /** Placeholder for a function that should provide the inline node label editor.
     *   Leaving it set to null will indicate that this node type is not editable.
     * It should be overridden by nodes that provide inline editing.
     *  The Node-specific editing element (input box, textarea or whatever) should be inserted into editorData.inputContainer.
     * @method fillEditorContainer
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @return void
     * @for YAHOO.widget.Node
     */
    Nproto.fillEditorContainer = null;

    
    /**
    * Node-specific destroy function to empty the contents of the inline editor panel
    * This function is the worst case alternative that will purge all possible events and remove the editor contents
    * Method Event.purgeElement is somewhat costly so if it can be replaced by specifc Event.removeListeners, it is better to do so.
    * @method destroyEditorContents
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @for YAHOO.widget.Node
     */
    Nproto.destroyEditorContents = function (editorData) {
        // In the worst case, if the input editor (such as the Calendar) has no destroy method
        // we can only try to remove all possible events on it.
        Event.purgeElement(editorData.inputContainer,true);
        editorData.inputContainer.innerHTML = '';
    };

    /**
    * Saves the value entered into the editor.
    * Should be overridden by each node type
    * @method saveEditorValue
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @return a return of exactly false will prevent the editor from closing
     * @for YAHOO.widget.Node
     */
    Nproto.saveEditorValue = function (editorData) {
    };
    
    var TNproto = YAHOO.widget.TextNode.prototype;
    


    /** 
     *  Places an &lt;input&gt;  textbox in the input container and loads the label text into it
     * @method fillEditorContainer
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @return void
     * @for YAHOO.widget.TextNode
     */
    TNproto.fillEditorContainer = function (editorData) {
    
        var input;
        // If last node edited is not of the same type as this one, delete it and fill it with our editor
        if (editorData.nodeType != this._type) {
            editorData.nodeType = this._type;
            editorData.saveOnEnter = true;
            editorData.node.destroyEditorContents(editorData);

            editorData.inputElement = input = editorData.inputContainer.appendChild(document.createElement('input'));
            
        } else {
            // if the last node edited was of the same time, reuse the input element.
            input = editorData.inputElement;
        }

        input.value = this.label;
        input.focus();
        input.select();
    };
    
    /**
    * Saves the value entered in the editor into the TextNode label property and displays it
    * Overrides Node.saveEditorValue
    * @method saveEditorValue
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @for YAHOO.widget.TextNode
     */
    TNproto.saveEditorValue = function (editorData) {
        var node = editorData.node, 
            value = editorData.inputElement.value,
            validator = node.tree.validator;
        
        if (Lang.isFunction(validator)) {
            value = validator(value,node.label,node);
            if (Lang.isUndefined(value)) { return false; }
        }
        node.label = value;
        node.getLabelEl().innerHTML = value;
    };

    /**
    * Destroys the contents of the inline editor panel
    * Overrides Node.destroyEditorContent
    * Since we didn't set any event listeners on this inline editor, it is more efficient to avoid the generic method in Node
    * @method destroyEditorContents
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @for YAHOO.widget.TextNode
     */
    TNproto.destroyEditorContents = function (editorData) {
        editorData.inputContainer.innerHTML = '';
    };
})();
