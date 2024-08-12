import { EyeIcon, Loader2 } from 'lucide-react';
import { EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { useHookFormMask} from 'use-mask-input';
import { cepApi } from '../rotasApi/cepApi';
import { toast } from 'sonner';
import { FieldValues, useForm } from 'react-hook-form'
import { codanteApi } from '../rotasApi/codanteApi';
import { ErrorMessage } from '@hookform/error-message';

export default function Form() {

  const [isPassWrdVisible, setIsPassWordVisible] = useState(false);
  const [isPassWrdVisibleConfirm, setIsPassWordVisibleConfirm] = useState(false);
  const [isDisable , setIsDisable] = useState(true)

  const { handleSubmit, register, setError , setValue , formState: { isSubmitting, errors } } = useForm()

  const registerWithMask = useHookFormMask(register);


  function handleOnBlur(event: React.FocusEvent<HTMLInputElement>) {
    const cep = event.currentTarget.value;

    cepApi.get(`/${cep}`)
      .then((response) => {
        setIsDisable(false)
        setValue('city' , response.data.city )
        setValue('address' , response.data.street )

      })
      .catch(() => {
        toast.error("CEP inválido!")
      })

  }

  function onSubmit(data: FieldValues) {
    console.log('foi submitado')
    console.log(data)
    const dados = JSON.stringify(data);

    codanteApi.post(`/register`, dados , {
      headers : {'Content-Type' : 'aplication/json'}
    })
      .then((response) => {
        console.log(response)
      })
      .catch((erros)=>{
        for (const field in erros.response.data.errors){
          setError(field , {type : 'manual' , message : erros.response.data.errors[field] })
        }
      })

  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="name">Nome Completo</label>
        <input
          type="text"
          id="name"
          {...register('name', {
            required: 'O campo nome deve ser preenchido',
          })}
        />
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name='name' />
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          {...register('email', {
            required: "O campo email deve ser preenchido"
          })}
        />
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name='email' />
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="password">Senha</label>
        <div className="relative">
          <input
            type={isPassWrdVisible ? 'text' : 'password'}
            id="password"
            {...register('password', {
              required: "O campo senha deve ser preenchido",
              minLength : {
                value: 8,
                message : "A senha deve ter no mínimo 8 digítos"
              }
            })}
          />
          <span className="absolute right-3 top-3">
            <button type='button' onClick={() => setIsPassWordVisible(!isPassWrdVisible)}>
              {isPassWrdVisible ? (
                <EyeIcon
                  className="text-slate-600 cursor-pointer"
                  size={20}
                />
              ) : (
                <EyeOffIcon
                  className="text-slate-600 cursor-pointer"
                  size={20}
                />
              )}
            </button>
          </span>
        </div>
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name='password' />
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="confirm-password">Confirmar Senha</label>
        <div className="relative">
          <input
            type={isPassWrdVisibleConfirm ? 'text' : 'password'}
            id="password_confirmation"
            {...register('password_confirmation', {
              required: "O campo de confirmação de senha deve ser preenchido",
              minLength : {
                value: 8,
                message : "A senha deve ter no mínimo 8 digítos"
              },
              validate(value, formValues){
                if (value === formValues.password){
                  return true
                } 
                return" As senhas devem ser iguais"
              }
            })}
          />
          <span className="absolute right-3 top-3">
            <button type='button' onClick={() => setIsPassWordVisibleConfirm(!isPassWrdVisibleConfirm)}>
              {isPassWrdVisibleConfirm ? (
                <EyeIcon
                  className="text-slate-600 cursor-pointer"
                  size={20}
                />
              ) : (
                <EyeOffIcon
                  className="text-slate-600 cursor-pointer"
                  size={20}
                />
              )}
            </button>
          </span>
        </div>
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name='password_confirmation' />
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="phone" >Telefone Celular</label>
        <input
          type="text"
          id="phone"
          {...registerWithMask('phone', '(99) 99999-9999', {
            required: "O campo de telefone deve ser preenchido",
          })}
        />

        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name='phone' />
        </p>

      </div>

      <div className="mb-4">
        <label htmlFor="cpf">CPF</label>
        <input
          type="text"
          id="cpf"
          {...registerWithMask('cpf', '999.999.999-99', {
            required: "O campo do cpf deve ser preenchido",
          })}
        />
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name='cpf' />
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="cep">CEP</label>
        <input
          type="text"
          id="cep"
          {...registerWithMask('zipcode', '99999-999', {
            required: "O campo do cep deve ser preenchido",
            onBlur : handleOnBlur,
          })}
        />
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name='zipcode' />
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="address">Endereço</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="address"
          disabled={isDisable}
          {...register('address')}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="city">Cidade</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="city"
          disabled={isDisable}
          {...register('city')}
        />
      </div>

      <div className="mb-4">
        <input 
        type="checkbox" 
        id="terms" 
        className="mr-2 accent-slate-500" 
        {...register('terms' , {
          required : "Os termos precisam ser aceitos"
        })}
        />

        <label
          className="text-sm  font-light text-slate-500 mb-1 inline"
          htmlFor="terms"
        >
          Aceito os{' '}
          <span className="underline hover:text-slate-900 cursor-pointer">
            termos e condições
          </span>
        </label>

        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name='terms' />
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center bg-slate-500 font-semibold text-white w-full rounded-xl p-4 mt-10 hover:bg-slate-600 transition-colors disabled:bg-slate-400"
      >
        {isSubmitting ? (
          <Loader2 className='animate-spin' />
        ) : (
          'Cadastrar'
        )
        }
      </button>
    </form>
  );
}
