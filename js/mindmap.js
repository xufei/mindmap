function MindMap(container) {
	this.model = new MindMapModel();
	this.graphic = new MindMapGraphic(container);

	this.init();
}

MindMap.prototype = {
	init: function () {
		var that = this;
		this.model.on("load", function (event) {
			that.graphic.init(that.model);
		});

		this.model.on("add", function (event) {
			that.graphic.createNode(event.node);
		});

		this.model.on("remove", function (event) {
			that.graphic.removeNode(event.node);
		});

		this.model.on("update", function (event) {
			that.graphic.update(event.node);
		});
	},

	loadData: function (data) {
		this.model.loadData(data);
	}
};

function MindMapGraphic(container, config) {
	this.paper = new Raphael(container);

	this.config = config || {offsetX:40, offsetY:40, gridX: 200, gridY: 50, paddingX: 20, paddingY: 20};
}

MindMapGraphic.prototype = {
	init: function (model) {
		var root = this.createNode(model.rootNode, null);
	},

	createNode: function (model, parent) {
		var nodeGraphic = new MindMapNodeGraphic(model, parent, this);
		for (var i = 0; i < model.children.length; i++) {
			this.createNode(model.children[i], nodeGraphic);
		}
		return nodeGraphic;
	},

	updateNode: function (node) {

	},

	removeNode: function (node) {

	}
};

function MindMapNodeGraphic(model, parent, graphic) {
	this.model = model;
	this.parent = parent;
	this.graphic = graphic;

	this.rect = null;
	this.connection = null;

	this.expanded = false;

	model.measure();
	model.position();
	this.init();
}

MindMapNodeGraphic.prototype = {
	measure: function() {
		var config = this.graphic.config;

		this.width = config.gridX;
		this.height = config.gridY;

		this.left = config.offsetX + this.model.depth * (config.gridX + config.paddingX);
		this.top = config.offsetY + (this.model.top + this.model.height / 2 - 1) * (config.gridY + config.paddingY);
	},

	position: function() {

	},

	init: function () {
		this.measure();
		this.position();

		var config = this.graphic.config;

		this.rect = this.graphic.paper.rect(this.left, this.top, this.width, this.height, 10);

		if (this.parent) {
			var x = this.parent.left + config.gridX;
			var y = this.parent.top + config.gridY / 2;
			var zx = this.left;
			var zy = this.top + config.gridY / 2;

			var ax = x * 0.4 + zx * 0.6;
			var ay = y;
			var bx = x * 0.6 + zx * 0.4;
			var by = zy;

			var path = [["M", x, y], ["C", ax, ay, bx, by, zx, zy]];
			this.connection = this.graphic.paper.path(path).attr({stroke: Raphael.getColor(), "stroke-width": 2, "stroke-linecap": "round"});

		}
	},

	expand: function () {

	},

	collapse: function () {

	},

	refresh: function () {

	},

	refreshLine: function () {
		//this.connection.
	}
};

function MindMapModel() {
	this.rootNode = new MindMapNodeModel({text: "Root"}, null, this);
	this.allNodes = [];

	this.eventMap = [];
}

MindMapModel.prototype = {
	loadData: function (data) {
		for (var i = 0; i < data.length; i++) {
			this.rootNode.addChild(data[i]);
		}

		var event = {type: "load"};
		this.fire(event);
	},

	measure: function () {
		this.rootNode.measure();
	},

	on: function (eventType, handler) {
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

	fire: function (event) {
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

	if (parent) {
		this.depth = parent.depth + 1;
	}
	else {
		this.top = 0;
		this.depth = 0;
	}

	this.children = [];
}

MindMapNodeModel.prototype = {
	addChild: function (data, needEvent) {
		var node = new MindMapNodeModel(data, this, this.mindmap);
		this.children.push(node);
		this.mindmap.allNodes.push(node);

		if (needEvent) {
			var event = {type: "add", node: node};
			this.mindmap.fire(event);
		}

		if (data.children) {
			for (var i = 0; i < data.children.length; i++) {
				node.addChild(data.children[i], needEvent);
			}
		}
	},

	removeChild: function (node) {
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i] === node) {
				this.children.slice(i, 1);
				break;
			}
		}

		for (var j = 0; j < this.mindmap.allNodes.length; j++) {
			if (this.mindmap.allNodes[j] === node) {
				this.mindmap.allNodes.slice(j, 1);
				break;
			}
		}

		var event = {type: "remove", node: node};
		this.fire(event);

		node.data = null;
		node.parent = null;
		node.mindmap = null;
	},

	setData: function (data) {
		this.data = data;

		var event = {type: "update", node: this};
		this.mindmap.fire(event);
	},

	measure: function () {
		this.height = 0;

		for (var i = 0; i < this.children.length; i++) {
			this.children[i].measure();
			this.height += this.children[i].height;
		}

		if (this.height === 0) {
			this.height = 1;
		}
	},

	position: function() {
		var height = 0;
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].top = this.top + height;
			height += this.children[i].height;
		}
	}
};

window.onload = function () {

	var mindmap = new MindMap(document.getElementById("mindmapDiv"));
	mindmap.loadData([
		{
			label: "Jiangsu",
			children: [
				{
					label: "Nanjing"
				},
				{
					label: "Suzhou"
				}
			]
		},
		{
			label: "Yunnan",
			children: [
				{
					label: "Kunming"
				},
				{
					label: "Lijiang"
				}
			]
		}
	]);
};