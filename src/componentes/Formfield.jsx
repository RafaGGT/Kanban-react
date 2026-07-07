export default function FormField({ id, label, type = "text", value, onChange, placeholder, error, autoComplete }) {
  return (
     <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
         autoComplete={autoComplete}
       
        className={`form-control ${error ? "is-invalid" : ""}`}
        required
      />
     {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}