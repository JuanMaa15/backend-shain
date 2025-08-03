import z from 'zod';

const userSchema = {

  updateProfile: z.object({
    name: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío.'
    }),

    lastName: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío.'
    }),

    username: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío.'
    }),

    email: z.string({
      required_error: 'Este campo es obligatorio'
    }).nonempty({
      error: 'El campo no puede estar vacío'
    }).email({
      error: 'Email no valido'
    }),
    
  }),

  updateUser: z.object({
    name: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío.'
    }),

    lastName: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío.'
    }),

    username: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío.'
    }),

    email: z.string({
      required_error: 'Este campo es obligatorio'
    }).nonempty({
      error: 'El campo no puede estar vacío'
    }).email({
      error: 'Email no valido'
    }),

    role: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío.'
    })
    
  })



}

export default userSchema;