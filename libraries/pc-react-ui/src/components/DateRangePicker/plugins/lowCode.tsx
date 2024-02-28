import React from 'react';
import _ from 'lodash';
import { useControllableValue } from 'ahooks';
import { $deletePropsList } from '@/plugins/constants';

export function useHandleNodePath(props) {
  // const children = props.get('children');
  const id = _.uniqueId('contact_');
  const deletePropsList = props.get($deletePropsList).concat('data-nodepath');
  const nodePath = props.get('data-nodepath');
  React.useEffect(() => {
    const mytab = document.querySelector(`[data-node-id=${id}]`);
    const pickerElement = mytab?.parentNode?.parentNode as Element;
    pickerElement?.setAttribute('data-nodepath', nodePath);
  }, []);
  return {
    'data-node-id': id,
    [$deletePropsList]: deletePropsList,
  };
}

export function useHandleOpenRef(props) {
  const openProps = props.get('open');
  const defaultOpen = props.get('defaultOpen');
  const onOpenChangeProps = props.get('onOpenChange');
  const ref = props.get('ref');
  const deletePropsList = props.get($deletePropsList, []).concat(['ref', 'defaultOpen']);
  const modalRef = React.useRef();
  const [open, setOpen] = useControllableValue(_.filterUnderfinedValue({
    value: openProps,
    defaultValue: defaultOpen,
    onChange: onOpenChangeProps,
  }));
  React.useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    visible: !!open,
  }), [modalRef]);
  return {
    [$deletePropsList]: deletePropsList,
    open,
    onOpenChange: _.wrap(onOpenChangeProps, (fn, visible) => {
      setOpen(visible);
      _.attempt(onOpenChangeProps, visible);
    }),
  };
}
