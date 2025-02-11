import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext'; // Importar el contexto del flux
import { useLocation, useParams } from 'react-router-dom'; // Importar para recibir estado de la navegación
import "./../../styles/ContactForm.css";

const ContactForm = () => {
  // const {hostId} = useParams();
  const { state } = useLocation(); // Obtener el estado pasado por navigate
  const { hostName = "John Doe", hostId = 1, location = "Monterrey" } = state || {};  // Valores por defecto si no se pasan desde la navegación
  const [contact, setContact] = useState({});
  const { actions } = useContext(Context); // Obtener las acciones del flux
  const [formData, setFormData] = useState({
    guest_name: '',
    email: '',
    phone: '',
    message: '',
    budget: '', // Mantener el presupuesto en blanco inicialmente
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Validación de los campos del formulario
  const validate = () => {
    let errors = {};
    if (!formData.guest_name) {
      errors.guest_name = 'Nombre es obligatorio';
    }
    if (!formData.email) {
      errors.email = 'Correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Correo no válido';
    }
    if (formData.phone && !/^\d+$/.test(formData.phone)) {
      errors.phone = 'El teléfono debe contener solo números';
    }
    if (formData.budget && !/^\d+(\.\d{1,2})?$/.test(formData.budget)) {
      errors.budget = 'El presupuesto debe ser un número válido';
    }
    return errors;
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      // Si no hay errores, llamamos a la acción contactHost del flux
      await actions.contactHost(
        formData.guest_name,
        formData.email,
        formData.phone,
        formData.message,
        formData.budget,
        hostId // Pasar el ID del host como parámetro
      );
      setSubmitted(true);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="contact-form-container">
      <h2>Contactar al Host</h2>
      {submitted ? (
        <div className="success-message">
          <p>Tu mensaje ha sido enviado al host {hostName}. Ellos se pondrán en contacto contigo pronto.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label>Host: {hostName}</label>
          </div>
          <div>
            <label>Ubicación: {location}</label>
          </div>

          <div>
            <label htmlFor="guest_name">Nombre Completo:</label>
            <input
              type="text"
              name="guest_name"
              value={formData.guest_name}
              onChange={handleChange}
              required
            />
            {errors.guest_name && <p className="error">{errors.guest_name}</p>}
          </div>

          <div>
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone">Número de Teléfono (Opcional):</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="message">Mensaje:</label>
            <textarea
              name="message"
              className="tArea"
              value={formData.message}
              onChange={handleChange}
              placeholder="Hola, estoy interesado en el espacio que ofreces..."
              rows="4"
              required
            />
          </div>

          <div>
            <label htmlFor="budget">Presupuesto (en dólares):</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Ingresa tu presupuesto"
              min="0"
              step="0.01" // Permitir valores decimales si es necesario
            />
            {errors.budget && <p className="error">{errors.budget}</p>}
          </div>

          <button type="submit">Contactar al Host</button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
