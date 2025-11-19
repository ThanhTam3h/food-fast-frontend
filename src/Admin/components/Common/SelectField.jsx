export const SelectField = ({ label, name, value, onChange, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border rounded-lg text-sm bg-white focus:ring-orange-500 focus:border-orange-500"
    >
      {children}
    </select>
  </div>
);
