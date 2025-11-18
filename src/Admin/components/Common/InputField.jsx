export const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  readOnly = false,
  suffix = "",
  placeholder,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full p-3 border rounded-lg text-sm ${
          readOnly
            ? "bg-gray-50 text-gray-500"
            : "bg-white focus:ring-orange-500 focus:border-orange-500"
        }`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
          {suffix}
        </span>
      )}
    </div>
  </div>
);
