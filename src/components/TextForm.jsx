import React, {useState} from "react"

export default function TextForm(props) {
    const [text, setText] = useState('Enter the text here');

    const handleOnChange =(event)=>{
        setText(event.target.value);
    }

    const handleToUpper =() =>
    {
        let newText= text.toUpperCase();
        setText(newText)
    }
    const HandleOnClear= () =>
    {
        setText('')
    }
    return (
        <div style={{
            color: props.mode === 'dark' ? 'white' : 'black'
        }}>
            <h3>{props.heading} </h3>

            <div className="mb-4">
                <textarea
                    style={{
                        backgroundColor: props.mode === 'dark' ? '#333' : 'white',
                        color: props.mode === 'dark' ? 'white' : 'black'
                    }}
                    className="form-control"
                    value={text}
                    onChange={handleOnChange}
                    rows="5"/>
        </div>
    <div className="container my-3">
        <button type="button" onClick={handleToUpper} className="btn btn-primary mx-1">Convert to Uppercase</button>
        <button type="submit" onClick={HandleOnClear} className="btn btn-primary mx-1">Clear</button>
    </div>
    <div className="container my-3">
        <h3> Your text summary</h3>
        <p> {text.split(" ").length-1} words and {text.length} characters</p>
    </div>


</div>
);
}