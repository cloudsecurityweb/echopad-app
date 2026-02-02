function Card({ children }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-5 lg:p-6 hover:shadow-lg transition-shadow">
      {children}
    </div>
  );
}

export default Card;
