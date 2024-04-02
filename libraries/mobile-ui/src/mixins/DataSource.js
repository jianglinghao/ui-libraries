// 这个mixin主要给带分页筛选的数据源组件使用

import _debounce from 'lodash/debounce';
import DataSource from '../utils/DataSource';

export default {
  props: {
    // 数据源
    dataSource: [Function, Array],
    // 初始加载
    initialLoad: { type: Boolean, default: true },
    // 值字段
    valueField: { type: String, default: 'value' },
    // 文本字段
    textField: { type: String, default: 'text' },
    // 描述字段
    descriptionField: { type: String, default: 'description' },

    // 分页相关
    // pageable: { type: [Boolean, String], default: false }, // 由组件自己定义
    pageSize: { type: Number, default: 50 },
    pageNumber: { type: Number, default: 1 },

    // 筛选相关
    // filterable: { type: Boolean, default: false }, // 由组件自己定义
    matchMethod: { type: [String, Function], default: 'includes' },
    caseSensitive: { type: Boolean, default: false },

    // 排序相关
    // sorting: Object, // 由组件自己定义 { field: '', order: 'asc' | 'desc', compare: (a, b) => a - b}

    // 树形组件相关
    // treeDisplay: { type: Boolean, default: false }, // 由组件自己定义
    parentField: { type: String, default: 'parentId' },
    childrenField: { type: String, default: 'children' },

    // 其他
    // needAllRemoteData: { type: Boolean, default: false }, // 由组件自己定义
  },
  data() {
    return {
      currentLoading: false,
      currentError: false,

      currentDataSource: undefined,
      filterText: '', // 过滤文本，只有 input 时会改变它
      currentSorting: this.sorting, // 内部操作后的排序
    };
  },
  computed: {
    currentData() {
      return this.currentDataSource && this.currentDataSource.viewData;
    },
    allRemoteData() {
      if (this.currentDataSource?.remote) {
        return this.currentDataSource?.allData || this.currentDataSource?.data || [];
      }

      return this.currentDataSource?.data || [];
    },
    paging() {
      if (this.pageable) {
        const paging = {};
        paging.size = this.pageSize === '' ? 50 : this.pageSize;
        paging.number = paging.number || 1;

        return paging;
      }

      return undefined;
    },
    filtering() {
      return {
        [this.textField]: {
          operator: this.matchMethod,
          value: this.filterText,
          caseInsensitive: !this.caseSensitive,
        },
      };
    },
  },
  watch: {
    dataSource(dataSource, old) {
      if (
        typeof dataSource === 'function' &&
        String(dataSource) === String(old)
      )
        return;

      this.handleData();
    },
    sorting: {
      deep: true,
      handler(sorting, oldSorting) {
        if (
          sorting.field === oldSorting.field &&
          sorting.order === oldSorting.order
        )
          return;

        this.sort(sorting.field, sorting.order, sorting.compare);
      },
    },
    filtering: {
      deep: true,
      handler(filtering) {
        this.filter(filtering);
      },
    },
    'currentDataSource.sorting': function (sorting) {
      this.currentSorting = sorting;
    },
  },
  created() {
    this.debouncedLoad = _debounce(this.load, 300);
    this.currentDataSource = this.normalizeDataSource(this.dataSource);

    // 初始加载开启时
    if (this.currentDataSource && this.initialLoad) {
      if (this.pageNumber && this.pageable) {
        this.page(this.pageNumber);
      } else {
        this.load();
      }
    }
  },
  methods: {
    // 包装fetch函数
    fetch(params) {
      if (typeof this.dataSource === 'function') {
        const result = this.dataSource(params);
        if (result instanceof Promise) {
          return result;
        }
        return Promise.resolve(result);
      } else if (Array.isArray(this.dataSource)) {
        const data = this.getPartialData(this.dataSource, params);
        return Promise.resolve(data);
      }
    },
    getPartialData(data, params) {
      const { page, size, sort, order, filterText } = params;
      let result = data;
      // 排序
      const compare = (a, b, sign) => {
        if (a === b) return 0;
        return a > b ? sign : -sign;
      };
      result = result.sort((a, b) => compare(a[sort], b[sort], order === 'asc' ? 1 : -1));
      // 过滤
      const filter = {
        [this.textField]: {
          operator: this.matchMethod,
          value: this.filterText,
          caseInsensitive: !this.caseSensitive,
        }
      };
      result = result.filter((item) => solveCondition(filter, item));
      // 分页

    },


    handleData() {
      this.currentDataSource = this.normalizeDataSource(this.dataSource);

      if (this.currentDataSource && this.initialLoad) {
        if (this.$env && this.$env.VUE_APP_DESIGNER) return;

        this.load();
      }
    },
    getExtraParams() {
      return { filterText: this.filterText };
    },
    getDataSourceOptions() {
      const options = {
        viewMode: this.viewMode || 'more', // 'more' | 'page'
        paging: this.paging,
        filtering: this.filtering,
        sorting: this.currentSorting,

        needAllData: this.needAllRemoteData,

        getExtraParams: this.getExtraParams,
      };

      if (
        this.treeDisplay &&
        this.valueField &&
        this.parentField &&
        this.childrenField
      ) {
        options.treeDisplay = {
          valueField: this.valueField,
          parentField: this.parentField,
          childrenField: this.childrenField,
        };

        // 启用树形时不分页
        options.paging = undefined;
      }

      return options;
    },
    normalizeDataSource(dataSource) {
      const options = this.getDataSourceOptions();
      if (dataSource instanceof DataSource) return dataSource;
      // 数组
      if (dataSource instanceof Array) {
        options.data = Array.from(dataSource);

        return new DataSource(options);
      }
      if (dataSource instanceof Function) {
        // 构造load函数
        options.load = function load(params) {
          const result = dataSource(params);
          if (result instanceof Promise)
            return result.catch(() => (this.currentLoading = false));

          return Promise.resolve(result);
        };

        return new DataSource(options);
      }
      if (dataSource instanceof Object) {
        if (dataSource.hasOwnProperty('list') && Array.isArray(dataSource.list))
          return new DataSource(
            Object.assign(options, dataSource, {
              data: dataSource.list,
            })
          );
        return new DataSource(Object.assign(options, dataSource));
      }
      return undefined;
    },
    load(more) {
      const dataSource = this.currentDataSource;
      if (!dataSource) return Promise.reject();

      // TODO 加载前

      this.currentLoading = true;
      this.currentError = false;

      return dataSource[more ? 'loadMore' : 'load']()
        .then((data) => {
          this.currentLoading = false;
          this.$emit('load', undefined, this);
          return data;
        })
        .catch((e) => {
          console.log('DataSource加载数据失败:', e);
          this.currentLoading = false;
          this.currentError = true;
        });
    },
    reload() {
      this.currentDataSource.clearLocalData();
      this.load();
    },
    page(number, size = this.currentDataSource.paging.size) {
      const paging = {
        size,
        oldSize: this.currentDataSource.paging.size,
        number,
        oldNumber: this.currentDataSource.paging.number,
      };
      this.currentDataSource.page(paging);
      this.load();
    },
    sort(field, order, compare) {
      const sorting = { field, order, compare };

      this.currentDataSource.sort(sorting);
      this.load();

      this.$emit('update:sorting', sorting, this);
    },
    filter(filtering) {
      const mergedFiltering =
        (this.currentDataSource && this.currentDataSource.filtering) || {};

      Object.assign(mergedFiltering, filtering);

      this.currentDataSource.filter(mergedFiltering);
      this.load();
    },
  },
};


function isOperator(value) {
  const operators = ['=', '==', 'eq', '!=', 'neq', '<', 'lt', '<=', 'lte', '>', 'gt', '>=', 'gte', 'includes', 'startsWith', 'endsWith'];
  return typeof value === 'function' || operators.includes(value);
}

function solveCondition(condition, obj) {
  if (Array.isArray(condition)) return condition.some((cond) => solveCondition(cond, obj));
  if (typeof condition === 'object') {
    return Object.keys(condition).every((key) => {
      let expression = condition[key];
      if (expression === undefined) return true;
      if (typeof expression !== 'object') expression = ['=', expression];
      if (Array.isArray(expression)) {
        if (!isOperator(expression[0])) {
          // 多选项过滤，暂时简单处理
          const sourceValue = getType(obj) === 'String' ? obj : _get(obj, key);
          const targetValue = expression;
          return targetValue.includes(sourceValue);
        }
        expression = {
          operator: expression[0],
          value: expression[1],
        };
      }

      let sourceValue = getType(obj) === 'String' ? obj : _get(obj, key);
      let targetValue = expression.value;
      if (expression.caseInsensitive) {
        sourceValue = typeof sourceValue === 'string' ? sourceValue.toLowerCase() : sourceValue;
        targetValue = typeof targetValue === 'string' ? targetValue.toLowerCase() : targetValue;
      }

      if (typeof expression.operator === 'function') return expression.operator(sourceValue, targetValue, expression);
      if (expression.operator === '=' || expression.operator === '==' || expression.operator === 'eq') return sourceValue === targetValue;
      if (expression.operator === '!=' || expression.operator === 'neq') return sourceValue !== targetValue;
      if (expression.operator === '<' || expression.operator === 'lt') return sourceValue < targetValue;
      if (expression.operator === '<=' || expression.operator === 'lte') return sourceValue <= targetValue;
      if (expression.operator === '>' || expression.operator === 'gt') return sourceValue > targetValue;
      if (expression.operator === '>=' || expression.operator === 'gte') return sourceValue >= targetValue;
      if (expression.operator === 'includes') return String(sourceValue).includes(targetValue);
      if (expression.operator === 'startsWith') return String(sourceValue).startsWith(targetValue);
      if (expression.operator === 'endsWith') return String(sourceValue).endsWith(targetValue);
      throw new TypeError('Unknown operator in conditions!');
    });
  }
  throw new TypeError('Condition must be a Object or Array!');
}
