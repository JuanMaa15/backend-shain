import z from 'zod';

const authSchema = {

  register: z.object({
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
    
    role: z.string({
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

    password: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío.'
    }),

    confirmPassword: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío.'
    })
  }),

  login: z.object({
    username: z.string({
      required_error: "Este campo es obligatorio *"
    }).nonempty({
      error: 'El campo no puede estar vacío.'
    }),

    password: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío.'
    })
  }),

  requestPassword: z.object({
    email: z.string({
      required_error: 'Este campo es obligatorio'
    }).nonempty({
      error: 'El campo no puede estar vacío'
    }).email({
      error: 'Email no valido'
    }),
  }),

  resetPassword: z.object({
    token: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío.'
    }),
    password: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío.'
    }),
    confirmPassword: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío.'
    })
  })

}

export default authSchema;