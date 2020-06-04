<template>
    <div
        class="drawing-board-box"
        :class="{'set-box-height':beStudentLiveViewports}"
    >
        画板
    </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  props: {
    beStudentLiveViewports: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  watch: {},
  methods: {},
  created() {}
};
</script>
<style lang='less' scoped>
.drawing-board-box {
  background-color: rgb(211, 211, 211);
  height: 100%;
}
.set-box-height{
    height: calc(100% - 160px);
}
</style>