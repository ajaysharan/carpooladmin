// src/pages/Users.jsx
export default function Table() {
  const authors = [
    {
      name: "John Michael",
      email: "john@creative-tim.com",
      role: "Manager",
      department: "Organization",
      status: "Online",
      employedDate: "23/04/18",
      image: "https://via.placeholder.com/36", // replace with actual path
    },
    {
      name: "Alexa Liras",
      email: "alexa@creative-tim.com",
      role: "Programator",
      department: "Developer",
      status: "Offline",
      employedDate: "11/01/19",
      image: "https://via.placeholder.com/36",
    },
    {
      name: "Laurent Perrier",
      email: "laurent@creative-tim.com",
      role: "Executive",
      department: "Projects",
      status: "Online",
      employedDate: "19/09/17",
      image: "https://via.placeholder.com/36",
    },
    {
      name: "Michael Levi",
      email: "michael@creative-tim.com",
      role: "Programator",
      department: "Developer",
      status: "Online",
      employedDate: "24/12/08",
      image: "https://via.placeholder.com/36",
    },
  ];
  return (
    <div className="flex flex-wrap -mx-3">
      <div className="flex-none w-full max-w-full px-3">
        <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="p-6 pb-0 mb-0 bg-white border-b-0 rounded-t-2xl border-b-transparent">
            <h6>Authors table</h6>
          </div>
          <div className="flex-auto px-0 pt-0 pb-2">
            <div className="p-0 overflow-x-auto">
              <table className="items-center w-full mb-0 align-top border-gray-200 text-slate-500">
                <thead className="align-bottom">
                  <tr>
                    <th className="px-6 py-3 font-bold text-left uppercase bg-transparent border-b border-gray-200 text-xxs text-slate-400 opacity-70">
                      Author
                    </th>
                    <th className="px-6 py-3 pl-2 font-bold text-left uppercase bg-transparent border-b border-gray-200 text-xxs text-slate-400 opacity-70">
                      Function
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-xxs text-slate-400 opacity-70">
                      Status
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase bg-transparent border-b border-gray-200 text-xxs text-slate-400 opacity-70">
                      Employed
                    </th>
                    <th className="px-6 py-3 font-semibold bg-transparent border-b border-gray-200 text-slate-400 opacity-70"></th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map((author, index) => (
                    <tr key={index}>
                      <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap">
                        <div className="flex px-2 py-1">
                          <div>
                            <img
                              src={author.image}
                              className="inline-flex items-center justify-center mr-4 h-9 w-9 rounded-xl"
                              alt={author.name}
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h6 className="mb-0 text-sm">{author.name}</h6>
                            <p className="mb-0 text-xs text-slate-400">
                              {author.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap">
                        <p className="mb-0 text-xs font-semibold">
                          {author.role}
                        </p>
                        <p className="mb-0 text-xs text-slate-400">
                          {author.department}
                        </p>
                      </td>
                      <td className="p-2 text-sm text-center align-middle bg-transparent border-b whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1.4 text-xs rounded-1.8 inline-block text-white font-bold uppercase leading-none ${
                            author.status === "Online"
                              ? "bg-gradient-to-tl from-green-600 to-lime-400"
                              : "bg-gradient-to-tl from-slate-600 to-slate-300"
                          }`}
                        >
                          {author.status}
                        </span>
                      </td>
                      <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap">
                        <span className="text-xs font-semibold text-slate-400">
                          {author.employedDate}
                        </span>
                      </td>
                      <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap">
                        <a
                          href="#"
                          className="text-xs font-semibold text-slate-400"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
