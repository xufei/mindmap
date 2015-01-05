angular.module("ng-charts").factory("Chart", [function () {
    function Chart() {
        this.offsetLeft = 50;
        this.offsetTop = 50;

        this.width = 500;
        this.height = 400;

        this.data = [];
        this.numbers = [];

        this.oom = 1;
        this.stepLength = 1;

        this.clear();
    }

    Chart.prototype = {
        clear: function () {
            this.xAxis = [];
            this.yAxis = [];

            this.xAxisPath = "";
            this.yAxisPath = "";
        },
        scale: function () {
            this.clear();

            // 先取用对数取最大最小数据的数量级，如果大于1，就使用非线性坐标轴，如果小于等于1，就用线性坐标轴
            var max = Math.max.apply(null, this.numbers);
            var min = Math.min.apply(null, this.numbers);

            if (max === min) {
                if (min === 0) {
                    max = 1;
                } else if (min < 0) {
                    max = 0;
                } else {
                    min = 0;
                }
            }

            // 不管哪种坐标轴，都需要在最大最小值的基础上找等分点
            var range = max - min;
            this.oom = Math.floor(Math.log(range) / Math.LN10);
            var step = Math.pow(10, this.oom);

            if (this.oom > 2) {
                min = Math.pow(10, Math.floor(Math.log(min) / Math.LN10));
                max = Math.pow(10, Math.ceil(Math.log(max) / Math.LN10));

                for (var i = min; i <= max; i *= 10) {
                    this.yAxis.push({
                        number: i
                    });
                }
            }
            else {
                min = 0;
                max = max + step;

                for (var i = min; i < max; i += step) {
                    this.yAxis.push({
                        number: i
                    });
                }
            }

            if (this.oom > 2) {
                this.stepLength = this.height / (Math.log(this.yAxis[this.yAxis.length - 1].number) * Math.LOG10E);
            }
            else {
                this.stepLength = this.height / this.yAxis[this.yAxis.length - 1].number;
            }
        },
        cartesian: function () {
            this.scale();

            // 横向的刻度线
            for (var i = 0; i < this.yAxis.length; i++) {
                var y;

                if (this.oom > 2) {
                    y = Math.log(this.yAxis[i].number) * Math.LOG10E * this.stepLength;
                }
                else {
                    y = this.yAxis[i].number * this.stepLength;
                }

                this.yAxis[i].y = y;
                this.yAxis[i].path = "M0," + y + " L500," + y;
            }

            // 数据
            for (var i = 0; i < this.numbers.length; i++) {
                var x = i * 50;
                var height;

                if (this.oom > 2) {
                    height = Math.log(this.numbers[i]) * Math.LOG10E * this.stepLength;
                }
                else {
                    height = this.numbers[i] * this.stepLength;
                }

                this.xAxis.push({
                    number: this.numbers[i],
                    x: x,
                    height: height
                });
                this.xAxis[i].path = "M" + x + ",0 L" + x + ", 0";
            }

            this.xAxisPath = "M" + this.offsetLeft + ",0 L" + (this.offsetLeft + this.width) + ",0";
        },
        radar: function () {
            this.scale();

            // 坐标刻度线
            var pathArr;
            for (var i = 0; i < this.yAxis.length; i++) {
                pathArr = [];
                var r;

                if (this.oom > 2) {
                    r = Math.log(this.yAxis[i].number) * Math.LOG10E * this.stepLength / 2;
                }
                else {
                    r = this.yAxis[i].number * this.stepLength / 2;
                }

                this.yAxis[i].y = y;

                var total = this.numbers.length;

                for (var j = 0; j < this.numbers.length; j++) {
                    var x = this.offsetLeft + Math.round(Math.cos((j / total) * (2 * Math.PI)) * r) + this.width / 2;
                    var y = this.offsetTop + Math.round(Math.sin((j / total) * (2 * Math.PI)) * r) + this.height / 2;

                    pathArr.push(x + " " + y + " ");
                }

                pathArr[pathArr.length] = pathArr[0];
                this.yAxis[i].path = "M" + pathArr.join("L ");
            }

            // 射线
            var center = (this.offsetLeft + this.width / 2) + " " + (this.offsetTop + this.height / 2);
            var numArr = [];

            var total = this.numbers.length;
            for (var i = 0; i < this.numbers.length; i++) {
                var outer = this.yAxis[this.yAxis.length - 1];
                this.xAxis[i] = {
                    path:"M" + center + " L" + pathArr[i]
                };

                var r;

                if (this.oom > 2) {
                    r = Math.log(this.numbers[i]) * Math.LOG10E * this.stepLength / 2;
                }
                else {
                    r = this.numbers[i] * this.stepLength / 2;
                }

                console.log(Math.round(Math.cos((i / total) * (2 * Math.PI)) * r));
                console.log(Math.round(Math.sin((i / total) * (2 * Math.PI)) * r));

                var x = this.offsetLeft + Math.round(Math.cos((i / total) * (2 * Math.PI)) * r) + this.width / 2;
                var y = this.offsetTop + Math.round(Math.sin((i / total) * (2 * Math.PI)) * r) + this.height / 2;

                numArr.push(x + " " + y + " ");
            }
            numArr[numArr.length] = numArr[0];

            this.dataPath = "M" + numArr.join("L ");
            console.log(this.dataPath);
        }
    };

    return Chart;
}]);