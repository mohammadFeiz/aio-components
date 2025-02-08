import React, { Component } from 'react';
import DOC from '../../resuse-components/Doc/index.tsx';
import Floater from './../../npm/aio-floater/aio-floater';
export default class DOC_AIOFloater extends Component {
  render() {
    return (
      <DOC
        {...this.props}
        items={[
          { text: 'Basic', value: 'example', render: () => <Example /> },
          { text: 'relations', value: 'example2', render: () => <Example2 /> },
          { text: 'group', value: 'example3', render: () => <Example3 /> },
          { text: 'snap', value: 'example4', render: () => <Example4 /> }
        ]}
      />
    )
  }
}


class Example extends Component {
  state = {
    screen: [0, 0], zoom: 1,
    items: [
      { template: 'box', id: '1', text: 'this is my text 1 and will show in Floater', left: 100, top: 100, title: 'title1' },
      { template: 'box', id: '2', text: 'text2', left: 100, top: 300, title: 'title2' },
      { template: 'box', id: '3', text: 'text3', left: 360, top: 200, title: 'title3' }
    ]
  }
  render() {
    let { items } = this.state;
    return (
      <Floater
        templates={{
          box: (item) => {
            let { items } = this.state;
            let { text, id, title } = item;
            return (
              <Box text={text} title={title} onRemove={() => this.setState({ items: items.filter((o) => o.id !== id) })} />
            )
          }
        }}
        items={items}
        moveHandleClassName='handle'
      />
    )
  }
}

class Example2 extends Component {
  state = {
    screen: [0, 0], zoom: 1,
    items: [
      { template: 'box', id: '1', text: 'this is my text 1 and will show in Floater', left: 100, top: 100, title: 'title1' },
      { template: 'box', id: '2', text: 'text2', left: 100, top: 300, title: 'title2' },
      { template: 'box', id: '3', text: 'text3', left: 360, top: 200, title: 'title3', relations: [{ to: '1', text: 'rel1' }, { to: '2', text: 'rel2' }] }
    ]
  }
  render() {
    let { items } = this.state;
    return (
      <Floater
        templates={{
          box: (item) => {
            let { items } = this.state;
            let { text, id, title } = item;
            return (
              <Box text={text} title={title} onRemove={() => this.setState({ items: items.filter((o) => o.id !== id) })} />
            )
          }
        }}
        items={items}
        moveHandleClassName='handle'
      />
    )
  }
}
class Example3 extends Component {
  state = {
    screen: [0, 0], zoom: 1,
    items: [
      { template: 'box', id: '1', text: 'this is my text 1 and will show in Floater', left: 100, top: 100, title: 'title1', group: '1' },
      { template: 'box', id: '2', text: 'text2', left: 100, top: 300, title: 'title2', group: '1' },
      { template: 'box', id: '3', text: 'text3', left: 360, top: 200, title: 'title3', relations: [{ to: '1', text: 'rel1' }, { to: '2', text: 'rel2' }], group: '1' }
    ]
  }
  render() {
    let { items } = this.state;
    return (
      <Floater
        templates={{
          box: (item) => {
            let { items } = this.state;
            let { text, id, title } = item;
            return (
              <Box text={text} title={title} onRemove={() => this.setState({ items: items.filter((o) => o.id !== id) })} />
            )
          }
        }}
        items={items}
        moveHandleClassName='handle'
      />
    )
  }
}

class Example4 extends Component {
  state = {
    screen: [0, 0], zoom: 1,
    items: [
      { template: 'box', id: '1', text: 'this is my text 1 and will show in Floater', left: 100, top: 100, title: 'title1' },
      { template: 'box', id: '2', text: 'text2', left: 100, top: 300, title: 'title2' },
      { template: 'box', id: '3', text: 'text3', left: 360, top: 200, title: 'title3' }
    ]
  }
  render() {
    let { items } = this.state;
    return (
      <Floater
        templates={{
          box: (item) => {
            let { items } = this.state;
            let { text, id, title } = item;
            return (
              <Box text={text} title={title} onRemove={() => this.setState({ items: items.filter((o) => o.id !== id) })} />
            )
          }
        }}
        snap={[90, 90, '#ddd']}
        items={items}
        moveHandleClassName='handle'
      />
    )
  }
}


class Box extends Component {
  render() {
    let { text, onRemove, title = 'title' } = this.props;
    return (
      <div
        className='handle'
        style={{
          userSelect: 'none',
          background: '#fff',
          border: '1px solid #ddd',
          width: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className='flex-row-' style={{ width: '100%', background: 'dodgerblue', color: '#fff' }}>
          <div className='w-12-'></div>
          <div className='flex-1-'>{title}</div>
          <div className='w-24- align-vh-' onClick={() => onRemove()}>X</div>
        </div>
        <div style={{ width: '100%', padding: 12 }}>{text}</div>
      </div>
    )
  }
}