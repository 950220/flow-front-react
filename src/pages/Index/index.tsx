import React, { useState, useEffect } from 'react'
import { Button } from 'antd';
import styles from './index.module.less';
import { Tools } from '../../utils/tools';
import CanvasContextMenu from './canvasContextMenu';
import CanvasProps from './canvasProps';

// 先导入库
import { Topology, Options, registerNode } from '@topology/core'
import { register as registerFlow } from '@topology/flow-diagram'
import { register as registerActivity } from '@topology/activity-diagram'
import { register as registerClass } from '@topology/class-diagram'
import { register as registerSequence } from '@topology/sequence-diagram'
import { register as registerChart } from '@topology/chart-diagram'

export default function Index() {
  let canvas: Topology | null = null;
  let canvasOptions: Options = {}
  const [iconfont, setIconfont] = useState({ fontSize: '24px' })
  const [contextmenu, setContextmenu] = useState({
    position: 'fixed',
    zIndex: '10',
    display: 'none',
    left: '',
    top: '',
    bottom: ''
  })

  const [selected, setSelected] = useState({
    node: null,
    line: null,
    multi: false,
    nodes: null,
    locked: false
  })

  useEffect(() => {
    canvasRegister()
    canvasOptions.on = onMessage
    canvas = new Topology('workspace', canvasOptions)
  }, [])

  const canvasRegister = () => {
    registerFlow()
    registerActivity()
    registerClass()
    registerSequence()
    registerChart()
  }

  const onMessage = (event: string, data: any) => {
    switch (event) {
      case 'node':
      case 'addNode':
        setSelected({
          node: data,
          line: null,
          multi: false,
          nodes: null,
          locked: data.locked
        })
        break;
      case 'line':
      case 'addLine':
        setSelected({
          node: null,
          line: data,
          multi: false,
          nodes: null,
          locked: data.locked
        })
        break;
      case 'multi':
        setSelected({
          node: null,
          line: null,
          multi: true,
          nodes: data.nodes.length > 1 ? data.nodes : null,
          locked: getLocked(data)
        })
        break;
      case 'space':
        setSelected({
          node: null,
          line: null,
          multi: false,
          nodes: null,
          locked: false
        })
        break;
      case 'moveOut':

        break;
      case 'moveNodes':
      case 'resizeNodes':
        if (data.length > 1) {
          setSelected({
            node: null,
            line: null,
            multi: true,
            nodes: data,
            locked: getLocked({ nodes: data })
          })
        } else {
          setSelected({
            node: data[0],
            line: null,
            multi: false,
            nodes: null,
            locked: false
          })
        }
        break;
      case 'resize':
      case 'scale':
      case 'locked':
        // if (canvas) {
        //   this.props.dispatch({
        //     type: 'canvas/update',
        //     payload: {
        //       data: this.canvas.data
        //     }
        //   });
        // }
        break;
    }
  }

  const onDrag = (event: React.DragEvent<HTMLAnchorElement>, node: any) => {
    event.dataTransfer.setData('Text', JSON.stringify(node.data))
  }

  const hanleContextMenu = (event: any) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.clientY + 360 < document.body.clientHeight) {
      setContextmenu({
        position: 'fixed',
        zIndex: '10',
        display: 'block',
        left: event.clientX + 'px',
        top: event.clientY + 'px',
        bottom: ''
      });
    } else {
      setContextmenu({
        position: 'fixed',
        zIndex: '10',
        display: 'block',
        left: event.clientX + 'px',
        top: '',
        bottom: document.body.clientHeight - event.clientY + 'px'
      });
    }
  }

  const handlePropsChange = (changedValues: any) => {
    if (changedValues.node) {
      // 遍历查找修改的属性，赋值给原始Node
      const temp = selected.node
      for (const key in changedValues.node) {
        if (Array.isArray(changedValues.node[key])) {
        } else if (typeof changedValues.node[key] === 'object') {
          for (const k in changedValues.node[key]) {
            temp[key][k] = changedValues.node[key][k];
          }
        } else {
          temp[key] = changedValues.node[key];
        }
      }
      setSelected({
        ...selected,
        node: temp
      })
      // 通知属性更新，刷新
      canvas?.updateProps(temp);
    }
  }

  const getLocked = (data: any) => {
    let locked = true
    if (data.nodes && data.nodes.length) {
      for (const item of data.nodes) {
        if (!item.locked) {
          locked = false
          break
        }
      }
    }
    if (locked && data.lines) {
      for (const item of data.lines) {
        if (!item.locked) {
          locked = false
          break
        }
      }
    }

    return locked
  }

  return(
    <div className={styles.page}>
      <div className={styles.tools}>
        {
          Tools.map((item, index) => {
            return (
              <div key={index}>
                <div className={styles.title}>{item.group}</div>
                <div className={styles.buttons}>
                  {
                    item.children.map((btn: any, i: number) => {
                      return (
                        <a key={i} title={btn.name} draggable={true} onDragStart={(ev) => { onDrag(ev, btn) }}>
                          <i className={'iconfont ' + btn.icon} style={iconfont} />
                        </a>
                      )
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
      <div id="workspace" className={styles.full} onContextMenu={hanleContextMenu} />
      <div className={styles.props}>
        <CanvasProps data={selected} onValuesChange={handlePropsChange} />
      </div>
      {
        canvas&&
        <div style={contextmenu}>
          <CanvasContextMenu data={selected} canvas={canvas} />
        </div>
      }
    </div>
  )
}
