import z from 'zod';

const businessSchema = {

  updateBusiness: z.object({
    name: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío'
    }),
  })

}

export default businessSchema