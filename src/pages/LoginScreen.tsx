import LoginForm from '../features/LoginForm'

const LoginScreen = () => {
  return (
    <div className="min-h-screen w-full flex font-['Montserrat']">
      <div className="w-1/2 bg-[#F1FAEE] flex items-center justify-center">
        <LoginForm />
      </div>
      <div className="w-1/2">
        <img 
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80" 
          alt="Burger" 
          className="object-cover h-full w-full"
        />
      </div>
    </div>
  )
}

export default LoginScreen
