import {getCsrfToken, signIn, getSession} from 'next-auth/react'
import Router from 'next/router';
import { useState } from 'react'

export default function SignIn({csrfToken}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const signinUser = async (e) => {
    e.preventDefault();
    let options = { redirect: false, email, password};
    const res = await signIn("credentials", options);
    setMessage(null);
    if (res?.error) {
      setMessage(res.error);
    }
    console.log(res);
    console.log(email, password);
    //return Router.push('/');
  }

  const singupUser = async (e) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    })
    let data = await res.json();
    if (data.message) {
      setMessage(data.message);
    }
    if (data.message == "success") {
      let options = { redirect: false, email, password }
      const res = await signIn("credentials", options);
      Router.push("/");
    }
  }

  return (
    <>
      {/* <form method="post" action="/api/auth/signin/email">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label>
          Email Address
          <input type="email" name="email" id="email" />
        </label>
        <button type="submit">Sign in</button>
      </form> */}
      <form>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label>
          Email Address
          <input type="email" name="email" id="email" valu={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" name="password" id="password" value={password} onChange={e => setPassword(e.target.value)}/>
        </label>
        <p style={{color: 'red'}}>{message}</p>
        <button onClick={(e) => signinUser(e)}>Sign in</button>
        <button onClick={(e) => singupUser(e)}>Sing up</button>
      </form>
    </>
  )
}