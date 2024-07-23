<template>
  <div :class="[$style.root]"
      :style="getStyle()"
      :selected="parentVM.selectable ? (parentVM.multiple ? currentSelected : isSelected) : false"
      :readonly="parentVM.readonly" :readonly-mode="parentVM.readonlyMode"
      :disabled="disabled || parentVM.disabled"
      @click="onTap"
      v-ellipsis-title="ellipsisTitle"
      :designer="$env.VUE_APP_DESIGNER"
      vusion-slot-name="item">
      <div class="list-view-item">
        <div v-if="parentVM.selectable" :class="$style.icon">
          <iconv
            v-if="parentVM.selectedIcon && (parentVM.multiple ? currentSelected : isSelected)"
            :name="parentVM.selectedIcon"
            icotype="only" />
          <iconv
            v-else-if="parentVM.unselectedIcon"
            :name="parentVM.unselectedIcon"
            icotype="only" />
        </div>

        <slot>{{ text }}</slot>
      </div>
  </div>
</template>

<script>
import UListViewItem from 'cloud-ui.vusion/src/components/u-list-view.vue/item.vue';
import Iconv from '../../../src/iconv';
import { isFunction } from '../../../src/utils';

export default {
    name: 'van-list-view-item',
    parentName: 'van-list-view',
    groupName: 'van-list-view-group',
    components: {
      Iconv
    },
    extends: UListViewItem,
    props: {
      setRowStyle: { type: Function },
      item: { tyepe: Object },
      index: { type: Number },
      value: { type: String }
    },
    methods: {
      onTap(e) {
        if (this.parentVM && this.parentVM.selectable) {
          this.select(e)
        }
      },
      getStyle() {
        return isFunction(this.setRowStyle) ? this.setRowStyle({ item: this.item, index: this.index, value: this.value }) : {};
      },
      setCellColor() {
        const styles = this.getStyle();
        if(styles) {
          const cellNode = this.$el.querySelector('.van-cell')
          if (cellNode)
            cellNode.style.color = styles['color']
        }
      }
    },
    updated() {
      this.setCellColor()
    },
}
</script>

<style module>
/* @import 'cloud-ui.vusion/src/components/u-list-view.vue/item.css'; */

.root {
  position: relative;
}

.root:hover {
    /* background: none; */
}

.root .icon {
  position: absolute;
  z-index: 9;
  top: 50%;
  transform: translateY(-50%);
  right: 20px;
}
</style>
