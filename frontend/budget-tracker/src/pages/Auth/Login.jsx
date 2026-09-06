import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email,setEmail]  = useState("");
  const [password,setPassword] = useState("");
  const [error, setError] = useState(null);

  const {updateUser} = useContext(UserContext);

  const navigate = useNavigate();
  
  //controlador de la subida del form del login
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)){
      setError("Por favor introduzca un correo valido");
      return
    }

    if (!password) {
      setError("Por favor introduzca la contraseña");
      return
    }

    setError("");
    
    //llamado ala api del login
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
      email,
      password,
    });
    const {token, user} = response.data;

    if(token){
      localStorage.setItem("token",token);
      updateUser(user);
      navigate("/dashboard");
    }
    } catch (error) {
      if (error.response && error.response.data.message){
        setError(error.response.data.message);
      }
      else {
        setError("Something went wrong. Porfavor intentelo mas tarde.");
      }
    }

  }
  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Bienvenido</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Introduzca sus datos para acceder</p>
        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({target})=> setEmail(target.value)}
            label= "Email"
            placeholder = "johnexample@gmail.com"
            type="text"
          />
          <Input
            value={password}
            onChange={({target})=> setPassword(target.value)}
            label= "Contraseña"
            placeholder = "Min 8 caracteres"
            type="password"
          />
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            Ingresar
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            No tienes una cuenta?{" "}
            <Link className='font-medium text-primary underline' to="/signUp">
            Registrarse
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login