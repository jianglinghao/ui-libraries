import {
  filterProperty,
  firstLowerCase,
  getFirstDisplayedProperty,
  genUniqueQueryNameGroup,
  getEntityPromaryKeyProperty,
} from './utils';
import { genQueryLogic, genTextTemplate, genColumnMeta } from './genCommonBlock';

function genTableColumnTemplate(property, nameGroup) {
  const { lowerEntityName, title } = genColumnMeta(property, nameGroup);
  return `<UTableViewColumn
    field="${lowerEntityName}.${property.name}"
    slotTitle={
        <UText text="${title}"></UText>
    }
    slotCell={
        (current) => <ULinearLayout gap="small">
            ${genTextTemplate(property, nameGroup)}
        </ULinearLayout>
    }
    slotExpander={
        (current) => <UTableViewExpander
            item={current.item}>
        </UTableViewExpander>
    }>
  </UTableViewColumn>`;
}

export function genTableTemplate(entity, nameGroup, options = {
  hasFileter: false,
}) {
  const namespace = entity.getNamespace();
  const entityName = entity.name;
  const currentName = nameGroup.currentName || 'current';
  const properties = entity.properties.filter(filterProperty('inTable'));
  const dataSourceValue = `app.logics.${nameGroup.logic}(elements.$ce.page, elements.$ce.size, elements.$ce.sort, elements.$ce.order${options.hasFileter ? `,${nameGroup.viewVariableFilter}` : ''})`;
  return `<UTableView
        ref="${nameGroup.viewElementMainView}"
        dataSource={${dataSourceValue}}
        valueField="${firstLowerCase(entity.name)}.${getEntityPromaryKeyProperty(entity)}"
        pagination={true}
        showSizer={true}
        pageSize={20}
        pageNumber={1}>
            <UTableViewColumn
                type="index"
                width={60}
                slotTitle={
                    <UText text="序号"></UText>
                }
                slotExpander={
                    (current) => <UTableViewExpander
                        item={current.item}>
                    </UTableViewExpander>
                }>
            </UTableViewColumn>
            ${properties.map((property) => `${genTableColumnTemplate(property, nameGroup)}`).join('\n')}
            <UTableViewColumn
                slotTitle={
                    <UText text="操作"></UText>
                }
                slotCell={
                    (current) => <ULinearLayout gap="small">
                        <ULink
                            text="修改"
                            ${options.modifyable ? `onClick={
                                function ${nameGroup.viewLogicModify}(event) {
                                    ${nameGroup.viewVariableIsUpdate} = true
                                    ${nameGroup.viewVariableInput} = nasl.util.Clone(${currentName}.item.${firstLowerCase(entity.name)})
                                    $refs.${nameGroup.viewElementSaveModal}.open()
                                }
                            }` : ''}>
                        </ULink>
                        <ULink
                            text="删除"
                            onClick={
                                function ${nameGroup.viewLogicRemove}(event) {
                                    ${namespace}.${entityName}Entity.delete(${currentName}.item.${firstLowerCase(entity.name)}.${getEntityPromaryKeyProperty(entity)})
                                    $refs.${nameGroup.viewElementMainView}.reload()
                                }
                            }>
                        </ULink>
                    </ULinearLayout>
                }
                slotExpander={
                    (current) => <UTableViewExpander
                        item={current.item}>
                    </UTableViewExpander>
                }>
            </UTableViewColumn>
    </UTableView>`;
}

export function genTableBlock(entity, refElement) {
  const likeComponent = refElement?.likeComponent;
  const dataSource = entity.parentNode;
  const module = dataSource.app;

  // 生成唯一name
  // 加到页面上的params、variables、logics等都需要唯一name
  // 页面上有ref引用的element也需要唯一name
  const viewElementMainView = likeComponent.getViewElementUniqueName('tableView');
  const nameGroup = genUniqueQueryNameGroup(module, likeComponent, viewElementMainView);
  nameGroup.viewElementMainView = viewElementMainView;
  nameGroup.viewVariableEntity = likeComponent.getVariableUniqueName(firstLowerCase(entity.name));
  nameGroup.viewLogicRemove = likeComponent.getLogicUniqueName('remove');
  // 当前节点的currentName
  nameGroup.currentName = refElement.getCurrentName();

  // 收集所有和本实体关联的实体
  const entitySet = new Set();
  entitySet.add(entity);
  entity.properties.forEach((property) => {
    if (property.relationEntity) {
      // 有外键关联
      const relationEntity = dataSource?.findEntityByName(property.relationEntity);
      if (relationEntity) {
        const displayedProperty = getFirstDisplayedProperty(relationEntity);
        if (displayedProperty) entitySet.add(relationEntity);
      }
    }
  });
  const allEntities = [...entitySet];

  return `export function view() {
      return ${genTableTemplate(entity, nameGroup)}
    }
    export namespace app.logics {
        ${genQueryLogic(allEntities, nameGroup, true, true, refElement.parentNode)}
    }`;
}
