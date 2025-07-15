{!isAuthenticated && (
  <div className="flex items-center gap-4">
    <Link
      to="/login"
      className="text-sm md:text-base font-medium text-gray-700 hover:text-indigo-600"
    >
      Sign In
    </Link>
    <Link
      to="/register"
      className="text-sm md:text-base px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
    >
      Register
    </Link>
    <Link
      to="/instructor-login"
      className="text-sm md:text-base font-medium text-indigo-500 hover:text-indigo-700"
    >
      Instructor Login
    </Link>
  </div>
)} 