<script>
import UListViewItem from 'cloud-ui.vusion/src/components/u-list-view.vue/item.vue';
import { isFunction } from '../../../src/utils';

export default {
    name: 'van-grid-view-item',
    parentName: 'van-grid-view',
    groupName: 'van-grid-view-group',
    extends: UListViewItem,
    props: {
      setRowStyle: { type: Function },
      item: { tyepe: Object },
      index: { type: Number },
      value: { type: String }
    },
    methods: {
      getStyle() {
        return isFunction(this.setRowStyle) ? this.setRowStyle({ item: this.item, index: this.index, value: this.value }) : {};
      },
      setCellAndCardBgColor() {
        const styles = this.getStyle();
        if (styles) {
          const cellNode = this.$el.querySelector('.van-cell')
          const carduNode = this.$el.querySelector('.van-cardu__wrap')
          if (cellNode) {
            cellNode.style.backgroundColor = styles.backgroundColor
            cellNode.style.color = styles.color
          }
          if (carduNode) {
            carduNode.style.backgroundColor = styles.backgroundColor
            carduNode.style.color = styles.color
          }
        }
      }
    },
    updated() {
      this.setCellAndCardBgColor()
    }
}
</script>

<style module>
/* @import 'cloud-ui.vusion/src/components/u-list-view.vue/item.css'; */

.root:hover {
    background: none;;
}
</style>
