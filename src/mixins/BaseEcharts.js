import echarts from 'echarts/dist/echarts.min'
export default {
  data() {
    return {
      options: {
        legend: {
          type: 'plain',
          show: true,
          orient: 'horizontal',
          selectedMode: false,
          icon: 'circle',
          bottom: 0,
          left: 'center',
          data: []
        },
        color: ['#fd634e', '#ffa133', '#2bcf88', '#00a0e9'],
        grid: {
          top: 10,
          left: 10,
          right: 10,
          bottom: 10
        }
      },
      lineOptions: {
        type: 'line',
        smooth: true, //是否平滑曲线
        symbol: 'emptyCircle',
        symbolSize: 10,
        itemStyle: {
          normal: {
            color: '#51CBCD'
          }
        },
        lineStyle: {
          // color: '#51CBCD',
          normal: {
            color: '#51CBCD'
          }
        },
        color: ['#51CBCD', '#fd634e', '#ffa133', '#00a0e9'],
        grid: {
          top: 20,
          left: 50,
          right: 50,
          bottom: 50
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#76DAD830' },
              { offset: 0.5, color: '#51CBCD' },
              { offset: 1, color: '#51CBCD' }
            ])
          }
        },
        data: [],
        xAxis: {
          type: 'category',
          data: [],
          axisLabel: {
            textStyle: {
              color: '#A8A8A8',
              fontSize: 10
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#e8e8e8']
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e8e8e8'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#A8A8A8',
              fontSize: 10
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e8e8e8'
            }
          },
          splitLine: {
            show: true,

            lineStyle: {
              color: ['#e8e8e8']
            }
          }
        },
        series: []
      },
      barOtions: {
        type: 'bar',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#76DAD830' },
              { offset: 0.5, color: '#51CBCD' },
              { offset: 1, color: '#51CBCD' }
            ])
          }
        },
        grid: {
          top: 20,
          left: 50,
          right: 50,
          bottom: 20
        },
        label: {
          nromal: {
            show: true,
            position: 'top'
          }
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            textStyle: {
              color: '#A8A8A8',
              fontSize: 10
            }
          },
          splitLine: {
            show: true,

            lineStyle: {
              color: ['#e8e8e8']
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e8e8e8'
            }
          },
          data: []
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#A8A8A8',
              fontSize: 10
            }
          },
          splitLine: {
            show: true,

            lineStyle: {
              color: ['#e8e8e8']
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e8e8e8'
            }
          }
        },
        series: []
      },
      pieSeries: {
        type: 'pie',
        // radius: ['20%', '60%'],
        radius: [20, 80],
        center: ['50%', '50%'],
        roseType: 'radius',
        color: ['#3FB1E3', '#FFCC01', '#ffa133', '#00a0e9'],
        label: {
          formatter: params => {
            return `${params.percent}% (${params.value}次) \r\n ${params.name}`
          }
        },
        data: []
      }
    }
  }
}
