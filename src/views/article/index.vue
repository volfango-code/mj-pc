<template>
   <div class="article-page">
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>面经后台</el-breadcrumb-item>
      <el-breadcrumb-item>面经管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card shadow="never" border="false">
      <template #header>
        <div class="header">
          <span>共 300 条记录</span>
          <el-button
            @click="openDrawer('add')"
            icon="el-icon-plus"
            size="small"
            type="primary"
            round>
            添加面经
          </el-button>
        </div>
      </template>
      <!-- 表格 -->
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="stem" label="标题" width="400"></el-table-column>
        <el-table-column prop="creator" label="作者"></el-table-column>
        <el-table-column prop="likeCount" label="点赞"></el-table-column>
        <el-table-column prop="views" label="浏览数"></el-table-column>
        <el-table-column prop="createdAt" label="更新时间" width="200"></el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="120px">
          <template #default="{ row }">
            <div class="actions">
              <i class="el-icon-view" @click="openDrawer('view',row.id)"></i>
              <i class="el-icon-edit-outline" @click="openDrawer('edit',row.id)"></i>
              <i class="el-icon-delete" @click="del(row.id)"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 抽屉 -->
    <el-drawer
    :visible.sync="drawer"
    :before-close="handleClose"
    :title="drawerTitle"
    size="50%"
    >
      <!-- 预览 -->
      <div v-if="drawerType === 'view'" class="article-preview">
        <h5>{{ form.stem }}</h5>
        <div v-html="form.content"></div>
      </div>
      <!-- 添加表单 -->
      <el-form v-else ref="form" label-width="80px" :rules="rules" :model="form">
        <el-form-item label="标题" prop="stem">
          <el-input v-model="form.stem" placeholder="输入面经标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <quillEditor v-model="form.content" @blur="$refs.form.validateField('content')"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认</el-button>
          <el-button @click="drawer = false">取消</el-button>
        </el-form-item>
      </el-form>

    </el-drawer>
   </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import { getArticles, createArticle, deleteArticle, articleDetail, updateArticle } from '@/api/article'

export default {
  name: 'ArticleIndex',
  data () {
    return {
      // 页码
      current: 1,
      // 每页几条数据
      pageSize: 10,
      // 存储分页数据
      list: [],
      // 数据总条数
      total: 0,
      // 控制抽屉显示隐藏
      drawer: false,
      // 操作类型决定抽屉标题
      drawerType: '',
      // 表单
      form: {
        stem: '',
        content: ''
      },
      rules: {
        stem: [{ required: true, message: '请输入面经标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入面经内容', trigger: 'blur' }]
      },
      count: 233
    }
  },
  methods: {
    // 数据初始化
    async initData () {
      try {
        const res = await getArticles({
          current: this.current,
          pageSize: this.pageSize
        })
        this.list = res.data.rows
        this.total = res.data.total
      } catch (e) {
        console.log(e)
      }
    },
    // 添加
    async onSubmit () {
      // const jay = [
      //   { stem: '当古文明只剩下难解的预言,传说就成了永垂不朽的诗篇', content: '我给你的爱写在西元前 深埋在美索不达米亚平原 几十个世纪后出土发现 泥板上的字迹依然清晰可见 我给你的爱写在西元前 深埋在美索不达米亚平原 用楔形文字刻下了永远 那已风化千年的誓言 一切又重演 祭祀神殿征战 弓箭是谁的从前 喜欢在人潮中' },
      //   { stem: '开着车漫无目的的转弯,不知要去哪个地方', content: '闹区的电视墙  到底有谁在看  白杨木 影子被拉长  像我对你的思念走不完  原来我从未习惯  你已不在我身旁' },
      //   { stem: '会不会有人可以明白, 我会发着呆然后忘记你', content: '接着紧紧闭上眼  想着那一天会有人代替  让我不再想念你  我会发着呆然后微微笑  接着紧紧闭上眼  又想了一遍你温柔的脸  在我忘记之前心里的眼泪  模糊了视线你已快看不见' },
      //   { stem: '当而我已经分不清, 你是友情, 还是错过的爱情', content: '一起长大的约定  那样清晰 打过勾的我相信  说好要一起旅行  是你如今 唯一坚持的任性  在走廊上罚站打手心  我们却注意窗边的蜻蜓  我去到哪里你都跟很紧  很多的梦在等待着进行' },
      //   { stem: '爱太累爱得不自由, 因为我给不起最简单的承诺', content: '你停止收讯号 我开始搜寻不到  到底有谁知道 是几点钟方向  你才会收到暗号  我害怕你心碎没人帮你擦眼泪  别管那是非 只要我们感觉对  我害怕你心碎没人帮你擦眼泪  别离开身边  拥有你我的世界才能完美' },
      //   { stem: '说了再见 才发现再也见不到, 我不能就这样失去你的微笑', content: '口红待在桌角 而你我找不到  若角色对调你说好不好  说了再见 才发现再也见不到  能不能就这样忍着痛泪不掉  说好陪我到老 永恒往哪里找  再次拥抱一分一秒都好  天凉了 雨下了 你走了  清楚了 我爱的 遗失了' },
      //   { stem: '整颗心悬在半空, 我只能够,远远看着,这些我都做得到', content: '但那个人已经不是我  没有你在我有多难熬  没有你在我有多难熬多烦恼  没有你烦我有多烦恼  没有你烦我有多烦恼多难熬' },
      //   { stem: '海岸线 在起雾, 似乎是离别适合的季节', content: '雾散后 只看见  长发的你出现在岸边  为了爱  忘了危险  美人鱼的眼泪  是一个连伤心都透明的世界' },
      //   { stem: '不要你离开, 回忆划不开, 欠你的宠爱', content: '我在等待重来  天空仍灿烂  它爱着大海  情歌被打败  爱已不存在  你喜欢 站在那窗台  你好久 都没再来  彩色的时间染上空白  是你流的泪晕开' },
      //   { stem: '原来诗跟离别, 可以没有结尾, 没有结尾', content: '我落泪 情绪零碎  你的世界 一幕幕纷飞  门外的蔷薇 带刺伤人的很直接  过去被翻阅 结局满天的风雪  我不想再写 随手撕下这一页' }
      // ]

      // for (let i = 0; i < jay.length; i++) {
      //   try {
      //     this.count++
      //     jay[i].stem += ` ${this.count}`
      //     jay[i].content += ` ${this.count}`
      //     await createArticle(jay[i])
      //     console.log('ok')
      //   } catch (e) {
      //     this.$message.success(e)
      //   }
      // }

      this.$refs.form.validate(async valid => {
        // 表单校验
        if (valid) {
          // 添加操作
          if (this.drawerType === 'add') {
            // 发送添加请求
            try {
              await createArticle(this.form)
              // 添加成功
              this.$message.success('添加成功')
            } catch (e) {
              console.log(e)
            }
          } else {
            // 修改操作
            try {
              await updateArticle(this.form)
              this.$message.success('修改成功')
            } catch (e) {
              console.log(e)
            }
          }
          // 无论是添加还是修改都需要重新发送请求获取最新数据
          this.current = 1
          this.initData()
          this.handleClose()
        }
      })
    },
    // 删除
    async del (id) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteArticle(id)
        // 删除成功
        this.$message.success('删除成功')
        // 刷新页面
        this.current = 1
        this.initData()
      }).catch((e) => {
        console.log(e)
      })
    },
    // 分页
    // 修改每页多少条
    handleSizeChange (val) {
      this.pageSize = val
      this.current = 1
      this.initData()
    },
    // 修改页码
    handleCurrentChange (val) {
      this.current = val
      this.initData()
    },
    // 隐藏抽屉
    handleClose () {
      this.drawer = false
      // 抽屉隐藏时重置表单
      this.$refs.form?.resetFields()
      this.form = {
        stem: '',
        content: ''
      }
    },
    async openDrawer (type, id) {
      // 显示抽屉
      this.drawer = true
      // 操作类型决定标题
      this.drawerType = type
      // 修改和预览都需要数据回填，添加不用
      if (type !== 'add') {
        try {
          const res = await articleDetail(id)
          this.form.stem = res.data.stem
          this.form.content = res.data.content
          this.form.id = res.data.id // 加入id，一会更新用
        } catch (e) {
          console.log(e)
        }
      }
    }
  },
  computed: {
    drawerTitle () {
      let title = '标题'
      if (this.drawerType === 'add') title = '添加面经'
      if (this.drawerType === 'view') title = '面经预览'
      if (this.drawerType === 'edit') title = '修改面经'
      return title
    }
  },
  components: {
    quillEditor
  },
  created () {
    this.initData()
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 25px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 16px;
  }
  .actions {
    font-size: 18px;
    display: flex;
    justify-content: space-around;
    color: #666;
    > i:hover {
      color: rgba(114, 124, 245, 1);
      cursor: pointer;
    }
  }
}
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
.el-breadcrumb {
  margin-top: 10px;
}
.el-form {
  padding-right: 40px;
}
.quill-editor {
  ::v-deep .ql-editor {
    height: 300px;
  }
}
.el-rate {
  padding: 10px 0;
}
.article-preview {
  padding: 0 40px 40px 40px;
  > h5 {
    font-size: 20px;
    color: #666;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 30px;
    margin: 0 0 20px 0;
  }
}
</style>
