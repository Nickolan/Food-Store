import LoginForm from '../features/LoginForm'


const LoginScreen = () => {
    
  return (
    <div className='mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-lg'>
      <h2 className='mb-6 text-2xl font-bold text-gray-800'>Login Usuario</h2>
      <LoginForm/>
    </div>
  )
}

export default LoginScreen
