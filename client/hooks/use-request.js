import axios from 'axios';
import { useState } from 'react';

// Must be used inside a react component, not inside another function.

export default ({url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);
    // props => additional optional arguments for body
    const doRequest = async (props = {}) => {

        setErrors(null);

        try {
            const response = await axios[method](url,
            {...body, ...props} // merge objects
            );

            if(onSuccess) {
                onSuccess(response.data); // callback
            }

            return response.data;
        } catch (err) {
            console.log(err)
            setErrors(
                <div className="alert alert-danger">
                    <h4>Oops !</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map(error => <li key={error.message}>{error.message}</li> )}
                    </ul>
                </div>
            );

            throw err;
        }
    };

    return { doRequest, errors };

};