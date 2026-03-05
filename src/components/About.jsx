import React from 'react';

export default function About(props) {
    return (
        <div className={`container text-${props.mode === 'light' ? 'dark' : 'light'}`}>
            <h2>About TextUtils</h2>
            <p>It is all about in this about page nothing new in the page.</p>
        </div>
    )
}