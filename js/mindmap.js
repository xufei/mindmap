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
			that.graphic.rootNode.refresh();
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
	this.selectedNode = null;
	this.allNodes = [];

	this.paper = new Raphael(container, 3000, 3000);

	this.config = config || {offsetX: 60, offsetY: 60, gridX: 200, gridY: 50, paddingX: 40, paddingY: 20};
}

MindMapGraphic.prototype = {
	init: function (model) {
		this.rootNode = this.createNode(model.rootNode);
	},

	createNode: function (model, parent) {
		if (!parent) {
			for (var i = 0; i < this.allNodes.length; i++) {
				if (this.allNodes[i].model === model.parent) {
					parent = this.allNodes[i];
					break;
				}
			}
		}

		var nodeGraphic = new MindMapNodeGraphic(model, parent, this);
		this.allNodes.push(nodeGraphic);

		if (parent) {
			parent.childNodes.push(nodeGraphic);
		}

		for (var i = 0; i < model.children.length; i++) {
			var child = this.createNode(model.children[i], nodeGraphic);
		}
		return nodeGraphic;
	},

	updateNode: function (node) {

	},

	removeNode: function (node) {

	},

	selectNode: function (node) {
		if (this.selectedNode) {
			this.selectedNode.unselect();
		}

		node.select();
		this.selectedNode = node;
	}
};

function MindMapNodeGraphic(model, parent, graphic) {
	this.model = model;
	this.parent = parent;
	this.childNodes = [];
	this.graphic = graphic;

	this.group = null;
	this.box = null;
	this.textbox = null;
	this.connection = null;

	this.expanded = false;

	this.init();
}

MindMapNodeGraphic.prototype = {
	measure: function () {
		var config = this.graphic.config;

		this.width = config.gridX;
		this.height = config.gridY;

		this.left = config.offsetX + this.model.depth * (config.gridX + config.paddingX);
		this.top = config.offsetY + (this.model.top + this.model.height / 2 - 1) * (config.gridY + config.paddingY);
	},

	position: function () {
		if (this.parent) {
			this.x = this.parent.left + this.graphic.config.gridX;
			this.y = this.parent.top + this.graphic.config.gridY / 2;
			this.zx = this.left;
			this.zy = this.top + this.graphic.config.gridY / 2;

			this.ax = this.x * 0.4 + this.zx * 0.6;
			this.ay = this.y;
			this.bx = this.x * 0.6 + this.zx * 0.4;
			this.by = this.zy;
		}
	},

	init: function () {
		this.model.measure();
		this.model.position();

		this.measure();
		this.position();

		var config = this.graphic.config;

		var group = this.graphic.paper.set();
		var box = this.graphic.paper.rect(this.left, this.top, this.width, this.height, 10);
		var textbox = this.graphic.paper.text(this.left + 30, this.top + 20, this.model.data.label).attr({fill: Raphael.getColor()});
		group.push(box);
		group.push(textbox);
		group.translate(0, 0);

		this.group = group;
		this.box = box;
		this.textbox = textbox;

		if (this.parent) {
			var path = [
				["M", this.x, this.y],
				["C", this.ax, this.ay, this.bx, this.by, this.zx, this.zy]
			];
			this.connection = this.graphic.paper.path(path).attr({stroke: Raphael.getColor(), "stroke-width": 2, "stroke-linecap": "round"});
		}

		this.bindEvents();
	},

	bindEvents: function () {
		var that = this;
		this.group.click(function () {
			that.graphic.selectNode(that);
		});
	},

	expand: function () {

	},

	collapse: function () {

	},

	refresh: function () {
		this.model.measure();
		this.model.position();

		this.measure();
		this.position();

		var config = this.graphic.config;

		this.box.attr({x: this.left, y: this.top, width: this.width, height: this.height});
		this.textbox.attr({x: this.left + 30, y: this.top + 20});

		if (this.adder) {
			this.adder.attr({x: this.left + this.width, y: this.top + this.height + 10});
		}

		if (this.connection) {
			var path = [
				["M", this.x, this.y],
				["C", this.ax, this.ay, this.bx, this.by, this.zx, this.zy]
			];
			this.connection.attr({path: path});
		}

		for (var i = 0; i < this.childNodes.length; i++) {
			this.childNodes[i].refresh();
		}
	},

	select: function () {
		this.box.attr({
			stroke: "Red"
		});

		if (!this.adder) {
			this.adder = this.graphic.paper.text(this.left + this.width, this.top + this.height + 10, "+");

			var that = this;
			this.adder.click(function () {
				that.model.addChild({label: that.model.data.label + that.model.children.length}, true);
			});
		}
		else {
			this.adder.show();
		}
	},

	unselect: function () {
		this.box.attr({
			stroke: "Black"
		});

		this.adder.hide();
	}
};

function MindMapModel() {
	this.rootNode = new MindMapNodeModel({label: "Root"}, null, this);
	this.allNodes = [];
	this.allNodes.push(this.rootNode);

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

		if (data.children) {
			for (var i = 0; i < data.children.length; i++) {
				node.addChild(data.children[i], needEvent);
			}
		}

		this.measure();
		this.position();

		if (needEvent) {
			var event = {type: "add", node: node};
			this.mindmap.fire(event);
		}},

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

	position: function () {
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
					label: "Suzhou",
					children: [
						{
							label: "Taicang"
						},
						{
							label: "Wujiang"
						}
					]
				},
				{
					label: "Nantong",
					children: [
						{
							label: "Haian"
						}
					]
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