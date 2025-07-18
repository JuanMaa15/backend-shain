import z from 'zod';

const userSchema = {

  register: z.object({
    name: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      message: 'El campo no puede estar vacío.'
    }),
    
    lastName: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      message: 'El campo no puede estar vacío.'
    }),
    
    role: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      message: 'El campo no puede estar vacío.'
    }),

    username: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      message: 'El campo no puede estar vacío.'
    }),

    email: z.string({
      required_error: 'Este campo es obligatorio'
    }).nonempty({
      message: 'El campo no puede estar vacío'
    }).email({
      message: 'Email no valido'
    }),

    password: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      message: 'El campo no puede estar vacío.'
    }),

    confirmPassword: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      message: 'El campo no puede estar vacío.'
    })
  }),

  login: z.object({
    username: z.string({
      required_error: "Este campo es obligatorio *"
    }).nonempty({
      message: 'El campo no puede estar vacío.'
    }),

    password: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      message: 'El campo no puede estar vacío.'
    })
  })

}

export default userSchema;