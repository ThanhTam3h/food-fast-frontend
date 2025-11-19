export const TextAreaField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows="3"
      className="w-full p-3 border rounded-lg text-sm bg-white focus:ring-orange-500 focus:border-orange-500"
      placeholder="Nhập nội dung..."
    />
  </div>
);
