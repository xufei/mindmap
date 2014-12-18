angular.module("ng-charts").factory("Chart", [function () {

    function Chart() {
        this.offsetLeft = 50;
        this.offsetTop = 50;

        this.xAxis = [];
        this.yAxis = [];
        
        this.xAxisPath = "";
        this.yAxisPath = "";

        this.data = [];
        this.numbers = [];
        this.factors = [];

        this.baseX = 0;
        this.baseY = 0;
    }

    Chart.prototype = {
        scale: function () {
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
            var oom = Math.floor(Math.log(range) / Math.LN10);
            var step = Math.pow(10, oom);
            var numOfSteps = Math.round(range / step);

            if (oom > 2) {
                min = Math.pow(10, Math.floor(Math.log(min) / Math.LN10));
                max = Math.pow(10, Math.ceil(Math.log(max) / Math.LN10));

                for (var i=min; i<=max; i*=10) {
                    this.yAxis.push({
                        number: i
                    });
                }

                for (var i=0; i<this.numbers.length; i++) {
                    this.factors[i] = Math.log(this.numbers[i]) / Math.LN10;
                }
            }
            else {
                min = 0;
                max = max+step;

                for (var i=min; i<max; i+=step) {
                    this.yAxis.push({
                        number: i
                    });
                }

                for (var i=0; i<this.numbers.length; i++) {
                    this.factors[i] = 1;
                }
            }

            for (var i=0; i<this.yAxis.length; i++) {
                var y = 500 - (this.offsetTop + this.yAxis[i].number * 50);
                this.yAxis[i].y = y;
                this.yAxis[i].path = "M" + this.offsetLeft + "," + y + " L" + (this.offsetLeft + 500) + "," + y;
            }

            console.log(this.yAxis);

            this.baseY = this.yAxis[0].y;
            
            for (var i=0; i<this.data.length; i++) {
                var x = this.offsetLeft + i * 50;
                this.xAxis.push({
                    number: this.numbers[i],
                    x: x
                });
                this.xAxis[i].path = "M" + x + "," + this.baseY + " L" + x + "," + (this.baseY - 10);
            }
            
            this.xAxisPath = "M" + this.offsetLeft + "," + this.baseY + " L" + (this.offsetLeft + 500) + "," + this.baseY;
        }
    };

    return Chart;
}]);