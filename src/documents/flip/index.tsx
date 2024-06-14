import React from "react";

import Tick from "@pqina/flip";
import "@pqina/flip/dist/flip.min.css";
import './index.css';
type I_Flip = {value:string | number,double?:boolean,fontSize?:number}
export default class Flip extends React.Component<I_Flip> {
  ref:React.RefObject<any>;
  inst:any;
  constructor(props:I_Flip) {
    super(props);
    this.ref = React.createRef();
  }
  getValue(){
    let value = this.props.value
    if(this.props.double){
      let str = '';
      try {str = value.toString()} catch{}
      if(str.length === 0){str = '00'}
      else if (str.length === 1){str = '0' + str}
      value = str
    }
    return value
  }
  componentDidMount() {
    this.inst = Tick.DOM.create(this.ref.current, {
      value: this.getValue()
    });
  }

  componentDidUpdate() {
    if (!this.inst) return;
    this.inst.value = this.getValue();
  }

  componentWillUnmount() {
    if (!this.inst) return;
    Tick.DOM.destroy(this.ref.current);
  }

  render() {
    let {fontSize = 24} = this.props;
    return (
      <div ref={this.ref} className="tick" style={{fontSize}}>
        <div data-repeat="true" aria-hidden="true">
          <span data-view="flip">Tick</span>
        </div>
      </div>
    );
  }
}
