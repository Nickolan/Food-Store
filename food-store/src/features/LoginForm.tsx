import { useForm } from '@tanstack/react-form'

const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'

const LoginForm = () => {

    const form = useForm({
        defaultValues: {email: "", password: ""},
        onSubmit: async ({value}) => alert(value)    
      })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit()}} className='flex flex-col gap-4'>
        <form.Field name='email'>
          {(f) => <input placeholder='Email' className={input} value={f.state.value} onChange={(e) => f.handleChange(e.target.value)}/>}
        </form.Field>

        <form.Field name='password'>
          {(f) => <input placeholder='Password' className={input} value={f.state.value} onChange={(e) => f.handleChange(e.target.value)}/>}
        </form.Field>

        <button type='submit' className='rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition'>
          Ingresar
        </button>
      </form>
  )
}

export default LoginForm
