import React, {useState} from "react"

export default function TextForm(props) {
    const [text, setText] = useState('Enter the text here');

    const handleOnChange = (event) => {
        setText(event.target.value);
    }

    const handleToUpper = () => {
        let newText = text.toUpperCase();
        setText(newText)
    }
    const HandleOnClear = () => {
        setText('')
    }
    return (<div style={{
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
                    rows="5"
                />
            </div>
            <div className="container my-3">
                <button disabled={text.length === 0} onClick={handleToUpper} className="btn btn-primary mx-1">Convert to
                    Uppercase
                </button>
                <button disabled={text.length === 0} onClick={HandleOnClear} className="btn btn-primary mx-1">Clear
                </button>
            </div>
            <div className="container my-3">
                <h3> Your text summary</h3>
                <p> {text.split(" ").filter((element) => {
                    return element.length !== 0
                }).length} words and {text.length} characters</p>
            </div>
            <button className="btn btn-primary mx-1"
                    disabled={text.length === 0}
                    onClick={() => props.saveNotes(text)}>Save Note
            </button>


        </div>);
}