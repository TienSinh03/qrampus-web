import React, { useState } from "react";
import { IdCard, Table2 } from "lucide-react";

const StudentStudySession = () => {
    const [view, setView] = useState("table"); // State to toggle between table and card view

    const students = [
        {
            id: 1,
            avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
            full_name: "Galen Slixby",
            email: "gslixby0@abc.net.au",
            role: "Editor",
            user_id: "123456",
            status: "Inactive",
        },
        {
            id: 2,
            avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
            full_name: "Halsey Redmore",
            email: "hredmore1@imgur.com",
            role: "Author",
            user_id: "125678",
            status: "Pending",
        },
        {
            id: 3,
            avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
            full_name: "Marjory Sicely",
            email: "msicely2@who.int",
            role: "Maintainer",
            user_id: "456321",
            status: "Active",
        },
        {
            id: 4,
            avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png",
            full_name: "Cyrill Risby",
            email: "crisby3@wordpress.com",
            role: "Maintainer",
            user_id: "456789",
            status: "Inactive",
        },
        {
            id: 5,
            avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
            full_name: "Maggy Hurran",
            email: "mhurran4@yahoo.co.jp",
            role: "Subscriber",
            user_id: "23456",
            status: "Pending",
        },
    ];

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
            {/* Button to toggle between Table and Card view */}
            <div className="mb-4">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                    {["table", "card"].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setView(type)}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-${type === "table" ? "l" : "r"}-lg border border-gray-300 transition-all duration-200 ${view === type ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 hover:bg-gray-600"}`}
                            aria-current={view === type ? "page" : undefined}
                        >
                            {type === "table" ? (
                                <>
                                    <Table2 className="inline-block w-4 h-4 mr-2" />
                                    Table View
                                </>
                            ) : (
                                <>
                                    <IdCard className="inline-block w-4 h-4 mr-2" />
                                    Card View
                                </>
                            )}
                        </button>
                    ))}
                </div>
            </div>


            {/* Conditionally render Table or Card view based on the 'view' state */}
            {view === "table" ? (
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b py-2 px-4">Avatar</th>
                            <th className="border-b py-2 px-4">#ID</th>
                            <th className="border-b py-2 px-4">Full Name</th>
                            <th className="border-b py-2 px-4">Email</th>
                            <th className="border-b py-2 px-4">Role</th>
                            <th className="border-b py-2 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4">
                                    <img
                                        src={student.avatar_url}
                                        alt={student.full_name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                </td>
                                <td className="py-2 px-4">{student.user_id}</td>
                                <td className="py-2 px-4">{student.full_name}</td>
                                <td className="py-2 px-4">{student.email}</td>
                                <td className="py-2 px-4">{student.role}</td>
                                <td
                                    className={`py-2 px-4 ${student.status === "Active" ? "text-green-600" : "text-red-600"}`}
                                >
                                    {student.status === "Active" ? "✔ Active" : "✖ Inactive"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.map((student) => (
                        <div key={student.id} className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center mb-4">
                                <img
                                    src={student.avatar_url}
                                    alt={student.full_name}
                                    className="w-16 h-16 rounded-full mr-4"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">{student.full_name}</h3>
                                    <p className="text-sm text-gray-500">{student.email}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <span className="font-semibold">#ID: </span>{student.user_id}
                            </div>

                            <div className="mb-4">
                                <span className="font-semibold">Role: </span>{student.role}
                            </div>

                            <div className="mb-4">
                                <span className="font-semibold">Status: </span>
                                <span className={student.status === "Active" ? "text-green-600" : "text-red-600"}>
                                    {student.status === "Active" ? "✔ Active" : "✖ Inactive"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentStudySession;
