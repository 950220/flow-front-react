import React, { useState, useEffect } from 'react';
import { Form, InputNumber } from 'antd';

import { Node } from '@topology/core/src/models/node';
import { Line } from '@topology/core/src/models/line';

import styles from './index.module.less';

export interface CanvasPropsProps {
  data: {
    node?: Node,
    line?: Line,
    multi?: boolean,
    nodes?: Node[],
    locked?: boolean
  };
  onValuesChange: (changedValues: any) => void;
}

const CanvasProps: React.FC<CanvasPropsProps> = (props: CanvasPropsProps) => {
  const [node, setNode] = useState(props.data.node)
  const [line, setLine] = useState(props.data.line)
  const [multi, setMulti] = useState(props.data.multi)

  useEffect(() => {
    if (node !== props.data.node || line !== props.data.line || multi !== props.data.multi) {
      setNode(props.data.node)
      setLine(props.data.line)
      setMulti(props.data.multi)
    }
  })

  const onValuesChange = (prop: string, value: any) => {
    console.log(value)
    if (props.onValuesChange) {
      const tmp = {
        ...node,
        rect: {
          ...node?.rect,
          [prop]: value
        }
      }
      console.log(tmp)
      setNode(tmp as Node)
      props.onValuesChange({
        ...props.data,
        ...tmp,
      });
    }
  }

  return (
    <div>
      {
        node&&<Form>
        <div className={styles.title}>位置和大小</div>
        <div className={styles.items}>
          <div className="flex grid">
            <div>X（px）</div>
            <div>Y（px）</div>
          </div>
          <div className="flex grid mt5">
            <div className="mr5">
              <Form.Item className={styles.formItem}>
                <InputNumber 
                  defaultValue={node.rect.x}
                  onChange={(value: string | number) => onValuesChange('x', value)}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item className={styles.formItem}>
                <InputNumber
                  defaultValue={node.rect.y}
                  onChange={(value: string | number) => onValuesChange('y', value)}
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex grid">
            <div>宽（px）</div>
            <div>高（px）</div>
          </div>
          <div className="flex grid mt5">
            <div className="mr5">
              <Form.Item className={styles.formItem}>
                <InputNumber
                  defaultValue={node.rect.width}
                  onChange={(value: string| number) => onValuesChange('width', value)}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item className={styles.formItem}>
                <InputNumber
                  defaultValue={node.rect.height}
                  onChange={(value: string | number) => onValuesChange('height', value)}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
      }
      {
        line&&
        <div className={styles.title}>line</div>
      }
      {
        multi&&
        <div className={styles.title}>multi</div>
      }
    </div>
  )
}

export default CanvasProps
