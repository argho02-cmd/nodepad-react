import React from "react"

export default function TextForm(props) {

    const handleOnChange = (event) => {
        props.setText(event.target.value);
    }

    const handleToUpper = () => {
        let newText = props.text.toUpperCase();
        props.setText(newText)
    }
    const HandleOnClear = () => {
        props.setText('')
    }
    return (<div style={{
            color: props.mode === 'dark' ? 'white' : 'black'
        }}>
            <h3>{props.heading} </h3>

            <div className="mb-4">
                <textarea
                    style={{
                        backgroundColor: props.mode === 'dark' ? '#333' : 'white',
                        color: props.mode === 'dark' ? 'white' : 'black',
                    }}
                    className="form-control"
                    value={props.text}
                    onChange={handleOnChange}
                    rows="5"
                    placeholder="Write some notes"
                />
            </div>
            <div className="container my-3">
                <button disabled={props.text.length === 0} onClick={handleToUpper} className="btn btn-primary mx-1">Convert to
                    Uppercase
                </button>
                <button disabled={props.text.length === 0} onClick={HandleOnClear} className="btn btn-primary mx-1">Clear
                </button>
            </div>
            <div className="container my-3">
                <h3> Your text summary</h3>
                <p> {props.text.split(" ").filter((element) => {
                    return element.length !== 0
                }).length} words and {props.text.length} characters</p>
            </div>
            <button className="btn btn-primary mx-1"
                    disabled={props.text.length === 0}
                    onClick={() => props.saveNotes(props.text)}>Save Note
            </button>


        </div>);
}