import React, {useEffect, useState} from 'react';
import { MultilineInput } from 'react-input-multiline';

export default function App() {
    const [inputValue, setInputValue] = useState('hi');

    useEffect(() => {
     console.log(inputValue);
    }, [inputValue]);


    return (
        <div>
            <div>Hi</div>
            <MultilineInput
                value={inputValue}
                id="someId"
                onChange={(e) => setInputValue(e.target.value)}
            />
            {/*<button className="bg-primary-400" onClick={() => console.log(inputValue)}>*/}
            {/*    Hi*/}
            {/*</button>*/}
        </div>
    );
}
