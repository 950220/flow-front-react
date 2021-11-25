import React, { Component } from 'react';

import { Topology } from '@topology/core';
import { Node } from '@topology/core/src/models/node';
import { Line } from '@topology/core/src/models/line';

import styles from './index.module.less';

export interface CanvasContextMenuProps {
  data: {
    node?: Node,
    line?: Line,
    multi?: boolean,
    nodes?: Node[],
    locked?: boolean
  };
  canvas: Topology;
}

const CanvasContextMenu: React.FC<CanvasContextMenuProps> = (props: CanvasContextMenuProps) => {
  const onTop = () => {
    if (props.data.node) {
      props.canvas.top(props.data.node)
    }

    if (props.data.nodes) {
      for (const item of props.data.nodes) {
        props.canvas.top(item)
      }
    }

    props.canvas.render()
  }

  const onBottom = () => {
    if (props.data.node) {
      props.canvas.bottom(props.data.node)
    }

    if (props.data.nodes) {
      for (const item of props.data.nodes) {
        props.canvas.bottom(item)
      }
    }

    props.canvas.render()
  }

  const onCombine = (stand: boolean) => {
    if (!props.data.nodes) {
      return
    }
    props.canvas.combine(props.data.nodes, stand)
    props.canvas.render()
  }

  const onUncombine = () => {
    if (!props.data.node) {
      return
    }
    props.canvas.uncombine(props.data.node)
    props.canvas.render()
  }

  const onLock = () => {
    props.data.locked = !props.data.locked
    if (props.data.node) {
      props.data.node.locked = props.data.locked as any
    }
    if (props.data.nodes) {
      for (const item of props.data.nodes) {
        item.locked = props.data.locked as any
      }
    }
    props.canvas.render(true)
  }

  return (
    <div className={styles.menus}>
      <div>
        <a className={(props.data.node || props.data.nodes) ? '' : styles.disabled} onClick={onTop}>置顶</a>
      </div>
      <div>
        <a className={(props.data.node || props.data.nodes) ? '' : styles.disabled} onClick={onBottom}>置底</a>
      </div>
      <div className={styles.line} />
      {
        props.data.nodes ? (
          <div>
            <a onClick={() => { onCombine(false) }}>组合</a>
            <div>
              <a onClick={() => { onCombine(true) }}>包含</a>
            </div>
          </div>
        ) : null
      }
      {
        props.data.node && props.data.node.name === 'combine' ? (
          <div >
            <a onClick={onUncombine}>取消组合/包含</a>
          </div>
        ) : null

      }
      <div>
        <a
          className={(props.data.node || props.data.nodes) ? '' : styles.disabled}
          onClick={onLock}
        >{props.data.locked ? '解锁' : '锁定'}</a>
      </div>
    </div >
  );
}

export default CanvasContextMenu
