import React,{useState} from "react";

function CounterFunction(){

    let [number, setNumber] = useState(0)

    return(
        <div>
            <h3>functional component</h3>
            <h1>Counter = {number}</h1>
            <button>Addin</button>
        </div>
    )
}

export default CounterFunction;
