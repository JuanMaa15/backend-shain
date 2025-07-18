import z from 'zod';

const movementSchema = {

  createAndUpdate: z.object({
    type: z.string({
      required_error: "Este campo es obligatorio *"
    }).nonempty({
      message: 'El campo no puede estar vacío'
    }),

    frecuencyType: z.string({
      required_error: "Este campo es obligatorio *"
    }).nonempty({
      message: 'El campo no puede estar vacío'
    }),

    value: z.string({
      required_error: "Este campo es obligatorio *"
    }).nonempty({
      message: 'El campo no puede estar vacío'
    }),

    description: z.string({
      required_error: "Este campo es obligatorio *"
    }).nonempty({
      message: 'El campo no puede estar vacío'
    }),

    date: z.string({
      required_error: "Este campo es obligatorio *"
    }).nonempty({
      message: 'El campo no puede estar vacío'
    })
  })

}

export default movementSchema;