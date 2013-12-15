function MindMap(container) {
    this.model = new MindMapModel();
    this.graphic = new MindMapGraphic(container);

    this.init();
}

MindMap.prototype = {
    init: function() {
        var that = this;
        this.model.on("load", function(event) {
            that.graphic.init(that.model);
        });

        this.model.on("add", function(event) {
            that.graphic.createNode(event.node);
        });
        
        this.model.on("remove", function(event) {
            that.graphic.removeNode(event.node);
        });
        
        this.model.on("update", function(event) {
            that.graphic.update(event.node);    
        });
    },
    
    loadData: function(data) {
        this.model.loadData(data);    
    }
};

function MindMapGraphic(container, config) {
    this.paper = new Raphael(container);
    
    this.config = config || {gridX: 200, gridY: 50};
}

MindMapGraphic.prototype = {
    init: function(model) {
        var dim = model.measure();
        
        this.createNode(model.rootNode);
    },
    
    createNode: function(node) {
        var nodeGraphic = new MindMapNodeGraphic(this.paper);    
    },
    
    updateNode: function(node) {
        
    },
    
    removeNode: function(node) {
        
    }
};

function MindMapNodeGraphic(paper) {
    this.rect;
    this.connection = paper.path("M10 10L90 90");
}

MindMapNodeGraphic.prototype = {
    refresh: function() {
        
    },
    
    refreshLine: function() {
        //this.connection.    
    }
};

function MindMapModel() {
    this.rootNode = new MindMapNodeModel({text:"Root"}, null, this);
    this.allNodes = [];

    this.eventMap = [];
}

MindMapModel.prototype = {
    loadData: function(data) {
        for (var i=0; i<data.length; i++) {
            this.rootNode.addChild(data[i]);
        }
        
        var event = {type:"load"};
        this.fire(event);
    },
    
    measure: function() {
        return this.rootNode.measure();
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
        var dim = {
            width: 1,
            height: 1
        };

        for (var i=0; i<this.children.length; i++) {
            var childDim = this.children[i].measure();
            dim.height += childDim.height;
            dim.width += childDim.width;
        }
        return dim;
    }
};

var mindmap = new MindMap(document.getElementById("mindmapDiv"));
mindmap.loadData([{
    label: "Jiangsu",
    children: [{
        label: "Nanjing"
    }, {
        label: "Suzhou"
    }]
}, {
    label: "Yunnan",
    children: [{
        label: "Kunming"
    }, {
        label: "Lijiang"
    }]
}]);