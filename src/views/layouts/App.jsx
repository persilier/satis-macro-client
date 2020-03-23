import React, {useEffect, useState} from 'react';
import FormBuilder from "../../appLibraries/formBuilder/components/FormBuilder";
import {layoutFour} from "../../constants/formData";

function App() {
    const [formData, setFormData] = useState(undefined);
    const [loginForm, setLoginForm] = useState(undefined);
    useEffect(() => {
        setLoginForm(layoutFour)
    }, []);
    return (
        <div>
            {
                loginForm !== undefined ? (
                    <FormBuilder getFormData={(data) => setFormData(data)}/>
                ) : "Loading..."
            }
            <code className="mt-4" style={{lineHeight: '2px', textAlign: 'left', whiteSpace: 'pre', wordBreak: 'normal', wordWrap: 'normal', backgroundColor: '#f7f7f7', padding: '15px', margin: '10px', borderRadius: '5px'}}>
                {
                    JSON.stringify(formData)
                }
            </code>
        </div>
    );
}

export default App;
