function MindMap(container) {
    this.model = new MindMapModel();
    this.graphic = new MindMapGraphic(container);

    this.init();
}

MindMap.prototype = {
    init: function() {
        var that = this;
        this.model.on("load", function(event) {
            that.graphic.draw(that.model);
        });

        this.model.on("add", refresh);
        this.model.on("remove", refresh);
        
        this.model.on("update", function(event) {
            that.graphic.update(event.node);    
        });

        function refresh(event) {
            that.graphic.draw(that.model);
        }
    }
};

function MindMapGraphic(container) {
    this.graphic = new Raphael(container);
}

MindMapGraphic.prototype = {
    draw: function(model) {

    },
    
    update: function(node) {
        
    }
};

function MindMapModel() {
    this.nodes = [];
    this.allNodes = [];

    this.eventMap = [];
}

MindMapModel.prototype = {
    loadData: function() {

        var event = {type:"load"};
        this.fire(event);
    },
    
    addNode: function(data, parent) {
        
    },
    
    removeNode: function(node) {
        
    },
    
    measure: function() {
        var result = {
            width: 1,
            height: 1
        };

        for (var i=0; i<this.nodes.length; i++) {
            var childDim = this.nodes[i].measure();
            result.height += childDim.height;
            result.width += childDim.width;
        }
        return result;
    },

    on: function(eventType, handler) {
		if (!this.eventMap[eventType]) {
			this.eventMap[eventType] = [];
		}
		this.eventMap[eventType].push(handler);
    },

	off: function (eventType, handler) {
		for (var i = 0; i < this.eventMap[eventType].length; i++) {
			if (this.eventMap[eventType][i] === handler) {
				this.eventMap[eventType].splice(i, 1);
				break;
			}
		}
	},

    fire: function(event) {
		var eventType = event.type;
		if (this.eventMap[eventType]) {
			for (var i = 0; i < this.eventMap[eventType].length; i++) {
				this.eventMap[eventType][i](event);
			}
		}
    }
};

function MindMapNodeModel(data, parent, mindmap) {
    this.data = data;
    this.parent = parent;
    this.mindmap = mindmap;

    this.children = [];
}

MindMapNodeModel.prototype = {
    addChild: function(data) {
        var node = new MindMapNodeModel(data, this, this.mindmap);
        this.children.push(node);
        this.mindmap.allNodes.push(node);

        var event = {type:"add", node: node};
        this.mindmap.fire(event);
    },

    removeChild: function(node) {
        for (var i=0; i<this.children.length; i++) {
            if (this.children[i] === node) {
                this.children.slice(i, 1);
                break;
            }
        }

        for (var j=0; j<this.mindmap.allNodes.length; j++) {
            if (this.mindmap.allNodes[j] === node) {
                this.mindmap.allNodes.slice(j, 1);
                break;
            }
        }

        var event = {type:"remove", node: node};
        this.fire(event);

        node.data = null;
        node.parent = null;
        node.mindmap = null;
    },

    setData: function(data) {
        this.data = data;

        var event = {type:"update", node: this};
        this.mindmap.fire(event);
    },

    measure: function() {
        var result = {
            width: 1,
            height: 1
        };

        for (var i=0; i<this.children.length; i++) {
            var childDim = this.children[i].measure();
            result.height += childDim.height;
            result.width += childDim.width;
        }
        return result;
    }
};