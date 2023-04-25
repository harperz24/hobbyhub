import { supabase } from '../supabaseClient';
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';

function Login({ session }) {
  // const navigate = useNavigate();

  // if (session) {
  //   navigate(-1);
  // }

  return (
    <main className="auth">
      <Auth 
        supabaseClient={supabase} 
        appearance={{ theme: ThemeSupa }}
        providers={''}
      />
    </main>
  )
}

export default Login;