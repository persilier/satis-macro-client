import React from 'react';
import FormBuilder from "../../modules/SAT20-137/views/components/FormBuilder";

function App() {
    return (
        <div>
            <FormBuilder getFormData={(data) => console.log(data)}/>
        </div>
    );
}

export default App;
