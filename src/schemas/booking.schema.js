import z from 'zod';

const bookingSchema = {

  create: z.object({

    date:z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío'
    }),

    timeSlot: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío'
    }),

    customerName: z.string({
      required_error: 'Este campo es obligatorio *'
    }).nonempty({
      error: 'El campo no puede estar vacío'
    }),

    
  })

}

export default bookingSchema;