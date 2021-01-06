import { useState } from "react";
import useRequest from '../hooks/use-request';
import Router from "next/router";


const SignPage = ({routeAPI, text}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {doRequest, errors} = useRequest({
        url:`/api/users/${routeAPI}`,
        method:'post',
        body: {email, password},
        onSuccess : () => Router.push('/')
    })

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            await doRequest();
        } catch (error) {
            
        }
        
        
        
    };

    return(
        <form onSubmit={onSubmit}>
            <h1>{text}</h1>

            <div className="form-group">
                <label>Email Address</label>
                <input 
                    value={email} 
                    onChange={e => setEmail(e.target.value) } 
                    type="email"
                    className="form-control" />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input 
                    value={password} 
                    onChange={e => setPassword(e.target.value) } 
                    type="password" className="form-control" />
            </div>

            
            {errors}
            
            <button className="btn btn-primary">{text}</button>
        </form>
    );
}

export default SignPage;