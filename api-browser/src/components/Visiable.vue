<template>
  <div>
    <div v-if="columnsChange && columns != [] && arrayData != []">
      <div>
        <span>当前节点：</span>
        <el-button type="primary" plain size="small" @click="backToLastNode" v-if="stack.length > 0">返回上一节点</el-button>
      </div>
      <br>
      <el-table :data="arrayData" border style="width: 100%">
        <el-table-column 
          v-for="(column, index) in columns"
          :key="index"
          align="center"
          :label="column">
          <template slot-scope="scope">
            <!-- <div>{{ column }}</div> -->
            <div v-if="scope.row[column] != null && typeof scope.row[column] == 'object' || Array.isArray(scope.row[column])">
              <el-button type="primary" plain size="small" @click="expandData(scope.row[column])">展开</el-button>
            </div>
            <div v-else>{{ scope.row[column] }}</div>
          </template>        
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['jsonData'],
    data: function() {
      return {
        arrayData: null,
        columns: null,
        columnsChange: false,
        currentNode: null,
        lastNode: null,
        jsonDataCopy: null,
        stack: [],
        tData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          ffff: 'fa'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          expand1: [{
            date: '2016-014123',
            name: '张三',
            address: '上海市普陀区金沙江路 1518 弄',
            ffff: 'bbb'
          }, {
            expand2: [{
              date: '0',
              name: 'mmm',
              address: '上海市普陀区金沙江路 1518 弄',
              ffff: 'bbb'
            }, {
              date: '1',
              name: 'aaa',
              address: '上海市普陀区金沙江路 1517 弄'
            }, {
              date: '2',
              name: 'll',
              address: '上海市普陀区金沙江路 1519 弄'
            }, {
              date: '3',
              name: 'test',
              address: 'dzhi 1516 弄'
            }],
            date: '201612321304',
            name: '张三',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '20112321301',
            name: '张三sansan',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-1232133',
            name: '张三',
            address: '上海市普陀区金沙江路 1516 弄',
          }]
        }]
      }
    },
    watch: {
      jsonData: function(val) {
        this.jsonDataCopy = val;
      },

      jsonDataCopy: function(val) {
        var data = [],
            keys = [],
            tempColumns = [];

        this.columns = [];
        this.arrayData = [];

        // 把返回的数据变成对象数组
        if (Array.isArray(val)) {
          data = val;
        } else {
          data.push(val);
        }

        // 获得columns表头
        for (var i = 0, len1 = data.length; i < len1; i++) {
          for (var key in data[i]) {
            if (keys.indexOf(key) == -1) {
              keys.push(key);
            }
          }
        }

        // var newField = {};
        // for (var i = 0, len2 = keys.length; i < len2; i++) {
        //   newField = {
        //     field: keys[i],
        //     title: keys[i],
        //     width: 100, 
        //     titleAlign: 'center',
        //     columnAlign:'center'
        //   };
        //   tempColumns.push(newField);
        // }

        this.columns = keys;
        // this.columns = tempColumns;
        console.log("this.columns: ", this.columns);

        // el-table渲染的数据
        this.arrayData = data;
        console.log("当前arrayData：", this.arrayData);

        this.columnsChange = true;
      }
    },

    methods: {
      expandData: function(data) {
        this.stack.push(this.jsonDataCopy); // 把当前层的对象入栈
        this.jsonDataCopy = data;  // 赋值下一层对象
        this.columnsChange = false;
      },
      backToLastNode: function() {
        this.jsonDataCopy = this.stack.pop();  // 出栈，回到上一层
        this.columnsChange = false;
      }
    }
  }
</script>

<style scoped>

</style>