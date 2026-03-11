import z from 'zod';
import sanitizeHtml from 'sanitize-html';


export const safeString = () =>
  z.string({
    required_error: 'Este campo es obligatorio *'
  }).trim().nonempty({
    error: 'El campo no puede estar vacío'
  }).regex(/^[^'"]*$/, {
    error: 'No se permiten comillas'
  }).max(100, {
    error: "Máx. 100 caracteres"
  }).transform((s) =>
    s ? 
      sanitizeHtml(s, {
        allowedTags: [],       
        allowedAttributes: {}  
      }).trim()               
      : undefined              
  );

export const safeStringOptional = () =>
  z.string({
    required_error: 'Este campo es obligatorio *'
  }).trim().regex(/^[^'"]*$/, {
    error: 'No se permiten comillas'
  }).max(1000, {
    error: "Máx. 100 caracteres"
  }).transform((s) =>
    s ? 
      sanitizeHtml(s, {
        allowedTags: [],       
        allowedAttributes: {}  
      }).trim()               
      : undefined              
  );

export const safeText = () => 
  z.string({
    required_error: 'Este campo es obligatorio *'
  }).regex(/^[^'"]*$/, {
    error: 'No se permiten comillas'
  }).max(500, {
    error: "Máx. 500 caracteres"
  }).transform((s) =>
    s ? 
      sanitizeHtml(s, {
        allowedTags: [],       
        allowedAttributes: {}  
      }).trim()               
      : undefined              
  );

export const safePassword = () => 
  z.string({
    required_error: 'Este campo es obligatorio *'
  }).nonempty({
    error: 'El campo no puede estar vacío'
  }).regex(/^[^'"]*$/, {
    error: 'No se permiten comillas'
  }).max(100, {
    error: "Máx. 100 caracteres"
  }).transform((s) =>
    s ? 
      sanitizeHtml(s, {
        allowedTags: [],       
        allowedAttributes: {}  
      })             
      : undefined              
  );

export const safeEmail = () =>
  z.string()
    .email({
      error: 'Email inválido'
    })      
    .transform((s) =>
      sanitizeHtml(s, {                            
        allowedTags: [],
        allowedAttributes: {}
      }).trim()
    )                        
    .transform((s) => s.toLowerCase());  