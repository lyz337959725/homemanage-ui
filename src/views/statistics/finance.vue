
<template>
  <el-card>
    <el-alert
      v-show="!book"
      title="关于财务统计的说明"
      type="warning"
      center
      description="查看各种统计，请先选择账簿！"
      show-icon
    ></el-alert>
        <el-select v-model="book" size="small" @change="handleBookChange">
            <el-option
            v-for="item in bookList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
            placeholder="请选择账簿"
            ></el-option>
        </el-select>
    <el-row>
      <el-col :span="18">
        <div id="monthChart"></div>
      </el-col>
      <el-col :span="6" v-show="book">
        <el-table :data="monthTableData" border style="width: 100%" size="mini">
          <el-table-column prop="months" label="月份"></el-table-column>
          <el-table-column prop="spendAmount" label="支出（元）"></el-table-column>
          <el-table-column prop="incomeAmount" label="收入（元）"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row v-show="book">
      <el-col :span="18">
          <el-radio-group v-model="pieType" size="small" fill="#F56C6C" @change="handlepieTypeChange">
            <el-radio-button :label="0">支出类别</el-radio-button>
            <el-radio-button :label="1">收入类别</el-radio-button>
            <el-radio-button :label="2">所属人支出</el-radio-button>
          </el-radio-group>
        <div id="typeChart"></div>
      </el-col>
      <el-col :span="6">
        <el-table :data="typeData" border style="width: 100%" size="mini">
          <el-table-column prop="name" label="类别名称"></el-table-column>
          <el-table-column prop="value" label="金额"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "hello",
  data() {
    return {
      book: "",
      bookList: [],
      months: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月"
      ],
      spendData: [],
      incomeData: [],
      monthTableData: [
        { months: "1月", spendAmount: 0, incomeAmount: 0 },
        { months: "2月", spendAmount: 0, incomeAmount: 0 },
        { months: "3月", spendAmount: 0, incomeAmount: 0 },
        { months: "4月", spendAmount: 0, incomeAmount: 0 },
        { months: "5月", spendAmount: 0, incomeAmount: 0 },
        { months: "6月", spendAmount: 0, incomeAmount: 0 },
        { months: "7月", spendAmount: 0, incomeAmount: 0 },
        { months: "8月", spendAmount: 0, incomeAmount: 0 },
        { months: "9月", spendAmount: 0, incomeAmount: 0 },
        { months: "10月", spendAmount: 0, incomeAmount: 0 },
        { months: "11月", spendAmount: 0, incomeAmount: 0 },
        { months: "12月", spendAmount: 0, incomeAmount: 0 }
      ],
      titles:["按支出类别（大类）展示","按收入类别（大类）展示","按所属人支出展示"],
      legendData:[],
      pieType:0,
      typeData:[]
    };
  },
  created() {
    this.$axios.get("/bill/book").then(respose => {
      if (respose.data.success) {
        this.bookList = respose.data.data;
      }
    });
  },
  methods: {
    drawMonthLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("monthChart"));
      // 绘制图表
      myChart.setOption(
        {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999"
              }
            }
          },
          //   toolbox: {
          //     feature: {
          //       magicType: { show: true, type: ["line", "bar"] }
          //     }
          //   },
          legend: {
            data: ["收入", "支出"]
          },
          xAxis: [
            {
              type: "category",
              data: this.months,
              axisPointer: {
                type: "shadow"
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "金额（元）"
            }
          ],
          series: [
            {
              name: "收入",
              type: "bar",
              itemStyle: {
                color: "#67C23A"
              },
              data: this.incomeData
            },
            {
              name: "支出",
              type: "bar",
              itemStyle: {
                color: "#F56C6C"
              },
              data: this.spendData
            }
          ]
        },
        true
      );
    },
    drawTypeLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("typeChart"));
      // 绘制图表
      myChart.setOption(
        {
        title: {
            text: this.titles[this.pieType],
            x: 'center'
        },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            left: "10%",
            top:'middle',
            data: this.legendData
          },
          series: [
            {
              name: "访问来源",
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: this.typeData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        },
        true
      );
      myChart.on('click', function (params) {
         window.console.log(params);
      });
    },
    handleBookChange(bookId) {
        this.book = bookId
        this.pieType = 0
        this.$axios.all([
            this.$axios.get(`/statistics/finace/month/${bookId}`),
            this.$axios.get(`/statistics/finace/type/${bookId}/${this.pieType}`)
        ]).then(this.$axios.spread((monthResp, typeResp) => {
            if (monthResp.data.data.length > 0) {
                let spends = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let incomes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (let m of monthResp.data.data) {
                    let index = parseInt(m.months) - 1;
                    spends[index] = m.spendAmount;
                    incomes[index] = m.incomeAmount;
                    this.monthTableData[index].spendAmount = m.spendAmount;
                    this.monthTableData[index].incomeAmount = m.incomeAmount;
                }
                this.spendData = spends;
                this.incomeData = incomes;
            }
            if(typeResp.data.data.length > 0){
                this.typeData = typeResp.data.data
                let titles = []
                for(let t of this.typeData){
                    titles.push(t.name)
                }
                this.legendData = titles
            }
            this.$nextTick(this.drawMonthLine(), this.drawTypeLine());
        }));
    },
    handlepieTypeChange(pie){
        switch(pie){
            case 0:case 1:
                this.$axios.get(`/statistics/finace/type/${this.book}/${pie}`).then((response => {
                    if(response.data.success && response.data.data){
                        let titles = []
                        for(let t of response.data.data){
                            titles.push(t.name)
                        }
                        this.legendData = titles
                    }else{
                        this.legendData = []
                    }
                    this.typeData = response.data.data
                    this.drawTypeLine()
                }))
                break;
            case 2:
                this.$axios.get(`/statistics/finace/person/${this.book}`).then((response => {
                    if(response.data.success && response.data.data){
                        let titles = []
                        for(let t of response.data.data){
                            titles.push(t.name)
                        }
                        this.legendData = titles
                    }else{
                        this.legendData = []
                    }
                    this.typeData = response.data.data
                    this.drawTypeLine()
                }))
                break;
        }
    }
  }
};
</script>

<style lang='less' scoped>
.el-card {
  position: relative;
  height: calc(100vh - 105px);
  overflow: auto;
}
#monthChart {
  width: 100%;
  height: 450px;
}
#typeChart {
  width: 100%;
  height: 450px;
}
.el-select{
    text-align: center
}
</style>
