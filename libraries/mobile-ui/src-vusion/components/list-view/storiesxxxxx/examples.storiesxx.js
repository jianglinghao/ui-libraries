import Vue from 'vue';
import '__demo-entry__';
import Component from '../index';
import ExamplesDemo1 from '../demos/examples/ExamplesDemo1.vue';
// import ExamplesDemo2 from '../demos/examples/ExamplesDemo2.vue';
// import ExamplesDemo3 from '../demos/examples/ExamplesDemo3.vue';
// import ExamplesDemo4 from '../demos/examples/ExamplesDemo4.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Example/list-view/examples',
  component: Component,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export const Demo0 = {
  render: () => ({
    components: {
      DeprecatedDemo: ExamplesDemo1,
    },
    template: '<deprecated-demo />',
  }),
};

// export const Demo1 = {
//   render: () => ({
//     components: {
//       DeprecatedDemo: ExamplesDemo2,
//     },
//     template: '<deprecated-demo />',
//   }),
// };

// export const Demo2 = {
//   render: () => ({
//     components: {
//       DeprecatedDemo: ExamplesDemo3,
//     },
//     template: '<deprecated-demo />',
//   }),
// };

// export const Demo3 = {
//   render: () => ({
//     components: {
//       DeprecatedDemo: ExamplesDemo4,
//     },
//     template: '<deprecated-demo />',
//   }),
// };
