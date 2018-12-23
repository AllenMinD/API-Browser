<template>
  <div id="table-component">
    <!-- <div>{{callType}}</div> -->
    <!-- 各种操作按钮 -->
    <div id="menu-part">
      <el-button v-if="stack.length > 0" type="primary" plain size="small" @click="back">返回上一节点</el-button>
      <!-- <el-button v-if="currentNode" type="warning" plain size="small" @click="addRow">新增行</el-button>
      <el-button v-if="currentNode" type="warning" plain size="small" @click="addColumn">新增列</el-button>
      <el-button v-if="currentNode" type="success" plain size="small" @click="save">保存</el-button>
      <el-button v-if="currentNode" type="primary" plain size="small" @click="isSendBack = !isSendBack">发送数据</el-button>
      <el-button  v-if="currentNode && callType === 'testApi'" type="primary" plain size="small" @click="isSetShowProperties = !isSetShowProperties">设置显示字段</el-button>-->
      <el-button v-if="currentNode && !isFullPage" plain size="small" @click="fullPage(true)">全屏</el-button>
      <el-button v-if="currentNode && isFullPage" plain size="small" @click="fullPage(false)">退出全屏</el-button>
      <el-popover
        placement="right-start"
        title="说明"
        width="200"
        trigger="hover"
        content="点击按钮进行全屏显示或返回上一层"
      >
        <i slot="reference" class="el-icon-question" style="color: #409EFF; font-size: 1.5em;"></i>
      </el-popover>
    </div>

    <br>

    <!-- 发送请求的表单 -->
    <!-- <app-send-back-req :sendBackData="sendBackData" v-if="isSendBack"></app-send-back-req> -->
    <!-- 设置要显示那些字段 -->
    <!-- <app-show-properties-option :showProperties="api.showProperties" v-if="isSetShowProperties"></app-show-properties-option> -->
    <!-- <br> -->
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="currentNode">
      <!-- 如果检测到配置对象中（viewOptions）对应的有设置键的中文名的时候，就用中文名来显示 -->
      <el-breadcrumb-item
        v-for="(item, index) in nameStackForBread"
        :key="index"
      >{{ viewOptions[item] != null && viewOptions[item].cnName ? viewOptions[item].cnName : item }}</el-breadcrumb-item>
    </el-breadcrumb>

    <br>

    <!-- 表格 -->
    <div id="table-part" v-if="currentNode && currentNode.length !== 1">
      <table>
        <thead>
          <tr>
            <!-- 如果检测到配置对象中（viewOptions）对应的有设置键的中文名的时候，就用中文名来显示 -->
            <th
              :colspan="columns.length"
            >{{ viewOptions[currentNodeKey] != null && viewOptions[currentNodeKey].cnName ? viewOptions[currentNodeKey].cnName : currentNodeKey }}</th>
          </tr>
          <tr>
            <!-- <th v-if="columns && columns != []">操作</th> -->
            <th
              v-for="(column, index) in columns"
              :key="index"
              v-if="viewOptions[column] == null || viewOptions[column].isShow != 'false'"
            >{{ viewOptions[column] != null && viewOptions[column].cnName != undefined ? viewOptions[column].cnName : column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in currentNode" :key="index">
            <!-- <td>
              <el-button type="danger" plain size="small" @click="deleteRow(row)">删除</el-button>
            </td>-->
            <td
              v-for="(column, index2) in columns"
              :key="index2"
              v-if="viewOptions[column] == null || viewOptions[column].isShow != 'false'"
            >
              <!-- 用row[column]来获取单元格内容 -->
              <div
                v-if="typeof row[column] == 'object' && row[column] != null || Array.isArray(row[column])"
              >
                <el-button type="primary" plain size="small" @click="expand(row[column], column)">展开</el-button>
              </div>
              <div v-else @dblclick="edit(row, column)">{{ row[column]?row[column]:'null' }}</div>
            </td>
          </tr>
        </tbody>

        <tfoot></tfoot>
      </table>
    </div>

    <!-- 当表格只有一行时（currentNode.length ===1）用卡片列表的形式显示 -->
    <el-card class="box-card" v-if="currentNode && currentNode.length === 1">
      <div slot="header" class="clearfix">
        <!-- 如果检测到配置对象中（viewOptions）对应的有设置键的中文名的时候，就用中文名来显示 -->
        <span>{{ viewOptions[currentNodeKey] != null && viewOptions[currentNodeKey].cnName ? viewOptions[currentNodeKey].cnName : currentNodeKey }}</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <div
        class="card-style card-row"
        v-for="(column,index) in columns"
        :key="'card' + index"
        v-if="viewOptions[column] == null || viewOptions[column].isShow != 'false'"
      >
        <span
          class="card-key"
          v-if="viewOptions[column] != null && viewOptions[column].cnName != undefined"
        >{{ viewOptions[column].cnName }}:</span>
        <span class="card-key" v-else>{{ column }}:</span>
        <span
          v-if="typeof currentNode[0][column] == 'object' && currentNode[0][column] != null || Array.isArray(currentNode[0][column])"
        >
          <el-button
            type="primary"
            plain
            size="small"
            @click="expand(currentNode[0][column], column)"
          >展开</el-button>
        </span>
        <span
          class="card-value"
          v-else
          @dblclick="edit(currentNode[0], column)"
        >{{ currentNode[0][column]?currentNode[0][column]:'null' }}</span>
      </div>
    </el-card>

    <!-- 编辑单元格的dialog -->
    <!-- <el-dialog title="编辑单元格" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="当前单元格值" :label-width="formLabelWidth">
          <el-input v-model="form.cellValue" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="enterEdit(form.cellValue)">确 定</el-button>
      </div>
    </el-dialog>-->
    <!-- 编辑列名的dialog -->
    <!-- <el-dialog title="输入列名" :visible.sync="dialogFormVisible2">
      <el-form :model="form">
        <el-form-item label="当前单元格值" :label-width="formLabelWidth">
          <el-input v-model="form.columnName" auto-complete="off" placeholder="请输入列名"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="enterColumnName(form.columnName)">确 定</el-button>
      </div>
    </el-dialog>-->
    <!-- 显示保存后的json数据的dialog -->
    <!-- <el-dialog title="保存后的JSON数据" :visible.sync="jsonDataVisiable">
      <tree-view :data="sendBackData" :options="{maxDepth: 10}"></tree-view>
      <div slot="footer" class="dialog-footer">
        <el-button @click="jsonDataVisiable = false">取 消</el-button>
        <el-button type="primary" @click="jsonDataVisiable = false">确 定</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
// import SendBackReq from "./SendBackReq.vue";
// import ShowPropertiesOption from "./ShowPropertiesOption.vue";

export default {
  props: ["jsonData", "callType", "viewOptions"],
  // viewOptions: {
    // json数据的设置对象，用来设置json数据的键名的中文名和是否显示该键值对
    /*
      格式：
      keyName: {
        originKey: '原来键名'
        cnName: '中文名',
        isShow: 'true' | 'false' 这个键值对是否显示
      }
    */
  //},
  data: function() {
    console.log('传过来的viewOptions', this.viewOptions);
    return {
      currentNode: null, // 当前键值对的值
      currentNodeKey: "Root", // 当前键值对的键
      columns: null,
      stack: [], // 节点内容栈
      nameStack: [], // 节点键名栈（作为卡片的头部）
      nameStackForBread: ["Root"], // 节点键名栈 （作为面包屑）
      // dialogFormVisible: false,
      // dialogFormVisible2: false,
      // form: {
      //   cellValue: "",
      //   columnName: ""
      // },
      // formLabelWidth: "120px",
      // currentEditingCell: null,
      // currentEditingColumn: null,
      // sendBackData: null,
      // jsonDataVisiable: false,
      // isSendBack: false,
      // isSetShowProperties: false

      // allProperties: [],  // json对象中所有键名的集合
      // allPropertiesTrans: []  // json对象中所有键名的集合, allPropertiesTrans为真正要传到vuex的数组
    };
  },
  computed: {
    isFullPage: function() {
      return this.$store.getters.getIsFullPage;
    }
    // api: function() {
    //   var getApi = this.$store.getters.getApi;
    //   console.log('获取API', getApi);
    //   return getApi;
    // }
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
      // this.getAllProperties(val); // 递归获取数据的所有字段
      // console.log("这个对象的属性有：", this.allProperties);
      // this.$store.commit("setAllProperties", this.allPropertiesTrans);
    },
    currentNode: function(val) {
      // 获取表头(this.columns)
      var keys = [],
        key,
        i,
        len = val.length;
      for (i = 0; i < len; i++) {
        for (key in val[i]) {
          if (keys.indexOf(key) === -1) {
            keys.push(key);
          }
        }
      }
      this.columns = keys;
    }
  },
  methods: {
    /*
     * 获取json对象中的全部键名
     */
    // getAllProperties: function(data) {
    //   var type = "";
    //   var obj;
    //   if (Array.isArray(data)) {
    //     type = "array";
    //     obj = [];
    //   } else if (typeof data === "object") {
    //     type = "object";
    //     obj = {};
    //   } else {
    //     // 递归边界
    //     return;
    //   }

    //   if (type === "array") {
    //     for (var i = 0; i < data.length; i++) {
    //       this.getAllProperties(data[i]);
    //     }
    //   } else if (type === "object") {
    //     for (var key in data) {
    //       if (this.allProperties.indexOf(key) === -1) {
    //         this.allProperties.push(key);
    //         var newProp = {
    //           key: key,
    //           label: key,
    //           disabled: false
    //         };
    //         this.allPropertiesTrans.push(newProp); // this.allPropertiesTrans为真正要传到vuex的数组
    //         this.getAllProperties(data[key]);
    //       }
    //     }
    //   } else {
    //     return;
    //   }
    // },
    /*
     * 点击【扩展】按键
     */
    expand: function(expandData, keyName) {
      // 当前层入栈
      this.stack.push(this.currentNode);
      this.nameStack.push(this.currentNodeKey);

      // 转化成数组形式再赋值给this.currentNode
      var newArray = [];
      if (Array.isArray(expandData)) {
        newArray = expandData;
      } else {
        newArray.push(expandData);
      }

      this.currentNode = newArray; // 进入下一层节点
      this.currentNodeKey = keyName;

      this.nameStackForBread.push(this.currentNodeKey);
    },
    /*
     * 点击【返回上一层】按键
     */
    back: function() {
      this.currentNode = this.stack.pop(); // 出栈，回到上一层
      this.currentNodeKey = this.nameStack.pop();
      this.nameStackForBread.pop();
    },
    /*
     * 点击【全屏】按键
     */
    fullPage: function(bool) {
      this.$store.commit("setIsFullPage", bool);
    }

    // =================================编辑单元格逻辑（暂时没用）==================================
    // edit: function(obj, column) {
    //   // 这里的 data 实际上是 对象currentNode的其中一个属性值
    //   // console.log(obj);
    //   this.dialogFormVisible = true;
    //   this.form.cellValue = obj[column];
    //   this.currentEditingCell = obj; // this.currentEditingCell指向当前正被编辑的单元格(对象currentNode的其中一个属性)
    //   this.currentEditingColumn = column; // this.currentEditingColumn指向正在被编辑的列
    // },
    // enterEdit: function(data) {
    //   // 确认编辑，修改表格中单元格的值
    //   // this.currentEditingCell[this.currentEditingColumn]就是原对象某个属性值的一个引用
    //   // 所以改变this.currentEditingCell[this.currentEditingColumn]的值就是改变原对象的值
    //   this.currentEditingCell[this.currentEditingColumn] = data;
    //   this.dialogFormVisible = false;
    // },
    // addRow: function() {
    //   // 新增行
    //   var newObj = {};
    //   for (var i = 0, len = this.columns.length; i < len; i++) {
    //     newObj[this.columns[i]] = null;
    //   }
    //   this.currentNode.push(newObj);
    // },
    // addColumn: function() {
    //   // 新增列
    //   this.dialogFormVisible2 = true;
    // },
    // enterColumnName: function(data) {
    //   this.form.columnName = ""; // 清空表单
    //   this.columns.push(data);
    //   this.dialogFormVisible2 = false;
    // },
    // save: function() {
    //   if (this.stack[0] == undefined) {
    //     // 因为前面的代码是需要按了“扩展”按钮，this.stack[0]才有有值，所以在没按之前（就是第一层），直接就是this.currentNode
    //     console.log("更改后的对象为：", this.currentNode);
    //     this.sendBackData = this.currentNode;
    //   } else {
    //     // this.stack[0]就直接是更改过后的对象了
    //     console.log("更改后的对象为：", this.stack[0]);
    //     this.sendBackData = this.stack[0];
    //   }
    //   this.$message({
    //     message: "保存成功",
    //     type: "success"
    //   });
    //   this.jsonDataVisiable = true;
    // },
    // deleteRow: function(obj) {
    //   // 询问框
    //   this.$confirm("确认要删除该行吗?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       // 删除行
    //       this.currentNode.splice(this.currentNode.indexOf(obj), 1);
    //       // console.log("删除后，原对象变为：", this.stack[0]);
    //       this.$message({
    //         type: "success",
    //         message: "删除成功!"
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除"
    //       });
    //     });
    // },
    // =================================编辑单元格逻辑（暂时没用）END==================================
  },
  components: {
    // AppSendBackReq: SendBackReq,
    // AppShowPropertiesOption: ShowPropertiesOption
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
  border: 1px solid #dcdfe6;
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
  border: 1px solid #dcdfe6; /*表头内边框*/
  white-space: nowrap;
  overflow: hidden;
  line-height: 23px;
}

table tr td {
  min-width: 100px;
  box-sizing: border-box;
  padding: 12px 15px;
  vertical-align: middle;
  border: 1px solid #dcdfe6; /*非表头内边框*/
  /* white-space: nowrap; */
  line-height: 23px;
}

table tbody tr {
  background-color: #fff;
  transition: background-color 0.25s ease;
}

table tbody tr:hover {
  background-color: #f2f6fc;
}

.card-style {
  padding-top: 10px;
  padding-bottom: 10px;
}

.card-key {
  font-weight: bold;
  color: #409eff;
  padding-right: 30px;
}

.card-row {
  background-color: #fff;
  transition: background-color 0.5s;
}

.card-row:hover {
  background-color: #f2f6fc;
}
</style>