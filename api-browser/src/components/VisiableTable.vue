<template>
  <div id="table-component">
    <!-- 各种操作按钮 -->
    <div id="menu-part">
      <el-button v-if="stack.length > 0" type="primary" plain size="small" @click="back">返回上一节点</el-button>
      <el-button v-if="currentNode" type="warning" plain size="small" @click="addRow">新增行</el-button>
      <el-button v-if="currentNode" type="warning" plain size="small" @click="addColumn">新增列</el-button>
      <el-button v-if="currentNode" type="success" plain size="small" @click="save">保存</el-button>
      <el-button v-if="currentNode" type="primary" plain size="small" @click="isSendBack = !isSendBack">发送数据</el-button>
      <el-button v-if="currentNode && !isFullPage" plain size="small" @click="fullPage(true)">全屏</el-button>
      <el-button v-if="currentNode && isFullPage" plain size="small" @click="fullPage(false)">退出全屏</el-button>
      <el-popover
        placement="right-start"
        title="说明"
        width="200"
        trigger="hover"
        content="1. 双击单元格进行编辑；2. 先按保存按钮再发送请求。">
        <i slot="reference" class="el-icon-question" style="color: #409EFF; font-size: 1.5em;" ></i>
      </el-popover>
    </div>

    <br>

    <!-- 发送请求的表单 -->
    <app-send-back-req :sendBackData="sendBackData" v-if="isSendBack"></app-send-back-req>

    <br>

    <!-- 表格 -->
    <div id="table-part">
      <table>
        <thead>
          <tr>
            <th v-if="columns && columns != []">操作</th>
            <th v-for="(column, index) in columns" :key="index">
              {{ column }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, index) in currentNode" :key="index">
            <td>
              <el-button type="danger" plain size="small" @click="deleteRow(row)">删除</el-button>
            </td>
            <td v-for="column in columns">
              <!-- 用row[column]来获取单元格内容 -->
              <div v-if="typeof row[column] == 'object' && row[column] != null || Array.isArray(row[column])">
                <el-button type="primary" plain size="small" @click="expand(row[column])">展开</el-button>
              </div>
              <div v-else @dblclick="edit(row, column)">{{ row[column]?row[column]:'null' }}</div>
            </td>
          </tr>
        </tbody>

        <tfoot></tfoot>
      </table>
    </div>

    <!-- 编辑单元格的dialog -->
    <el-dialog title="编辑单元格" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="当前单元格值" :label-width="formLabelWidth">
          <el-input v-model="form.cellValue" auto-complete="off"></el-input>
        </el-form-item>
<!--         <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="enterEdit(form.cellValue)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑列名的dialog -->
    <el-dialog title="输入列名" :visible.sync="dialogFormVisible2">
      <el-form :model="form">
        <el-form-item label="当前单元格值" :label-width="formLabelWidth">
          <el-input v-model="form.columnName" auto-complete="off" placeholder="请输入列名"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="enterColumnName(form.columnName)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 显示保存后的json数据的dialog -->
    <el-dialog title="保存后的JSON数据" :visible.sync="jsonDataVisiable">
      <tree-view :data="sendBackData" :options="{maxDepth: 10}"></tree-view>
      <div slot="footer" class="dialog-footer">
        <el-button @click="jsonDataVisiable = false">取 消</el-button>
        <el-button type="primary" @click="jsonDataVisiable = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import SendBackReq from './SendBackReq.vue';

  export default {
    props: ['jsonData'],
    data: function() {
      return {
        currentNode: null,
        columns: null,
        renderData: null,
        stack: [],
        dialogFormVisible: false,
        dialogFormVisible2: false,
        form: {
          cellValue: '',
          columnName: ''
        },
        formLabelWidth: '120px',
        currentEditingCell: null,
        currentEditingColumn: null,
        sendBackData: null,
        jsonDataVisiable: false,
        isSendBack: false,
      };
    },
    computed: {
      isFullPage: function() {
        return this.$store.getters.getIsFullPage;
      }
    },
    watch: {
      jsonData: function(val) {
        // 转化成数组形式再赋值给this.currentNode
        var newArray = [];
        if (Array.isArray(val)) {
          newArray = val;
        } else {
          newArray.push(val);
        }
        this.currentNode = newArray;
      },
      currentNode: function(val) {
        // 获取表头(this.columns)
        var keys = [], key, i, len = val.length;
        for (i = 0; i < len; i++) {
          for (key in val[i]) {
            if (keys.indexOf(key) === -1) {
              keys.push(key);
            }
          }
        }
        this.columns = keys;
      },
    },
    methods: {
      expand: function(expandData) {
        // 当前层入栈
        this.stack.push(this.currentNode);

        // 转化成数组形式再赋值给this.currentNode
        var newArray = [];
        if (Array.isArray(expandData)) {
          newArray = expandData;
        } else {
          newArray.push(expandData);
        }
        
        this.currentNode = newArray;  // 进入下一层节点
        
      },
      back: function() {
        this.currentNode = this.stack.pop();  // 出栈，回到上一层
      },
      edit: function(obj, column) {
        // 这里的 data 实际上是 对象currentNode的其中一个属性值
        // console.log(obj);
        this.dialogFormVisible = true;
        this.form.cellValue = obj[column];
        this.currentEditingCell = obj;  // this.currentEditingCell指向当前正被编辑的单元格(对象currentNode的其中一个属性)
        this.currentEditingColumn = column;  // this.currentEditingColumn指向正在被编辑的列
      },
      enterEdit: function(data) {
        // 确认编辑，修改表格中单元格的值
        // this.currentEditingCell[this.currentEditingColumn]就是原对象某个属性值的一个引用
        // 所以改变this.currentEditingCell[this.currentEditingColumn]的值就是改变原对象的值
        this.currentEditingCell[this.currentEditingColumn] = data;
        this.dialogFormVisible = false;
      },
      addRow: function() {
        // 新增行
        var newObj = {};
        for (var i = 0, len = this.columns.length; i < len; i++) {
          newObj[this.columns[i]] = null;
        }
        this.currentNode.push(newObj);
      },
      addColumn: function() {
        // 新增列
        this.dialogFormVisible2 = true;
      },
      enterColumnName: function(data) {
        this.form.columnName = "";  // 清空表单
        this.columns.push(data);
        this.dialogFormVisible2 = false;
      },
      save: function() {
        if (this.stack[0] == undefined) {
          // 因为前面的代码是需要按了“扩展”按钮，this.stack[0]才有有值，所以在没按之前（就是第一层），直接就是this.currentNode
          console.log("更改后的对象为：", this.currentNode);
          this.sendBackData = this.currentNode;
        } else {
          // this.stack[0]就直接是更改过后的对象了
          console.log("更改后的对象为：", this.stack[0]);
          this.sendBackData = this.stack[0];
        }
        this.$message({
          message: '保存成功',
          type: 'success'
        });
        this.jsonDataVisiable = true;
      },
      deleteRow: function(obj) {
        // 询问框
        this.$confirm('确认要删除该行吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除行
          this.currentNode.splice(this.currentNode.indexOf(obj), 1);
          // console.log("删除后，原对象变为：", this.stack[0]);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      fullPage: function(bool) {
        this.$store.commit('setIsFullPage', bool);
      },
    },
    components: {
      AppSendBackReq: SendBackReq
    }
  };
</script>

<style scoped>
  #table-component {
    width: 100%;
    min-height: 100px;
  }

  #table-part {
    width: 100%;
    overflow: auto;
  }

  table {
    width: 100%;
    /* height: 300px; */
    border: 1px solid #DCDFE6;
    text-align: center;
    border-collapse: collapse;
    /* border-spacing: 10px; */
    caption-side: bottom;
    empty-cells: hide;
    table-layout: auto;
  }

  table thead {
    color: #909399;
    font-size: 15px;
  }

  table tbody {
    color: #606266;
    font-size: 14px;
  }

  table tr th {
    box-sizing: border-box;
    padding: 12px 15px;
    vertical-align: middle;
    border: 1px solid #DCDFE6;/*表头内边框*/
    white-space: nowrap;
    overflow: hidden;
    line-height: 23px;
  }

  table tr td {
    box-sizing: border-box;
    padding: 12px 15px;
    vertical-align: middle;
    border: 1px solid #DCDFE6;/*非表头内边框*/
    /* white-space: nowrap; */
    line-height: 23px;
  }

  table tbody tr {
    background-color: #fff;
    transition: background-color .25s ease
  }

  table tbody tr:hover {
    background-color: #F2F6FC;
  }

</style>