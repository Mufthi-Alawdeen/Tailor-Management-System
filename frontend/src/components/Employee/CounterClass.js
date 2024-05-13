import React from "react";

class CounterClass extends React.Component{
    constructor(){
        super();
        this.increment= this.increment.bind(this)
        this.state = {//state is a js object
            number: 0

        }
    }

    increment(){
        this.setState({
            number: this.state.number+1
        }) 
    }

    render(){
        return(
            <div>
                <h3>Classbased component</h3>
                <h1>Counter = {this.state.number}</h1>
                <button onClick={this.increment}>Add up</button>
            </div>
        )
    }
}
export default CounterClass;