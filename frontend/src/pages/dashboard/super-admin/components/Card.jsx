function Card({ children }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {children}
    </div>
  );
}

export default Card;
