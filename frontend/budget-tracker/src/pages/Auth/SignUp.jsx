import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';

const SignUp = () => {
  const [profilePic,setProfilePic] = useState(null);
  const [fullName,setFullName]= useState("");
  const [email, setEmail]= useState("");
  const [password,setPassword]= useState("");

  const [error,setError]=useState(null);
  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  //controlador del registro
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if(!fullName) {
      setError("Por favor ingrese su nombre");
      return;
    }
    if(!validateEmail(email)){
        setError("Por favor introduzca un correo valido");
        return
      }
    if (!password){
      setError("Por favor ingrese su contraseña");
      return
    }
    setError("");

    //LLamado ala API para del registro
    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      const {token, user} = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    }
    catch (error){
      if (error.response && error.response.data.message) {
        setError(error.response.date.message);
      }
      else {
        setError("Something went wrong. Por favor intentelo mas tarde.")
      }
    }
  };
  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Crea una cuenta</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          No esperes mas y unete ala comunidad que sabe como administrar su dinero!!
        </p>

        <form onSubmit={handleSignUp}>

          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}/> 

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({target})=>{setFullName(target.value)}}
              label="Nombre(s)"
              placeholder="John"
              type = "text"
            />
            <Input
              value={email}
              onChange={({target})=>{setEmail(target.value)}}
              label="Email"
              placeholder="johnexample@gmail.com"
              type = "text"
            />
            <div className='col-span-2'>
              <Input
                value={password}
                onChange={({target})=> setPassword(target.value)}
                label= "Contraseña"
                placeholder = "Min 8 caracteres"
                type="password"
              />
            </div>
          </div>
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          <button type='submit' className='btn-primary'>
            Registrarse
          </button>
          
          <p className='text-[13px] text-slate-800 mt-3'>
            Ya tienes una cuenta?{" "}
            <Link className='font-medium text-primary underline' to="/login">
              Ingresar
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp